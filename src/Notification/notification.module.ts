import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { Recipient, RecipientSchema } from './entities/recipient.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Recipient.name, schema: RecipientSchema }
    ])
  ],
  controllers: [],
  providers: [NotificationService],
  exports: [
    NotificationService,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Recipient.name, schema: RecipientSchema }
    ])
  ]
})
export class NotificationModule {}
