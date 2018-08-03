import Alice, {
    Scene,
    reply,
    button,
    ReplyBuilder,
    ButtonBuilder,
    loggerMiddleware
} from '../../dist/index'

test('typescript import modules', () => {
    expect(Alice).toBeDefined()
    expect(Scene).toBeDefined()
    expect(reply).toBeDefined()
    expect(button).toBeDefined()
    expect(ReplyBuilder).toBeDefined()
    expect(ButtonBuilder).toBeDefined()
    expect(loggerMiddleware).toBeDefined()
})

test('commonjs require modules', () => {
    const AliceCommon = require('../../dist/index')
    const { Scene, reply, button, ReplyBuilder, ButtonBuilder, loggerMiddleware } = AliceCommon
    expect(AliceCommon).toBeDefined()
    expect(Scene).toBeDefined()
    expect(reply).toBeDefined()
    expect(button).toBeDefined()
    expect(ReplyBuilder).toBeDefined()
    expect(ButtonBuilder).toBeDefined()
    expect(loggerMiddleware).toBeDefined()
})