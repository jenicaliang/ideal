const LOG_ENTRIES = [
  '5:06PM dogs barking',
  '5:12PM motion detected',
  '5:19PM no activity',
  '5:34PM motion detected',
]

export default function CameraLog() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '15vh',   
      right: 0,
      width: 'clamp(180px, 19vw, 320px)',
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderBottom: '2px solid var(--green)',
      borderTop: '1px solid var(--grey)',
      padding: 'clamp(8px, 0.87vw, 14px) clamp(10px, 1.04vw, 18px)',
      zIndex: 10,
    }}>
      <div style={{
        color: 'var(--grey-light)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(12px, 0.9vw, 18px)',
        marginBottom: 'clamp(6px, 0.69vw, 12px)',
      }}>
        currently showing: Living Room
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
      {LOG_ENTRIES.map((entry, i) => (
        <div key={i} style={{
          color: 'var(--grey-light)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 18px)',
          marginBottom: 'clamp(2px, 0.26vw, 5px)',
        }}>
          {entry}
        </div>
      ))}
    </div>
  )
}