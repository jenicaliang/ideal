import { useState, useRef } from 'react'

export default function AboutWindow({ onClose }) {
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - window.innerWidth * 0.156, y: window.innerHeight / 2 - window.innerHeight * 0.187 })
  const dragOffset = useRef(null)

  const onMouseDown = (e) => {
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e) => {
    setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
  }

  const onMouseUp = () => {
    dragOffset.current = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  return (
    <div style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: 'clamp(300px, 35vw, 450px)',      /* 400 * 1.111 / 1280 * 100 */
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
          fontSize: 'clamp(14px, 1.74vw, 26px)',   /* 20 * 1.111 / 1280 * 100 */
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
        padding: 'clamp(14px, 1.74vw, 26px)',      /* 20 * 1.111 / 1280 * 100 */
      }}>
        <p style={{
          color: 'var(--teal-bright)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(15px, 1.2vw, 20px)',    /* 15 * 1.111 / 1280 * 100 */
          lineHeight: '1.8',
          marginBottom: 'clamp(10px, 1.39vw, 22px)',
        }}>
          IDEAL is a speculative design project exploring how algorithmic optimization erodes personal agency.
        </p>
        <p style={{
          color: 'rgba(0,255,224,0.5)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 16px)',    /* 12 * 1.111 / 1280 * 100 */
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