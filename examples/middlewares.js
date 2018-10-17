/**
 * Check out ready to use middleware from maintainer:
 * https://github.com/fletcherist/yandex-dialogs-sdk-lowdb - stores your session in a file
 */

const createMessagesCounterMiddleware = () => {
  let count = 0;
  return async (ctx, next) => {
    // You can do anything with context here
    count += 1;
    return next();
  };
};
alice.use(createMessagesCounterMiddleware());
