export interface ApiResponseCardButton {
  text: string;
  url?: string;
  payload?: object;
}

export interface ApiResponseCardFooter {
  text: string;
  button?: ApiResponseCardButton;
}

export type ApiResponseCardType = 'BigImage' | 'ItemsList';

export interface ApiResponseCardBase {
  type: ApiResponseCardType;
}

export interface ApiResponseBigImageCard extends ApiResponseCardBase {
  type: 'BigImage';
  image_id: string;
  title?: string;
  description?: string;
  button?: ApiResponseCardButton;
  footer?: ApiResponseCardFooter;
}

export interface ApiResponseItemsListCardHeader {
  text: string;
}

export interface ApiResponseItemsListCardImage {
  image_id: string;
  title?: string;
  description?: string;
  button?: ApiResponseCardButton;
}

export interface ApiResponseItemsListCard extends ApiResponseCardBase {
  type: 'ItemsList';
  header?: ApiResponseItemsListCardHeader;
  items: ApiResponseItemsListCardImage[];
  footer?: ApiResponseCardFooter;
}

export type IApiResponseCard =
  | ApiResponseBigImageCard
  | ApiResponseItemsListCard;

export interface ApiResponseBodyButton {
  title: string;
  url?: string;
  payload?: object;
  hide?: boolean;
}

export interface ApiResponseBody {
  text: string;
  tts?: string;
  card?: IApiResponseCard;
  buttons?: ApiResponseBodyButton[];
  end_session: boolean;
}

export interface IApiResponseSession {
  message_id: number;
  session_id: string;
  user_id: string;
}

export interface ApiResponse {
  response: ApiResponseBody;
  session?: IApiResponseSession;
  version: string;
}
