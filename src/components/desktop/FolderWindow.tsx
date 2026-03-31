import { useCallback, useEffect, useRef, useState } from 'react'
import React from 'react'

export type InstalledFile = {
  id: string
  label: string
  type: string
  onReset?: () => void
}

export default function FolderWindow({
  installedFiles,
  onFileClick,
  isMinimized,
  onMinimize,
  onClose,
  onFocus,
  zIndex,
}: {
  installedFiles: InstalledFile[]
  onFileClick: (id: string) => void
  isMinimized: boolean
  onMinimize: () => void
  onClose: () => void
  onFocus: () => void
  zIndex: number
}) {
  const [pos, setPos] = useState<{ x: number, y: number } | null>(null)
  const dragOffset = useRef<{ x: number, y: number } | null>(null)
  const onMouseMoveRef = useRef<((e: MouseEvent) => void) | null>(null)
  const onMouseUpRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (isMinimized) {
      dragOffset.current = null
    }
  }, [isMinimized])

  const onMouseUp = useCallback(() => {
    dragOffset.current = null
    if (onMouseMoveRef.current) window.removeEventListener('mousemove', onMouseMoveRef.current)
    if (onMouseUpRef.current) window.removeEventListener('mouseup', onMouseUpRef.current)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragOffset.current) return
    setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
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
    : { position: 'fixed' as const, top: '10%', right: '2%' }

  return (
    <div
      onMouseDown={onFocus}
      style={{
        ...positionStyle,
        width: '25vw',
        height: '45vh',
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid var(--teal-bright)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        userSelect: 'none',
        visibility: isMinimized ? 'hidden' : 'visible',
        pointerEvents: isMinimized ? 'none' : 'auto',
        backgroundColor: 'var(--teal-deep)',
      }}
    >
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
          YOUR_IDEAL_LIFE
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
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
            onMouseDown={(e) => e.stopPropagation()}
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

      {/* Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--black)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>
        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 80px',
          gap: '12px',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(0,255,224,0.35)',
          color: 'var(--teal-bright)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 18px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}>
          <div>Name</div>
          <div style={{ textAlign: 'right' }}>Type</div>
          <div style={{ textAlign: 'right', visibility: 'hidden' }}>Action</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {installedFiles.length === 0 ? (
            <div style={{
              padding: '18px 14px',
              color: 'rgba(0,255,224,0.65)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(12px, 0.9vw, 18px)',
              letterSpacing: '0.04em',
            }}>
              (empty)
            </div>
          ) : (
            installedFiles.map((f) => (
              <div
                key={f.id}
                onClick={() => onFileClick(f.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px',
                  gap: '12px',
                  padding: '10px 14px',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(12px, 0.9vw, 18px)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(0,255,224,0.12)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
                }}
              >
                <div style={{ letterSpacing: '0.06em' }}>
                  {f.label}
                </div>
                <div style={{ textAlign: 'right', color: 'rgba(0,255,224,0.85)' }}>
                  {f.type}
                </div>
                {f.onReset ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      f.onReset?.()
                    }}
                    style={{
                      padding: '4px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(11px, 0.8vw, 14px)',
                      backgroundColor: 'rgba(0,255,224,0.1)',
                      border: '1px solid rgba(0,255,224,0.3)',
                      color: 'rgba(0,255,224,0.8)',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,255,224,0.25)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--teal-bright)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,255,224,0.1)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(0,255,224,0.8)'
                    }}
                  >
                    Reset
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}