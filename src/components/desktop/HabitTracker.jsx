const HABITS = [
    {
      name: 'EXERCISE',
      color: 'var(--yellow)',
      days: [1,1,0,1,1,0,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,0,1,1,0,1,0,1],
    },
    {
      name: 'JOURNALING',
      color: 'var(--purple)',
      days: [1,1,1,1,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,1,0,0],
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
  
  const getLongestStreak = (days) => {
    let longest = 0
    let current = 0
    for (const d of days) {
      if (d === 1) {
        current++
        longest = Math.max(longest, current)
      } else {
        current = 0
      }
    }
    return longest
  }
  
export default function HabitTracker() {
  return (
    <div style={{
      position: 'absolute',
      left: 0,
        top: '12.2vh',          
        width: '20vw',
        height: '32.8vh',        
        backgroundColor: 'var(--black)',
        borderRight: '3px solid var(--teal-deep)',
        padding: 'clamp(8px, 0.87vw, 14px)',
        zIndex: 20,
        userSelect: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '1.75vh',
    }}>
      <div style={{
        color: 'var(--teal-bright)',
        fontFamily: 'Arial Narrow, Arial, sans-serif',
        fontSize: 'clamp(14px, 1vw, 20px)',
        fontWeight: '700',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        Habit Tracker
      </div>
      {HABITS.map((habit) => {
        const streak = getCurrentStreak(habit.days)
        const longest = getLongestStreak(habit.days)
  
          return (
            <div key={habit.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.75vh' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
                <span style={{
                  color: habit.color,
                  fontFamily: 'Arial Narrow, Arial, sans-serif',
                  fontSize: 'clamp(16px, 1.5vw, 32px)',
                  letterSpacing: '0.1em',
                }}>
                  {habit.name}
                </span>
                <span style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(12px, 0.9vw, 18px)',
                }}>
                  {streak > 0 ? `${streak}` : '0'} · best {longest}
                </span>
              </div>
  
              {/* Grid of squares */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.26vw',       /* 3 * 1.111 / 1280 * 100 */
              }}>
                {habit.days.map((filled, i) => (
                  <div
                    key={i}
                    style={{
                      width: '1.56vw',     /* 18 * 1.111 / 1280 * 100 */
                      height: '1.56vw',    /* keeping square so using vw for both */
                      backgroundColor: filled
                        ? habit.color
                        : 'rgba(255,255,255,0.08)',
                      opacity: filled ? (i === habit.days.length - 1 ? 1 : 0.7) : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
