import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:5000/');

function App() {
    const [room, setRoom] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userId,setUserId] = useState(uuidv4());
    window.userId = userId;
    
    useEffect(() => {
        socket.on('chat message', ({message,userId}) => {
            // if (!messages.includes(msg)) {
            //     setMessages((prevMessages) => [...prevMessages, msg]);
            // }
            console.log("userId", userId);
            const eachMsg = {message,userId};
            setMessages((prevMessaga) => [...prevMessaga, eachMsg]);
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

    const sendMessage = () => {
        socket.emit('chat message',{ room, message,userId });
        setMessage('');
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder='room...'
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
                <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder='Messages'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>
            <ul>
                {messages.map((value, index) => (
                    <li key={index} style={{
                        textAlign: userId== value.userId ? 'left': 'right',
                        backgroundColor: userId== value.userId ? 'green': 'gray',
                        color: userId== value.userId ? 'white': 'black'
                    }}>{value.message}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
