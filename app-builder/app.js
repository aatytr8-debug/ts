const designState = {
  items: []
};

let selectedElementId = null;
let nextNumericId = 1;

function generateElementId() {
  const id = `el_${Date.now()}_${nextNumericId}`;
  nextNumericId += 1;
  return id;
}

function queryRequiredSelector(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}

const paletteItems = () => Array.from(document.querySelectorAll('.palette-item'));
const canvasElement = () => queryRequiredSelector('#canvas');
const propertyForm = () => queryRequiredSelector('#property-form');

function initializeDragFromPalette() {
  paletteItems().forEach((item) => {
    item.addEventListener('dragstart', (event) => {
      const target = event.target;
      const type = target.getAttribute('data-component');
      event.dataTransfer.setData('text/plain', type);
      event.dataTransfer.effectAllowed = 'copy';
    });
  });
}

function initializeCanvasDrop() {
  const canvas = canvasElement();
  canvas.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  canvas.addEventListener('drop', (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('text/plain');
    if (!type) return;
    const rect = canvas.getBoundingClientRect();
    const dropX = event.clientX - rect.left;
    const dropY = event.clientY - rect.top;
    const model = createElementModel(type, Math.round(dropX), Math.round(dropY));
    designState.items.push(model);
    renderElement(model);
    setSelectedElement(model.id);
  });
}

function createElementModel(type, x, y) {
  const id = generateElementId();
  const defaults = {
    text: { width: 160, height: 48, props: { text: 'Text', fontSize: 16, color: '#ffffff' } },
    button: { width: 160, height: 44, props: { label: 'Button', bg: '#60a5fa', color: '#0b1220' } },
    image: { width: 240, height: 160, props: { src: 'https://picsum.photos/240/160', fit: 'cover', alt: 'Image' } },
    container: { width: 360, height: 240, props: { background: '#111827' } }
  };
  const base = defaults[type] || defaults.text;
  return {
    id,
    type,
    x: Math.max(0, x - Math.round(base.width / 2)),
    y: Math.max(0, y - Math.round(base.height / 2)),
    width: base.width,
    height: base.height,
    props: base.props
  };
}

function renderAll() {
  const canvas = canvasElement();
  canvas.innerHTML = '';
  designState.items.forEach(renderElement);
}

function renderElement(model) {
  const canvas = canvasElement();
  const wrapper = document.createElement('div');
  wrapper.className = 'canvas-item';
  wrapper.dataset.elementId = model.id;
  wrapper.style.left = `${model.x}px`;
  wrapper.style.top = `${model.y}px`;
  wrapper.style.width = `${model.width}px`;
  wrapper.style.height = `${model.height}px`;

  const inner = document.createElement('div');
  inner.className = 'inner';

  if (model.type === 'text') {
    inner.textContent = model.props.text;
    inner.style.fontSize = `${model.props.fontSize}px`;
    inner.style.color = model.props.color;
    inner.style.display = 'flex';
    inner.style.alignItems = 'center';
    inner.style.justifyContent = 'center';
  } else if (model.type === 'button') {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = model.props.label;
    btn.style.background = model.props.bg;
    btn.style.color = model.props.color;
    inner.appendChild(btn);
    centerInner(inner);
  } else if (model.type === 'image') {
    const img = document.createElement('img');
    img.src = model.props.src;
    img.alt = model.props.alt || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = model.props.fit || 'cover';
    inner.appendChild(img);
  } else if (model.type === 'container') {
    inner.style.background = model.props.background;
    inner.style.width = '100%';
    inner.style.height = '100%';
    inner.style.borderRadius = '6px';
  }

  wrapper.appendChild(inner);
  canvas.appendChild(wrapper);

  wrapper.addEventListener('mousedown', (event) => beginDrag(event, model.id));
  wrapper.addEventListener('click', () => setSelectedElement(model.id));
}

function centerInner(inner) {
  inner.style.display = 'flex';
  inner.style.alignItems = 'center';
  inner.style.justifyContent = 'center';
  inner.style.width = '100%';
  inner.style.height = '100%';
}

