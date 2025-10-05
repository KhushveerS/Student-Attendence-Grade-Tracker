import { useState, useRef } from 'react';
import { Upload, Download, X, CheckCircle, AlertCircle } from 'lucide-react';
import { importFromCSV, downloadCSVTemplate } from '../utils/csvUtils';

interface BulkImportProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export default function BulkImport({ onClose, onImportComplete }: BulkImportProps) {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const importResult = await importFromCSV(file);
      setResult(importResult);

      if (importResult.success > 0) {
        onImportComplete();
      }
    } catch (error) {
      setResult({
        success: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full border border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-green-400">Bulk Import Students</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Instructions
            </h3>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Download the CSV template below</li>
              <li>Fill in student information (Name, Roll Number, and Class are required)</li>
              <li>Save the file and upload it using the button below</li>
              <li>Duplicate roll numbers will be skipped</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadCSVTemplate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {importing ? 'Importing...' : 'Upload CSV'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {result && (
            <div className="space-y-3">
              {result.success > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                    <CheckCircle className="w-5 h-5" />
                    Success
                  </div>
                  <p className="text-sm text-gray-300">
                    Successfully imported {result.success} student{result.success !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                    <AlertCircle className="w-5 h-5" />
                    Errors ({result.errors.length})
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.map((error, index) => (
                      <p key={index} className="text-sm text-gray-300">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
