class Scene {
  constructor(name) {
    this.name = name
    this.commands = []
  }
  get title() {
    return this.name
  }

  get enterCommand() {
    return this.enterCommand
  }

  get leaveCommand() {

  }

  on(event) {
    /* enter, leave, etc */
  }

  /*
   * Trigger to enter the scene
   */
  enter(name, callback) {

  }

  /*
   * Trigger to leave the scene
   */
  leave(name, callback) {

  }

  command(name, callback) {

  }
}

module.exports = Scene
