export interface ApiEntityYandexFioValue {
  first_name?: string;
  patronymic_name?: string;
  last_name?: string;
}

export interface ApiEntityYandexGeoValue {
  country?: string;
  city?: string;
  street?: string;
  house_number?: number;
  airport?: string;
}

export interface ApiEntityYandexDateTimeValue {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  month_is_relative?: boolean;
  day_is_relative?: boolean;
  hour_is_relative?: boolean;
  minute_is_relative?: boolean;
}

export type ApiEntityYandexNumberValue = number;

export type ApiEntityType =
  | 'YANDEX.FIO'
  | 'YANDEX.GEO'
  | 'YANDEX.DATETIME'
  | 'YANDEX.NUMBER';

export interface ApiEntityBase {
  type: ApiEntityType;
}

export interface ApiEntityYandexFio extends ApiEntityBase {
  type: 'YANDEX.FIO';
  value: ApiEntityYandexFioValue;
}

export interface ApiEntityYandexGeo extends ApiEntityBase {
  type: 'YANDEX.GEO';
  value: ApiEntityYandexGeoValue;
}

export interface IApiEntityYandexDateTime extends ApiEntityBase {
  type: 'YANDEX.DATETIME';
  value: ApiEntityYandexDateTimeValue;
}

export interface IApiEntityYandexNumber extends ApiEntityBase {
  type: 'YANDEX.NUMBER';
  value: ApiEntityYandexNumberValue;
}

export type ApiEntity =
  | ApiEntityYandexFio
  | ApiEntityYandexGeo
  | IApiEntityYandexDateTime
  | IApiEntityYandexNumber;

export interface ApiRequestNlu {
  entities: ApiEntity[];
  tokens: string[];
}
