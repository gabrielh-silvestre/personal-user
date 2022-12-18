import type { Request as IRequest } from 'express';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';

import { ChangePasswordUseCase } from '@users/useCase/changePassword/ChangePassword.useCase';

import { AuthGuard } from '../../guard/Auth.guard';
import { ExceptionFilterRpc } from '@shared/infra/filter/ExceptionFilter.grpc';

type RequestChangePassword = {
  password: string;
  confirmPassword: string;
};

@Controller('users')
export class ChangePasswordController {
  constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

  private async handle(
    id: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    await this.changePasswordUseCase.execute({
      id,
      newPassword: password,
      confirmPassword,
    });
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleRest(
    @Request() req: IRequest,
    @Body() { password, confirmPassword }: RequestChangePassword,
  ): Promise<void> {
    const { userId } = req.user;

    await this.handle(userId, password, confirmPassword);

    return;
  }

  @UseFilters(new ExceptionFilterRpc())
  @UseGuards(AuthGuard)
  @GrpcMethod('UserService', 'ChangePassword')
  async handleGrpc(
    @Payload() req: IRequest,
    @Body() { password, confirmPassword }: RequestChangePassword,
  ): Promise<{ success: boolean }> {
    const { userId } = req.user;

    await this.handle(userId, password, confirmPassword);

    return { success: true };
  }
}
