import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from 'src/task/task.module';
import { BookModule } from 'src/book/book.module';

import { User, UserSchema } from './user.model';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [{ name: User.name, schema: UserSchema }],
      },
    ]),
    BookModule,
    TaskModule,
  ],
  providers: [UserResolver, UserService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
