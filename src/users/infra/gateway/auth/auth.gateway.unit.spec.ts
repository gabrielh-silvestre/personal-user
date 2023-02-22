import { from } from 'rxjs';

import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';
import type { IAuthGateway } from './auth.gateway.interface';

import { AuthGateway } from './Auth.gateway';

import { USERS_MOCK } from '@shared/utils/mocks/users.mock';

const [{ id: userId }] = USERS_MOCK;

const QUEUE_ADAPTER: IQueueAdapter = {
  send: jest.fn().mockReturnValue(from('test-message')),
  emit: jest.fn(),
};

describe('Unit test for Auth gateway', () => {
  let authGateway: IAuthGateway;

  beforeEach(() => {
    authGateway = new AuthGateway(QUEUE_ADAPTER);
  });

  it('should verify a token', async () => {
    await authGateway.verify('fake-token');

    expect(QUEUE_ADAPTER.send).toBeCalledWith('auth.verify_token', {
      token: 'fake-token',
    });
  });

  it('should generate a recover password token', async () => {
    await authGateway.generateRecoverPasswordToken(userId);

    expect(QUEUE_ADAPTER.send).toBeCalledWith('auth.generate_recover_token', {
      userId,
    });
  });
});
