import { Calendar, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Student } from '../types';

interface AttendanceTrackerProps {
  student: Student;
  onMarkAttendance: (status: 'present' | 'absent' | 'late' | 'excused') => void;
}

export default function AttendanceTracker({ student, onMarkAttendance }: AttendanceTrackerProps) {
  const last30Days = student.attendance.slice(-30);
  const presentCount = student.attendance.filter(a => a.status === 'present').length;
  const attendanceRate = student.attendance.length > 0
    ? ((presentCount / student.attendance.length) * 100).toFixed(1)
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'excused':
        return <FileText className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'late':
        return 'bg-yellow-500';
      case 'excused':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          Attendance Tracker
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-400">{attendanceRate}%</p>
          <p className="text-xs text-gray-400">Attendance Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onMarkAttendance('present')}
          className="flex flex-col items-center gap-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <CheckCircle className="w-6 h-6 text-white" />
          <span className="text-xs text-white font-medium">Present</span>
        </button>
        <button
          onClick={() => onMarkAttendance('absent')}
          className="flex flex-col items-center gap-2 p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <XCircle className="w-6 h-6 text-white" />
          <span className="text-xs text-white font-medium">Absent</span>
        </button>
        <button
          onClick={() => onMarkAttendance('late')}
          className="flex flex-col items-center gap-2 p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
        >
          <Clock className="w-6 h-6 text-white" />
          <span className="text-xs text-white font-medium">Late</span>
        </button>
        <button
          onClick={() => onMarkAttendance('excused')}
          className="flex flex-col items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <FileText className="w-6 h-6 text-white" />
          <span className="text-xs text-white font-medium">Excused</span>
        </button>
      </div>

      {last30Days.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-3">Last 30 Records</p>
          <div className="grid grid-cols-10 gap-2">
            {last30Days.map((record, index) => (
              <div
                key={index}
                className="group relative"
                title={`${record.date}: ${record.status}`}
              >
                <div className={`w-8 h-8 rounded ${getStatusColor(record.status)}`} />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 border border-gray-700">
                  {record.date}
                  <br />
                  {record.status}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-gray-400">Present</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-gray-400">Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span className="text-gray-400">Late</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-gray-400">Excused</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 mb-1">Total Days</p>
          <p className="text-xl font-bold text-white">{student.attendance.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 mb-1">Present</p>
          <p className="text-xl font-bold text-green-400">{presentCount}</p>
        </div>
      </div>
    </div>
  );
}
