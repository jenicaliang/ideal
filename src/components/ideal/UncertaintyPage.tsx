import { useState } from 'react'
import BottomBar from './shared/BottomBar'

const css = (v: string) => `var(${v})`

export default function UncertaintyPage({ onProceed, onCancel, onBack, needsVisited = false }: {
  onProceed: () => void
  onCancel: () => void
  onBack: () => void
  needsVisited: boolean
}) {
  const [nudgeRed, setNudgeRed] = useState(false)
  console.log('needsVisited:', needsVisited)

  function handleNextAttempt() {
    if (needsVisited) {
      onProceed()
    } else {
      setNudgeRed(true)
      setTimeout(() => setNudgeRed(false), 1500)
    }
  }

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
          gap: css('--space-6'),
          maxWidth: '580px',
          width: '100%',
        }}>
          <h1 className="ideal-headline">
            I think we're on the same page.
          </h1>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: css('--space-5'),
          }}>
            <p className="ideal-body">
              We didn't choose you at random. We chose you because we've seen how hard you work to be a better you. The best you. And because you haven't managed to. Not yet.
            </p>
            <p className="ideal-body">
              It's difficult to achieve our goals, with the problem of{' '}
              <strong style={{
                fontWeight: 600,
                color: css('--red'),
                fontStyle: 'italic',
              }}>
                uncertainty
              </strong>
              {' '}clouding our every moment.
            </p>
            <p className="ideal-body">
              What if we could solve it?
            </p>
            <p className="ideal-body" style={{
              color: nudgeRed ? 'var(--red)' : css('--mid'),
              fontStyle: 'italic',
              transition: 'color 0.2s ease',
            }}>
              Three resources have been installed in your databank. Explore at your own pace, or proceed when ready.
            </p>
          </div>
        </div>
      </div>
      <BottomBar
        onBack={onBack}
        onNext={handleNextAttempt}
        onCancel={onCancel}
        backDisabled={false}
      />
    </div>
  )
}