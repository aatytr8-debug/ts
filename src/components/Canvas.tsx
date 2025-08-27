import React from 'react';
import { useDrop } from 'react-dnd';
import { Component, ComponentDefinition } from '../types';
import ComponentRenderer from './ComponentRenderer';

interface CanvasProps {
  components: Component[];
  onAddComponent: (componentDef: ComponentDefinition, position: { x: number; y: number }) => void;
  onSelectComponent: (component: Component) => void;
  selectedComponent: Component | null;
}

const Canvas: React.FC<CanvasProps> = ({ 
  components, 
  onAddComponent, 
  onSelectComponent, 
  selectedComponent 
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: ComponentDefinition, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
      
      if (clientOffset && canvasRect) {
        const position = {
          x: clientOffset.x - canvasRect.left,
          y: clientOffset.y - canvasRect.top
        };
        onAddComponent(item, position);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 bg-white relative overflow-auto">
      <div
        id="canvas"
        ref={drop}
        className={`min-h-full p-8 relative ${
          isOver ? 'bg-blue-50' : ''
        }`}
        style={{ minHeight: '100vh' }}
      >
        {components.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium mb-2">Start Building Your App</h3>
              <p className="text-gray-400">Drag components from the sidebar to get started</p>
            </div>
          </div>
        ) : (
          components.map((component) => (
            <div
              key={component.id}
              className={`absolute cursor-pointer ${
                selectedComponent?.id === component.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
              style={{
                left: component.position?.x || 0,
                top: component.position?.y || 0,
              }}
              onClick={() => onSelectComponent(component)}
            >
              <ComponentRenderer component={component} />
            </div>
          ))
        )}
        
        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default Canvas;