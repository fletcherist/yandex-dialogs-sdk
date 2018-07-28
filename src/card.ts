import { ItemsListCard, BigImageCard, Image, Footer, Header } from './types/card'
import { IButton } from './types/button'

export const image = (params: string | Image): Image => {
    if (typeof params === 'string') {
        return {
            image_id: params,
        }
    }

    if (!params.image_id) {
        throw new Error('image_id is required while creating the image')
    }
    return {
        image_id: params.image_id,
        title: params.title || null,
        description: params.description || null,
        button: params.button || null,
    }
}

export const header = (text: string): Header => {
    return {
        text,
    }
}

export const footer = (text: string, button: IButton): Footer => {
    return {
        text,
        button,
    }
}

export const bigImageCard = (params: BigImageCard): BigImageCard => {
    return {
        type: 'BigImage',
        ...params,
    }
}

export const itemsListCard = (params: ItemsListCard): ItemsListCard => {
    return {
        type: 'ItemsList',
        ...params,
    }
}
