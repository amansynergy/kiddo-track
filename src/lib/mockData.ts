import { Child, PerformanceData, ClassPerformance } from "@/types/reporting";

export const mockChildren: Child[] = [
  { id: "1", name: "Emma Johnson", grade: "Grade 8" },
  { id: "2", name: "Liam Johnson", grade: "Grade 5" },
];

export const mockPerformanceData: Record<string, PerformanceData> = {
  "1": {
    overall: 85,
    subjects: [
      { subject: "Mathematics", score: 450, maxScore: 500, percentage: 90, trend: "up" },
      { subject: "Science", score: 420, maxScore: 500, percentage: 84, trend: "up" },
      { subject: "English", score: 400, maxScore: 500, percentage: 80, trend: "stable" },
      { subject: "History", score: 430, maxScore: 500, percentage: 86, trend: "up" },
      { subject: "Geography", score: 390, maxScore: 500, percentage: 78, trend: "down" },
    ],
    topics: [
      { topic: "Algebra", subTopic: "Linear Equations", mastery: 92, questionsAttempted: 50, correctAnswers: 46, lastAttempted: new Date("2025-11-25") },
      { topic: "Algebra", subTopic: "Quadratic Equations", mastery: 85, questionsAttempted: 40, correctAnswers: 34, lastAttempted: new Date("2025-11-20") },
      { topic: "Geometry", subTopic: "Triangles", mastery: 88, questionsAttempted: 45, correctAnswers: 40, lastAttempted: new Date("2025-11-22") },
      { topic: "Physics", subTopic: "Newton's Laws", mastery: 90, questionsAttempted: 30, correctAnswers: 27, lastAttempted: new Date("2025-11-24") },
      { topic: "Chemistry", subTopic: "Chemical Reactions", mastery: 75, questionsAttempted: 35, correctAnswers: 26, lastAttempted: new Date("2025-11-18") },
      { topic: "Grammar", subTopic: "Tenses", mastery: 82, questionsAttempted: 40, correctAnswers: 33, lastAttempted: new Date("2025-11-21") },
    ],
    testHistory: [
      { id: "t1", testName: "Mid-term Math", subject: "Mathematics", date: new Date("2025-11-15"), score: 92, maxScore: 100, percentage: 92, duration: 120 },
      { id: "t2", testName: "Science Quiz", subject: "Science", date: new Date("2025-11-10"), score: 85, maxScore: 100, percentage: 85, duration: 60 },
      { id: "t3", testName: "English Essay", subject: "English", date: new Date("2025-11-05"), score: 78, maxScore: 100, percentage: 78, duration: 90 },
      { id: "t4", testName: "History Project", subject: "History", date: new Date("2025-10-30"), score: 88, maxScore: 100, percentage: 88, duration: 180 },
      { id: "t5", testName: "Geography Test", subject: "Geography", date: new Date("2025-10-25"), score: 75, maxScore: 100, percentage: 75, duration: 90 },
    ],
    knowledgeMap: {
      strong: ["Linear Equations", "Triangles", "Newton's Laws", "World History"],
      moderate: ["Quadratic Equations", "Tenses", "Chemical Reactions"],
      weak: ["Geography Maps", "Complex Fractions"],
    },
  },
  "2": {
    overall: 78,
    subjects: [
      { subject: "Mathematics", score: 380, maxScore: 500, percentage: 76, trend: "stable" },
      { subject: "Science", score: 400, maxScore: 500, percentage: 80, trend: "up" },
      { subject: "English", score: 390, maxScore: 500, percentage: 78, trend: "up" },
      { subject: "Social Studies", score: 370, maxScore: 500, percentage: 74, trend: "stable" },
    ],
    topics: [
      { topic: "Multiplication", subTopic: "Tables", mastery: 85, questionsAttempted: 60, correctAnswers: 51, lastAttempted: new Date("2025-11-26") },
      { topic: "Division", subTopic: "Long Division", mastery: 72, questionsAttempted: 50, correctAnswers: 36, lastAttempted: new Date("2025-11-23") },
      { topic: "Life Science", subTopic: "Plants", mastery: 88, questionsAttempted: 40, correctAnswers: 35, lastAttempted: new Date("2025-11-24") },
      { topic: "Reading", subTopic: "Comprehension", mastery: 80, questionsAttempted: 45, correctAnswers: 36, lastAttempted: new Date("2025-11-22") },
    ],
    testHistory: [
      { id: "t1", testName: "Math Quiz", subject: "Mathematics", date: new Date("2025-11-20"), score: 78, maxScore: 100, percentage: 78, duration: 45 },
      { id: "t2", testName: "Science Test", subject: "Science", date: new Date("2025-11-15"), score: 82, maxScore: 100, percentage: 82, duration: 60 },
      { id: "t3", testName: "Reading Assessment", subject: "English", date: new Date("2025-11-10"), score: 80, maxScore: 100, percentage: 80, duration: 50 },
    ],
    knowledgeMap: {
      strong: ["Multiplication Tables", "Plants", "Reading Comprehension"],
      moderate: ["Long Division", "Spelling"],
      weak: ["Fractions", "Geography"],
    },
  },
};

