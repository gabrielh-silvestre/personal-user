import type { Request as IRequest } from 'express';
import {
  Body,
  Controller,
  Get,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import type { OutputGetMeDto } from '@users/useCase/getMe/GetMe.dto';

import { GetMeUseCase } from '@users/useCase/getMe/GetMe.useCase';

import { AuthGuard } from '../../guard/Auth.guard';
import { GetMeRestPresenter } from '@users/infra/presenter/rest/getMe/GetMe.rest.presenter';
import { RestInterceptor } from '../../interceptor/Rest.interceptor';
import { ExceptionFilterRpc } from '@shared/infra/filter/ExceptionFilter.grpc';

@Controller('/users')
export class GetMeController {
  constructor(private readonly getMeUseCase: GetMeUseCase) {}

  private async handle(userId: string): Promise<OutputGetMeDto> {
    return this.getMeUseCase.execute(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  @UseInterceptors(RestInterceptor(new GetMeRestPresenter()))
  async handleRest(@Request() data: IRequest): Promise<OutputGetMeDto> {
    return this.handle(data.user.userId);
  }

  @UseFilters(new ExceptionFilterRpc())
  @UseGuards(AuthGuard)
  @GrpcMethod('UserService', 'GetMe')
  async handleGrpc(@Body() data: IRequest): Promise<OutputGetMeDto> {
    return this.handle(data.user.userId);
  }
}
