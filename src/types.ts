export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Component[];
  position?: {
    x: number;
    y: number;
  };
}

export interface ComponentDefinition {
  type: string;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  propTypes: Record<string, PropType>;
  category: string;
}

export interface PropType {
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'textarea';
  label: string;
  options?: string[];
  defaultValue?: any;
}

export interface AppBuilderState {
  components: Component[];
  selectedComponent: Component | null;
  draggedComponent: ComponentDefinition | null;
  mode: 'design' | 'preview';
}

export interface DropResult {
  dropEffect: string;
}