import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema()
@ObjectType()
export class Recipient {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  })
  @Field(type => User)
  user: User;

  @Prop({
    type: Boolean,
    default: false
  })
  @Field()
  isSeen: string;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);
