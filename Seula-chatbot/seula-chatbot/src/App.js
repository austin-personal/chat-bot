import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]); //모든 채팅 메시지를 저장
  const [currentTypingId, setCurrentTypingId] = useState(null); //현재 AI가 타이핑하는 메세지를 추적
  //사용자가 메세지를 보낼 때 호출되는 함수
  //메세지의 상태를 업데이트 하여 사용자의 메세지와 AI의 응답을 기존 메세지 목록에 추가.
  //isTyping: True => 타이핑 애니메이션 트리거
  //message 인자는 사용자가 채팅 창에 입력한 텍스트
  const handleSendMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true },
      {
        text: `my answer is "${message}"`,
        isUser: false,
        isTyping: true,
        id: Date.now(),
      },
    ]);
  };
  //AI 메시지 타이핑 종료 시 handleEndTyping 호출
  //인자 id: 타이핑이 종료된 메시지의 ID
  const handleEndTyping = (id) => {
    // 특정 메시지에 대한 타이핑 애니메이션이 종료되었음을 업데이트
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isTyping: false } : msg
      )
    );
    //현재 타이핑 중인 메시지가 없음을 업데이트
    setCurrentTypingId(null);
  };
  //useEffect :  messages 또는 currentTypingId가 변경될 때마다 실행
  useEffect(() => {
    //현재 타이핑 중인 메시지가 없을 때
    if (currentTypingId === null) {
      //AI가 현재 타이핑 중인 메세지를 찾는다.
      const nextTypingMessage = messages.find(
        (msg) => !msg.isUser && msg.isTyping
      );
      //AI가 현재 타이핑 중인 메세지가 있으면
      //currentTypingId를 다음 메시지의 id로 설정하여 해당 메시지의 타이핑 애니메이션을 시작
      //currentTypingId를 해당 메시지의 id로 설정
      if (nextTypingMessage) {
        setCurrentTypingId(nextTypingMessage.id);
      }
    }
  }, [messages, currentTypingId]);

  return (
    <div className="App">
      <h1>Chat App</h1>
      <div className="chat-box">
        <MessageList
          messages={messages}
          currentTypingId={currentTypingId}
          onEndTyping={handleEndTyping}
        />
        <MessageForm
          onSendMessage={handleSendMessage}
          isTyping={currentTypingId !== null}
        />
      </div>
    </div>
  );
}
//채팅 메세지 목록 렌더링 컴포넌트 작성
//메시지 배열과 현재 타이핑 중인 메시지의 id를 props로 전달받고 메시지 목록을 렌더링
const MessageList = ({ messages, currentTypingId, onEndTyping }) => (
  <div className="messages-list">
    {messages.map((message) =>
      message.isTyping && message.id === currentTypingId ? (
        <TypeAnimation
          key={message.id}
          sequence={[message.text, () => onEndTyping(message.id)]}
          speed={50}
          wrapper="span"
        >
          <div className={message.isUser ? "user-message" : "ai-message"}>
            {message.text}
          </div>
        </TypeAnimation>
      ) : (
        <div
          key={message.id}
          className={message.isUser ? "user-message" : "ai-message"}
        >
          {message.text}
        </div>
      )
    )}
  </div>
);

const MessageForm = ({ onSendMessage, isTyping }) => {
  const [message, setMessage] = useState(""); //사용자 입력 상태 관리
  //사용자가 전송버튼 또는 엔터를 누를 때 실행
  const handleSubmit = (event) => {
    event.preventDefault(); //기본 제출 동작의 새로고침 방지

    onSendMessage(message); //메세지 보내기

    setMessage(""); //메세지 입력 필드 초기화
  };
  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isTyping}
      />
      <button className="send-button" type="submit">
        Send
      </button>
    </form>
  );
};

export default App;
