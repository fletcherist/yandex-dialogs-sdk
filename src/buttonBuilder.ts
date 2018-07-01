
interface ButtonConstructor {
  title?: string // title and text — same
  text?: string
}
export default class ButtonBuilder {
  public button: {
    title?: string,
    url?: string,
    hide?: boolean,
    payload?: {},
  }
  constructor(buttonConstructor?: ButtonConstructor) {
    /* No button object passed to the constructor */
    if (!buttonConstructor) {
      this.button = {}
      return this
    }

    /* Object-constructor passed */
    if (typeof buttonConstructor !== 'object') {
      throw new Error('Invalid ButtonBuilder constructor type. Should be object')
    }
    const {
      title, text,
    } = buttonConstructor
    if (!title && !text) {
      throw new Error('Button [title] or [text] is required for ButtonBuilder constructor.')
    }

    this.button = buttonConstructor
    return this.button
  }

  public text(text) {
    return this._setTitle(text)
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

module.exports = ButtonBuilder
