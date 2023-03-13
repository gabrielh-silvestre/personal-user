import type { IOrmAdapter } from '@users/infra/adapter/orm/Orm.adapter.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { CreateUserUseCase } from './CreateUser.useCase';

import { OrmMemoryAdapter } from '@users/infra/adapter/orm/memory/OrmMemory.adapter';
import { DatabaseGateway } from '@users/infra/gateway/database/Database.gateway';

import {
  FAKE_EVENT_DISPATCHER,
  USERS_MOCK,
} from '@shared/utils/mocks/users.mock';

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
  OrmMemoryAdapter.reset(USERS_MOCK);

  let ormAdapter: IOrmAdapter;

  let databaseGateway: IDatabaseGateway;

  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    ormAdapter = new OrmMemoryAdapter();

    databaseGateway = new DatabaseGateway(ormAdapter);

    createUserUseCase = new CreateUserUseCase(
      databaseGateway,
      FAKE_EVENT_DISPATCHER,
    );
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

    expect(FAKE_EVENT_DISPATCHER.notify).toBeCalledTimes(1);
  });

  it('should throw an error if email is already registered', async () => {
    await expect(createUserUseCase.execute(INVALID_NEW_USER)).rejects.toThrow(
      'Email already registered',
    );

    expect(FAKE_EVENT_DISPATCHER.notify).not.toBeCalled();
  });

  it('should throw and error if credentials not match', async () => {
    await expect(
      createUserUseCase.execute({
        ...VALID_NEW_USER,
        confirmEmail: 'invalid-email',
      }),
    ).rejects.toThrow('Credentials not match');

    expect(FAKE_EVENT_DISPATCHER.notify).not.toBeCalled();

    await expect(
      createUserUseCase.execute({
        ...VALID_NEW_USER,
        confirmPassword: 'invalid-password',
      }),
    ).rejects.toThrow('Credentials not match');

    expect(FAKE_EVENT_DISPATCHER.notify).not.toBeCalled();
  });
});
