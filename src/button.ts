import { IButton } from './types/button'
const button = (params: IButton | string): IButton => {
    // Button has been created from string
    if (typeof params === 'string') {
        return {
            title: params,
        }
    }

    if (typeof params === 'object') {
        const { title, tts, url, hide = false, payload } = params

        if (!title) {
            throw new Error('text is a required parameter')
        }

        return {
            title: title,
            tts,
            url,
            hide,
            payload,
        }
    }

    // Handles when you pass neither String nor Object as button params
    throw new Error('Invalid button constructor argument. Use String or Object instead.')
}

export default button
