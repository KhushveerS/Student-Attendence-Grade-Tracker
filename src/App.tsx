import { useState, useEffect } from 'react';
import { Plus, BarChart3, Download, Search, GraduationCap, Upload, Trophy } from 'lucide-react';
import { Student, Subject } from './types';
import {
  loadStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  addSubject,
  updateSubject,
  deleteSubject,
  addAttendance,
  addRemark,
  deleteRemark,
} from './services/storageService';
import { calculateClassAnalytics } from './services/analyticsService';
import { exportStudentReport, exportAllStudentsReport } from './utils/exportUtils';
import { exportToCSV } from './utils/csvUtils';
import StudentCard from './components/StudentCard';
import StudentForm from './components/StudentForm';
import SubjectForm from './components/SubjectForm';
import StudentDetails from './components/StudentDetails';
import Analytics from './components/Analytics';
import BulkImport from './components/BulkImport';
import Leaderboard from './components/Leaderboard';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentView, setCurrentView] = useState<'students' | 'analytics' | 'leaderboard'>('students');

  useEffect(() => {
    setStudents(loadStudents());
  }, []);

  const handleAddStudent = (data: { name: string; rollNumber: string; class: string; email?: string; parentContact?: string }) => {
    const newStudent = addStudent(data);
    setStudents(loadStudents());
    setShowStudentForm(false);
  };

  const handleUpdateStudent = (data: { name: string; rollNumber: string; class: string; email?: string; parentContact?: string }) => {
    if (selectedStudent) {
      updateStudent(selectedStudent.id, data);
      setStudents(loadStudents());
      setShowStudentForm(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student? All subject data will be lost.')) {
      deleteStudent(id);
      setStudents(loadStudents());
    }
  };

  const handleAddSubject = (data: { subjectName: string; marks: number; maxMarks: number }) => {
    if (selectedStudent) {
      addSubject(selectedStudent.id, data);
      setStudents(loadStudents());
      setShowSubjectForm(false);
      setSelectedStudent(null);
    }
  };

  const handleUpdateSubject = (data: { subjectName: string; marks: number; maxMarks: number }) => {
    if (selectedStudent && selectedSubject) {
      updateSubject(selectedStudent.id, selectedSubject.id, data);
      setStudents(loadStudents());
      setShowSubjectForm(false);
      setSelectedStudent(null);
      setSelectedSubject(null);
    }
  };

  const handleDeleteSubject = (studentId: string, subjectId: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      deleteSubject(studentId, subjectId);
      setStudents(loadStudents());
    }
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    addAttendance(studentId, { status });
    setStudents(loadStudents());
    if (selectedStudent) {
      const updated = loadStudents().find(s => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    }
  };

  const handleAddRemark = (studentId: string, text: string, type: 'positive' | 'negative' | 'neutral') => {
    addRemark(studentId, { text, type });
    setStudents(loadStudents());
    if (selectedStudent) {
      const updated = loadStudents().find(s => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    }
  };

  const handleDeleteRemark = (studentId: string, remarkId: string) => {
    deleteRemark(studentId, remarkId);
    setStudents(loadStudents());
    if (selectedStudent) {
      const updated = loadStudents().find(s => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterGrade === 'all') return matchesSearch;

    const stats = student.subjects.length > 0;
    if (!stats) return false;

    const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
    const maxMarks = student.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage = (totalMarks / maxMarks) * 100;

    let gradeMatch = false;
    if (filterGrade === 'A+' && percentage >= 90) gradeMatch = true;
    if (filterGrade === 'A' && percentage >= 80 && percentage < 90) gradeMatch = true;
    if (filterGrade === 'B' && percentage >= 60 && percentage < 80) gradeMatch = true;
    if (filterGrade === 'C' && percentage >= 40 && percentage < 60) gradeMatch = true;
    if (filterGrade === 'F' && percentage < 40) gradeMatch = true;

    return matchesSearch && gradeMatch;
  });

  const analytics = calculateClassAnalytics(students);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#4ade80]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#4ade80] rounded-lg">
                <GraduationCap className="w-8 h-8 text-black" />
              </div>
              <div>
               <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Student Grade Tracker
                </h1>

                <p className="text-white text-sm">Manage and analyze student performance</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setCurrentView('students')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                  currentView === 'students'
                    ? 'bg-[#4ade80] text-black'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                Students
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                  currentView === 'analytics'
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                  currentView === 'leaderboard'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>
              <button
                onClick={() => setShowBulkImport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all border border-gray-800"
              >
                <Upload className="w-5 h-5" />
                Import
              </button>
              <button
                onClick={() => exportToCSV(students)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all border border-gray-800"
                disabled={students.length === 0}
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setShowStudentForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-black rounded-lg transition-all font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'analytics' ? (
          <Analytics analytics={analytics} />
        ) : currentView === 'leaderboard' ? (
          <Leaderboard
            students={students}
            onSelectStudent={(student) => {
              setSelectedStudent(student);
              setShowDetails(true);
            }}
          />
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, roll number, or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4ade80] focus:border-transparent outline-none transition-all"
                />
              </div>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:ring-2 focus:ring-[#4ade80] focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Grades</option>
                <option value="A+">Grade A+</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B+/B</option>
                <option value="C">Grade C/D</option>
                <option value="F">Grade F</option>
              </select>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
                <GraduationCap className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No students found</p>
                <p className="text-gray-500 text-sm">
                  {students.length === 0
                    ? 'Add your first student to get started'
                    : 'Try adjusting your search or filter'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onEdit={() => {
                      setSelectedStudent(student);
                      setShowStudentForm(true);
                    }}
                    onDelete={() => handleDeleteStudent(student.id)}
                    onAddSubject={() => {
                      setSelectedStudent(student);
                      setSelectedSubject(null);
                      setShowSubjectForm(true);
                    }}
                    onViewDetails={() => {
                      setSelectedStudent(student);
                      setShowDetails(true);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showStudentForm && (
        <StudentForm
          student={selectedStudent || undefined}
          onSubmit={selectedStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={() => {
            setShowStudentForm(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {showSubjectForm && selectedStudent && (
        <SubjectForm
          subject={selectedSubject || undefined}
          onSubmit={selectedSubject ? handleUpdateSubject : handleAddSubject}
          onCancel={() => {
            setShowSubjectForm(false);
            setSelectedStudent(null);
            setSelectedSubject(null);
          }}
        />
      )}

      {showDetails && selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => {
            setShowDetails(false);
            setSelectedStudent(null);
          }}
          onEditSubject={(subjectId) => {
            const subject = selectedStudent.subjects.find((s) => s.id === subjectId);
            if (subject) {
              setSelectedSubject(subject);
              setShowDetails(false);
              setShowSubjectForm(true);
            }
          }}
          onDeleteSubject={(subjectId) => {
            handleDeleteSubject(selectedStudent.id, subjectId);
            setStudents(loadStudents());
            const updatedStudent = students.find((s) => s.id === selectedStudent.id);
            if (updatedStudent) {
              setSelectedStudent(updatedStudent);
            }
          }}
          onExport={() => exportStudentReport(selectedStudent)}
          onMarkAttendance={(status) => handleMarkAttendance(selectedStudent.id, status)}
          onAddRemark={(text, type) => handleAddRemark(selectedStudent.id, text, type)}
          onDeleteRemark={(remarkId) => handleDeleteRemark(selectedStudent.id, remarkId)}
        />
      )}

      {showBulkImport && (
        <BulkImport
          onClose={() => setShowBulkImport(false)}
          onImportComplete={() => {
            setStudents(loadStudents());
          }}
        />
      )}
    </div>
  );
}

export default App;