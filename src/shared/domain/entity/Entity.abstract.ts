export type IEntityMetadata = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IEntityProps<T = unknown> = {
  [K in keyof T]: T[K];
} & IEntityMetadata;

export type IEntity<T = unknown> = {
  get id(): string;
  get createdAt(): Date;
  get updatedAt(): Date;

  toDto(): IEntityProps<T>;
};

export abstract class Entity<T = unknown> implements IEntity<T> {
  private readonly _props: IEntityProps<T>;

  constructor(props: IEntityProps<T>) {
    this._props = props;
  }

  protected get props(): T {
    return this._props;
  }

  protected get<K extends keyof T>(key: K): T[K] | null {
    return this._props[key] ?? null;
  }

  protected set<K extends keyof T>(key: K, value: T[K]): void {
    if (!this._props[key]) return;

    this._props[key as any] = value;
    this._props.updatedAt = new Date();
  }

  public toDto(): IEntityProps<T> {
    return Object.fromEntries(Object.entries(this._props)) as any;
  }

  public get id(): string {
    return this._props.id;
  }

  public get createdAt(): Date {
    return this._props.createdAt;
  }

  public get updatedAt(): Date {
    return this._props.updatedAt;
  }
}

// export type IEntity<T = unknown> = typeof Entity<T>;
