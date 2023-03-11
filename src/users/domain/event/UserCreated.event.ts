import type { IEvent } from '@shared/domain/event/event.interface';
import type { IUser } from '../entity/user.interface';

export class UserCreatedEvent implements IEvent<IUser> {
  private readonly _id: string;
  private readonly _name: string = 'UserCreated';
  private readonly _payload: IUser;
  private readonly _occurredAt: Date = new Date();

  constructor(id: string, payload: IUser) {
    this._id = id;
    this._payload = payload;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get payload(): IUser {
    return this._payload;
  }

  get occurredAt(): Date {
    return this._occurredAt;
  }
}
