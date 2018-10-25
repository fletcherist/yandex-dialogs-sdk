export interface IApiEntityYandexFioValue {
  first_name?: string
  patronymic_name?: string
  last_name?: string
}

export interface IApiEntityYandexGeoValue {
  country?: string
  city?: string
  street?: string
  house_number?: number
  airport?: string
}

export interface IApiEntityYandexDateTimeValue {
  year?: number
  month?: number
  day?: number
  hour?: number
  minute?: number
  month_is_relative?: boolean
  day_is_relative?: boolean
  hour_is_relative?: boolean
  minute_is_relative?: boolean
}

export type IApiEntityYandexNumberValue = number

export type IApiEntityType =
  | 'YANDEX.FIO'
  | 'YANDEX.GEO'
  | 'YANDEX.DATETIME'
  | 'YANDEX.NUMBER';

export type IApiEntityBase = {
  type: IApiEntityType,
}

export interface IApiEntityYandexFio extends IApiEntityBase {
  type: 'YANDEX.FIO',
  value: IApiEntityYandexFioValue,
}

export interface IApiEntityYandexGeo extends IApiEntityBase {
  type: 'YANDEX.GEO',
  value: IApiEntityYandexGeoValue,
}

export interface IApiEntityYandexDateTime extends IApiEntityBase {
  type: 'YANDEX.DATETIME',
  value: IApiEntityYandexDateTimeValue,
}

export interface IApiEntityYandexNumber extends IApiEntityBase {
  type: 'YANDEX.NUMBER',
  value: IApiEntityYandexNumberValue,
}

export type IApiEntity =
  | IApiEntityYandexFio
  | IApiEntityYandexGeo
  | IApiEntityYandexDateTime
  | IApiEntityYandexNumber;

export interface IApiRequestNlu {
  entities: Array<IApiEntity>,
  tokens: any
}
