import { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { useBuilderStore } from '../store/builderStore'
import type { DragItem } from '../types'

export function Canvas() {
  const rootId = useBuilderStore((s) => s.rootId)
  const addNode = useBuilderStore((s) => s.addNode)

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean}>(() => ({
    accept: 'BUILDER_DRAG_ITEM',
    drop: (item) => {
      if (item.dragKind === 'NEW_COMPONENT') {
        addNode(rootId, item.componentType)
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }))
  drop(canvasRef)

  return (
    <div ref={canvasRef} className={`h-full w-full overflow-auto p-4 ${isOver ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <RenderNode nodeId={rootId} />
    </div>
  )
}

function RenderNode({ nodeId }: { nodeId: string }) {
  const node = useBuilderStore((s) => s.nodes[nodeId])
  const addNode = useBuilderStore((s) => s.addNode)

  const elementRef = useRef<HTMLDivElement | null>(null)
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean}>(() => ({
    accept: 'BUILDER_DRAG_ITEM',
    drop: (item) => {
      if (item.dragKind === 'NEW_COMPONENT') {
        addNode(nodeId, item.componentType)
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  }))
  drop(elementRef)

  if (!node) return null

  const commonClass = `rounded border border-dashed border-gray-300 ${isOver ? 'bg-blue-50' : ''}`

  switch (node.type) {
    case 'container':
      return (
        <div ref={elementRef} className={`min-h-[400px] w-full p-4 ${commonClass}`}>
          <div className="grid grid-cols-1 gap-3">
            {node.children.map((cid) => (
              <RenderNode key={cid} nodeId={cid} />
            ))}
          </div>
        </div>
      )
    case 'text':
      return (
        <div className={`p-2 ${commonClass}`}>Sample Text</div>
      )
    case 'button':
      return (
        <button className="rounded bg-blue-600 px-3 py-2 text-white shadow hover:bg-blue-700">
          Button
        </button>
      )
    default:
      return null
  }
}

export default Canvas

