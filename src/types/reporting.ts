export interface Child {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TopicPerformance {
  topic: string;
  subTopic?: string;
  mastery: number;
  questionsAttempted: number;
  correctAnswers: number;
  lastAttempted: Date;
}

export interface TestHistory {
  id: string;
  testName: string;
  subject: string;
  date: Date;
  score: number;
  maxScore: number;
  percentage: number;
  duration: number;
}

export interface PerformanceData {
  overall: number;
  subjects: SubjectPerformance[];
  topics: TopicPerformance[];
  testHistory: TestHistory[];
  knowledgeMap: {
    strong: string[];
    moderate: string[];
    weak: string[];
  };
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  overallPerformance: number;
  weakTopics: string[];
}

export interface ClassPerformance {
  className: string;
  subject: string;
  averageScore: number;
  cumulativeAverage: number;
  students: Student[];
  topicAnalysis: {
    topic: string;
    averageScore: number;
    weakStudents: string[];
  }[];
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  topics: string[];
  subtopics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  questions: TestQuestion[];
  createdBy: string;
  createdFor?: string; // student ID for parent-created tests
  classId?: string; // class ID for teacher-created tests
  createdAt: Date;
  dueDate?: Date;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<number, string>; // question index -> selected answer
  score?: number;
  completedAt?: Date;
  startedAt: Date;
}
