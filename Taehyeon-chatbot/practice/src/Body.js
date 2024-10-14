import React, { useState } from 'react';
import Chatbot from './Chatbot';
import Simulation from './Simulation';
import './App.css';

function Body() {
    const [messages, setMessages] = useState([]);

    const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div className="AppBody">
            <Chatbot onNewMessage={handleNewMessage} />
            <Simulation messages={messages} />
        </div>
    );
}

export default Body;