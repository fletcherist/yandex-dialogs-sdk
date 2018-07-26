import reply from '../reply'
import { bigImageCard, image, footer } from '../card'
import button from '../button'
import Context from '../context'
import {
  ALICE_PROTOCOL_VERSION,
  DEFAULT_END_SESSION,
} from '../constants'
import { generateRequest } from './testUtils'

const MOCKED_IMAGE_ID = '213044/2a175da14f91b71df60c'

test('create reply with string constructor', () => {
  const expectedData = {
    response: {
      text: 'send message',
      buttons: [],
      end_session: DEFAULT_END_SESSION,
    },
    session: null,
    version: ALICE_PROTOCOL_VERSION,
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
      end_session: true,
    },
    session: null,
    version: ALICE_PROTOCOL_VERSION,
  }

  const msg = reply({
    text: expectedData.response.text,
    tts: expectedData.response.tts,
    buttons: expectedData.response.buttons,
    endSession: expectedData.response.end_session,
  })
  expect(msg).toEqual(expectedData)
})

test('creating new image', () => {
  expect(image(MOCKED_IMAGE_ID)).toEqual({
    image_id: MOCKED_IMAGE_ID,
  })
})

test('ctx.replyWithImage string', () => {
  const ctx = new Context({
    req: generateRequest('test')
  })
  const mockedImageId = '213044/2a175da14f91b71df60c'

  const res = ctx.replyWithImage(mockedImageId)
  expect(res.response.card).toEqual({
    type: 'BigImage',
    image_id: mockedImageId,
  })
})

test('ctx.replyWithImage object', () => {
  const ctx = new Context({
    req: generateRequest('test')
  })
  const mockedBigImage = {
    image_id: MOCKED_IMAGE_ID,
    title: '1',
    description: '1',
    button: button('123'),
    footer: footer('1', button('123')),
  }

  const res = ctx.replyWithImage(mockedBigImage)
  expect(res.response.card).toEqual({
    type: 'BigImage',
    image_id: MOCKED_IMAGE_ID,
    button: button('123'),
    title: '1',
    description: '1',
    footer: footer('1', button('123')),
  })
})
