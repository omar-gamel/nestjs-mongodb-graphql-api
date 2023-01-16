import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { comparePasswords, socialRegisterValidation } from '../common/utils/helper';
import { Notification } from '../notification/entities/notification.entity';
import { generateAuthToken } from '../common/utils/generate-auth-token';
import { MailChimpService } from '../common/mail/mailchimp.service';
import { fireNewNotification } from '../common/utils/fire-newNotification';
import { RegisterUserInput } from './dto/register.input';
import { CreateUserBoardInput } from './dto/create-user-board.input';
import { RegisterAsInstructorInput } from './dto/register-as-instructor.input';
import { UserMailVerification } from './entities/user-mail-verification.entity';
import { SocialLoginOrRegisterInput } from './dto/social-login-or-register.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(UserMailVerification.name)
    private userMailVerificationModel: Model<UserMailVerification>,
    private readonly mailChimpService: MailChimpService
  ) {}

  public async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  public async register(input: RegisterUserInput) {
    if (input.phone) {
      const otherUser = await this.userModel.findOne({
        $or: [{ email: input.email }, { phone: input.phone }]
      });
      if (otherUser && otherUser.email === input.email) {
        return { code: 400, message: 'email Already Exist', success: false };
      }
      if (otherUser && otherUser.phone === input.phone) {
        return { code: 400, message: 'phone Already Exist', success: false };
      }
    } else {
      const otherUser = await this.userModel.findOne({ email: input.email });
      if (otherUser) {
        return { code: 400, message: 'email Already Exist', success: false };
      }
    }
    const user = await this.userModel.create({ ...input });
    const token = generateAuthToken(user);
    const payload = {
      subject: 'مرحبا بك فى كلية التعليم',
      emailConfiguration: {
        template: 'welcome',
        user: {
          username: user.username
        }
      },
      to: { user: user.id }
    };
    await fireNewNotification(payload, null, false, true, this.userModel, this.notificationModel);
    await this.mailChimpService.addUserToMailChimp(user);
    return {
      code: 201,
      message: 'User created successfully',
      success: true,
      token,
      user
    };
  }

  async createUser(input: CreateUserBoardInput) {
    input.isVerified = true;
    if (['ADMIN', 'INSTRUCTOR'].includes(input.role)) {
      if (!input.phone) return { code: 400, message: 'Phone is required', success: false };
      if (!input.avatar) return { code: 400, message: 'Avatar is required', success: false };
      if (input.role === 'INSTRUCTOR' && !input.bio) {
        return { code: 400, message: 'Bio is required', success: false };
      }
      if (input.role === 'INSTRUCTOR' && !input.appearOnMainPage) input.appearOnMainPage = false;
    }
    // check email and phone
    if (input.phone) {
      const otherUser = await this.userModel.findOne({
        $or: [{ email: input.email }, { phone: input.phone }]
      });
      if (otherUser && otherUser.email === input.email) {
        return { code: 400, message: 'email Already Exist', success: false };
      }
      if (otherUser && otherUser.phone === input.phone) {
        return { code: 400, message: 'phone Already Exist', success: false };
      }
    } else {
      // check only email
      const otherUser = await this.userModel.findOne({ email: input.email });
      if (otherUser) {
        return { code: 400, message: 'email Already Exist', success: false };
      }
    }
    const user = await this.userModel.create({ ...input });
    return {
      code: 201,
      message: 'User created successfully',
      success: true,
      user
    };
  }

  public async registerAsInstructor(input: RegisterAsInstructorInput) {
    input.isVerified = true;
    input.isStillInstructorRequest = true;
    let user = await this.userModel.findOne({ email: input.email });
    if (user) {
      return {
        code: 400,
        message: 'email Already Exist',
        success: false
      };
    }
    if (input.cvId) {
      // const file = await this.fileModel.findById(input.cvId);
      // if (!file) {
      //   return {
      //     code: 400,
      //     message: 'file not found',
      //     success: false
      //   };
      // }
      input.cv = input.cvId;
    }
    user = await this.userModel.create({ ...input });
    const token = generateAuthToken(user);

    await this.mailChimpService.addUserToMailChimp(user);
    return {
      code: 201,
      message: 'Instructor created successfully',
      success: true,
      token,
      user
    };
  }

  public async login(args: { email: string; password: string }) {
    const user = await this.userModel.findOne({ email: args.email, isActive: true });
    if (!user || !user.password) {
      return { code: 400, message: 'البريد اﻹلكترونى أو كلمه المرور خطأ', success: false };
    }
    const isMatch = await comparePasswords(args.password, user.password);
    if (!isMatch) {
      return { code: 400, message: 'البريد اﻹلكترونى أو كلمه المرور خطأ', success: false };
    }
    const token = generateAuthToken(user);
    return { code: 200, message: 'User logged in successfully', success: true, token, user };
  }

  public async socialLoginOrRegister(input: SocialLoginOrRegisterInput) {
    let user = await this.userModel.findOne({ 'socialAccounts.providerId': input.providerId });

    if (!user) {
      const validDate = socialRegisterValidation(input);
      if (!validDate) {
        return { code: 400, message: 'You have to enter required data', success: false };
      }
      const { providerId, providerName, ...data } = input;
      const userData = {
        ...data,
        isVerified: true,
        socialAccounts: [{ providerId, providerName }]
      };
      user = await this.userModel.findOne({ email: input.email });
      if (!user) {
        user = await this.userModel.create({ ...userData });

        await this.mailChimpService.addUserToMailChimp(user);
      } else {
        user.socialAccounts.push({ providerId, providerName });
        await user.save();
      }
    } else if (!user.isActive) {
      return { code: 400, message: 'you can not login with this account', success: false };
    }

    if (user.avatar == '/default/avatar.png') {
      user.avatar = input.avatar;

      await user.save();
    }

    const token = generateAuthToken(user);
    return { code: 201, message: 'User logged in successfully', success: true, token, user };
  }

  public async verifyUser(args) {
    const userMailVerification = await this.userMailVerificationModel.findOne({
      email: args.email
    });
    if (!userMailVerification || !userMailVerification.verificationToken) {
      return { code: 400, message: 'User can not be verified', success: false };
    }
    if (args.token !== userMailVerification.verificationToken) {
      return { code: 400, message: 'User can not be verified', success: false };
    }
    const user = await this.userModel.findOneAndUpdate(
      { email: userMailVerification.email },
      { isVerified: true },
      { new: true }
    );
    const token = generateAuthToken(user);
    userMailVerification.verificationToken = null;
    await userMailVerification.save();

    await this.mailChimpService.updateUserInMailChimp(user);
    return {
      code: 200,
      message: 'User created successfully',
      success: true,
      token,
      user
    };
  }
}
