# App Builder

A lightweight, static, drag-and-drop app/page builder. Build simple layouts by dragging components onto the canvas and editing their properties.

## Features

- Drag components (Text, Button, Image, Container) from palette to canvas
- Move elements on canvas by dragging
- Edit properties in the side panel
- Save to browser storage and load later
- Export/import designs as JSON files

## Getting Started

Open `index.html` in a browser, or serve the directory with any static server.

Example with Python:

```bash
cd app-builder
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Notes

- Designs are stored as JSON: element type, position, size, and type-specific properties.
- This is a minimal starter and not a full WYSIWYG editor.

