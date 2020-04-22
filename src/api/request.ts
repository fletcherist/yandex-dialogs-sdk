import { ApiRequestNlu } from './nlu';

export interface ApiRequestMeta {
  locale: string;
  timezone: string;
  client_id: string;
}

export interface ApiRequestBody {
  command: string;
  original_utterance: string;
  type: 'SimpleUtterance' | 'ButtonPressed';
  markup?: {
    dangerous_context?: true;
  };
  payload?: object;
  nlu?: ApiRequestNlu;
}

export interface ApiRequestSession {
  new: boolean;
  message_id: number;
  session_id: string;
  skill_id: string;
  user_id: string;
}

export interface ApiRequest {
  meta: ApiRequestMeta;
  request: ApiRequestBody;
  session: ApiRequestSession;
  version: string;
}
