export interface ISession {
  readonly id: string;
  has(key: string): boolean;
  delete<TValue = any>(key: string): void;
  get<TValue = any>(key: string): TValue;
  set<TValue = any>(key: string, value: TValue): void;
}

export interface ISessionStorage {
  getOrCreate(id: string): Promise<ISession>;
}
