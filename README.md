# 🚀 App Builder - Create Amazing Apps

A modern, drag-and-drop web application builder that allows you to create beautiful apps without writing code. Built with vanilla JavaScript, HTML5, and CSS3.

## ✨ Features

- **🎯 Drag & Drop Interface**: Intuitive component placement with visual feedback
- **🔧 Component Library**: Pre-built components including buttons, text, inputs, images, cards, and containers
- **🎨 Real-time Properties Panel**: Customize component appearance and behavior on the fly
- **🌓 Multiple Themes**: Light, dark, and blue theme options
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Export Functionality**: Save your app configurations as JSON files
- **👁️ Live Preview**: See your app in action before finalizing
- **↩️ Undo/Redo**: Full history management with keyboard shortcuts
- **⌨️ Keyboard Shortcuts**: Power user features for faster workflow

## 🛠️ Components Available

- **Button**: Customizable buttons with colors, text, and sizing options
- **Text**: Rich text elements with font controls and alignment
- **Input**: Form inputs with various types and styling
- **Image**: Image components with URL, alt text, and sizing controls
- **Card**: Information cards with title, content, and styling
- **Container**: Layout containers for organizing other components

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd app-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Alternative: Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🎯 How to Use

### Building Your App

1. **Drag Components**: From the left sidebar, drag components onto the canvas
2. **Position Elements**: Click and drag components to position them exactly where you want
3. **Customize Properties**: Select any component to edit its properties in the right panel
4. **Preview**: Click the "Preview" button to see your app in action
5. **Export**: Save your app configuration for later use

### Keyboard Shortcuts

- `Ctrl/Cmd + Z`: Undo last action
- `Ctrl/Cmd + S`: Export app configuration
- `Ctrl/Cmd + P`: Show preview
- `Delete`: Delete selected component

### Component Customization

Each component type has specific properties you can customize:

- **Colors**: Background, text, and border colors
- **Typography**: Font size, weight, and alignment
- **Layout**: Width, height, padding, and positioning
- **Content**: Text, placeholders, and image URLs

## 🏗️ Project Structure

```
app-builder/
├── index.html          # Main HTML file
├── style.css           # Comprehensive CSS styles
├── script.js           # Main JavaScript application
├── server.js           # Express server for production
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with Vite
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm start`: Start production server

### Adding New Components

To add a new component type:

1. Add the component to the sidebar in `index.html`
2. Define default properties in `getDefaultProperties()`
3. Create rendering logic in `createComponentHTML()`
4. Add property controls in `createPropertiesHTML()`
5. Set up event listeners in `setupPropertyListeners()`

### Styling

The application uses CSS custom properties for theming and a modular CSS architecture. All styles are contained in `style.css` with clear organization and comments.

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📱 Responsive Design

The app builder is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Font Awesome for icons
- Modern CSS techniques and best practices
- Vanilla JavaScript ES6+ features
- HTML5 Drag and Drop API

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure all dependencies are properly installed
3. Verify Node.js version compatibility
4. Open an issue on the repository

## 🔮 Future Enhancements

- Component templates and presets
- Advanced layout grids and flexbox controls
- Animation and transition effects
- Component library extensions
- Cloud storage and sharing
- Real-time collaboration
- Mobile app export capabilities

---

**Happy Building! 🎉**

Create amazing apps with the power of drag and drop. No coding required!