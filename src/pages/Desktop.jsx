import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
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
import NeedsWindow from '../components/desktop/NeedsWindow'
import ToolsWindow from '../components/desktop/ToolsWindow'
import FolderWindow from '../components/desktop/FolderWindow'
import WorldWindow from '../components/desktop/WorldWindow'
import DevicesWindow from '../components/desktop/DevicesWindow'
import GoalScorerWindow from '../components/desktop/GoalScorerWindow'
import DirectiveNotification from '../components/desktop/DirectiveNotification'
import TerminalWindow from '../components/desktop/TerminalWindow'
import JoinEnding from '../components/desktop/JoinEnding'

// DEV SHORTCUT — remove before launch
const DEV_SKIP = new URLSearchParams(window.location.search).get('skip') === 'endings'

// Full-screen glitch overlay for final escape
function FinalGlitch({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999990, pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'fgBars 0.12s steps(1) infinite',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,255,224,0.06) 40px, rgba(0,255,224,0.06) 42px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        animation: 'fgShift 0.18s steps(1) infinite',
        backgroundColor: 'rgba(176,74,47,0.15)',
        mixBlendMode: 'screen',
      }} />
      <style>{`
        @keyframes fgBars {
          0%   { transform: translateX(0); }
          25%  { transform: translateX(-10px); }
          50%  { transform: translateX(7px); }
          75%  { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        @keyframes fgShift {
          0%   { opacity: 0; }
          20%  { opacity: 0.9; transform: translateX(14px); }
          40%  { opacity: 0; }
          60%  { opacity: 0.7; transform: translateX(-10px); }
          80%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes flickerOut {
          0%   { opacity: 1; }
          33%  { opacity: 0; }
          66%  { opacity: 0.8; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function flickerStyle(visible) {
  if (visible) return {}
  return {
    animation: 'flickerOut 0.25s steps(3) forwards',
    pointerEvents: 'none',
  }
}

export default function Desktop({
  isMonochrome,
  onMonochrome,
  showAbout,
  onAbout,
  onCloseAbout,
  enableAudio
}) {
  const [topNote, setTopNote] = useState(null)
  const [installedApps, setInstalledApps] = useState(DEV_SKIP ? ['needs','tools','world','folder','devices','goalscorer','terminal'] : [])
  const [showNeedsWindow, setShowNeedsWindow] = useState(false)
  const [showToolsWindow, setShowToolsWindow] = useState(false)
  const [toolsZ, setToolsZ] = useState(510)
  const [toolsMinimized, setToolsMinimized] = useState(false)
  const [idealVisible, setIdealVisible] = useState(DEV_SKIP)
  const [idealMinimized, setIdealMinimized] = useState(false)
  const [needsMinimized, setNeedsMinimized] = useState(false)
  const [folderVisible, setFolderVisible] = useState(DEV_SKIP)
  const [folderMinimized, setFolderMinimized] = useState(false)

  const [idealClosed, setIdealClosed] = useState(false)
  const [idealKey, setIdealKey] = useState(0)

  const [toolsResetKey, setToolsResetKey] = useState(0)
  const [needsResetKey, setNeedsResetKey] = useState(0)
  const [needsZ, setNeedsZ] = useState(510)
  const [needsVisited, setNeedsVisited] = useState(DEV_SKIP)

  const [showWorldWindow, setShowWorldWindow] = useState(false)
  const [worldMinimized, setWorldMinimized] = useState(false)
  const [worldZ, setWorldZ] = useState(510)
  const [worldResetKey, setWorldResetKey] = useState(0)

  const [showDevicesWindow, setShowDevicesWindow] = useState(false)
  const [devicesMinimized, setDevicesMinimized] = useState(false)
  const [devicesZ, setDevicesZ] = useState(510)

  const [showGoalScorerWindow, setShowGoalScorerWindow] = useState(false)
  const [goalScorerMinimized, setGoalScorerMinimized] = useState(false)
  const [goalScorerZ, setGoalScorerZ] = useState(510)
  const [goalScorerOpened, setGoalScorerOpened] = useState(DEV_SKIP)

  const [showDirective, setShowDirective] = useState(false)
  const [showTerminalWindow, setShowTerminalWindow] = useState(false)
  const [terminalMinimized, setTerminalMinimized] = useState(false)
  const [terminalZ, setTerminalZ] = useState(510)

  // Refuse flow
  const [refuseAttempt, setRefuseAttempt] = useState(0)
  const [iconContextMenu, setIconContextMenu] = useState(null)
  const [iconRemoved, setIconRemoved] = useState(false)
  const [folderRemoved, setFolderRemoved] = useState(false)
  const [folderContextMenu, setFolderContextMenu] = useState(null)
  const [showFinalGlitch, setShowFinalGlitch] = useState(false)
  const [showRefuseEndMessage, setShowRefuseEndMessage] = useState(false)
  const refuseTimerRef = useRef(null)

  // Join ending sequence
  const [joiningEnding, setJoiningEnding] = useState(false)
  const [joinPhase, setJoinPhase] = useState(0)
  const [joinDone, setJoinDone] = useState(false)
  const [showJoinMessage, setShowJoinMessage] = useState(false)
  const [joinMessageFading, setJoinMessageFading] = useState(false)
  const [shakeIntensity, setShakeIntensity] = useState(0)

  // Visibility flags driven by joinPhase
  const showBg = joinPhase < 1
  const showBreaking = joinPhase < 2
  const showTaskbarEl = joinPhase < 2
  const showTicker = joinPhase < 3
  const showColorScr = joinPhase < 4
  const showLiveMode = joinPhase < 5
  const showCamMusic = joinPhase < 6
  const showStickies = joinPhase < 7
  const showHabit = joinPhase < 8
  const showLauncher = joinPhase < 9

  const FOLDER_Z = 9999
  const IDEAL_MAX_Z = FOLDER_Z - 1

  const [idealZ, setIdealZ] = useState(500)
  const zCounter = useRef(500)

  const [theme, setTheme] = useState(DEV_SKIP ? 'red' : 'teal')
  const desktopDesaturated = idealVisible && !idealMinimized

  const handleJoin = useCallback(() => {
    setIdealVisible(false)
    setIdealMinimized(false)
    setFolderVisible(false)
    setFolderMinimized(false)
    setShowNeedsWindow(false)
    setShowToolsWindow(false)
    setShowWorldWindow(false)
    setShowDevicesWindow(false)
    setShowGoalScorerWindow(false)
    setShowTerminalWindow(false)
    setShowDirective(false)

    setJoiningEnding(true)
    setShowJoinMessage(true)

    setTimeout(() => setJoinMessageFading(true), 5000)
    setTimeout(() => {
      setShowJoinMessage(false)
      setJoinMessageFading(false)
    }, 5500)

    const FLICKER_START = 5500
    const PHASE_DURATION = 1200

    const phases = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    phases.forEach((phase, i) => {
      setTimeout(() => {
        setJoinPhase(phase)
        setShakeIntensity((i + 1) / phases.length)
      }, FLICKER_START + i * PHASE_DURATION)
    })

    const endTime = FLICKER_START + phases.length * PHASE_DURATION
    setTimeout(() => setShakeIntensity(0), endTime)
    setTimeout(() => setJoinDone(true), endTime + 400)
  }, [])

  const handleAccept = useCallback(() => {
    setIdealVisible(true)
    setIdealClosed(false)
  }, [])

  const handleReachUncertainty = useCallback(() => {
    setTimeout(() => setInstalledApps(prev => prev.includes('needs') ? prev : [...prev, 'needs']), 600)
    setTimeout(() => setInstalledApps(prev => prev.includes('tools') ? prev : [...prev, 'tools']), 2800)
    setTimeout(() => setInstalledApps(prev => prev.includes('world') ? prev : [...prev, 'world']), 4200)
  }, [])

  const handleIdealClose = useCallback(() => {
    setTheme('teal')
    setIdealClosed(true)
    setIdealVisible(false)
    setIdealMinimized(false)
    setInstalledApps([])
    setFolderVisible(false)
    setFolderMinimized(false)
    setIdealKey(k => k + 1)
  }, [])

  const handleIdealRestore = useCallback(() => {
    setIdealMinimized(false)
    setIdealVisible(true)
  }, [])

  const handleOpenFolder = useCallback(() => {
    setInstalledApps(prev => prev.includes('folder') ? prev : [...prev, 'folder'])
    setFolderVisible(true)
    setFolderMinimized(false)
    zCounter.current += 1
  }, [])

  const handleDownloadCatalog = useCallback(() => {
    setInstalledApps(prev => prev.includes('devices') ? prev : [...prev, 'devices'])
    setShowDevicesWindow(true)
    setDevicesMinimized(false)
    zCounter.current += 1
    setDevicesZ(zCounter.current)
  }, [])

  const handleInstallGoalScorer = useCallback(() => {
    setInstalledApps(prev => prev.includes('goalscorer') ? prev : [...prev, 'goalscorer'])
  }, [])

  const handleEndpointsMount = useCallback(() => {
    setShowDirective(true)
    setInstalledApps(prev => prev.includes('terminal') ? prev : [...prev, 'terminal'])
  }, [])

  const handleRefuse = useCallback(() => {
    setIdealVisible(false)
    setIdealMinimized(false)
    if (refuseTimerRef.current) clearTimeout(refuseTimerRef.current)

    setRefuseAttempt(prev => {
      const next = prev + 1
      if (next > 3) return prev
      refuseTimerRef.current = setTimeout(() => {
        setIdealKey(k => k + 1)
        setIdealVisible(true)
        setIdealClosed(false)
      }, 3000)
      return next
    })
  }, [])

  const handleFinalEscape = useCallback(() => {
    setIdealVisible(false)
    setIdealMinimized(false)
    setShowFinalGlitch(true)
  }, [])

  const handleFinalGlitchDone = useCallback(() => {
    setShowFinalGlitch(false)
  }, [])

  const handleRemoveIcon = useCallback(() => {
    setIconContextMenu(null)
    setIconRemoved(true)
    setIdealVisible(false)
    setIdealMinimized(false)
    setIdealClosed(false)
    setRefuseAttempt(0)
    if (refuseTimerRef.current) clearTimeout(refuseTimerRef.current)
    if (folderRemoved) {
      setTimeout(() => {
        setShowRefuseEndMessage(true)
        setTimeout(() => setShowRefuseEndMessage(false), 7000)
      }, 400)
    }
  }, [folderRemoved])

  const handleRemoveFolder = useCallback(() => {
    setFolderContextMenu(null)
    setFolderVisible(false)
    setFolderMinimized(false)
    setFolderRemoved(true)
    if (iconRemoved) {
      setTimeout(() => {
        setShowRefuseEndMessage(true)
        setTimeout(() => setShowRefuseEndMessage(false), 7000)
      }, 400)
    }
  }, [iconRemoved])

  const handleIconContextMenu = useCallback((e) => {
    e.preventDefault()
    setIconContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleFolderContextMenu = useCallback((e) => {
    e.preventDefault()
    setFolderContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const folderInstalledFiles = useMemo(() => [
    installedApps.includes('needs') ? { id: 'needs', label: 'MASLOWS_NEEDS', type: '.exe', onReset: () => setNeedsResetKey(k => k + 1) } : null,
    installedApps.includes('tools') ? { id: 'tools', label: 'PRECEDENTS', type: '.exe', onReset: () => setToolsResetKey(k => k + 1) } : null,
    installedApps.includes('world') ? {
      id: 'world', label: 'YOU_N_WRLD', type: '.exe',
      onReset: () => {
        localStorage.removeItem('ideal_world_selections')
        localStorage.removeItem('ideal_world_values')
        localStorage.removeItem('ideal_world_fears')
        setWorldResetKey(k => k + 1)
      },
    } : null,
    installedApps.includes('devices') ? { id: 'devices', label: 'PRODUCT_CATALOG', type: '.exe' } : null,
    installedApps.includes('goalscorer') ? { id: 'goalscorer', label: 'GOAL_SCORER', type: '.exe' } : null,
    installedApps.includes('terminal') ? { id: 'terminal', label: 'IDEAL_TERMINAL', type: '.glb' } : null,
  ].filter(Boolean), [installedApps])

  const handleFolderFileClick = useCallback(id => {
    if (id === 'needs') {
      setNeedsVisited(true)
      setShowNeedsWindow(true)
      setNeedsMinimized(false)
      zCounter.current += 1
      setNeedsZ(zCounter.current)
    }
    else if (id === 'tools') { setShowToolsWindow(true); setToolsMinimized(false); zCounter.current += 1; setToolsZ(zCounter.current) }
    else if (id === 'world') { setShowWorldWindow(true); setWorldMinimized(false); zCounter.current += 1; setWorldZ(zCounter.current) }
    else if (id === 'devices') { setShowDevicesWindow(true); setDevicesMinimized(false); zCounter.current += 1; setDevicesZ(zCounter.current) }
    else if (id === 'goalscorer') { setShowGoalScorerWindow(true); setGoalScorerOpened(true); setGoalScorerMinimized(false); zCounter.current += 1; setGoalScorerZ(zCounter.current) }
    else if (id === 'terminal') { setShowTerminalWindow(true); setTerminalMinimized(false); zCounter.current += 1; setTerminalZ(zCounter.current) }
  }, [])

  const ICON_SIZE = 'clamp(36px, 4vw, 64px)'
  const ICON_FONT = 'clamp(12px, 0.9vw, 18px)'
  const chromeColor = theme === 'red' ? '#b04a2f' : 'var(--teal-deep)'
  const chromeBorder = theme === 'red' ? 'var(--yellow)' : 'var(--teal-bright)'
  const chromeButtonColor = theme === 'red' ? '#f5f3ef' : 'var(--yellow)'

  const shakeAnimation = shakeIntensity > 0
    ? `${shakeIntensity > 0.5 ? 'shakeHard' : 'shakeGentle'} ${(0.13 - shakeIntensity * 0.06).toFixed(3)}s steps(1) infinite`
    : undefined

  const canRightClickFolder = refuseAttempt >= 3 || iconRemoved

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: joinDone ? '#f5f3ef' : joiningEnding ? '#000000' : 'var(--teal-deep)',
        transition: 'background-color 0.4s ease',
        position: 'relative',
        overflow: 'hidden',
        animation: shakeAnimation,
      }}
      onClick={() => {
        if (iconContextMenu) setIconContextMenu(null)
        if (folderContextMenu) setFolderContextMenu(null)
      }}
    >
      <style>{`
        @keyframes flickerOut {
          0%   { opacity: 1; }
          33%  { opacity: 0; }
          66%  { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes shakeGentle {
          0%   { transform: translate(0, 0) rotate(0deg); }
          20%  { transform: translate(1px, -1px) rotate(0.1deg); }
          40%  { transform: translate(-1px, 1px) rotate(-0.1deg); }
          60%  { transform: translate(2px, 0px) rotate(0.05deg); }
          80%  { transform: translate(-1px, 1px) rotate(0deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes shakeHard {
          0%   { transform: translate(0, 0) rotate(0deg); }
          15%  { transform: translate(-4px, 3px) rotate(-0.3deg); }
          30%  { transform: translate(5px, -3px) rotate(0.4deg); }
          45%  { transform: translate(-3px, 4px) rotate(-0.2deg); }
          60%  { transform: translate(4px, -2px) rotate(0.3deg); }
          75%  { transform: translate(-5px, 2px) rotate(-0.4deg); }
          90%  { transform: translate(3px, -4px) rotate(0.2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes joinMsgIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes joinMsgOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes refuseEndFade {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          78%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Join message overlay */}
      {showJoinMessage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999995,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          animation: joinMessageFading
            ? 'joinMsgOut 0.5s ease forwards'
            : 'joinMsgIn 0.5s ease forwards',
        }}>
          <p style={{
            color: '#b04a2f',
            fontFamily: 'Arial Narrow, Arial, sans-serif',
            fontSize: 'clamp(18px, 2vw, 36px)',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textAlign: 'center',
            lineHeight: 1.8,
            maxWidth: '60vw',
          }}>
            Permission received.<br />
            Thank you for choosing IDEAL.<br />
            We will now begin initialization.
          </p>
        </div>
      )}

      <div style={{
        filter: desktopDesaturated ? 'grayscale(1)' : 'grayscale(0)',
        transition: 'filter 0.6s ease',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto' }}>

          <div style={flickerStyle(showBg)}>
            <RoomBackground />
          </div>

          <div style={flickerStyle(showTicker)}>
            <Ticker />
          </div>

          <div style={flickerStyle(showStickies)}>
            <StickyNote
              title="TO-DO LIST" initialX={0.26} initialY={0.37} fontSize="clamp(15px, 1vw, 24px)"
              zIndex={topNote === 'todo' ? 30 : 20} onFocus={() => setTopNote('todo')}
              items={['# URGENT', 'Call Mom', 'Apply to AT LEAST 10 jobs', 'Meal prep', 'Email landlord about leak', '', '# DO BY END OF WEEK!!!', 'User journey outline', 'Finish paper edits', 'Sign up for volunteering', 'Book dentist appointment']}
              error="nice try."
            />
            <StickyNote
              static
              width="clamp(120px, 16vw, 300px)"
              title="!!!" initialX={0.37} initialY={0.22} fontSize="clamp(16px, 1.5vw, 32px)"
              zIndex={topNote === 'affirmation' ? 30 : 20} onFocus={() => setTopNote('affirmation')}
              items={['"Become addicted \n to constant and \n never-ending self \n improvement."']}
              error="you need this one."
            />
            <NoteToSelf />
          </div>

          <div style={flickerStyle(showLiveMode)}>
            <MoodSelector />
            <LiveIndicator />
          </div>

          <div style={flickerStyle(showCamMusic)}>
            <CameraLog />
            <MusicPlayer enableAudio={enableAudio} />
          </div>

          <div style={flickerStyle(showBreaking)}>
            <BreakingNews />
          </div>

          <div style={flickerStyle(showColorScr)}>
            <ColorScroller />
          </div>

          <div style={flickerStyle(showHabit)}>
            <HabitTracker />
          </div>

          <div style={flickerStyle(showTaskbarEl)}>
            <Taskbar
              isMonochrome={isMonochrome} onMonochrome={onMonochrome} onAbout={onAbout}
              idealActive={idealMinimized} onRestoreIdeal={handleIdealRestore}
              needsActive={needsMinimized} onRestoreNeeds={() => setNeedsMinimized(false)}
              toolsActive={toolsMinimized} onRestoreTools={() => setToolsMinimized(false)}
              worldActive={worldMinimized} onRestoreWorld={() => setWorldMinimized(false)}
              folderActive={folderMinimized} onRestoreFolder={() => { setFolderMinimized(false); setFolderVisible(true); zCounter.current += 1 }}
              devicesActive={devicesMinimized} onRestoreDevices={() => setDevicesMinimized(false)}
              goalScorerActive={goalScorerMinimized} onRestoreGoalScorer={() => setGoalScorerMinimized(false)}
            />
          </div>

        </div>
      </div>

      {showAbout && <AboutWindow onClose={onCloseAbout} />}

      {/* Desktop icons + windows */}
      <div style={flickerStyle(showLauncher)}>

        {/* Folder desktop icon */}
        {installedApps.includes('folder') && !folderRemoved && (
          <div
            onClick={() => { setFolderVisible(true); setFolderMinimized(false); zCounter.current += 1 }}
            onContextMenu={canRightClickFolder ? handleFolderContextMenu : undefined}
            style={{ position: 'absolute', left: '55vw', top: '45vh', zIndex: 50, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vh', userSelect: 'none' }}
          >
            <div style={{ width: ICON_SIZE, height: ICON_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 64 64" width="100%" height="100%">
                <path d="M6 18h22l6 6h24v28H6z" fill="var(--teal-deep)" stroke="var(--teal-bright)" strokeWidth="3" shapeRendering="crispEdges" />
                <path d="M6 18h22l4 4H6z" fill="var(--teal-deep)" stroke="var(--teal-bright)" strokeWidth="3" shapeRendering="crispEdges" />
              </svg>
            </div>
            <span style={{ color: 'var(--white)', fontFamily: 'var(--font-mono)', fontSize: ICON_FONT, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: '1px 0.31vw' }}>
              YOUR_IDEAL_LIFE
            </span>
          </div>
        )}

        {/* Launcher icon */}
        {!iconRemoved && !joiningEnding && (
          <IdealLauncher
            onAccept={handleAccept}
            onDecline={() => { }}
            onRestoreWindow={idealVisible || idealMinimized ? handleIdealRestore : null}
            onContextMenu={refuseAttempt >= 3 && !showFinalGlitch ? handleIconContextMenu : undefined}
          />
        )}

        {/* IdealWindow */}
        {idealVisible && !idealClosed && (
          <IdealWindow
            key={idealKey}
            onMinimize={() => setIdealMinimized(true)}
            onClose={handleIdealClose}
            onReachUncertainty={handleReachUncertainty}
            isMinimized={idealMinimized}
            needsVisited={needsVisited}
            onDownloadCatalog={handleDownloadCatalog}
            onEndpointsMount={handleEndpointsMount}
            zIndex={idealZ}
            onFocus={() => { zCounter.current += 1; setIdealZ(Math.min(zCounter.current, IDEAL_MAX_Z)) }}
            onOpenFolder={handleOpenFolder}
            onThemeChange={() => setTheme('red')}
            chromeColor={chromeColor}
            chromeBorder={chromeBorder}
            onGoalsMount={handleInstallGoalScorer}
            onGoalScorerOpened={() => setGoalScorerOpened(true)}
            goalScorerOpened={goalScorerOpened}
            refuseAttempt={refuseAttempt}
            onRefuse={handleRefuse}
            onFinalEscape={handleFinalEscape}
            onJoin={handleJoin}
          />
        )}

        {/* FolderWindow */}
        {installedApps.includes('folder') && !folderRemoved && (
          <FolderWindow
            installedFiles={folderInstalledFiles} onFileClick={handleFolderFileClick}
            onClose={() => { setFolderVisible(false); setFolderMinimized(false) }}
            onFocus={() => { }} onMinimize={() => setFolderMinimized(true)}
            zIndex={FOLDER_Z} isMinimized={folderMinimized || !folderVisible}
            chromeColor={chromeColor} chromeBorder={chromeBorder} chromeButtonColor={chromeButtonColor}
            onContextMenu={canRightClickFolder ? handleFolderContextMenu : undefined}
          />
        )}

        {installedApps.includes('needs') && (
          <NeedsWindow key={`needs-${needsResetKey}`} onClose={() => setShowNeedsWindow(false)} onFocus={() => { zCounter.current += 1; setNeedsZ(zCounter.current) }} onMinimize={() => setNeedsMinimized(true)} zIndex={needsZ} isMinimized={needsMinimized || !showNeedsWindow} />
        )}
        {installedApps.includes('tools') && (
          <ToolsWindow key={`tools-${toolsResetKey}`} onClose={() => setShowToolsWindow(false)} onFocus={() => { zCounter.current += 1; setToolsZ(zCounter.current) }} onMinimize={() => setToolsMinimized(true)} zIndex={toolsZ} isMinimized={toolsMinimized || !showToolsWindow} />
        )}
        {installedApps.includes('world') && (
          <WorldWindow key={`world-${worldResetKey}`} onClose={() => setShowWorldWindow(false)} onFocus={() => { zCounter.current += 1; setWorldZ(zCounter.current) }} onMinimize={() => setWorldMinimized(true)} zIndex={worldZ} isMinimized={worldMinimized || !showWorldWindow} />
        )}
        {installedApps.includes('devices') && (
          <DevicesWindow onClose={() => setShowDevicesWindow(false)} onFocus={() => { zCounter.current += 1; setDevicesZ(zCounter.current) }} onMinimize={() => setDevicesMinimized(true)} zIndex={devicesZ} isMinimized={devicesMinimized || !showDevicesWindow} />
        )}
        {installedApps.includes('goalscorer') && (
          <GoalScorerWindow onClose={() => setShowGoalScorerWindow(false)} onFocus={() => { zCounter.current += 1; setGoalScorerZ(zCounter.current) }} onMinimize={() => setGoalScorerMinimized(true)} onOpen={() => setGoalScorerOpened(true)} zIndex={goalScorerZ} isMinimized={goalScorerMinimized || !showGoalScorerWindow} apiKey={import.meta.env.VITE_ANTHROPIC_KEY} />
        )}
        {showDirective && (
          <DirectiveNotification onDismiss={() => setShowDirective(false)} apiKey={import.meta.env.VITE_ANTHROPIC_KEY} />
        )}
        {installedApps.includes('terminal') && (
          <TerminalWindow onClose={() => setShowTerminalWindow(false)} onFocus={() => { zCounter.current += 1; setTerminalZ(zCounter.current) }} onMinimize={() => setTerminalMinimized(true)} zIndex={terminalZ} isMinimized={terminalMinimized || !showTerminalWindow} />
        )}
      </div>

      {/* Final escape glitch */}
      {showFinalGlitch && <FinalGlitch onDone={handleFinalGlitchDone} />}

      {/* Launcher right-click context menu */}
      {iconContextMenu && !iconRemoved && (
        <>
          <div onClick={() => setIconContextMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 99998 }} />
          <div style={{ position: 'fixed', left: iconContextMenu.x, top: iconContextMenu.y, zIndex: 99999, backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.7)' }}>
            <div style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', borderBottom: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.06em' }}>
              IDEAL_LAUNCHER
            </div>
            <button
              onClick={handleRemoveIcon}
              style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textAlign: 'left', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Remove
            </button>
          </div>
        </>
      )}

      {/* Folder right-click context menu */}
      {folderContextMenu && !folderRemoved && (
        <>
          <div onClick={() => setFolderContextMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 99998 }} />
          <div style={{ position: 'fixed', left: folderContextMenu.x, top: folderContextMenu.y, zIndex: 99999, backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.7)' }}>
            <div style={{ padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', borderBottom: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.06em' }}>
              YOUR_IDEAL_LIFE
            </div>
            <button
              onClick={handleRemoveFolder}
              style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', textAlign: 'left', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Remove
            </button>
          </div>
        </>
      )}

      {/* Both-deleted ending flash */}
      {showRefuseEndMessage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999997,
          pointerEvents: 'none',
          animation: 'refuseEndFade 7s ease forwards',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            textTransform: 'uppercase',
            lineHeight: 2.4,
            backgroundColor: 'rgba(0,0,0,0.75)',
            padding: '15px 25px',
          }}>
            That's okay.<br />
            <span style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
              Just know the option always stands.
            </span>
          </p>
        </div>
      )}

      {/* IdealWindow close confirmation dialog */}
      {idealClosed && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div style={{ width: 'clamp(300px, 34.7vw, 560px)', backgroundColor: 'var(--black)', border: '2px solid var(--teal-bright)', padding: 'clamp(20px, 2.78vw, 44px)', textAlign: 'center' }}>
            <p style={{ color: 'var(--white)', fontFamily: 'Arial Narrow, Arial, sans-serif', fontSize: 'clamp(16px, 1.75vw, 32px)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: 'clamp(10px, 1.39vw, 22px)' }}>That's ok.</p>
            <p style={{ color: 'var(--grey-light)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(15px, 1.2vw, 24px)', lineHeight: '1.8', marginBottom: 'clamp(18px, 2.43vw, 40px)' }}>
              Take your time. IDEAL will be here when you're ready.
            </p>
            <button onClick={() => setIdealClosed(false)} style={{ width: '100%', padding: 'clamp(6px, 0.69vw, 12px)', fontFamily: 'Arial Narrow, Arial, sans-serif', fontSize: 'clamp(16px, 1.5vw, 32px)', fontWeight: '700', letterSpacing: '0.08em', cursor: 'pointer', border: '1px solid var(--teal-bright)', backgroundColor: 'var(--teal-deep)', color: 'var(--teal-bright)' }}>
              I UNDERSTAND
            </button>
          </div>
        </div>
      )}

      {/* Join ending — overlays everything once sequence is done */}
      {joinDone && <JoinEnding onAbout={onAbout} />}
    </div>
  )
}