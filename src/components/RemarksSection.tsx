import { useState } from 'react';
import { MessageSquare, Trash2, Plus, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { Remark } from '../types';

interface RemarksSectionProps {
  remarks: Remark[];
  onAddRemark: (text: string, type: 'positive' | 'negative' | 'neutral') => void;
  onDeleteRemark: (remarkId: string) => void;
}

export default function RemarksSection({ remarks, onAddRemark, onDeleteRemark }: RemarksSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [remarkText, setRemarkText] = useState('');
  const [remarkType, setRemarkType] = useState<'positive' | 'negative' | 'neutral'>('neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remarkText.trim()) {
      onAddRemark(remarkText.trim(), remarkType);
      setRemarkText('');
      setRemarkType('neutral');
      setShowForm(false);
    }
  };

  const getRemarkIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-400" />;
      case 'neutral':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getRemarkColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/5';
      case 'negative':
        return 'border-red-500/30 bg-red-500/5';
      case 'neutral':
        return 'border-blue-500/30 bg-blue-500/5';
      default:
        return 'border-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          Remarks & Comments
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Remark
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Remark Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRemarkType('positive')}
                className={`p-2 rounded-lg border transition-all ${
                  remarkType === 'positive'
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-gray-700 text-gray-400 hover:border-green-500/50'
                }`}
              >
                <ThumbsUp className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs">Positive</span>
              </button>
              <button
                type="button"
                onClick={() => setRemarkType('neutral')}
                className={`p-2 rounded-lg border transition-all ${
                  remarkType === 'neutral'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-gray-700 text-gray-400 hover:border-blue-500/50'
                }`}
              >
                <AlertCircle className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs">Neutral</span>
              </button>
              <button
                type="button"
                onClick={() => setRemarkType('negative')}
                className={`p-2 rounded-lg border transition-all ${
                  remarkType === 'negative'
                    ? 'border-red-500 bg-red-500/20 text-red-400'
                    : 'border-gray-700 text-gray-400 hover:border-red-500/50'
                }`}
              >
                <ThumbsDown className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs">Negative</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
            <textarea
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="Enter your remark or comment..."
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setRemarkText('');
                setRemarkType('neutral');
              }}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Remark
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {remarks.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">No remarks yet</p>
          </div>
        ) : (
          remarks
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((remark) => (
              <div
                key={remark.id}
                className={`p-3 rounded-lg border ${getRemarkColor(remark.type)} transition-all hover:border-opacity-50`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getRemarkIcon(remark.type)}
                    <div className="flex-1">
                      <p className="text-white text-sm">{remark.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(remark.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteRemark(remark.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete remark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
