# yandex-dialogs-sdk
[![npm version](https://badge.fury.io/js/yandex-dialogs-sdk.svg)](https://badge.fury.io/js/yandex-dialogs-sdk)

Создавать навыки для Алисы — это очень просто.

**[yandex-dialogs-sdk](https://t.me/joinchat/AeqRLxKsMmI4o1ew2lQ1Qw)** — телеграм-чатик, где ответят на любой ваш вопрос по поводу **SDK**

<img height=200 src='https://camo.githubusercontent.com/0ad462b08ffb18f96ae1143f1365b60b918f4bbd/68747470733a2f2f73657470686f6e652e72752f77702d636f6e74656e742f75706c6f6164732f323031372f30372f616c6973612d383130783435362e706e67' />

### Установите SDK
`npm i yandex-dialogs-sdk --save`

### Видеоуроки
- [Роман Парадеев — Доклад с конференции «В гостях у Алисы»](https://youtu.be/qqHTk2QLyEQ?t=3h13m22s)
- [Фил Романов — Пишем игру Guess Number за 10 минут](https://youtu.be/exPnIFMa1H8)

### Создайте своё первое приложение

```javascript
const Alice = require('yandex-dialogs-sdk')
const alice = new Alice()

const { loggerMiddleware, button } = Alice
alice.use(loggerMiddleware({
  level: 1 // Optional. DEFAULT 0. see https://github.com/pimterry/loglevel
}))

alice.welcome(async (ctx) => ctx.reply('Привет! Смотри, что я могу'))
alice.command('дай совет', async (ctx) => ctx.reply('Make const not var'))
alice.command(['билет в кино', 'что посмотреть', 'что показывают'], ctx => {
  ctx.reply({
    text: 'Есть «2001 a space odyssey»',
    buttons: [button('Забронировать')]
  }) 
})

alice.command(/(https?:\/\/[^\s]+)/g, ctx => ctx.reply('Matched a link!'))
alice.any(async (ctx) => ctx.reply('О чём это вы?'))
alice.listen('/', 3000)

```

> Можно использовать как постоянно работающий сервер, так и serverless-платформы, такие как **AWS Lambda** или **Google Cloud Functions**. Больше примеров в папке **[./examples](https://github.com/fletcherist/yandex-dialogs-sdk/tree/master/examples)**

### Программируйте сложную логику

```javascript
const Scene = require('yandex-dialogs-sdk').Scene

const inBar = new Scene('in-the-bar')
inBar.enter('Алиса, пойдём в бар!', ctx => ctx.reply('Пойдём.'))
inBar.command('ты сейчас в баре?', ctx => ctx.reply('Да!'))
inBar.leave('Пошли отсюда', ctx => ctx.reply('Уже ухожу.'))

alice.registerScene(inBar)
alice.command('ты сейчас в баре?', ctx => ctx.reply('Нет!'))

```


### Больше не надо парсить ответы руками
```javascript
alice.command('забронируй встречу в ${where} на ${when}', ctx => {
  const { where, when } = ctx.body
  // where — '7-холмов'
  // when — '18:00'
  ctx.reply(`Готово. Встреча состоится в ${where}. Тебе напомнить?`)
})
alice.handleRequestBody(
  generateRequest('забронируй встречу в 7-холмов на 18:00')
)
```

> Больше примеров в папке **[./examples](https://github.com/fletcherist/yandex-dialogs-sdk/tree/master/examples)**



Создавайте сложные конструкции с кнопками и кастомизацией с помощью фабрик:


Создайте кнопку:
```javascript
const buyBtn = ctx.buttonBuilder
  .text('Купить слона')
  .url('example.com/buy')
  .payload({buy: "slon"})
  .shouldHide(true)
  .get()
```


Создайте ответ:
```javascript

alice.command('купить слона', async (ctx) => {
  const replyMessage = ctx.replyBuilder
    .text('Вы что, серьёзно?')
    .tts('Вы что, серьё+зно?')
    .addButton(buyBtn)
    .get()
  return ctx.reply(replyMessage)
})

```

# API

- [Протокол Yandex Dialogs](https://tech.yandex.ru/dialogs/alice/doc/protocol-docpage/)


## Alice 

- `alice.command` - Установить обработчик команды
- `alice.welcome` - Приветственный метод. Вызывается в начале пользовательской сессии.
- `alice.uploadImage` - Загрузить картинку.
- `alice.getImages` - Получить список загруженных изображений.

## Ctx

Сущность для управления состоянием ответа. Есть следующие методы и свойства:

#### Свойства

- `[ctx.message]` — Команда от пользователя.
- `[ctx.originalUtterance]` - shortcut for `ctx.req.request.original_utterance`
- `[ctx.body]` — Объект с данными после интент-обработки ([подробнее](https://github.com/fletcherist/yandex-dialogs-sdk/tree/master/examples/ctxBody.js))
- `[ctx.sessionId]` — ID сессии.
- `[ctx.messageId` — ID сообщения.
- `[ctx.userId` — ID пользователя.
- `[ctx.payload]` — Произвольный JSON, который присылается обработчику, если какая-то кнопка будет нажата.


#### Методы

- `ctx.reply` - Ответить на пользовательский запрос.
- `ctx.replyWithImage` — Ответить картинкой.
- `ctx.goodbye` - Ответь и завершить сессию (выйти из навыка).
- `ctx.replyBuilder` — фабрика для создания ответа на запрос. О ней — дальше.
- `ctx.buttonBuilder` — фабрика для создания кнопок. О ней — дальше.


# ReplyBuilder

Генерирует ответ для сервера, какой вы захотите.
Метод доступен из контекста. `ctx.replyBuilder`

### .text(str: string)
Устанавливает текстовое сообщение в ответе.
> Кстати, можно использовать эмодзи 👌

### .tts(str: string)
Устанавливает голосовое сообщение, которое произнесёт Алиса. 
> Доступна особая разметка: например - - паузы и +ударения.

### .addButton(button: buttonBuilder)
Добавляет к ответу кнопку. Кнопки добавляются по очереди:

```javascript
/* example */
ctx.replyBuilder.addButton(btn1).addButton(btn2)
```

### .shouldEndSession(flag: boolean)
> Default — false


Признак конца разговора. Завершать ли сессию или продолжить.


### .get()
Получить результат выполнения фабрики. В конце всегда вызывайте этот метод.


**Пример**
```javascript
const replyMessage = ctx.replyBuilder
  .text('Вы что, из Англии?')
  .tts('Вы что, из Англии?')
  .addButton(btn1)
  .addButton(btn2)
  .get()
```



# ButtonBuilder
Метод доступен из контекста. `ctx.buttonBuilder`

### .text(text: string)
Устанавливает текст кнопки.


### .title(title: string)
Тоже устанавливает текст кнопки.
> Используйте, какой больше нравится


### .url(url: string)
Устанавливает URL, который откроется при нажатии на кнопку.


### .url(url: string)
Устанавливает URL, который откроется при нажатии на кнопку.


### .shouldHide(flag: boolean)
Нужно ли прятать кнопку после следующей реплики пользователя?


### .payload(payload: string | object)
Произвольный JSON, который Яндекс.Диалоги должны отправить обработчику, если данная кнопка будет нажата. Максимум 4096 байтов.

### .get()
Получить результат выполнения фабрики. В конце всегда вызывайте этот метод.


**Пример**
```javascript
const buyBtn = ctx.buttonBuilder
  .text('Купить слона')
  .url('example.com/buy')
  .payload({buy: "slon"})
  .shouldHide(true)
  .get()
```

## 🔨 Сделано с помощью SDK

- [yandex-dialogs-whatis](https://github.com/popstas/yandex-dialogs-whatis) 
Бот подскажет, что где находится, если вы перед этим расскажете ему об этом
- [uraljs-alice-bot](https://github.com/sameoldmadness/uraljs-alice-bot)
Навык Алисы UralJS
- присылайте PR, чтобы оказаться здесь

## Если вы собрались помочь в разработке
`git clone`

`yarn && npm run test && npm run dev`

Typescript-приложение соберётся в ./dist <br>
Пожалуйста, прочтите [Roadmap](https://github.com/fletcherist/yandex-dialogs-sdk/projects/1), чтобы понять, куда мы идём.

## Contributors
Спасибо всем этим замечательным людям за библиотеку:

| [<img src="https://avatars1.githubusercontent.com/u/3027126?s=400&v=4" width="100px;"/><br /><sub><b>Stanislav Popov</b></sub>](http://blog.popstas.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=popstas "Documentation")| [<img src="https://avatars0.githubusercontent.com/u/22147027?s=400&v=4" width="100px;"/><br /><sub><b>Nikita Rogozhin</b></sub>](http://rogoda.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=rogodec "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1537724?s=400&v=4" width="100px;"/><br /><sub><b>Roman Paradeev</b></sub>](https://github.com/sameoldmadness)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=sameoldmadness "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/10712045?s=400&v=4" width="100px;"/><br /><sub><b>Vanya Klimenko</b></sub>](http://vanyaklimenko.ru)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=vanyaklimenko "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/577154?s=460&v=4" width="100px;"/><br /><sub><b>Dmitry Guketlev</b></sub>](https://github.com/Yavanosta)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=Yavanosta "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/11800710?s=460&v=4" width="100px;"/><br /><sub><b>Alexander Karpov</b></sub>](https://github.com/alexander-karpov)<br />[📖](https://github.com/fletcherist/yandex-dialogs-sdk/commits?author=alexander-karpov "Documentation") | 
| :---: | :---: | :---: | :---: | :---: | :---: |


Phil Romanov © MIT 2018
