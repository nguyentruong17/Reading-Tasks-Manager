import { Injectable } from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';

import { Book, BookDocument } from './book.model';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
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
    const addedBook = new this.bookModel(book);
    let result: Book;
    try {
      result = await addedBook.save();
    } catch (e) {
      throw new Error(e);
    }
    return result;
  }
}
