const express = require('express')
const http = require("http");
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
// Config dotev
require('dotenv').config({
    path: './config/config.env'
})

const app = express()

const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)
var users = {}
var currentUser = 1;

io.on('connection', socket => {
    /*   if (!users[socket.id]) {
          users[socket.id] = socket.id;
         
      } */

    socket.on("addUser", (data) => {
        let x = [];
        let check = true;
        let lastSocketId = 0;
        x.userId = data.userId;
        x.userName = data.userName;
        //users[socket.id]=JSON.parse({ userId:data.userId,userName:data.userName })
       /*  console.log(Object.keys(users).length) */
        Object.keys(users).map(key => {

            if (users[key][0] === data.userId) {
                check = false;
                lastSocketId = key;
            }
        });

        if (check) {
            users[socket.id] = [userId = data.userId, userName = data.userName];
            //console.log(users)
            
            currentUser = users[socket.id];
            socket.emit("yourID", socket.id);
            io.sockets.emit("allUsers", users);
        }
        else {
            console.log('ure already connected')
            socket.emit("yourID",lastSocketId);
            io.sockets.emit("allUsers", users);
        }
      
        console.log(users);
        //console.log(users[socket.id]);
        
    })



    //console.log(currentUser);

    // console.log(users);

    /* socket.on('disconnect', () => {
        console.log('disconnect')
        socket.disconnect();
    }) */

    socket.on("callUser", (data) => {
       console.log('3aytnela')
        console.log(data.userToCall)
        io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });

    })

    socket.on("acceptCall", (data) => {
        console.log('zobtet')
        io.to(data.to).emit('callAccepted', data.signal);
    })
});



// Connect to database
connectDB();

// body parser
app.use(bodyParser.json())
// Load routes
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
const requestRouter = require('./routes/request.route')
// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}

// Use Routes
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', requestRouter)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Page not founded"
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
server.listen(8000, () => console.log('video server is running on port 8000'));