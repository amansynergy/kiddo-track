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
