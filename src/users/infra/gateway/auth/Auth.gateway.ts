import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';
import type { OutputVerifyAuth, IAuthGateway } from './auth.gateway.interface';

import { QUEUE_ADAPTER } from '@users/utils/constants';

@Injectable()
export class AuthGateway implements IAuthGateway {
  constructor(
    @Inject(QUEUE_ADAPTER) private readonly queueAdapter: IQueueAdapter,
  ) {}

  verify(token: string): Promise<OutputVerifyAuth | never> {
    return lastValueFrom(
      this.queueAdapter.send('auth.verify_token', { token }),
    );
  }

  generateRecoverPasswordToken(userId: string): Promise<string | never> {
    return lastValueFrom(
      this.queueAdapter.send('auth.generate_recover_token', { userId }),
    );
  }
}
