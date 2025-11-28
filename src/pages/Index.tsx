import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Educational Reporting System</h1>
          <p className="text-xl text-muted-foreground">
            Track student performance and analyze learning outcomes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/parent")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Parent Dashboard</CardTitle>
                  <CardDescription>Monitor your child's progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View subject-wise performance</li>
                <li>• Track topic mastery and knowledge maps</li>
                <li>• Access test history and reports</li>
                <li>• Download performance reports as PDF</li>
                <li>• Switch between multiple children</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => navigate("/parent")}>
                Access Parent Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/teacher")}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Teacher Dashboard</CardTitle>
                  <CardDescription>Manage class performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View cumulative class performance</li>
                <li>• Analyze subject-level reports</li>
                <li>• Identify student weaknesses by topic</li>
                <li>• Track class averages and trends</li>
                <li>• Export comprehensive PDF reports</li>
              </ul>
              <Button className="w-full mt-4" onClick={() => navigate("/teacher")}>
                Access Teacher Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
