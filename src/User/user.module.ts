import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { NotificationModule } from '../notification/notification.module';
import { SocialAccount, SocialAccountSchema } from './entities/social-account.entity';
import { SocialAccountUrl, SocialAccountUrlSchema } from './entities/social-account-url.entity';
import {
  UserMailVerification,
  UserMailVerificationSchema
} from './entities/user-mail-verification.entity';
import { MailModule } from '../common/mail/mail.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    MailModule,
    NotificationModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SocialAccount.name, schema: SocialAccountSchema },
      { name: SocialAccountUrl.name, schema: SocialAccountUrlSchema },
      { name: UserMailVerification.name, schema: UserMailVerificationSchema }
    ])
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
