class ButtonBuilder {
  constructor(buttonConstructor) {
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
      title, text
    } = buttonConstructor
    if (!title && !text) {
      throw new Error('Button [title] or [text] is required for ButtonBuilder constructor.')
    }

    this.button = Object.assign({}, buttonConstructor)
    return this.button
  }

  _setTitle(title) {
    this.button.title = title
    return this
  }

  text(text) {
    return this._setTitle(text)
  }

  title(title) {
    return this._setTitle(title)
  }

  url(url) {
    this.button.url = url
    return this
  }

  shouldHide(flag) {
    this.button.hide = flag
    return this
  }

  payload(payload) {
    this.button.payload = payload
    return this
  }

  get() {
    return this.button
  }
}

module.exports = ButtonBuilder
