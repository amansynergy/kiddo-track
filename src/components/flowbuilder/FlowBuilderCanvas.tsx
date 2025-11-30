import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowNode as CustomFlowNode } from '@/types/flow';
import QuestionNode from './nodes/QuestionNode';
import AnswerNode from './nodes/AnswerNode';
import AINode from './nodes/AINode';

const nodeTypes: NodeTypes = {
  question: QuestionNode,
  answer: AnswerNode,
  ai: AINode,
};

interface FlowBuilderCanvasProps {
  initialNodes?: CustomFlowNode[];
  onNodesChange?: (nodes: CustomFlowNode[]) => void;
}

export const FlowBuilderCanvas = ({ initialNodes = [], onNodesChange }: FlowBuilderCanvasProps) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: 'question' | 'answer' | 'ai') => {
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: `${type} Node`,
        content: '',
        options: type === 'ai' ? undefined : [],
        onUpdate: handleNodeUpdate,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
    
    // Notify parent
    if (onNodesChange) {
      const updatedNodes = convertToCustomNodes([...nodes, newNode]);
      onNodesChange(updatedNodes);
    }
  };

  const handleNodeUpdate = (nodeId: string, updates: Partial<CustomFlowNode>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );

    // Notify parent of changes
    if (onNodesChange) {
      const updatedNodes = convertToCustomNodes(
        nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      );
      onNodesChange(updatedNodes);
    }
  };

  const convertToCustomNodes = (reactFlowNodes: Node[]): CustomFlowNode[] => {
    return reactFlowNodes.map((node) => ({
      id: node.id,
      type: node.type as 'question' | 'answer' | 'ai',
      content: node.data.content || '',
      options: node.data.options,
      nextNodeId: node.data.nextNodeId,
      aiPrompt: node.data.aiPrompt,
    }));
  };

  return (
    <div className="h-full w-full">
      <div className="absolute top-4 left-4 z-10 bg-card p-4 rounded-lg shadow-lg space-x-2">
        <button
          onClick={() => addNode('question')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Question
        </button>
        <button
          onClick={() => addNode('answer')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Answer
        </button>
        <button
          onClick={() => addNode('ai')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          + AI Node
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
