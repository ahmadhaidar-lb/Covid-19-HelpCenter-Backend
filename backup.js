const express = require('express')
const http = require("http");
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary')
const fileUploadMiddleware = require('./file-upload-middleware')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const  Chat  = require("./models/chat.model");
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
      socket.on('join', ({ name, room }, callback) => {
        console.log(name,'name')
        console.log(room,'room')
        
        const { error, user } = addUser({ id: socket.id, name, room });
       
        if(error) return callback(error);
    
        socket.join(user.room);
    
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
        callback();
    });
    socket.on("addUser", (data) => {
        let x = [];
        let check = true;
        let lastSocketId = 0;
        x.userId = data.userId;
        x.userName = data.userName;
        
        if (check) {
            users[socket.id] = [userId = data.userId, userName = data.userName];
            console.log(users)
            
            currentUser = users[socket.id];
            socket.emit("yourID", socket.id);
            io.sockets.emit("allUsers", users);
        }
        else {
            console.log('ure already connected')
            socket.emit("yourID",lastSocketId);
            io.sockets.emit("allUsers", users);
        }
      
       /*  console.log(users); */
        //console.log(users[socket.id]);
        
    })
    socket.on("getHistory", (data) => {
        Chat.find({"requestId":data.requestId,$or:[{'sender':data.userId},{'receiver':data.userId}]})
        .then(chat =>{ 
            /* console.log(chat) */
            io.sockets.emit("userChats", chat);
          /*  console.log(chat) */
            })
        .catch(err => res.status(400).json('Error: ' + err));
        //users[socket.id]=JSON.parse({ userId:data.userId,userName:data.userName })
       /*  console.log(Object.keys(users).length) */
        Object.keys(users).map(key => {

            if (users[key][0] === data.userId) {
                check = false;
                lastSocketId = key;
            }
        });
 
     })
    socket.on("send message", body => {
        io.emit("message", body)
       /*  console.log(body) */
        let  chatMessage  =  new Chat({ body: body.body,requestId:body.requestId ,sender: body.sender,receiver:body.receiver,senderName:body.senderName});
    chatMessage.save();
    })

    //console.log(currentUser);

    // console.log(users);

    socket.on('disconnect', () => {
        console.log('disconnect')
        socket.disconnect();
    })

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

cloudinary.config({
  cloud_name: 'dpqdvfxov',
  api_key: '761931335432812',
  api_secret: 'QENeklIZOq64ABPkoeBqtwB5ps8',
})

const storage = multer.memoryStorage()
const upload = multer({ storage })
// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}



app.post('/api/files', upload.single('file'), fileUploadMiddleware)
app.post('/api/images', (req, res) => {
  console.log('/api/changeProfilePicture')
  console.log(req.body.url)
  res.json(req.body)
  // you can do whatever you want with this data
  // change profile pic, save to DB, or send it to another API 
})
// body parser
//app.use(bodyParser.json())
// Load routes
const authRouter = require('./routes/auth.route')
const userRouter = require('./routes/user.route')
const requestRouter = require('./routes/request.route')



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