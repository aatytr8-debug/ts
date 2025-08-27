import React from 'react';
import { Play, Code, Download, Upload, Undo, Redo, Save } from 'lucide-react';

interface ToolbarProps {
  mode: 'design' | 'preview';
  onModeChange: (mode: 'design' | 'preview') => void;
  onGenerateCode: () => void;
  onExport: () => void;
  onImport: () => void;
  onSave: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  onModeChange,
  onGenerateCode,
  onExport,
  onImport,
  onSave,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">App Builder</h1>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onModeChange('design')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === 'design'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => onModeChange('preview')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Play size={14} className="inline mr-1" />
            Preview
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Save project"
        >
          <Save size={16} />
          <span>Save</span>
        </button>

        <div className="w-px h-6 bg-gray-300" />

        <button
          onClick={onGenerateCode}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          title="Generate code"
        >
          <Code size={16} />
          <span>Code</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 rounded-md transition-colors"
          title="Export project"
        >
          <Download size={16} />
          <span>Export</span>
        </button>

        <button
          onClick={onImport}
          className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
          title="Import project"
        >
          <Upload size={16} />
          <span>Import</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;