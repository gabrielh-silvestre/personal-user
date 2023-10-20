import { from } from 'rxjs';

import type { IMailPresenter } from '@users/infra/presenter/mail/Mail.presenter.interface';
import type { IMailGateway } from '@users/infra/gateway/mail/mail.gateway.interface';

import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';
import type { IAuthGateway } from '@users/infra/gateway/auth/auth.gateway.interface';

import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { RecoverPasswordUseCase } from './RecoverPassword.useCase';

import { MailGateway } from '@users/infra/gateway/mail/Mail.gateway';
import { AuthGateway } from '@users/infra/gateway/auth/Auth.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [USER] = USERS_MOCK;
const { id, email, username } = USER;

describe('Unit tests for RecoverPassword use case', () => {
  let databaseGateway: IDatabaseGateway;

  const mailPresenter: IMailPresenter = {
    present: jest.fn().mockResolvedValue({ html: '' }),
  };
  let mailGateway: IMailGateway;

  let queueAdapter: IQueueAdapter;
  let authGateway: IAuthGateway;

  let recoverPasswordUseCase: RecoverPasswordUseCase;

  const spyGenerateRecoverPasswordToken = jest.spyOn(
    AuthGateway.prototype,
    'generateRecoverPasswordToken',
  );

  const spyRecoverPasswordMail = jest.spyOn(
    MailGateway.prototype,
    'recoverPasswordMail',
  );

  beforeEach(() => {
    queueAdapter = {
      send: jest.fn().mockReturnValue(from('fake-message')),
      emit: jest.fn(),
    };

    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(USER);

    mailGateway = new MailGateway(queueAdapter, mailPresenter);
    authGateway = new AuthGateway(queueAdapter);

    recoverPasswordUseCase = new RecoverPasswordUseCase(
      databaseGateway,
      authGateway,
      mailGateway,
    );
  });

  it('should recover password with success', async () => {
    await recoverPasswordUseCase.execute({ email });

    expect(spyGenerateRecoverPasswordToken).toHaveBeenCalledTimes(1);
    expect(spyGenerateRecoverPasswordToken).toHaveBeenCalledWith(id);

    expect(spyRecoverPasswordMail).toHaveBeenCalledTimes(1);
    expect(spyRecoverPasswordMail).toHaveBeenCalledWith({
      email,
      username,
      token: expect.any(String),
    });
  });

  it('should throw an error if user not found', async () => {
    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(null);

    spyGenerateRecoverPasswordToken.mockReset();
    spyRecoverPasswordMail.mockReset();

    await expect(
      recoverPasswordUseCase.execute({ email: 'invalid_email@email.com' }),
    ).rejects.toThrowError('Email not registered');

    expect(spyGenerateRecoverPasswordToken).not.toHaveBeenCalled();
    expect(spyRecoverPasswordMail).not.toHaveBeenCalled();
  });
});
