import type { Request as IRequest } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ChangePasswordUseCase } from '@users/useCase/changePassword/ChangePassword.useCase';

import { AuthGuard } from '../../guard/Auth.guard';

type RequestChangePassword = {
  password: string;
  confirmPassword: string;
};

@Controller('users')
export class ChangePasswordController {
  constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleRest(
    @Request() req: IRequest,
    @Body() { password, confirmPassword }: RequestChangePassword,
  ): Promise<void> {
    const { userId } = req.user;

    await this.changePasswordUseCase.execute({
      id: userId,
      newPassword: password,
      confirmPassword,
    });
    return;
  }
}
