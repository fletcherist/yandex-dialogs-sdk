import { merge } from 'ramda'
import Session from './session'

class Sessions {
  public sessions: {}
  constructor() {
    this.sessions = {}
  }

  public add(session) {
    const { sessionId } = session
    this.sessions[sessionId] = session
    return this.sessions[sessionId]
  }

  public find(session) {
    if (!session) { throw new Error('No session provided') }
    return Object.values(this.sessions).find((sessionCandidate) => session === sessionCandidate)
  }

  public findById(sessionId: string) {
    if (this.sessions[sessionId]) {
      return this.sessions[sessionId]
    }
    return null
  }

  public findOrCreate(sessionId: string) {
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

  public removeById(sessionId) {
    if (sessionId) {
      delete this.sessions[sessionId]
      return true
    }
    return false
  }

  /*
   * Remove all sessions
   */
  public flush() {
    this.sessions = {}
  }
}

module.exports = Sessions
module.exports.Sessions = Sessions
module.exports.Session = Session

export default Sessions
export {
  Sessions,
  Session,
}
