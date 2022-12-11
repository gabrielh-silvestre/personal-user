import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';

import type { AuthResponse, IAuthAdapter } from '../Auth.adapter.interface';

@Injectable()
export class AuthServiceAdapter implements IAuthAdapter {
  verify(_token: string): Observable<AuthResponse | null> {
    // TODO: Remove and implement rmq adapter
    return from([null]);
  }
}
