import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';

import type { IQueueAdapter } from '../Queue.adapter.interface';

import { USER_QUEUE } from '@users/utils/constants';

@Injectable()
export class QueueRmqAdapter implements IQueueAdapter {
  constructor(@Inject(USER_QUEUE) private readonly client: ClientProxy) {}

  send<T>(event: string, data: any): Observable<T> {
    return this.client.send(event, data).pipe(timeout(6000));
  }

  emit(event: string, data: any): void {
    this.client.emit(event, data);
  }
}
