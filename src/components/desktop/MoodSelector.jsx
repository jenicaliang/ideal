import { useState } from 'react'

const MOODS = [':)', ':(', '>:(', ":'("]

const RESPONSES = {
  ':)': "glad you're feeling good! memory updated.",
  ':(': "sorry to hear that. feel better soon! memory updated.",
  '>:(': "sorry to hear that. feel better soon! memory updated.",
  ":'(": "sorry to hear that. feel better soon! memory updated.",
}

export default function MoodSelector() {
  const [response, setResponse] = useState(null)
  const [askingSure, setAskingSure] = useState(false)

  const handleMood = (mood) => {
    setAskingSure(false)
    setResponse(RESPONSES[mood])
    setTimeout(() => setResponse(null), 4000)
  }

  return (
    <div style={{
      position: 'absolute',
      right: '1.5vw',        
      top: '15vh',    
      width: 'clamp(150px, 18vw, 350px)',
      zIndex: 20,
      userSelect: 'none',
      border: 'none',
    }}>
      {/* Main black body */}
      <div style={{
        backgroundColor: 'var(--black)',
        padding: 'clamp(10px, 1.2vw, 22px)',
        borderLeft: '2px solid var(--teal-deep)',
        borderRight: '2px solid var(--teal-deep)',
        borderTop: '2px solid var(--teal-deep)',
      }}>
        <div style={{
          color: 'var(--magenta)',
          fontFamily: 'Arial Narrow, Arial, sans-serif',
          fontSize: 'clamp(16px, 1.3vw, 32px)',
          textAlign: 'center',
          marginBottom: 'clamp(12px, 1vw, 22px)',
        }}>
          HOW ARE WE FEELING???
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}>
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => handleMood(mood)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--magenta)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(15px, 1.3vw, 24px)',
                cursor: 'pointer',
                padding: 'clamp(2px, 0.35vw, 6px)',
              }}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom teal section */}
      <div style={{
        backgroundColor: 'var(--teal-deep)',
        padding: 'clamp(6px, 0.69vw, 12px) clamp(10px, 1.04vw, 18px)',
        borderLeft: '2px solid var(--teal-deep)',
        borderRight: '2px solid var(--teal-deep)',
        borderBottom: '2px solid var(--teal-deep)',
        minHeight: 'clamp(25px, 4.2vh, 52px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
        {response ? (
          <div style={{
            color: 'var(--green)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px, 0.9vw, 18px)',
          }}>
            {response}
          </div>
        ) : askingSure ? (
          <div style={{
            color: 'var(--green)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(12px, 0.9vw, 18px)',
          }}>
            are you sure?
          </div>
        ) : (
          <div
            onClick={() => setAskingSure(true)}
            style={{
              color: 'var(--green)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(10px, 0.9vw, 18px)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            I'm feeling something else
          </div>
        )}
      </div>
    </div>
  )
}