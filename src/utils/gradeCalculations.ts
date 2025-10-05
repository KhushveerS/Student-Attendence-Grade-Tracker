import { Student, StudentStats, Subject } from '../types';

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

export const gradeToGPA = (grade: string): number => {
  const gradeMap: { [key: string]: number } = {
    'A+': 4.0,
    'A': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'C': 2.7,
    'D': 2.0,
    'F': 0.0,
  };
  return gradeMap[grade] || 0.0;
};

export const calculateStudentStats = (student: Student): StudentStats => {
  if (student.subjects.length === 0) {
    return {
      totalMarks: 0,
      maxPossibleMarks: 0,
      percentage: 0,
      averageMarks: 0,
      gpa: 0,
      overallGrade: 'N/A',
    };
  }

  const totalMarks = student.subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const maxPossibleMarks = student.subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
  const percentage = (totalMarks / maxPossibleMarks) * 100;
  const averageMarks = totalMarks / student.subjects.length;
  const overallGrade = calculateGrade(percentage);

  const totalGPA = student.subjects.reduce((sum, subject) => sum + gradeToGPA(subject.grade), 0);
  const gpa = totalGPA / student.subjects.length;

  return {
    totalMarks,
    maxPossibleMarks,
    percentage,
    averageMarks,
    gpa,
    overallGrade,
  };
};

export const updateSubjectGrade = (subject: Subject): Subject => {
  const percentage = (subject.marks / subject.maxMarks) * 100;
  return {
    ...subject,
    grade: calculateGrade(percentage),
  };
};
