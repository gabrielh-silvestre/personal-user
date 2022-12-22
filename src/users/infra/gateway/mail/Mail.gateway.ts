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

  async welcomeMail({ email, username }: InputDeliveryInfo): Promise<void> {
    const { html } = (await this.mailPresenter.present('WelcomeMail', {
      email,
      username,
    })) as OutputMailPresenterDto;

    this.mailAdapter.send(email, 'Welcome to S1 Auth', { text: '', html });
  }

  async recoverPasswordMail({
    email,
    username,
    token,
  }: InputRecoverPasswordInfo): Promise<void> {
    const { html } = (await this.mailPresenter.present('RecoverPasswordMail', {
      email,
      username,
      token,
    })) as OutputMailPresenterDto;

    this.mailAdapter.send(email, 'Recover your password', { text: '', html });
  }
}
