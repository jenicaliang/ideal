import { useState, useCallback, useEffect } from 'react'
import { Analytics } from "@vercel/analytics/react"
import Desktop from './pages/Desktop'
import BootScreen from './components/desktop/BootScreen'
import StartPage from './components/desktop/StartPage'
import MobileGate from "./components/MobileGate"
import { useIdleReset } from './hooks/useIdleReset'

const IDLE_MS = 2 * 60 * 1000 // 2 minutes

const IDEAL_STORAGE_KEYS = [
  'ideal_visitor_id',
  'ideal_visitor_photo',
  'ideal_world_selections',
  'ideal_world_values',
  'ideal_world_fears',
  'ideal_goal_option',
  'ideal_completed_world',
]

function clearIdealStorage() {
  IDEAL_STORAGE_KEYS.forEach(k => localStorage.removeItem(k))
}

function App() {
  const [started, setStarted] = useState(false)
  const [booted, setBooted] = useState(false)
  const [desktopKey, setDesktopKey] = useState(0)
  const [isMonochrome, setIsMonochrome] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [enableAudio, setEnableAudio] = useState(true)

  // Clear storage on every page load
  useEffect(() => {
    clearIdealStorage()
  }, [])

  const handleStart = useCallback(() => {
    setStarted(true)
  }, [])

  const handleIdleReset = useCallback(() => {
    clearIdealStorage()
    setStarted(false)
    setBooted(false)
    setDesktopKey(k => k + 1)
    setIsMonochrome(false)
    setShowAbout(false)
  }, [])

  // Only tick while experience is running
  useIdleReset(handleIdleReset, IDLE_MS, started)

  return (
    <MobileGate>
      <Analytics />
      {!started ? (
        <StartPage onStart={handleStart} />
      ) : !booted ? (
        <BootScreen
          onComplete={() => setBooted(true)}
          enableAudio={enableAudio}
          onToggleAudio={() => setEnableAudio(p => !p)}
          enableMonochrome={isMonochrome}
          onToggleMonochrome={() => setIsMonochrome(p => !p)}
        />
      ) : (
        <div style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          filter: isMonochrome ? 'grayscale(100%)' : 'none',
          transition: 'filter 0.5s ease',
        }}>
          <Desktop
            key={desktopKey}
            isMonochrome={isMonochrome}
            onMonochrome={() => setIsMonochrome(m => !m)}
            showAbout={showAbout}
            onAbout={() => setShowAbout(true)}
            onCloseAbout={() => setShowAbout(false)}
            enableAudio={enableAudio}
          />
        </div>
      )}
    </MobileGate>
  )
}

export default App