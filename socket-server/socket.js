const httpServer = require('http').createServer()

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('socket is runnig')
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-move', ({ opponentId, move }) => {
    console.log('opponetId', opponentId)
    console.log('move', move)
    opponentId = getStringId(opponentId)
    socket.broadcast.to(opponentId).emit('receive-move', {
      move,
    })
  })

  socket.on('send-playRequest', ({ recipientId, senderPlayer }) => {
    console.log('senderPlayer', senderPlayer)
    console.log('recipientId', recipientId)
    const newRecipient = id
    recipientId = getStringId(recipientId)
    socket.broadcast.to(recipientId).emit('receive-playRequest', {
      recipientId: newRecipient,
      senderPlayer,
    })
  })

  socket.on('send-playResponse', ({ recipientId, response }) => {
    console.log('send-playResponse')
    console.log('recipient id', recipientId)
    recipientId = getStringId(recipientId)
    socket.broadcast.to(recipientId).emit('receive-playResponse', {
      response,
    })
  })
})

function getStringId(id) {
  switch (typeof id) {
    case 'string':
      return id
    case 'number':
      return id.toString()
    default:
      throw Error('id type must be string or number')
  }
}

httpServer.listen(5000)
