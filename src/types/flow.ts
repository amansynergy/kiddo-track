export interface FlowNode {
  id: string;
  type: 'question' | 'options' | 'answer' | 'ai';
  content: string;
  options?: FlowOption[];
  nextNodeId?: string;
  aiPrompt?: string;
}

export interface FlowOption {
  id: string;
  label: string;
  nextNodeId: string;
}

export interface DoubtFlow {
  id: string;
  name: string;
  subject: string;
  startNodeId: string;
  nodes: FlowNode[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  options?: FlowOption[];
}
