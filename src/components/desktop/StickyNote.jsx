import { useState, useRef, useCallback, useEffect } from 'react'

const POOL = [
  'Call Dad',
  'Buy groceries',
  'Pay utilities',
  'Schedule check-up',
  'Reply to Pam',
  'Water the plants',
  'Do laundry',
  'Take out trash',
  'Cancel subscription',
  'Pick up prescription',
  'Return library book',
  'Buy birthday card',
  'Book oil change',
  'Clean out fridge',
  'Back up phone',
  'Pay credit card',
  'Text back David',
  'Buy stamps',
  'Reschedule Wed meeting',
  'Empty dishwasher',
  'Charge laptop',
  'Set evening alarm',
  'Check P.O. box',
  'Clean cat litter',
  'Order more coffee',
  'Submit timesheet',
  'Renew parking permit',
  'Defrost the freezer',
  'Buy new sponge',
  'Call insurance',
  'Update passwords',
  'Send thank you note',
  'Fix leaky faucet',
  'Donate old clothes',
  'Make eye appointment',
  'Buy more vitamins',
  'Respond to email',
  'Confirm reservation',
  'Change smoke alarm battery',
  'Buy toilet paper',
]

let poolIndex = 0
const nextItem = () => {
  const item = POOL[poolIndex % POOL.length]
  poolIndex++
  return item
}

const NOTE_WIDTH = 'clamp(180px, 18vw, 320px)'

function CustomCheckbox({ checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: '0.9em',
        height: '0.9em',
        flexShrink: 0,
        border: '2px solid var(--black)',
        borderRadius: 0,
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {checked && (
        <svg viewBox="0 0 10 10" style={{ width: '0.65em', height: '0.65em' }}>
          <polyline
            points="1.5,5 4,7.5 8.5,2"
            fill="none"
            stroke="var(--black)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}

export default function StickyNote({ title, items, error, initialX = 0.3, initialY = 0.25, fontSize = 'clamp(15px, 1.2vw, 24px)', zIndex = 20, onFocus, static: isStatic = false, width = NOTE_WIDTH }) {
  const [pos, setPos] = useState({
    x: initialX * window.innerWidth,
    y: initialY * window.innerHeight
  })
  const [flash, setFlash] = useState(false)
  const [rows, setRows] = useState(() =>
    isStatic ? [] : items.map((item, i) => ({
      id: i,
      text: item.startsWith('#') ? item.slice(1).trim() : item,
      heading: item.startsWith('#'),
      checked: false,
      fading: false,
    }))
  )

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

  useEffect(() => {
    onMouseMoveRef.current = onMouseMove
    onMouseUpRef.current = onMouseUp
  }, [onMouseMove, onMouseUp])

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

  const onCheck = (id) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, checked: true, fading: true } : r))
    setTimeout(() => {
      setRows(prev => prev.map(r => r.id === id
        ? { ...r, text: nextItem(), checked: false, fading: false, heading: false }
        : r
      ))
    }, 500)
  }

  return (
    <div style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: width,
      backgroundColor: 'var(--yellow)',
      border: '2px solid var(--teal-deep)',
      zIndex: zIndex,
      boxShadow: '0px 3px 8px var(--teal-deep)',
      userSelect: 'none',
      boxSizing: 'border-box',
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
        {isStatic
          ? (
            <div style={{
              fontFamily: 'var(--font-os)',
              fontSize: fontSize,
              lineHeight: '1.4',
              color: 'var(--black)',
              whiteSpace: 'pre-wrap',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {items[0]}
            </div>
          )
          : rows.map((row) => (
            row.text === ''
              ? <div key={row.id} style={{ height: '1.875vh' }} />
              : row.heading
                ? (
                  <div key={row.id} style={{
                    fontFamily: 'var(--font-os)',
                    fontSize: fontSize,
                    lineHeight: '1.2',
                    color: 'var(--black)',
                    fontWeight: '700',
                    marginBottom: 'clamp(2px, 0.35vw, 6px)',
                    marginTop: 'clamp(4px, 0.5vw, 8px)',
                  }}>
                    {row.text}
                  </div>
                )
                : (
                  <div
                    key={row.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'clamp(6px, 0.5vw, 10px)',
                      marginBottom: 'clamp(2px, 0.35vw, 6px)',
                      opacity: row.fading ? 0 : 1,
                      transition: 'opacity 0.4s',
                    }}
                  >
                    <CustomCheckbox
                      checked={row.checked}
                      onChange={() => onCheck(row.id)}
                    />
                    <span style={{
                      fontFamily: 'var(--font-os)',
                      fontSize: fontSize,
                      lineHeight: '1.2',
                      color: 'var(--black)',
                      textDecoration: row.checked ? 'line-through' : 'none',
                      opacity: row.checked ? 0.4 : 1,
                      transition: 'opacity 0.3s',
                    }}>
                      {row.text}
                    </span>
                  </div>
                )
          ))
        }
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