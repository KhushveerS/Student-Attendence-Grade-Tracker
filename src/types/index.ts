export interface Subject {
  id: string;
  subjectName: string;
  marks: number;
  maxMarks: number;
  grade: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface Remark {
  id: string;
  text: string;
  date: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  email?: string;
  subjects: Subject[];
  attendance: AttendanceRecord[];
  remarks: Remark[];
  parentContact?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentStats {
  totalMarks: number;
  maxPossibleMarks: number;
  percentage: number;
  averageMarks: number;
  gpa: number;
  overallGrade: string;
}

export interface ClassAnalytics {
  totalStudents: number;
  classAverage: number;
  highestScorer: { name: string; percentage: number } | null;
  lowestScorer: { name: string; percentage: number } | null;
  subjectAverages: { subject: string; average: number }[];
  gradeDistribution: { grade: string; count: number }[];
}
