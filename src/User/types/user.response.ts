import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserResonseType {
  @Field()
  code: number;

  @Field()
  message: string;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  user: User;
}
