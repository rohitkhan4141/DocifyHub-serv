async function handleChat(io) {
  
  io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    console.log('message: ', message);
    io.emit('chat message', message); 
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

}

export { handleChat };

