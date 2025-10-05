import { useState } from 'react';
import { X } from 'lucide-react';
import { Subject } from '../types';

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (data: { subjectName: string; marks: number; maxMarks: number }) => void;
  onCancel: () => void;
}

export default function SubjectForm({ subject, onSubmit, onCancel }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    subjectName: subject?.subjectName || '',
    marks: subject?.marks || 0,
    maxMarks: subject?.maxMarks || 100,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-[#3b82f6]">
            {subject ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Marks Obtained *
            </label>
            <input
              type="number"
              required
              min="0"
              max={formData.maxMarks}
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
              placeholder="Enter marks"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Marks *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: parseFloat(e.target.value) || 100 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent outline-none transition-all"
              placeholder="Enter max marks"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors font-medium"
            >
              {subject ? 'Update' : 'Add'} Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}