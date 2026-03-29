import { useState, useRef, useCallback } from 'react'

export default function StickyNote({ title, items, error, initialX = 0.3, initialY = 0.25, fontSize = 'clamp(15px, 1.2vw, 24px)', zIndex = 20, onFocus }) {
  const [pos, setPos] = useState({ 
    x: initialX * window.innerWidth, 
    y: initialY * window.innerHeight 
  })
  const [flash, setFlash] = useState(false)
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
    if (onFocus) onFocus()
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    window.addEventListener('mousemove', onMouseMoveRef.current)
    window.addEventListener('mouseup', onMouseUpRef.current)
  }, [pos, onFocus])

  const onClose = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 2000)
  }

  return (
    <div style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: 'auto',
      backgroundColor: 'var(--yellow)',
      border: '2px solid var(--teal-deep)',
      zIndex: zIndex,
      boxShadow: '0px 3px 8px var(--teal-deep)',
      userSelect: 'none',
    }}>
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          backgroundColor: 'var(--teal-deep)',
          padding: 'clamp(3px, 0.5vw, 7px) clamp(10px, 1vw, 24px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
        }}
      >
        <span style={{
          color: 'var(--teal-bright)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(16px, 1.5vw, 32px)',
          fontWeight: '700',
          letterSpacing: '0.05em',
        }}>
          {title}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--yellow)',
            cursor: 'pointer',
            fontSize: 'clamp(16px, 1.5vw, 32px)',
            padding: '0 2px',
          }}
        >
          X
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(10px, 1.3vw, 22px) clamp(12px, 1.48vw, 24px)' }}>
        {items.map((item, i) => (
          item === ''
            ? <div key={i} style={{ height: '1.875vh' }} />
            : <div key={i} style={{
                fontFamily: 'var(--font-os)',
                fontSize: fontSize,
                lineHeight: '1.2',
                color: 'var(--black)',
                marginBottom: 'clamp(2px, 0.35vw, 6px)',
              }}>
                {item}
              </div>
        ))}
      </div>

      {/* Pinned flash message */}
      {flash && (
  <div style={{
    position: 'absolute',
    top: '101%',
    left: 0,
    right: 0,
    backgroundColor: 'var(--red)',
    color: 'var(--yellow)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'clamp(15px, 1vw, 24px)',
    padding: 'clamp(3px, 0.35vw, 6px) clamp(6px, 0.69vw, 12px)',
    textAlign: 'center',
  }}>
    {error}
  </div>
)}
    </div>
  )
}