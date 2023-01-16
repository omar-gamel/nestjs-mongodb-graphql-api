import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { compile } from 'handlebars';
import * as mjml2html from 'mjml';
const nodemailer = require('nodemailer');

const facebookLink = '';
const youtubeLink = '';
const twitterLink = '';
const instagramLink = '';
const linkedinLink = '';

@Injectable()
export class NodeMailerService {
  private from: any;
  private transporter: any;

  constructor(private readonly configService: ConfigService) {
    const fromEnv =
      'omar.gamel@baianat.com:fjhqxmsjamckigtc' || this.configService.get<string>('MAIL_ACCOUNT');
    const fromDetails = (fromEnv || 'email:password').split(':');

    this.from = {
      mail: fromDetails[0],
      password: fromDetails[1]
    };

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: process.env.MAIL_PORT || 587,
      maxConnections: 1,
      maxMessages: Infinity,
      secureConnection: false,
      secure:
        process.env.NODE_ENV === 'production' && +process.env.MAIL_PORT === 587 ? true : false, // For ssl
      pool: true,
      rateLimit: true,
      auth: {
        user: this.from.mail,
        pass: this.from.password
      }
    });
  }

  public async makeNiceEmail(data) {
    // check data if not array make one for not changing already implemented one
    if (!Array.isArray(data)) data = [{ text: data }];

    // -- - - -
    const filePath = path.join(__dirname, '/../emails/notificationEmail.mjml');
    const file = fs.readFileSync(filePath, { encoding: 'utf8' });
    const template = compile(file);
    const mjml = template({
      data,
      facebookLink,
      youtubeLink,
      twitterLink,
      instagramLink,
      linkedinLink
    });
    const { html, errors } = mjml2html(mjml, { juicePreserveTags: true });
    if (errors.length) {
      throw new Error(errors[0]);
    }
    return html;
  }

  public async compileDefaultEmailToHtml(data) {
    if (!Array.isArray(data)) data = [{ text: data }];
    // -- - - -
    const filePath = path.join(__dirname, '/../emails/notificationEmail.mjml');
    const file = fs.readFileSync(filePath, { encoding: 'utf8' });
    const template = compile(file);
    const mjml = template({
      data,
      facebookLink,
      youtubeLink,
      twitterLink,
      instagramLink,
      linkedinLink
    });
    const { html, errors } = mjml2html(mjml, { juicePreserveTags: true });
    if (errors.length) {
      throw new Error(errors[0]);
    }
    return html;
  }

  public async compileEmailToHtml(data) {
    // -- - - -
    const filePath = path.join(__dirname, `/../emails/${data.template}.mjml`);
    const file = fs.readFileSync(filePath, { encoding: 'utf8' });
    const template = compile(file);
    const mjml = template({
      ...data,
      facebookLink,
      youtubeLink,
      twitterLink,
      instagramLink,
      linkedinLink
    });
    const { html, errors } = mjml2html(mjml, { juicePreserveTags: true, validationLevel: 'skip' });
    if (errors.length) {
      throw new Error(errors[0]);
    }
    return html;
  }
}
