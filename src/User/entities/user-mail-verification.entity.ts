import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true
})
@ObjectType()
export class UserMailVerification {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  email: string;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  verificationToken: string;
}

export const UserMailVerificationSchema = SchemaFactory.createForClass(UserMailVerification);
