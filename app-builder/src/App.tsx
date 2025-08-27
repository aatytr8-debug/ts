import { Palette } from './components/Palette'
import { Canvas } from './components/Canvas'

function App() {
  return (
    <div className="h-full w-full">
      <div className="flex h-full">
        <aside className="w-64 border-r bg-white">
          <div className="border-b p-3 text-sm font-semibold">Palette</div>
          <Palette />
        </aside>
        <main className="flex-1">
          <div className="border-b p-3 text-sm font-semibold">Canvas</div>
          <Canvas />
        </main>
      </div>
    </div>
  )
}

export default App
