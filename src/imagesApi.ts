import fetch from 'node-fetch';
import { ALICE_API_URL } from './constants';
import {
  IApiImageUploadResponse,
  IApiImageItem,
  IApiImageListResponse,
} from './api/image';

export interface IImagesApiConfig {
  oAuthToken: string;
  skillId: string;
}

interface IImagesApiRequestParams {
  path: string;
  method?: 'GET' | 'POST';
  body?: Object;
}

export interface IImagesApi {
  uploadImageByUrl(url: string): Promise<IApiImageItem>;
  uploadImageFile(): Promise<IApiImageItem>;
  getImages(): Promise<IApiImageItem[]>;
}

export class ImagesApi implements IImagesApi {
  private readonly _skillId: string;
  private readonly _oAuthToken: string;

  constructor(params: IImagesApiConfig) {
    this._skillId = params.oAuthToken;
    this._oAuthToken = params.skillId;
  }

  private async _makeRequest<TResult>(
    params: IImagesApiRequestParams,
  ): Promise<TResult> {
    const url = `${ALICE_API_URL}/${this._skillId}/${params.path}`;
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
    return <TResult>await response.json();
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
}
