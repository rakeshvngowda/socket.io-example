import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            if (!messages.includes(msg)) {
                setMessages((prevMessages) => [...prevMessages, msg]);
            }
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    const joinRoom = () => {
        socket.emit('join room', room);
    };

    const leaveRoom = () => {
        socket.emit('leave room', room);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('chat message', {room, message});
        setMessage('');
    };

    return (
        <div>
            <div>
                <input 
                type="text"
                placeholder='room...'
                value={room}
                onChange={(e)=> setRoom(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
                <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div>
                <input 
                type="text"
                placeholder='Messages'
                value={message}
                onChange={(e)=> setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>
            <ul>
                {messages.map((msg,index)=> (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
