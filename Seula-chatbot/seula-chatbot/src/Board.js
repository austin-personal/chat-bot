import React, { useEffect, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Handle,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodes as initialNodes, edges as initialEdges } from "./Elements";
//text만 있는 노드
const TextNode = ({ data }) => {
  return <div>{data.label}</div>;
}; //커스텀 노드 정의 (이미지 포함 노드)
const ImageNode = ({ data }) => {
  return (
    <div>
      <Handle type="source" position={data.position} id="a" />
      <img src={data.imgUrl} alt="ec2" className="rounded-md" />
      <Handle type="target" position={data.position} id="b" />
    </div>
  );
};
const nodeTypes = {
  imageNode: ImageNode, //커스텀 노드 등록
  textNode: TextNode,
};
export default function Board({ onShowNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, onEdgesChange] = useEdgesState(initialEdges);
  // useCallback으로 showNodeById를 메모이제이션
  const showNodeById = useCallback(
    (nodeId) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, hidden: false } : node
        )
      );
    },
    [setNodes]
  );

  // 부모 컴포넌트에 노드를 보여주는 함수를 전달 (렌더링 후에 한 번만)
  useEffect(() => {
    if (onShowNode) {
      onShowNode(showNodeById); // 부모에게 showNodeById 전달
    }
  }, [onShowNode, showNodeById]); // showNodeById를 의존성 배열에 추가

  return (
    //너비와 높이가 있는 element로 무조건 감싸야 함! 상위에서 감싸고 있음!
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  );
}