function getModelById(id) {
  return designState.items.find((it) => it.id === id) || null;
}

function setSelectedElement(id) {
  selectedElementId = id;
  const canvas = canvasElement();
  Array.from(canvas.querySelectorAll('.canvas-item')).forEach((node) => node.classList.remove('selected'));
  const node = canvas.querySelector(`[data-element-id="${id}"]`);
  if (node) node.classList.add('selected');
  renderPropertyForm();
}

function renderPropertyForm() {
  const form = propertyForm();
  const model = selectedElementId ? getModelById(selectedElementId) : null;
  if (!model) {
    form.innerHTML = '<div class="empty-props">Select an element to edit its properties</div>';
    return;
  }

  const html = [];
  html.push('<div class="field"><label>ID</label><input value="' + model.id + '" disabled></div>');
  html.push('<div class="form-row">' +
    labelledNumber('X', 'pos-x', model.x) +
    labelledNumber('Y', 'pos-y', model.y) +
  '</div>');
  html.push('<div class="form-row">' +
    labelledNumber('Width', 'size-w', model.width) +
    labelledNumber('Height', 'size-h', model.height) +
  '</div>');

  if (model.type === 'text') {
    html.push(labelledText('Text', 'text', model.props.text));
    html.push(labelledNumber('Font size', 'font-size', model.props.fontSize));
    html.push(labelledColor('Color', 'color', model.props.color));
  } else if (model.type === 'button') {
    html.push(labelledText('Label', 'label', model.props.label));
    html.push(labelledColor('Text color', 'btn-color', model.props.color));
    html.push(labelledColor('Background', 'btn-bg', model.props.bg));
  } else if (model.type === 'image') {
    html.push(labelledText('Image URL', 'src', model.props.src));
    html.push(labelledText('Alt', 'alt', model.props.alt || ''));
    html.push(labelledSelect('Fit', 'fit', model.props.fit || 'cover', [
      ['cover','cover'], ['contain','contain'], ['fill','fill'], ['none','none'], ['scale-down','scale-down']
    ]));
  } else if (model.type === 'container') {
    html.push(labelledColor('Background', 'background', model.props.background));
  }

  form.innerHTML = html.join('');
  wirePropertyFormEvents(form, model);
}

function labelledText(label, name, value) {
  return '<div class="field"><label>' + label + '</label><input type="text" name="' + name + '" value="' + escapeAttr(value) + '"></div>';
}

function labelledNumber(label, name, value) {
  return '<div class="field"><label>' + label + '</label><input type="number" name="' + name + '" value="' + Number(value) + '"></div>';
}

function labelledColor(label, name, value) {
  return '<div class="field"><label>' + label + '</label><input type="color" name="' + name + '" value="' + escapeAttr(value) + '"></div>';
}

function labelledSelect(label, name, value, options) {
  const optionsHtml = options.map(([val, text]) => '<option value="' + val + '"' + (val === value ? ' selected' : '') + '>' + text + '</option>').join('');
  return '<div class="field"><label>' + label + '</label><select name="' + name + '">' + optionsHtml + '</select></div>';
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function wirePropertyFormEvents(form, model) {
  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      applyFormChange(model, input.name, input.value);
    });
  });
}

function applyFormChange(model, name, value) {
  if (name === 'pos-x') model.x = Number(value);
  else if (name === 'pos-y') model.y = Number(value);
  else if (name === 'size-w') model.width = Math.max(1, Number(value));
  else if (name === 'size-h') model.height = Math.max(1, Number(value));
  else if (model.type === 'text' && name === 'text') model.props.text = value;
  else if (model.type === 'text' && name === 'font-size') model.props.fontSize = Number(value);
  else if (model.type === 'text' && name === 'color') model.props.color = value;
  else if (model.type === 'button' && name === 'label') model.props.label = value;
  else if (model.type === 'button' && name === 'btn-bg') model.props.bg = value;
  else if (model.type === 'button' && name === 'btn-color') model.props.color = value;
  else if (model.type === 'image' && name === 'src') model.props.src = value;
  else if (model.type === 'image' && name === 'alt') model.props.alt = value;
  else if (model.type === 'image' && name === 'fit') model.props.fit = value;
  else if (model.type === 'container' && name === 'background') model.props.background = value;
  updateRenderedElement(model.id);
}

