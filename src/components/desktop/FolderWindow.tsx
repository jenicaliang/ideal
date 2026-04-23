import { useCallback, useEffect, useRef, useState } from 'react'
import React from 'react'

export type InstalledFile = {
  id: string
  label: string
  type: string
  onReset?: () => void
}

function FolderItem({ f, onFileClick }: { f: InstalledFile, onFileClick: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 4px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginLeft: '33px' }}>
        {hovered ? (
          <svg
            onClick={() => onFileClick(f.id)}
            viewBox="0 0 209 157"
            style={{ imageRendering: 'pixelated', flexShrink: 0, cursor: 'pointer', width: '68px', height: '50px' }}
          >
            <path d="M0 16H189V157H0V16Z" fill="var(--teal-deep)" />
            <path d="M189 16V157H0V16H189ZM3 152H183V22H3V152Z" fill="var(--teal-bright)" />
            <path d="M20 36H209L189 157H0L20 36Z" fill="var(--teal-deep)" />
            <path d="M189 157H0L20 36H209L189 157ZM3.53711 154H186.455L205.463 39H22.5449L3.53711 154Z" fill="var(--teal-bright)" />
            <path d="M0 0H70V19H0V0Z" fill="var(--teal-deep)" />
            <path d="M70 0V19H0V0H70ZM3 16H67V3H3V16Z" fill="var(--teal-bright)" />
            <path d="M33 61H131L128 78H30L33 61Z" fill="var(--teal-mid, #006772)" />
          </svg>
        ) : (
          <svg
            onClick={() => onFileClick(f.id)}
            viewBox="0 0 20 17"
            style={{ imageRendering: 'pixelated', flexShrink: 0, cursor: 'pointer', width: '62px', height: '50px' }}
          >
            <rect x="0" y="0" width="7" height="3" fill="var(--teal-deep)" />
            <rect x="0" y="0" width="7" height="3" fill="none" stroke="var(--teal-bright)" strokeWidth="0.6" />
            <rect x="0" y="2" width="20" height="14" fill="var(--teal-deep)" />
            <rect x="0" y="2" width="20" height="14" fill="none" stroke="var(--teal-bright)" strokeWidth="0.6" />
            <rect x="2" y="5" width="12" height="2" fill="var(--teal-bright)" opacity="0.15" />
          </svg>
        )}
      </div>

      <span style={{
        color: 'var(--white)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(9px, 0.7vw, 12px)',
        textAlign: 'center',
        lineHeight: '1.3',
        wordBreak: 'break-word',
        width: '100%',
        userSelect: 'none',
      }}>
        {f.label}
      </span>

      {f.onReset && (
        <button
          onClick={(e) => { e.stopPropagation(); f.onReset?.() }}
          style={{
            padding: '2px 6px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(9px, 0.65vw, 11px)',
            backgroundColor: 'rgba(0,255,224,0.1)',
            border: '1px solid rgba(0,255,224,0.3)',
            color: 'rgba(0,255,224,0.8)',
            cursor: 'pointer',
            borderRadius: '2px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,255,224,0.25)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,255,224,0.1)'
          }}
        >
          Reset
        </button>
      )}
    </div>
  )
}

export default function FolderWindow({
  installedFiles,
  onFileClick,
  isMinimized,
  onMinimize,
  onClose,
  onFocus,
  zIndex,
  chromeColor,
  chromeBorder,
  chromeButtonColor,
  onContextMenu,
}: {
  installedFiles: InstalledFile[]
  onFileClick: (id: string) => void
  isMinimized: boolean
  onMinimize: () => void
  onClose: () => void
  onFocus: () => void
  zIndex: number
  chromeColor?: string
  chromeBorder?: string
  chromeButtonColor?: string
  onContextMenu?: (e: React.MouseEvent) => void
}) {
  const WINDOW_WIDTH = '25vw'
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
      onContextMenu={onContextMenu}
      style={{
        ...positionStyle,
        width: WINDOW_WIDTH,
        height: '45vh',
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${chromeBorder || 'var(--teal-bright)'}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        userSelect: 'none',
        visibility: isMinimized ? 'hidden' : 'visible',
        pointerEvents: isMinimized ? 'none' : 'auto',
        backgroundColor: chromeColor || 'var(--teal-deep)',
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onMouseDown}
        style={{
          backgroundColor: chromeColor || 'var(--teal-deep)',
          borderBottom: `2px solid ${chromeBorder || 'var(--teal-bright)'}`,
          padding: 'clamp(4px, 0.52vw, 9px) clamp(8px, 0.94vw, 16px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'grab',
          flexShrink: 0,
        }}
      >
        <span style={{
          color: chromeBorder || 'var(--teal-bright)',
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
              color: chromeBorder || 'var(--teal-bright)',
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
        backgroundColor: 'var(--black)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden auto',
        padding: '12px',
        boxSizing: 'border-box',
      }}>
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            alignContent: 'flex-start',
          }}>
            {installedFiles.map((f) => (
              <FolderItem key={f.id} f={f} onFileClick={onFileClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}