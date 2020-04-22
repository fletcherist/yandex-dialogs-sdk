import fetch from 'node-fetch';
import { ALICE_API_URL } from './constants';
import {
  ApiImageUploadResponse,
  ApiImageItem,
  IApiImageListResponse,
  IApiImageQuota,
  IApiImageQuotaResponse,
  IApiImageDeleteResponse,
} from './api/image';

export interface ImagesApiConfig {
  oAuthToken?: string;
  skillId?: string;
}

interface ImagesApiRequestParams {
  path?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'DELETE';
  body?: object;
}

export class ImagesApi {
  private readonly _skillId: string | undefined;
  private readonly _oAuthToken: string | undefined;

  constructor(params: ImagesApiConfig) {
    this._skillId = params.skillId;
    this._oAuthToken = params.oAuthToken;
  }

  public async uploadImageByUrl(url: string): Promise<ApiImageItem> {
    const response = await this._makeRequest<ApiImageUploadResponse>({
      path: 'images',
      method: 'POST',
      body: { url },
    });
    return response.image;
  }

  public async uploadImageFile(): Promise<ApiImageItem> {
    throw new Error('Not implemented');
  }

  public async getImages(): Promise<ApiImageItem[]> {
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
    params: ImagesApiRequestParams,
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
        Authorization: `OAuth ${this._oAuthToken}`,
        'Content-type': 'application/json',
      },
      body: body,
    });
    return (await response.json()) as TResult;
  }
}
