import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { FileTypeEnum } from '../entities/file.entity';

@InputType()
export class FilesBoardInput {
  @IsNotEmpty()
  @Field(type => FileTypeEnum)
  fileType: FileTypeEnum;
}
