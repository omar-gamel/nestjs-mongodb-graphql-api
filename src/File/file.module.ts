import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { File, FileSchema } from './entities/file.entity';
import { FileResolver } from './file.resolver';
import { FileController } from './file.controller';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { FileTransformer } from './file.transformer';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  providers: [FileService, FileResolver, FileTransformer],
  controllers: [FileController],
  exports: [FileService, FileTransformer]
})
export class FileModule {}
