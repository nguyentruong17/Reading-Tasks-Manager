import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Schema } from 'mongoose';

//models + inputs + dtos
import { BaseBook, Book, BookDocument } from './book.model';
import { CreateBookInput, SearchBookInput } from './book.inputs';
import * as OpenLibInterfaces from './book-openlib.interface';
import { User } from 'src/user/user.model';

const WORKS_API_URL = 'https://openlibrary.org/works/';

const AUTHORS_API_URL = 'https://openlibrary.org/authors/';

const SEARCH_API_URL = 'http://openlibrary.org/search.json?';

const COVERS_API_URL = 'http://covers.openlibrary.org/b/';
const COVERS_API_SIZES = ['S', 'M', 'L'];
const COVERS_API_IMG_EXTN = '.jpg';

@Injectable()
export class BookService {
  private _currentSearchInput: SearchBookInput;
  private _currentSearchInputBooks: BaseBook[];

  constructor(
    @InjectModel(Book.name) private readonly _bookModel: Model<BookDocument>,
    private readonly _httpService: HttpService,
  ) {
    this._currentSearchInput = new SearchBookInput('', '', '');
    this._currentSearchInputBooks = [];
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
      throw new ServiceUnavailableException(
        'Cannot connect to OpenLibrary. Please check your internet connection.',
      );
    }
  }

  async searchOpenLibraryBooks(
    searchInput: SearchBookInput,
    offset = 0,
    limit = 5,
  ): Promise<BaseBook[]> {
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
        console.log(b);
        const book = {
          openLibraryId: b.key.split('/')[2],
          title: b.title,
          authors: b.author_name ? b.author_name : [],
          subjects: b.subject ? b.subject : [],
          covers: b.cover_i
            ? COVERS_API_SIZES.map(
                (size) =>
                  `${COVERS_API_URL}id/${b.cover_i}-${size}${COVERS_API_IMG_EXTN}`,
              )
            : [],
        } as BaseBook;
        return book;
      });

      //memoization for paging search
      if (this._currentSearchInput != searchInput) {
        this._currentSearchInput = searchInput;
        this._currentSearchInputBooks = books;
      } else {
        this._currentSearchInputBooks.concat(books);
      }

      if (this._currentSearchInputBooks.length > 50) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      return books;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getBooks(skip = 0, limit = 50): Promise<Book[]> {
    try {
      return await this._bookModel.find().skip(skip).limit(limit).exec();
    } catch (e) {
      throw new Error(e);
    }
  }

  //this method is for creating a book.
  //the method does not check if a book has created or not.
  async createBook(
    user: User,
    createBookInput: CreateBookInput,
  ): Promise<Book> {
    const openLibraryId = createBookInput.openLibraryBookId;
    const userId = user._id;

    try {
      const b = await this._getOpenLibraryBook(openLibraryId);

      //console.log(b)

      let authors: string[] = [];
      if (b.contributors) {
        authors = b.contributors.map((c) => {
          if (c.role.toLowerCase() == 'author') {
            return c.name;
          }
        });
      } else if (b.authors) {
        authors = await Promise.all(
          b.authors.map(async (obj) => {
            let authorId: string;
            if (obj.author) {
              authorId = obj.author.key.split('/')[2];
            } else if (obj.key) {
              authors = obj.key.split('/')[2];
            } else {
              console.log(b.authors);
            }

            let authorName: string;
            if (authorId) {
              const authorResult = await this._getOpenLibraryAuthor(authorId);
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
            return authorName;
          }),
        );
      }
      const newBook = {
        openLibraryId: b.key.split('/')[2],
        title: b.title,
        subjects: b.subjects ? b.subjects : [],
        covers: b.covers ? b.covers : [],
        authors,
        timesAdded: 1, //initalizing
        owners: [userId], //initalizing
      } as Book;
      const createdBook = new this._bookModel(newBook);
      return await createdBook.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addBook(user: User, openLibraryBookId: string): Promise<Book> {
    const userId = user._id;
    try {
      const found = await this._bookModel.findOneAndUpdate(
        { openLibraryBookId },
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
        const input = { openLibraryBookId };
        return await this.createBook(user, input);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async addExistingBook(
    user: User,
    bookId: Schema.Types.ObjectId,
  ): Promise<Book> {
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
      //console.log('In Catch:', e);
      throw new InternalServerErrorException(e);
    }
  }
}
