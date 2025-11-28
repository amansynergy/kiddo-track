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

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>([]);
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