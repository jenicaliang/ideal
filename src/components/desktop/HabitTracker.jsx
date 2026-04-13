import { useState } from 'react'

const INITIAL_HABITS = [
  {
    name: 'EXERCISE',
    color: 'var(--yellow)',
    days: [1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
  },
  {
    name: 'JOURNALING',
    color: 'var(--purple)',
    days: [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0],
  },
]

const getCurrentStreak = (days) => {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i] === 1) streak++
    else break
  }
  return streak
}

const getCompletionRate = (days) => {
  return Math.round((days.filter(d => d === 1).length / days.length) * 100)
}

const now = new Date()
const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()

export default function HabitTracker() {
  const [habits, setHabits] = useState(INITIAL_HABITS)
  const [flashName, setFlashName] = useState(null)


  const toggleToday = (habitName) => {
    setHabits(prev => prev.map(h => {
      if (h.name !== habitName) return h
      const days = [...h.days]
      days[days.length - 1] = days[days.length - 1] === 1 ? 0 : 1
      return { ...h, days }
    }))
    setFlashName(habitName)
    setTimeout(() => setFlashName(null), 2500)
  }

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      top: '12.2vh',
      width: '20vw',
      height: '32.8vh',
      backgroundColor: 'var(--black)',
      borderRight: '3px solid var(--teal-deep)',
      padding: 'clamp(6px, 0.9vw, 14px)',
      zIndex: 20,
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '1vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '0.5vh',
        flexShrink: 0,
      }}>
        <div style={{
          color: 'var(--teal-bright)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'var(--size-label)',
          fontWeight: '700',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Habit Tracker
        </div>
        <div style={{
          color: 'var(--grey-light)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--size-label)',
          letterSpacing: '0.08em',
        }}>
          {dateLabel}
        </div>
      </div>


      {/* Habits */}
      {habits.map((habit) => {
        const streak = getCurrentStreak(habit.days)
        const rate = getCompletionRate(habit.days)

        return (
          <div key={habit.name} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4vh',
            flexShrink: 0,
          }}>

            {/* Name */}
            <span style={{
              color: habit.color,
              fontFamily: 'Arial Narrow, Arial, sans-serif',
              fontSize: 'var(--size-label)',
              letterSpacing: '0.1em',
              fontWeight: '700',
            }}>
              {habit.name}
            </span>

            {/* Streak + completion rate */}
            <span style={{
              color: streak > 0 ? habit.color : 'var(--grey-light)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--size-label)',
              letterSpacing: '0.04em',
            }}>
              {streak > 0 ? `↑ ${streak} day streak` : '— no streak'}
            </span>

            {/* Completion bar */}
            <div style={{
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}>
              <div style={{
                width: `${rate}%`,
                height: '100%',
                backgroundColor: habit.color,
                opacity: 0.6,
              }} />
            </div>

            {/* Grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.22vw',
            }}>
              {habit.days.map((filled, i) => {
                const isToday = i === habit.days.length - 1
                return (
                  <div
                    key={i}
                    onClick={isToday ? () => toggleToday(habit.name) : undefined}
                    style={{
                      width: 'clamp(8px, 1.1vw, 18px)',
                      height: 'clamp(8px, 1.1vw, 18px)',
                      backgroundColor: filled ? habit.color : 'rgba(255,255,255,0.07)',
                      opacity: filled ? (isToday ? 1 : 0.65) : 1,
                      outline: isToday ? '1px solid rgba(255,255,255,0.5)' : 'none',
                      outlineOffset: '1px',
                      boxSizing: 'border-box',
                      cursor: isToday ? 'pointer' : 'default',
                    }}
                  />
                )
              })}
            </div>

          </div>
        )
      })}
      {/* Flash message */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(6px, 0.9vw, 14px)',
        left: 'clamp(6px, 0.9vw, 14px)',
        right: 'clamp(6px, 0.9vw, 14px)',
        color: 'var(--grey-light)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--size-label)',
        letterSpacing: '0.04em',
        opacity: flashName ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}>
        {flashName && (habits.find(h => h.name === flashName)?.days.slice(-1)[0] === 1
          ? 'if you say so.'
          : 'unmarked.'
        )}
      </div>
    </div>
  )
}