import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Component, ComponentDefinition, AppBuilderState } from './types';
import ComponentPalette from './components/ComponentPalette';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import CodeGeneratorModal from './components/CodeGeneratorModal';
import PreviewMode from './components/PreviewMode';

function App() {
  const [state, setState] = useState<AppBuilderState>({
    components: [],
    selectedComponent: null,
    draggedComponent: null,
    mode: 'design',
  });

  const [showCodeModal, setShowCodeModal] = useState(false);

  const generateId = () => `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddComponent = useCallback((componentDef: ComponentDefinition, position: { x: number; y: number }) => {
    const newComponent: Component = {
      id: generateId(),
      type: componentDef.type,
      props: { ...componentDef.defaultProps },
      position,
    };

    setState(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
      selectedComponent: newComponent,
    }));
  }, []);

  const handleSelectComponent = useCallback((component: Component) => {
    setState(prev => ({
      ...prev,
      selectedComponent: component,
    }));
  }, []);

  const handleUpdateComponent = useCallback((componentId: string, newProps: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      components: prev.components.map(comp => {
        if (comp.id === componentId) {
          if (newProps.position) {
            return { ...comp, position: newProps.position };
          }
          return { ...comp, props: newProps };
        }
        return comp;
      }),
      selectedComponent: prev.selectedComponent?.id === componentId 
        ? { ...prev.selectedComponent, props: newProps }
        : prev.selectedComponent,
    }));
  }, []);

  const handleDeleteComponent = useCallback((componentId: string) => {
    setState(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId),
      selectedComponent: prev.selectedComponent?.id === componentId ? null : prev.selectedComponent,
    }));
  }, []);

  const handleModeChange = useCallback((mode: 'design' | 'preview') => {
    setState(prev => ({
      ...prev,
      mode,
      selectedComponent: mode === 'preview' ? null : prev.selectedComponent,
    }));
  }, []);

  const handleGenerateCode = useCallback(() => {
    setShowCodeModal(true);
  }, []);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(state.components, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'app-builder-project.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [state.components]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const components = JSON.parse(e.target?.result as string);
            setState(prev => ({
              ...prev,
              components,
              selectedComponent: null,
            }));
          } catch (error) {
            alert('Error importing file: Invalid JSON format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem('app-builder-project', JSON.stringify(state.components));
    alert('Project saved to local storage!');
  }, [state.components]);

  // Load project from localStorage on startup
  React.useEffect(() => {
    const saved = localStorage.getItem('app-builder-project');
    if (saved) {
      try {
        const components = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          components,
        }));
      } catch (error) {
        console.error('Error loading saved project:', error);
      }
    }
  }, []);

  if (state.mode === 'preview') {
    return (
      <div className="h-screen flex flex-col">
        <Toolbar
          mode={state.mode}
          onModeChange={handleModeChange}
          onGenerateCode={handleGenerateCode}
          onExport={handleExport}
          onImport={handleImport}
          onSave={handleSave}
        />
        <PreviewMode components={state.components} />
        {showCodeModal && (
          <CodeGeneratorModal
            components={state.components}
            onClose={() => setShowCodeModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col">
        <Toolbar
          mode={state.mode}
          onModeChange={handleModeChange}
          onGenerateCode={handleGenerateCode}
          onExport={handleExport}
          onImport={handleImport}
          onSave={handleSave}
        />
        
        <div className="flex-1 flex">
          <ComponentPalette />
          
          <Canvas
            components={state.components}
            onAddComponent={handleAddComponent}
            onSelectComponent={handleSelectComponent}
            selectedComponent={state.selectedComponent}
          />
          
          <PropertiesPanel
            selectedComponent={state.selectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        </div>

        {showCodeModal && (
          <CodeGeneratorModal
            components={state.components}
            onClose={() => setShowCodeModal(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;