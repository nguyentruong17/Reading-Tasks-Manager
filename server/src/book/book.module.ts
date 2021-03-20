import { HttpModule, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './book.model';

import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

//import { ObjectIDScalar } from 'src/graphql/scalars/ObjectIDScalar';

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
    BookResolver,
    BookService,
    // ObjectIDScalar,
  ],
  exports: [MongooseModule, BookService],
})
export class BookModule {}
