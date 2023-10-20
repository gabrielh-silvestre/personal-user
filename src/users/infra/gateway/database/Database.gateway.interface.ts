import type { IUserRepository } from '@users/domain/repository/user.repository.interface';

export type OrmUserDto = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IDatabaseGateway = IUserRepository;