export const mockClassPerformance: ClassPerformance[] = [
  {
    className: "Grade 8A",
    subject: "Mathematics",
    averageScore: 78.5,
    cumulativeAverage: 81.2,
    students: [
      { id: "s1", name: "Emma Johnson", grade: "Grade 8", overallPerformance: 90, weakTopics: ["Quadratic Equations"] },
      { id: "s2", name: "Noah Smith", grade: "Grade 8", overallPerformance: 85, weakTopics: ["Geometry", "Trigonometry"] },
      { id: "s3", name: "Olivia Brown", grade: "Grade 8", overallPerformance: 72, weakTopics: ["Algebra", "Statistics"] },
      { id: "s4", name: "Liam Davis", grade: "Grade 8", overallPerformance: 68, weakTopics: ["Linear Equations", "Geometry"] },
      { id: "s5", name: "Ava Wilson", grade: "Grade 8", overallPerformance: 88, weakTopics: ["Probability"] },
    ],
    topicAnalysis: [
      { topic: "Algebra", averageScore: 82, weakStudents: ["Olivia Brown", "Liam Davis"] },
      { topic: "Geometry", averageScore: 75, weakStudents: ["Noah Smith", "Liam Davis", "Olivia Brown"] },
      { topic: "Statistics", averageScore: 78, weakStudents: ["Olivia Brown"] },
      { topic: "Trigonometry", averageScore: 73, weakStudents: ["Noah Smith", "Liam Davis"] },
    ],
  },
  {
    className: "Grade 8A",
    subject: "Science",
    averageScore: 82.3,
    cumulativeAverage: 81.2,
    students: [
      { id: "s1", name: "Emma Johnson", grade: "Grade 8", overallPerformance: 84, weakTopics: ["Chemical Reactions"] },
      { id: "s2", name: "Noah Smith", grade: "Grade 8", overallPerformance: 88, weakTopics: [] },
      { id: "s3", name: "Olivia Brown", grade: "Grade 8", overallPerformance: 76, weakTopics: ["Physics", "Chemistry"] },
      { id: "s4", name: "Liam Davis", grade: "Grade 8", overallPerformance: 78, weakTopics: ["Biology"] },
      { id: "s5", name: "Ava Wilson", grade: "Grade 8", overallPerformance: 86, weakTopics: ["Chemistry"] },
    ],
    topicAnalysis: [
      { topic: "Physics", averageScore: 80, weakStudents: ["Olivia Brown"] },
      { topic: "Chemistry", averageScore: 78, weakStudents: ["Emma Johnson", "Olivia Brown", "Ava Wilson"] },
      { topic: "Biology", averageScore: 85, weakStudents: ["Liam Davis"] },
    ],
  },
];
