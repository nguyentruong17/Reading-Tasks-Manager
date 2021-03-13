import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';

//models + inputs + dtos
import { AddedBook, Book, AddedBookDocument } from './book.model';
import { SearchBookInput } from './book.inputs';
import { IBookOpenLib, IBookSearchResultOpenLib } from './book-openlib-interface';

const SEARCH_API_URL = 'http://openlibrary.org/search.json?';
const COVERS_API_URL = 'http://covers.openlibrary.org/b/';
const COVERS_API_SIZES = ['S', 'M', 'L'];
const COVERS_API_IMG_EXTN = '.jpg'

@Injectable()
export class BookService {
  private _currentSearchInput: SearchBookInput;
  private _currentSearchInputBooks: Book[];

  constructor(
    @InjectModel(AddedBook.name) private readonly _addedBookModel: Model<AddedBookDocument>,
    private readonly _httpService: HttpService,
  ) {
    this._currentSearchInput = new SearchBookInput('', '', '');
    this._currentSearchInputBooks = [];
  }

  async searchOnlineBooks(searchInput: SearchBookInput, offset = 0, limit = 5): Promise<Book[]> {
    const { title, author, subject } = searchInput
    try { 
      const result = await this._httpService.get(SEARCH_API_URL, {
        params: {
          title, 
          author,
          subject,
          limit,
          offset
        }
      }).toPromise();


      const searchResult = result.data as IBookSearchResultOpenLib;
      const searchedBooks = searchResult.docs;

      const books = searchedBooks.map(b => {
        console.log(b)
        const book = {
          openLibId: b.key.split('/')[2],
          title: b.title,
          authors: b.author_name ? b.author_name : [],
          subjects: b.subject ? b.subject : [],
          firstPublishYear: b.first_publish_year ? b.first_publish_year : -1,
          covers: b.cover_i ?
            COVERS_API_SIZES.map(size =>  `${COVERS_API_URL}id/${b.cover_i}-${size}${COVERS_API_IMG_EXTN}`)
            : []
        } as Book
        return book
      })

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

      return books
    } catch(e) {
      throw new Error(e);
    }
    
  }

  async getBooks(skip = 0, limit = 50): Promise<AddedBook[]> {
    try {
      return await this._addedBookModel.find()
                      .skip(skip)
                      .limit(limit)
                      .exec();
    } catch (e) {
      throw new Error(e);
    }
  }

  async addBook(input: Book): Promise<AddedBook> {

    try {
      const openLibId = input.openLibId;
      const found = await this._addedBookModel.findOne({openLibId})

      if (found) {
        found.timesAdded += 1;
        return await found.save()
      
      } else {
        const newBook = {
          ...input,
          firstAppearDate: new Date().toISOString(),
          timesAdded: 1,
        } as Book

        console.log(newBook)

        const addedBook = new this._addedBookModel(newBook);
        return await addedBook.save()
      }

    } catch (e) {
      throw new Error(e);
    }
  }
}
