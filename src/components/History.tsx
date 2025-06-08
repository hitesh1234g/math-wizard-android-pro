
import React from 'react';
import { X, History as HistoryIcon, Trash2 } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  onSelectHistory: (entry: HistoryEntry) => void;
}

const History = ({ isOpen, onClose, history, onClearHistory, onSelectHistory }: HistoryProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-calc-display rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-calc-text-primary flex items-center gap-2">
            <HistoryIcon className="w-5 h-5" />
            History
          </h2>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-calc-text-secondary hover:text-red-500 transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-calc-text-secondary hover:text-calc-text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center text-calc-text-secondary py-8">
              <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No calculations yet</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectHistory(entry)}
                className="bg-calc-bg rounded-lg p-4 cursor-pointer hover:bg-calc-btn-primary transition-colors"
              >
                <div className="text-calc-text-secondary text-sm mb-1">
                  {entry.expression}
                </div>
                <div className="text-calc-text-primary text-lg font-medium">
                  = {entry.result}
                </div>
                <div className="text-calc-text-secondary text-xs mt-2">
                  {entry.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
