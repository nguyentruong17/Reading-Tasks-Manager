import { Injectable, BadRequestException } from '@nestjs/common';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';

//models + inputs + dtos
import { BaseUser, User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
  ) {}

  async createUser(input: BaseUser): Promise<User> {
    try {
      const email = input.gmail;
      const found = await this._userModel.findOne({ gmail: email });
      
      if (found) {
        throw new BadRequestException(
          `User with email ${email} already existed`,
        );
      } else {
        const newUser = {
          ...input,
          firstAppearDate: new Date().toISOString(),
          tasks: 0,
          books: 0,
        } as User;

        console.log(newUser);
        const createdUser = new this._userModel(newUser);
        return await createdUser.save();
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
