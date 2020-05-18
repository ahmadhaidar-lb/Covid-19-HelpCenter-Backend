const express = require('express')
const http = require("http");

const app = express()

const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)
const users = {}
exports.chatController = (req, res) => {
    const userId=req.user._id;
    io.on('connection', socket => {
        if (!users[socket.id]) {
            users[socket.id] =userId;
        }
        socket.emit("yourID", userId);
        io.sockets.emit("allUsers", users);
        socket.on('disconnect', () => {
            delete users[socket.id];
        })
    
        socket.on("callUser", (data) => {
            io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
        })
    
        socket.on("acceptCall", (data) => {
            io.to(data.to).emit('callAccepted', data.signal);
        })
    });
    
    
    server.listen(8000, () => console.log('video server is running on port 8000'));
};
