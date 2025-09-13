/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const socketIO = require('socket.io');

function initializeSocket(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg); // Broadcast message to all connected clients
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

module.exports = initializeSocket;
