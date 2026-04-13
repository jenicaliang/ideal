import { useState, useEffect } from 'react'

const ENTRY_POOL = [
  'no activity',
  'no activity',
  'no activity',
  'motion detected',
  'motion detected',
  'low light warning',
  'audio: ambient noise',
  'audio: unidentified',
  'motion: unidentified',
  'motion cleared',
  'recording reset',
  'signal stable',
  'no activity',
  'no activity',
]

function getTime() {
  const now = new Date()
  let h = now.getHours()
  const m = now.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m}${ampm}`
}

export default function CameraLog() {
  const [entries, setEntries] = useState([])
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const delay = 2500 + Math.random() * 3000
    const interval = setInterval(() => {
      const text = ENTRY_POOL[Math.floor(Math.random() * ENTRY_POOL.length)]
      const newEntry = `${getTime()} ${text}`
      setEntries(prev => [...prev.slice(-2), newEntry])
      setFlash(true)
      setTimeout(() => setFlash(false), 400)
    }, delay)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      bottom: '15vh',
      right: 0,
      width: 'clamp(180px, 19vw, 320px)',
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderBottom: `2px solid ${flash ? 'var(--green-bright, #00ff88)' : 'var(--green)'}`,
      borderTop: '1px solid var(--grey)',
      padding: 'clamp(8px, 0.87vw, 14px) clamp(10px, 1.04vw, 18px)',
      zIndex: 10,
      transition: 'border-bottom-color 0.2s',
    }}>
      <div style={{
        color: 'var(--grey-light)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(12px, 0.9vw, 18px)',
        marginBottom: 'clamp(6px, 0.69vw, 12px)',
      }}>
        showing: Your Living Room
      </div>
      <div style={{
        color: 'var(--grey)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(12px, 0.9vw, 18px)',
        marginBottom: 'clamp(4px, 0.52vw, 9px)',
        letterSpacing: '0.03em',
      }}>
        recent activity:
      </div>
      {entries.length === 0 ? (
        <div style={{
          color: 'var(--grey)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 18px)',
          opacity: 0.6,
        }}>
          connecting...      </div>
      ) : entries.map((entry, i) => (
        <div key={entry + i} style={{
          color: i === entries.length - 1 ? 'var(--green)' : 'var(--grey-light)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 18px)',
          marginBottom: 'clamp(2px, 0.26vw, 5px)',
          opacity: i === entries.length - 1 ? 1 : 0.5 + (i / entries.length) * 0.5,
          transition: 'opacity 0.5s',
        }}>
          {entry}
        </div>
      ))}
    </div>
  )
}