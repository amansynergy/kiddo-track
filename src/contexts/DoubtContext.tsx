import React, { createContext, useContext, useState } from 'react';

export interface Doubt {
  id: string;
  userId: string;
  userType: 'student' | 'teacher';
  subject: string;
  topic: string;
  subtopic: string;
  question: string;
  answer?: string;
  createdAt: Date;
  answeredAt?: Date;
}

interface DoubtContextType {
  doubts: Doubt[];
  addDoubt: (doubt: Omit<Doubt, 'id' | 'createdAt'>) => void;
  answerDoubt: (doubtId: string, answer: string) => void;
  getDoubtsBySubject: (subject: string) => Doubt[];
  getAllSubjects: () => string[];
}

const DoubtContext = createContext<DoubtContextType | undefined>(undefined);

export const DoubtProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);

  const addDoubt = (doubt: Omit<Doubt, 'id' | 'createdAt'>) => {
    const newDoubt: Doubt = {
      ...doubt,
      id: `doubt-${Date.now()}`,
      createdAt: new Date(),
    };
    setDoubts(prev => [...prev, newDoubt]);
  };

  const answerDoubt = (doubtId: string, answer: string) => {
    setDoubts(prev =>
      prev.map(doubt =>
        doubt.id === doubtId
          ? { ...doubt, answer, answeredAt: new Date() }
          : doubt
      )
    );
  };

  const getDoubtsBySubject = (subject: string) => {
    return doubts.filter(doubt => doubt.subject === subject);
  };

  const getAllSubjects = () => {
    const subjects = new Set(doubts.map(doubt => doubt.subject));
    return Array.from(subjects);
  };

  return (
    <DoubtContext.Provider
      value={{
        doubts,
        addDoubt,
        answerDoubt,
        getDoubtsBySubject,
        getAllSubjects,
      }}
    >
      {children}
    </DoubtContext.Provider>
  );
};

export const useDoubts = () => {
  const context = useContext(DoubtContext);
  if (!context) {
    throw new Error('useDoubts must be used within a DoubtProvider');
  }
  return context;
};
