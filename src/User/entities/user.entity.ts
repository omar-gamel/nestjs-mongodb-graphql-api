import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as shortId from 'shortid';
import * as bcrypt from 'bcryptjs';
import { randomString } from 'src/common/utils/random-string';
import { SocialAccountSchema, SocialAccount } from './social-account.entity';
import { registerEnumType } from '@nestjs/graphql';
import { SocialAccountUrl, SocialAccountUrlSchema } from './social-account-url.entity';

export enum UserGenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}
registerEnumType(UserGenderEnum, { name: 'UserGenderEnum' });
export enum UserRoleEnum {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT'
}
registerEnumType(UserRoleEnum, { name: 'UserRoleEnum' });

@Schema({
  timestamps: true
})
@ObjectType()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String
  })
  @Field({ nullable: true })
  mailChimpId?: string;

  @Prop()
  @Field()
  username: string;

  @Prop({ unique: true })
  @Field()
  email: string;

  @Prop()
  @Field()
  country: string;

  @Prop()
  @Field()
  phone: string;

  @Prop()
  @Field()
  password: string;

  @Prop({ default: '/default/avatar.png' })
  @Field()
  avatar: string;

  @Prop({ default: '/default/avatar.png' })
  @Field()
  socialAvatar: string;

  // signature for instructor
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  })
  @Field()
  signature: string;

  @Prop()
  @Field()
  bio: string;

  @Prop()
  @Field()
  slug: string;

  @Prop({
    default: 'MALE',
    type: String,
    enum: UserGenderEnum
  })
  @Field(type => UserGenderEnum)
  gender: UserGenderEnum;

  @Prop({
    default: 'STUDENT',
    type: String,
    enum: UserRoleEnum
  })
  @Field(type => UserRoleEnum)
  role: UserRoleEnum;

  @Prop({ type: Boolean, default: false })
  @Field()
  isStillInstructorRequest: boolean;

  @Prop({ type: [SocialAccountSchema], default: [] })
  @Field(type => [SocialAccount])
  socialAccounts: SocialAccount[];

  @Prop({
    type: Boolean,
    default: true
  })
  @Field()
  isVerified: boolean;

  @Prop({
    type: Boolean,
    default: true
  })
  @Field()
  isActive: boolean;

  @Prop({
    type: Boolean,
    default: false
  })
  @Field()
  appearOnMainPage: boolean;

  @Prop({
    type: Number
  })
  @Field()
  rankOnMainPage: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  })
  @Field()
  friends: User;

  // for instructors
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  })
  @Field()
  followers: User;

  @Prop({ type: [SocialAccountUrlSchema] })
  @Field(type => [SocialAccountUrl])
  socialAccountsUrls: SocialAccountUrl[];

  // for instructor website url
  @Prop({
    type: String
  })
  @Field()
  workPageUrl: string;

  // which category instructor work for
  @Prop({
    type: String
  })
  @Field()
  categoryName: string;

  // instructor experience
  @Prop({
    type: Number,
    default: 0
  })
  @Field()
  ExperienceYears: number;

  // instructor cv
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  })
  @Field({ nullable: true })
  cv: string;

  // instructor badges
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'File'
  })
  @Field()
  badges: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('username')) {
    this.slug = `${this.username.split(' ').join('-')}-${shortId.generate()}`;
  }
  const conditions = this.isNew ? { slug: this.slug } : { slug: this.slug, _id: { $ne: this._id } };
  this.slug = `${this.slug}-${randomString(2)}`;
  next();
});

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 12);
  }
  return next();
});
