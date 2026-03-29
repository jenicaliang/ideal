export default function NoteToSelf() {
    return (
      <div style={{
        position: 'absolute',
        right: '25vw',            
        top: '58vh',      
        zIndex: 15,
        pointerEvents: 'none',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5vh',
        alignItems: 'flex-start',
      }}>
        <span style={{
          color: 'var(--green)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(15px, 1.2vw, 24px)',
          letterSpacing: '0.05em',
          textDecoration: 'underline',
          backgroundColor: 'var(--black)',
          padding: '1px 0.31vw',
        }}>
          note to self:
        </span>
        <span style={{
          color: 'var(--green)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(15px, 1.2vw, 24px)',
          letterSpacing: '0.05em',
          textDecoration: 'underline',
          backgroundColor: 'var(--black)',
          padding: '1px 0.31vw',
        }}>
          try clicking around!
        </span>
      </div>
    )
  }