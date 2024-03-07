require('dotenv').config();
require('@babel/register');
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const morgan = require('morgan');

const app = express();

const authRouter = require('./src/routes/api/v1/auth.routes');
const thingsRouter = require('./src/routes/api/v1/things.routes');
const dealsRouter = require('./src/routes/api/v1/deals.routes');
const testRouter = require('./src/routes/api/v1/test.routes');
const userRouter = require('./src/routes/api/v1/user.routes');

const { PORT, CLIENT_PORT, SESSION_SECRET } = process.env;

const corsOptions = {
  origin: [`http://localhost:${CLIENT_PORT}`],
  optionsSuccesStatus: 200,
  credentials: true,
};

const sessionConfig = {
  name: 'Cookie',
  store: new FileStore(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 * 10,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public/')));
// app.use(express.static(path.join(process.cwd(), 'uploads/')));
// console.log("🚀 ~ path.join(process.cwd(), 'uploads/'):", path.join(process.cwd(), 'uploads/'))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/things', thingsRouter);
app.use('/api/v1/deals', dealsRouter);
app.use('/api/v1/test', testRouter);
app.use('/api/v1/user', userRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
