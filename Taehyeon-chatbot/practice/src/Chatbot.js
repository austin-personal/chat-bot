import './Chatbot.css';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

function Chatbot({ onNewMessage }) {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([]);
    const chatBoxRef = useRef(null);

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

        if (inputValue.trim() === '') return; // 빈 메시지는 무시

        const userMessage = { type: 'user', text: inputValue, id: Date.now(), show: true };
        const newMessages = [...messages, userMessage];

        try {
            const response = await axios.post('http://localhost:3002/chatbot/ask', {
                message: inputValue,
            });

            const botText = response.data.response.content[0].text;
            const botMessage = {
                type: 'bot',
                text: botText,
                show: false,
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
                        msg.id === botMessage.id ? { ...msg, show: true } : msg
                    )
                );
            }, 500);
        } catch (error) {
            console.error('비상!!! : ', error);
        }

        setInputValue('');
    };

    // 스크롤을 맨 아래로 자동 이동
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatContainer">
            <div className="chatBox" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chatMessage ${msg.type} ${msg.show ? 'show' : ''}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <form className="chatInput" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default Chatbot;