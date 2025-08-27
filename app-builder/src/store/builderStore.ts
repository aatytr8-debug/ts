import { create } from 'zustand'
import type { BuilderNode, BuilderTreeState, ComponentType } from '../types'

interface BuilderStore extends BuilderTreeState {
  addNode: (parentId: string, componentType: ComponentType, index?: number) => string
  selectNode: (nodeId?: string) => void
  updateNodeProps: (nodeId: string, partialProps: Record<string, unknown>) => void
}

function createNodeId(): string {
  return 'node_' + Math.random().toString(36).slice(2, 9)
}

function createNode(type: ComponentType, props: Record<string, unknown> = {}): BuilderNode {
  return {
    id: createNodeId(),
    type,
    props,
    children: [],
  }
}

export const useBuilderStore = create<BuilderStore>((set, get) => {
  // Initialize with a root container
  const root = createNode('container', { className: 'min-h-[600px] bg-white' })

  return {
    nodes: { [root.id]: root },
    rootId: root.id,
    selectedId: undefined,

    addNode: (parentId, componentType, index) => {
      const state = get()
      const parent = state.nodes[parentId]
      if (!parent) return ''

      const newNode = createNode(componentType)
      const updatedParent: BuilderNode = {
        ...parent,
        children: (() => {
          const next = parent.children.slice()
          const insertIndex = typeof index === 'number' ? Math.max(0, Math.min(index, next.length)) : next.length
          next.splice(insertIndex, 0, newNode.id)
          return next
        })(),
      }

      set({
        nodes: {
          ...state.nodes,
          [updatedParent.id]: updatedParent,
          [newNode.id]: newNode,
        },
        selectedId: newNode.id,
      })

      return newNode.id
    },

    selectNode: (nodeId) => set({ selectedId: nodeId }),

    updateNodeProps: (nodeId, partialProps) => {
      const state = get()
      const node = state.nodes[nodeId]
      if (!node) return
      set({
        nodes: {
          ...state.nodes,
          [nodeId]: { ...node, props: { ...node.props, ...partialProps } },
        },
      })
    },
  }
})

