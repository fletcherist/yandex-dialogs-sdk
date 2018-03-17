# yandex-dialogs-sdk

Создавать навыки для Алисы — это очень просто.

<img height=300 src='https://setphone.ru/wp-content/uploads/2017/07/alisa-810x456.png'/>

### Установите SDK
`npm i yandex-dialogs-sdk`

`yarn add yandex-dialogs-sdk`

### Создайте своё первое приложение

```javascript
const Alice = require('yandex-dialogs-sdk')
const alice = new Alice()

alice.command('дай совет', async (ctx) => {
  return ctx.reply('Make const not var')
})

alice.any(async (ctx) => {
  return ctx.reply('О чём это вы?')
})

alice.listen('/', 80)

```



Создавайте сложные конструкции с кнопками и лучшей кастомизацией с помощью фабрик:


Создайте кнопку
```javascript
const buyBtn = ctx.buttonBuilder
  .text('Купить слона')
  .url('example.com/buy')
  .payload({buy: "slon"})
  .shouldHide(true)
  .get()
```


Создайте ответ
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



Phil Romanov © MIT 2018
