import { IButton } from './button'

export interface Image {
    image_id: string
    title?: string
    description?: string
    button?: IButton
}

export interface Footer {
    text: string
    button: IButton
}

export interface Header {
    text: string
}

export interface BigImageCard {
    type?: 'BigImage'
    image_id: string
    title?: string
    description?: string
    button?: IButton
    footer?: Footer
}

export interface ItemsListCard {
    type?: 'ItemsList'
    header?: {
        text: string
    }
    items: Image[]
    footer?: Footer
}
