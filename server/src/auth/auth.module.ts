import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

//express + passport + jwt
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

//mongoose
import { MongooseModule } from '@nestjs/mongoose'; //mongoose

//models + inputs + dtos
import { User, UserSchema } from 'src/user/user.model';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      //imports:[ConfigModule], //the ConfigModule is global
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secret123',
        signOptions: {
          expiresIn: 3600 * 24 * 3, //3 days
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, GoogleStrategy, JwtStrategy],
  exports: [PassportModule, PassportModule],
})
export class AuthModule {}
