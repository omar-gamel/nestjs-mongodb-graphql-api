import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { registerEnumType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { RecipientSchema, Recipient } from './recipient.entity';

export enum NotificationTypeEnum {
  'NEW_COURSE_SUBMITTED',
  'COURSE_ACCEPTED',
  'COURSE_REJECTED',
  'COURSE_UPDATED',
  'INSTRUCTOR_NEW_COURSE',
  'OFFLINE_ORDER_SUBMITTED',
  'ORDER_REJECTED',
  'PURCHASE',
  'REVIEW_REPORTED',
  'REFUND',
  'NEW_CERTIFICATE',
  'COURSE_INSTRUCTOR_CONTACT_FINISHED',
  'PURCHASE_STUDENT_FAILED',
  'PURCHASE_STUDENT_SUCCESS',
  'NEW_REVIEW',
  'USER_REPORTED',
  'DISCOUNT',
  'WITHDRAW_REQUEST',
  'WITHDRAW_REQUEST_ACCEPTED',
  'WITHDRAW_REQUEST_REJECTED',
  'FRIEND_REQUEST',
  'ACCEPT_FRIEND_REQUEST',
  'PUBLIC',
  'NEW_DISCUSSION_ANSWER',
  'NEW_DISCUSSION_COMMENT',
  'NEW_DISCUSSION_COMMENT_REPLY',
  'FOLLOW_UN_FOLLOW_DISCUSSION',
  'INSTRUCTOR_NEW_DISCUSSION',
  'NEW_QUESTION_LECTURE',
  'NEW_QUESTION_ANSWER_LECTURE',
  'NEW_QUESTION_ANSWER_REPLY_LECTURE',
  'ADMIN_ADDED_USER_COURSE',
  'ADMIN_ADDED_USER_PATH'
}
registerEnumType(NotificationTypeEnum, { name: 'NotificationTypeEnum' });

@Schema()
@ObjectType()
export class Notification {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    required: true
  })
  @Field()
  message: string;

  @Prop({ type: [RecipientSchema], required: true })
  @Field(type => [Recipient])
  to: Recipient[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  })
  @Field(type => User)
  from: User;

  @Prop([
    {
      name: { type: String },
      slug: { type: String }
    }
  ])
  @Field()
  models: string;

  @Prop({ name: String, id: String })
  @Field()
  query: string;

  @Prop({
    type: Boolean,
    default: false
  })
  @Field()
  route: string;

  @Prop({
    type: String,
    enum: NotificationTypeEnum,
    required: true
  })
  @Field(type => NotificationTypeEnum)
  type: NotificationTypeEnum;

  @Prop()
  @Field({ nullable: true })
  clickAction?: string;

  @Prop()
  @Field({ nullable: true })
  publicType?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
