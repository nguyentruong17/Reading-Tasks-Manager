import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from 'src/book/book.module';
import { UserModule } from 'src/user/user.module';

import { Task, TaskSchema } from './task.model';
import { TaskService } from './task.service';
import { BookService } from 'src/book/book.service';
import { UserService } from 'src/user/user.service';
import { TaskResolver } from './task.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
        discriminators: [{ name: Task.name, schema: TaskSchema }],
      },
    ]),
    HttpModule,
    BookModule,
    UserModule
  ],
  providers: [TaskResolver, TaskService, BookService, UserService],
  exports: [MongooseModule]
})
export class TaskModule {}
