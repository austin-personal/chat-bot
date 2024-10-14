import './Chatbot.css';
import React, { useState } from 'react';
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

function Chatbot({ onNewMessage }) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);

    // 임시 테스트
    function hardCordingSentence (text) {
        const lastSentence = text.slice(-6);
        console.log(lastSentence)
        console.log(text)
        if (lastSentence === "로 생성해줘") {
            return text.slice(0,-6).trim()
        }
        return ""
    }
    // 임시 테스트

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userMessage = { type: 'user', text: inputValue, id: Date.now() };
        const newMessages = [...messages, userMessage];

        try {
            const response = await axios.post('http://localhost:3002/chatbot/ask', {
                message: inputValue,
            });

            const botText = response.data.response.content[0].text;
            const botMessage = {
                type: 'bot',
                text: botText,
                isAnimating: true,
                id: Date.now(),
            };

            setMessages([...newMessages, botMessage]);
            
            // 임시 테스트 //
            const hardCordingText = hardCordingSentence(inputValue)
            onNewMessage(hardCordingText);
            // 임시 테스트 //

            setTimeout(() => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === botMessage.id ? { ...msg, isAnimating: false } : msg
                    )
                );
            }, botText.length * 50);
        } catch (error) {
            console.error('Error:', error);
        }

        setInputValue('');
    };

    const isAnimating = messages.some((msg) => msg.isAnimating);

    return (
        <div className="chatContainer">
            <div className="chatBox">
                {messages.map((msg, index) => (
                    <div key={index} className={`chatMessage ${msg.type}`}>
                        {msg.isAnimating ? (
                            <TypeAnimation
                                sequence={[msg.text]}
                                speed={50}
                                wrapper="span"
                                cursor={true}
                                repeat={0}
                            />
                        ) : (
                            msg.text
                        )}
                    </div>
                ))}
            </div>
            <form className="chatInput" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your message"
                    disabled={isAnimating}
                />
                <button type="submit" disabled={isAnimating}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chatbot;