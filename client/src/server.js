const express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

app.use('/', express.static('dist'));
app.use('/static', express.static('dist'));

const imap = require('imap');

const port = 3000;

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const imap = new Imap({
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  });

  imap.once('ready', () => {});
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/pull', (req, res) => {
  res.send('Test');
});

app.get('/api/test', (req, res) => {
  res.send('Test');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
