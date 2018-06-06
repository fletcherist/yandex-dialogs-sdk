const button = params => {
	// Button has been created from string
	if (typeof params === 'string') {
		return {
			title: params
		}
	}

	if (typeof params === 'object') {
		const {
      title,
      text,
      tts,
      url,
      shouldHide = false,
      payload
    } = params

    if (!title && !text) {
    	throw new Error('text is a required parameter')
    }

    return {
    	title: title || text,
    	tts,
    	url,
    	shouldHide,
    	payload
    }
	}

	// Handles when you pass neither String nor Object as button params
	throw new Error('Invalid button constructor argument. Use String or Object instead.')
}

module.exports = button