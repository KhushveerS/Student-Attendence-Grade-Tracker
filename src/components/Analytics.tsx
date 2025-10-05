import { TrendingUp, Award, TrendingDown, Users } from 'lucide-react';
import { ClassAnalytics } from '../types';

interface AnalyticsProps {
  analytics: ClassAnalytics;
}

export default function Analytics({ analytics }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Total Students</span>
          </div>
          <p className="text-3xl font-bold">{analytics.totalStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Class Average</span>
          </div>
          <p className="text-3xl font-bold">{analytics.classAverage.toFixed(2)}%</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Top Scorer</span>
          </div>
          {analytics.highestScorer ? (
            <>
              <p className="text-lg font-bold truncate">{analytics.highestScorer.name}</p>
              <p className="text-sm opacity-80">{analytics.highestScorer.percentage.toFixed(2)}%</p>
            </>
          ) : (
            <p className="text-lg font-medium">N/A</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Needs Support</span>
          </div>
          {analytics.lowestScorer ? (
            <>
              <p className="text-lg font-bold truncate">{analytics.lowestScorer.name}</p>
              <p className="text-sm opacity-80">{analytics.lowestScorer.percentage.toFixed(2)}%</p>
            </>
          ) : (
            <p className="text-lg font-medium">N/A</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Grade Distribution</h3>
          {analytics.gradeDistribution.length > 0 ? (
            <div className="space-y-3">
              {analytics.gradeDistribution.map((item) => {
                const percentage = (item.count / analytics.totalStudents) * 100;
                return (
                  <div key={item.grade}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">Grade {item.grade}</span>
                      <span className="text-gray-400">{item.count} students</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Subject Performance</h3>
          {analytics.subjectAverages.length > 0 ? (
            <div className="space-y-3">
              {analytics.subjectAverages
                .sort((a, b) => b.average - a.average)
                .map((item) => (
                  <div key={item.subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium truncate">{item.subject}</span>
                      <span className="text-blue-400 font-bold ml-2">{item.average.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.average}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
