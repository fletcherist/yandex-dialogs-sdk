const {
	DEFAULT_END_SESSION,
	ALICE_PROTOCOL_VERSION
} = require('./constants')

const reply = (params) => {
	const data = {
	  response: {
	    buttons: [],
	    end_session: DEFAULT_END_SESSION
	  },
	  session: null,
	  version: ALICE_PROTOCOL_VERSION
	}

	if (typeof params === 'string') {
		data.response.text = params
		return data
	} else if (typeof params === 'object') {
		const {
			text,
			tts,
			shouldEndSession,
			end_session
		} = params

		if (text) data.response.text = text
		if (tts) data.response.tts = tts
		if (shouldEndSession || end_session) data.response.end_session = shouldEndSession || end_session

		return data
	} else {
		throw new Error('reply: invalid parameter. Use Object or String instead')
	}
}

module.exports = reply