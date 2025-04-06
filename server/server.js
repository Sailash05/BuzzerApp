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

io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("client", (data) => {
      console.log("💬 Message from client:", data);
      io.emit("client", data);
    });

    socket.on("admin", (data) => {
      console.log("Message from admin:", data);
      io.emit("admin", data);
    });
  
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => console.log(`Port running on ${PORT}`));