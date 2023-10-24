import { Body, Controller, Post } from '@nestjs/common';

import type {
  InputLoginDto,
  OutputLoginDto,
} from '@users/useCase/login/Login.dto';

import { LoginUseCase } from '@users/useCase/login/Login.useCase';

@Controller('login')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  private async handle(data: InputLoginDto): Promise<OutputLoginDto> {
    return this.loginUseCase.execute(data);
  }

  @Post()
  async handleRestPost(@Body() data: InputLoginDto): Promise<OutputLoginDto> {
    return this.handle(data);
  }

  // TODO review this
  // @UseFilters(new ExceptionFilterRpc())
  // @MessagePattern('verify_user_credentials')
  // async handleRmq(
  //   @Payload() data: InputVerifyCredentialsDto,
  //   @Ctx() ctx: RmqContext,
  // ): Promise<OutputVerifyCredentialsDto | never> {
  //   try {
  //     const result = await this.verifyCredentialsUseCase.execute(data);

  //     this.rmqService.ack(ctx);

  //     return result;
  //   } catch (err) {
  //     this.rmqService.nack(ctx);

  //     throw err;
  //   }
  // }
}
