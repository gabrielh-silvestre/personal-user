import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import type {
  OutputVerifyToken,
  IAuthAdapter,
  InputGenerateToken,
} from '../Auth.adapter.interface';

import { AUTH_QUEUE } from '@users/utils/constants';

@Injectable()
export class AuthRmqAdapter implements IAuthAdapter {
  constructor(@Inject(AUTH_QUEUE) private readonly client: ClientProxy) {}

  verify(token: string): Observable<OutputVerifyToken> {
    return this.client.send('auth.verify_token', { token });
  }

  generate({ userId, type }: InputGenerateToken): Observable<string> {
    return this.client.send(`auth.generate_${type}_token`, { userId });
  }
}
