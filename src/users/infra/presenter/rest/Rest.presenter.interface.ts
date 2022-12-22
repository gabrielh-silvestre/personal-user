import { Observable } from 'rxjs';

export type ResponseLink = {
  self: {
    href: string;
  };
};

export type EmbeddedLink = {
  [key: string]: {
    _links: {
      href: string;
    };
  };
};

export interface InputRestPresenterDto<T> {
  selfLink: string;
  data: T;
}

export interface OutputRestPresenterDto<T> {
  _links: ResponseLink;
  _embedded?: EmbeddedLink[];
  data: T;
}

export interface IRestPresenter<T> {
  present(
    dto: InputRestPresenterDto<T>,
  ):
    | Promise<OutputRestPresenterDto<T>>
    | Observable<OutputRestPresenterDto<T>>
    | OutputRestPresenterDto<T>;
}
