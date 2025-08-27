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
        const component = {
            id: Date.now() + Math.random(),
            type: type,
            x: x,
            y: y,
            properties: this.getDefaultProperties(type),
            element: null
        };

        this.components.push(component);
        this.renderComponent(component);
        this.updateHistory();
        
        return component;
    }

    getDefaultProperties(type) {
        const defaults = {
            button: {
                text: 'Button',
                backgroundColor: '#4f46e5',
                textColor: '#ffffff',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '6px',
                width: 'auto',
                height: 'auto'
            },
            text: {
                content: 'Sample Text',
                fontSize: '16px',
                fontWeight: '400',
                color: '#374151',
                textAlign: 'left',
                width: 'auto'
            },
            input: {
                placeholder: 'Enter text...',
                type: 'text',
                width: '200px',
                height: '40px',
                borderColor: '#d1d5db',
                backgroundColor: '#ffffff'
            },
            image: {
                src: 'https://via.placeholder.com/200x120',
                alt: 'Sample Image',
                width: '200px',
                height: '120px',
                borderRadius: '6px'
            },
            card: {
                title: 'Card Title',
                content: 'Card content goes here...',
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                padding: '20px',
                borderRadius: '8px',
                shadow: '0 1px 3px rgba(0,0,0,0.1)'
            },
            container: {
                backgroundColor: '#f8fafc',
                borderColor: '#d1d5db',
                padding: '20px',
                borderRadius: '8px',
                width: '100%',
                height: '200px'
            }
        };

        return defaults[type] || {};
    }

    renderComponent(component) {
        const canvas = document.getElementById('canvas');
        const placeholder = canvas.querySelector('.canvas-placeholder');
        
        if (placeholder) {
            placeholder.remove();
        }

        const element = document.createElement('div');
        element.className = 'canvas-component';
        element.dataset.componentId = component.id;
        element.style.position = 'absolute';
        element.style.left = component.x + 'px';
        element.style.top = component.y + 'px';
        element.style.zIndex = this.components.length;

        // Create component content based on type
        element.innerHTML = this.createComponentHTML(component);
        
        // Add event listeners
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectComponent(component);
        });

        canvas.appendChild(element);
        component.element = element;
    }

    createComponentHTML(component) {
        const props = component.properties;
        
        switch(component.type) {
            case 'button':
                return `<button class="component-button" style="
                    background-color: ${props.backgroundColor};
                    color: ${props.textColor};
                    font-size: ${props.fontSize};
                    padding: ${props.padding};
                    border-radius: ${props.borderRadius};
                    width: ${props.width};
                    height: ${props.height};
                ">${props.text}</button>`;
                
            case 'text':
                return `<div class="component-text" style="
                    font-size: ${props.fontSize};
                    font-weight: ${props.fontWeight};
                    color: ${props.color};
                    text-align: ${props.textAlign};
                    width: ${props.width};
                ">${props.content}</div>`;
                
            case 'input':
                return `<input class="component-input" type="${props.type}" placeholder="${props.placeholder}" style="
                    width: ${props.width};
                    height: ${props.height};
                    border-color: ${props.borderColor};
                    background-color: ${props.backgroundColor};
                ">`;
                
            case 'image':
                return `<div class="component-image" style="
                    width: ${props.width};
                    height: ${props.height};
                    border-radius: ${props.borderRadius};
                ">
                    <img src="${props.src}" alt="${props.alt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${props.borderRadius};">
                </div>`;
                
            case 'card':
                return `<div class="component-card" style="
                    background-color: ${props.backgroundColor};
                    border-color: ${props.borderColor};
                    padding: ${props.padding};
                    border-radius: ${props.borderRadius};
                    box-shadow: ${props.shadow};
                ">
                    <h4 style="margin: 0 0 10px 0; color: #374151;">${props.title}</h4>
                    <p style="margin: 0; color: #6b7280;">${props.content}</p>
                </div>`;
                
            case 'container':
                return `<div class="component-container" style="
                    background-color: ${props.backgroundColor};
                    border-color: ${props.borderColor};
                    padding: ${props.padding};
                    border-radius: ${props.borderRadius};
                    width: ${props.width};
                    height: ${props.height};
                "></div>`;
                
            default:
                return `<div>Unknown Component</div>`;
        }
    }

    selectComponent(component) {
        // Deselect previous component
        if (this.selectedComponent) {
            this.selectedComponent.element.classList.remove('selected');
        }
        
        this.selectedComponent = component;
        component.element.classList.add('selected');
        
        this.showProperties(component);
    }

    showProperties(component) {
        const propertiesContent = document.getElementById('propertiesContent');
        propertiesContent.innerHTML = this.createPropertiesHTML(component);
        
        // Add event listeners to property inputs
        this.setupPropertyListeners(component);
    }

    createPropertiesHTML(component) {
        const props = component.properties;
        let html = `<h4 style="margin-bottom: 1rem; color: #374151;">${component.type.charAt(0).toUpperCase() + component.type.slice(1)} Properties</h4>`;
        
        switch(component.type) {
            case 'button':
                html += `
                    <div class="property-group">
                        <label>Button Text</label>
                        <input type="text" id="buttonText" value="${props.text}">
                    </div>
                    <div class="property-group">
                        <label>Background Color</label>
                        <input type="color" id="buttonBgColor" value="${props.backgroundColor}">
                    </div>
                    <div class="property-group">
                        <label>Text Color</label>
                        <input type="color" id="buttonTextColor" value="${props.textColor}">
                    </div>
                    <div class="property-group">
                        <label>Font Size</label>
                        <select id="buttonFontSize">
                            <option value="12px" ${props.fontSize === '12px' ? 'selected' : ''}>12px</option>
                            <option value="14px" ${props.fontSize === '14px' ? 'selected' : ''}>14px</option>
                            <option value="16px" ${props.fontSize === '16px' ? 'selected' : ''}>16px</option>
                            <option value="18px" ${props.fontSize === '18px' ? 'selected' : ''}>18px</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Padding</label>
                        <select id="buttonPadding">
                            <option value="8px 16px" ${props.padding === '8px 16px' ? 'selected' : ''}>Small</option>
                            <option value="12px 24px" ${props.padding === '12px 24px' ? 'selected' : ''}>Medium</option>
                            <option value="16px 32px" ${props.padding === '16px 32px' ? 'selected' : ''}>Large</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'text':
                html += `
                    <div class="property-group">
                        <label>Content</label>
                        <textarea id="textContent" rows="3">${props.content}</textarea>
                    </div>
                    <div class="property-group">
                        <label>Font Size</label>
                        <select id="textFontSize">
                            <option value="12px" ${props.fontSize === '12px' ? 'selected' : ''}>12px</option>
                            <option value="14px" ${props.fontSize === '14px' ? 'selected' : ''}>14px</option>
                            <option value="16px" ${props.fontSize === '16px' ? 'selected' : ''}>16px</option>
                            <option value="18px" ${props.fontSize === '18px' ? 'selected' : ''}>18px</option>
                            <option value="24px" ${props.fontSize === '24px' ? 'selected' : ''}>24px</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Font Weight</label>
                        <select id="textFontWeight">
                            <option value="400" ${props.fontWeight === '400' ? 'selected' : ''}>Normal</option>
                            <option value="500" ${props.fontWeight === '500' ? 'selected' : ''}>Medium</option>
                            <option value="600" ${props.fontWeight === '600' ? 'selected' : ''}>Semi Bold</option>
                            <option value="700" ${props.fontWeight === '700' ? 'selected' : ''}>Bold</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Text Color</label>
                        <input type="color" id="textColor" value="${props.color}">
                    </div>
                    <div class="property-group">
                        <label>Text Align</label>
                        <select id="textAlign">
                            <option value="left" ${props.textAlign === 'left' ? 'selected' : ''}>Left</option>
                            <option value="center" ${props.textAlign === 'center' ? 'selected' : ''}>Center</option>
                            <option value="right" ${props.textAlign === 'right' ? 'selected' : ''}>Right</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'input':
                html += `
                    <div class="property-group">
                        <label>Placeholder</label>
                        <input type="text" id="inputPlaceholder" value="${props.placeholder}">
                    </div>
                    <div class="property-group">
                        <label>Input Type</label>
                        <select id="inputType">
                            <option value="text" ${props.type === 'text' ? 'selected' : ''}>Text</option>
                            <option value="email" ${props.type === 'email' ? 'selected' : ''}>Email</option>
                            <option value="password" ${props.type === 'password' ? 'selected' : ''}>Password</option>
                            <option value="number" ${props.type === 'number' ? 'selected' : ''}>Number</option>
                        </select>
                    </div>
                    <div class="property-group">
                        <label>Width</label>
                        <input type="text" id="inputWidth" value="${props.width}">
                    </div>
                    <div class="property-group">
                        <label>Height</label>
                        <input type="text" id="inputHeight" value="${props.height}">
                    </div>
                    <div class="property-group">
                        <label>Border Color</label>
                        <input type="color" id="inputBorderColor" value="${props.borderColor}">
                    </div>
                `;
                break;
                
            case 'image':
                html += `
                    <div class="property-group">
                        <label>Image URL</label>
                        <input type="text" id="imageSrc" value="${props.src}">
                    </div>
                    <div class="property-group">
                        <label>Alt Text</label>
                        <input type="text" id="imageAlt" value="${props.alt}">
                    </div>
                    <div class="property-group">
                        <label>Width</label>
                        <input type="text" id="imageWidth" value="${props.width}">
                    </div>
                    <div class="property-group">
                        <label>Height</label>
                        <input type="text" id="imageHeight" value="${props.height}">
                    </div>
                    <div class="property-group">
                        <label>Border Radius</label>
                        <input type="text" id="imageBorderRadius" value="${props.borderRadius}">
                    </div>
                `;
                break;
                
            case 'card':
                html += `
                    <div class="property-group">
                        <label>Title</label>
                        <input type="text" id="cardTitle" value="${props.title}">
                    </div>
                    <div class="property-group">
                        <label>Content</label>
                        <textarea id="cardContent" rows="3">${props.content}</textarea>
                    </div>
                    <div class="property-group">
                        <label>Background Color</label>
                        <input type="color" id="cardBgColor" value="${props.backgroundColor}">
                    </div>
                    <div class="property-group">
                        <label>Border Color</label>
                        <input type="color" id="cardBorderColor" value="${props.borderColor}">
                    </div>
                    <div class="property-group">
                        <label>Padding</label>
                        <input type="text" id="cardPadding" value="${props.padding}">
                    </div>
                `;
                break;
                
            case 'container':
                html += `
                    <div class="property-group">
                        <label>Background Color</label>
                        <input type="color" id="containerBgColor" value="${props.backgroundColor}">
                    </div>
                    <div class="property-group">
                        <label>Border Color</label>
                        <input type="color" id="containerBorderColor" value="${props.borderColor}">
                    </div>
                    <div class="property-group">
                        <label>Padding</label>
                        <input type="text" id="containerPadding" value="${props.padding}">
                    </div>
                    <div class="property-group">
                        <label>Width</label>
                        <input type="text" id="containerWidth" value="${props.width}">
                    </div>
                    <div class="property-group">
                        <label>Height</label>
                        <input type="text" id="containerHeight" value="${props.height}">
                    </div>
                `;
                break;
        }
        
        return html;
    }

    setupPropertyListeners(component) {
        const props = component.properties;
        
        switch(component.type) {
            case 'button':
                document.getElementById('buttonText').addEventListener('input', (e) => {
                    props.text = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('buttonBgColor').addEventListener('input', (e) => {
                    props.backgroundColor = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('buttonTextColor').addEventListener('input', (e) => {
                    props.textColor = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('buttonFontSize').addEventListener('change', (e) => {
                    props.fontSize = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('buttonPadding').addEventListener('change', (e) => {
                    props.padding = e.target.value;
                    this.updateComponent(component);
                });
                break;
                
            case 'text':
                document.getElementById('textContent').addEventListener('input', (e) => {
                    props.content = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('textFontSize').addEventListener('change', (e) => {
                    props.fontSize = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('textFontWeight').addEventListener('change', (e) => {
                    props.fontWeight = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('textColor').addEventListener('input', (e) => {
                    props.color = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('textAlign').addEventListener('change', (e) => {
                    props.textAlign = e.target.value;
                    this.updateComponent(component);
                });
                break;
                
            case 'input':
                document.getElementById('inputPlaceholder').addEventListener('input', (e) => {
                    props.placeholder = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('inputType').addEventListener('change', (e) => {
                    props.type = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('inputWidth').addEventListener('input', (e) => {
                    props.width = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('inputHeight').addEventListener('input', (e) => {
                    props.height = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('inputBorderColor').addEventListener('input', (e) => {
                    props.borderColor = e.target.value;
                    this.updateComponent(component);
                });
                break;
                
            case 'image':
                document.getElementById('imageSrc').addEventListener('input', (e) => {
                    props.src = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('imageAlt').addEventListener('input', (e) => {
                    props.alt = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('imageWidth').addEventListener('input', (e) => {
                    props.width = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('imageHeight').addEventListener('input', (e) => {
                    props.height = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('imageBorderRadius').addEventListener('input', (e) => {
                    props.borderRadius = e.target.value;
                    this.updateComponent(component);
                });
                break;
                
            case 'card':
                document.getElementById('cardTitle').addEventListener('input', (e) => {
                    props.title = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('cardContent').addEventListener('input', (e) => {
                    props.content = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('cardBgColor').addEventListener('input', (e) => {
                    props.backgroundColor = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('cardBorderColor').addEventListener('input', (e) => {
                    props.borderColor = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('cardPadding').addEventListener('input', (e) => {
                    props.padding = e.target.value;
                    this.updateComponent(component);
                });
                break;
                
            case 'container':
                document.getElementById('containerBgColor').addEventListener('input', (e) => {
                    props.backgroundColor = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('containerBorderColor').addEventListener('input', (e) => {
                    props.borderColor = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('containerPadding').addEventListener('input', (e) => {
                    props.padding = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('containerWidth').addEventListener('input', (e) => {
                    props.width = e.target.value;
                    this.updateComponent(component);
                });
                document.getElementById('containerHeight').addEventListener('input', (e) => {
                    props.height = e.target.value;
                    this.updateComponent(component);
                });
                break;
        }
    }

    updateComponent(component) {
        if (component.element) {
            component.element.innerHTML = this.createComponentHTML(component);
        }
        this.updateHistory();
    }

    deleteComponent(component) {
        const index = this.components.indexOf(component);
        if (index > -1) {
            this.components.splice(index, 1);
            if (component.element) {
                component.element.remove();
            }
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

    clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
            this.components.forEach(component => {
                if (component.element) {
                    component.element.remove();
                }
            });
            this.components = [];
            this.selectedComponent = null;
            this.showNoSelection();
            this.updateHistory();
            
            // Show placeholder
            const canvas = document.getElementById('canvas');
            const placeholder = document.createElement('div');
            placeholder.className = 'canvas-placeholder';
            placeholder.innerHTML = `
                <i class="fas fa-mouse-pointer"></i>
                <p>Drag components here to build your app</p>
            `;
            canvas.appendChild(placeholder);
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        
        // Apply theme-specific styles
        const root = document.documentElement;
        switch(theme) {
            case 'dark':
                root.style.setProperty('--bg-color', '#1f2937');
                root.style.setProperty('--text-color', '#f9fafb');
                root.style.setProperty('--border-color', '#374151');
                break;
            case 'blue':
                root.style.setProperty('--bg-color', '#eff6ff');
                root.style.setProperty('--text-color', '#1e40af');
                root.style.setProperty('--border-color', '#3b82f6');
                break;
            default: // light
                root.style.setProperty('--bg-color', '#f5f7fa');
                root.style.setProperty('--text-color', '#333');
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
        const components = clone.querySelectorAll('.canvas-component');
        components.forEach(comp => {
            comp.classList.remove('canvas-component', 'selected');
            comp.style.position = 'relative';
            comp.style.left = 'auto';
            comp.style.top = 'auto';
            comp.style.zIndex = 'auto';
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
            components: this.components,
            theme: this.currentTheme,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(appData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `app-builder-${Date.now()}.json`;
        link.click();
    }

    updateHistory() {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state
        const currentState = JSON.parse(JSON.stringify(this.components));
        this.history.push(currentState);
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const previousState = this.history[this.historyIndex];
            
            // Clear current components
            this.components.forEach(component => {
                if (component.element) {
                    component.element.remove();
                }
            });
            
            // Restore previous state
            this.components = JSON.parse(JSON.stringify(previousState));
            this.components.forEach(component => {
                this.renderComponent(component);
            });
            
            // Clear selection
            this.selectedComponent = null;
            this.showNoSelection();
        }
    }

    // Make components draggable within canvas
    makeComponentsDraggable() {
        this.components.forEach(component => {
            if (component.element && !component.element.dataset.draggable) {
                component.element.dataset.draggable = 'true';
                component.element.style.cursor = 'move';
                
                let isDragging = false;
                let startX, startY, startLeft, startTop;
                
                component.element.addEventListener('mousedown', (e) => {
                    if (e.target.closest('.component-button, .component-input')) return;
                    
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    startLeft = parseInt(component.element.style.left) || 0;
                    startTop = parseInt(component.element.style.top) || 0;
                    
                    component.element.style.zIndex = '1000';
                    component.element.classList.add('dragging');
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    component.element.style.left = (startLeft + deltaX) + 'px';
                    component.element.style.top = (startTop + deltaY) + 'px';
                    
                    component.x = startLeft + deltaX;
                    component.y = startTop + deltaY;
                });
                
                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        component.element.style.zIndex = this.components.indexOf(component);
                        component.element.classList.remove('dragging');
                        this.updateHistory();
                    }
                });
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppBuilder();
    
    // Make components draggable after a short delay
    setTimeout(() => {
        app.makeComponentsDraggable();
    }, 1000);
    
    // Click outside to deselect
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.canvas-component') && !e.target.closest('.properties-panel')) {
            if (app.selectedComponent) {
                app.selectedComponent.element.classList.remove('selected');
                app.selectedComponent = null;
                app.showNoSelection();
            }
        }
    });
});