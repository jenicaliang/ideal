import { useEffect, useState, useRef } from 'react'

const IDEAL_OFF_WHITE = '#f5f3ef'
const IDEAL_INK = '#1e1e1e'
const IDEAL_MID = '#9a9690'
const IDEAL_RED = '#b04a2f'

function css(v: string) {
  return `var(${v})`
}

function BlinkingDot() {
  const [on, setOn] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setOn(p => !p), 800)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{
      width: 7,
      height: 7,
      borderRadius: '50%',
      backgroundColor: IDEAL_RED,
      opacity: on ? 1 : 0,
      transition: 'opacity 0.15s ease',
      flexShrink: 0,
    }} />
  )
}

function IdealtaskBar({ onAbout }: { onAbout: () => void }) {
  const [time, setTime] = useState('')
  const [showAboutMenu, setShowAboutMenu] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours()
      const m = now.getMinutes().toString().padStart(2, '0')
      const ampm = h >= 12 ? 'PM' : 'AM'
      setTime(`${h % 12 || 12}:${m} ${ampm}`)
    }
    update()
    const t = setInterval(update, 10000)
    return () => clearInterval(t)
  }, [])

  function handlePower() {
    setFadingOut(true)
    setTimeout(() => window.location.reload(), 800)
  }

  return (
    <>
      {fadingOut && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 999999,
          opacity: fadingOut ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }} />
      )}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: IDEAL_OFF_WHITE,
        borderTop: `1px solid rgba(30,30,30,0.12)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100,
        boxSizing: 'border-box',
      }}>

        {/* About */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAboutMenu(p => !p)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: css('--mono'),
              fontSize: 11,
              color: IDEAL_MID,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 0',
              opacity: 0.6,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
          >
            About
          </button>
          {showAboutMenu && (
            <>
              <div onClick={() => setShowAboutMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
              <div style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: 6,
                backgroundColor: IDEAL_OFF_WHITE,
                border: `1px solid rgba(30,30,30,0.12)`,
                minWidth: 160,
                zIndex: 300,
                boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
              }}>
                <button
                  onClick={() => { setShowAboutMenu(false); onAbout() }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    fontFamily: css('--mono'),
                    fontSize: 11,
                    color: IDEAL_INK,
                    letterSpacing: '0.06em',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(30,30,30,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  About IDEAL
                </button>
              </div>
            </>
          )}
        </div>

        {/* Clock */}
        <span style={{
          fontFamily: css('--mono'),
          fontSize: 12,
          color: IDEAL_MID,
          letterSpacing: '0.06em',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          {time}
        </span>
        
        {/* Power button */}
        <button
          onClick={handlePower}
          title="Restart"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.4,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v7" stroke={IDEAL_INK} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 3.5A6 6 0 1 0 11 3.5" stroke={IDEAL_INK} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </button>

        
      </div>
    </>
  )
}

export default function JoinEnding({ onAbout }: { onAbout: () => void }) {
  const [directiveVisible, setDirectiveVisible] = useState(false)

  useEffect(() => {
    // Directive box appears after a beat — the desktop clearing is handled by Desktop.tsx
    const t = setTimeout(() => setDirectiveVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: IDEAL_OFF_WHITE,
      zIndex: 500000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 40,
    }}>
      <div style={{
        opacity: directiveVisible ? 1 : 0,
        transform: directiveVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 20,
        maxWidth: 480,
        width: '100%',
        padding: '0 24px',
        boxSizing: 'border-box',
      }}>
        {/* Status row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <BlinkingDot />
          <span style={{
            fontFamily: css('--mono'),
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: IDEAL_RED,
          }}>
            IDEAL online
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(30,30,30,0.1)' }} />

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{
            fontFamily: css('--mono'),
            fontSize: 13,
            fontWeight: 400,
            color: IDEAL_INK,
            margin: 0,
            lineHeight: 1.7,
            letterSpacing: '0.03em',
          }}>
            Your IDEAL shipment is pending.
          </p>
          <p style={{
            fontFamily: css('--mono'),
            fontSize: 13,
            fontWeight: 400,
            color: IDEAL_INK,
            margin: 0,
            lineHeight: 1.7,
            letterSpacing: '0.03em',
          }}>
            Directives will begin as soon as calibration is sufficient.
          </p>
          <p style={{
            fontFamily: css('--mono'),
            fontSize: 13,
            fontWeight: 400,
            color: IDEAL_MID,
            margin: 0,
            lineHeight: 1.7,
            letterSpacing: '0.03em',
          }}>
            Thank you for choosing IDEAL.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(30,30,30,0.1)' }} />

        {/* Sub-label */}
        <p style={{
          fontFamily: css('--mono'),
          fontSize: 10,
          color: IDEAL_MID,
          margin: 0,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.5,
        }}>
          Calibration period: 14 days
        </p>
      </div>

      <IdealtaskBar onAbout={onAbout} />
    </div>
  )
}