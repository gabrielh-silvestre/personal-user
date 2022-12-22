import { User } from '@users/domain/entity/User';
import { IUser } from '@users/domain/entity/user.interface';

export interface IUserDatabaseAdapter {
  getAll(): Promise<User[]>;
  getOne<T extends Partial<IUser>>(dto: T): Promise<User | null>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
