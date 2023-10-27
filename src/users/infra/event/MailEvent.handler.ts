import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import { SNSService } from '@shared/modules/aws/SNS.service';
import { RecoverPasswordRequested } from '@users/domain/event/RecoverPasswordRequested.event';

import { SQS_GROUP_TOPIC_ARN, SQS_TOPIC_ARN } from '@shared/utils/constants';

@Injectable()
export class MailEventHandler {
  private static readonly TOPIC_NAME = 'mail';

  private readonly topicArn: string;
  private readonly messageGroupId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly sns: SNSService,
  ) {
    this.topicArn = this.configService.get<string>(
      SQS_TOPIC_ARN(MailEventHandler.TOPIC_NAME),
    );

    this.messageGroupId = SQS_GROUP_TOPIC_ARN(MailEventHandler.TOPIC_NAME);
  }

  @OnEvent(RecoverPasswordRequested.eventName)
  async handleRecoverPasswordRequestedEvent(event: RecoverPasswordRequested) {
    await this.sns.publish({
      topicArn: this.topicArn,
      message: event,
      messageGroupId: this.messageGroupId,
    });
  }
}
