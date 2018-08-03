const { Sessions, Session } = require('../sessions')

test('session methods', () => {
    const session = new Session('some-session-id')
    expect(session.sessionId).toBe('some-session-id')

    const mockedSet = {
        foo: 'bar',
    }
    session.set(mockedSet)
    expect(session.data).toEqual(mockedSet)

    const mockedUpdate = {
        bar: 'baz',
        foo: 'foo',
    }
    session.update(mockedUpdate)
    expect(session.data).toEqual(mockedUpdate)
})

test('Creating session array', () => {
    const sessions = new Sessions()
    const session = new Session('some-session-id')
    sessions.add(session)

    expect(sessions.length).toBe(1)
    /* test found session */
    expect(sessions.findById(session.sessionId)).toBe(session)
    /* test not found session */
    expect(sessions.findById('')).toBe(null)

    /* when something changes in session
    it should change in sessions too
  */
    const mockedUpdate = {
        foo: 'bar',
    }
    session.update(mockedUpdate)
    expect(sessions.find(session)).toEqual(session)
    expect(sessions.find(session).data).toEqual(mockedUpdate)
})
