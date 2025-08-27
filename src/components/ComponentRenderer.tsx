import React from 'react';
import { Component } from '../types';

interface ComponentRendererProps {
  component: Component;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
  const { type, props } = component;

  switch (type) {
    case 'text':
      return (
        <div
          style={{
            fontSize: props.fontSize || '16px',
            color: props.color || '#000000',
          }}
        >
          {props.text || 'Sample Text'}
        </div>
      );

    case 'button':
      const buttonStyles = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50'
      };
      
      const sizeStyles = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg'
      };

      return (
        <button
          className={`rounded transition-colors ${buttonStyles[props.variant as keyof typeof buttonStyles] || buttonStyles.primary} ${sizeStyles[props.size as keyof typeof sizeStyles] || sizeStyles.medium}`}
        >
          {props.text || 'Click Me'}
        </button>
      );

    case 'input':
      return (
        <input
          type={props.type || 'text'}
          placeholder={props.placeholder || 'Enter text...'}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      );

    case 'checkbox':
      return (
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={props.checked || false}
            className="rounded focus:ring-blue-500"
            readOnly
          />
          <span>{props.label || 'Check me'}</span>
        </label>
      );

    case 'container':
      return (
        <div
          style={{
            padding: props.padding || '16px',
            backgroundColor: props.backgroundColor || 'transparent',
            borderRadius: props.borderRadius || '4px',
            minWidth: '100px',
            minHeight: '50px',
            border: '1px dashed #e5e7eb'
          }}
        >
          <div className="text-gray-400 text-sm">Container</div>
          {component.children?.map((child) => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
        </div>
      );

    case 'image':
      return (
        <img
          src={props.src || 'https://via.placeholder.com/200x150'}
          alt={props.alt || 'Placeholder'}
          style={{
            width: props.width || '200px',
            height: 'auto'
          }}
          className="rounded"
        />
      );

    default:
      return (
        <div className="p-2 bg-gray-100 border border-gray-300 rounded">
          Unknown component: {type}
        </div>
      );
  }
};

export default ComponentRenderer;