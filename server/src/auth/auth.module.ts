import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
import { JwtStrategy } from './jwt.strategy';

import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      //imports:[ConfigModule], //the ConfigModule is global
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret123'
      }),
      inject: [ConfigService]
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
  providers: [AuthResolver, AuthService, GoogleStrategy, JwtStrategy, UserService],
  exports: [AuthService, PassportModule, GoogleStrategy],
})
export class AuthModule { }
