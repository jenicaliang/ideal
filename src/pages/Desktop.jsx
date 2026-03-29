import { useState } from 'react'
import Taskbar from '../components/desktop/Taskbar'
import AboutWindow from '../components/desktop/AboutWindow'
import RoomBackground from '../components/desktop/RoomBackground'
import Ticker from '../components/desktop/Ticker'
import StickyNote from '../components/desktop/StickyNote'
import MoodSelector from '../components/desktop/MoodSelector'
import CameraLog from '../components/desktop/CameraLog'
import BreakingNews from '../components/desktop/BreakingNews'
import ColorScroller from '../components/desktop/ColorScroller'
import MusicPlayer from '../components/desktop/MusicPlayer'
import LiveIndicator from '../components/desktop/LiveIndicator'
import HabitTracker from '../components/desktop/HabitTracker'
import NoteToSelf from '../components/desktop/NoteToSelf'
import IdealLauncher from '../components/desktop/IdealLauncher'
import IdealWindow from '../components/desktop/IdealWindow'

export default function Desktop({ isMonochrome, onMonochrome, showAbout, onAbout, onCloseAbout }) {
  const [topNote, setTopNote] = useState(null)
  const [installedApps, setInstalledApps] = useState([])
  const [installNotification, setInstallNotification] = useState(null)
  const [showNeedsWindow, setShowNeedsWindow] = useState(false)
  const [showToolsWindow, setShowToolsWindow] = useState(false)
  const [idealVisible, setIdealVisible] = useState(false)
  const [idealMinimized, setIdealMinimized] = useState(false)
  const [idealClosed, setIdealClosed] = useState(false)
  const [idealKey, setIdealKey] = useState(0)

  const handleAccept = () => {
    setIdealVisible(true)
    setIdealClosed(false)
  }

  const handleReachUncertainty = () => {
    setTimeout(() => setInstallNotification('Installing NEEDS ASSESSMENT...'), 600)
    setTimeout(() => {
      setInstalledApps(prev => [...prev, 'needs'])
      setInstallNotification('Installing LEGACY TOOLS...')
    }, 2800)
    setTimeout(() => {
      setInstalledApps(prev => [...prev, 'tools'])
      setInstallNotification(null)
    }, 5000)
  }

  const handleIdealClose = () => {
    setIdealClosed(true)
    setIdealVisible(false)
    setIdealMinimized(false)
    setInstalledApps([])
    setInstallNotification(null)
    setIdealKey(k => k + 1)
  }

  const handleIdealRestore = () => {
    setIdealMinimized(false)
    if (!idealVisible) setIdealVisible(true)
  }

  const ICON_SIZE = 'clamp(36px, 4vw, 64px)'
  const ICON_FONT = 'clamp(12px, 0.9vw, 18px)'

  const appIcons = [
    { id: 'needs', label: 'NEEDS_ASSESSMENT', short: 'NA', onClick: () => setShowNeedsWindow(true) },
    { id: 'tools', label: 'LEGACY_TOOLS', short: 'LT', onClick: () => setShowToolsWindow(true) },
  ]

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--teal-deep)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <RoomBackground />
      <Ticker />
      <StickyNote
        title="TO-DO LIST"
        initialX={0.26}
        initialY={0.37}
        fontSize='clamp(15px, 1vw, 24px)'
        zIndex={topNote === 'todo' ? 30 : 20}
        onFocus={() => setTopNote('todo')}
        items={[
          'URGENT',
          'O Call Mom',
          'O Apply to AT LEAST 10 jobs',
          'O Meal prep',
          'O Email landlord about leak',
          '',
          'DO BY END OF WEEK!!!',
          'O User journey outline',
          'O Finish paper edits',
          'O Ask Sarah for dress back',
          'O Sign up for volunteering',
          'O Book dentist appointment',
        ]}
        error="nice try."
      />
      <StickyNote
        title="!!!"
        initialX={0.37}
        initialY={0.22}
        fontSize='clamp(16px, 1.5vw, 32px)'
        zIndex={topNote === 'affirmation' ? 30 : 20}
        onFocus={() => setTopNote('affirmation')}
        items={[
          '"Become addicted',
          'to constant and',
          'never-ending self',
          'improvement."',
        ]}
        error="you need this one."
      />
      <MoodSelector />
      <CameraLog />
      <BreakingNews />
      <ColorScroller />
      <MusicPlayer />
      <LiveIndicator />
      <HabitTracker />
      <NoteToSelf />

      <Taskbar
        isMonochrome={isMonochrome}
        onMonochrome={onMonochrome}
        onAbout={onAbout}
        idealActive={idealMinimized}
        onRestoreIdeal={handleIdealRestore}
      />

      {showAbout && <AboutWindow onClose={onCloseAbout} />}

      {/* Installed app icons */}
      {appIcons.filter(a => installedApps.includes(a.id)).map((app, i) => (
        <div
          key={app.id}
          onClick={app.onClick}
          style={{
            position: 'absolute',
            top: '45vh',
            right: `calc(40vh + clamp(36px, 4vw, 64px) * ${i + 1} + ${(i + 1) * 12}px + 12px)`,
            zIndex: 50,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5vh',
            userSelect: 'none',
          }}
        >
          <div style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            backgroundColor: 'var(--teal-deep)',
            border: '2px solid var(--teal-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--green)',
            fontFamily: 'var(--font-mono)',
            fontSize: ICON_FONT,
            fontWeight: '700',
          }}>
            {app.short}
          </div>
          <span style={{
            color: 'var(--white)',
            fontFamily: 'var(--font-mono)',
            fontSize: ICON_FONT,
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '1px 0.31vw',
          }}>
            {app.label}
          </span>
        </div>
      ))}

      {/* Install notification */}
      {installNotification && (
        <div style={{
          position: 'absolute',
          top: 'calc(45vh - 3.5vh)',
          right: '40vh',
          zIndex: 60,
          backgroundColor: 'var(--black)',
          border: '1px solid var(--teal-bright)',
          color: 'var(--teal-bright)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(12px, 0.9vw, 18px)',
          padding: '0.4vh 0.8vw',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {installNotification}
        </div>
      )}

      <IdealLauncher
        onAccept={handleAccept}
        onDecline={() => {}}
        onRestoreWindow={idealVisible || idealMinimized ? handleIdealRestore : null}
      />

      {/* IDEAL onboarding window */}
      {idealVisible && !idealClosed && (
        <IdealWindow
          key={idealKey}
          onMinimize={() => setIdealMinimized(true)}
          onClose={handleIdealClose}
          onReachUncertainty={handleReachUncertainty}
          isMinimized={idealMinimized}
        />
      )}

      {/* App windows — stubs */}
      {showNeedsWindow && (
        <div>NEEDS WINDOW COMING SOON</div>
      )}
      {showToolsWindow && (
        <div>TOOLS WINDOW COMING SOON</div>
      )}

      {/* Closed state message */}
      {idealClosed && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.85)',
        }}>
          <div style={{
            width: 'clamp(300px, 34.7vw, 560px)',
            backgroundColor: 'var(--black)',
            border: '2px solid var(--teal-bright)',
            padding: 'clamp(20px, 2.78vw, 44px)',
            textAlign: 'center',
          }}>
            <p style={{
              color: 'var(--white)',
              fontFamily: 'Arial Narrow, Arial, sans-serif',
              fontSize: 'clamp(16px, 1.75vw, 32px)',
              fontWeight: '700',
              letterSpacing: '0.05em',
              marginBottom: 'clamp(10px, 1.39vw, 22px)',
            }}>
              That's ok.
            </p>
            <p style={{
              color: 'var(--grey-light)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(15px, 1.2vw, 24px)',
              lineHeight: '1.8',
              marginBottom: 'clamp(18px, 2.43vw, 40px)',
            }}>
              Take your time. IDEAL will be here when you're ready.
            </p>
            <button
              onClick={() => setIdealClosed(false)}
              style={{
                width: '100%',
                padding: 'clamp(6px, 0.69vw, 12px)',
                fontFamily: 'Arial Narrow, Arial, sans-serif',
                fontSize: 'clamp(16px, 1.5vw, 32px)',
                fontWeight: '700',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                border: '1px solid var(--teal-bright)',
                backgroundColor: 'var(--teal-deep)',
                color: 'var(--teal-bright)',
              }}
            >
              I UNDERSTAND
            </button>
          </div>
        </div>
      )}
    </div>
  )
}