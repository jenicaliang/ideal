import { BooleanKeyframeTrack } from 'three'
import PixelButton from './PixelButton'

const css = (v: string) => `var(${v})`

export default function BottomBar({
  onCancel,
  onBack,
  onNext,
  backDisabled = false,
  disableNext = false,
  nextLabel = 'Next >',
}: {
  onCancel: () => void
  onBack?: () => void
  onNext?: () => void
  backDisabled?: boolean
  disableNext?: boolean
  nextLabel?: string
}) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'clamp(8px, 1vh, 14px) clamp(12px, 1.5vw, 24px)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: css('--space-4'),
        backgroundColor: css('--bg'),
        zIndex: 30,
      }}
    >
      {/* Divider line — inset from sides */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 'clamp(12px, 1.5vw, 24px)',
          right: 'clamp(12px, 1.5vw, 24px)',
          height: '1px',
          backgroundColor: css('--mid'),
          opacity: 0.4,
        }}
      />

      {/* Back + Next flush together */}
      <div style={{ display: 'flex' }}>
        <PixelButton onClick={onBack!} disabled={backDisabled} position="left">
          {'< Back'}
        </PixelButton>
        <PixelButton onClick={onNext!} disabled={disableNext} position="right">
          {nextLabel}
        </PixelButton>
      </div>

      <PixelButton onClick={onCancel} position="solo">
        Cancel
      </PixelButton>
    </div>
  )
}

