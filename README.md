# App Builder

A modern, drag-and-drop visual app builder built with React, TypeScript, and Tailwind CSS. Create beautiful user interfaces without writing code!

## 🚀 Features

- **Drag & Drop Interface**: Intuitive visual design experience
- **Component Library**: Pre-built components (buttons, inputs, text, images, containers)
- **Real-time Properties Panel**: Edit component properties in real-time
- **Live Preview**: See your app in action with preview mode
- **Code Generation**: Export your design as React, HTML, or Vue code
- **Save/Load Projects**: Save your work and continue later
- **Import/Export**: Share projects with others

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React DnD** - Drag and Drop
- **Vite** - Build Tool
- **Lucide React** - Icons

## 🎯 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### Design Mode
1. **Add Components**: Drag components from the left sidebar to the canvas
2. **Select Components**: Click on any component to select it
3. **Edit Properties**: Use the right panel to modify component properties
4. **Position Components**: Drag components around the canvas or use the position controls

### Preview Mode
- Click the "Preview" button in the toolbar to see your app in action
- Switch back to "Design" mode to continue editing

### Code Generation
1. Click the "Code" button in the toolbar
2. Choose your preferred framework (React, HTML, or Vue)
3. Copy the generated code or download it as a file

### Save & Load
- **Save**: Click "Save" to store your project in local storage
- **Export**: Download your project as a JSON file
- **Import**: Load a previously exported project file

## 🎨 Available Components

### Basic Components
- **Text**: Customizable text with font size and color options
- **Button**: Various button styles and sizes
- **Image**: Add images with customizable dimensions

### Form Components
- **Input**: Text inputs with different types (text, email, password, number)
- **Checkbox**: Checkboxes with custom labels

### Layout Components
- **Container**: Flexible containers with padding and background options

## 🔧 Customization

### Adding New Components

1. **Define the Component** in `src/components/ComponentPalette.tsx`:
   ```typescript
   {
     type: 'my-component',
     name: 'My Component',
     icon: 'IconName',
     category: 'Basic',
     defaultProps: { /* default properties */ },
     propTypes: { /* property definitions */ }
   }
   ```

2. **Add Rendering Logic** in `src/components/ComponentRenderer.tsx`:
   ```typescript
   case 'my-component':
     return <div>{/* your component JSX */}</div>;
   ```

### Styling
- Tailwind CSS classes are used throughout the application
- Custom styles can be added in `src/index.css`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Known Issues

- Drag and drop may not work perfectly on touch devices
- Large projects may impact performance

## 🚧 Roadmap

- [ ] Component nesting support
- [ ] More component types (forms, navigation, etc.)
- [ ] Theme customization
- [ ] Responsive design tools
- [ ] Component templates
- [ ] Collaboration features

---

Built with ❤️ using modern web technologies.