import { Student, Subject, AttendanceRecord, Remark } from '../types';
import { updateSubjectGrade } from '../utils/gradeCalculations';

const STORAGE_KEY = 'student_grade_tracker_data';

export const loadStudents = (): Student[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const students = data ? JSON.parse(data) : [];
    return students.map((s: Student) => ({
      ...s,
      attendance: s.attendance || [],
      remarks: s.remarks || [],
    }));
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};

export const saveStudents = (students: Student[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students:', error);
  }
};

export const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'subjects' | 'attendance' | 'remarks'>): Student => {
  const students = loadStudents();
  const newStudent: Student = {
    ...studentData,
    id: crypto.randomUUID(),
    subjects: [],
    attendance: [],
    remarks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
};

export const updateStudent = (id: string, studentData: Partial<Student>): Student | null => {
  const students = loadStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;

  students[index] = {
    ...students[index],
    ...studentData,
    updatedAt: new Date().toISOString(),
  };
  saveStudents(students);
  return students[index];
};

export const deleteStudent = (id: string): boolean => {
  const students = loadStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;
  saveStudents(filtered);
  return true;
};

export const addSubject = (studentId: string, subjectData: Omit<Subject, 'id' | 'grade'>): Subject | null => {
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const newSubject: Subject = {
    ...subjectData,
    id: crypto.randomUUID(),
    grade: '',
  };
  const updatedSubject = updateSubjectGrade(newSubject);
  student.subjects.push(updatedSubject);
  student.updatedAt = new Date().toISOString();
  saveStudents(students);
  return updatedSubject;
};

export const updateSubject = (studentId: string, subjectId: string, subjectData: Partial<Subject>): Subject | null => {
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const subjectIndex = student.subjects.findIndex(sub => sub.id === subjectId);
  if (subjectIndex === -1) return null;

  student.subjects[subjectIndex] = {
    ...student.subjects[subjectIndex],
    ...subjectData,
  };
  student.subjects[subjectIndex] = updateSubjectGrade(student.subjects[subjectIndex]);
  student.updatedAt = new Date().toISOString();
  saveStudents(students);
  return student.subjects[subjectIndex];
};

export const deleteSubject = (studentId: string, subjectId: string): boolean => {
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return false;

  const originalLength = student.subjects.length;
  student.subjects = student.subjects.filter(sub => sub.id !== subjectId);
  if (student.subjects.length === originalLength) return false;

  student.updatedAt = new Date().toISOString();
  saveStudents(students);
  return true;
};

export const getStudentById = (id: string): Student | null => {
  const students = loadStudents();
  return students.find(s => s.id === id) || null;
};

export const addAttendance = (studentId: string, record: Omit<AttendanceRecord, 'date'>): AttendanceRecord | null => {
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const newRecord: AttendanceRecord = {
    ...record,
    date: new Date().toISOString().split('T')[0],
  };
  student.attendance.push(newRecord);
  student.updatedAt = new Date().toISOString();
  saveStudents(students);
  return newRecord;
};

export const addRemark = (studentId: string, remarkData: Omit<Remark, 'id' | 'date'>): Remark | null => {
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const newRemark: Remark = {
    ...remarkData,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  student.remarks.push(newRemark);
  student.updatedAt = new Date().toISOString();
  saveStudents(students);
  return newRemark;
};

export const deleteRemark = (studentId: string, remarkId: string): boolean => {
  const students = loadStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return false;

  const originalLength = student.remarks.length;
  student.remarks = student.remarks.filter(r => r.id !== remarkId);
  if (student.remarks.length === originalLength) return false;

  student.updatedAt = new Date().toISOString();
  saveStudents(students);
  return true;
};
