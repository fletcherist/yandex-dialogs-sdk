const Alice = require('yandex-dialogs-sdk');
const app = require('express')();
const bodyParser = require('body-parser');

const { Alice, Reply } = require('yandex-dialogs-sdk');
const app = require('express')();
const bodyParser = require('body-parser');

const alice = new Alice();

alice.any(ctx => {
  return Reply.text('Hello');
});

app.use(bodyParser.json());
app.post('/webhookurl', async (req, res) => {
  // Returns hello message
  const jsonAnswer = await alice.handleRequest(req.body);
  res.json(jsonAnswer);
});
app.listen(8080);
