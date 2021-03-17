import { Module } from '@nestjs/common';

//express + passport + jwt
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


//mongoose
import { MongooseModule } from '@nestjs/mongoose';//mongoose

//models + inputs + dtos
import { User, UserSchema } from 'src/user/user.model';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { GoogleStrategy } from './google.strategy';

import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'seCRet',
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [AuthResolver, AuthService, GoogleStrategy, UserService],
  exports: [AuthService, PassportModule, GoogleStrategy],
})
export class AuthModule { }
