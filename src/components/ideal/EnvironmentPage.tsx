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
  }, []) // fire once on mount only

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: css('--bg'),
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
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
      <BottomBar
        onBack={onBack}
        onNext={onProceed}
        onCancel={onCancel}
        backDisabled={false}
      />
    </div>
  )
}