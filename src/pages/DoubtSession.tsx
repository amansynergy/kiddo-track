import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDoubts } from "@/contexts/DoubtContext";
import { MessageSquare, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Geography"];
const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Mathematics: ["Algebra", "Geometry", "Calculus", "Statistics"],
  Science: ["Physics", "Chemistry", "Biology"],
  English: ["Grammar", "Literature", "Writing"],
  History: ["Ancient History", "Modern History", "World Wars"],
  Geography: ["Physical Geography", "Human Geography", "Maps"],
};

const DoubtSession = () => {
  const { doubts, addDoubt, getAllSubjects } = useDoubts();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formSubject, setFormSubject] = useState("");
  const [formTopic, setFormTopic] = useState("");
  const [formSubtopic, setFormSubtopic] = useState("");
  const [formQuestion, setFormQuestion] = useState("");

  const subjects = getAllSubjects().length > 0 ? getAllSubjects() : SUBJECTS;
  const filteredDoubts = selectedSubject
    ? doubts.filter(d => d.subject === selectedSubject)
    : doubts;

  const searchedDoubts = searchQuery
    ? filteredDoubts.filter(d =>
        d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subtopic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredDoubts;

  const currentDoubt = doubts.find(d => d.id === selectedDoubt);

  const handleSubmitDoubt = () => {
    if (!formSubject || !formTopic || !formSubtopic || !formQuestion) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addDoubt({
      userId: "user-1",
      userType: "student",
      subject: formSubject,
      topic: formTopic,
      subtopic: formSubtopic,
      question: formQuestion,
    });

    toast({
      title: "Doubt Submitted",
      description: "Your doubt has been posted successfully",
    });

    // Reset form
    setFormSubject("");
    setFormTopic("");
    setFormSubtopic("");
    setFormQuestion("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Doubt Session</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ask a Doubt
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doubts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {subjects.map((subject) => {
              const subjectDoubts = doubts.filter(d => d.subject === subject);
              if (subjectDoubts.length === 0 && selectedSubject !== subject) return null;

              return (
                <div key={subject} className="mb-2">
                  <Button
                    variant={selectedSubject === subject ? "secondary" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => {
                      setSelectedSubject(selectedSubject === subject ? null : subject);
                      setSelectedDoubt(null);
                    }}
                  >
                    <span>{subject}</span>
                    <Badge variant="outline">{subjectDoubts.length}</Badge>
                  </Button>

                  {selectedSubject === subject && (
                    <div className="ml-4 mt-2 space-y-1">
                      {searchedDoubts.map((doubt) => (
                        <Button
                          key={doubt.id}
                          variant={selectedDoubt === doubt.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setSelectedDoubt(doubt.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {doubt.topic}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {doubt.subtopic}
                            </div>
                          </div>
                          {doubt.answer && (
                            <Badge variant="default" className="ml-2">
                              Answered
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Ask a Doubt</CardTitle>
              <CardDescription>
                Select subject, topic, and subtopic for your question
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={formSubject} onValueChange={setFormSubject}>
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

              {formSubject && (
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select value={formTopic} onValueChange={setFormTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPICS_BY_SUBJECT[formSubject]?.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Subtopic</Label>
                <Input
                  placeholder="Enter subtopic"
                  value={formSubtopic}
                  onChange={(e) => setFormSubtopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Your Question</Label>
                <Textarea
                  placeholder="Describe your doubt in detail..."
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitDoubt}>Submit Doubt</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : currentDoubt ? (
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{currentDoubt.subject}</Badge>
                  <Badge variant="secondary">{currentDoubt.topic}</Badge>
                  <Badge variant="secondary">{currentDoubt.subtopic}</Badge>
                </div>
                <CardTitle className="text-2xl">Question</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg">{currentDoubt.question}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                Asked on {currentDoubt.createdAt.toLocaleDateString()} at{" "}
                {currentDoubt.createdAt.toLocaleTimeString()}
              </div>

              {currentDoubt.answer ? (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Answer</h3>
                  <div className="prose max-w-none bg-muted/50 p-4 rounded-lg">
                    <p>{currentDoubt.answer}</p>
                  </div>
                  {currentDoubt.answeredAt && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Answered on {currentDoubt.answeredAt.toLocaleDateString()} at{" "}
                      {currentDoubt.answeredAt.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t pt-6">
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      This doubt hasn't been answered yet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {doubts.length === 0 ? "No Doubts Yet" : "Select a Doubt"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {doubts.length === 0
                  ? "Click 'Ask a Doubt' to post your first question"
                  : "Choose a subject and doubt from the sidebar to view details"}
              </p>
              {doubts.length === 0 && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ask Your First Doubt
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoubtSession;
