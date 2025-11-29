import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFlows } from "@/contexts/FlowContext";
import { ChatMessage, FlowNode } from "@/types/flow";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Geography"];

const ChatDoubtSession = () => {
  const navigate = useNavigate();
  const { flows, getFlowsBySubject } = useFlows();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedFlow, setSelectedFlow] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentNode, setCurrentNode] = useState<FlowNode | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const subjectFlows = selectedSubject ? getFlowsBySubject(selectedSubject) : [];
  const currentFlow = flows.find(f => f.id === selectedFlow);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startFlow = () => {
    if (!currentFlow) return;

    const startNode = currentFlow.nodes.find(n => n.id === currentFlow.startNodeId);
    if (!startNode) return;

    setMessages([]);
    setConversationHistory([]);
    setCurrentNode(startNode);
    addMessage('assistant', startNode.content, startNode.options);
  };

  const addMessage = (role: 'user' | 'assistant', content: string, options?: any[]) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
      options,
    };
    setMessages(prev => [...prev, message]);
  };

  const handleOptionClick = (optionId: string) => {
    if (!currentNode || !currentFlow) return;

    const option = currentNode.options?.find(o => o.id === optionId);
    if (!option) return;

    addMessage('user', option.label);

    const nextNode = currentFlow.nodes.find(n => n.id === option.nextNodeId);
    if (!nextNode) return;

    setCurrentNode(nextNode);

    if (nextNode.type === 'ai') {
      // AI node - wait for user to type their question
      addMessage('assistant', nextNode.content);
    } else {
      addMessage('assistant', nextNode.content, nextNode.options);
    }
  };

  const handleAIQuestion = async () => {
    if (!userInput.trim() || !currentNode || !selectedSubject) return;

    const question = userInput.trim();
    setUserInput("");
    addMessage('user', question);
    setIsLoading(true);

    // Add to conversation history
    const newHistory = [
      ...conversationHistory,
      { role: "user", content: question }
    ];
    setConversationHistory(newHistory);

    try {
      const { data, error } = await supabase.functions.invoke('answer-doubt', {
        body: {
          question,
          subject: selectedSubject,
          topic: currentFlow?.name || "General",
          subtopic: "AI Help",
          conversationHistory: newHistory,
        }
      });

      if (error) {
        console.error("Error calling answer-doubt:", error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const answer = data.answer;

      // Update conversation history
      const updatedHistory = [
        ...newHistory,
        { role: "assistant", content: answer }
      ];
      setConversationHistory(updatedHistory);

      // Show AI response with options to continue
      const options = [
        { id: 'followup', label: 'Ask Follow-up Question', nextNodeId: currentNode.id },
        { id: 'back', label: 'Back to Menu', nextNodeId: currentFlow!.startNodeId },
      ];
      
      addMessage('assistant', answer, options);
      setCurrentNode({ ...currentNode, options });

    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
      
      // Re-enable input even on error
      const options = [
        { id: 'retry', label: 'Try Again', nextNodeId: currentNode.id },
        { id: 'back', label: 'Back to Menu', nextNodeId: currentFlow!.startNodeId },
      ];
      addMessage('assistant', 'Sorry, I encountered an error. Would you like to try again?', options);
      setCurrentNode({ ...currentNode, options });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (currentNode?.type === 'ai') {
      handleAIQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/student")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">AI Doubt Assistant</h1>
              <p className="text-sm text-muted-foreground">Chat-based learning</p>
            </div>
          </div>
          {selectedFlow && (
            <Badge variant="secondary" className="text-sm">
              {currentFlow?.name}
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 flex flex-col max-w-4xl">
        {!selectedFlow ? (
          <Card className="max-w-md mx-auto mt-8">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">Choose Your Topic</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSubject && subjectFlows.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Topic Flow</label>
                      <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a flow" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectFlows.map((flow) => (
                            <SelectItem key={flow.id} value={flow.id}>
                              {flow.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedFlow && (
                    <Button onClick={startFlow} className="w-full">
                      Start Conversation
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Chat Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {message.options && message.options.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start bg-background hover:bg-background/80"
                              onClick={() => handleOptionClick(option.id)}
                              disabled={isLoading}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            {currentNode?.type === 'ai' && (
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!userInput.trim() || isLoading}
                    size="icon"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatDoubtSession;
