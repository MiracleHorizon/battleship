import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const rooms = new Map()

io.on('connection', socket => {
  socket.on('join_room', roomId => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        sockets: new Set(),
        battlefields: new Map()
      })
    }

    const room = rooms.get(roomId)

    if (room.sockets.size < 2) {
      room.sockets.add(socket.id)

      socket.join(roomId)
      socket.emit('room_joined', roomId)
      socket.broadcast.to(roomId).emit('new_user_joined', socket.id)
    } else {
      socket.emit('room_full', roomId)
    }
  })

  socket.on('add_battlefield', payload => {
    const { roomId, socketId, battlefield } = payload

    if (!rooms.has(roomId)) {
      console.log('Такого комнаты нет')
      return
    }

    const room = rooms.get(roomId)

    if (!room.sockets.has(socketId)) {
      console.log('Такого сокета в комнате нет')
      return
    }

    if (room.battlefields.size >= 2) {
      console.log('Уже есть 2 поля')
      return
    }

    if (room.battlefields.has(socket.id)) {
      console.log('Уже есть поле с таким сокетом')
      return
    }

    room.battlefields.set(socketId, battlefield)

    console.log(battlefield)

    socket.broadcast.to(roomId).emit('receive_battlefield', {
      socketId,
      battlefield
    })
  })

  socket.on('register_shot', (roomId, socketId, { row, col }) => {
    if (!rooms.has(roomId)) {
      return
    }

    const room = rooms.get(roomId)
    const battlefields = room.battlefields

    if (!battlefields.has(socketId)) {
      return
    }

    const battlefield = battlefields.get(socketId)
    const cell = battlefield[row][col]

    let cellState = 0
    if (cell === 1) {
      cellState = 1 // Hit
    } else if (cell === 0) {
      cellState = 2 // Missed
    }

    socket.emit('apply_shot', {
      cellState,
      row,
      col
    })
  })

  socket.on('disconnect', () => {
    for (const roomKey of rooms.keys()) {
      const room = rooms.get(roomKey)

      if (room.sockets.has(socket.id)) {
        room.sockets.delete(socket.id)
      }

      if (room.sockets.size === 0) {
        rooms.delete(roomKey)
      }
    }
  })
})

httpServer.listen(4200)
