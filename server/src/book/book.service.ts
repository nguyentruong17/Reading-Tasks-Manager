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
      throw new Error(e)
    }
    return result
  }

  async addBook(book: Book): Promise<Book> {
    const addedBook = new this.bookModel(book);
    let result;
    try {
      const w = await addedBook.save() // this only return 'Document' type, not 'Book' type as expected!
    } catch (e) {
      throw new Error(e)
    }
    return result
  }
}
