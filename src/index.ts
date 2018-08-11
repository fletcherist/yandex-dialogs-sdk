export * from './api/image';
export * from './api/request';
export * from './api/response';

export {
  Command,
  CommandCallback,
  CommandCallbackResult,
  CommandMatcher,
} from './command/command';

import { Alice } from './alice';

/**
 * For compability with commonjs
 * @example const Alice = require('yandex-dialogs-sdk')
 */
module.exports = Alice;
exports = module.exports;

export default Alice;

export { Reply } from './reply/reply';

export { InMemorySession } from './session/inMemorySession';
export { InMemorySessionsStorage } from './session/inMemorySessionsStorage';
export { ISession, ISessionStorage } from './session/session';
export { ISessionContext } from './session/sessionContext';
export { sessionMiddleware } from './session/sessionMiddleware';

export { IStageСompere } from './stage/compere';
export { IScene, Scene } from './stage/scene';
export { IStage, Stage } from './stage/stage';
export { IStageContext } from './stage/stageContext';

export {
  IMiddlewareResult,
  Middleware,
  MiddlewareNext,
} from './middleware/middleware';

export { Alice, IAlice } from './alice';
export { IContext } from './context';
export { IImagesApi } from './imagesApi';
