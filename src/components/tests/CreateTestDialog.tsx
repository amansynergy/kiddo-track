import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Test, TestQuestion } from "@/types/reporting";
import { useTests } from "@/contexts/TestContext";
import { Badge } from "@/components/ui/badge";

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: 'parent' | 'teacher';
  childId?: string;
  classId?: string;
}

const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology'];
const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Mathematics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
  Science: ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
  English: ['Grammar', 'Literature', 'Writing', 'Reading Comprehension'],
  History: ['Ancient History', 'Modern History', 'World Wars', 'Cultural History'],
  Physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics'],
  Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
  Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Anatomy'],
};

const SUBTOPICS_BY_TOPIC: Record<string, string[]> = {
  Algebra: ['Linear Equations', 'Quadratic Equations', 'Polynomials', 'Functions'],
  Geometry: ['Triangles', 'Circles', 'Polygons', 'Solid Geometry'],
  Calculus: ['Limits', 'Derivatives', 'Integrals', 'Differential Equations'],
  Mechanics: ['Newton\'s Laws', 'Energy', 'Momentum', 'Rotational Motion'],
  'Organic Chemistry': ['Hydrocarbons', 'Functional Groups', 'Reactions', 'Polymers'],
};

export const CreateTestDialog = ({ open, onOpenChange, userType, childId, classId }: CreateTestDialogProps) => {
  const [testTitle, setTestTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { addTest } = useTests();

  const availableTopics = subject ? TOPICS_BY_SUBJECT[subject] || [] : [];
  const availableSubtopics = selectedTopics.length > 0 
    ? selectedTopics.flatMap(topic => SUBTOPICS_BY_TOPIC[topic] || [])
    : [];

  const handleAddTopic = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
  };

  const handleAddSubtopic = (subtopic: string) => {
    if (!selectedSubtopics.includes(subtopic)) {
      setSelectedSubtopics([...selectedSubtopics, subtopic]);
    }
  };

  const handleRemoveSubtopic = (subtopic: string) => {
    setSelectedSubtopics(selectedSubtopics.filter(s => s !== subtopic));
  };

  const handleGenerateTest = async () => {
    if (!testTitle || !subject || selectedTopics.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-test-questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject,
            topics: selectedTopics,
            subtopics: selectedSubtopics,
            difficulty,
            questionCount: parseInt(questionCount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const { questions } = await response.json();

      const newTest: Test = {
        id: `test-${Date.now()}`,
        title: testTitle,
        subject,
        topics: selectedTopics,
        subtopics: selectedSubtopics,
        difficulty,
        questions: questions as TestQuestion[],
        createdBy: userType,
        createdFor: childId,
        classId,
        createdAt: new Date(),
      };

      addTest(newTest);

      toast({
        title: "Test Created Successfully",
        description: `${questions.length} questions have been generated`,
      });

      // Reset form
      setTestTitle("");
      setSubject("");
      setSelectedTopics([]);
      setSelectedSubtopics([]);
      setDifficulty('medium');
      setQuestionCount("10");
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating test:', error);
      toast({
        title: "Error",
        description: "Failed to generate test questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Test</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="testTitle">Test Title *</Label>
            <Input
              id="testTitle"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="e.g., Chapter 5 Review"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {subject && (
            <div className="space-y-2">
              <Label>Topics *</Label>
              <Select onValueChange={handleAddTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Add topics" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTopics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedTopics.length > 0 && availableSubtopics.length > 0 && (
            <div className="space-y-2">
              <Label>Subtopics (Optional)</Label>
              <Select onValueChange={handleAddSubtopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Add subtopics" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubtopics.map((subtopic) => (
                    <SelectItem key={subtopic} value={subtopic}>
                      {subtopic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSubtopics.map((subtopic) => (
                  <Badge key={subtopic} variant="outline">
                    {subtopic}
                    <button
                      onClick={() => handleRemoveSubtopic(subtopic)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Input
                id="questionCount"
                type="number"
                min="5"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerateTest} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Test
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};