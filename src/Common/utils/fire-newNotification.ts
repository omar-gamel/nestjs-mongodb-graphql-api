import { Model } from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Notification, NotificationTypeEnum } from 'src/notification/entities/notification.entity';

export async function fireNewNotification(
  payload,
  pubsub,
  email = true,
  saveNotification = true,
  userModel: Model<User>,
  notificationModel: Model<Notification>
) {
  if (saveNotification) {
    if (!payload.from) {
      payload.from = await userModel.findOne({ role: 'ADMIN' }).sort('createdAt');
    }
    const notification = await notificationModel.create({
      ...payload,
      message: payload.subject,
      type: NotificationTypeEnum.FRIEND_REQUEST
    });
    if (pubsub) {
      await pubsub.publish('NEW_NOTIFICATION', {
        newNotification: notification
      });
    }

    const userIds = Array.isArray(payload.to) ? payload.to.map(u => u.user) : [payload.to.user];
    const users = await userModel.find({ _id: userIds });
    const userEmails = users.map(u => u.email);
  }
}
