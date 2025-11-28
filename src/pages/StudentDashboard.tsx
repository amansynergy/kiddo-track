import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTests } from "@/contexts/TestContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, CheckCircle2, TrendingUp } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { tests, testAttempts, getAttemptForTest } = useTests();
  const studentId = "student-1"; // In real app, get from auth

  const availableTests = tests.filter(
    test => !getAttemptForTest(test.id, studentId)?.completedAt
  );

  const completedTests = tests.filter(
    test => getAttemptForTest(test.id, studentId)?.completedAt
  );

  const averageScore = completedTests.length > 0
    ? Math.round(
        completedTests.reduce((sum, test) => {
          const attempt = getAttemptForTest(test.id, studentId);
          return sum + (attempt?.score || 0);
        }, 0) / completedTests.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              View and complete your assigned tests
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Tests</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableTests.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTests.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageScore}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableTests.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Available Tests */}
          {availableTests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableTests.map((test) => (
                  <Card key={test.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{test.title}</CardTitle>
                          <CardDescription>{test.subject}</CardDescription>
                        </div>
                        <Badge variant="outline">{test.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Topics: {test.topics.join(", ")}</p>
                        <p>Questions: {test.questions.length}</p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/test/${test.id}`)}
                      >
                        Start Test
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tests */}
          {completedTests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Tests</h2>
              <div className="space-y-4">
                {completedTests.map((test) => {
                  const attempt = getAttemptForTest(test.id, studentId);
                  return (
                    <Card key={test.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{test.title}</CardTitle>
                            <CardDescription>{test.subject}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {attempt?.score}%
                            </div>
                            <Badge
                              variant={
                                (attempt?.score || 0) >= 80
                                  ? "default"
                                  : (attempt?.score || 0) >= 60
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {(attempt?.score || 0) >= 80
                                ? "Excellent"
                                : (attempt?.score || 0) >= 60
                                ? "Good"
                                : "Needs Improvement"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/test/${test.id}`)}
                        >
                          View Results
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {tests.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tests Available</h3>
                <p className="text-muted-foreground">
                  Your teacher or parent hasn't assigned any tests yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;