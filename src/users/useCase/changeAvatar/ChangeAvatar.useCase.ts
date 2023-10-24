import { Inject, Injectable } from '@nestjs/common';

import type { IBucketGateway } from '@users/infra/gateway/bucket/Bucket.gateway.interface';
import type { IDatabaseGateway } from '@users/infra/gateway/database/Database.gateway.interface';
import type {
  InputChangeAvatarDto,
  OutputChangeAvatarDto,
} from './ChangeAvatar.dto';

import { User } from '@users/domain/entity/User';
import { ExceptionFactory } from '@shared/modules/exceptions/factory/Exception.factory';

import { BUCKET_GATEWAY, DATABASE_GATEWAY } from '@users/utils/constants';

@Injectable()
export class ChangeAvatarUseCase {
  constructor(
    @Inject(DATABASE_GATEWAY)
    private readonly database: IDatabaseGateway,
    @Inject(BUCKET_GATEWAY)
    private readonly bucket: IBucketGateway,
  ) {}

  private async findUser(id: string): Promise<User | never> {
    const foundUser = await this.database.find(id);

    if (!foundUser) {
      throw ExceptionFactory.notFound('User not found');
    }

    return foundUser;
  }

  async execute({
    id,
    newAvatar,
  }: InputChangeAvatarDto): Promise<OutputChangeAvatarDto> {
    const user = await this.findUser(id);

    const reference = await this.bucket.uploadImage(newAvatar, user);
    user.setAvatar(reference);

    await this.database.update(user);

    return { avatar: reference };
  }
}
