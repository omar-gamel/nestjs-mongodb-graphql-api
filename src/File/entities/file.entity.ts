import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export enum FileTypeEnum {
  NORMAL = 'NORMAL',
  INSTRUCTION = 'INSTRUCTION',
  CERTIFICATE = 'CERTIFICATE',
  INSTRUCTOR_REQUEST = 'INSTRUCTOR_REQUEST',
  COURSE_REQUEST = 'COURSE_REQUEST'
}
registerEnumType(FileTypeEnum, { name: 'FileTypeEnum' });

@Schema({ timestamps: true })
@ObjectType()
export class File {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  name: string;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  path: string;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  mimetype: string;

  @Prop({
    type: Number,
    required: true
  })
  @Field()
  size: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  })
  @Field()
  user: User;

  @Prop({
    type: Number,
    default: 0,
    min: 0
  })
  @Field()
  downloads: number;

  @Prop({
    type: String,
    default: 'NORMAL',
    enum: ['NORMAL', 'INSTRUCTION', 'CERTIFICATE', 'INSTRUCTOR_REQUEST', 'COURSE_REQUEST']
  })
  @Field(type => FileTypeEnum)
  fileType: FileTypeEnum;

  @Prop({
    type: String
  })
  @Field({ nullable: true })
  title?: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
