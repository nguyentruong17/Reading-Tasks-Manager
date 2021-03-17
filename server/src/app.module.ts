import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

//modules
import { BookModule } from './book/book.module';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forRoot("mongodb://admin:password@mongodb:27017", {
      useNewUrlParser: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
      playground: true,
      debug: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }), 
    BookModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
