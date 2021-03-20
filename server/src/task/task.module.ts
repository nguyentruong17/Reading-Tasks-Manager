import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from 'src/book/book.module';

import { ObjectIdScalar } from 'src/graphql/scalars/ObjectIdScalar';

import { Task, TaskSchema } from './task.model';
import { TaskService } from './task.service';
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
  ],
  providers: [ObjectIdScalar, TaskResolver, TaskService],
  exports: [MongooseModule, TaskService]
})
export class TaskModule {}
