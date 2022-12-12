import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import type {
  InputVerifyCredentialsDto,
  OutputVerifyCredentialsDto,
} from '@users/useCase/verifyCredentials/VerifyCredentials.dto';

import { VerifyCredentialsUseCase } from '@users/useCase/verifyCredentials/VerifyCredentials.useCase';

import { ExceptionFilterRpc } from '@shared/infra/filter/ExceptionFilter.grpc';

@Controller()
export class VerifyCredentialsController {
  constructor(
    private readonly verifyCredentialsUseCase: VerifyCredentialsUseCase,
  ) {}

  @UseFilters(new ExceptionFilterRpc())
  @GrpcMethod('UserService', 'VerifyCredentials')
  async handleGrpc(
    data: InputVerifyCredentialsDto,
  ): Promise<OutputVerifyCredentialsDto | never> {
    return this.verifyCredentialsUseCase.execute(data);
  }
}
