import type { IBucketFile } from '@users/infra/gateway/bucket/Bucket.gateway.interface';

export interface InputChangeAvatarDto {
  id: string;
  newAvatar: IBucketFile;
}

export interface OutputChangeAvatarDto {
  avatar: string;
}
