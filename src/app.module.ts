import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { FileModule } from './file/file.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    FileModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      include: [UserModule, FileModule, NotificationModule],
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
    DatabaseModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
