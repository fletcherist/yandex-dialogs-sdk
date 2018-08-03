import { ISession } from "./session";

export class InMemorySession implements ISession {
  public readonly id: string;
  private readonly _data: Map<string, any>;

  constructor(id: string) {
    this.id = id;
    this._data = new Map<string, any>();
  }

  has(key: string): boolean {
    return this._data.has(key);
  }

  delete(key: string): void {
    this._data.delete(key);
  }

  get<TValue>(key: string): TValue {
    return this._data.get(key);
  }

  set<TValue>(key: string, value: TValue): void {
    this._data.set(key, value);
  }
}
