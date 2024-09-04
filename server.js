const express=require("express");
const path = require("path");
const SocketIo=require("socket.io");
const app=express();
const namespaces=require("./data/namespaces");
const Room = require("./classes/room");

app.use(express.static(path.join(__dirname,'public')));

const expressServer=app.listen(3000);
// const io=SocketIo(expressServer,{
//     cors:{
//         origin:"https://nearby-krill-night-coders-8d05e488.koyeb.app/"
//     }
// });

const io = SocketIo(expressServer, {
    cors: {
      origin: ["*", "https://nearby-krill-night-coders-8d05e488.koyeb.app"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  


app.get('/change-ns',(req,res)=>{

    namespaces[0].addRoom(new Room(0,'hackers Chat',0));

    io.of(namespaces[0].endpoint).emit('nsChange',namespaces[0]);
    res.json(namespaces[0]);
});


io.on('connection' ,(socket)=>{


    const userName=socket.handshake.query.userName;

    socket.emit('welcome',"welcome to the server") ;
    
    socket.on('clientConnect',(data)=>{
        console.log(socket.id,"has connected");
        socket.emit('nsList',namespaces);
    });


});

namespaces.forEach(namespace =>{

    io.of(namespace.endpoint).on('connection',(socket)=>{
        // console.log(`${socket.id} has connected to ${namespace.endpoint}`);
        socket.on('joinRoom', async(roomObj,ackCallback)=>{
        
            const thisNs=namespaces[roomObj.namespaceId];
            const thisRoomObj=thisNs.rooms.find(room=>room.roomTitle===roomObj.roomTitle);
            const thisRoomHistory=thisRoomObj.history;


         //leave all the rooms ,because the client can only be in one room
            const rooms=socket.rooms;
            // console.log(rooms);
            let i=0;
                rooms.forEach( rm=>{
                    if(i!==0){
                        socket.leave(rm);
                    }
                 i++; 
                
                })

            // joined the room
            socket.join(roomObj.roomTitle);

            // fetch the number of sockets in this room
            const sockets=await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets();
            const SocketCount=sockets.length;


            ackCallback({
                numUsers:SocketCount,
                thisRoomHistory
            });
            
        })

        socket.on('newMssgToRoom',mssgObj=>{
            console.log(mssgObj);
            
            const rooms=socket.rooms;
            const currentRoom=[...rooms][1];

            // send out this mssgObj to everyone including the sender
            io.of(namespace.endpoint).in(currentRoom).emit('mssgToRoom',mssgObj)

            // add this message to this rooms history
            const thisNs=namespaces[mssgObj.selectedNsId];
            const thisRoom=thisNs.rooms.find(room=>room.roomTitle===currentRoom);
            thisRoom. addMessage(mssgObj);
        })
    })
})



