class ButtonBuilder {
  constructor() {
    this.button = {}
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
