import type { Request as IRequest } from 'express';
import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type {
  InputChangeAvatarDto,
  OutputChangeAvatarDto,
} from '@users/useCase/changeAvatar/ChangeAvatar.dto';

import { ChangeAvatarUseCase } from '@users/useCase/changeAvatar/ChangeAvatar.useCase';

import { AuthGuard } from '../../guard/Auth.guard';

@Controller('/users')
export class ChangeAvatarController {
  constructor(private readonly useCase: ChangeAvatarUseCase) {}

  private async handle(
    data: InputChangeAvatarDto,
  ): Promise<OutputChangeAvatarDto> {
    return this.useCase.execute(data);
  }

  @UseGuards(AuthGuard)
  @Post('/:id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async handleRest(
    @Request() req: IRequest,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<OutputChangeAvatarDto> {
    return this.handle({ id: req.user.userId, newAvatar: avatar });
  }
}
