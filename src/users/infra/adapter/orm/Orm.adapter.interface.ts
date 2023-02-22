export interface OrmUserDto {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrmAdapter {
  findAll(): Promise<OrmUserDto[]>;
  findOne<T extends Partial<OrmUserDto>>(dto: T): Promise<OrmUserDto | null>;
  create(data: OrmUserDto): Promise<void>;
  update(data: OrmUserDto): Promise<void>;
  delete(id: string): Promise<void>;
}
