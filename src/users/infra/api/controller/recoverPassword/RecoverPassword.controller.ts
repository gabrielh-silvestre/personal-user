import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import type { InputRecoverPasswordDto } from '@users/useCase/recoverPassword/RecoverPassword.dto';

import { RecoverPasswordUseCase } from '@users/useCase/recoverPassword/RecoverPassword.useCase';

@Controller('users')
export class RecoverPasswordController {
  constructor(
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase,
  ) {}

  private async handle(data: InputRecoverPasswordDto): Promise<void> {
    await this.recoverPasswordUseCase.execute(data);
  }

  @Post('recover-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleRestPost(@Body() data: InputRecoverPasswordDto): Promise<void> {
    await this.handle(data);
    return;
  }

  @Get('recover-password/:email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handleRestGet(@Param('email') email: string): Promise<void> {
    await this.handle({ email });
    return;
  }
}
