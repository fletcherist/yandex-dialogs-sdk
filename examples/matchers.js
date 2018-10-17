const { Alice, Reply } = require('yandex-dialogs-sdk');
const alice = new Alice();

/**
 * You can easily define your own match function
 */
alice.command(
  ctx => {
    if (!ctx.session.get('number')) {
      ctx.session.set('number', 1);
    }
    ctx.session.set('number', ctx.session.get('number') + 1);
    // Срабатывает каждую чётную по счёту команду
    return ctx.session.get('number') % 2 === 0;
  },
  ctx => {
    // Контекст сохраняется
    return Reply.text(
      `Я работаю каждую чётную по счёту команду:
    сейчас по счёту ${ctx.session.get('number')}`,
    );
  },
);

/*
 * Можно также использовать асинхронные матчеры
 * Например, чтобы сходить в БД
 * 
 * В этом примере пользователь всегда попадёт сюда,
 * пока он не авторизуется.
 */
alice.command(
  async ctx => {
    return await ctx.isAuthenticated();
  },
  ctx => Reply.text('Пожалуйста, введите кодовое слово'),
);

alice.any(async ctx => Reply.text('А я срабатываю на все остальные'));
alice.listen('/', 8080);
