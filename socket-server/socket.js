const httpServer = require('http').createServer()

const io = require("socket.io")(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log("socket is runnig")
  const id = socket.handshake.query.id
  socket.join(id)
  console.log('id', id)
  socket.on('send-move', ({ recipients, move }) => {
    console.log("recipients", recipients)
    recipient.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-move', {
        recipient: newRecipients,
        sender: id,
        move,
      })
    })
  })

  socket.on('send-playRequest', (recipients) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter((r) => r !== recipient)
      newRecipients.push(id)
      console.log('newRecipients', newRecipients)
      socket.broadcast.to(id).emit('receive-playRequest', {
        sender: newRecipients,
      })
    })
  })
})


httpServer.listen(5000)