import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routing
app.use(express.static(join(__dirname, 'public')));

//Chatroom

let numUsers = 0;

io.on('connection', (socket)=> {
    let addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data)=> {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data,
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username)=> {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });

        // echo globally (All clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username,
        });
    });

    // when user disconnect... perform this
    socket.on('disconnect', ()=> {
        if (addedUser) {
            --numUsers;

            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    })
})



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});