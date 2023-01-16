import { Resolver, ResolveField, Mutation, Args, Query, Parent, Context } from '@nestjs/graphql';
import { RegisterUserInput } from './dto/register.input';
import { UserService } from './user.service';
import { UserResonseType } from './types/user.response';
import { User } from './entities/user.entity';
import { CreateUserBoardInput } from './dto/create-user-board.input';
import { RegisterAsInstructorInput } from './dto/register-as-instructor.input';
import { SocialLoginOrRegisterInput } from './dto/social-login-or-register.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //** --------------------- MUTATIONS --------------------- */

  @Mutation(returns => UserResonseType)
  async register(@Args('input') input: RegisterUserInput) {
    return await this.userService.register(input);
  }

  @Mutation(returns => UserResonseType)
  async createUserBoard(@Args('input') input: CreateUserBoardInput) {
    return await this.userService.createUser(input);
  }

  @Mutation(returns => UserResonseType)
  async registerAsInstructor(@Args('input') input: RegisterAsInstructorInput) {
    return await this.userService.registerAsInstructor(input);
  }

  @Mutation(returns => UserResonseType)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const args = { email, password };
    return await this.userService.login(args);
  }

  @Mutation(returns => UserResonseType)
  async socialLoginOrRegister(@Args('input') input: SocialLoginOrRegisterInput) {
    return await this.userService.socialLoginOrRegister(input);
  }

  @Mutation(returns => UserResonseType)
  async verifyUser(@Args('token') token: string, @Args('email') email: string) {
    const args = { token, email };
    return await this.userService.verifyUser(args);
  }
}
