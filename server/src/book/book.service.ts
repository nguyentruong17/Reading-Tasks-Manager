import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

//models + inputs + dtos
import { BaseBook, Book, BookDocument } from './book.model';
import { CreateBookInput, SearchBookInput } from './book.inputs';
import * as OpenLibInterfaces from './book-openlib.interface';
import { BaseUserMongo } from 'src/user/user.model';
import { BookFilter } from './book.filter';

import {
  DEFAULT_ONLINE_BOOKS_PER_QUERY,
  MAX_ONLINE_BOOKS_PER_QUERY,
  MAX_BOOKS_PER_QUERY,
  MAX_DIFFERENT_COVERS,
  MAX_SUBJECTS_PER_BOOK,
} from 'src/consts/defaults';
import {
  AUTHORS_API_URL,
  WORKS_API_URL,
  SEARCH_API_URL,
  COVERS_API_SIZES,
  COVERS_API_URL,
  COVERS_API_IMG_EXTN,
} from 'src/consts/openLibrary';

@Injectable()
export class BookService {
  // private _currentSearchInput: SearchBookInput;
  // private _currentSearchInputBooks: BaseBook[];

  constructor(
    @InjectModel(Book.name) private readonly _bookModel: Model<BookDocument>,
    private readonly _httpService: HttpService,
  ) {
    // this._currentSearchInput = new SearchBookInput('', '', '');
    // this._currentSearchInputBooks = [];
  }

  private async _getOpenLibraryAuthor(
    openLibraryAuthorId: string,
  ): Promise<OpenLibInterfaces.IAuthorAuthors> {
    try {
      const fullUrl = AUTHORS_API_URL + openLibraryAuthorId + '.json';
      const result = await this._httpService.get(fullUrl).toPromise();
      const author = result.data as OpenLibInterfaces.IAuthorAuthors;
      return author;
    } catch (e) {
      console.log(e);
      throw new ServiceUnavailableException(
        'Cannot connect to OpenLibrary. Please check your internet connection.',
      );
    }
  }

  private async _getOpenLibraryBook(
    openLibraryId: string,
  ): Promise<OpenLibInterfaces.IBookWorks> {
    try {
      const fullUrl = WORKS_API_URL + openLibraryId + '.json';
      const result = await this._httpService.get(fullUrl).toPromise();
      const book = result.data as OpenLibInterfaces.IBookWorks;
      return book;
    } catch (e) {
      console.log(e);
      if (e.response.status === 404) {
        throw new BadRequestException(
          `Not found any book with id ${openLibraryId} on OpenLibrary.`,
        );
      }

      throw new ServiceUnavailableException(
        'Cannot connect to OpenLibrary. Please check your internet connection.',
      );
    }
  }

