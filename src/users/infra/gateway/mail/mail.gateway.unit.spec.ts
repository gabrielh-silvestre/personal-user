import type { IMailAdapter } from '@users/infra/adapter/mail/Mail.adapter.interface';
import type { IMailPresenter } from '@users/infra/presenter/mail/Mail.presenter.interface';
import type { IMailGateway } from './mail.gateway.interface';

import { MailGateway } from './Mail.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ email, username }] = USERS_MOCK;

describe('Unit test for Mail service', () => {
  let mailGateway: IMailGateway;
  const mailPresenter: IMailPresenter = {
    present: jest.fn().mockResolvedValue({ html: '' }),
  };
  const mailAdapter: IMailAdapter = {
    send: jest.fn(),
  };

  beforeEach(() => {
    mailGateway = new MailGateway(mailAdapter, mailPresenter);
  });

  it('should send a welcome mail', async () => {
    await mailGateway.welcomeMail({ email, username });

    expect(mailAdapter.send).toBeCalledWith(email, expect.any(String), {
      text: expect.any(String),
      html: expect.any(String),
    });
  });
});
