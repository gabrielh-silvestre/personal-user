import type { IEventDispatcher } from '@shared/domain/event/event.dispatcher.interface';
import type { IUser } from '@users/domain/entity/user.interface';

import { User } from '@users/domain/entity/User';
import { UserFactory } from '@users/domain/factory/User.factory';

export const FAKE_EVENT_DISPATCHER: IEventDispatcher<IUser> = {
  notify: jest.fn(),
  register: jest.fn(),
  unregister: jest.fn(),
  unregisterAll: jest.fn(),
};

export const USERS_MOCK: User[] = [
  UserFactory.create(
    FAKE_EVENT_DISPATCHER,
    'John',
    'john@email.com',
    'password',
  ),
  UserFactory.create(FAKE_EVENT_DISPATCHER, 'Doe', 'doe@email.com', 'password'),
  UserFactory.create(
    FAKE_EVENT_DISPATCHER,
    'Jane',
    'jane@email.com',
    'password',
  ),
];
