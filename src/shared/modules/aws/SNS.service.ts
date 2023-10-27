import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSHandler } from '@coaktion/aws';

import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  SQS_ENDPOINT,
} from '@shared/utils/constants';

@Injectable()
export class SNSService extends SNSHandler {
  constructor(private readonly configService: ConfigService) {
    super({
      region: configService.getOrThrow<string>(AWS_REGION),
      credentials: {
        accessKeyId: configService.getOrThrow<string>(AWS_ACCESS_KEY_ID),
        secretAccessKey: configService.getOrThrow<string>(
          AWS_SECRET_ACCESS_KEY,
        ),
      },
      endpoint: configService.getOrThrow(SQS_ENDPOINT),
    });

    console.log({
      region: configService.getOrThrow<string>(AWS_REGION),
      credentials: {
        accessKeyId: configService.getOrThrow<string>(AWS_ACCESS_KEY_ID),
        secretAccessKey: configService.getOrThrow<string>(
          AWS_SECRET_ACCESS_KEY,
        ),
      },
      endpoint: configService.getOrThrow(SQS_ENDPOINT),
    });
  }
}
