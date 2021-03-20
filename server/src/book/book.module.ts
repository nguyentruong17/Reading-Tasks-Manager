import { HttpModule, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.model';

import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

import { ObjectIdScalar } from 'src/graphql/scalars/ObjectIdScalar';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
        discriminators: [{ name: Book.name, schema: BookSchema }],
      },
    ]),
    HttpModule,
  ],
  providers: [
    ObjectIdScalar,
    BookResolver,
    BookService,
  ],
  exports: [MongooseModule, BookService],
})
export class BookModule {}
