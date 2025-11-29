import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceCard } from "@/components/reports/PerformanceCard";
import { ClassPerformanceChart } from "@/components/reports/ClassPerformanceChart";
import { StudentWeaknessTable } from "@/components/reports/StudentWeaknessTable";
import { mockClassPerformance } from "@/lib/mockData";
import { Download, Users, TrendingUp, Target, BookOpen, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CreateTestDialog } from "@/components/tests/CreateTestDialog";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const { toast } = useToast();

  const classData = mockClassPerformance.find(
    (cls) => cls.subject === selectedSubject
  ) || mockClassPerformance[0];

  const handleDownloadPDF = () => {
    toast({
      title: "Generating Report",
      description: "Your PDF report will be downloaded shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Monitor class performance and student progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => navigate("/doubts")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Doubts
              </Button>
              <Button variant="outline" onClick={() => setCreateTestOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Test
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Class Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PerformanceCard
              title="Total Students"
              value={classData.students.length}
              subtitle={classData.className}
              icon={Users}
            />
            <PerformanceCard
              title="Average Score"
              value={`${classData.averageScore.toFixed(1)}%`}
              subtitle={selectedSubject}
              icon={TrendingUp}
              trend="up"
            />
            <PerformanceCard
              title="Cumulative Average"
              value={`${classData.cumulativeAverage.toFixed(1)}%`}
              subtitle="All subjects"
              icon={BookOpen}
            />
            <PerformanceCard
              title="Students Needing Support"
              value={classData.students.filter((s) => s.overallPerformance < 70).length}
              subtitle="Below 70%"
              icon={Target}
            />
          </div>

          {/* Class Performance Chart */}
          <ClassPerformanceChart students={classData.students} />

          {/* Student Weakness Table */}
          <StudentWeaknessTable students={classData.students} />

          {/* Topic Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Topic-wise Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classData.topicAnalysis.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{topic.topic}</p>
                        <p className="text-sm text-muted-foreground">
                          Class Average: {topic.averageScore}%
                        </p>
                      </div>
                      <Badge variant="outline">
                        {topic.weakStudents.length} students need support
                      </Badge>
                    </div>
                    {topic.weakStudents.length > 0 && (
                      <div className="flex flex-wrap gap-2 pl-4">
                        <span className="text-sm text-muted-foreground">Weak students:</span>
                        {topic.weakStudents.map((student, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {student}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <CreateTestDialog
        open={createTestOpen}
        onOpenChange={setCreateTestOpen}
        userType="teacher"
        classId={classData.className}
      />
    </div>
  );
};

export default TeacherDashboard;
