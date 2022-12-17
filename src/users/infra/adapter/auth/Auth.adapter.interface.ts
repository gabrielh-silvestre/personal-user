import { Observable } from 'rxjs';

export type OutputVerifyToken = {
  userId: string;
};

export type InputGenerateToken = {
  userId: string;
  type: 'recover';
};

export interface IAuthAdapter {
  verify(token: string): Observable<OutputVerifyToken | null>;
  generate(data: InputGenerateToken): Observable<string | never>;
}
