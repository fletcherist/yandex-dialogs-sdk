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

# API

API очень простой и удобный.

## ReplyBuilder

Генерирует ответ для сервера, какой вы захотите.

### .text(str: string)
Устанавливает текстовое сообщение в ответе
> Кстати, можно использовать `emoji` 👌

### .tts(str: string)
Устанавливает голосовое сообщение, которое произнесёт Алиса

### .addButton(button: buttonBuilder)
Добавляет к ответу кнопку. Кнопки добавляются по очереди.

```javascript
/* example */
ctx.replyBuilder.addButton(btn1).addButton(btn2)
```
```json
"response": {
  "buttons": [btn1, btn2],
},
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
```json
{
  "response": {
    "buttons": [btn1, btn2],
    "end_session": false,
    "text": "Вы что, из Англии?",
    "tts": "Вы что, из Англии?"
  },
  "session": {
     ...
  },
  "version": "1.0"
}
```



Phil Romanov © MIT 2018
