import { useState } from 'react'
import Desktop from './pages/Desktop'
import BootScreen from './components/desktop/BootScreen'

function App() {
  const [phase, setPhase] = useState('desktop')
  const [isMonochrome, setIsMonochrome] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [booted, setBooted] = useState(false)
const [enableAudio, setEnableAudio] = useState(true)

if (!booted) return (
  <BootScreen
    onComplete={() => setBooted(true)}
    enableAudio={enableAudio}
    onToggleAudio={() => setEnableAudio(p => !p)}
    enableMonochrome={isMonochrome}
    onToggleMonochrome={() => setIsMonochrome(p => !p)}
  />
)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      filter: isMonochrome ? 'grayscale(100%)' : 'none',
      transition: 'filter 0.5s ease',
    }}>
      {phase === 'desktop' && (
        <Desktop
          onLaunchIdeal={() => setPhase('ideal')}
          isMonochrome={isMonochrome}
          onMonochrome={() => setIsMonochrome(m => !m)}
          showAbout={showAbout}
          onAbout={() => setShowAbout(true)}
          onCloseAbout={() => setShowAbout(false)}
          enableAudio={enableAudio}
        />
      )}
      {phase === 'ideal' && <div>IDEAL coming soon</div>}
    </div>
  )
}

export default App