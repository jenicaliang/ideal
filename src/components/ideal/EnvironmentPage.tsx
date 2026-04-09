import { useEffect } from 'react'
import BottomBar from './shared/BottomBar'

const css = (v: string) => `var(${v})`

export default function EnvironmentPage({
  onProceed,
  onCancel,
  onOpenFolder,
  onBack,
}: {
  onProceed: () => void
  onCancel: () => void
  onOpenFolder?: () => void
  onBack: () => void
}) {
  useEffect(() => {
    onOpenFolder?.()
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: css('--bg'),
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>

      {/* Main content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(32px, 5vh, 64px) clamp(32px, 5vw, 80px)',
        paddingBottom: 'clamp(80px, 10vh, 120px)',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: css('--space-5'),
          maxWidth: '620px',
          width: '100%',
        }}>
          <h1 className="ideal-headline" style={{ fontSize: css('--size-headline') }}>
            This is your IDEAL databank.
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: css('--space-4') }}>
            <p className="ideal-body">
              Everything we explore together will be kept here: organized, accessible, and yours to reference.
            </p>
            <p className="ideal-body">
              As you proceed through your onboarding, new materials will be added.
            </p>
            <p className="ideal-body" style={{ color: css('--mid'), fontStyle: 'italic' }}>
              Keep it open as you go.
            </p>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '3%',
        right: 'clamp(325px, 5vw, 500px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        zIndex: 10,
        pointerEvents: 'none',
        animation: 'arrowPulse 1s ease-in-out infinite',
      }}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: 'rotate(45deg)' }}
        >
          <path
            d="M6 30 L30 6 M30 6 L30 20 M30 6 L16 6"
            stroke="var(--red)"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
        <span style={{
          fontFamily: css('--mono'),
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--red)',
          whiteSpace: 'nowrap',
        }}>
          your databank
        </span>
      </div>

      <BottomBar
        onBack={onBack}
        onNext={onProceed}
        onCancel={onCancel}
        backDisabled={false}
      />

      <style>{`
        @keyframes arrowPulse {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(7px); }
        }
      `}</style>
    </div>
  )
}