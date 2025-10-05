import { Student } from '../types';
import { calculateStudentStats } from './gradeCalculations';

export const exportStudentReport = (student: Student): void => {
  const stats = calculateStudentStats(student);

  let content = `STUDENT PERFORMANCE REPORT\n`;
  content += `${'='.repeat(60)}\n\n`;
  content += `Student Name: ${student.name}\n`;
  content += `Roll Number: ${student.rollNumber}\n`;
  content += `Class: ${student.class}\n`;
  if (student.email) {
    content += `Email: ${student.email}\n`;
  }
  content += `\n`;

  content += `OVERALL PERFORMANCE\n`;
  content += `${'-'.repeat(60)}\n`;
  content += `Total Marks: ${stats.totalMarks}/${stats.maxPossibleMarks}\n`;
  content += `Percentage: ${stats.percentage.toFixed(2)}%\n`;
  content += `GPA: ${stats.gpa.toFixed(2)}\n`;
  content += `Overall Grade: ${stats.overallGrade}\n`;
  content += `\n`;

  if (student.subjects.length > 0) {
    content += `SUBJECT-WISE PERFORMANCE\n`;
    content += `${'-'.repeat(60)}\n`;
    content += `Subject                    Marks    Max    %        Grade\n`;
    content += `${'-'.repeat(60)}\n`;

    student.subjects.forEach((subject) => {
      const percentage = (subject.marks / subject.maxMarks) * 100;
      const subjectName = subject.subjectName.padEnd(25);
      const marks = String(subject.marks).padStart(5);
      const maxMarks = String(subject.maxMarks).padStart(6);
      const percentStr = percentage.toFixed(2).padStart(7);
      const grade = subject.grade.padStart(5);
      content += `${subjectName}${marks}${maxMarks}${percentStr}%${grade}\n`;
    });
  }

  content += `\n${'-'.repeat(60)}\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${student.name.replace(/\s+/g, '_')}_Report.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAllStudentsReport = (students: Student[]): void => {
  let content = `ALL STUDENTS PERFORMANCE REPORT\n`;
  content += `${'='.repeat(80)}\n\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  content += `Total Students: ${students.length}\n\n`;

  students.forEach((student, index) => {
    const stats = calculateStudentStats(student);
    content += `${index + 1}. ${student.name}\n`;
    content += `   Roll No: ${student.rollNumber} | Class: ${student.class}\n`;
    content += `   Subjects: ${student.subjects.length} | Total: ${stats.totalMarks}/${stats.maxPossibleMarks}\n`;
    content += `   Percentage: ${stats.percentage.toFixed(2)}% | GPA: ${stats.gpa.toFixed(2)} | Grade: ${stats.overallGrade}\n`;
    content += `\n`;
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `All_Students_Report_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
