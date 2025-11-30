import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Plus, X } from 'lucide-react';

const AnswerNode = ({ data, id }: NodeProps) => {
  const [content, setContent] = useState(data.content || '');
  const [options, setOptions] = useState(data.options || []);
  const [newOption, setNewOption] = useState('');

  const handleContentChange = (value: string) => {
    setContent(value);
    if (data.onUpdate) {
      data.onUpdate(id, { content: value });
    }
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    const option = {
      id: `opt-${Date.now()}`,
      label: newOption,
      nextNodeId: '',
    };
    const updated = [...options, option];
    setOptions(updated);
    setNewOption('');
    if (data.onUpdate) {
      data.onUpdate(id, { options: updated });
    }
  };

  const removeOption = (optionId: string) => {
    const updated = options.filter((o: any) => o.id !== optionId);
    setOptions(updated);
    if (data.onUpdate) {
      data.onUpdate(id, { options: updated });
    }
  };

  return (
    <Card className="min-w-[300px] border-green-500 border-2">
      <CardHeader className="pb-3 bg-green-50 dark:bg-green-950">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageCircle className="h-4 w-4" />
          Answer Node
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        <Textarea
          placeholder="Enter your answer..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="min-h-[100px]"
        />
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Follow-up Options:</p>
          {options.map((option: any) => (
            <div key={option.id} className="flex items-center gap-2">
              <Input value={option.label} readOnly className="text-sm" />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeOption(option.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
              <Handle
                type="source"
                position={Position.Right}
                id={option.id}
                className="!bg-green-500"
              />
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="New option..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              className="text-sm"
            />
            <Button size="icon" onClick={addOption} className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} className="!bg-green-500" />
    </Card>
  );
};

export default memo(AnswerNode);
