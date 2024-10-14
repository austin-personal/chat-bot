import './App.css';
import React, { useState } from 'react';
import Chatbot from './Chatbot';
import Simulation from './Simulation';
import './App.css'

function App() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    }

    return (
        <>
            <div className="AppBody">
                <Chatbot onNewMessage={handleNewMessage} />
                <Simulation messages={messages} />
            </div>
        </>
    )
}

export default App;