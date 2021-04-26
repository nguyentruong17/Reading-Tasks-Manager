import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

//modules
import { BookModule } from './book/book.module';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = `mongodb://${configService.get(
          'MONGO_DB_DEV_USER',
        )}:${configService.get('MONGO_DB_DEV_PWD')}@${configService.get(
          'MONGO_NAME',
        )}/${configService.get('MONGO_DB_DEV_NAME')}`;
        return {
          uri,
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      sortSchema: true,
      playground: true,
      debug: false,
      cors: {
        origin: 'http://localhost:4200',
        credentials: true,
      },
    }),

    BookModule,
    UserModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
