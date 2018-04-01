const express = require('express')
const bodyParser = require('body-parser')
const Commands = require('./commands')

const Ctx = require('./ctx')
const selectCommand = req => req.request.command
const isFunction = fn => fn && typeof fn === 'function'

const DEFAULT_ANY_CALLBACK = () => 'Что-то пошло не так. Я не знаю, что на это сказать.'

class Alice {
  constructor(config = {}) {
    this.anyCallback = DEFAULT_ANY_CALLBACK
    this.commands = new Commands()
    this.middlewares = []
    this.scenes = []
    this.currentScene = null

    this._handleEnterScene = this._handleEnterScene.bind(this)
    this._handleLeaveScene = this._handleLeaveScene.bind(this)
  }

  /* @TODO: Implement watchers (errors, messages) */
  on() {

  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  /*
   * Set up the command
   * @param {string | Array<string> | regex} name — Trigger for the command
   * @param {Function} callback — Handler for the command
   */
  command(name, callback) {
    this.commands.add(name, callback)
  }

  /*
   * Если среди команд не нашлось той,
   * которую запросил пользователь,
   * вызывается этот колбек
   */
  any(callback) {
    this.anyCallback = callback
  }

  /*
   * Match the request with action handler,
   * compose and return a reply.
   * @param {Object} req — JSON request from the client
   * @param {Function} sendResponse — Express res function while listening on port.
   */
  async handleRequestBody(req, sendResponse) {
    const requestedCommandName = selectCommand(req)
    /* give control to the current scene */
    if (this.currentScene !== null) {
      /*
       * Checking whether that's the leave scene
       * activation trigger
       */
      if (this.currentScene.isLeaveCommand(requestedCommandName)) {
        this.currentScene.handleRequest(req, sendResponse)
        this.currentScene = null
        return true
      } else {
        const sceneResponse = await this.currentScene.handleRequest(
          req, sendResponse
        )
        if (sceneResponse) {
          return true
        }
      }
    } else {
      /*
       * Looking for scene's activational phrases
       */
      const matchedScene = this.scenes.find(scene =>
        scene.isEnterCommand(requestedCommandName))
      if (matchedScene) {
        this.currentScene = matchedScene
        const sceneResponse = await this.currentScene.handleRequest(
          req, sendResponse
        )
        if (sceneResponse) {
          return true
        }
      }
    }

    let requestedCommands = this.commands.search(requestedCommandName)

    /*
     * Инициализация контекста запроса
     */
    const ctx = new Ctx({
      req: req,
      sendResponse: sendResponse || null
    })
    /*
     * Команда нашлась в списке.
     * Запускаем её обработчик.
     */
    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      return await requestedCommand.callback.call(this, ctx)
    }

    /*
     * Такой команды не было зарегестрировано.
     * Переходим в обработчик исключений
     */
    return await this.anyCallback.call(this, ctx)
  }

  /*
   * Метод создаёт сервер, который слушает указанный порт.
   * Когда на указанный URL приходит POST запрос, управление
   * передаётся в @handleRequestBody
   *
   * При получении ответа от @handleRequestBody, результат
   * отправляется обратно.
   */
  async listen(callbackUrl = '/', port = 80, callback) {
    return new Promise(resolve => {
      const app = express()
      app.use(bodyParser.json())
      app.post(callbackUrl, async (req, res) => {
        const handleResponseCallback = response => res.send(response)
        const replyMessage = await this.handleRequestBody(req.body, handleResponseCallback)
      })
      this.server = app.listen(port, () => {
        // Resolves with callback function
        if (isFunction(callback)) {
          return callback.call(this)
        }

        // If no callback specified, resolves as a promise.
        return resolve()
        // Resolves with promise if no callback set
      })
    })
  }

  registerScene(scene) {
    this.scenes.push(scene)
  }

  stopListening() {
    if (this.server && this.server.close) {
      this.server.close()
    }
  }

  _handleEnterScene(sceneName) {
    this.currentScene = sceneName
  }
  _handleLeaveScene(sceneName) {
    console.log('leaving scene', sceneName)
    this.currentScene = null
  }
}

module.exports = Alice
