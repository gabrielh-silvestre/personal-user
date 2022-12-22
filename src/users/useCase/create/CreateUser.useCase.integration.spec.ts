import type { IMailAdapter } from '@users/infra/adapter/mail/Mail.adapter.interface';
import type { IMailPresenter } from '@users/infra/presenter/mail/Mail.presenter.interface';
import type { IMailGateway } from '@users/infra/gateway/mail/mail.gateway.interface';

import type { IDatabaseAdapter } from '@users/infra/adapter/database/Database.adapter.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { CreateUserUseCase } from './CreateUser.useCase';

import { UserDatabaseMemoryAdapter } from '@users/infra/adapter/database/memory/DatabaseMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import { MailGateway } from '@users/infra/gateway/mail/Mail.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const VALID_NEW_USER = {
  username: 'Joe',
  email: 'joe@email.com',
  confirmEmail: 'joe@email.com',
  password: 'password',
  confirmPassword: 'password',
};

const INVALID_NEW_USER = {
  username: USERS_MOCK[0].username,
  email: USERS_MOCK[0].email,
  confirmEmail: USERS_MOCK[0].email,
  password: 'password',
  confirmPassword: 'password',
};

describe('Integration test for Create User use case', () => {
  UserDatabaseMemoryAdapter.reset(USERS_MOCK);

  let databaseAdapter: IDatabaseAdapter;
  let databaseGateway: IDatabaseGateway;

  const mailAdapter: IMailAdapter = {
    send: jest.fn(),
  };
  const mailPresenter: IMailPresenter = {
    present: jest.fn().mockResolvedValue({ html: '' }),
  };
  let mailGateway: IMailGateway;

  let createUserUseCase: CreateUserUseCase;

  const spyWelcomeMail = jest.spyOn(MailGateway.prototype, 'welcomeMail');

  beforeEach(() => {
    databaseAdapter = new UserDatabaseMemoryAdapter();
    databaseGateway = new DatabaseGateway(databaseAdapter);

    mailGateway = new MailGateway(mailAdapter, mailPresenter);

    createUserUseCase = new CreateUserUseCase(databaseGateway, mailGateway);
  });

  afterEach(() => {
    spyWelcomeMail.mockClear();
  });

  it('should create a user with success', async () => {
    const newUser = await createUserUseCase.execute(VALID_NEW_USER);

    expect(newUser).not.toBeNull();
    expect(newUser).toStrictEqual({
      id: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      lastUpdate: expect.any(Date),
      created: expect.any(Date),
    });

    expect(spyWelcomeMail).toBeCalledTimes(1);
  });

  it('should throw an error if email is already registered', async () => {
    await expect(createUserUseCase.execute(INVALID_NEW_USER)).rejects.toThrow(
      'Email already registered',
    );

    expect(spyWelcomeMail).not.toBeCalled();
  });

  it('should throw and error if credentials not match', async () => {
    await expect(
      createUserUseCase.execute({
        ...VALID_NEW_USER,
        confirmEmail: 'invalid-email',
      }),
    ).rejects.toThrow('Credentials not match');

    expect(spyWelcomeMail).not.toBeCalled();

    await expect(
      createUserUseCase.execute({
        ...VALID_NEW_USER,
        confirmPassword: 'invalid-password',
      }),
    ).rejects.toThrow('Credentials not match');

    expect(spyWelcomeMail).not.toBeCalled();
  });
});