function updateRenderedElement(id) {
  const model = getModelById(id);
  if (!model) return;
  const node = canvasElement().querySelector(`[data-element-id="${id}"]`);
  if (!node) return;
  node.style.left = `${model.x}px`;
  node.style.top = `${model.y}px`;
  node.style.width = `${model.width}px`;
  node.style.height = `${model.height}px`;
  const inner = node.querySelector('.inner');
  inner.innerHTML = '';
  if (model.type === 'text') {
    inner.textContent = model.props.text;
    inner.style.fontSize = `${model.props.fontSize}px`;
    inner.style.color = model.props.color;
    inner.style.display = 'flex';
    inner.style.alignItems = 'center';
    inner.style.justifyContent = 'center';
  } else if (model.type === 'button') {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = model.props.label;
    btn.style.background = model.props.bg;
    btn.style.color = model.props.color;
    inner.appendChild(btn);
    centerInner(inner);
  } else if (model.type === 'image') {
    const img = document.createElement('img');
    img.src = model.props.src;
    img.alt = model.props.alt || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = model.props.fit || 'cover';
    inner.appendChild(img);
  } else if (model.type === 'container') {
    inner.style.background = model.props.background;
    inner.style.width = '100%';
    inner.style.height = '100%';
    inner.style.borderRadius = '6px';
  }
}

let dragState = null;

function beginDrag(event, id) {
  if (event.button !== 0) return;
  const canvas = canvasElement();
  const node = canvas.querySelector(`[data-element-id="${id}"]`);
  if (!node) return;
  setSelectedElement(id);
  const rect = node.getBoundingClientRect();
  dragState = {
    id,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', endDrag);
}

function onDragMove(event) {
  if (!dragState) return;
  const canvas = canvasElement();
  const canvasRect = canvas.getBoundingClientRect();
  const x = event.clientX - canvasRect.left - dragState.offsetX;
  const y = event.clientY - canvasRect.top - dragState.offsetY;
  const model = getModelById(dragState.id);
  if (!model) return;
  model.x = Math.max(0, Math.round(x));
  model.y = Math.max(0, Math.round(y));
  updateRenderedElement(model.id);
  renderPropertyForm();
}

function endDrag() {
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', endDrag);
  dragState = null;
}

function saveToLocalStorage() {
  const payload = JSON.stringify(designState);
  localStorage.setItem('appBuilderDesign', payload);
}

function loadFromLocalStorage() {
  const payload = localStorage.getItem('appBuilderDesign');
  if (!payload) return;
  try {
    const parsed = JSON.parse(payload);
    designState.items = Array.isArray(parsed.items) ? parsed.items : [];
    renderAll();
    selectedElementId = null;
    renderPropertyForm();
  } catch (e) {
    alert('Failed to load saved design');
  }
}

function exportToFile() {
  const blob = new Blob([JSON.stringify(designState, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'app-builder-design.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      designState.items = Array.isArray(parsed.items) ? parsed.items : [];
      renderAll();
      selectedElementId = null;
      renderPropertyForm();
    } catch (e) {
      alert('Invalid design file');
    }
  };
  reader.readAsText(file);
}

function wireTopBarActions() {
  const saveBtn = document.querySelector('#btn-save');
  const loadBtn = document.querySelector('#btn-load');
  const exportBtn = document.querySelector('#btn-export');
  const importBtn = document.querySelector('#btn-import');
  const fileInput = document.querySelector('#file-import');
  saveBtn.addEventListener('click', saveToLocalStorage);
  loadBtn.addEventListener('click', loadFromLocalStorage);
  exportBtn.addEventListener('click', exportToFile);
  importBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (file) importFromFile(file);
    fileInput.value = '';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initializeDragFromPalette();
  initializeCanvasDrop();
  wireTopBarActions();
});

