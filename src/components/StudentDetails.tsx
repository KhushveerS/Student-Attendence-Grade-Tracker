import { useState } from 'react';
import { X, CreditCard as Edit2, Trash2, Download } from 'lucide-react';
import { Student } from '../types';
import { calculateStudentStats } from '../utils/gradeCalculations';
import AttendanceTracker from './AttendanceTracker';
import RemarksSection from './RemarksSection';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
  onEditSubject: (subjectId: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  onExport: () => void;
  onMarkAttendance: (status: 'present' | 'absent' | 'late' | 'excused') => void;
  onAddRemark: (text: string, type: 'positive' | 'negative' | 'neutral') => void;
  onDeleteRemark: (remarkId: string) => void;
}

export default function StudentDetails({
  student,
  onClose,
  onEditSubject,
  onDeleteSubject,
  onExport,
  onMarkAttendance,
  onAddRemark,
  onDeleteRemark,
}: StudentDetailsProps) {
  const [activeTab, setActiveTab] = useState<'subjects' | 'attendance' | 'remarks'>('subjects');
  const stats = calculateStudentStats(student);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-5xl w-full border border-gray-800 my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{student.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm">
              <p className="text-gray-400">Roll No: {student.rollNumber}</p>
              <p className="text-gray-400">Class: {student.class}</p>
              {student.email && <p className="text-gray-400">{student.email}</p>}
              {student.parentContact && <p className="text-gray-400">Parent: {student.parentContact}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Total Marks</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalMarks}
                <span className="text-gray-400 text-sm">/{stats.maxPossibleMarks}</span>
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Percentage</p>
              <p className="text-2xl font-bold text-green-400">{stats.percentage.toFixed(2)}%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">GPA</p>
              <p className="text-2xl font-bold text-blue-400">{stats.gpa.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Overall Grade</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.overallGrade}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === 'subjects'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Subjects ({student.subjects.length})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === 'attendance'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Attendance ({student.attendance.length})
            </button>
            <button
              onClick={() => setActiveTab('remarks')}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === 'remarks'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Remarks ({student.remarks.length})
            </button>
          </div>

          {activeTab === 'subjects' && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Subjects</h3>
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>

              {student.subjects.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-400">No subjects added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Subject</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Marks</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Max Marks</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Percentage</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Grade</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.subjects.map((subject, index) => {
                        const percentage = (subject.marks / subject.maxMarks) * 100;
                        return (
                          <tr
                            key={subject.id}
                            className={`border-b border-gray-800 ${
                              index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'
                            } hover:bg-gray-800/50 transition-colors`}
                          >
                            <td className="px-4 py-3 text-white font-medium">{subject.subjectName}</td>
                            <td className="px-4 py-3 text-center text-white">{subject.marks}</td>
                            <td className="px-4 py-3 text-center text-gray-400">{subject.maxMarks}</td>
                            <td className="px-4 py-3 text-center text-green-400 font-semibold">
                              {percentage.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full font-bold">
                                {subject.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => onEditSubject(subject.id)}
                                  className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => onDeleteSubject(subject.id)}
                                  className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'attendance' && (
            <AttendanceTracker student={student} onMarkAttendance={onMarkAttendance} />
          )}

          {activeTab === 'remarks' && (
            <RemarksSection
              remarks={student.remarks}
              onAddRemark={onAddRemark}
              onDeleteRemark={onDeleteRemark}
            />
          )}
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
