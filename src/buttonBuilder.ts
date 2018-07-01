export default class ButtonBuilder {
  constructor(buttonConstructor?: {}) {
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

    this.button = Object.assign({}, buttonConstructor)
    return this.button
  }

  public _setTitle(title) {
    this.button.title = title
    return this
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
}

module.exports = ButtonBuilder
