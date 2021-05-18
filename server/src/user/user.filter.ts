import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { BaseBookMongo } from 'src/book/book.model';
import { Filterable } from 'src/graphql/relay/connection.args';
import { TaskPriority } from 'src/task/task-priority.enum';
import { TaskStatus } from 'src/task/task-status.enum';
import { UserTask } from './user.model';

@InputType()
export class UserTaskAttachItemFilter {
  @Field({ nullable: true })
  openLibraryBookId?: string;

  @Field({ nullable: true })
  title?: string;
}

@InputType()
export class UserTaskFilter implements Filterable<UserTask> {
  @Field((types) => GraphQLISODateTime, { nullable: true })
  from?: Date;
  @Field((types) => GraphQLISODateTime, { nullable: true })
  to?: Date;

  @Field({ nullable: true })
  title: string;

  @Field((types) => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field((types) => TaskPriority, { nullable: true })
  priority?: TaskPriority;

  @Field((types) => UserTaskAttachItemFilter, { nullable: true })
  attachItem?: UserTaskAttachItemFilter;

  isMatch(userTask: UserTask): boolean {
    let match = true;
    if (this.from) {
      match = new ObjectId(userTask._id).getTimestamp().getDate() >= this.from.getDate();
      if (!match) {
        return false;
      }
    }

    if (this.to) {
      match = this.to.getDate() >= new ObjectId(userTask._id).getTimestamp().getDate();
      if (!match) {
        return false;
      }
    }

    if (this.title) {
      match = userTask.title.includes(this.title.trim());
      if (!match) {
        return false;
      }
    }

    if (this.status) {
      match = this.status === userTask.status;
      if (!match) {
        return false;
      }
    }

    if (this.priority) {
      match = this.priority === userTask.priority;
      if (!match) {
        return false;
      }
    }

    if (this.attachItem) {
      if (this.attachItem.title) {
        match = userTask.attachItem.title.includes(
          this.attachItem.title.trim(),
        );
        if (!match) {
          return false;
        }
      }

      if (this.attachItem.openLibraryBookId) {
        match =
          userTask.attachItem.openLibraryId ===
          this.attachItem.openLibraryBookId.trim();
        if (!match) {
          return false;
        }
      }
    }

    return match;
  }
}

@InputType()
export class UserBookFilter implements Filterable<BaseBookMongo> {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  author: string;

  isMatch(book: BaseBookMongo): boolean {
    let match = true;
    // if (this.id) {
    //   match = new ObjectId(book._id).equals(this.id);
    //   if (!match) {
    //     return false;
    //   }
    // }

    // if (this.openLibraryBookId) {
    //   match = book.openLibraryId === this.openLibraryBookId.trim();
    //   if (!match) {
    //     return false;
    //   }
    // }

    if (this.title) {
      match = book.title.includes(this.title.trim());
      if (!match) {
        return false;
      }
    }

    if (this.author) {
      match = book.authors.includes(this.author.trim());
      if (!match) {
        return false;
      }
    }

    return match;
  }
}
