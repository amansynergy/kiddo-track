import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTests } from "@/contexts/TestContext";
import { TestAttempt } from "@/types/reporting";
import { CheckCircle2, XCircle, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentTestPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tests, addTestAttempt, getAttemptForTest } = useTests();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(new Date());

  const test = tests.find(t => t.id === testId);
  const studentId = "student-1"; // In real app, get from auth
  const existingAttempt = getAttemptForTest(testId || "", studentId);

  useEffect(() => {
    if (!test) {
      toast({
        title: "Test Not Found",
        description: "The requested test could not be found",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [test, navigate, toast]);

  if (!test) return null;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = test.questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      toast({
        title: "Incomplete Test",
        description: `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`,
      });
    }

    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / test.questions.length) * 100);

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      studentId,
      answers,
      score,
      startedAt: startTime,
      completedAt: new Date(),
    };

    addTestAttempt(attempt);
    setIsSubmitted(true);

    toast({
      title: "Test Submitted",
      description: `You scored ${score}% (${correctCount}/${test.questions.length} correct)`,
    });
  };

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  if (existingAttempt && existingAttempt.completedAt) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Test Already Completed</CardTitle>
              <CardDescription>You have already taken this test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-4">
                  {existingAttempt.score}%
                </div>
                <p className="text-muted-foreground">Your Score</p>
              </div>
              <Button onClick={() => navigate("/student")} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    const correctCount = Object.entries(answers).filter(
      ([idx, ans]) => test.questions[parseInt(idx)].correctAnswer === ans
    ).length;
    const score = Math.round((correctCount / test.questions.length) * 100);

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>{test.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {score}%
                </div>
                <p className="text-xl text-muted-foreground">
                  {correctCount} out of {test.questions.length} correct
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Review Answers</h3>
                {test.questions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <Card key={idx} className={isCorrect ? "border-success" : "border-destructive"}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            Question {idx + 1}
                          </CardTitle>
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <CardDescription>{q.question}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          {q.options.map((option, optIdx) => {
                            const optionLetter = String.fromCharCode(65 + optIdx);
                            const isUserAnswer = userAnswer === optionLetter;
                            const isCorrectAnswer = q.correctAnswer === optionLetter;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded ${
                                  isCorrectAnswer
                                    ? "bg-success/10 text-success"
                                    : isUserAnswer
                                    ? "bg-destructive/10 text-destructive"
                                    : ""
                                }`}
                              >
                                <span className="font-medium">{optionLetter}.</span> {option}
                                {isCorrectAnswer && " ✓"}
                                {isUserAnswer && !isCorrectAnswer && " ✗"}
                              </div>
                            );
                          })}
                        </div>
                        {!isCorrect && (
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Explanation:</p>
                            <p className="text-sm text-muted-foreground">{q.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Button onClick={() => navigate("/student")} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{test.title}</h1>
            <p className="text-muted-foreground">{test.subject}</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Clock className="mr-1 h-3 w-3" />
            Question {currentQuestion + 1} of {test.questions.length}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base">{question.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
              {question.options.map((option, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                return (
                  <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={optionLetter} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      <span className="font-medium">{optionLetter}.</span> {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQuestion === test.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="ml-auto">
              Submit Test
            </Button>
          ) : (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {test.questions.map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentQuestion === idx ? "default" : answers[idx] ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion(idx)}
                  className="h-10"
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentTestPage;