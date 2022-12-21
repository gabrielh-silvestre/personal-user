import { Inject, Injectable } from '@nestjs/common';

import type { IMailAdapter } from '@users/infra/adapter/mail/Mail.adapter.interface';
import type {
  IMailPresenter,
  OutputMailPresenterDto,
} from '@users/infra/presenter/mail/Mail.presenter.interface';
import type {
  IMailGateway,
  InputDeliveryInfo,
  InputRecoverPasswordInfo,
} from './mail.gateway.interface';

import { MAIL_ADAPTER, MAIL_PRESENTER } from '@users/utils/constants';

@Injectable()
export class MailGateway implements IMailGateway {
  constructor(
    @Inject(MAIL_ADAPTER) private readonly mailAdapter: IMailAdapter,
    @Inject(MAIL_PRESENTER) private readonly mailPresenter: IMailPresenter,
  ) {}

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

  private async presentMailData(
    email: string,
    username: string,
    token?: string,
  ): Promise<OutputMailPresenterDto> {
    return this.mailPresenter.present({
      username,
      email,
      token,
    }) as Promise<OutputMailPresenterDto>;
  }

  async welcomeMail(data: InputDeliveryInfo): Promise<void> {
    const { to, subject, html } = await this.presentMailData(
      data.email,
      data.username,
    );

    this.mailAdapter.send(to, subject, { text: '', html });
  }

  async recoverPasswordMail(data: InputRecoverPasswordInfo): Promise<void> {
    const { to, subject, text, html } = this.recoverPasswordMailData(data);

    this.mailAdapter.send(to, subject, { text, html });
  }
}
