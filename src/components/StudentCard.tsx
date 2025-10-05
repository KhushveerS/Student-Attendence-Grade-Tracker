import { CreditCard as Edit2, Trash2, Plus, Eye } from 'lucide-react';
import { Student } from '../types';
import { calculateStudentStats } from '../utils/gradeCalculations';

interface StudentCardProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubject: () => void;
  onViewDetails: () => void;
}

export default function StudentCard({ student, onEdit, onDelete, onAddSubject, onViewDetails }: StudentCardProps) {
  const stats = calculateStudentStats(student);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-[#4ade80]/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{student.name}</h3>
          <p className="text-gray-400 text-sm">Roll No: {student.rollNumber}</p>
          <p className="text-gray-400 text-sm">Class: {student.class}</p>
          {student.email && (
            <p className="text-gray-400 text-sm">{student.email}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-lg transition-colors"
            title="Edit Student"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Subjects</span>
          <span className="text-white font-semibold">{student.subjects.length}</span>
        </div>

        {student.subjects.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Marks</span>
              <span className="text-white font-semibold">
                {stats.totalMarks}/{stats.maxPossibleMarks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Percentage</span>
              <span className="text-[#4ade80] font-bold">{stats.percentage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">GPA</span>
              <span className="text-[#3b82f6] font-bold">{stats.gpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Grade</span>
              <span className="text-yellow-400 font-bold text-lg">{stats.overallGrade}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAddSubject}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
        <button
          onClick={onViewDetails}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
      </div>
    </div>
  );
}