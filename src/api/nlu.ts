export interface IEntityYANDEX_FIO {
  first_name?: string
  patronymic_name?: string
  last_name?: string
}

export interface IEntityYANDEX_GEO {
  country?: string
  city?: string
  street?: string
  house_number?: number
  airport?: string
}

export interface IEntityYANDEX_DATETIME {
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

export type IEntityYANDEX_NUMBER = number

export interface IApiRequestNlu {
  entities: Array<{
    type: 'YANDEX.FIO' | 'YANDEX.GEO' | 'YANDEX.DATETIME' | 'YANDEX.NUMBER',
    value: IEntityYANDEX_FIO | IEntityYANDEX_GEO | IEntityYANDEX_DATETIME | IEntityYANDEX_NUMBER
  }>,
  tokens: any
}