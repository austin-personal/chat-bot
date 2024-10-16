import React, { useState } from 'react';
import Chatbot from './Chatbot';
import Simulation from './Simulation';
import './css/Body.css';

const Body: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const handleNewMessage = (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div className="AppBody">
            <Chatbot onNewMessage={handleNewMessage} />
            <Simulation messages={messages} />
        </div>
    );
};

export default Body;