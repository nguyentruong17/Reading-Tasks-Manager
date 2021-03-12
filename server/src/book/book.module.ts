import { Module } from '@nestjs/common';

//typegoose
import { TypegooseModule } from 'nestjs-typegoose';
import { Book } from './book.model';

//typegraphql
import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

@Module({
  imports: [TypegooseModule.forFeature([Book])],
  providers: [BookResolver, BookService]
})
export class BookModule {}
