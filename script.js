// App Builder Application
class AppBuilder {
    constructor() {
        this.components = [];
        this.selectedComponent = null;
        this.history = [];
        this.historyIndex = -1;
        this.currentTheme = 'light';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupThemeSwitching();
        this.updateHistory();
    }

    setupEventListeners() {
        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.showPreview();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportApp();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearCanvas();
        });

        // Undo button
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });

        // Close preview modal
        document.getElementById('closePreview').addEventListener('click', () => {
            this.hidePreview();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'z':
                        e.preventDefault();
                        this.undo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.exportApp();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.showPreview();
                        break;
                }
            }
            if (e.key === 'Delete' && this.selectedComponent) {
                this.deleteComponent(this.selectedComponent);
            }
        });
    }

    setupDragAndDrop() {
        const componentItems = document.querySelectorAll('.component-item');
        const canvas = document.getElementById('canvas');

        componentItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
        });

        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');
            
            const componentType = e.dataTransfer.getData('text/plain');
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.addComponent(componentType, x, y);
        });
    }

    setupThemeSwitching() {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                
                // Update active state
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    addComponent(type, x, y) {
        const component = this.createComponent(type);
        component.style.position = 'absolute';
        component.style.left = `${x}px`;
        component.style.top = `${y}px`;
        
        this.components.push({
            id: Date.now() + Math.random(),
            type: type,
            element: component,
            properties: this.getDefaultProperties(type)
        });

        const canvas = document.getElementById('canvas');
        canvas.appendChild(component);
        
        // Remove placeholder if it exists
        const placeholder = canvas.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        this.selectComponent(component);
        this.updateHistory();
    }

    createComponent(type) {
        const component = document.createElement('div');
        component.className = 'canvas-component';
        
        switch(type) {
            case 'button':
                component.innerHTML = '<button class="component-button">Click Me</button>';
                break;
            case 'text':
                component.innerHTML = '<div class="component-text">Sample Text</div>';
                break;
            case 'input':
                component.innerHTML = '<input type="text" class="component-input" placeholder="Enter text...">';
                break;
            case 'image':
                component.innerHTML = '<div class="component-image"><i class="fas fa-image"></i><br>Image Placeholder</div>';
                break;
            case 'card':
                component.innerHTML = '<div class="component-card"><h4>Card Title</h4><p>Card content goes here...</p></div>';
                break;
            case 'container':
                component.innerHTML = '<div class="component-container"><p>Container</p></div>';
                break;
        }

        component.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component);
        });

        return component;
    }

    getDefaultProperties(type) {
        const baseProps = {
            id: '',
            className: '',
            style: {}
        };

        switch(type) {
            case 'button':
                return {
                    ...baseProps,
                    text: 'Click Me',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontSize: '14px',
                    padding: '12px 24px',
                    borderRadius: '6px'
                };
            case 'text':
                return {
                    ...baseProps,
                    content: 'Sample Text',
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '500',
                    textAlign: 'left'
                };
            case 'input':
                return {
                    ...baseProps,
                    placeholder: 'Enter text...',
                    type: 'text',
                    width: '200px',
                    height: '40px',
                    borderColor: '#d1d5db'
                };
            case 'image':
                return {
                    ...baseProps,
                    src: '',
                    alt: 'Image',
                    width: '200px',
                    height: '120px'
                };
            case 'card':
                return {
                    ...baseProps,
                    title: 'Card Title',
                    content: 'Card content goes here...',
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    padding: '24px'
                };
            case 'container':
                return {
                    ...baseProps,
                    backgroundColor: '#f8fafc',
                    borderColor: '#d1d5db',
                    padding: '16px',
                    minHeight: '100px'
                };
        }
    }

    selectComponent(component) {
        // Deselect previous component
        if (this.selectedComponent) {
            this.selectedComponent.classList.remove('selected');
        }

        // Select new component
        this.selectedComponent = component;
        component.classList.add('selected');

        // Find component data
        const componentData = this.components.find(c => c.element === component);
        if (componentData) {
            this.showProperties(componentData);
        }
    }

    showProperties(componentData) {
        const propertiesContent = document.getElementById('propertiesContent');
        propertiesContent.innerHTML = '';

        const properties = componentData.properties;
        const type = componentData.type;

        // Common properties
        this.addPropertyControl(propertiesContent, 'ID', 'id', properties.id, 'text');
        this.addPropertyControl(propertiesContent, 'CSS Class', 'className', properties.className, 'text');

        // Type-specific properties
        switch(type) {
            case 'button':
                this.addPropertyControl(propertiesContent, 'Text', 'text', properties.text, 'text');
                this.addPropertyControl(propertiesContent, 'Background Color', 'backgroundColor', properties.backgroundColor, 'color');
                this.addPropertyControl(propertiesContent, 'Text Color', 'color', properties.color, 'color');
                this.addPropertyControl(propertiesContent, 'Font Size', 'fontSize', properties.fontSize, 'text');
                this.addPropertyControl(propertiesContent, 'Padding', 'padding', properties.padding, 'text');
                this.addPropertyControl(propertiesContent, 'Border Radius', 'borderRadius', properties.borderRadius, 'text');
                break;
            case 'text':
                this.addPropertyControl(propertiesContent, 'Content', 'content', properties.content, 'textarea');
                this.addPropertyControl(propertiesContent, 'Font Size', 'fontSize', properties.fontSize, 'text');
                this.addPropertyControl(propertiesContent, 'Color', 'color', properties.color, 'color');
                this.addPropertyControl(propertiesContent, 'Font Weight', 'fontWeight', properties.fontWeight, 'select', ['300', '400', '500', '600', '700']);
                this.addPropertyControl(propertiesContent, 'Text Align', 'textAlign', properties.textAlign, 'select', ['left', 'center', 'right']);
                break;
            case 'input':
                this.addPropertyControl(propertiesContent, 'Placeholder', 'placeholder', properties.placeholder, 'text');
                this.addPropertyControl(propertiesContent, 'Type', 'type', properties.type, 'select', ['text', 'email', 'password', 'number']);
                this.addPropertyControl(propertiesContent, 'Width', 'width', properties.width, 'text');
                this.addPropertyControl(propertiesContent, 'Height', 'height', properties.height, 'text');
                this.addPropertyControl(propertiesContent, 'Border Color', 'borderColor', properties.borderColor, 'color');
                break;
            case 'image':
                this.addPropertyControl(propertiesContent, 'Image URL', 'src', properties.src, 'text');
                this.addPropertyControl(propertiesContent, 'Alt Text', 'alt', properties.alt, 'text');
                this.addPropertyControl(propertiesContent, 'Width', 'width', properties.width, 'text');
                this.addPropertyControl(propertiesContent, 'Height', 'height', properties.height, 'text');
                break;
            case 'card':
                this.addPropertyControl(propertiesContent, 'Title', 'title', properties.title, 'text');
                this.addPropertyControl(propertiesContent, 'Content', 'content', properties.content, 'textarea');
                this.addPropertyControl(propertiesContent, 'Background Color', 'backgroundColor', properties.backgroundColor, 'color');
                this.addPropertyControl(propertiesContent, 'Border Color', 'borderColor', properties.borderColor, 'color');
                this.addPropertyControl(propertiesContent, 'Padding', 'padding', properties.padding, 'text');
                break;
            case 'container':
                this.addPropertyControl(propertiesContent, 'Background Color', 'backgroundColor', properties.backgroundColor, 'color');
                this.addPropertyControl(propertiesContent, 'Border Color', 'borderColor', properties.borderColor, 'color');
                this.addPropertyControl(propertiesContent, 'Padding', 'padding', properties.padding, 'text');
                this.addPropertyControl(propertiesContent, 'Min Height', 'minHeight', properties.minHeight, 'text');
                break;
        }

        // Add delete button
        this.addDeleteButton(propertiesContent, componentData);
    }

    addPropertyControl(container, label, property, value, type, options = null) {
        const propertyGroup = document.createElement('div');
        propertyGroup.className = 'property-group';

        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        propertyGroup.appendChild(labelElement);

        let inputElement;

        switch(type) {
            case 'text':
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.value = value;
                break;
            case 'textarea':
                inputElement = document.createElement('textarea');
                inputElement.value = value;
                inputElement.rows = 3;
                break;
            case 'color':
                inputElement = document.createElement('input');
                inputElement.type = 'color';
                inputElement.value = value;
                inputElement.className = 'color-picker';
                break;
            case 'select':
                inputElement = document.createElement('select');
                options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    if (option === value) optionElement.selected = true;
                    inputElement.appendChild(optionElement);
                });
                break;
        }

        inputElement.addEventListener('input', (e) => {
            this.updateComponentProperty(property, e.target.value);
        });

        propertyGroup.appendChild(inputElement);
        container.appendChild(propertyGroup);
    }

    addDeleteButton(container, componentData) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-small';
        deleteBtn.style.background = '#ef4444';
        deleteBtn.style.color = 'white';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete Component';
        
        deleteBtn.addEventListener('click', () => {
            this.deleteComponent(componentData.element);
        });

        container.appendChild(deleteBtn);
    }

    updateComponentProperty(property, value) {
        if (!this.selectedComponent) return;

        const componentData = this.components.find(c => c.element === this.selectedComponent);
        if (!componentData) return;

        componentData.properties[property] = value;
        this.applyProperties(componentData);
        this.updateHistory();
    }

    applyProperties(componentData) {
        const element = componentData.element;
        const properties = componentData.properties;

        // Apply common properties
        if (properties.id) element.id = properties.id;
        if (properties.className) element.className = `canvas-component ${properties.className}`;

        // Apply type-specific properties
        switch(componentData.type) {
            case 'button':
                const button = element.querySelector('.component-button');
                if (button) {
                    button.textContent = properties.text;
                    button.style.backgroundColor = properties.backgroundColor;
                    button.style.color = properties.color;
                    button.style.fontSize = properties.fontSize;
                    button.style.padding = properties.padding;
                    button.style.borderRadius = properties.borderRadius;
                }
                break;
            case 'text':
                const text = element.querySelector('.component-text');
                if (text) {
                    text.textContent = properties.content;
                    text.style.fontSize = properties.fontSize;
                    text.style.color = properties.color;
                    text.style.fontWeight = properties.fontWeight;
                    text.style.textAlign = properties.textAlign;
                }
                break;
            case 'input':
                const input = element.querySelector('.component-input');
                if (input) {
                    input.placeholder = properties.placeholder;
                    input.type = properties.type;
                    input.style.width = properties.width;
                    input.style.height = properties.height;
                    input.style.borderColor = properties.borderColor;
                }
                break;
            case 'image':
                const imageDiv = element.querySelector('.component-image');
                if (imageDiv && properties.src) {
                    imageDiv.innerHTML = `<img src="${properties.src}" alt="${properties.alt}" style="width: ${properties.width}; height: ${properties.height}; object-fit: cover;">`;
                }
                break;
            case 'card':
                const card = element.querySelector('.component-card');
                if (card) {
                    card.querySelector('h4').textContent = properties.title;
                    card.querySelector('p').textContent = properties.content;
                    card.style.backgroundColor = properties.backgroundColor;
                    card.style.borderColor = properties.borderColor;
                    card.style.padding = properties.padding;
                }
                break;
            case 'container':
                element.style.backgroundColor = properties.backgroundColor;
                element.style.borderColor = properties.borderColor;
                element.style.padding = properties.padding;
                element.style.minHeight = properties.minHeight;
                break;
        }
    }

    deleteComponent(component) {
        const index = this.components.findIndex(c => c.element === component);
        if (index > -1) {
            this.components.splice(index, 1);
            component.remove();
            
            if (this.selectedComponent === component) {
                this.selectedComponent = null;
                this.showNoSelection();
            }

            this.updateHistory();
        }
    }

    showNoSelection() {
        const propertiesContent = document.getElementById('propertiesContent');
        propertiesContent.innerHTML = `
            <div class="no-selection">
                <i class="fas fa-hand-pointer"></i>
                <p>Select a component to edit its properties</p>
            </div>
        `;
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        
        // Apply theme-specific styles
        const root = document.documentElement;
        switch(theme) {
            case 'dark':
                root.style.setProperty('--bg-primary', '#1f2937');
                root.style.setProperty('--text-primary', '#f9fafb');
                root.style.setProperty('--border-color', '#374151');
                break;
            case 'blue':
                root.style.setProperty('--bg-primary', '#eff6ff');
                root.style.setProperty('--text-primary', '#1e40af');
                root.style.setProperty('--border-color', '#3b82f6');
                break;
            default: // light
                root.style.setProperty('--bg-primary', '#ffffff');
                root.style.setProperty('--text-primary', '#374151');
                root.style.setProperty('--border-color', '#e5e7eb');
        }
    }

    showPreview() {
        const modal = document.getElementById('previewModal');
        const previewContainer = document.getElementById('previewContainer');
        
        // Clone canvas content for preview
        const canvas = document.getElementById('canvas');
        const clone = canvas.cloneNode(true);
        
        // Remove canvas-specific classes and styles
        clone.className = 'preview-canvas';
        clone.style.padding = '0';
        clone.style.overflow = 'visible';
        
        // Remove placeholder if exists
        const placeholder = clone.querySelector('.canvas-placeholder');
        if (placeholder) placeholder.remove();
        
        // Make components non-interactive in preview
        const components = clone.querySelectorAll('.canvas-component');
        components.forEach(comp => {
            comp.style.position = 'relative';
            comp.style.left = 'auto';
            comp.style.top = 'auto';
            comp.style.cursor = 'default';
            comp.classList.remove('selected');
        });
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(clone);
        
        modal.classList.add('active');
    }

    hidePreview() {
        const modal = document.getElementById('previewModal');
        modal.classList.remove('active');
    }

    exportApp() {
        const appData = {
            components: this.components.map(c => ({
                type: c.type,
                properties: c.properties,
                position: {
                    left: c.element.style.left,
                    top: c.element.style.top
                }
            })),
            theme: this.currentTheme,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(appData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'app-builder-export.json';
        link.click();
    }

    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
            this.components.forEach(c => c.element.remove());
            this.components = [];
            this.selectedComponent = null;
            this.showNoSelection();
            
            // Restore placeholder
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = `
                <div class="canvas-placeholder">
                    <i class="fas fa-mouse-pointer"></i>
                    <p>Drag components here to build your app</p>
                </div>
            `;
            
            this.updateHistory();
        }
    }

    updateHistory() {
        // Remove any future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state
        const currentState = this.components.map(c => ({
            type: c.type,
            properties: JSON.parse(JSON.stringify(c.properties)),
            position: {
                left: c.element.style.left,
                top: c.element.style.top
            }
        }));
        
        this.history.push(currentState);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    restoreState(state) {
        // Clear current components
        this.components.forEach(c => c.element.remove());
        this.components = [];
        this.selectedComponent = null;
        
        // Restore components from state
        state.forEach(componentState => {
            const component = this.createComponent(componentState.type);
            component.style.position = 'absolute';
            component.style.left = componentState.position.left;
            component.style.top = componentState.position.top;
            
            const componentData = {
                id: Date.now() + Math.random(),
                type: componentState.type,
                element: component,
                properties: componentState.properties
            };
            
            this.components.push(componentData);
            this.applyProperties(componentData);
            
            const canvas = document.getElementById('canvas');
            canvas.appendChild(component);
        });
        
        // Remove placeholder if components exist
        if (this.components.length > 0) {
            const placeholder = document.querySelector('.canvas-placeholder');
            if (placeholder) placeholder.remove();
        }
        
        this.showNoSelection();
    }

    // Click outside to deselect
    setupClickOutside() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.canvas-component') && 
                !e.target.closest('.properties-panel') &&
                !e.target.closest('.sidebar')) {
                if (this.selectedComponent) {
                    this.selectedComponent.classList.remove('selected');
                    this.selectedComponent = null;
                    this.showNoSelection();
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppBuilder();
    app.setupClickOutside();
    
    // Make app globally accessible for debugging
    window.appBuilder = app;
    
    console.log('App Builder initialized successfully!');
    console.log('Use Ctrl+Z to undo, Ctrl+S to export, Ctrl+P to preview');
});