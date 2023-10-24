import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} from '@users/utils/constants';

@Injectable()
export class S3Service extends S3Client {
  constructor(private readonly configService: ConfigService) {
    super({
      region: configService.get<string>(AWS_REGION),
      credentials: {
        accessKeyId: configService.get<string>(AWS_ACCESS_KEY_ID),
        secretAccessKey: configService.get<string>(AWS_SECRET_ACCESS_KEY),
      },
    });
  }
}
