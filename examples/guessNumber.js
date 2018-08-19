const { Alice, Scene, Reply, Markup } = require('yandex-dialogs-sdk');

const alice = new Alice();

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const M = Markup;

const welcomeMatcher = ctx => ctx.data.session.new === true;
alice.command(welcomeMatcher, ctx =>
  Reply.text('Привет! Я загадала число от 1 до 100. Сможешь отгадать его?', {
    buttons: [M.button('Давай попробуем!'), M.button('Не хочу')],
  }),
);

const startGame = ctx => {
  ctx.session.set('guessedNumber', random(1, 100));
  return Reply.text('Ну попробуй!');
};
alice.command('давай попробуем', startGame);
alice.command('сыграть ещё раз', startGame);
alice.command('Не хочу', ctx => Reply.text('Спасибо за игру!'));

alice.command(/^\d+$/, ctx => {
  const number = Number(ctx.message);
  const guessedNumber = ctx.session.get('guessedNumber');
  if (number > guessedNumber) {
    return Reply.text(`Моё число меньше, чем ${number}`);
  } else if (number < guessedNumber) {
    return Reply.text(`Моё число больше, чем ${number}`);
  } else {
    return Reply.text(
      `Ты победил! Я загадала число ${guessedNumber}. Сыграешь ещё раз?`,
      {
        buttons: [M.button('Сыграть ещё раз!'), M.button('Не хочу')],
      },
    );
  }
});
alice.any(ctx => Reply.text('Ты ввёл вообще не число. Попробуй ещё раз!'));

const server = alice.listen(8080, '/');
