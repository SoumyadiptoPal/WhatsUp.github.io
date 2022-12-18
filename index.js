const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users={};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/logo.jpg', (req, res) => {
  res.sendFile(__dirname + '/logo.jpg');
});
app.get('/send.png', (req, res) => {
  res.sendFile(__dirname + '/send.png');
});
app.get('/sound1.mp3', (req, res) => {
  res.sendFile(__dirname + '/sound1.mp3');
});
app.get('/sound2.wav', (req, res) => {
  res.sendFile(__dirname + '/sound2.wav');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });
  socket.on('new-user-joined',name=>{
    users[socket.id]=name;
    socket.broadcast.emit('user-joined',name);
});

//Broadcast a message
socket.on('send',message=>{
    socket.broadcast.emit('receive',{message: message, name:users[socket.id]});
});

//if some one leaves the chat let other people know
socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id]
})
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});