import type { ITokenGateway } from '@users/infra/gateway/token/token.gateway.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { LoginUseCase } from './Login.useCase';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [USER] = USERS_MOCK;
const { email } = USER;

describe('Unit tests for Login use case', () => {
  let databaseGateway: IDatabaseGateway;
  let authGateway: ITokenGateway;

  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    authGateway = {
      generate: jest.fn().mockResolvedValue('token'),
      validate: jest.fn(),
    };

    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(USER);

    loginUseCase = new LoginUseCase(databaseGateway, authGateway);
  });

  it('should login with success', async () => {
    const user = await loginUseCase.execute({
      email,
      password: 'password',
    });

    expect(user).not.toBeNull();
    expect(user).toStrictEqual({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        email: expect.any(String),
      },
    });

    expect(authGateway.generate).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if user is not found', async () => {
    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'invalid-email',
        password: 'invalid-password',
      }),
    ).rejects.toThrow('User not found');

    expect(authGateway.generate).not.toHaveBeenCalled();
  });

  it('should throw an error if password is invalid', async () => {
    await expect(
      loginUseCase.execute({
        email,
        password: 'invalid-password',
      }),
    ).rejects.toThrow('Invalid credentials');

    expect(authGateway.generate).not.toHaveBeenCalled();
  });
});