import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from '@shared/utils/constants';

@Injectable()
export class S3Service extends S3Client {
  constructor(private readonly configService: ConfigService) {
    super({
      region: configService.getOrThrow<string>(AWS_REGION),
      credentials: {
        accessKeyId: configService.getOrThrow<string>(AWS_ACCESS_KEY_ID),
        secretAccessKey: configService.getOrThrow<string>(
          AWS_SECRET_ACCESS_KEY,
        ),
      },
    });
  }
}
