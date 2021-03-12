import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.model';

//typegraphql
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])],
  providers: [BookResolver, BookService]
})
export class BookModule {}
