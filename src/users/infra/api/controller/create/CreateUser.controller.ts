import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { GrpcMethod } from '@nestjs/microservices';

import type {
  InputCreateUserDto,
  OutputCreateUserDto,
} from '@users/useCase/create/CreateUser.dto';

import { CreateUserUseCase } from '@users/useCase/create/CreateUser.useCase';

import { RestInterceptor } from '../../interceptor/Rest.interceptor';
import { CreateUserPresenter } from '@users/infra/presenter/rest/create/CreateUser.presenter';
import { ExceptionFilterRpc } from '@shared/infra/filter/ExceptionFilter.grpc';

@Controller('/users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  private async handle(data: InputCreateUserDto): Promise<OutputCreateUserDto> {
    return this.createUserUseCase.execute(data);
  }

  @Post()
  @UseInterceptors(RestInterceptor(new CreateUserPresenter()))
  async handleRest(
    @Body() data: InputCreateUserDto,
  ): Promise<OutputCreateUserDto> {
    return this.handle(data);
  }

  @UseFilters(new ExceptionFilterRpc())
  @GrpcMethod('UserService', 'CreateUser')
  async handleGrpc(data: InputCreateUserDto): Promise<OutputCreateUserDto> {
    return this.handle(data);
  }
}
