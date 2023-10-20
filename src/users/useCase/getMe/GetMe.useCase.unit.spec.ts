import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';

import { GetMeUseCase } from './GetMe.useCase';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';

describe('Unit tests for Get User by id use case', () => {
  let databaseGateway: IDatabaseGateway;

  let getMeUseCase: GetMeUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    jest.mocked(databaseGateway.find).mockResolvedValue(RANDOM_USER_MOCK);

    getMeUseCase = new GetMeUseCase(databaseGateway);
  });

  it('should get a user by id with success', async () => {
    const user = await getMeUseCase.execute(RANDOM_USER_MOCK.id);

    expect(user).not.toBeNull();
    expect(user).toStrictEqual({
      id: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      lastUpdate: expect.any(Date),
      createdAt: expect.any(Date),
    });
  });

  it('should throw an error if user is not found', async () => {
    jest.mocked(databaseGateway.find).mockResolvedValue(null);

    await expect(getMeUseCase.execute('invalid-id')).rejects.toThrow(
      'User not found',
    );
  });
});
