import { useState } from 'react'
import { MODES, DEFAULT_MODE } from './config.js'
import Calculator from './Calculator.jsx'

export default function App() {
  const [modeKey, setModeKey] = useState(DEFAULT_MODE)

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-moxie-accent/30 px-3 py-1">
              <span className="text-moxie font-extrabold italic text-lg tracking-tight">Moxie</span>
            </span>
            <span className="hidden sm:inline text-sm text-gray-500">Order Calculator</span>
          </div>

          {/* Retail / Wholesale switcher */}
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {Object.entries(MODES).map(([key, mode]) => {
              const active = key === modeKey
              return (
                <button
                  key={key}
                  onClick={() => setModeKey(key)}
                  className={
                    'px-4 py-1.5 rounded-full text-sm font-semibold transition ' +
                    (active
                      ? 'bg-moxie text-white shadow'
                      : 'text-gray-600 hover:text-moxie')
                  }
                >
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Body — re-mounts on mode change so quantities reset cleanly */}
      <main className="flex-1">
        <Calculator key={modeKey} mode={MODES[modeKey]} />
      </main>

      <footer className="text-center text-xs text-gray-400 py-6">
        Moxie Order Calculator · prices for guidance only
      </footer>
    </div>
  )
}
