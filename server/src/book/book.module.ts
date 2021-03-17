import { HttpModule, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.model';

//typegraphql
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
        discriminators: [
          { name: Book.name, schema: BookSchema }
        ],
      },
    ]),
    HttpModule,
  ],
  providers: [BookResolver, BookService],
})
export class BookModule {}
