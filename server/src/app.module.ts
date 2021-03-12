import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { join } from 'path';

import { BookModule } from './book/book.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://admin:password@mongodb:27017", {
      useNewUrlParser: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      debug: false,
    }),
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
