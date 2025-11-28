import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceCard } from "@/components/reports/PerformanceCard";
import { SubjectPerformanceChart } from "@/components/reports/SubjectPerformanceChart";
import { TopicMasteryList } from "@/components/reports/TopicMasteryList";
import { KnowledgeMap } from "@/components/reports/KnowledgeMap";
import { TestHistoryTable } from "@/components/reports/TestHistoryTable";
import { PerformanceTrendChart } from "@/components/reports/PerformanceTrendChart";
import { mockChildren, mockPerformanceData } from "@/lib/mockData";
import { Download, TrendingUp, Target, BookOpen, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0].id);
  const { toast } = useToast();

  const currentChild = mockChildren.find((child) => child.id === selectedChild);
  const performanceData = mockPerformanceData[selectedChild];

  const handleDownloadPDF = () => {
    toast({
      title: "Generating Report",
      description: "Your PDF report will be downloaded shortly.",
    });
    // In a real implementation, this would generate and download a PDF
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Track your child's academic progress
              </p>
            </div>
            <div className="flex items-center gap-4">
              {mockChildren.length > 1 && (
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockChildren.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name} ({child.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PerformanceCard
              title="Overall Performance"
              value={`${performanceData.overall}%`}
              subtitle="Above average"
              icon={TrendingUp}
              trend="up"
            />
            <PerformanceCard
              title="Tests Completed"
              value={performanceData.testHistory.length}
              subtitle="This semester"
              icon={BookOpen}
            />
            <PerformanceCard
              title="Strong Topics"
              value={performanceData.knowledgeMap.strong.length}
              subtitle="Mastered areas"
              icon={Award}
            />
            <PerformanceCard
              title="Focus Areas"
              value={performanceData.knowledgeMap.weak.length}
              subtitle="Need improvement"
              icon={Target}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <SubjectPerformanceChart data={performanceData.subjects} />
            <PerformanceTrendChart tests={performanceData.testHistory} />
          </div>

          {/* Topic Mastery and Knowledge Map */}
          <div className="grid gap-6 lg:grid-cols-2">
            <TopicMasteryList topics={performanceData.topics} />
            <KnowledgeMap data={performanceData.knowledgeMap} />
          </div>

          {/* Test History */}
          <TestHistoryTable tests={performanceData.testHistory} />
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
