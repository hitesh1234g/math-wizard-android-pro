
import React, { useState } from 'react';
import { X, Palette, Edit3 } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorName: string;
  onNameChange: (name: string) => void;
  buttonColor: string;
  onColorChange: (color: string) => void;
}

const Settings = ({ 
  isOpen, 
  onClose, 
  calculatorName, 
  onNameChange, 
  buttonColor, 
  onColorChange 
}: SettingsProps) => {
  const [tempName, setTempName] = useState(calculatorName);
  const [isEditingName, setIsEditingName] = useState(false);

  const colorOptions = [
    { name: 'Orange', value: '#ff9500', gradient: 'from-orange-500 to-orange-600' },
    { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
    { name: 'Green', value: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'Purple', value: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },
    { name: 'Red', value: '#ef4444', gradient: 'from-red-500 to-red-600' },
    { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
    { name: 'Teal', value: '#14b8a6', gradient: 'from-teal-500 to-teal-600' },
    { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
    { name: 'Indigo', value: '#6366f1', gradient: 'from-indigo-500 to-indigo-600' },
    { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
    { name: 'Lime', value: '#65a30d', gradient: 'from-lime-500 to-lime-600' },
    { name: 'Rose', value: '#f43f5e', gradient: 'from-rose-500 to-rose-600' },
    { name: 'Yellow', value: '#eab308', gradient: 'from-yellow-500 to-yellow-600' },
    { name: 'Emerald', value: '#059669', gradient: 'from-emerald-600 to-emerald-700' },
    { name: 'Sky', value: '#0ea5e9', gradient: 'from-sky-500 to-sky-600' },
    { name: 'Fuchsia', value: '#d946ef', gradient: 'from-fuchsia-500 to-fuchsia-600' }
  ];

  const handleSaveName = () => {
    onNameChange(tempName);
    setIsEditingName(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-calc-display rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-calc-text-primary flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-calc-text-secondary hover:text-calc-text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Calculator Name */}
        <div className="mb-6">
          <label className="block text-calc-text-primary text-sm font-medium mb-3">
            Calculator Name
          </label>
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 bg-calc-bg border border-calc-btn-primary rounded-lg px-3 py-2 text-calc-text-primary"
                  placeholder="Enter calculator name"
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-calc-bg border border-calc-btn-primary rounded-lg px-3 py-2">
                <span className="text-calc-text-primary">{calculatorName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-calc-text-secondary hover:text-calc-text-primary transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Button Colors */}
        <div className="mb-6">
          <label className="block text-calc-text-primary text-sm font-medium mb-3">
            Button Color Theme
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => onColorChange(color.value)}
                className={`
                  relative w-full h-12 rounded-lg bg-gradient-to-br ${color.gradient}
                  transition-all duration-200 hover:scale-105
                  ${buttonColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-calc-display' : ''}
                `}
                title={color.name}
              >
                {buttonColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
