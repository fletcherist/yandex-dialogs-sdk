export interface IApiImageItem {
  id: string;
  origUrl?: string;
}

export interface IApiImageUploadResponse {
  image: IApiImageItem;
}

export interface IApiImageListResponse {
  images: IApiImageItem[];
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
