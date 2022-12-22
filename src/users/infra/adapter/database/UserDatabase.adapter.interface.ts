import type { IUser } from '@users/domain/entity/user.interface';

import { User } from '@users/domain/entity/User';

export interface IUserDatabaseAdapter {
  findAll(): Promise<User[]>;
  findOne<T extends Partial<IUser>>(dto: T): Promise<User | null>;
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
