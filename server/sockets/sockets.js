var socketio = require('socket.io')

module.exports.listen = (app) => {
    io = socketio.listen(app)

    users = io.of('/users')
    users.on('connection', (socket) => {
    });

    io.on('connection', (socket) => {
      console.log('New user connected');

      socket.on('join', (params, callback) => {

          socket.join(params.room);
          // Pull user from other rooms
          users.removeUser(socket.id);
          users.addUser(socket.id, params.name, params.room);

          // Tell server to update user list for this room
          io.to(params.room).emit('updateUserList', users.getUserList(params.room));
          socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
          socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));

          callback();
        });

        socket.on('createMessage', (message, callback) => {
            // console.log('createMessage ', message);
            var user = users.getUser(socket.id);

            if (user && isRealString(message.text)) {
              io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            }

            // Acknowledgements
            callback('');
        });

        socket.on('createLocationMessage', (coords) => {
          var user = users.getUser(socket.id);
          if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
          }
        })

        socket.on('disconnect', () => {
            var removedUser = users.removeUser(socket.id);
            if (removedUser) {
              // Update list
              io.to(removedUser.room).emit('updateUserList', users.getUserList(removedUser.room));
              // Print leave message
              io.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} left the room`));
            }
        })
    });

    return io
}
