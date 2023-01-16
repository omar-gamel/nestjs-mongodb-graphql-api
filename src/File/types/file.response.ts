import { Field, ObjectType } from '@nestjs/graphql';
import { File } from '../entities/file.entity';

@ObjectType()
export class FileResonseType {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(type => File, { nullable: true })
  file?: File;
}

@ObjectType()
export class FilesResonseType {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field(type => [File], { nullable: true })
  files: File[];
}
