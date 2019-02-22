# yandex-dialogs-sdk
[![npm version](https://badge.fury.io/js/yandex-dialogs-sdk.svg)](https://badge.fury.io/js/yandex-dialogs-sdk)

*Note: this is an open-source project. It is not affiliated with Yandex LLC.*

Tiny zen library to create skills for Yandex.Alice

**[yandex-dialogs-sdk](https://t.me/joinchat/AeqRLxKsMmI4o1ew2lQ1Qw)** — Telegram chat, if you need help

<img height=200 src='https://camo.githubusercontent.com/0ad462b08ffb18f96ae1143f1365b60b918f4bbd/68747470733a2f2f73657470686f6e652e72752f77702d636f6e74656e742f75706c6f6164732f323031372f30372f616c6973612d383130783435362e706e67' />


#### Install SDK
`npm i yandex-dialogs-sdk --save`

> To enable debug mode run `DEBUG=yandex-dialogs-sdk node YOUR_APP.js`

#### Videotutorials
- [Роман Парадеев — Доклад с конференции «В гостях у Алисы»](https://youtu.be/qqHTk2QLyEQ?t=3h13m22s)
- [Фил Романов — Пишем игру Guess Number за 10 минут](https://youtu.be/exPnIFMa1H8)


## 🔨 Built with SDK

- [yandex-dialogs-whatis](https://github.com/popstas/yandex-dialogs-whatis) 
Smart reminder by [@popstas](https://github.com/popstas)
- [Алиса в стране диез](https://github.com/AntonRzevskiy/Alice-in-the-country-sharp)
Awesome music game by [@AntonRzevskiy](https://github.com/AntonRzevskiy)
- [Adventure Engine](https://github.com/Teoreez/Adventure-Engine---YandexAlice-MongoDB-JS)
Adventure quest game by [@Teoreez](https://github.com/Teoreez)
- [uraljs-alice-bot](https://github.com/sameoldmadness/uraljs-alice-bot)
Навык Алисы UralJS
- [homebot-alisa](https://github.com/homebot/homebot-alisa)
- Send PR to be here!

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

#### Hot middlewares from maintainer

- **[yandex-dialogs-sdk-lowdb](https://github.com/fletcherist/yandex-dialogs-sdk-lowdb)** - store your users sessions in file
- **[yandex-dialogs-sdk-chatbase](https://github.com/popstas/yandex-dialogs-sdk-chatbase)** - send events to Google Chatbase by **[@popstas](https://github.com/popstas)**

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
- `alice.any` - Set handler if no command has been matched
```javascript
alice.command('text', ctx => null)
alice.command(/regex/ig, ctx => null)
alice.command(['array', 'of', 'strings'], ctx => null)
// pass function which returns boolean. True means perfect match.
alice.command(ctx => true || false, ctx => null)

alice.any('text', ctx => null)

// create event listener
// triggers when request processing is finished
alice.on('response', ctx => {
  console.log(ctx.response)
})
```

###### Images Api
To use this API you have to provide your auth data.
[More info](https://tech.yandex.ru/dialogs/alice/doc/resource-upload-docpage)
```javascript
const alice = new Alice({
  oAuthToken: OAUTH_TOKEN,
  skillId: SKILL_ID
});
```
- `alice.imagesApi.uploadImageByUrl` - Upload image by URL
- `alice.imagesApi.uploadImageFile` - Upload image by File Buffer **(Not implemented yet)**.
- `alice.imagesApi.getImages` - Get all uploaded images
- `alice.imagesApi.getImagesQuota` - Get images quota
- `alice.imagesApi.deleteImage` - Delete image
```javascript
const image = await alice.imagesApi.uploadImageByUrl(IMAGE_URL);
const images = await alice.imagesApi.getImages();
// @example { total: 104857600, used: 25715766 }
const quota = await alice.imagesApi.getImagesQuota();
// @example { result: 'ok' } | { message: 'Image not found' }
await alice.imagesApi.deleteImage('IMAGE_ID')
```

###### Context
- `[ctx.data]` - object with request
- `[ctx.message]` — shortcut for `ctx.data.request.command`
- `[ctx.originalUtterance]` - shortcut for `ctx.data.request.original_utterance`
- `[ctx.sessionId]` — shortcut for `ctx.data.session.session_id`
- `[ctx.messageId]` — shortcut for `ctx.data.session.message_id`
- `[ctx.userId]` — shortcut for `ctx.data.session.user_id`
- `[ctx.payload]` — shortcut for `ctx.data.request.payload`
- `[ctx.nlu]` - shortcut for `ctx.data.request.nlu` [(see more)](https://tech.yandex.ru/dialogs/alice/doc/nlu-docpage/)
- `[ctx.response]` - available only in listeners. appears just before sending a response
- `[ctx.enter()]` - enters session
- `[ctx.leave()]` - goes to main dialog
- `ctx.session.set` - set session value. Session is attached to `user_id`
- `ctx.session.get` - get session value.
```javascript
// enter/leave scene
const { Scene } = require('yandex-dialogs-sdk');
ctx.enter('scene-name');
ctx.leave();

ctx.session.set('price', 200);
const price = ctx.session.get('price'); // 200
```
> **[enter/leave example](https://github.com/fletcherist/yandex-dialogs-sdk/blob/master/examples/scenes.js)**

###### Stage
```javascript
const { Stage } = require('yandex-dialogs-sdk')
const stage = new Stage()
```
- `stage.addScene` - adds scene to stage
- `stage.removeScene` - removes scene from stage
- `stage.getMiddleware` - returns stage middleware
> **[full scene example](https://github.com/fletcherist/yandex-dialogs-sdk/blob/master/examples/scenes.js)**


###### Middlewares
```javascript
const createMessagesCounterMiddleware = () => {
  let count = 0
  return async (ctx, next) => {
    // You can do anything with context here
    count += 1;
    return next(ctx)
  }
}
alice.use(createMessagesCounterMiddleware())
```

###### Reply
```javascript
const { Reply } = require('yandex-dialogs-sdk')
IMAGE_ID = '213044/d13b0d86a41daf9de232'
EXTRA_PARAMS = { // Extra params are optional
  tts: 'Hi the+re',
  buttons: ['one', Markup.button('two')],
  end_session: true
}
```
- `Reply.text` 
```javascript
// Second argument is optional
alice.any(ctx => Reply.text('text'), EXTRA_PARAMS)
```
- `Reply.bigImageCard` - One big image
```javascript
Reply.bigImageCard('text', {
  image_id: IMAGE_ID,
  title: string, // optional
  description: string, // optional
  button: M.button('click'), // optional
}, EXTRA_PARAMS)
```
- `Reply.itemsListCard` - Gallery
```javascript
Reply.itemsListCard('text', [IMAGE_ID, IMAGE_ID], EXTRA_PARAMS);
Reply.itemsListCard('test', {
    header: 'header',
    footer: {
      text: 'test',
      button: Markup.button('button'),
    },
    items: [
      IMAGE_ID, 
      { image_id: IMAGE_ID, title: 'title', description: 'description' },
    ],
  });
```

###### Events
```javascript
// create event listener
// triggers when request processing is finished
alice.on('response', ctx => {
  console.log(ctx.response)
})
```


###### Markup
```javascript
const { Markup } = require('yandex-dialogs-sdk')
```
- `Markup.button`
```javascript
const M = Markup
M.button('string')
M.button({
  title: string;
  url: string;
  payload: object;
  hide: boolean;
})
```

## CONTRIBUTING
`git clone`

`npm install && npm run test && npm run dev`

Typescript will be compiled into `./dist` <br>

## Contributors
Thanks all these awesome people for this product. 

| [<img src="https://avatars1.githubusercontent.com/u/3027126?s=400&v=4" width="100px;"/><br /><sub><b>Stanislav Popov</b></sub>](http://blog.popstas.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=popstas "Documentation")| [<img src="https://avatars0.githubusercontent.com/u/22147027?s=400&v=4" width="100px;"/><br /><sub><b>Nikita Rogozhin</b></sub>](http://rogoda.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=rogodec "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1537724?s=400&v=4" width="100px;"/><br /><sub><b>Roman Paradeev</b></sub>](https://github.com/sameoldmadness)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=sameoldmadness "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/10712045?s=400&v=4" width="100px;"/><br /><sub><b>Vanya Klimenko</b></sub>](http://vanyaklimenko.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=vanyaklimenko "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/577154?s=460&v=4" width="100px;"/><br /><sub><b>Dmitry Guketlev</b></sub>](https://github.com/Yavanosta)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=Yavanosta "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/11800710?s=460&v=4" width="100px;"/><br /><sub><b>Alexander Karpov</b></sub>](https://github.com/alexander-karpov)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=alexander-karpov "Documentation") | 
| :---: | :---: | :---: | :---: | :---: | :---: |


Phil Romanov © MIT 2018
