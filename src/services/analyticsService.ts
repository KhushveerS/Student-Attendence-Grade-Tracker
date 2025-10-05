import { Student, ClassAnalytics } from '../types';
import { calculateStudentStats } from '../utils/gradeCalculations';

export const calculateClassAnalytics = (students: Student[]): ClassAnalytics => {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      classAverage: 0,
      highestScorer: null,
      lowestScorer: null,
      subjectAverages: [],
      gradeDistribution: [],
    };
  }

  const studentStats = students.map(student => ({
    student,
    stats: calculateStudentStats(student),
  }));

  const totalPercentage = studentStats.reduce((sum, { stats }) => sum + stats.percentage, 0);
  const classAverage = totalPercentage / students.length;

  const sortedByPercentage = [...studentStats].sort((a, b) => b.stats.percentage - a.stats.percentage);
  const highestScorer = sortedByPercentage[0]
    ? { name: sortedByPercentage[0].student.name, percentage: sortedByPercentage[0].stats.percentage }
    : null;
  const lowestScorer = sortedByPercentage[sortedByPercentage.length - 1]
    ? { name: sortedByPercentage[sortedByPercentage.length - 1].student.name, percentage: sortedByPercentage[sortedByPercentage.length - 1].stats.percentage }
    : null;

  const subjectMap = new Map<string, { total: number; count: number }>();
  students.forEach(student => {
    student.subjects.forEach(subject => {
      const existing = subjectMap.get(subject.subjectName) || { total: 0, count: 0 };
      const percentage = (subject.marks / subject.maxMarks) * 100;
      subjectMap.set(subject.subjectName, {
        total: existing.total + percentage,
        count: existing.count + 1,
      });
    });
  });

  const subjectAverages = Array.from(subjectMap.entries()).map(([subject, { total, count }]) => ({
    subject,
    average: total / count,
  }));

  const gradeMap = new Map<string, number>();
  studentStats.forEach(({ stats }) => {
    gradeMap.set(stats.overallGrade, (gradeMap.get(stats.overallGrade) || 0) + 1);
  });

  const gradeDistribution = Array.from(gradeMap.entries()).map(([grade, count]) => ({
    grade,
    count,
  })).sort((a, b) => {
    const order = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', 'N/A'];
    return order.indexOf(a.grade) - order.indexOf(b.grade);
  });

  return {
    totalStudents: students.length,
    classAverage,
    highestScorer,
    lowestScorer,
    subjectAverages,
    gradeDistribution,
  };
};
