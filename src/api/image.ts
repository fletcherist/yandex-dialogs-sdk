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
