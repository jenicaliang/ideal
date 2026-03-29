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

export default function Desktop({ onLaunchIdeal, isMonochrome, onMonochrome, showAbout, onAbout, onCloseAbout }) {
  const [topNote, setTopNote] = useState(null)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--teal-deep)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <RoomBackground />
      <Ticker />
      <StickyNote
        title="TO-DO LIST"
        initialX={0.26}   
        initialY={0.35} 
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
        idealActive={false}
      />
      {showAbout && <AboutWindow onClose={onCloseAbout} />}
      <IdealLauncher
  onAccept={onLaunchIdeal}
  onDecline={() => {}}
/>
    </div>
  )
}