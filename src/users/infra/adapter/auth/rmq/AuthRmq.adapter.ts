import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import type { AuthResponse, IAuthAdapter } from '../Auth.adapter.interface';

@Injectable()
export class AuthRmqAdapter implements IAuthAdapter {
  constructor(@Inject('AUTH') private readonly client: ClientProxy) {}

  verify(token: string): Observable<AuthResponse> {
    return this.client.send('auth.verify_token', { token });
  }
}
