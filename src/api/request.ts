export interface IApiRequestMeta {
  locale: string;
  timezone: string;
  client_id: string;
}

enum ApiRequestBodyType {
  SimpleUtterance = 'SimpleUtterance',
  ButtonPressed = 'ButtonPressed',
}

export interface IApiRequesBody {
  command: string;
  original_utterance: string;
  type: ApiRequestBodyType;
  markup?: {
      dangerous_context?: true;
  };
  payload?: object;
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
  request: IApiRequesBody;
  session: IApiRequesSession;
  version: string;
}

