import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types/reporting";

interface StudentWeaknessTableProps {
  students: Student[];
}

export function StudentWeaknessTable({ students }: StudentWeaknessTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Weakness Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Overall Performance</TableHead>
              <TableHead>Weak Topics</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{student.overallPerformance}%</span>
                    {student.overallPerformance >= 85 && (
                      <Badge className="bg-success">Excellent</Badge>
                    )}
                    {student.overallPerformance >= 70 && student.overallPerformance < 85 && (
                      <Badge className="bg-warning">Good</Badge>
                    )}
                    {student.overallPerformance < 70 && (
                      <Badge variant="destructive">Needs Focus</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {student.weakTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {student.weakTopics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No weak areas</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
