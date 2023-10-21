import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { VerifyCredentialsUseCase } from './VerifyCredentials.useCase';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [USER] = USERS_MOCK;
const { email } = USER;

describe('Unit tests for Verify Credentials use case', () => {
  let databaseGateway: IDatabaseGateway;

  let verifyCredentialsUseCase: VerifyCredentialsUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(USER);

    verifyCredentialsUseCase = new VerifyCredentialsUseCase(databaseGateway);
  });

  it('should verify credentials with success', async () => {
    const user = await verifyCredentialsUseCase.execute({
      email,
      password: 'password',
    });

    expect(user).not.toBeNull();
    expect(user).toStrictEqual({ id: expect.any(String) });
  });

  it('should throw an error if user is not found', async () => {
    jest.mocked(databaseGateway.findByEmail).mockResolvedValue(null);

    await expect(
      verifyCredentialsUseCase.execute({
        email: 'invalid-email',
        password: 'invalid-password',
      }),
    ).rejects.toThrow('User not found');
  });

  it('should throw an error if password is invalid', async () => {
    await expect(
      verifyCredentialsUseCase.execute({
        email,
        password: 'invalid-password',
      }),
    ).rejects.toThrow('Invalid credentials');
  });
});
