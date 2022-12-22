import { Observable } from 'rxjs';

export interface InputMailPresenterDto {
  username: string;
  email: string;
  token?: string;
}

export interface OutputMailPresenterDto {
  text?: string;
  html: string;
}

export interface IMailPresenter {
  present(
    emailTemplate: string,
    dto: InputMailPresenterDto & { [key: string]: any },
  ):
    | Promise<OutputMailPresenterDto>
    | Observable<OutputMailPresenterDto>
    | OutputMailPresenterDto;
}
