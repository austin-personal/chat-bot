import './css/Chatbot.css';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';

// 챗봇프롭 타입 선언
interface ChatbotProps {
    onNewMessage: (message: string) => void;
}

// 허용된 메시지 리스트
const allowedMessages = ['ec2', 'rds'];

// 메세지 타입 선언
interface Message {
    type: 'user' | 'bot';
    text: string;
    id: number;
    show: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ onNewMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    // 파싱 임시 테스트 //
    const hardCordingSentence = (text: string) => text.endsWith('로 생성해줘')
        ? text.slice(0, -6).trim()
        : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: Message = { type: 'user', text: inputValue, id: Date.now(), show: true };
        const newMessages = [...messages, userMessage];

        try {
            const response = await axios.post('http://localhost:3002/chatbot/ask', { message: inputValue });
            const botText = response.data.response.content[0].text;
            const botMessage: Message = { type: 'bot', text: botText, id: Date.now(), show: false };
            setMessages([...newMessages, botMessage]);

            // 파싱 임시 테스트 //
            const hardCordingText = hardCordingSentence(inputValue);
            if (allowedMessages.includes(hardCordingText)) {
                onNewMessage(hardCordingText);
            }

            setTimeout(() => {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) => (msg.id === botMessage.id ? { ...msg, show: true } : msg))
                );
            }, 500);
        } catch (error) {
            console.error('비상!!! :', error);
        }

        setInputValue('');
    };

    // 스크롤 하단 고정 //
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatContainer">
            <div className="chatBox" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chatMessage ${msg.type} ${msg.show ? 'show' : ''}`}>
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
};

export default Chatbot;