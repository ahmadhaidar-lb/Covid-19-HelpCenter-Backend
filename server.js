const express = require('express')
const http = require("http");
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary')
const fileUploadMiddleware = require('./file-upload-middleware')

const { addUser,getUserById, removeUser, getUser, getUsersInRoom } = require('./users');
const  Chat  = require("./models/chat.model");
const  Notification  = require("./models/notification.model");
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
      socket.on('join', (data) => {
        const { error, user } = addUser({ id: socket.id, data });
        if(!error)
        socket.join(user.room);
        else console.log(error)
        if(!error)
        socket.emit("yourID",user);
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    })
    
    socket.on("getHistory", (data) => {
        
        Chat.find({"roomId":data.roomId})
        .then(chat =>{ 
            /* console.log(chat) */
            
           socket.emit("userChats", chat);
          /*  console.log(chat) */
            })
        .catch(err => res.status(400).json('Error: ' + err));
      
 
     })
    socket.on("send message", body => {
        const thisUser = getUser(socket.id);
        
        io.to(thisUser.room).emit('message', { sender:body.sender,receiver:body.receiver,roomId:body.roomId,requestId:body.requestId,senderName:body.senderName,user: thisUser.name, body: body.body });

       /*  console.log(body) */
        let  chatMessage  =  new Chat({ body: body.body,requestId:body.requestId ,sender: body.sender,roomId:body.roomId,receiver:body.receiver,senderName:body.senderName});
        let notification=new Notification({requestUserId:body.requestUserId,receiver:body.receiver,sender:body.sender,senderName:body.senderName,requestId:body.requestId,requestTitle:body.requestTitle})
        let roomUsers=getUsersInRoom(body.roomId);
        let userInRoom=roomUsers.find((user) => user.name === body.receiver);
        if(!userInRoom)
            notification.save();
        chatMessage.save();
    })
    socket.on("video notification", body => {
        const thisUser = getUser(socket.id);
        console.log('tamem')
        let notification=new Notification({type:1,requestUserId:body.requestUserId,receiver:body.receiver,sender:body.sender,senderName:body.senderName,requestId:body.requestId,requestTitle:body.requestTitle})
        let roomUsers=getUsersInRoom(body.roomId);
        let userInRoom=roomUsers.find((user) => user.name === body.receiver);
        if(!userInRoom)
            notification.save();
       
    })
    socket.on('disconnect', () => {
        console.log('disconnect')
        socket.disconnect();
    })

    socket.on("callUser", (data) => {
       console.log('3aytnela')
        console.log(data.userToCall)
        io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });

    })
    socket.on('toggleVideo',(data)=>{
        console.log(data.id,'k')
        
        io.sockets.emit("doToggleVideo",{id:data.id});
    })
    socket.on("acceptCall", (data) => {
        console.log('zobtet')
        io.to(data.to).emit('callAccepted', data.signal);
    })
    socket.on('leaveCall',(data)=>{
       
        
        io.to(data.roomId).emit('endCall');
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
const notificationRouter=require('./routes/notification.route')


// Use Routes
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', requestRouter)
app.use('/api', notificationRouter)
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