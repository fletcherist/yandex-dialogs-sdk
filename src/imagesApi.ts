import { ALICE_API_URL } from './constants'

export function getHeaders({
  oAuthToken,
}) {
 return {
    'Authorization': `OAuth ${oAuthToken}`,
    'Content-type': 'application/json',
  }
}

export default class ImagesApi {
  public skillId: string
  public oAuthToken: string
  constructor({
    oAuthToken,
    skillId,
  }) {
    this.oAuthToken = oAuthToken
    this.skillId = skillId
  }

  public async uploadImage(imageUrl: string) {
    try {
      this.checkProps()
      const res = await fetch(`${ALICE_API_URL}/${this.skillId}/images`, {
        method: 'POST',
        headers: getHeaders({ oAuthToken: this.oAuthToken }),
        body: JSON.stringify({
          url: imageUrl,
        }),
      })
      const json = await res.json()
      return json
    } catch (error) {
      return error
    }
  }

  public async getImages() {
    this.checkProps()
    try {
      const res = await fetch(`${ALICE_API_URL}/${this.skillId}/images`, {
        method: 'GET',
        headers: getHeaders({ oAuthToken: this.oAuthToken }),
      })
      const json = await res.json()
      return json
    } catch (error) {
      return error
    }
  }

  private checkProps() {
    if (!this.skillId) {
      throw new Error('Please, provide {skillId} to alice constructor')
    }
    if (!this.oAuthToken) {
      throw new Error('Please, provide {oAuthToken} to alice constructor')
    }
  }
}
