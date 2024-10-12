import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

function App() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newMessages = [...messages, { type: 'user', text: inputValue }];

        try {
            const response = await axios.post('http://localhost:3002/chatbot/ask', {
                message: inputValue,
            });
            console.log(response.data.response.content[0].text);

            const botMessage = { type: 'bot', text: response.data.response.content[0].text, isAnimating: true, id: Date.now() };
            setMessages([...newMessages, botMessage]);

            setTimeout(() => {
                setMessages(prevMessages => 
                    prevMessages.map(message => 
                        message.id === botMessage.id ? { ...message, isAnimating: false } : message
                    )
                );
            }, 1000); 
        } catch (error) {
            console.error('비상!! : ', error);
        }

        setInputValue('');
    };

    const isAnimating = messages.length > 0 && messages[messages.length - 1].isAnimating;

    return (
        <div className="chatContainer">
            <div className="chatBox">
                {messages.map((message, index) => (
                    <div key={index} className={`chatMessage ${message.type}`}>
                        {message.isAnimating ? (
                            <TypeAnimation
                                sequence={[message.text]}
                                speed={50}
                                wrapper="span"
                                cursor={true}
                                repeat={0}
                            />
                        ) : (
                            message.text
                        )}
                    </div>
                ))}
            </div>
            <form className="chatInput" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="입력하세요."
                    disabled={isAnimating} 
                />
                <button type="submit" disabled={isAnimating}>Send</button>
            </form>
        </div>
    );
}

export default App;
