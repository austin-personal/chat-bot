import React from 'react';
import './Simulation.css';

// 이미지 매핑 객체
const imageMapping = {
    ec2: 'https://icon.icepanel.io/AWS/svg/Compute/EC2.svg',
    rds: 'https://icon.icepanel.io/AWS/svg/Database/RDS.svg',
};

// 이미지 컴포넌트
function ImageRenderer({ text, index }) {
    const imgSrc = imageMapping[text];
    if (!imgSrc) return null; // 이미지가 없으면 아무것도 렌더링하지 않음

    return <img key={index} className="img" src={imgSrc} alt={`${text} Instance`} />;
}

function Simulation({ messages }) {
    return (
        <div className="simulationContainer">
            <div className="statusBox">
                <div className='statusBoxContent'>project name : abc</div>
                <div className='statusBoxContent'>status</div>
            </div>
            <div className="testBox">
                {messages.map((text, index) => (
                    <ImageRenderer key={index} text={text} index={index} />
                ))}
            </div>
        </div>
    );
}

export default Simulation;
