# App Builder 🚀

A modern, drag-and-drop web application builder that allows you to create beautiful apps without writing code. Built with vanilla JavaScript, HTML5, and CSS3.

## ✨ Features

- **Drag & Drop Interface**: Intuitive component placement
- **Rich Component Library**: Buttons, text, inputs, images, cards, and containers
- **Real-time Property Editing**: Customize components on the fly
- **Multiple Themes**: Light, dark, and blue themes
- **Live Preview**: See your app as you build it
- **Export Functionality**: Save your app configurations
- **Undo/Redo**: Full history management
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Shortcuts**: Power user features

## 🎯 Components Available

- **Button**: Customizable buttons with colors, text, and styling
- **Text**: Rich text elements with font controls
- **Input**: Form inputs with various types and styling
- **Image**: Image placeholders with URL support
- **Card**: Content cards with titles and descriptions
- **Container**: Layout containers for organizing components

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

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

### Alternative: Production Server

For a production-like experience:

```bash
npm start
```

## 🎨 How to Use

### Building Your App

1. **Drag Components**: From the left sidebar, drag components onto the canvas
2. **Position Components**: Drop components where you want them
3. **Select Components**: Click on any component to select it
4. **Edit Properties**: Use the right panel to customize component properties
5. **Preview**: Click the "Preview" button to see your app in action
6. **Export**: Save your app configuration using the "Export" button

### Component Properties

Each component type has specific properties you can customize:

- **Button**: Text, colors, font size, padding, border radius
- **Text**: Content, font size, color, weight, alignment
- **Input**: Placeholder, type, dimensions, border color
- **Image**: URL, alt text, dimensions
- **Card**: Title, content, colors, padding
- **Container**: Background, border, padding, dimensions

### Keyboard Shortcuts

- `Ctrl+Z` (or `Cmd+Z` on Mac): Undo last action
- `Ctrl+S` (or `Cmd+S` on Mac): Export app
- `Ctrl+P` (or `Cmd+P` on Mac): Show preview
- `Delete`: Delete selected component

## 🛠️ Development

### Project Structure

```
app-builder/
├── index.html          # Main HTML file
├── style.css           # Styles and themes
├── script.js           # Main application logic
├── server.js           # Express server
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

### Available Scripts

- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm start`: Start Express server

### Customization

#### Adding New Components

1. Add component HTML to the sidebar in `index.html`
2. Add component creation logic in `script.js` (`createComponent` method)
3. Add default properties in `getDefaultProperties` method
4. Add property controls in `showProperties` method
5. Add property application in `applyProperties` method

#### Adding New Themes

1. Add theme option to the sidebar in `index.html`
2. Add theme styles in `style.css`
3. Update theme switching logic in `script.js`

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📱 Responsive Design

The app builder is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔧 Troubleshooting

### Common Issues

1. **Components not dragging**: Ensure JavaScript is enabled
2. **Properties not updating**: Check browser console for errors
3. **Server not starting**: Verify Node.js version and dependencies

### Debug Mode

Open browser console and access the global `appBuilder` object for debugging:

```javascript
// View all components
console.log(appBuilder.components);

// Check current theme
console.log(appBuilder.currentTheme);

// View history
console.log(appBuilder.history);
```

## 🚀 Deployment

### Static Hosting

1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure your server to serve `index.html` for all routes

### Server Deployment

1. Install production dependencies: `npm install --production`
2. Start the server: `npm start`
3. Use a process manager like PM2 for production

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
- Vanilla JavaScript for performance and simplicity

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Open an issue on GitHub
4. Check the documentation

---

**Happy Building! 🎉**

Create amazing apps with the power of drag and drop!