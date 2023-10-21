import type { IMailPresenter } from '@users/infra/presenter/mail/Mail.presenter.interface';
import type { IMailGateway } from '@users/infra/gateway/mail/mail.gateway.interface';

import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';

import { CreateUserUseCase } from './CreateUser.useCase';

import { MailGateway } from '@users/infra/gateway/mail/Mail.gateway';

import { USERS_MOCK, RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';

const USER = RANDOM_USER_MOCK();

const VALID_NEW_USER = {
  username: USER.username,
  email: USER.email,
  confirmEmail: USER.email,
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

describe('Unit tests for Create User use case', () => {
  let queueAdapter: IQueueAdapter;

  let databaseGateway: IDatabaseGateway;

  const mailPresenter: IMailPresenter = {
    present: jest.fn().mockResolvedValue({ html: '' }),
  };
  let mailGateway: IMailGateway;

  let createUserUseCase: CreateUserUseCase;

  const spyWelcomeMail = jest.spyOn(MailGateway.prototype, 'welcomeMail');

  beforeEach(() => {
    queueAdapter = {
      send: jest.fn(),
      emit: jest.fn(),
    };

    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.existsByEmail).mockResolvedValue(false);

    mailGateway = new MailGateway(queueAdapter, mailPresenter);

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
    jest.mocked(databaseGateway.existsByEmail).mockResolvedValueOnce(true);

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
