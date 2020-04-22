export interface ApiImageItem {
  id: string;
  origUrl?: string;
}

export interface ApiImageUploadResponse {
  image: ApiImageItem;
}

export interface IApiImageListResponse {
  images: ApiImageItem[];
}

export interface IApiImageQuotaResponse {
  images: {
    quota: IApiImageQuota;
  };
}

export interface IApiImageQuota {
  total: number;
  used: number;
}

export interface IApiImageDeleteResponse {
  result: 'ok' | undefined;
}
