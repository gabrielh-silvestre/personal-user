import { UserEventFactory } from './User.event.factory';

describe('Test Domain UserEventFactory', () => {
  it('should create a user created event', () => {
    const userCreatedEvent = UserEventFactory.created({} as any);

    expect(userCreatedEvent).toBeDefined();
    expect(userCreatedEvent.name).toBe('UserCreated');
    expect(userCreatedEvent.occurredAt).toBeInstanceOf(Date);
  });

  it('should create a user update username event', () => {
    const userUpdateUsernameEvent = UserEventFactory.usernameChanged({} as any);

    expect(userUpdateUsernameEvent).toBeDefined();
    expect(userUpdateUsernameEvent.name).toBe('UserUpdateUsername');
    expect(userUpdateUsernameEvent.occurredAt).toBeInstanceOf(Date);
  });
});
