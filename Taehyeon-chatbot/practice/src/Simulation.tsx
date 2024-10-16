import React from 'react';
import './css/Simulation.css';
import ReactFlow, { Node, NodeProps, Controls } from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

interface SimulationProps {
  messages: string[];
}

const imageMapping: Record<string, string> = {
  ec2: 'https://icon.icepanel.io/AWS/svg/Compute/EC2.svg',
  rds: 'https://icon.icepanel.io/AWS/svg/Database/RDS.svg',
};

const ImageNode: React.FC<NodeProps> = ({ data }) => (
  <div className="customNode">
    <img className="img" src={data.imgSrc} alt={data.label} />
  </div>
);

const createNodesFromMessages = (messages: string[]): Node[] =>
  messages.map((message, index) => ({
    id: `node-${index}`,
    type: 'imageNode',
    data: { label: `${message} Instance`, imgSrc: imageMapping[message] || '' },
    position: { x: 100 * index, y: 50 },
  }));

const Simulation: React.FC<SimulationProps> = ({ messages }) => {
  const nodes = createNodesFromMessages(messages);

  const nodeTypes = {
    imageNode: ImageNode,
  };

  return (
    <div className="simulationContainer">
      <div className="statusBox">
        <div className="statusBoxContent">project name : NaManMoo</div>
        <div className="statusBoxContent">status 🔴 🟢</div>
      </div>
      <div className="testBox">
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes}>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Simulation;
