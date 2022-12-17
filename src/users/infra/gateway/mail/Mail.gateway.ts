import { Inject, Injectable } from '@nestjs/common';

import type { IMailAdapter } from '@users/infra/adapter/mail/Mail.adapter.interface';
import type {
  IMailGateway,
  InputDeliveryInfo,
  InputRecoverPasswordInfo,
} from './mail.gateway.interface';

import { MAIL_ADAPTER } from '@users/utils/constants';

@Injectable()
export class MailGateway implements IMailGateway {
  constructor(
    @Inject(MAIL_ADAPTER) private readonly mailAdapter: IMailAdapter,
  ) {}

  private welcomeMailData({ email, username }: InputDeliveryInfo) {
    return {
      to: email,
      subject: 'Welcome to the S1 auth service!',
      text: `Welcome to the S1 auth service, ${username}!`,
      html: `<b>Welcome to the S1 auth service, ${username}!</b>`,
    };
  }

  private recoverPasswordMailData({
    email,
    username,
    token,
  }: InputRecoverPasswordInfo) {
    return {
      to: email,
      subject: 'Recover password',
      text: `Hi, ${username}! Use this token to recover your password: ${token}`,
      html: `<b>Hi, ${username}! Use this token to recover your password: ${token}</b>`,
    };
  }

  async welcomeMail(data: InputDeliveryInfo): Promise<void> {
    const { to, subject, text, html } = this.welcomeMailData(data);

    this.mailAdapter.send(to, subject, { text, html });
  }

  async recoverPasswordMail(data: InputRecoverPasswordInfo): Promise<void> {
    const { to, subject, text, html } = this.recoverPasswordMailData(data);

    this.mailAdapter.send(to, subject, { text, html });
  }
}
