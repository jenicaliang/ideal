import { useState, useRef, useCallback } from 'react'
import MitosisLoader from '../ideal/MitosisLoader'
import LoginPage from '../ideal/LoginPage'

export default function IdealWindow({ onMinimize, onClose, onReachUncertainty, isMinimized }) {
  const [pos, setPos] = useState(null)
  const [phase, setPhase] = useState('mitosis')
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  const dragOffset = useRef(null)
  const onMouseMoveRef = useRef(null)
  const onMouseUpRef = useRef(null)

  const onMouseUp = useCallback(() => {
    dragOffset.current = null
    window.removeEventListener('mousemove', onMouseMoveRef.current)
    window.removeEventListener('mouseup', onMouseUpRef.current)
  }, [])

  const onMouseMove = useCallback((e) => {
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    })
  }, [])

  onMouseMoveRef.current = onMouseMove
  onMouseUpRef.current = onMouseUp

  const onMouseDown = useCallback((e) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    window.addEventListener('mousemove', onMouseMoveRef.current)
    window.addEventListener('mouseup', onMouseUpRef.current)
  }, [])

  const positionStyle = pos
    ? { position: 'fixed', left: pos.x, top: pos.y }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

  const handleCloseConfirm = () => {
    setShowCloseWarning(false)
    onClose()
  }

  return (
    <>
      {/* Window */}
      <div style={{
        ...positionStyle,
        width: '70vw',
        height: '80vh',
        zIndex: 500,
        display: isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
        border: '2px solid var(--teal-bright)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        userSelect: 'none',
      }}>

        {/* Title bar */}
        <div
          onMouseDown={onMouseDown}
          style={{
            backgroundColor: 'var(--teal-deep)',
            borderBottom: '2px solid var(--teal-bright)',
            padding: 'clamp(4px, 0.52vw, 9px) clamp(8px, 0.94vw, 16px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'grab',
            flexShrink: 0,
          }}
        >
          <span style={{
            color: 'var(--teal-bright)',
            fontFamily: 'Arial Narrow, Arial, sans-serif',
            fontSize: 'clamp(12px, 0.9vw, 18px)',
            fontWeight: '700',
            letterSpacing: '0.1em',
          }}>
            IDEAL_LAUNCHER
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
            <button
              onClick={onMinimize}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--teal-bright)',
                cursor: 'pointer',
                fontSize: 'clamp(12px, 0.9vw, 18px)',
                fontWeight: '700',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              _
            </button>
            <button
              onClick={() => setShowCloseWarning(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--yellow)',
                cursor: 'pointer',
                fontSize: 'clamp(12px, 0.9vw, 18px)',
                fontWeight: '700',
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              X
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{
          flex: 1,
          backgroundColor: 'var(--bg, #f5f3ef)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {phase === 'mitosis' && (
            <MitosisLoader onDone={() => setPhase('login')} />
          )}
          {phase === 'login' && (
  <LoginPage
    onComplete={() => {
      onReachUncertainty()
      setPhase('uncertainty')
    }}
    onCancel={() => setShowCloseWarning(true)}
  />
)}
          {phase === 'uncertainty' && (
            <div style={{ color: '#1e1e1e', padding: '2rem' }}>
              UNCERTAINTY — coming soon
            </div>
          )}
        </div>
      </div>

      {/* Close warning modal */}
      {showCloseWarning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.85)',
        }}>
          <div style={{
            width: 'clamp(300px, 34.7vw, 560px)',
            backgroundColor: 'var(--black)',
            border: '2px solid var(--teal-bright)',
            padding: 'clamp(20px, 2.78vw, 44px)',
            textAlign: 'center',
          }}>
            <p style={{
              color: 'var(--white)',
              fontFamily: 'Arial Narrow, Arial, sans-serif',
              fontSize: 'clamp(16px, 1.75vw, 32px)',
              fontWeight: '700',
              letterSpacing: '0.05em',
              marginBottom: 'clamp(10px, 1.39vw, 22px)',
            }}>
              Are you sure?
            </p>
            <p style={{
              color: 'var(--grey-light)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(15px, 1.2vw, 24px)',
              lineHeight: '1.8',
              marginBottom: 'clamp(18px, 2.43vw, 40px)',
            }}>
              If you close IDEAL now, your progress will be lost and the experience will have to be restarted.
            </p>
            <div style={{ display: 'flex', gap: 'clamp(6px, 0.69vw, 12px)' }}>
              <button
                onClick={() => setShowCloseWarning(false)}
                style={{
                  flex: 1,
                  padding: 'clamp(6px, 0.69vw, 12px)',
                  fontFamily: 'Arial Narrow, Arial, sans-serif',
                  fontSize: 'clamp(16px, 1.5vw, 32px)',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  border: '1px solid var(--teal-bright)',
                  backgroundColor: 'var(--black)',
                  color: 'var(--grey-light)',
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleCloseConfirm}
                style={{
                  flex: 1,
                  padding: 'clamp(6px, 0.69vw, 12px)',
                  fontFamily: 'Arial Narrow, Arial, sans-serif',
                  fontSize: 'clamp(16px, 1.5vw, 32px)',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  border: '1px solid var(--teal-bright)',
                  backgroundColor: 'var(--teal-deep)',
                  color: 'var(--teal-bright)',
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}