import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot } from 'lucide-react';

const AINode = ({ data, id }: NodeProps) => {
  const [content, setContent] = useState(data.content || '');
  const [aiPrompt, setAiPrompt] = useState(data.aiPrompt || '');

  const handleContentChange = (value: string) => {
    setContent(value);
    if (data.onUpdate) {
      data.onUpdate(id, { content: value });
    }
  };

  const handleAiPromptChange = (value: string) => {
    setAiPrompt(value);
    if (data.onUpdate) {
      data.onUpdate(id, { aiPrompt: value });
    }
  };

  return (
    <Card className="min-w-[300px] border-purple-500 border-2">
      <CardHeader className="pb-3 bg-purple-50 dark:bg-purple-950">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4" />
          AI Integration Node
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Message to User:
          </label>
          <Textarea
            placeholder="e.g., Ask me anything about this topic..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[60px] mt-1"
          />
        </div>
        
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            AI System Prompt:
          </label>
          <Textarea
            placeholder="e.g., You are a helpful teacher explaining..."
            value={aiPrompt}
            onChange={(e) => handleAiPromptChange(e.target.value)}
            className="min-h-[80px] mt-1"
          />
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} className="!bg-purple-500" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500" />
    </Card>
  );
};

export default memo(AINode);
