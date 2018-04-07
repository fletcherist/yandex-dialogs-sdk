const { merge } = require('ramda')

class Sessions {
  constructor() {
    this.sessions = {}
  }

  add(session) {
    const { sessionId } = session
    this.sessions[sessionId] = session
    return this.sessions[sessionId]
  }

  find(session) {
    if (!session) throw new Error('No session provided')
    return Object.values(this.sessions).find(_sess => session === _sess)
  }

  findById(sessionId) {
    if (this.sessions[sessionId]) {
      return this.sessions[sessionId]
    }
    return null
  }

  findOrCreate(sessionId) {
    if (this.findById(sessionId)) {
      return this.findById(sessionId)
    }

    const session = new Session(sessionId)
    this.add(session)
    return session
  }

  get length() {
    return Object.keys(this.sessions).length
  }

  removeById(sessionId) {
    if (sessionId) {
      delete this.sessions[sessionId]
      return true
    }
    return false
  }

  /* 
   * Remove all sessions
   */
  flush() {
    this.sessions = {}
  }
}

class Session {
  constructor(sessionId, data = {}) {
    if (!sessionId) throw new Error('Cant create new session. Missed {sessionId}')
    this.sessionId = sessionId
    this.data = data
  }

  set currentScene(scene) {
    this.data.currentScene = scene
  }

  get currentScene() {
    return this.data.currentScene
  }

  get() {
    return Object.freeze({
      sessionId: this.sessionId,
      data: this.data
    })
  }

  set(data) {
    if (typeof data !== 'object') {
      throw new Error(`Can't set data. Data should be an object`)
    }
    this.data = data
  }

  update(data) {
    this.data = merge(this.data, data)
  }
}


module.exports = Sessions
module.exports.Sessions = Sessions
module.exports.Session = Session
