import React, { createContext, useContext, useState } from 'react';
import { DoubtFlow, FlowNode } from '@/types/flow';

interface FlowContextType {
  flows: DoubtFlow[];
  addFlow: (flow: DoubtFlow) => void;
  updateFlow: (flowId: string, flow: DoubtFlow) => void;
  deleteFlow: (flowId: string) => void;
  getFlowsBySubject: (subject: string) => DoubtFlow[];
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

// Default flows for demonstration
const defaultFlows: DoubtFlow[] = [
  {
    id: 'math-algebra-flow',
    name: 'Algebra Help',
    subject: 'Mathematics',
    startNodeId: 'welcome',
    nodes: [
      {
        id: 'welcome',
        type: 'question',
        content: 'Hi! I\'m here to help with Algebra. What would you like to learn about?',
        options: [
          { id: 'opt1', label: 'Linear Equations', nextNodeId: 'linear' },
          { id: 'opt2', label: 'Quadratic Equations', nextNodeId: 'quadratic' },
          { id: 'opt3', label: 'Ask AI', nextNodeId: 'ai-help' },
        ],
      },
      {
        id: 'linear',
        type: 'answer',
        content: 'Linear equations are equations of the first degree. They have the form ax + b = c. Would you like to see examples or practice problems?',
        options: [
          { id: 'opt1', label: 'Show Examples', nextNodeId: 'linear-examples' },
          { id: 'opt2', label: 'Practice Problems', nextNodeId: 'linear-practice' },
          { id: 'opt3', label: 'Back to Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'linear-examples',
        type: 'answer',
        content: 'Example 1: Solve 2x + 5 = 13\nSolution: Subtract 5 from both sides: 2x = 8\nDivide by 2: x = 4\n\nExample 2: Solve 3x - 7 = 14\nSolution: Add 7 to both sides: 3x = 21\nDivide by 3: x = 7',
        options: [
          { id: 'opt1', label: 'More Examples', nextNodeId: 'linear-examples' },
          { id: 'opt2', label: 'Practice Problems', nextNodeId: 'linear-practice' },
          { id: 'opt3', label: 'Back to Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'linear-practice',
        type: 'answer',
        content: 'Practice Problem: Solve 5x + 3 = 23\n\nTry solving it yourself, then check: x = 4',
        options: [
          { id: 'opt1', label: 'Another Problem', nextNodeId: 'linear-practice' },
          { id: 'opt2', label: 'Back to Linear Equations', nextNodeId: 'linear' },
          { id: 'opt3', label: 'Main Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'quadratic',
        type: 'answer',
        content: 'Quadratic equations have the form ax² + bx + c = 0. We can solve them using:\n1. Factoring\n2. Quadratic Formula\n3. Completing the Square\n\nWhich method would you like to learn?',
        options: [
          { id: 'opt1', label: 'Factoring', nextNodeId: 'quad-factoring' },
          { id: 'opt2', label: 'Quadratic Formula', nextNodeId: 'quad-formula' },
          { id: 'opt3', label: 'Back to Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'quad-factoring',
        type: 'answer',
        content: 'Factoring Method:\nExample: x² + 5x + 6 = 0\nFactor: (x + 2)(x + 3) = 0\nSolutions: x = -2 or x = -3',
        options: [
          { id: 'opt1', label: 'More on Factoring', nextNodeId: 'quad-factoring' },
          { id: 'opt2', label: 'Try Quadratic Formula', nextNodeId: 'quad-formula' },
          { id: 'opt3', label: 'Back to Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'quad-formula',
        type: 'answer',
        content: 'Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a\n\nFor ax² + bx + c = 0\n\nExample: x² + 3x + 2 = 0\na = 1, b = 3, c = 2\nx = (-3 ± √(9 - 8)) / 2\nx = (-3 ± 1) / 2\nSolutions: x = -1 or x = -2',
        options: [
          { id: 'opt1', label: 'Practice Problems', nextNodeId: 'quad-practice' },
          { id: 'opt2', label: 'Back to Quadratics', nextNodeId: 'quadratic' },
          { id: 'opt3', label: 'Main Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'quad-practice',
        type: 'answer',
        content: 'Practice: Solve x² - 5x + 6 = 0\n\nTry it yourself!\nAnswer: x = 2 or x = 3',
        options: [
          { id: 'opt1', label: 'Another Problem', nextNodeId: 'quad-practice' },
          { id: 'opt2', label: 'Back to Quadratics', nextNodeId: 'quadratic' },
          { id: 'opt3', label: 'Main Menu', nextNodeId: 'welcome' },
        ],
      },
      {
        id: 'ai-help',
        type: 'ai',
        content: 'Ask me anything about Algebra! I\'ll provide a detailed explanation.',
        aiPrompt: 'You are helping a student with Algebra. Provide clear, step-by-step explanations.',
      },
    ],
  },
  {
    id: 'science-physics-flow',
    name: 'Physics Concepts',
    subject: 'Science',
    startNodeId: 'physics-start',
    nodes: [
      {
        id: 'physics-start',
        type: 'question',
        content: 'Welcome to Physics Help! What topic interests you?',
        options: [
          { id: 'opt1', label: 'Newton\'s Laws', nextNodeId: 'newtons-laws' },
          { id: 'opt2', label: 'Energy', nextNodeId: 'energy' },
          { id: 'opt3', label: 'Ask AI', nextNodeId: 'physics-ai' },
        ],
      },
      {
        id: 'newtons-laws',
        type: 'answer',
        content: 'Newton\'s Three Laws of Motion:\n\n1. First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.\n\n2. Second Law: F = ma (Force equals mass times acceleration)\n\n3. Third Law: For every action, there is an equal and opposite reaction.',
        options: [
          { id: 'opt1', label: 'Examples', nextNodeId: 'newton-examples' },
          { id: 'opt2', label: 'Back to Menu', nextNodeId: 'physics-start' },
        ],
      },
      {
        id: 'newton-examples',
        type: 'answer',
        content: 'Examples:\n\n1st Law: A soccer ball stays still until kicked.\n\n2nd Law: Pushing a car (large mass) requires more force than pushing a bicycle (small mass) for the same acceleration.\n\n3rd Law: When you jump, you push down on the ground, and the ground pushes you up.',
        options: [
          { id: 'opt1', label: 'Back to Laws', nextNodeId: 'newtons-laws' },
          { id: 'opt2', label: 'Main Menu', nextNodeId: 'physics-start' },
        ],
      },
      {
        id: 'energy',
        type: 'answer',
        content: 'Energy comes in many forms:\n\n- Kinetic Energy: Energy of motion (KE = ½mv²)\n- Potential Energy: Stored energy (PE = mgh)\n- Thermal Energy: Heat energy\n- Chemical Energy: Stored in bonds\n\nThe Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed.',
        options: [
          { id: 'opt1', label: 'Energy Examples', nextNodeId: 'energy-examples' },
          { id: 'opt2', label: 'Back to Menu', nextNodeId: 'physics-start' },
        ],
      },
      {
        id: 'energy-examples',
        type: 'answer',
        content: 'Energy Transformations:\n\n- Roller coaster: Potential energy → Kinetic energy\n- Battery: Chemical energy → Electrical energy\n- Solar panel: Light energy → Electrical energy\n- Plants: Light energy → Chemical energy (photosynthesis)',
        options: [
          { id: 'opt1', label: 'Back to Energy', nextNodeId: 'energy' },
          { id: 'opt2', label: 'Main Menu', nextNodeId: 'physics-start' },
        ],
      },
      {
        id: 'physics-ai',
        type: 'ai',
        content: 'Ask me any Physics question! I\'ll explain it clearly.',
        aiPrompt: 'You are helping a student with Physics. Use real-world examples and explain concepts step by step.',
      },
    ],
  },
];

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flows, setFlows] = useState<DoubtFlow[]>(defaultFlows);

  const addFlow = (flow: DoubtFlow) => {
    setFlows(prev => [...prev, flow]);
  };

  const updateFlow = (flowId: string, flow: DoubtFlow) => {
    setFlows(prev => prev.map(f => (f.id === flowId ? flow : f)));
  };

  const deleteFlow = (flowId: string) => {
    setFlows(prev => prev.filter(f => f.id !== flowId));
  };

  const getFlowsBySubject = (subject: string) => {
    return flows.filter(f => f.subject === subject);
  };

  return (
    <FlowContext.Provider
      value={{
        flows,
        addFlow,
        updateFlow,
        deleteFlow,
        getFlowsBySubject,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlows = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlows must be used within a FlowProvider');
  }
  return context;
};
