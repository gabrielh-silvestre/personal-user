import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';
import type { IMailGateway } from './mail.gateway.interface';
import type { IMailPresenter } from '@users/infra/presenter/mail/Mail.presenter.interface';

import { MailGateway } from './Mail.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ email, username }] = USERS_MOCK;

describe('Unit test for Mail service', () => {
  let mailGateway: IMailGateway;
  const mailPresenter: IMailPresenter = {
    present: jest.fn().mockResolvedValue({ html: '' }),
  };
  const queueAdapter: IQueueAdapter = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(() => {
    mailGateway = new MailGateway(queueAdapter, mailPresenter);
  });

  it('should send a welcome mail', async () => {
    await mailGateway.welcomeMail({ email, username });

    expect(queueAdapter.emit).toBeCalledTimes(1);
    expect(queueAdapter.emit).toBeCalledWith('mail.send', {
      to: email,
      subject: 'Welcome to S1 Auth',
      text: expect.any(String),
      html: expect.any(String),
    });
  });
});
