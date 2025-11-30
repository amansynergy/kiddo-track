import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlowBuilderCanvas } from "@/components/flowbuilder/FlowBuilderCanvas";
import { useFlows } from "@/contexts/FlowContext";
import { FlowNode, DoubtFlow } from "@/types/flow";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Geography"];

const FlowBuilder = () => {
  const navigate = useNavigate();
  const { addFlow, updateFlow, flows } = useFlows();
  const { toast } = useToast();
  
  const [flowName, setFlowName] = useState("");
  const [subject, setSubject] = useState("");
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [editingFlowId, setEditingFlowId] = useState<string>("");

  const handleSaveFlow = () => {
    if (!flowName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a flow name",
        variant: "destructive",
      });
      return;
    }

    if (!subject) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one node to the flow",
        variant: "destructive",
      });
      return;
    }

    const flow: DoubtFlow = {
      id: editingFlowId || `flow-${Date.now()}`,
      name: flowName,
      subject: subject,
      startNodeId: nodes[0]?.id || '',
      nodes: nodes,
    };

    if (editingFlowId) {
      updateFlow(editingFlowId, flow);
      toast({
        title: "Success",
        description: "Flow updated successfully",
      });
    } else {
      addFlow(flow);
      toast({
        title: "Success",
        description: "Flow created successfully",
      });
    }

    // Reset form
    setFlowName("");
    setSubject("");
    setNodes([]);
    setEditingFlowId("");
  };

  const loadExistingFlow = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    if (flow) {
      setEditingFlowId(flow.id);
      setFlowName(flow.name);
      setSubject(flow.subject);
      setNodes(flow.nodes);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/teacher")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Flow Builder</h1>
              <p className="text-sm text-muted-foreground">Create custom conversation flows</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select onValueChange={loadExistingFlow}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Load existing flow" />
              </SelectTrigger>
              <SelectContent>
                {flows.map((flow) => (
                  <SelectItem key={flow.id} value={flow.id}>
                    {flow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSaveFlow} className="gap-2">
              <Save className="h-4 w-4" />
              Save Flow
            </Button>
          </div>
        </div>
      </header>

      {/* Configuration Panel */}
      <div className="border-b bg-card p-4 z-10">
        <div className="container mx-auto flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Flow Name
            </label>
            <Input
              placeholder="e.g., Algebra Help"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Subject
            </label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        {flowName && subject ? (
          <FlowBuilderCanvas
            initialNodes={nodes}
            onNodesChange={setNodes}
          />
        ) : (
          <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Please enter a flow name and select a subject to start building your flow.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlowBuilder;
