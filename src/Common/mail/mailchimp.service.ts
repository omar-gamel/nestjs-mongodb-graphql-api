import { Injectable } from '@nestjs/common';
import * as mailchimp from '@mailchimp/mailchimp_marketing';

@Injectable()
export class MailChimpService {
  constructor() {
    mailchimp.setConfig({
      apiKey: process.env.MAIL_CHIMP_API_KEY,
      server: process.env.MAIL_CHIMP_SERVER_PREFIX
    });
  }

  public async addUserToMailChimp(user) {
    const [FNAME, LNAME] = user.username.split(' ');
    const response = await mailchimp.lists.addListMember(process.env.MAIL_CHIMP_LIST_ID, {
      email_address: user.email,
      status: process.env.MAIL_CHIMP_USER_STATUS,
      language: 'Arabic',
      merge_fields: {
        FNAME,
        LNAME,
        PHONE: user.phone
      },
      tags: [user.role]
    });
    user.mailChimpId = response.id;
    await user.save();
  }

  public async updateUserInMailChimp(user) {
    if (!user.mailChimpId) return;
    const [FNAME, LNAME] = user.username.split(' ');
    const updatedMailChimpUser = await mailchimp.lists.updateListMember(
      process.env.MAIL_CHIMP_LIST_ID,
      user.mailChimpId,
      {
        email_address: user.email,
        status: process.env.MAIL_CHIMP_USER_STATUS,
        language: 'Arabic',
        merge_fields: {
          FNAME,
          LNAME,
          PHONE: user.phone
        }
      }
    );
    user.mailChimpId = updatedMailChimpUser.id;
    await user.save();
  }

  public async addOrRemoveCourseTagsInMailChimp({ order, status }) {
    // await order.populate('user', 'mailChimpId role').execPopulate();
    // const user = order.user;
    // if (!user.mailChimpId) return;
    // if (user.role !== 'STUDENT') return;
    // const tags = [];
    // for (let item of order.items) {
    //   if (item.type == 'Course') {
    //     let course = await db.Course.findById(item.model, 'slug');
    //     if (course.slug.length > 100) {
    //       // mailchimp limitation on tags name
    //       course.slug = course.slug.substring(0, 99);
    //     }
    //     tags.push({ name: course.slug, status });
    //   }
    //   if (item.type == 'Path') {
    //     const path = await db.Path.findById(item.model, '_id name slug courses');
    //     for (let course of path.courses) {
    //       course = await db.Course.findById(course, '_id name slug');
    //       if (course.slug.length > 100) {
    //         // mailchimp limitation on tags name
    //         course.slug = course.slug.substring(0, 99);
    //       }
    //       tags.push({ name: course.slug, status });
    //     }
    //   }
    // }
    // await mailchimp.lists.updateListMemberTags(process.env.MAIL_CHIMP_LIST_ID, user.mailChimpId, {
    //   body: {
    //     tags
    //   }
    // });
  }

  public async deleteUserInMailChimp(user) {
    await mailchimp.lists.deleteListMember(process.env.MAIL_CHIMP_LIST_ID, user.mailChimpId);
  }
}
