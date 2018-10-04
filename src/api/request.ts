import { IApiRequestNlu } from './nlu'

export interface IApiRequestMeta {
  locale: string;
  timezone: string;
  client_id: string;
}

export interface IApiRequestBody {
  command: string;
  original_utterance: string;
  type: 'SimpleUtterance' | 'ButtonPressed';
  markup?: {
    dangerous_context?: true;
  };
  payload?: object;
  nlu: IApiRequestNlu
}

export interface IApiRequesSession {
  new: boolean;
  message_id: number;
  session_id: string;
  skill_id: string;
  user_id: string;
}

export interface IApiRequest {
  meta: IApiRequestMeta;
  request: IApiRequestBody;
  session: IApiRequesSession;
  version: string;
}
