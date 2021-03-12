import { Module } from '@nestjs/common';
import { TypegooseModule } from "nestjs-typegoose";
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb://admin:password@mongodb:27017", {
      useNewUrlParser: true,
    }),
    TypeGraphQLModule.forRoot({
      emitSchemaFile: true,
      validate: false,
    }),
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
