import type { IDatabaseGateway } from './Database.gateway.interface';

import { UserFactory } from '@users/domain/factory/User.factory';

import { PrismaService } from '@shared/modules/prisma/Prisma.service';
import { DatabaseGateway } from './Database.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

describe('Unit test infra DatabaseGateway', () => {
  let client: PrismaService;
  let databaseGateway: IDatabaseGateway;

  beforeEach(() => {
    client = {
      onModuleInit: jest.fn(),
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as PrismaService;

    databaseGateway = new DatabaseGateway(client);
  });

  it.each([
    ['id', 'find'],
    ['email', 'findByEmail'],
  ])(`should find a unique user by %s`, async (field, method) => {
    const [userToFind] = USERS_MOCK;

    await databaseGateway[method](userToFind[field]);

    expect(client.user.findFirst).toHaveBeenCalledWith({
      where: { [field]: userToFind[field] },
    });
  });

  it('should return boolean when check user existance by email', async () => {
    const [userToFind] = USERS_MOCK;

    const response = await databaseGateway.existsByEmail(userToFind.email);

    expect(typeof response).toBe('boolean');
    expect(client.user.findFirst).toHaveBeenCalledWith({
      where: { email: userToFind.email },
    });
  });

  it('should create a user', async () => {
    const newUser = UserFactory.create('Joe', 'joe@email.com', 'password');

    await databaseGateway.create(newUser);

    expect(client.user.create).toHaveBeenCalledWith({
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        password: newUser.password.toString(),
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  });

  it('should update a user', async () => {
    const [userToUpdate] = USERS_MOCK;
    userToUpdate.changeUsername('Johnny');

    await databaseGateway.update(userToUpdate);

    expect(client.user.update).toHaveBeenCalledWith({
      where: { id: userToUpdate.id },
      data: {
        username: userToUpdate.username,
        email: userToUpdate.email,
        avatar: userToUpdate.avatar,
        password: userToUpdate.password.toString(),
        createdAt: userToUpdate.createdAt,
        updatedAt: userToUpdate.updatedAt,
      },
    });
  });
});
