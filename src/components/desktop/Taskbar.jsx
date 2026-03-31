import { useState, useEffect } from 'react'

export default function Taskbar({ onMonochrome, isMonochrome, onAbout, idealActive, onRestoreIdeal, needsActive, onRestoreNeeds, toolsActive, onRestoreTools, folderActive, onRestoreFolder, worldActive, onRestoreWorld }) {
  const [time, setTime] = useState('')
  const [hovering, setHovering] = useState(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const iconBtnStyle = () => ({
    background: 'none',
    border: 'none',
    color: 'var(--teal-deep)',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    fontSize: 'clamp(12px, 0.9vw, 18px)',
    padding: '0 1vw',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    whiteSpace: 'nowrap',
  })

  const taskbarBtnStyle = (color) => ({
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: `1px solid ${color}`,
    color: color,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    fontSize: 'clamp(12px, 0.9vw, 18px)',
    fontWeight: '700',
    letterSpacing: '0.08em',
    padding: '2px 1.39vw',
    height: '2.5vh',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  })

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: '3.3vh',
      backgroundColor: 'var(--teal-deep)',
      borderTop: '2px solid var(--teal-bright)',
      zIndex: 20,
      width: '80vw',
      display: 'flex',
      alignItems: 'stretch',
    }}>

      {/* About */}
      <button
        onClick={onAbout}
        style={{
          backgroundColor: 'var(--magenta)',
          border: 'none',
          borderRight: 'none',
          borderRadius: '0 12px 12px 0',
          color: 'var(--yellow)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(16px, 1.5vw, 32px)',
          fontWeight: '700',
          letterSpacing: '0.08em',
          padding: '0 1.39vw 0 0.78vw',
          cursor: 'pointer',
          height: '100%',
          flexShrink: 0,
        }}
      >
        ABOUT
      </button>

      {/* Center — window slots */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.625vw',
        gap: '0.5vw',
      }}>
        {idealActive && (
          <div
            onClick={onRestoreIdeal}
            style={taskbarBtnStyle('var(--teal-bright)')}
          >
            IDEAL_LAUNCHER
          </div>
        )}
        {folderActive && (
          <div
            onClick={onRestoreFolder}
            style={taskbarBtnStyle('var(--teal-bright)')}
          >
            YOUR_IDEAL_LIFE
          </div>
        )}
        {needsActive && (
          <div
            onClick={onRestoreNeeds}
            style={taskbarBtnStyle('var(--magenta)')}
          >
            MASLOWS_NEEDS
          </div>
        )}
        {toolsActive && (
          <div onClick={onRestoreTools} style={taskbarBtnStyle('var(--magenta)')}>
            PRECEDENTS
          </div>
        )}
        {worldActive && (
          <div onClick={onRestoreWorld} style={taskbarBtnStyle('var(--magenta)')}>
            YOU_N_WRLD
          </div>
        )}
      </div>

      {/* Right — system tray area */}
      <div style={{
        backgroundColor: 'var(--teal-bright)',
        display: 'flex',
        alignItems: 'stretch',
        flexShrink: 0,
      }}>
        {/* Restart */}
        <div
          onClick={() => window.location.reload()}
          onMouseEnter={() => setHovering('restart')}
          onMouseLeave={() => setHovering(null)}
          style={iconBtnStyle()}
        >
          ⏻
          {hovering === 'restart' && (
            <div style={{
              position: 'absolute',
              bottom: '3.75vh',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--black)',
              color: 'var(--teal-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(12px, 1vw, 18px)',
              padding: 'clamp(2px, 0.26vw, 5px) clamp(4px, 0.52vw, 9px)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '2px solid var(--teal-deep)',
            }}>
              RESTART
            </div>
          )}
        </div>

        {/* Mono */}
        <div
          onClick={onMonochrome}
          onMouseEnter={() => setHovering('mono')}
          onMouseLeave={() => setHovering(null)}
          style={iconBtnStyle()}
        >
          ◑
          {hovering === 'mono' && (
            <div style={{
              position: 'absolute',
              bottom: '3.75vh',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--black)',
              color: 'var(--teal-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(12px, 1vw, 18px)',
              padding: 'clamp(2px, 0.26vw, 5px) clamp(4px, 0.52vw, 9px)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '2px solid var(--teal-deep)',
            }}>
              {isMonochrome ? 'COLOR MODE' : 'B/W MODE'}
            </div>
          )}
        </div>

        {/* Time */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 0.78vw',
          color: 'var(--teal-deep)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 1vw, 18px)',
          fontWeight: '700',
        }}>
          {time}
        </div>
      </div>
    </div>
  )
}