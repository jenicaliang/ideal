import { useState, useRef, useCallback, useEffect } from 'react'
import React from 'react'
import NeedsPage from '../ideal/NeedsPage'

export default function NeedsWindow({ onClose, onFocus, onMinimize, zIndex, isMinimized }: {
  onClose: () => void
  onFocus: () => void
  onMinimize: () => void
  zIndex: number
  isMinimized: boolean
}) {
  const [pos, setPos] = useState<{ x: number, y: number } | null>(null)
  const [visibleKey, setVisibleKey] = useState(0)
  const dragOffset = useRef<{ x: number, y: number } | null>(null)
  const onMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null)
  const onMouseUpRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!isMinimized) {
      setVisibleKey(k => k + 1)
    }
  }, [isMinimized])

  const onMouseUp = useCallback(() => {
    dragOffset.current = null
    window.removeEventListener('mousemove', onMouseMoveRef.current!)
    window.removeEventListener('mouseup', onMouseUpRef.current!)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    setPos({
      x: e.clientX - dragOffset.current!.x,
      y: e.clientY - dragOffset.current!.y,
    })
  }, [])

  onMouseMoveRef.current = onMouseMove
  onMouseUpRef.current = onMouseUp

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    onFocus()
    const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect()
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    window.addEventListener('mousemove', onMouseMoveRef.current!)
    window.addEventListener('mouseup', onMouseUpRef.current!)
  }, [onFocus])

  const positionStyle = pos
    ? { position: 'fixed' as const, left: pos.x, top: pos.y }
    : { position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

  return (
    <div
  onMouseDown={onFocus}
  style={{
    ...positionStyle,
    width: '65vw',
    height: '70vh',
    zIndex,
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid var(--magenta)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
    userSelect: 'none',
    visibility: isMinimized ? 'hidden' : 'visible',
    pointerEvents: isMinimized ? 'none' : 'auto',
  }}
>
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          backgroundColor: 'var(--magenta)',
          borderBottom: '2px solid var(--yellow)',
          padding: 'clamp(4px, 0.52vw, 9px) clamp(8px, 0.94vw, 16px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
          flexShrink: 0,
        }}
      >
        <span style={{
          color: 'var(--yellow)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(12px, 0.9vw, 18px)',
          fontWeight: '700',
          letterSpacing: '0.1em',
        }}>
          MASLOWS_NEEDS.exe
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
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
            _
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
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

      {/* Content — always mounted */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg, #f5f3ef)',
      }}>
        <NeedsPage visibleKey={visibleKey} />
      </div>
    </div>
  )
}