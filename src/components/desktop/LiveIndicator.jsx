export default function LiveIndicator() {
    return (
      <div style={{
        position: 'absolute',
        top: '15vh',          
        left: '21.5vw',   
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '1vw',           
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderBottom: '2px solid var(--green)',
        padding: 'clamp(3px, 0.43vw, 7px) clamp(8px, 0.87vw, 14px)',
        userSelect: 'none',
      }}>
        <div style={{
          width: '0.5vw',        
          height: '0.5vw',      
          borderRadius: '50%',
          backgroundColor: 'var(--green)',
          animation: 'blink 1.2s ease-in-out infinite',
        }} />
        <span style={{
          color: 'var(--green)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(20px, 2vw, 40px)', 
          letterSpacing: '0.08em',
        }}>
          LIVE
        </span>
      </div>
    )
  }