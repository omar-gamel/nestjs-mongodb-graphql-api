import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { PlatFormNameEnum } from '../entities/social-account-url.entity';

@InputType()
export class SocialAccountsUrlsInput {
  @IsNotEmpty()
  @Field(type => PlatFormNameEnum)
  platFormName: PlatFormNameEnum;

  @IsNotEmpty()
  @IsString()
  @Field()
  url: string;
}
