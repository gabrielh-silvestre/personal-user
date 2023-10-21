import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { ChangePasswordUseCase } from './ChangePassword.useCase';

import { Password } from '@users/domain/value-object/Password';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';

const USER = RANDOM_USER_MOCK();
const { id } = USER;
const NEW_PASSWORD = 'new-password';

describe('Unit tests for ChangePassword use case', () => {
  let databaseGateway: IDatabaseGateway;

  let changePasswordUseCase: ChangePasswordUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.find).mockResolvedValue(USER);

    changePasswordUseCase = new ChangePasswordUseCase(databaseGateway);
  });

  it('should change password with success', async () => {
    await changePasswordUseCase.execute({
      id,
      newPassword: NEW_PASSWORD,
      confirmPassword: NEW_PASSWORD,
    });

    expect(databaseGateway.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id,
        password: expect.any(Password),
      }),
    );
  });

  it('should throw an error if passwords does not match', async () => {
    await expect(
      changePasswordUseCase.execute({
        id,
        newPassword: NEW_PASSWORD,
        confirmPassword: 'password',
      }),
    ).rejects.toThrow('Passwords do not match');
  });

  it('should throw an error if user is not found', async () => {
    jest.mocked(databaseGateway.find).mockResolvedValue(null);

    await expect(
      changePasswordUseCase.execute({
        id: 'invalid-id',
        newPassword: NEW_PASSWORD,
        confirmPassword: NEW_PASSWORD,
      }),
    ).rejects.toThrow('User not found');
  });
});
