import fetch from 'node-fetch';
import { ALICE_API_URL } from './constants';
import {
  IApiImageUploadResponse,
  IApiImageItem,
  IApiImageListResponse,
  IApiImageQuota,
  IApiImageQuotaResponse,
  IApiImageDeleteResponse,
} from './api/image';

export interface IImagesApiConfig {
  oAuthToken?: string;
  skillId?: string;
}

interface IImagesApiRequestParams {
  path?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'DELETE';
  body?: object;
}

export interface IImagesApi {
  uploadImageByUrl(url: string): Promise<IApiImageItem>;
  uploadImageFile(): Promise<IApiImageItem>;
  getImages(): Promise<IApiImageItem[]>;
  getImagesQuota(): Promise<IApiImageQuota>;
  deleteImage(imageId: string): Promise<IApiImageDeleteResponse>;
}

export class ImagesApi implements IImagesApi {
  private readonly _skillId: string | undefined;
  private readonly _oAuthToken: string | undefined;

  constructor(params: IImagesApiConfig) {
    this._skillId = params.skillId;
    this._oAuthToken = params.oAuthToken;
  }

  public async uploadImageByUrl(url: string): Promise<IApiImageItem> {
    const response = await this._makeRequest<IApiImageUploadResponse>({
      path: 'images',
      method: 'POST',
      body: { url },
    });
    return response.image;
  }

  public async uploadImageFile(): Promise<IApiImageItem> {
    throw new Error('Not implemented');
  }

  public async getImages(): Promise<IApiImageItem[]> {
    const response = await this._makeRequest<IApiImageListResponse>({
      path: 'images',
      method: 'GET',
    });
    return response.images;
  }

  public async getImagesQuota(): Promise<IApiImageQuota> {
    const response = await this._makeRequest<IApiImageQuotaResponse>({
      url: `${ALICE_API_URL}/status`,
      method: 'GET',
    });
    return response.images.quota;
  }

  public async deleteImage(imageId: string): Promise<IApiImageDeleteResponse> {
    const response = await this._makeRequest<IApiImageDeleteResponse>({
      path: `images/${imageId}`,
      method: 'DELETE',
    });
    return response;
  }

  private async _makeRequest<TResult>(
    params: IImagesApiRequestParams,
  ): Promise<TResult> {
    if (!this._oAuthToken) {
      throw new Error(
        `Please, provide "oAuthToken" and "skillId" to alice constructor`,
      );
    }
    const url =
      params.url || `${ALICE_API_URL}/skills/${this._skillId}/${params.path}`;
    const method = params.method || 'GET';
    const body = params.body ? JSON.stringify(params.body) : undefined;
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `OAuth ${this._oAuthToken}`,
        'Content-type': 'application/json',
      },
      body: body,
    });
    return await response.json() as TResult;
  }
}
