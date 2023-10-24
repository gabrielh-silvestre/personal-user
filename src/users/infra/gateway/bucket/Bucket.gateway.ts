import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import type { IBucketGateway } from './Bucket.gateway.interface';
import type { IUser } from '@users/domain/entity/user.interface';

import { S3Service } from '@shared/modules/aws/S3.service';

import { BUCKET_NAME } from '@shared/utils/constants';

@Injectable()
export class BucketGateway implements IBucketGateway {
  constructor(
    private readonly bucket: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(image: Express.Multer.File, user: IUser): Promise<string> {
    const bucketName = this.configService.get<string>(BUCKET_NAME);

    const Key = `${user.id}/${user.updatedAt.toISOString()}__${
      image.originalname
    }`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key,
      Body: image.buffer,
      ContentType: 'image/*',
      ContentDisposition: 'inline',
    });

    await this.bucket.send(command);

    return Key;
  }
}
