import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import "./App.css";
import axios from "axios"; //백엔드 연결 위함
function App() {
  const [messages, setMessages] = useState([]); //모든 채팅 메시지를 저장
  const [currentTypingId, setCurrentTypingId] = useState(null); //현재 AI가 타이핑하는 메세지를 추적
  const [ec2Messages, setEc2Messages] = useState([]);
  //사용자가 메세지를 보낼 때 호출되는 함수
  //메세지의 상태를 업데이트 하여 사용자의 메세지와 AI의 응답을 기존 메세지 목록에 추가.
  //isTyping: True => 타이핑 애니메이션 트리거
  //message 인자는 사용자가 채팅 창에 입력한 텍스트
  const handleSendMessage = async (message) => {
    console.log(message);

    try {
      const newMessages = [...messages, { isUser: true, text: message }];

      const response = await axios.post("http://localhost:3002/chatbot/ask", {
        message: message,
      });
      const botMessage = {
        isUser: false,
        text: response.data.response.content[0].text,
        isTyping: true,
        id: Date.now(),
      };
      setMessages([...newMessages, botMessage]);
      if (message.includes("로 생성해줘")) {
        setEc2Messages((prevEc2Messages) => [
          ...prevEc2Messages,
          message.replace("로 생성해줘", "").trim(),
        ]);
      }
    } catch (error) {
      console.error("비상!! : ", error);
    }
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
    <div className="App flex flex-col w-screen h-screen bg-gray-100 p-5 px-10">
      <div className="grid grid-cols-[1.5fr_2.25fr] gap-2 w-full h-full">
        <div className="chat-box p-2 grid grid-rows-[4fr_0.2fr] bg-white rounded-md overflow-y-auto">
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
        <div className="archi-box rounded-md h-full flex flex-col  ">
          <div className="text-left rounded-md h-1/6 mb-2 bg-white px-10 flex flex-col justify-center">
            <p className="mb-2">ProjectName : Namanmu</p>
            <div className="flex items-center">
              <span className="mr-2">status :</span>
              <span className="h-3.5 w-3.5 bg-[#ff605c] rounded-xl mr-1"></span>
              <span>2</span>
              <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-xl mr-1"></span>
              <span>2</span>
            </div>
          </div>
          <div className="rounded-md h-5/6 bg-white p-2">
            <ul>
              {ec2Messages.map((msg, index) => (
                <li
                  key={index}
                  className="border-dashed border-2 size-48 rounded-lg flex justify-center items-center"
                >
                  <img
                    src="https://icon.icepanel.io/AWS/svg/Compute/EC2.svg"
                    alt="AWS S3 Icon"
                    className="rounded-md shadow-lg w-40 h-40"
                  />
                  {/* {msg} */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

//채팅 메세지 목록 렌더링 컴포넌트 작성
//메시지 배열과 현재 타이핑 중인 메시지의 id를 props로 전달받고 메시지 목록을 렌더링
const MessageList = ({ messages, currentTypingId, onEndTyping }) => (
  <div className="messages-list items-center mx-2">
    {messages.map((message) =>
      message.isTyping && message.id === currentTypingId ? (
        <TypeAnimation
          key={message.id}
          sequence={[message.text, () => onEndTyping(message.id)]}
          speed={100}
          wrapper="div"
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
  const handleSubmit = async (event) => {
    event.preventDefault(); //기본 제출 동작의 새로고침 방지
    onSendMessage(message); //메세지 보내기

    setMessage(""); //메세지 입력 필드 초기화
  };
  return (
    <div class="border rounded-lg bottom-2 p-2 mx-auto">
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className=" py-2 border-none focus:outline-none text-gray-700 message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isTyping}
        />
        <button
          className=" bg-blue-500  hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none send-button"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
