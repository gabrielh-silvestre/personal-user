import { Observable } from 'rxjs';

export interface InputMailPresenterDto {
  username: string;
  email: string;
  token?: string;
}

export interface OutputMailPresenterDto {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

export interface IMailPresenter {
  present(
    dto: InputMailPresenterDto,
  ):
    | Promise<OutputMailPresenterDto>
    | Observable<OutputMailPresenterDto>
    | OutputMailPresenterDto;
}
