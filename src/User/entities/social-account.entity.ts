import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { registerEnumType } from '@nestjs/graphql';

export enum ProviderNameEnum {
  FACEBOOK = 'FACEBOOK',
  GMAIL = 'GMAIL',
  TWITTER = 'TWITTER'
}
registerEnumType(ProviderNameEnum, { name: 'ProviderNameEnum' });

@Schema({
  timestamps: true
})
@ObjectType()
export class SocialAccount {
  @Field(() => String)
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  providerId: string;

  @Prop({
    type: String,
    required: true,
    enum: ['FACEBOOK', 'GMAIL', 'TWITTER']
  })
  @Field(type => ProviderNameEnum)
  providerName: ProviderNameEnum;
}

export const SocialAccountSchema = SchemaFactory.createForClass(SocialAccount);
