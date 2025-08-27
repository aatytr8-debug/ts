import React from 'react';
import { Component, PropType } from '../types';
import { componentDefinitions } from './ComponentPalette';
import { Settings, Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: Component | null;
  onUpdateComponent: (componentId: string, newProps: Record<string, any>) => void;
  onDeleteComponent: (componentId: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
}) => {
  if (!selectedComponent) {
    return (
      <div className="w-64 bg-gray-50 border-l border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Settings size={18} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
        <div className="text-center text-gray-500 mt-8">
          <div className="text-4xl mb-2">⚙️</div>
          <p>Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const componentDef = componentDefinitions.find(def => def.type === selectedComponent.type);
  
  if (!componentDef) {
    return (
      <div className="w-64 bg-gray-50 border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
        <p className="text-gray-500">Unknown component type</p>
      </div>
    );
  }

  const handlePropertyChange = (propName: string, value: any) => {
    onUpdateComponent(selectedComponent.id, {
      ...selectedComponent.props,
      [propName]: value,
    });
  };

  const renderPropertyInput = (propName: string, propType: PropType) => {
    const currentValue = selectedComponent.props[propName] ?? propType.defaultValue;

    switch (propType.type) {
      case 'string':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(propName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(propName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(propName, Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentValue || false}
              onChange={(e) => handlePropertyChange(propName, e.target.checked)}
              className="rounded focus:ring-blue-500"
            />
            <span className="text-sm">Enabled</span>
          </label>
        );

      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={currentValue || '#000000'}
              onChange={(e) => handlePropertyChange(propName, e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={currentValue || '#000000'}
              onChange={(e) => handlePropertyChange(propName, e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <select
            value={currentValue || propType.defaultValue}
            onChange={(e) => handlePropertyChange(propName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {propType.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handlePropertyChange(propName, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings size={18} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
        <button
          onClick={() => onDeleteComponent(selectedComponent.id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
          title="Delete component"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h3 className="font-medium text-blue-900 capitalize">{selectedComponent.type}</h3>
        <p className="text-sm text-blue-700">ID: {selectedComponent.id.slice(0, 8)}...</p>
      </div>

      <div className="space-y-4">
        {Object.entries(componentDef.propTypes).map(([propName, propType]) => (
          <div key={propName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {propType.label}
            </label>
            {renderPropertyInput(propName, propType)}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Position</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              value={selectedComponent.position?.x || 0}
              onChange={(e) => 
                onUpdateComponent(selectedComponent.id, {
                  ...selectedComponent.props,
                  position: { 
                    ...selectedComponent.position,
                    x: Number(e.target.value),
                    y: selectedComponent.position?.y || 0
                  }
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              value={selectedComponent.position?.y || 0}
              onChange={(e) => 
                onUpdateComponent(selectedComponent.id, {
                  ...selectedComponent.props,
                  position: { 
                    x: selectedComponent.position?.x || 0,
                    y: Number(e.target.value)
                  }
                })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;