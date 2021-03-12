import { Injectable } from '@nestjs/common';

import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { Book } from './book.model';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book) private readonly bookModel: ReturnModelType<typeof Book>,
  ) {}

  async getBooks(): Promise<Book[] | null> {
    let result: Book[];
    try {
      result = await this.bookModel.find().exec();
    } catch (e) {
      throw new Error(e);
    }
    return result;
  }

  async addBook(book: Book): Promise<Book> {
    /**
     *const addedBook = new this.bookModel(book); // typeof addedBook is DocumentType<Book>
     *const result = await addedBook.save() // typeof result is Document, not Book as expected!
     *the product object in @param fn type is also Document
     */
    const addedBook = new this.bookModel(book);
    let result: Book;
    try {
      const d = await addedBook.save();
      result = {
        _id: d["_id"],
        openLibId: d["openLibId"],
        title: d["title"],
        authors: d["authors"]
      } as Book
    } catch(e) {
      console.log(e)
    }

    return result;
  }
}
