const { Alice, Reply, Markup, Stage, Scene } = require('yandex-dialogs-sdk');
const alice = new Alice();
const stage = new Stage();
const SCENE_AT_BAR = 'SCENE_AT_BAR';
const atBar = new Scene(SCENE_AT_BAR);

atBar.command('show menu', ctx =>
  Reply.text('only vodka here', {
    buttons: ['buy vodka', 'go away'],
  }),
);
atBar.command('buy vodka', ctx => Reply.text(`you're dead`));
atBar.command('go away', ctx => {
  ctx.leave();
  return Reply.text('as you want');
});
atBar.any(ctx => Reply.text(`no money no honey`));

stage.addScene(atBar);
alice.use(stage.getMiddleware());
alice.command('i want some drinks', ctx => {
  ctx.enter(SCENE_AT_BAR);
  return Reply.text('lets go into pub', {
    buttons: ['show menu', 'go away'],
  });
});
alice.any(async ctx => Reply.text(`I don't understand`));
const server = alice.listen(3001, '/');
