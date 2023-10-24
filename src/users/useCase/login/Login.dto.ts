export interface InputLoginDto {
  email: string;
  password: string;
}

export type UserProps = {
  id: string;
  email: string;
};

export interface OutputLoginDto {
  token: string;
  user: UserProps;
}
