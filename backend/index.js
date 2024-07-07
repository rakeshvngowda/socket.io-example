import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import { connectToDatabase, disconnectFromDatabase } from "./mongoConnect.js";

config();


let db;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 *1000,
    skipMiddlewares: true
  }
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


io.on("connection", (socket) => {

  console.log("user is connected");

  socket.on('join room', (room)=> {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leave room', (room)=> {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('chat message', async ({room, message, userId}) => {
    console.log(message);
    console.log(userId);
    // io.to(room).emit('chat message', message);
    if (!room) {
      socket.emit('chat message', message);
    } else {
      // io.to(room).emit('chat message',message, userId);
      // socket.emit('chat message', message, userId);
      // io.emit('chat message', message, userId);
      const collection = db.collection('chats');
      const result = await collection.insertMany([{room: parseInt(room), message, userId}]);
      console.log(result);
      io.to(room).emit('chat message', {message,userId});
      // io.to(room).emit();
    }
    
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  db = await connectToDatabase();
});

const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnectFromDatabase();
  server.close(()=> {
    console.log('Server Stopped');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT',gracefulShutdown)
