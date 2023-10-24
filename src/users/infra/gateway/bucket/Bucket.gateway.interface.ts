import type { IUser } from '@users/domain/entity/user.interface';

export type IBucketFile = Express.Multer.File;

export interface IBucketGateway {
  uploadImage(image: IBucketFile, user: IUser): Promise<string>;
}
