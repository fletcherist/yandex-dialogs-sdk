const reply = require('../reply')
const {
  ALICE_PROTOCOL_VERSION,
  DEFAULT_END_SESSION
} = require('../constants')

test('create reply with string constructor', () => {
  const expectedData = {
    response: {
      text: 'send message',
      buttons: [],
      end_session: DEFAULT_END_SESSION
    },
    session: null,
    version: ALICE_PROTOCOL_VERSION
  }

  const msg = reply(expectedData.response.text)
  expect(msg).toEqual(expectedData)
})

test('create reply with object constructor', () => {
  const expectedData = {
    response: {
      text: 'send message',
      tts: 'send m+essage',
      buttons: [],
      end_session: true
    },
    session: null,
    version: ALICE_PROTOCOL_VERSION
  }

  const msg = reply({
    text: expectedData.response.text,
    tts: expectedData.response.tts,
    buttons: expectedData.response.buttons,
    endSession: expectedData.response.end_session
  })
  expect(msg).toEqual(expectedData)
})