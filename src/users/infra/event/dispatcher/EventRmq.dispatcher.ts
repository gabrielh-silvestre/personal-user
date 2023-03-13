import { Inject } from '@nestjs/common';

import type { IUser } from '@users/domain/entity/user.interface';
import type { IEvent } from '@shared/domain/event/event.interface';
import type { IEventDispatcher } from '@shared/domain/event/event.dispatcher.interface';
import type { IQueueAdapter } from '@users/infra/adapter/queue/Queue.adapter.interface';

import { QUEUE_ADAPTER } from '@users/utils/constants';

export class EventRmqDispatcher implements IEventDispatcher<IUser> {
  constructor(
    @Inject(QUEUE_ADAPTER)
    private readonly queueAdapter: IQueueAdapter,
  ) {}

  notify(event: IEvent<IUser>): void {
    this.queueAdapter.emit(event.name, event);
  }

  register(): void {
    throw new Error('Method not implemented.');
  }

  unregister(): void {
    throw new Error('Method not implemented.');
  }

  unregisterAll(): void {
    throw new Error('Method not implemented.');
  }
}
