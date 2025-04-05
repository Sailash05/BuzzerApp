const express = require("express");
const app = express();
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

app.use("/", require("./route/root"));

io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
  
    // Handle incoming messages
    socket.on("message", (data) => {
      console.log("💬 Message from client:", data);
  
      // Send to all clients except sender
      socket.broadcast.emit("message", data);
    });
  
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

//app.listen(PORT, () => console.log(`Port running on ${PORT}`));
server.listen(PORT, () => console.log(`Port running on ${PORT}`));
