import { from } from 'rxjs';

import type { IMailAdapter } from '@users/infra/adapter/mail/Mail.adapter.interface';
import type { IMailPresenter } from '@users/infra/presenter/mail/Mail.presenter.interface';
import type { IMailGateway } from '@users/infra/gateway/mail/mail.gateway.interface';

import type { IAuthAdapter } from '@users/infra/adapter/auth/Auth.adapter.interface';
import type { IAuthGateway } from '@users/infra/gateway/auth/auth.gateway.interface';

import type { IUserDatabaseAdapter } from '@users/infra/adapter/database/UserDatabase.adapter.interface';
import type { IUserRepository } from '@users/domain/repository/user.repository.interface';

import { RecoverPasswordUseCase } from './RecoverPassword.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/UserMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { MailGateway } from '@users/infra/gateway/mail/Mail.gateway';
import { AuthGateway } from '@users/infra/gateway/auth/Auth.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ id, email, username }] = USERS_MOCK;

describe('Integration test for RecoverPassword use case', () => {
  let userDatabaseGateway: IUserDatabaseAdapter;
  let userRepository: IUserRepository;

  const mailAdapter: IMailAdapter = {
    send: jest.fn(),
  };
  const mailPresenter: IMailPresenter = {
    present: jest.fn().mockResolvedValue({ html: '' }),
  };
  let mailGateway: IMailGateway;

  let authAdapter: IAuthAdapter;
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

  beforeAll(() => {
    UserDatabaseMemoryAdapter.reset(USERS_MOCK);
  });

  beforeEach(() => {
    userDatabaseGateway = new UserDatabaseMemoryAdapter();
    userRepository = new DatabaseGateway(userDatabaseGateway);

    mailGateway = new MailGateway(mailAdapter, mailPresenter);

    authAdapter = {
      verify: jest.fn(),
      generate: jest.fn().mockReturnValue(from(['fake-token'])),
    };
    authGateway = new AuthGateway(authAdapter);

    recoverPasswordUseCase = new RecoverPasswordUseCase(
      userRepository,
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
    spyGenerateRecoverPasswordToken.mockReset();
    spyRecoverPasswordMail.mockReset();

    await expect(
      recoverPasswordUseCase.execute({ email: 'invalid_email@email.com' }),
    ).rejects.toThrowError('Email not registered');

    expect(spyGenerateRecoverPasswordToken).not.toHaveBeenCalled();
    expect(spyRecoverPasswordMail).not.toHaveBeenCalled();
  });
});
