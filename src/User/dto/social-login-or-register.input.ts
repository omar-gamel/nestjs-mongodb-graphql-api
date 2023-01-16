import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProviderNameEnum } from '../entities/social-account.entity';

@InputType()
export class SocialLoginOrRegisterInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  providerId: string;

  @IsOptional()
  @Field(type => ProviderNameEnum, { nullable: true })
  providerName?: ProviderNameEnum;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  avatar?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  username?: string;
}
