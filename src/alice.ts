import express from 'express'
import Commands from './commands'
import { Sessions } from './sessions'
import { merge, compose } from 'ramda'

import Scene from './scene'
import Ctx from './ctx'

import {
  selectCommand,
  selectSessionId,
  isFunction,
} from './utils'

import {
  applyMiddlewares,
  MiddlewareType,
} from './middlewares'

import aliceStateMiddleware from './middlewares/aliceStateMiddleware'

const DEFAULT_SESSIONS_LIMIT: number = 1000

export default class Alice {
  private anyCallback: (ctx: Ctx) => void
  private welcomeCallback: (ctx: Ctx) => void
  private commands: Commands
  private middlewares: any[]
  private scenes: Scene[]
  private currentScene: Scene | null
  private sessions: Sessions
  private config: {}
  private server: {}

  constructor(config = {}) {
    this.anyCallback = null
    this.welcomeCallback = null
    this.commands = new Commands(config.fuseOptions || null)
    this.middlewares = [aliceStateMiddleware()]
    this.scenes = []
    this.currentScene = null
    this.sessions = new Sessions()
    this.config = config

    this._handleEnterScene = this._handleEnterScene.bind(this)
    this._handleLeaveScene = this._handleLeaveScene.bind(this)
  }

  /* @TODO: Implement watchers (errors, messages) */
  // tslint:disable-next-line:no-empty
  public on() {

  }

  /*
   * Attach alice middleware to the application
   * @param {Function} middleware - function, that receives {context}
   * and makes some modifications with it.
   */
  public use(middleware) {
    if (!isFunction(middleware)) {
      throw new Error('Any middleware could only be a function.')
    }
    this.middlewares.push(middleware)
  }

  /*
   * Set up the command
   * @param {string | Array<string> | regex} name — Trigger for the command
   * @param {Function} callback — Handler for the command
   */
  public command(name, callback) {
    this.commands.add(name, callback)
  }

  /*
  * Стартовая команда на начало сессии
  */
  public welcome(callback) {
    this.welcomeCallback = callback
  }

  /*
   * Если среди команд не нашлось той,
   * которую запросил пользователь,
   * вызывается этот колбек
   */
  public any(callback) {
    this.anyCallback = callback
  }

  /*
   * Match the request with action handler,
   * compose and return a reply.
   * @param {Object} req — JSON request from the client
   * @param {Function} sendResponse — Express res function while listening on port.
   */
  public async handleRequestBody(req, sendResponse) {
    const requestedCommandName = selectCommand(req)

    /* clear old sessions */
    if (this.sessions.length > (this.config.sessionsLimit || DEFAULT_SESSIONS_LIMIT)) {
      this.sessions.flush()
    }

    /* initializing session */
    const sessionId = selectSessionId(req)
    const session = this.sessions.findOrCreate(sessionId)

    /* check whether current scene is not defined */
    if (!session.getData('currentScene')) {
      session.setData('currentScene', null)
    }

    /* give control to the current scene */
    if (session.getData('currentScene') !== null) {
      const matchedScene = this.scenes.find((scene) => {
        return scene.name === session.getData('currentScene')
      })

      /*
       * Checking whether that's the leave scene
       * activation trigger
       */
      if (matchedScene) {
        if (matchedScene.isLeaveCommand(requestedCommandName)) {
          matchedScene.handleRequest(req, sendResponse, session)
          session.setData('currentScene', null)
          return true
        } else {
          const sceneResponse = await matchedScene.handleRequest(
            req, sendResponse, session,
          )
          if (sceneResponse) {
            return true
          }
        }
      }
    } else {
      /*
       * Looking for scene's activational phrases
       */
      const matchedScene = this.scenes.find((scene) =>
        scene.isEnterCommand(requestedCommandName))
      if (matchedScene) {
        session.setData('currentScene', matchedScene.name)
        const sceneResponse = await matchedScene.handleRequest(
          req, sendResponse, session,
        )
        if (sceneResponse) {
          return true
        }
      }
    }

    const requestedCommands = this.commands.search(requestedCommandName)

    /*
     * Initializing context of the request
     */
    const ctxDefaultParams = {
      req,
      session,
      sendResponse: sendResponse || null,
      /*
       * if Alice is listening on express.js port, add this server instance
       * to the context
       */
      server: this.server || null,
      middlewares: this.middlewares,
    }

    /*
    * Если новая сессия, то запускаем стартовую команду
    */
    if (req.session.new && this.welcomeCallback) {
      /*
       * Patch context with middlewares
       */
      if (this.welcomeCallback) {
        // tslint:disable:no-shadowed-variable
        const ctxInstance = new Ctx(ctxDefaultParams)
        const ctxWithMiddlewares = await applyMiddlewares(this.middlewares, ctxInstance)
        // tslint:enable:no-shadowed-variable
        return await this.welcomeCallback(ctxWithMiddlewares)
      }
    }
    /*
     * Команда нашлась в списке.
     * Запускаем её обработчик.
     */
    if (requestedCommands.length !== 0) {
      const requestedCommand = requestedCommands[0]
      // tslint:disable:no-shadowed-variable
      const ctxInstance = new Ctx(merge(ctxDefaultParams, {
        command: requestedCommand,
      }))
      const ctxWithMiddlewares = await applyMiddlewares(this.middlewares, ctxInstance)
      // tslint:enable:no-shadowed-variable
      return await requestedCommand.callback(ctxWithMiddlewares)
    }

    /*
     * Такой команды не было зарегестрировано.
     * Переходим в обработчик исключений
     */
    const ctxInstance = new Ctx(ctxDefaultParams)
    const ctxWithMiddlewares = await applyMiddlewares(this.middlewares, ctxInstance)

    if (!this.anyCallback) {
      throw new Error([
        `alice.any(ctx => ctx.reply('404')) Method must be defined`,
        'to catch anything that not matches with commands',
      ].join('\n'))
    }
    return await this.anyCallback(ctxWithMiddlewares)
  }

  /*
   * Same as handleRequestBody, but syntax shorter
   */
  public async handleRequest(req, sendResponse) {
    return await this.handleRequestBody(req, sendResponse)
  }

  /*
   * Метод создаёт сервер, который слушает указанный порт.
   * Когда на указанный URL приходит POST запрос, управление
   * передаётся в @handleRequestBody
   *
   * При получении ответа от @handleRequestBody, результат
   * отправляется обратно.
   */
  public async listen(callbackUrl = '/', port = 80, callback: () => void) {
    return new Promise((resolve) => {
      const app = express()
      app.use(express.json())
      app.post(callbackUrl, async (req, res) => {
        const handleResponseCallback = (response) => res.send(response)
        try {
          return await this.handleRequestBody(req.body, handleResponseCallback)
        } catch (error) {
          throw new Error(error)
        }
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

  public registerScene(scene) {
    this.scenes.push(scene)
  }

  public stopListening() {
    if (this.server && this.server.close) {
      this.server.close()
    }
  }

  private _handleEnterScene(sceneName) {
    this.currentScene = sceneName
  }
  private _handleLeaveScene(sceneName) {
    this.currentScene = null
  }
}
