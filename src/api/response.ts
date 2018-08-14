export interface IApiResponseCardButton {
  text: string;
  url?: string;
  payload?: object;
}

export interface IApiResponseCardFooter {
  text: string;
  button?: IApiResponseCardButton;
}

export type ApiResponseCardType = 'BigImage' | 'ItemsList';

export interface IApiResponseCardBase {
  type: ApiResponseCardType;
}

export interface IApiResponseBigImageCard extends IApiResponseCardBase {
  type: 'BigImage';
  image_id: string;
  title?: string;
  description?: string;
  button?: IApiResponseCardButton;
  footer?: IApiResponseCardFooter;
}

export interface IApiResponseItemsListCardHeader {
  text: string;
}

export interface IApiResponseItemsListCardImage {
  image_id: string;
  title?: string;
  description?: string;
  button?: IApiResponseCardButton;
}

export interface IApiResponseItemsListCard extends IApiResponseCardBase {
  type: 'ItemsList';
  header?: IApiResponseItemsListCardHeader;
  items: IApiResponseItemsListCardImage[];
  footer?: IApiResponseCardFooter;
}

export type IApiResponseCard =
  | IApiResponseBigImageCard
  | IApiResponseItemsListCard;

export interface IApiResponseBodyButton {
  title: string;
  url?: string;
  payload?: object;
  hide?: boolean;
}

export interface IApiResponseBody {
  text: string;
  tts?: string;
  card?: IApiResponseCard;
  buttons?: IApiResponseBodyButton[];
  end_session: boolean;
}

export interface IApiResponseSession {
  message_id: number;
  session_id: string;
  user_id: string;
}

export interface IApiResponse {
  response: IApiResponseBody;
  session?: IApiResponseSession;
  version: string;
}
