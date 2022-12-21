import type { Request } from 'express';

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import type {
  IRestPresenter,
  OutputRestPresenterDto,
} from '@users/infra/presenter/rest/Rest.presenter.interface';

export function RestInterceptor<T>(presenter: IRestPresenter<T>) {
  return class RestInterceptor
    implements NestInterceptor<T, OutputRestPresenterDto<T>>
  {
    readonly _presenter: IRestPresenter<T>;

    constructor() {
      this._presenter = presenter;
    }

    intercept(
      context: ExecutionContext,
      next: CallHandler<T>,
    ): Observable<OutputRestPresenterDto<T>> {
      const request = context.switchToHttp().getRequest<Request>();

      return next.handle().pipe(
        map(
          (data) =>
            this._presenter.present({
              selfLink: request.url,
              data,
            }) as OutputRestPresenterDto<T>,
        ),
      );
    }
  };
}
