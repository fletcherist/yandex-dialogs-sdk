# yandex-dialogs-sdk
[![npm version](https://badge.fury.io/js/yandex-dialogs-sdk.svg)](https://badge.fury.io/js/yandex-dialogs-sdk)

*Note: this is an open-source project. It is not affiliated with Yandex LLC.*

Tiny zen library to create skills for Yandex.Alice

**[yandex-dialogs-sdk](https://t.me/joinchat/AeqRLxKsMmI4o1ew2lQ1Qw)** — Telegram chat, if you need help

<img height=200 src='https://camo.githubusercontent.com/0ad462b08ffb18f96ae1143f1365b60b918f4bbd/68747470733a2f2f73657470686f6e652e72752f77702d636f6e74656e742f75706c6f6164732f323031372f30372f616c6973612d383130783435362e706e67' />


#### Install SDK
`npm i yandex-dialogs-sdk --save`

#### Videotutorials
- [Роман Парадеев — Доклад с конференции «В гостях у Алисы»](https://youtu.be/qqHTk2QLyEQ?t=3h13m22s)
- [Фил Романов — Пишем игру Guess Number за 10 минут](https://youtu.be/exPnIFMa1H8)

#### Getting Started

```javascript
const { Alice, Reply, Markup } = require('yandex-dialogs-sdk')
const alice = new Alice();

const M = Markup;
alice.command('', async ctx => Reply.text('Look, what i can!'));
alice.command('Give a piece of advice', async ctx =>
  Reply.text('Make const not var'),
);
alice.command(
  ['What is trending now?', 'Watch films', 'Whats in the theatre?'],
  ctx => {
    return {
      text: `What about 50 Angry Men?`,
      buttons: [M.button('Buy ticket'), M.button('What else?')],
    };
  },
);
alice.command(/(https?:\/\/[^\s]+)/g, ctx => Reply.text('Matched a link!'));
alice.any(async ctx => Reply.text(`I don't understand`));
const server = alice.listen(3001, '/');
```

#### Handle non-trivial scenarios

```javascript
const { Alice, Scene, Stage } = require('yandex-dialogs-sdk')
const stage = new Stage();
const alice = new Alice();
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
```

> A lot of examples in folder **[./examples](https://github.com/fletcherist/yandex-dialogs-sdk/tree/master/examples)**

# API

- [Yandex Dialogs Protocol](https://tech.yandex.ru/dialogs/alice/doc/protocol-docpage/)

###### Alice
```javascript
const { Alice } = require('yandex-dialogs-sdk')
```
- `alice.command` - Set handler for command
- `alice.uploadImage` - Upload image
- `alice.getImages` - Get all uploaded images

###### Context
- `[ctx.data]` - object with request
- `[ctx.message]` — shortcut for `ctx.data.request.command`
- `[ctx.originalUtterance]` - shortcut for `ctx.data.request.original_utterance`
- `[ctx.sessionId]` — shortcut for `ctx.data.session.session_id`
- `[ctx.messageId]` — shortcut for `ctx.data.session.message_id`
- `[ctx.userId]` — shortcut for `ctx.data.session.user_id`
- `[ctx.payload]` — shortcut for `ctx.data.request.payload`

###### Reply
```javascript
const { Reply } = require('yandex-dialogs-sdk')
```
- `Reply.text` - 
- `Reply.bigImageCard` - 
- `Reply.itemsListCard` -

###### Markup
```javascript
const { Markup } = require('yandex-dialogs-sdk')
```
- `Markup.button`

## 🔨 Built with SDK

- [yandex-dialogs-whatis](https://github.com/popstas/yandex-dialogs-whatis) 
Бот подскажет, что где находится, если вы перед этим расскажете ему об этом
- [uraljs-alice-bot](https://github.com/sameoldmadness/uraljs-alice-bot)
Навык Алисы UralJS
- присылайте PR, чтобы оказаться здесь

## CONTRIBUTING
`git clone`

`npm install && npm run test && npm run dev`

Typescript will be compiled into `./dist` <br>

## Contributors
Thanks all these awesome people for this product. 

| [<img src="https://avatars1.githubusercontent.com/u/3027126?s=400&v=4" width="100px;"/><br /><sub><b>Stanislav Popov</b></sub>](http://blog.popstas.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=popstas "Documentation")| [<img src="https://avatars0.githubusercontent.com/u/22147027?s=400&v=4" width="100px;"/><br /><sub><b>Nikita Rogozhin</b></sub>](http://rogoda.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=rogodec "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1537724?s=400&v=4" width="100px;"/><br /><sub><b>Roman Paradeev</b></sub>](https://github.com/sameoldmadness)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=sameoldmadness "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/10712045?s=400&v=4" width="100px;"/><br /><sub><b>Vanya Klimenko</b></sub>](http://vanyaklimenko.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=vanyaklimenko "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/577154?s=460&v=4" width="100px;"/><br /><sub><b>Dmitry Guketlev</b></sub>](https://github.com/Yavanosta)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=Yavanosta "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/11800710?s=460&v=4" width="100px;"/><br /><sub><b>Alexander Karpov</b></sub>](https://github.com/alexander-karpov)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=alexander-karpov "Documentation") | 
| :---: | :---: | :---: | :---: | :---: | :---: |


Phil Romanov © MIT 2018
