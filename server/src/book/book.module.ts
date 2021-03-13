import { HttpModule, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AddedBook, AddedBookSchema } from './book.model';

//typegraphql
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AddedBook.name,
        schema: AddedBookSchema,
        discriminators: [
          { name: AddedBook.name, schema: AddedBookSchema }
        ],
      },
    ]),
    HttpModule,
  ],
  providers: [BookResolver, BookService],
})
export class BookModule {}
