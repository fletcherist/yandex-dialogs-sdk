import { SessionStorage, Session } from './session';
import { InMemorySession } from './inMemorySession';

interface InMemorySessionsStorageItem {
  readonly creationTime: number;
  readonly session: Session;
}

export interface InMemorySessionsStorageParams {
  ttl?: number;
}

export class InMemorySessionStorage implements SessionStorage {
  private readonly _ttl: number;
  private readonly _sessions: Map<string, InMemorySessionsStorageItem>;

  constructor(params?: InMemorySessionsStorageParams) {
    this._ttl = (params && params.ttl) || Infinity;
    this._sessions = new Map<string, InMemorySessionsStorageItem>();
  }

  private _flushOutdatedSessions(): void {
    const now = Date.now();
    for (const [key, item] of this._sessions.entries()) {
      if (item.creationTime + this._ttl > now) {
        continue;
      }
      this._sessions.delete(key);
    }
  }

  public async getOrCreate(id: string): Promise<Session> {
    this._flushOutdatedSessions();

    let sessionItem = this._sessions.get(id);
    if (sessionItem) {
      return sessionItem.session;
    }

    sessionItem = {
      creationTime: Date.now(),
      session: new InMemorySession(id),
    };
    this._sessions.set(id, sessionItem);
    return sessionItem.session;
  }
}
