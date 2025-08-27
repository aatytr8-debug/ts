export type ComponentType = 'container' | 'text' | 'button'

export interface BuilderNode {
  id: string
  type: ComponentType
  props: Record<string, unknown>
  children: string[]
}

export interface BuilderTreeState {
  nodes: Record<string, BuilderNode>
  rootId: string
  selectedId?: string
}

export type DragItemNewComponent = {
  dragKind: 'NEW_COMPONENT'
  componentType: ComponentType
}

export type DragItemExistingNode = {
  dragKind: 'EXISTING_NODE'
  nodeId: string
}

export type DragItem = DragItemNewComponent | DragItemExistingNode

