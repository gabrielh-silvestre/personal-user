import { v4 as uuid } from 'uuid';

import type { IUser } from '../entity/user.interface';

import { UserCreatedEvent } from '../event/UserCreated.event';
import { UserChangedPasswordEvent } from '../event/UserChangedPassword.event';
import { UserUpdatedUsernameEvent } from '../event/UserUpdatedUsername.event';

export class UserEventFactory {
  static created(user: IUser): UserCreatedEvent {
    return new UserCreatedEvent(uuid(), user);
  }

  static usernameChanged(user: IUser): UserUpdatedUsernameEvent {
    return new UserUpdatedUsernameEvent(uuid(), user);
  }

  static changedPassword(user: IUser): UserChangedPasswordEvent {
    return new UserChangedPasswordEvent(uuid(), user);
  }
}
