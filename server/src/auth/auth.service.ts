import { ServiceUnavailableException, Injectable, InternalServerErrorException } from '@nestjs/common';

//express + passport + jwt
import { authenticate } from 'passport';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { } from 'passport-jwt';

//mongoose
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//models + inputs + dtos
import { BaseUser, User, UserDocument } from 'src/user/user.model';
import { JwtPayload } from './jwt-payload.interface';

//services
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
  ) {}

  //https://github.com/DavyBello/graphql-social-auth-tutorial
  private _authenticateWithGoogle(req: Request, res: Response) {
    return new Promise<{
      data: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        accessToken: string;
      };
      info: any;
    }>((resolve, reject) => {
      authenticate(
        'google-token',
        {
          session: false,
          scope: ['email', 'profile'],
        },
        (err, data, info) => {
          if (err) reject(err);
          resolve({ data, info }); //data will contain what fields specifying in validate method of google strategy file
        },
      )(req, res);
    });
  }

  async authenticate(
    accessToken: string,
    req: Request,
    res: Response,
  ): Promise<string> {
    req.body = {
      ...req.body,
      access_token: accessToken,
    };

    try {
      const { data, info } = await this._authenticateWithGoogle(req, res);

      if (data) {
        let user: any = await this._userModel.findOne({ gmail: data.email });

        if (!user) {
          user = await this._userService.createUser({
            googleId: data.id,
            gmail: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
          } as BaseUser);
                   
        } else {
          //console.log('Found user!')
        }

        user.accessToken = data.accessToken;

        console.log(user)

        const payload: JwtPayload = {
          user,
        }

        const jwtToken = await this._jwtService.sign(payload);

        return jwtToken;

        //return true;
      }

      if (info) {
        console.log(info);
        switch (info.code) {
          case 'ETIMEDOUT':
            throw new ServiceUnavailableException(
              'Failed to reach Google: Try Again',
            );
          default:
            throw new Error(info);
        }
      }
      throw new InternalServerErrorException();
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}
