import React, { createContext, useContext, useState } from 'react';
import { Test, TestAttempt } from '@/types/reporting';

interface TestContextType {
  tests: Test[];
  testAttempts: TestAttempt[];
  addTest: (test: Test) => void;
  addTestAttempt: (attempt: TestAttempt) => void;
  getTestsForStudent: (studentId: string) => Test[];
  getTestsForClass: (classId: string) => Test[];
  getAttemptForTest: (testId: string, studentId: string) => TestAttempt | undefined;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

// Dummy test data
const dummyTests: Test[] = [
  {
    id: "test-1",
    title: "Mathematics Mid-Term Exam",
    subject: "Mathematics",
    topics: ["Algebra", "Geometry"],
    subtopics: ["Linear Equations", "Triangles"],
    difficulty: "medium",
    questions: [
      {
        question: "Solve for x: 2x + 5 = 15",
        options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
        correctAnswer: "A",
        explanation: "Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5"
      },
      {
        question: "What is the sum of angles in a triangle?",
        options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"],
        correctAnswer: "B",
        explanation: "The sum of all interior angles in any triangle is always 180 degrees"
      },
      {
        question: "Simplify: 3(x + 4)",
        options: ["3x + 4", "3x + 12", "x + 12", "3x + 7"],
        correctAnswer: "B",
        explanation: "Distribute 3 to both terms: 3 × x + 3 × 4 = 3x + 12"
      },
      {
        question: "What is the perimeter of a square with side length 5 cm?",
        options: ["10 cm", "15 cm", "20 cm", "25 cm"],
        correctAnswer: "C",
        explanation: "Perimeter = 4 × side = 4 × 5 = 20 cm"
      },
      {
        question: "If y = 2x + 3, what is y when x = 4?",
        options: ["8", "11", "9", "10"],
        correctAnswer: "B",
        explanation: "Substitute x = 4: y = 2(4) + 3 = 8 + 3 = 11"
      }
    ],
    createdBy: "teacher-1",
    classId: "Grade 8A",
    createdAt: new Date("2025-11-20"),
    dueDate: new Date("2025-12-05")
  },
  {
    id: "test-2",
    title: "Science Quiz - Physics Basics",
    subject: "Science",
    topics: ["Physics"],
    subtopics: ["Newton's Laws", "Energy"],
    difficulty: "easy",
    questions: [
      {
        question: "What is Newton's First Law of Motion?",
        options: [
          "Force equals mass times acceleration",
          "An object at rest stays at rest unless acted upon by a force",
          "For every action there is an equal and opposite reaction",
          "Energy cannot be created or destroyed"
        ],
        correctAnswer: "B",
        explanation: "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force"
      },
      {
        question: "What type of energy does a moving car have?",
        options: ["Potential energy", "Kinetic energy", "Chemical energy", "Thermal energy"],
        correctAnswer: "B",
        explanation: "Kinetic energy is the energy of motion. A moving car has kinetic energy."
      },
      {
        question: "What is the unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        correctAnswer: "C",
        explanation: "The SI unit of force is the Newton (N), named after Isaac Newton"
      }
    ],
    createdBy: "teacher-1",
    classId: "Grade 8A",
    createdAt: new Date("2025-11-22"),
    dueDate: new Date("2025-12-01")
  },
  {
    id: "test-3",
    title: "Advanced Algebra Challenge",
    subject: "Mathematics",
    topics: ["Algebra"],
    subtopics: ["Quadratic Equations", "Polynomials"],
    difficulty: "hard",
    questions: [
      {
        question: "Solve: x² - 5x + 6 = 0",
        options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = 2 or x = -3"],
        correctAnswer: "A",
        explanation: "Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3"
      },
      {
        question: "What is the degree of the polynomial: 3x⁴ + 2x² - x + 5?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "C",
        explanation: "The degree is the highest power of x, which is 4"
      },
      {
        question: "Expand: (x + 3)²",
        options: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9", "x² + 6x + 6"],
        correctAnswer: "B",
        explanation: "(x + 3)² = (x + 3)(x + 3) = x² + 3x + 3x + 9 = x² + 6x + 9"
      },
      {
        question: "If f(x) = 2x + 1, what is f(f(2))?",
        options: ["9", "11", "7", "5"],
        correctAnswer: "B",
        explanation: "f(2) = 2(2) + 1 = 5, then f(5) = 2(5) + 1 = 11"
      }
    ],
    createdBy: "teacher-2",
    classId: "Grade 8A",
    createdAt: new Date("2025-11-25")
  }
];

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>(dummyTests);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  const addTest = (test: Test) => {
    setTests(prev => [...prev, test]);
  };

  const addTestAttempt = (attempt: TestAttempt) => {
    setTestAttempts(prev => [...prev, attempt]);
  };

  const getTestsForStudent = (studentId: string) => {
    return tests.filter(test => test.createdFor === studentId || test.classId);
  };

  const getTestsForClass = (classId: string) => {
    return tests.filter(test => test.classId === classId);
  };

  const getAttemptForTest = (testId: string, studentId: string) => {
    return testAttempts.find(
      attempt => attempt.testId === testId && attempt.studentId === studentId
    );
  };

  return (
    <TestContext.Provider
      value={{
        tests,
        testAttempts,
        addTest,
        addTestAttempt,
        getTestsForStudent,
        getTestsForClass,
        getAttemptForTest,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTests = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
};