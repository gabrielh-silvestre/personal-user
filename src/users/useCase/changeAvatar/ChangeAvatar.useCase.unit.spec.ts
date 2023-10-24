import { ChangeAvatarUseCase } from './ChangeAvatar.useCase';

import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type {
  IBucketFile,
  IBucketGateway,
} from '@users/infra/gateway/bucket/Bucket.gateway.interface';

import { User } from '@users/domain/entity/User';

import { RANDOM_USER_MOCK } from '@shared/utils/mocks/users.mock';

const USER = RANDOM_USER_MOCK();

describe('Unit tests for ChangeAvatar use case', () => {
  let databaseGateway: IDatabaseGateway;

  let bucketGateway: IBucketGateway;

  let changeAvatarUseCase: ChangeAvatarUseCase;

  beforeEach(() => {
    databaseGateway = {
      create: jest.fn(),
      existsByEmail: jest.fn(),
      find: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    bucketGateway = {
      uploadImage: jest.fn().mockResolvedValue(true),
    };

    jest.mocked(databaseGateway.find).mockResolvedValue(USER);

    changeAvatarUseCase = new ChangeAvatarUseCase(
      databaseGateway,
      bucketGateway,
    );
  });

  it('should change avatar with success', async () => {
    const newAvatar = {
      originalname: 'new-avatar',
      buffer: Buffer.from('new-avatar'),
    } as IBucketFile;

    await changeAvatarUseCase.execute({
      id: USER.id,
      newAvatar,
    });

    expect(bucketGateway.uploadImage).toHaveBeenCalledWith(newAvatar, USER);
    expect(databaseGateway.update).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw an error when user not found', async () => {
    jest.mocked(databaseGateway.find).mockResolvedValue(null);

    await expect(
      changeAvatarUseCase.execute({
        id: USER.id,
        newAvatar: {
          originalname: 'new-avatar',
          buffer: Buffer.from('new-avatar'),
        } as IBucketFile,
      }),
    ).rejects.toThrow('User not found');
  });
});
