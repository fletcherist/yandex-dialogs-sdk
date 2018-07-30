import { IButton } from './types/button'

export default class ButtonBuilder {
    private button: IButton
    constructor(buttonConstructor?: IButton) {
        /* No button object passed to the constructor */
        if (!buttonConstructor) {
            this.button = {
                title: '',
            }
            return this
        }

        this.button = buttonConstructor
        return this
    }

    public title(title) {
        return this._setTitle(title)
    }

    public url(url) {
        this.button.url = url
        return this
    }

    public shouldHide(flag) {
        this.button.hide = flag
        return this
    }

    public payload(payload) {
        this.button.payload = payload
        return this
    }

    public get() {
        return this.button
    }

    private _setTitle(title) {
        this.button.title = title
        return this
    }
}
