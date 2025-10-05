import { Trophy, Medal, Award } from 'lucide-react';
import { Student } from '../types';
import { calculateStudentStats } from '../utils/gradeCalculations';

interface LeaderboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export default function Leaderboard({ students, onSelectStudent }: LeaderboardProps) {
  const rankedStudents = students
    .filter(s => s.subjects.length > 0)
    .map(student => ({
      student,
      stats: calculateStudentStats(student),
    }))
    .sort((a, b) => b.stats.percentage - a.stats.percentage);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-white" />;
      case 2:
        return <Medal className="w-6 h-6 text-white" />;
      case 3:
        return <Award className="w-6 h-6 text-white" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-700';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Class Leaderboard</h2>
      </div>

      {rankedStudents.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 rounded-lg border border-gray-800">
          <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No students with grades yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rankedStudents.map(({ student, stats }, index) => {
            const rank = index + 1;
            return (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  rank <= 3
                    ? 'border-yellow-500/30 bg-gradient-to-r from-gray-900 to-gray-800 hover:border-yellow-500/50'
                    : 'border-gray-800 bg-gray-900 hover:border-[#4ade80]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(
                      rank
                    )} font-bold text-white text-lg flex-shrink-0`}
                  >
                    {rank <= 3 ? getRankIcon(rank) : `#${rank}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white truncate">{student.name}</h3>
                      {rank === 1 && (
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded">
                          Top Scorer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Roll: {student.rollNumber}</span>
                      <span>Class: {student.class}</span>
                      <span className="text-[#4ade80] font-semibold">{stats.percentage.toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                  <div className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
  {stats.overallGrade}
</div>

                    <div className="text-xs text-white mt-1">GPA: {stats.gpa.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rankedStudents.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border border-yellow-500/30 rounded-lg p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {rankedStudents[0]?.stats.percentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Highest Score</p>
          </div>
          <div className="bg-gradient-to-br from-[#3b82f6]/20 to-[#2563eb]/20 border border-[#3b82f6]/30 rounded-lg p-4 text-center">
            <Award className="w-8 h-8 text-[#3b82f6] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {(
                rankedStudents.reduce((sum, { stats }) => sum + stats.percentage, 0) /
                rankedStudents.length
              ).toFixed(1)}
              %
            </p>
            <p className="text-xs text-gray-400 mt-1">Average Score</p>
          </div>
          <div className="bg-gradient-to-br from-[#4ade80]/20 to-[#22c55e]/20 border border-[#4ade80]/30 rounded-lg p-4 text-center">
            <Medal className="w-8 h-8 text-[#4ade80] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{rankedStudents.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Ranked</p>
          </div>
        </div>
      )}
    </div>
  );
}