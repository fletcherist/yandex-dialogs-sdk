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
  
})