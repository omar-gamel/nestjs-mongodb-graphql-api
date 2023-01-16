import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum, UserGenderEnum } from '../entities/user.entity';
import { SocialAccountsUrlsInput } from './social-account-Url.input';

@InputType()
export class CreateUserBoardInput {
  isVerified: boolean;

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
  @Field({ nullable: true })
  rankOnMainPage?: number;

  @IsNotEmpty()
  @Field()
  isActive: boolean;

  @IsNotEmpty()
  @Field(type => UserRoleEnum)
  role: UserRoleEnum;

  @Field(type => UserGenderEnum, { defaultValue: UserGenderEnum.MALE })
  gender: UserGenderEnum;

  @IsNotEmpty()
  @Field(type => [SocialAccountsUrlsInput])
  socialAccountsUrls: SocialAccountsUrlsInput[];
}
