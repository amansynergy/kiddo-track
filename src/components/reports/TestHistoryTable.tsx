import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TestHistory } from "@/types/reporting";
import { format } from "date-fns";

interface TestHistoryTableProps {
  tests: TestHistory[];
}

export function TestHistoryTable({ tests }: TestHistoryTableProps) {
  const getScoreBadge = (percentage: number) => {
    if (percentage >= 85) return <Badge className="bg-success">Excellent</Badge>;
    if (percentage >= 70) return <Badge className="bg-warning">Good</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.testName}</TableCell>
                <TableCell>{test.subject}</TableCell>
                <TableCell>{format(test.date, "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  {test.score}/{test.maxScore} ({test.percentage}%)
                </TableCell>
                <TableCell>{getScoreBadge(test.percentage)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
