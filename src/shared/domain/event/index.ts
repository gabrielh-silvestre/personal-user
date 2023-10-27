export interface IEvent<T = unknown> {
  name: string;
  payload: T;
}
