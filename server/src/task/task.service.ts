import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//models + inputs + dtos
import { CreateTaskInput } from './task.inputs';
import { BaseTask, Task, TaskDocument } from './task.model';
import { User } from 'src/user/user.model';
import { BaseBook, Book } from 'src/book/book.model';
import { TaskStatus } from './task-status.enum';

//services
import { BookService } from 'src/book/book.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly _taskModel: Model<TaskDocument>,

    @Inject(forwardRef(() => BookService))
    private readonly _bookService: BookService,
  ) {}
  async createTask(user: User, input: CreateTaskInput): Promise<Task> {
    try {
      const bookId = input.bookId ? input.bookId : '';
      const openLibraryBookId = input.openLibraryBookId ? input.openLibraryBookId.trim() : '';

      if (!bookId && !openLibraryBookId) {
        throw new BadRequestException(
          `Either field 'bookId' or 'openLibraryBookId' must be provided!`,
        );
      }

      let book: Book;
      if (bookId) {
        book = await this._bookService.addExistingBook(user, bookId);
      }

      if (openLibraryBookId) {
        book = await this._bookService.addBook(user, openLibraryBookId);
      }

      const newTask = {
        title: input.title,
        description: input.description,
        status: TaskStatus.OPEN,
        history: [],
        owner: user._id,
        attachItem: {
          openLibraryId: book.openLibraryId,
          title: book.title,
          authors: book.authors,
          subjects: book.subjects,
          covers: book.covers,
        } as BaseBook,
      } as Task;

      const createdTask = new this._taskModel(newTask);
      return await createdTask.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
