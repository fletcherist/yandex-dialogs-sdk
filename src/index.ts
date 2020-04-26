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

import {
  reply,
  audio,
  br,
  buttons,
  effect,
  configure,
  image,
  enumerate,
  once,
  pause,
  plural,
  select,
  text,
  textTts,
  tts,
  userify,
} from 'alice-renderer';

export {
  reply,
  audio,
  br,
  buttons,
  effect,
  configure,
  image,
  enumerate,
  once,
  pause,
  plural,
  select,
  text,
  textTts,
  tts,
  userify,
};

export { Scene } from './stage/scene';
export { Stage } from './stage/stage';
export { StageContext } from './stage/stageContext';

export { Middleware, MiddlewareNext } from './middleware/middleware';

export { Alice } from './alice';
export { Context } from './context';
export { ImagesApi } from './imagesApi';

export default Alice;
