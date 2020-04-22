import { Session } from './session';

export class InMemorySession implements Session {
  public readonly id: string;
  private readonly _data: Map<string, any>;

  constructor(id: string) {
    this.id = id;
    this._data = new Map<string, any>();
  }

  public has(key: string): boolean {
    return this._data.has(key);
  }

  public delete(key: string): void {
    this._data.delete(key);
  }

  public get<TValue>(key: string): TValue {
    return this._data.get(key);
  }

  public set<TValue>(key: string, value: TValue): void {
    this._data.set(key, value);
  }
}
