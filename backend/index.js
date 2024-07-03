import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

io.on("connection", (socket) => {

  

  socket.on('join room', (room)=> {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leave room', (room)=> {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('chat message', ({room, message}) => {
    console.log(message);
    // io.to(room).emit('chat message', message);
    socket.broadcast.to(room).emit('chat message',message)
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });


});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