  async searchOpenLibraryBooks(
    searchInput: SearchBookInput,
    offset = 0,
    limit = DEFAULT_ONLINE_BOOKS_PER_QUERY,
  ): Promise<BaseBook[]> {
    if (limit > MAX_ONLINE_BOOKS_PER_QUERY) {
      limit = MAX_ONLINE_BOOKS_PER_QUERY;
    }
    const { title, author, subject } = searchInput;
    try {
      const result = await this._httpService
        .get(SEARCH_API_URL, {
          params: {
            title,
            author,
            subject,
            limit,
            offset,
          },
        })
        .toPromise();

      const searchResult = result.data as OpenLibInterfaces.IBookSearchResult;
      const searchedBooks = searchResult.docs;

      const books = searchedBooks.map((b) => {
        //console.log(b);
        const book = {
          openLibraryId: b.key.split('/')[2],
          title: b.title,
          authors: b.author_name ? b.author_name : [],
          subjects: b.subject ? b.subject.slice(0, MAX_SUBJECTS_PER_BOOK) : [],
          covers: b.cover_i
            ? [
                COVERS_API_SIZES.map(
                  (size) =>
                    `${COVERS_API_URL}id/${b.cover_i}-${size}${COVERS_API_IMG_EXTN}`,
                ),
              ]
            : [],
        } as BaseBook;
        return book;
      });

      //memoization for paging search
      // if (this._currentSearchInput != searchInput) {
      //   this._currentSearchInput = searchInput;
      //   this._currentSearchInputBooks = books;
      // } else {
      //   this._currentSearchInputBooks.concat(books);
      // }

      // if (this._currentSearchInputBooks.length > 50) {
      //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      // }

      return books;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getBooksRelay(
    limit: number,
    offset: number,
    filter: BookFilter | undefined,
  ): Promise<[Book[], number]> {
    const queries = !!filter ? filter.createQueries() : {};
    if (limit > MAX_BOOKS_PER_QUERY) {
      limit = MAX_BOOKS_PER_QUERY;
    }
    try {
      //aggregate way -- tested, but have to cast type
      // const result = await this._bookModel.aggregate([
      //   {
      //     $match: queries,
      //   },
      //   {
      //     $facet: {
      //       data: [
      //         {
      //           $skip: offset,
      //         },
      //         {
      //           $limit: limit,
      //         },
      //       ],
      //       queryTotal: [
      //         {
      //           $count: 'count',
      //         },
      //       ],
      //     },
      //   },
      // ]);
      // console.log(result[0]); // {data: [], queryTotal: [{count}]}
      // const books = result[0].data as Book[]
      // const count = result[0].queryTotal.length > 0 ? result[0].queryTotal[0].count : 0;
      // return [books, count as number]

      //non-aggregate way
      const length = await this._bookModel.countDocuments(queries);
      const books = await this._bookModel
        .find(queries)
        .skip(offset)
        .limit(limit);
      return [books, length];
    } catch (e) {
      throw new Error(e);
    }
  }

  async getBook(bookId: ObjectId): Promise<Book> {
    try {
      const found = await this._bookModel.findById(bookId);
      if (found) {
        return found;
      } else {
        throw new NotFoundException(`Book with ObjectId ${bookId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  //this method is for creating a book.
  //the method does not check if a book has created or not.
  private async _createBook(
    user: BaseUserMongo,
    createBookInput: CreateBookInput,
  ): Promise<Book> {
    const openLibraryId = createBookInput.openLibraryBookId;
    const userId = user._id;

    try {
      const b = await this._getOpenLibraryBook(openLibraryId);
      //console.log('BookService, _createBook, b: ', b)
      let authors: string[] = [];
      if (b.contributors) {
        b.contributors.forEach((c) => {
          if (c.role.toLowerCase() === 'author') {
            if (c.name) {
              authors.push(c.name);
            }
          }
        });
      }
      //console.log('BookService, _createBook, authors: ', authors)
      if (authors.length === 0 && b.authors) {
        await Promise.all(
          b.authors.map(async (obj) => {
            let authorId: string;
            //console.log('BookService, _createBook, b.authors: ', obj)
            if (obj.author) {
              authorId = obj.author.key.split('/')[2];
            } else if (obj.key) {
              authorId = obj.key.split('/')[2];
            } else {
              console.log(b.authors);
            }

            let authorName: string;
            if (authorId) {
              const authorResult = await this._getOpenLibraryAuthor(authorId);
              //console.log('BookService, _createBook, authorResult: ', authorResult)
              if (authorResult.name) {
                authorName = authorResult.name;
              } else if (authorResult.fuller_name) {
                authorName = authorResult.fuller_name;
              } else if (authorResult.personal_name) {
                authorName = authorResult.personal_name;
              } else {
                console.log(authorResult);
              }
            }
            if (authorName) {
              authors.push(authorName);
            }
          }),
        );
      }
      if (authors.length === 0) {
        authors.push('Unknown');
      }
      let covers = [];
      if (b.covers) {
        covers = b.covers.slice(0, MAX_DIFFERENT_COVERS);
        covers = covers.map((c) => {
          return COVERS_API_SIZES.map(
            (size) => `${COVERS_API_URL}id/${c}-${size}${COVERS_API_IMG_EXTN}`,
          );
        });
      }
      const createdBook = new this._bookModel({
        openLibraryId: b.key.split('/')[2],
        title: b.title,
        subjects: b.subjects ? b.subjects.slice(0, MAX_SUBJECTS_PER_BOOK) : [],
        covers,
        authors,
        timesAdded: 1, //initalizing
        owners: [userId], //initalizing
      });
      return await createdBook.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addBook(user: BaseUserMongo, openLibraryBookId: string): Promise<Book> {
    const userId = user._id;
    try {
      const found = await this._bookModel.findOneAndUpdate(
        { openLibraryId: openLibraryBookId },
        {
          $inc: { timesAdded: 1 },
          $addToSet: { owners: userId },
        },
        {
          new: true,
          upsert: false,
        },
      );

      if (found) {
        return found;
      } else {
        console.log('Not found');
        const input = { openLibraryBookId };
        return await this._createBook(user, input);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async addExistingBook(user: BaseUserMongo, bookId: ObjectId): Promise<Book> {
    const userId = user._id;
    try {
      const found = await this._bookModel.findByIdAndUpdate(
        bookId,
        {
          $inc: { timesAdded: 1 },
          $addToSet: { owners: userId },
        },
        {
          new: true,
        },
      );

      if (found) {
        return found;
      } else {
        throw new NotFoundException(`Book with ObjectId ${bookId} not found.`);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
