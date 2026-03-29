import { useState, useRef } from 'react'

export default function AboutWindow({ onClose }) {
  const [pos, setPos] = useState(null) // null = CSS centered, object = dragged
  const dragOffset = useRef(null)

  const onMouseDown = (e) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e) => {
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    })
  }

  const onMouseUp = () => {
    dragOffset.current = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  const positionStyle = pos
    ? { position: 'absolute', left: pos.x, top: pos.y }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

  return (
    <div style={{
      ...positionStyle,
      width: 'clamp(300px, 35vw, 450px)',
      zIndex: 200,
      userSelect: 'none',
    }}>
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          backgroundColor: 'var(--teal-deep)',
          borderTop: '2px solid var(--teal-bright)',
          borderLeft: '2px solid var(--teal-bright)',
          borderRight: '2px solid var(--teal-bright)',
          padding: 'clamp(3px, 0.35vh, 6px) clamp(8px, 0.87vw, 14px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
        }}
      >
        <span style={{
          color: 'var(--teal-bright)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(14px, 1.74vw, 26px)',
          fontWeight: '700',
          letterSpacing: '0.08em',
        }}>
          ABOUT
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--yellow)',
            cursor: 'pointer',
            fontSize: 'clamp(14px, 1.74vw, 26px)',
          }}
        >
          X
        </button>
      </div>

      {/* Body */}
      <div style={{
        backgroundColor: 'var(--black)',
        border: '2px solid var(--teal-bright)',
        padding: 'clamp(14px, 1.74vw, 26px)',
      }}>
        <p style={{
          color: 'var(--teal-bright)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(15px, 1.2vw, 20px)',
          lineHeight: '1.8',
          marginBottom: 'clamp(10px, 1.39vw, 22px)',
        }}>
          IDEAL is a speculative design project exploring how algorithmic optimization erodes personal agency.
        </p>
        <p style={{
          color: 'rgba(0,255,224,0.5)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 16px)',
          lineHeight: '1.8',
        }}>
          Created by Jenica Liang / 2026<br />
          Built with React + Vite.<br />
          All data is fictional.
        </p>
      </div>
    </div>
  )
}