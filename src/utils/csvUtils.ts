import { Student } from '../types';
import { addStudent, addSubject, loadStudents, saveStudents } from '../services/storageService';

export const exportToCSV = (students: Student[]): void => {
  const headers = ['Name', 'Roll Number', 'Class', 'Email', 'Parent Contact', 'Total Marks', 'Percentage', 'GPA', 'Grade', 'Attendance Rate'];

  const rows = students.map(student => {
    const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
    const maxMarks = student.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : '0';

    const totalGPA = student.subjects.reduce((sum, s) => {
      const gradeMap: { [key: string]: number } = {
        'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C': 2.7, 'D': 2.0, 'F': 0.0,
      };
      return sum + (gradeMap[s.grade] || 0);
    }, 0);
    const gpa = student.subjects.length > 0 ? (totalGPA / student.subjects.length).toFixed(2) : '0';

    const calculateGrade = (pct: number): string => {
      if (pct >= 90) return 'A+';
      if (pct >= 80) return 'A';
      if (pct >= 70) return 'B+';
      if (pct >= 60) return 'B';
      if (pct >= 50) return 'C';
      if (pct >= 40) return 'D';
      return 'F';
    };
    const overallGrade = maxMarks > 0 ? calculateGrade(parseFloat(percentage)) : 'N/A';

    const presentDays = student.attendance.filter(a => a.status === 'present').length;
    const attendanceRate = student.attendance.length > 0
      ? ((presentDays / student.attendance.length) * 100).toFixed(1)
      : '0';

    return [
      student.name,
      student.rollNumber,
      student.class,
      student.email || '',
      student.parentContact || '',
      `${totalMarks}/${maxMarks}`,
      `${percentage}%`,
      gpa,
      overallGrade,
      `${attendanceRate}%`
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromCSV = (file: File): Promise<{ success: number; errors: string[] }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        resolve({ success: 0, errors: ['CSV file is empty or invalid'] });
        return;
      }

      const errors: string[] = [];
      let successCount = 0;
      const existingStudents = loadStudents();

      lines.slice(1).forEach((line, index) => {
        try {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim());

          if (!values || values.length < 3) {
            errors.push(`Line ${index + 2}: Invalid format`);
            return;
          }

          const [name, rollNumber, className] = values;

          if (existingStudents.some(s => s.rollNumber === rollNumber)) {
            errors.push(`Line ${index + 2}: Roll number ${rollNumber} already exists`);
            return;
          }

          addStudent({
            name,
            rollNumber,
            class: className,
            email: values[3] || undefined,
            parentContact: values[4] || undefined,
          });

          successCount++;
        } catch (error) {
          errors.push(`Line ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      resolve({ success: successCount, errors });
    };

    reader.onerror = () => {
      resolve({ success: 0, errors: ['Failed to read file'] });
    };

    reader.readAsText(file);
  });
};

export const downloadCSVTemplate = (): void => {
  const headers = ['Name', 'Roll Number', 'Class', 'Email', 'Parent Contact'];
  const sampleData = [
    ['John Doe', 'S001', '10th Grade', 'john@example.com', '+1234567890'],
    ['Jane Smith', 'S002', '10th Grade', 'jane@example.com', '+1234567891'],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student_import_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
