import type { IEvent } from '@shared/domain/event';

import { User } from '../entity/User';

export type PasswordTokenGeneratedPayload = {
  user: User;
  token: string;
};

export class RecoverPasswordRequested
  implements IEvent<PasswordTokenGeneratedPayload>
{
  public static eventName = 'RecoverPasswordRequested';
  payload: PasswordTokenGeneratedPayload;

  constructor(payload: PasswordTokenGeneratedPayload) {
    this.payload = payload;
  }

  get name(): string {
    return RecoverPasswordRequested.name;
  }
}
