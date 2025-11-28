import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface KnowledgeMapProps {
  data: {
    strong: string[];
    moderate: string[];
    weak: string[];
  };
}

export function KnowledgeMap({ data }: KnowledgeMapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h4 className="text-sm font-semibold">Strong Areas</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.strong.map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/20">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <h4 className="text-sm font-semibold">Moderate Areas</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.moderate.map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <h4 className="text-sm font-semibold">Needs Focus</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.weak.map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
