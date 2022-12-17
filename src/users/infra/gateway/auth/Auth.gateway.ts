import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import type { IAuthAdapter } from '@users/infra/adapter/auth/Auth.adapter.interface';
import type { OutputVerifyAuth, IAuthGateway } from './auth.gateway.interface';

import { AUTH_ADAPTER } from '@users/utils/constants';

@Injectable()
export class AuthGateway implements IAuthGateway {
  constructor(
    @Inject(AUTH_ADAPTER) private readonly authAdapter: IAuthAdapter,
  ) {}

  verify(token: string): Promise<OutputVerifyAuth | never> {
    return lastValueFrom(this.authAdapter.verify(token));
  }

  generateRecoverPasswordToken(userId: string): Promise<string | never> {
    return lastValueFrom(
      this.authAdapter.generate({ userId, type: 'recover' }),
    );
  }
}
