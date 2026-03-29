import { useState, useEffect } from 'react'

const HEADLINES = [
  "PRESIDENT ONCE AGAIN DECLARES STATE OF EMERGENCY",
  "MARKETS HIT ALL TIME HIGH DESPITE RECORD UNEMPLOYMENT",
  "NEW STUDY FINDS PRODUCTIVITY APP USERS 40% MORE ANXIOUS",
  "TECH COMPANY ANNOUNCES MANDATORY WELLNESS PROGRAM FOR ALL EMPLOYEES",
  "SCIENTISTS CONFIRM OPTIMAL MORNING ROUTINE NOW 4 HOURS LONG",
]

export default function BreakingNews() {
  const [hidden, setHidden] = useState(false)
  const [countdown, setCountdown] = useState(null)

  const handleIgnore = () => {
    setHidden(true)
    setCountdown(5)
  }

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      setHidden(false)
      setCountdown(null)
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  if (hidden) return (
    <div style={{
      position: 'absolute',
      bottom: '2.9vh',
      left: '20vw',
      right: 0,
      height: '3.2vh',
      backgroundColor: 'var(--red)',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      padding: '0 0.78vw',
      justifyContent: 'space-between',
    }}>
      <span style={{
        color: 'var(--yellow)',
        fontFamily: 'Arial Narrow, Arial, sans-serif',
        fontSize: 'clamp(15px, 1vw, 32px)',
      }}>
        BREAKING NEWS
      </span>
      <span style={{
        color: 'var(--yellow)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(12px, 0.9vw, 18px)',
      }}>
        returning in {countdown}s
      </span>
    </div>
  )

  return (
    <div style={{
      position: 'absolute',
      bottom: '2.9vh',
      left: '20vw',
      right: 0,
      zIndex: 20,
    }}>
      {/* Top bar */}
      <div style={{
        backgroundColor: 'var(--red)',
        height: '3.2vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0.78vw',
      }}>
        <span style={{
          color: 'var(--yellow)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(16px, 1.5vw, 32px)',
        }}>
          BREAKING NEWS
        </span>
        <button
          onClick={handleIgnore}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--yellow)',
            fontFamily: 'Arial Narrow, Arial, sans-serif',
            fontSize: 'clamp(16px, 1.5vw, 32px)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          IGNORE
        </button>
      </div>

      {/* Scrolling headline */}
      <div style={{
        backgroundColor: 'var(--black)',
        height: '6vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          gap: '9.375vw',        /* 120 * 1.111 / 1280 * 100 */
          animation: 'ticker 30s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {[...HEADLINES, ...HEADLINES].map((h, i) => (
            <span key={i} style={{
              color: 'var(--red)',
              fontFamily: 'Arial Narrow, Arial, sans-serif',
              fontSize: 'clamp(22px, 3.3vw, 72px)',   /* 50 * 1.111 / 1280 * 100 */
              letterSpacing: '0.08em',
            }}>
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}