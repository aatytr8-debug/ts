import React, { useState, useMemo } from 'react';
import { Component } from '../types';
import { X, Copy, Download } from 'lucide-react';

interface CodeGeneratorModalProps {
  components: Component[];
  onClose: () => void;
}

const CodeGeneratorModal: React.FC<CodeGeneratorModalProps> = ({ components, onClose }) => {
  const [selectedFramework, setSelectedFramework] = useState<'react' | 'html' | 'vue'>('react');

  const generateReactCode = (components: Component[]) => {
    const componentCode = components.map(component => {
      const { type, props, position } = component;
      const style = position ? `style={{ position: 'absolute', left: '${position.x}px', top: '${position.y}px' }}` : '';

      switch (type) {
        case 'text':
          return `    <div ${style}${style ? ' ' : ''}style={{ ...${style ? 'style, ' : ''}fontSize: '${props.fontSize}', color: '${props.color}' }}>
      ${props.text}
    </div>`;

        case 'button':
          const buttonClass = `btn btn-${props.variant} btn-${props.size}`;
          return `    <button ${style} className="${buttonClass}">
      ${props.text}
    </button>`;

        case 'input':
          return `    <input ${style} type="${props.type}" placeholder="${props.placeholder}" className="form-input" />`;

        case 'checkbox':
          return `    <label ${style} className="checkbox-label">
      <input type="checkbox" ${props.checked ? 'checked' : ''} />
      ${props.label}
    </label>`;

        case 'container':
          return `    <div ${style}${style ? ' ' : ''}style={{ ...${style ? 'style, ' : ''}padding: '${props.padding}', backgroundColor: '${props.backgroundColor}', borderRadius: '${props.borderRadius}' }}>
      Container Content
    </div>`;

        case 'image':
          return `    <img ${style} src="${props.src}" alt="${props.alt}" style={{ width: '${props.width}' }} />`;

        default:
          return `    <div ${style}>Unknown component</div>`;
      }
    }).join('\n\n');

    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
${componentCode}
    </div>
  );
}

export default App;`;
  };

  const generateHTMLCode = (components: Component[]) => {
    const componentCode = components.map(component => {
      const { type, props, position } = component;
      const positionStyle = position ? `position: absolute; left: ${position.x}px; top: ${position.y}px;` : '';

      switch (type) {
        case 'text':
          return `    <div style="${positionStyle} font-size: ${props.fontSize}; color: ${props.color};">
      ${props.text}
    </div>`;

        case 'button':
          return `    <button style="${positionStyle}" class="btn btn-${props.variant} btn-${props.size}">
      ${props.text}
    </button>`;

        case 'input':
          return `    <input style="${positionStyle}" type="${props.type}" placeholder="${props.placeholder}" class="form-input" />`;

        case 'checkbox':
          return `    <label style="${positionStyle}" class="checkbox-label">
      <input type="checkbox" ${props.checked ? 'checked' : ''} />
      ${props.label}
    </label>`;

        case 'container':
          return `    <div style="${positionStyle} padding: ${props.padding}; background-color: ${props.backgroundColor}; border-radius: ${props.borderRadius};">
      Container Content
    </div>`;

        case 'image':
          return `    <img style="${positionStyle} width: ${props.width};" src="${props.src}" alt="${props.alt}" />`;

        default:
          return `    <div style="${positionStyle}">Unknown component</div>`;
      }
    }).join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app">
${componentCode}
  </div>
</body>
</html>`;
  };

  const generateVueCode = (components: Component[]) => {
    const componentCode = components.map(component => {
      const { type, props, position } = component;
      const positionStyle = position ? `:style="{ position: 'absolute', left: '${position.x}px', top: '${position.y}px' }"` : '';

      switch (type) {
        case 'text':
          return `    <div ${positionStyle} :style="{ fontSize: '${props.fontSize}', color: '${props.color}' }">
      ${props.text}
    </div>`;

        case 'button':
          return `    <button ${positionStyle} class="btn btn-${props.variant} btn-${props.size}">
      ${props.text}
    </button>`;

        case 'input':
          return `    <input ${positionStyle} type="${props.type}" placeholder="${props.placeholder}" class="form-input" />`;

        case 'checkbox':
          return `    <label ${positionStyle} class="checkbox-label">
      <input type="checkbox" ${props.checked ? ':checked="true"' : ''} />
      ${props.label}
    </label>`;

        case 'container':
          return `    <div ${positionStyle} :style="{ padding: '${props.padding}', backgroundColor: '${props.backgroundColor}', borderRadius: '${props.borderRadius}' }">
      Container Content
    </div>`;

        case 'image':
          return `    <img ${positionStyle} :src="'${props.src}'" alt="${props.alt}" :style="{ width: '${props.width}' }" />`;

        default:
          return `    <div ${positionStyle}>Unknown component</div>`;
      }
    }).join('\n\n');

    return `<template>
  <div class="app">
${componentCode}
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
.app {
  position: relative;
  min-height: 100vh;
  padding: 20px;
}
</style>`;
  };

  const generatedCode = useMemo(() => {
    switch (selectedFramework) {
      case 'react':
        return generateReactCode(components);
      case 'html':
        return generateHTMLCode(components);
      case 'vue':
        return generateVueCode(components);
      default:
        return '';
    }
  }, [components, selectedFramework]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };

  const downloadCode = () => {
    const fileExtension = selectedFramework === 'react' ? 'jsx' : selectedFramework === 'vue' ? 'vue' : 'html';
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-app.${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-4/5 h-4/5 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Generated Code</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value as 'react' | 'html' | 'vue')}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="react">React</option>
              <option value="html">HTML</option>
              <option value="vue">Vue</option>
            </select>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Copy size={16} />
              <span>Copy</span>
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <pre className="bg-gray-100 p-4 rounded h-full overflow-auto text-sm">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeGeneratorModal;