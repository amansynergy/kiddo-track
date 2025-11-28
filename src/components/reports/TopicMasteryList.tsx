import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TopicPerformance } from "@/types/reporting";
import { Badge } from "@/components/ui/badge";

interface TopicMasteryListProps {
  topics: TopicPerformance[];
}

export function TopicMasteryList({ topics }: TopicMasteryListProps) {
  const getMasteryColor = (mastery: number) => {
    if (mastery >= 85) return "bg-success";
    if (mastery >= 70) return "bg-warning";
    return "bg-destructive";
  };

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 85) return "Strong";
    if (mastery >= 70) return "Moderate";
    return "Needs Improvement";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic-wise Mastery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {topic.topic}
                  {topic.subTopic && (
                    <span className="text-muted-foreground"> • {topic.subTopic}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topic.correctAnswers}/{topic.questionsAttempted} correct
                </p>
              </div>
              <Badge variant="outline" className={getMasteryColor(topic.mastery)}>
                {getMasteryLabel(topic.mastery)}
              </Badge>
            </div>
            <Progress value={topic.mastery} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
