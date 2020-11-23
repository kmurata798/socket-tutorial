const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

user_count = 0;
io.on('connection', socket => {
  user_count++;
  let current_user
  socket.on('name', name => {
    current_user = name
    io.emit('broadcast', `<<< ${current_user} has entered the chat (${user_count}  connected users) >>>`)

    socket.on('disconnect', () => {
      user_count--;
      io.emit('broadcast', `<<< ${current_user} has left the chat (${user_count} connected users) >>>`)
    })
  })
  socket.on('chat message', msg => {
    io.emit('chat message', `[ ${current_user} ] : ${msg}`)
  })
})

// // Broadcast message to connected users with count
// var clients = 0;
// io.on('connection', function(socket) {
//    clients++;
//    io.emit('broadcast',{ description: clients + ' clients connected!'});
//    socket.on('disconnect', function () {
//       clients--;
//       io.emit('broadcast',{ description: clients + ' clients connected!'});
//    });
// });

http.listen(port, () => {
  console.log(`Listening on *:${port}`)
})


// http.listen(3000, () => {
//   console.log('listening on *:3000');
// });

// // console "user connnected"
// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });
// // console user message
// io.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
//     console.log('message: ' + msg);
//   });
// });
// // send message
// io.on('connection', (socket) => {
//   socket.on('chat message', (msg) => {
//     io.emit('chat message', msg);
//   });
// });