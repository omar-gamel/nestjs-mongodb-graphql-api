import { Module, Global } from '@nestjs/common';
import { NodeMailerService } from './nodemailer.service';
import { MailChimpService } from './mailchimp.service';

@Global()
@Module({
  providers: [  MailChimpService, NodeMailerService],
  exports:  [MailChimpService, NodeMailerService]
})
export class MailModule {}
