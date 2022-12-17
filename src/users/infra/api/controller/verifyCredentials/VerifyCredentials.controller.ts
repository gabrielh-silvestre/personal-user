import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import type {
  InputVerifyCredentialsDto,
  OutputVerifyCredentialsDto,
} from '@users/useCase/verifyCredentials/VerifyCredentials.dto';

import { VerifyCredentialsUseCase } from '@users/useCase/verifyCredentials/VerifyCredentials.useCase';

import { RmqService } from '@shared/modules/rmq/rmq.service';

import { ExceptionFilterRpc } from '@shared/infra/filter/ExceptionFilter.grpc';

@Controller()
export class VerifyCredentialsController {
  constructor(
    private readonly verifyCredentialsUseCase: VerifyCredentialsUseCase,
    private readonly rmqService: RmqService,
  ) {}

  @UseFilters(new ExceptionFilterRpc())
  @MessagePattern('verify_user_credentials')
  async handleRmq(
    @Payload() data: InputVerifyCredentialsDto,
    @Ctx() ctx: RmqContext,
  ): Promise<OutputVerifyCredentialsDto | never> {
    try {
      const result = await this.verifyCredentialsUseCase.execute(data);

      this.rmqService.ack(ctx);

      return result;
    } catch (err) {
      this.rmqService.nack(ctx);

      throw err;
    }
  }
}
