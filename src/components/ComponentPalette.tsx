import React from 'react';
import { useDrag } from 'react-dnd';
import { ComponentDefinition } from '../types';
import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  FileText, 
  CheckSquare,
  ToggleLeft,
  List,
  Layout,
  Columns
} from 'lucide-react';

const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    category: 'Basic',
    defaultProps: { text: 'Sample Text', fontSize: '16px', color: '#000000' },
    propTypes: {
      text: { type: 'string', label: 'Text Content' },
      fontSize: { type: 'string', label: 'Font Size', defaultValue: '16px' },
      color: { type: 'color', label: 'Color', defaultValue: '#000000' }
    }
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'MousePointer',
    category: 'Basic',
    defaultProps: { text: 'Click Me', variant: 'primary', size: 'medium' },
    propTypes: {
      text: { type: 'string', label: 'Button Text' },
      variant: { type: 'select', label: 'Variant', options: ['primary', 'secondary', 'outline'], defaultValue: 'primary' },
      size: { type: 'select', label: 'Size', options: ['small', 'medium', 'large'], defaultValue: 'medium' }
    }
  },
  {
    type: 'input',
    name: 'Input',
    icon: 'FileText',
    category: 'Form',
    defaultProps: { placeholder: 'Enter text...', type: 'text' },
    propTypes: {
      placeholder: { type: 'string', label: 'Placeholder' },
      type: { type: 'select', label: 'Input Type', options: ['text', 'email', 'password', 'number'], defaultValue: 'text' }
    }
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'CheckSquare',
    category: 'Form',
    defaultProps: { label: 'Check me', checked: false },
    propTypes: {
      label: { type: 'string', label: 'Label' },
      checked: { type: 'boolean', label: 'Checked', defaultValue: false }
    }
  },
  {
    type: 'container',
    name: 'Container',
    icon: 'Square',
    category: 'Layout',
    defaultProps: { padding: '16px', backgroundColor: 'transparent', borderRadius: '4px' },
    propTypes: {
      padding: { type: 'string', label: 'Padding', defaultValue: '16px' },
      backgroundColor: { type: 'color', label: 'Background Color', defaultValue: 'transparent' },
      borderRadius: { type: 'string', label: 'Border Radius', defaultValue: '4px' }
    }
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    category: 'Media',
    defaultProps: { src: 'https://via.placeholder.com/200x150', alt: 'Placeholder', width: '200px' },
    propTypes: {
      src: { type: 'string', label: 'Image URL' },
      alt: { type: 'string', label: 'Alt Text' },
      width: { type: 'string', label: 'Width', defaultValue: '200px' }
    }
  }
];

const iconMap: Record<string, React.ComponentType<any>> = {
  Type,
  MousePointer,
  Square,
  Image,
  FileText,
  CheckSquare,
  ToggleLeft,
  List,
  Layout,
  Columns
};

interface DraggableComponentProps {
  definition: ComponentDefinition;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ definition }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: definition,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const IconComponent = iconMap[definition.icon] || Type;

  return (
    <div
      ref={drag}
      className={`component-item p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        <IconComponent size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{definition.name}</span>
      </div>
    </div>
  );
};

const ComponentPalette: React.FC = () => {
  const categories = [...new Set(componentDefinitions.map(def => def.category))];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Components</h2>
      
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
            {category}
          </h3>
          <div className="space-y-2">
            {componentDefinitions
              .filter(def => def.category === category)
              .map(definition => (
                <DraggableComponent key={definition.type} definition={definition} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComponentPalette;
export { componentDefinitions };