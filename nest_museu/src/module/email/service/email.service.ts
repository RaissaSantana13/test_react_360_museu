import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    // INJETE DIRETO
    this.nodemailerTransport = createTransport({
      service: this.configService.getOrThrow<string>('EMAIL_HOST'), // ex: 'gmail'
      auth: {
        user: this.configService.getOrThrow<string>('EMAIL_USER'),
        pass: this.configService.getOrThrow<string>('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
