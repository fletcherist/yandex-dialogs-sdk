import express from 'express'
import Commands from './commands'
import { Sessions } from './sessions'

import Scene from './scene'
import Context from './context'
import ImagesApi from './imagesApi'
import fetch from 'node-fetch'

import { selectCommand, selectSessionId, isFunction, delay, rejectsIn } from './utils'

import { applyMiddlewares } from './middlewares'

import stateMiddleware from './middlewares/stateMiddleware'

import { IConfig, IAlice } from './types/alice'
import { ICommand } from './types/command'
import { IContext } from './types/context'
import { WebhookResponse, WebhookRequest } from './types/webhook'
import { EventInterface, EventEmitterInterface } from './types/eventEmitter'
import eventEmitter from './eventEmitter'

import {
    EVENT_MESSAGE_RECIEVED,
    EVENT_MESSAGE_NOT_SENT,
    DEFAULT_TIMEOUT_CALLBACK_MESSAGE,
    EVENT_MESSAGE_PROXIED,
    EVENT_MESSAGE_PROXY_ERROR,
} from './constants'

const DEFAULT_SESSIONS_LIMIT: number = 1000
const DEFAULT_RESPONSE_TIMEOUT = 1200

export default class Alice implements IAlice {
    public scenes: Scene[]

    protected anyCallback: (ctx: IContext) => void
    private welcomeCallback: (ctx: IContext) => void
    private timeoutCallback: (ctx: IContext) => void
    protected commands: Commands
    private middlewares: any[]
    private currentScene: Scene | null
    private sessions: Sessions
    private imagesApi: ImagesApi
    private server: {
        close: () => void
    }
    private eventEmitter: EventEmitterInterface
    protected config: IConfig

    constructor(config: IConfig = {}) {
        this.anyCallback = null
        this.welcomeCallback = null
        this.commands = new Commands(config.fuseOptions || null)
        this.middlewares = [stateMiddleware()]
        this.scenes = []
        this.currentScene = null
        this.sessions = new Sessions()
        this.config = config
        this.imagesApi = new ImagesApi({
            oAuthToken: this.config.oAuthToken,
            skillId: this.config.skillId,
        })

        this.timeoutCallback = async ctx => ctx.reply(DEFAULT_TIMEOUT_CALLBACK_MESSAGE)
    }

    /* @TODO: Implement watchers (errors, messages) */
    // tslint:disable-next-line:no-empty
    public on(event: EventInterface['type'], callback: EventInterface['callback']) {
        eventEmitter.subscribe(event, callback)
    }

    /**
     * Attach alice middleware to the application
     * @param {Function} middleware - function, that receives {context}
     * and makes some modifications with it.
     */
    public use(middleware: (IContext: IContext) => IContext): void {
        if (!isFunction(middleware)) {
            throw new Error('Any middleware could only be a function.')
        }
        this.middlewares.push(middleware)
    }

    /**
     * Set up the command
     * @param {string | Array<string> | regex} name — Trigger for the command
     * @param {Function} callback — Handler for the command
     */
    public command(name: ICommand, callback: (IContext) => void) {
        this.commands.add(name, callback)
    }

    /**
     * Стартовая команда на начало сессии
     */
    public welcome(callback: (IContext) => void): void {
        this.welcomeCallback = callback
    }

    /**
     * Если среди команд не нашлось той,
     * которую запросил пользователь,
     * вызывается этот колбек
     */
    public any(callback: (IContext) => void): void {
        this.anyCallback = callback
    }

