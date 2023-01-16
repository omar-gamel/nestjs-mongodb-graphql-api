import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserGenderEnum } from '../entities/user.entity';
import { SocialAccountsUrlsInput } from './social-account-Url.input';

@InputType()
export class RegisterAsInstructorInput {
  isVerified: boolean;

  isStillInstructorRequest: boolean;

  cv: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsOptional()
  @Field({ nullable: true })
  phone?: string;

  @IsOptional()
  @Field({ nullable: true })
  avatar?: string;

  @IsOptional()
  @Field({ nullable: true })
  bio?: string;

  @IsOptional()
  @Field({ nullable: true })
  country?: string;

  @IsOptional()
  @Field({ nullable: true })
  appearOnMainPage?: boolean;

  @IsOptional()
  @Field(type => Int, { nullable: true })
  experienceYears?: number;

  @IsOptional()
  @Field(type => Int, { nullable: true })
  rankOnMainPage?: number;

  @IsOptional()
  @Field({ nullable: true })
  cvId?: string;

  @IsNotEmpty()
  @Field()
  categoryName: string;

  @IsOptional()
  @Field(type => Int, { nullable: true })
  workPageUrl?: string;

  @Field(type => UserGenderEnum, { defaultValue: UserGenderEnum.MALE })
  gender: UserGenderEnum;

  @IsNotEmpty()
  @Field(type => [SocialAccountsUrlsInput])
  socialAccountsUrls: SocialAccountsUrlsInput[];
}
