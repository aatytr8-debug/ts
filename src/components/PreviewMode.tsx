import React from 'react';
import { Component } from '../types';
import ComponentRenderer from './ComponentRenderer';

interface PreviewModeProps {
  components: Component[];
}

const PreviewMode: React.FC<PreviewModeProps> = ({ components }) => {
  return (
    <div className="flex-1 bg-white relative overflow-auto">
      <div className="min-h-full relative" style={{ minHeight: '100vh' }}>
        {components.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">👀</div>
              <h3 className="text-xl font-medium mb-2">Preview Mode</h3>
              <p className="text-gray-400">Add some components in design mode to see them here</p>
            </div>
          </div>
        ) : (
          components.map((component) => (
            <div
              key={component.id}
              className="absolute"
              style={{
                left: component.position?.x || 0,
                top: component.position?.y || 0,
              }}
            >
              <ComponentRenderer component={component} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PreviewMode;