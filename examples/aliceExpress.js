const Alice = require('yandex-dialogs-sdk');
const app = require('express')();
const bodyParser = require('body-parser');

const alice = new Alice();
alice.any(ctx => ctx.reply('hello'));

app.use(bodyParser.json());
app.post('/webhookurl', async (req, res) => {
  const jsonAnswer = await alice.handleRequest(req.body);
  res.json(jsonAnswer);
});
app.listen(8080);
