import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { registerEnumType } from '@nestjs/graphql';

export enum PlatFormNameEnum {
  GMAIL = 'GMAIL',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  INSTAGRAM = 'INSTAGRAM'
}
registerEnumType(PlatFormNameEnum, { name: 'PlatFormNameEnum' });

@Schema({
  timestamps: true
})
@ObjectType()
export class SocialAccountUrl {
  @Field(() => String)
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: ['FACEBOOK', 'GMAIL', 'TWITTER', 'LINKEDIN', 'INSTAGRAM']
  })
  @Field(type => PlatFormNameEnum)
  platFormName: PlatFormNameEnum;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  url: string;
}

export const SocialAccountUrlSchema = SchemaFactory.createForClass(SocialAccountUrl);