    /**
     * Match the request with action handler,
     * compose and return a reply.
     * @param {Object} req — JSON request from the client
     * @param {Function} sendResponse — Express res function while listening on port.
     */
    public async handleRequestBody(req, sendResponse): Promise<any> {
        /* clear old sessions */
        if (this.sessions.length > (this.config.sessionsLimit || DEFAULT_SESSIONS_LIMIT)) {
            this.sessions.flush()
        }

        /* initializing session */
        const sessionId = selectSessionId(req)
        const session = this.sessions.findOrCreate(sessionId)

        /**
         * Initializing context of the request
         */
        const ctxDefaultParams = {
            req,
            session,
            sendResponse: sendResponse || null,
            /**
             * if Alice is listening on express.js port, add this server instance
             * to the context
             */
            server: this.server || null,
            scenes: this.scenes,
            middlewares: this.middlewares,
            eventEmitter,
        }
        const ctxInstance = new Context(ctxDefaultParams)
        const context = await applyMiddlewares(this.middlewares, ctxInstance)

        eventEmitter.dispatch(EVENT_MESSAGE_RECIEVED, {
            data: context.message,
            session: context.session,
        })

        /* check whether current scene is not defined */
        if (!session.getData('currentScene')) {
            session.setData('currentScene', null)
        }

        /* give control to the current scene */
        if (session.getData('currentScene') !== null) {
            const matchedScene = this.scenes.find(scene => {
                return scene.name === session.getData('currentScene')
            })

            /**
             * Checking whether that's the leave scene
             * activation trigger
             */
            if (matchedScene) {
                if (await matchedScene.isLeaveCommand(context)) {
                    const sceneResponse = await matchedScene.handleSceneRequest(
                        req,
                        sendResponse,
                        context,
                        'leave'
                    )
                    session.setData('currentScene', null)
                    return sceneResponse
                } else {
                    const sceneResponse = await matchedScene.handleSceneRequest(
                        req,
                        sendResponse,
                        context
                    )
                    if (sceneResponse) {
                        return sceneResponse
                    }
                }
            }
        } else {
            /**
             * Looking for scene's activational phrases
             */
            let matchedScene = null
            for (const scene of this.scenes) {
                const result = await scene.isEnterCommand(context)
                if (result) {
                    matchedScene = scene
                }
            }

            if (matchedScene) {
                session.setData('currentScene', matchedScene.name)
                const sceneResponse = await matchedScene.handleSceneRequest(
                    req,
                    sendResponse,
                    context,
                    'enter'
                )
                if (sceneResponse) {
                    return sceneResponse
                }
            }
        }

        const requestedCommands = await this.commands.search(context)
        /**
         * Если новая сессия, то запускаем стартовую команду
         */
        if (req.session.new && this.welcomeCallback) {
            /**
             * Patch context with middlewares
             */
            if (this.welcomeCallback) {
                return await this.welcomeCallback(context)
            }
        }
        /**
         * Команда нашлась в списке.
         * Запускаем её обработчик.
         */
        if (requestedCommands.length !== 0) {
            const requestedCommand: ICommand = requestedCommands[0]
            context.command = requestedCommand
            return await requestedCommand.callback(context)
        }

        /**
         * Такой команды не было зарегестрировано.
         * Переходим в обработчик исключений
         */
        if (!this.anyCallback) {
            throw new Error(
                [
                    `alice.any(ctx => ctx.reply('404')) Method must be defined`,
                    'to catch anything that not matches with commands',
                ].join('\n')
            )
        }
        return await this.anyCallback(context)
    }

    /**
     * Same as handleRequestBody, but syntax shorter
     */
    public async handleRequest(
        req: WebhookRequest,
        sendResponse?: (res: WebhookResponse) => void
    ): Promise<any> {
        return await Promise.race([
            /* proxy request to dev server, if enabled */
            this.config.devServerUrl
                ? await this.handleProxyRequest(req, this.config.devServerUrl, sendResponse)
                : await this.handleRequestBody(req, sendResponse),
            rejectsIn(this.config.responseTimeout || DEFAULT_RESPONSE_TIMEOUT),
        ])
            .then(result => result)
            .catch(async error => {
                eventEmitter.dispatch(EVENT_MESSAGE_NOT_SENT)
                this.timeoutCallback(new Context({ req, sendResponse }))
            })
    }
    /**
     * Метод создаёт сервер, который слушает указанный порт.
     * Когда на указанный URL приходит POST запрос, управление
     * передаётся в @handleRequestBody
     *
     * При получении ответа от @handleRequestBody, результат
     * отправляется обратно.
     */
    public async listen(webhookPath = '/', port = 80, callback?: () => void) {
        return new Promise(resolve => {
            const app = express()
            app.use(express.json())
            app.post(webhookPath, async (req, res) => {
                if (this.config.oAuthToken) {
                    res.setHeader('Authorization', this.config.oAuthToken)
                }
                res.setHeader('Content-type', 'application/json')

                let responseAlreadySent = false
                const handleResponseCallback = (response: WebhookResponse) => {
                    /* dont answer twice */
                    if (responseAlreadySent) {
                        return false
                    }
                    res.send(response)
                    responseAlreadySent = true
                }
                try {
                    return await this.handleRequest(req.body, handleResponseCallback)
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
        // Allow for multiple scenes to be registered at once.
        if (Array.isArray(scene)) {
            scene.forEach(sceneItem => this.scenes.push(sceneItem))
        } else {
            this.scenes.push(scene)
        }
    }

    public async uploadImage(imageUrl: string) {
        return await this.imagesApi.uploadImage(imageUrl)
    }

    public async getImages() {
        return await this.imagesApi.getImages()
    }

    public stopListening() {
        if (this.server && this.server.close) {
            this.server.close()
        }
    }

    private async handleProxyRequest(
        request: WebhookRequest,
        devServerUrl: string,
        sendResponse?: (res: WebhookResponse) => void
    ) {
        try {
            const res = await fetch(devServerUrl, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(request),
            })
            const json = await res.json()
            eventEmitter.dispatch(EVENT_MESSAGE_PROXIED, { data: request })
            return sendResponse(json)
        } catch (error) {
            eventEmitter.dispatch(EVENT_MESSAGE_PROXY_ERROR, { data: request })
        }
    }
}
