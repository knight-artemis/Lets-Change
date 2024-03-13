require('dotenv').config()
require('@babel/register')
const express = require('express')
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const morgan = require('morgan')

const app = express()
const http = require('http').Server(app)
const socketIo = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:4269', 'http://92.255.201.45:3366', 'http://92.255.201.45:3355'],
  },
})

const authRouter = require('./src/routes/api/v1/auth.routes')
const thingsRouter = require('./src/routes/api/v1/things.routes')
const dealsRouter = require('./src/routes/api/v1/deals.routes')
const testRouter = require('./src/routes/api/v1/test.routes')
const userRouter = require('./src/routes/api/v1/user.routes')
const adminRouter = require('./src/routes/api/v1/admin.routes')

const { PORT, CLIENT_PORT, SESSION_SECRET, SOCKET_PORT } = process.env

const corsOptions = {
  origin: [
    `http://localhost:${CLIENT_PORT}`,
    'http://92.255.201.45:3366',
    'http://92.255.201.45:3355',
  ],
  optionsSuccesStatus: 200,
  credentials: true,
}

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
}

app.use(session(sessionConfig))
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(process.cwd(), 'public/')))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/things', thingsRouter)
app.use('/api/v1/deals', dealsRouter)
app.use('/api/v1/test', testRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)

socketIo.on('connection', (socket) => {
  const userId = socket.handshake.headers.newuserid
  const dealId = socket.handshake.headers.dealid
  console.log(`user =======> id:${userId}, dealId:${dealId} connected  Socket:${socket.id} `)
  socketIo.emit(`user-enter-${dealId}`, userId)
  socket.on('message', (data) => {
    socketIo.emit(`res-deal-${dealId}`, data)
    console.log('DATA', data)
  })
  socket.on('disconnect', () => {
    socketIo.emit(`user-exit-${dealId}`, userId)
    console.log(`user =======x id:${socket.id} disconnect`)
  })
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`)
})

http.listen(SOCKET_PORT, () => {
  console.log(`Чат сервер запущен на ${SOCKET_PORT} порту`)
})
