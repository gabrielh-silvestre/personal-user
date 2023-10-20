import type {
  IEntity,
  IEntityProps,
} from '@shared/domain/entity/Entity.abstract';
import type { IPassword } from '../value-object/Password/password.interface';

export type UserProps = {
  username: string;
  email: string;
  password: IPassword;
};

export type IUserProps = IEntityProps<UserProps>;

export type IUser = IEntity<UserProps> & {
  get username(): string;
  get email(): string;
  get password(): IPassword;
};
