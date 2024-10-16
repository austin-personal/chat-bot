import { MarkerType, Position } from "@xyflow/react";

export const nodes = [
  {
    id: "VPC",
    type: "group",
    data: { label: "VPC" },
    position: {
      x: 0,
      y: 0,
    },
    style: {
      width: 400,
      height: 400,
      borderWidth: "medium",
      borderColor: "rgb(73, 114, 67)",
    },
  },
  {
    id: "Availability",
    type: "group",
    position: {
      x: (400 - 350) / 2,
      y: (400 - 350) / 2,
    },
    style: {
      width: 350,
      height: 350,
      // backgroundColor: "rgba(231, 243, 249,0.5)",
      borderStyle: "dashed",
      borderWidth: "medium",
      borderColor: "rgba(74, 106, 123,1)",
    },
    parentId: "VPC",
    extent: "parent",
  },
  {
    id: "Private",
    type: "group",
    position: {
      x: (400 - 350) / 2,
      y: (400 - 350) / 2,
    },
    style: {
      width: 300,
      height: 230,
      backgroundColor: "rgba(231, 243, 249,0.5)",
      border: "none",
      borderColor: "rgba(74, 106, 123,1)",
    },
    parentId: "Availability",
    extent: "parent",
  },
  {
    id: "1",
    type: "imageNode",
    position: { x: 30, y: 30 },
    data: {
      imgUrl: "https://icon.icepanel.io/AWS/svg/Compute/EC2.svg",
      position: Position.Right,
    },
    parentId: "Private",
    extent: "parent",
    hidden: true,
  },
  {
    id: "2",
    type: "imageNode",
    position: { x: 200, y: 40 },
    data: {
      imgUrl: "https://icon.icepanel.io/AWS/svg/Database/RDS.svg",
      position: Position.Left,
    },
    parentId: "Private",
    extent: "parent",
    hidden: true,
  },
];

export const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "step",
    label: "",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    markerStart: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "black", // 엣지의 색상을 검정색으로 설정
      strokeDasharray: "4 2",
    },
    sourceHandle: "a",
    targetHandle: "b",
  },
];
