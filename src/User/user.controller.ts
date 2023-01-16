import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { VERIFY_USER } from 'src/Common/graphql-requests/emailVerification';
@Controller()
export class UserController {
  @Get('/')
  async emailVerification(@Query() query, @Res() res) {
    try {
      const { verificationToken, email } = query;
      if (!verificationToken || !email) return res.redirect('/');

      const {
        data: { data, errors }
      } = await axios({
        url: `http://127.0.0.1:${process.env.API_PORT}/graphql`,
        method: 'POST',
        data: {
          query: VERIFY_USER,
          variables: {
            email,
            token: verificationToken
          }
        }
      });
      if (errors) return res.redirect(`${process.env.FRONTEND_URL}`);

      if (!data.response.success) return res.redirect(`${process.env.FRONTEND_URL}`);

      return res.redirect(`${process.env.FRONTEND_URL}/email-verified`);
    } catch (error) {
      return res.redirect(`${process.env.FRONTEND_URL}`);
    }
  }
}
