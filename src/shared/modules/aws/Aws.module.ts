import { Module } from '@nestjs/common';

import { S3Service } from './S3.service';
import { SNSService } from './SNS.service';

@Module({
  providers: [S3Service, SNSService],
  exports: [S3Service, SNSService],
})
export class AwsModule {}
