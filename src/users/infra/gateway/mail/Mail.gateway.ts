import { Inject, Injectable } from '@nestjs/common';

import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';
import type {
  IMailPresenter,
  OutputMailPresenterDto,
} from '@users/infra/presenter/mail/Mail.presenter.interface';
import type {
  IMailGateway,
  InputDeliveryInfo,
  InputRecoverPasswordInfo,
} from './mail.gateway.interface';

import { MAIL_PRESENTER, QUEUE_ADAPTER } from '@users/utils/constants';

@Injectable()
export class MailGateway implements IMailGateway {
  constructor(
    @Inject(QUEUE_ADAPTER) private readonly queueAdapter: IQueueAdapter,
    @Inject(MAIL_PRESENTER) private readonly mailPresenter: IMailPresenter,
  ) {}

  async welcomeMail({ email, username }: InputDeliveryInfo): Promise<void> {
    const { html } = (await this.mailPresenter.present('WelcomeMail', {
      email,
      username,
    })) as OutputMailPresenterDto;

    this.queueAdapter.emit('mail.send', {
      to: email,
      subject: 'Welcome to S1 Auth',
      text: '',
      html,
    });
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

    this.queueAdapter.emit('mail.send', {
      to: email,
      subject: 'Recover your password',
      text: '',
      html,
    });
  }
}
