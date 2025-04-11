const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const PORT = 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', "front-end")));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

router.route('/')
.get((req,res) => {
     res.sendFile(path.join(__dirname,'..','front-end','index.html'));
});
router.route('/admin')
.get((req, res) => {
  res.sendFile(path.join(__dirname, '..','front-end','admin.html'));
});

const rooms = {};

io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on('joinRoom', ({roomCode, teamName, isAdmin}) => {
        if(!rooms[roomCode]) {
            if(!isAdmin) {
                socket.emit("error", "Room does not exist. Please check the room code.")
                return;
            }
            rooms[roomCode] = {
                adminId: socket.id,
                clients: [],
                details: []
            };
            console.log(`🛠️ Admin created and joined room ${roomCode}`);
        }
        else {
            if(isAdmin) {
                socket.emit("error", "Room already has an admin.");
                return;
            }
            rooms[roomCode].clients.push(socket.id);
            socket.data.teamName = teamName;
            console.log(`👤 ${teamName} joined room ${roomCode}`);
        }
        socket.join(roomCode);        
    });

    socket.on("client", ({ roomCode, teamName, time }) => {
        const room = rooms[roomCode];
        if (!room) {
            socket.emit("error", "Room does not exist.");
            return;
        }

        const alreadyBuzzed = room.details.find(entry => entry.teamName === teamName);
        if (alreadyBuzzed) return;

        const buzzData = { teamName, time };
        room.details.push(buzzData);
        room.details.sort((a, b) => a.time - b.time); // sort by buzz time

        console.log(`🔔 ${teamName} buzzed in room ${roomCode} at ${time}`);
        io.to(roomCode).emit("client", room.details); // broadcast updated buzz list
    });

    socket.on("admin", ({ roomCode, command }) => {
        const room = rooms[roomCode];
        if (!room || room.adminId !== socket.id) {
            socket.emit("error", "Unauthorized admin or room does not exist.");
            return;
        }

        if (command === "UNLOCK") {
            room.details = [];
            console.log(`🔄 Buzzer reset in room ${roomCode}`);
            io.to(roomCode).emit("admin", "UNLOCK");
        } else {
            io.to(roomCode).emit("admin", command);
        }
    });


    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        for (const [roomCode, room] of Object.entries(rooms)) {
            if (room.adminId === socket.id) {
                console.log(`🗑️ Admin left, deleting room ${roomCode}`);
                io.to(roomCode).emit("admin", "ROOM_CLOSED");
                delete rooms[roomCode];
            } 
            else {
                room.clients = room.clients.filter(id => id !== socket.id);
            }
        }
    });
});

server.listen(PORT, () => console.log(`Port running on ${PORT}`));