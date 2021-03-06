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
  let gameStartedAt
  let sure

  socket.on(
    'send-move',
    ({ opponentId, move, opponentLastMoveAt, opponentLastMove }) => {
      console.log('opponetId', opponentId)
      console.log('move', move)
      console.log('io game', io['game'])
      console.log('opponentLastMoveAt', opponentLastMoveAt)
      opponentId = getStringId(opponentId)
      socket.broadcast.to(opponentId).emit('receive-move', {
        move,
        opponentLastMoveAt,
        opponentLastMove,
      })
    }
  )

  function getTime(responsePlayerId) {
    return io.sockets.connected[responsePlayerId]
  }

  function setTime(gameStartedAt) {
    socket['gameStartedAt'] = gameStartedAt
  }

  socket.on(
    'send-playRequest',
    ({ recipientId, senderPlayer, timeInminutes }) => {
      const timeInMilliseconds = timeInminutes * 60 * 1000
      io['game'] = {
        [recipientId]: {
          id: recipientId,
          side: senderPlayer.side === 'w' ? 'b' : 'w',
          leftTime: timeInMilliseconds,
          lastMovedAt: null,
        },
        [senderPlayer.id]: {
          ...senderPlayer,
          leftTime: timeInMilliseconds,
          lastMovedAt: null,
        },
        gameStartedAt: null,
        sure: null,
      }

      console.log('senderPlayer', senderPlayer)
      console.log('recipientId', recipientId)
      const newRecipient = id
      recipientId = getStringId(recipientId)
      socket.broadcast.to(recipientId).emit('receive-playRequest', {
        recipientId: newRecipient,
        senderPlayer,
      })
    }
  )

  socket.on('send-playResponse', ({ recipientId, response, gameId }) => {
    const { sure } = io['game']
    io['game'] = {
      ...io['game'],
      gameStartedAt: new Date().getTime(),
    }

    console.log('send-playResponse')
    console.log('recipient id', recipientId)
    recipientId = getStringId(recipientId)
    socket.broadcast.to(recipientId).emit('receive-playResponse', {
      response,
      gameId,
      gameStartedAt,
    })
  })
})

function calculateSpentTime(movedPlayerId) {
  const now = new Date().getTime()
  const { leftTime, lastMovedAt } = io['game'][movedPlayerId]
  const spentTime = now - lastMovedAt
  const updatedLeftTime = leftTime - spentTime
  io['game'][movedPlayerId] = {
    ...io['game'][movedPlayerId],
    leftTime: updatedLeftTime,
  }
  const leftMinutesInMilliseconds = updatedLeftTime / (1000 * 60)
  console.log('left time')
  console.log('minutes')
  // const spentMinutesInMilliseconds = spentTime % (1000 * 60 * 60)
  // let spentMinutes = Math.floor(spentMinutesInMilliseconds / (1000 * 60))
  // const spentSecondsInMilliseconds = (spentTime - spentMinutesInMilliseconds) %
  // let spentSeconds = Math.floor((spentTime % (1000 * 60)) / 1000)
  // let spentMilliSeconds = Math.floor((spentTime))
}

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
