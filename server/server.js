const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pullMessages = require('./util');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

app.use('/', express.static('../client/dist'));
app.use('/assets', express.static('../client/dist/assets/'));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: '8f9h340erjfoaidjopsifhhoqw3jfw0qeifu',
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const messagesData = await pullMessages(email, password);

    req.session.email = email;
    req.session.password = password;

    req.session.messagesData = messagesData;
    req.session.loggedIn = true;
    res.status(200).send(messagesData);
  } catch (e) {
    console.log(e);
    res.status(401).send('Invalid credentials');
  }
});

app.get('/api/pull', async (req, res) => {
  if (!req.session.loggedIn) {
    res.status(401).send('Not logged in');
    return;
  }

  const { email, password } = req.session;
  try {
    const messagesData = await pullMessages(email, password);

    console.log(messagesData);

    req.session.messagesData = messagesData;
    req.session.loggedIn = true;
    res.status(200).json(messagesData);
  } catch (e) {
    console.log(e);
    res.status(401).send('Invalid credentials');
  }
});

app.post('/api/more', async (req, res) => {
  if (!req.session.loggedIn) {
    res.status(401).send('Not logged in');
    return;
  }

  const { seqno } = req.body;
  const { email, password } = req.session;
  try {
    const messagesData = await pullMessages(email, password, seqno);
    req.session.messagesData = messagesData;
    req.session.loggedIn = true;
    res.status(200).json(messagesData);
  } catch (e) {
    console.log(e);
    res.status(401).send('Invalid credentials');
  }
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('Logged out');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
