import { useRef } from 'react'
import { useDrag } from 'react-dnd'
import type { ComponentType, DragItemNewComponent } from '../types'

const paletteItems: { type: ComponentType; label: string }[] = [
  { type: 'container', label: 'Container' },
  { type: 'text', label: 'Text' },
  { type: 'button', label: 'Button' },
]

function PaletteItem({ type, label }: { type: ComponentType; label: string }) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BUILDER_DRAG_ITEM',
    item: { dragKind: 'NEW_COMPONENT', componentType: type } as DragItemNewComponent,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  drag(elementRef)

  return (
    <div
      ref={elementRef}
      className={`cursor-move rounded border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-gray-50 ${isDragging ? 'opacity-50' : ''}`}
    >
      {label}
    </div>
  )
}

export function Palette() {
  return (
    <div className="flex h-full flex-col gap-2 overflow-auto p-3">
      <div className="text-xs font-semibold uppercase text-gray-500">Components</div>
      {paletteItems.map((it) => (
        <PaletteItem key={it.type} type={it.type} label={it.label} />
      ))}
    </div>
  )
}

export default Palette

