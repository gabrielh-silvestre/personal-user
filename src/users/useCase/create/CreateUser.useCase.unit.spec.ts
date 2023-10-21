import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { CreateUserUseCase } from './CreateUser.useCase';

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
  let databaseGateway: IDatabaseGateway;

  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.existsByEmail).mockResolvedValue(false);

    createUserUseCase = new CreateUserUseCase(databaseGateway);
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
  });

  it('should throw an error if email is already registered', async () => {
    jest.mocked(databaseGateway.existsByEmail).mockResolvedValueOnce(true);

    await expect(createUserUseCase.execute(INVALID_NEW_USER)).rejects.toThrow(
      'Email already registered',
    );
  });

  it('should throw and error if credentials not match', async () => {
    await expect(
      createUserUseCase.execute({
        ...VALID_NEW_USER,
        confirmEmail: 'invalid-email',
      }),
    ).rejects.toThrow('Credentials not match');

    await expect(
      createUserUseCase.execute({
        ...VALID_NEW_USER,
        confirmPassword: 'invalid-password',
      }),
    ).rejects.toThrow('Credentials not match');
  });
});
