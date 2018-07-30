import http from 'http'
import fetch from 'node-fetch'
import Commands from './commands'
import { Sessions } from './sessions'

import Scene from './scene'
import Context from './context'
import ImagesApi from './imagesApi'

import { selectSessionId, isFunction, rejectsIn } from './utils'
import { applyMiddlewares } from './middlewares'
import stateMiddleware from './middlewares/stateMiddleware'
import eventEmitter from './eventEmitter'

import { IConfig, IAlice } from './types/alice'
import { ICommand } from './types/command'
import { IContext } from './types/context'
import { WebhookResponse, WebhookRequest } from './types/webhook'
import { EventInterface, EventEmitterInterface } from './types/eventEmitter'

import {
    EVENT_MESSAGE_RECIEVED,
    EVENT_MESSAGE_NOT_SENT,
    DEFAULT_TIMEOUT_CALLBACK_MESSAGE,
    EVENT_MESSAGE_PROXIED,
    EVENT_MESSAGE_PROXY_ERROR,
    EVENT_SERVER_STARTED,
    EVENT_SERVER_STOPPED,
} from './constants'

const DEFAULT_SESSIONS_LIMIT: number = 1000
const DEFAULT_RESPONSE_TIMEOUT = 1200

export default class Alice implements IAlice {
    public scenes: Scene[]

    protected anyCallback: (ctx: IContext) => void
    protected config: IConfig
    protected commands: Commands
    private welcomeCallback: (ctx: IContext) => void
    private timeoutCallback: (ctx: IContext) => void
    private middlewares: any[]
    private currentScene: Scene | null
    private sessions: Sessions
    private imagesApi: ImagesApi
    private server: {
        close: () => void
    }
    private eventEmitter: EventEmitterInterface

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

    // Handler for every new session
    public welcome(callback: (IContext) => void): void {
        this.welcomeCallback = callback
    }

    public command(name: ICommand, callback: (IContext) => void) {
        this.commands.add(name, callback)
    }

    // If no matches, this fn will be invoked
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
                        'leave',
                    )
                    session.setData('currentScene', null)
                    return sceneResponse
                } else {
                    const sceneResponse = await matchedScene.handleSceneRequest(
                        req,
                        sendResponse,
                        context,
                    )
                    if (sceneResponse) {
                        return sceneResponse
                    }
                }
            }
        } else {
            // Looking for scene's activational phrases
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
                    'enter',
                )
                if (sceneResponse) {
                    return sceneResponse
                }
            }
        }

        const requestedCommands = await this.commands.search(context)
        if (req.session.new && this.welcomeCallback) {
            if (this.welcomeCallback) {
                return await this.welcomeCallback(context)
            }
        }

        // It's a match with registered command
        if (requestedCommands.length !== 0) {
            const requestedCommand: ICommand = requestedCommands[0]
            context.command = requestedCommand
            return await requestedCommand.callback(context)
        }

        // No matches with commands
        if (!this.anyCallback) {
            throw new Error(
                [
                    `alice.any(ctx => ctx.reply('404')) Method must be defined`,
                    'to catch anything that not matches with commands',
                ].join('\n'),
            )
        }
        return await this.anyCallback(context)
    }

    // same as handleRequestBody, syntax sugar
    public async handleRequest(
        req: WebhookRequest,
        sendResponse?: (res: WebhookResponse) => void,
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

    public async listen(webhookPath = '/', port = 80, callback?: () => void) {
        return new Promise(resolve => {
            this.server = http
                .createServer(async (request, response) => {
                    const body = []
                    request
                        .on('data', chunk => {
                            body.push(chunk)
                        })
                        .on('end', async () => {
                            const requestData = Buffer.concat(body).toString()
                            if (request.method === 'POST' && request.url === webhookPath) {
                                const handleResponseCallback = (responseBody: WebhookResponse) => {
                                    response.statusCode = 200
                                    response.setHeader('Content-Type', 'application/json')
                                    response.end(JSON.stringify(responseBody))
                                }
                                try {
                                    const requestBody = JSON.parse(requestData)
                                    return await this.handleRequest(
                                        requestBody,
                                        handleResponseCallback,
                                    )
                                } catch (error) {
                                    throw new Error(error)
                                }
                            } else {
                                response.statusCode = 400
                                response.end()
                            }
                        })
                })
                .listen(port, () => {
                    eventEmitter.dispatch(EVENT_SERVER_STARTED)
                    if (isFunction(callback)) {
                        return callback()
                    }
                    return resolve()
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

    public stopListening(): void {
        if (this.server && this.server.close) {
            this.server.close()
            eventEmitter.dispatch(EVENT_SERVER_STOPPED)
        }
    }

    private async handleProxyRequest(
        request: WebhookRequest,
        devServerUrl: string,
        sendResponse?: (res: WebhookResponse) => void,
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
