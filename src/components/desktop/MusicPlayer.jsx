import { useState, useRef, useEffect } from 'react'

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const draggingRef = useRef(false)
  const didDragRef = useRef(false)
  const audioRef = useRef(null)
  const circleRef = useRef(null)

  const SIZE = Math.min(Math.round(window.innerWidth * 0.15), 400)
  const RADIUS = Math.round(SIZE * 0.4)
  const CENTER = Math.round(SIZE / 2)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration)
      }
    }

    const tryAutoplay = async () => {
      try {
        await audio.play()
        setPlaying(true)
      } catch (err) {}
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('canplay', tryAutoplay, { once: true })
    tryAutoplay()

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('canplay', tryAutoplay)
    }
  }, [])

  const togglePlay = async () => {
    if (didDragRef.current) {
      didDragRef.current = false
      return
    }
    const audio = audioRef.current
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch (err) {}
    }
  }

  const angleToProgress = (angle) => ((angle + 90) % 360) / 360
  const progressToAngle = (progress) => (progress * 360 - 90 + 360) % 360

  const getMouseAngle = (e) => {
    const rect = circleRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    return (angle + 360) % 360
  }

  const onMouseDown = (e) => {
    e.stopPropagation()
    draggingRef.current = true
    didDragRef.current = false
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e) => {
    if (!draggingRef.current) return
    didDragRef.current = true
    const angle = getMouseAngle(e)
    const newProgress = angleToProgress(angle)
    setProgress(newProgress)
    if (audioRef.current.duration) {
      audioRef.current.currentTime = newProgress * audioRef.current.duration
    }
  }

  const onMouseUp = () => {
    draggingRef.current = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  const angle = progressToAngle(progress)
  const rad = (angle * Math.PI) / 180
  const knobX = CENTER + RADIUS * Math.cos(rad)
  const knobY = CENTER + RADIUS * Math.sin(rad)

  return (
    <div style={{
      position: 'absolute',
      right: 'clamp(40px, 6.25vw, 120px)',   
      top: '33vh',                          
      border: '3px solid var(--teal-deep)',
      zIndex: 20,
      userSelect: 'none',
    }}>
      <audio ref={audioRef} src="/affirmations_432HZ.mp3" loop autoPlay />

      <div
        onClick={togglePlay}
        style={{
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          backgroundColor: playing ? 'var(--magenta)' : 'var(--purple)',
          transition: 'background-color 0.3s',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {/* Album art circle */}
        <img
          src="/affirmations_432HZ_cover.webp"
          alt=""
          style={{
            position: 'absolute',
            inset: `${CENTER - RADIUS}px`,
            width: `${RADIUS * 2}px`,
            height: `${RADIUS * 2}px`,
            borderRadius: '50%',
            objectFit: 'cover',
            filter: 'saturate(1.2) hue-rotate(270deg) brightness(0.3)',
            zIndex: 1,
          }}
        />

        {/* SVG scrubber */}
        <svg
          ref={circleRef}
          width={SIZE}
          height={SIZE}
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="var(--teal-deep)"
            strokeWidth="2"
          />
          <circle
            cx={knobX}
            cy={knobY}
            r={Math.round(SIZE * 0.05)}          /* 15/300 = 0.05 */
            fill="var(--teal-bright)"
            stroke="var(--teal-deep)"
            strokeWidth="2"
            style={{ cursor: 'grab' }}
            onMouseDown={onMouseDown}
          />
        </svg>

        {/* Playlist name */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
          <div style={{
            color: 'var(--magenta)',
            fontFamily: 'Arial Narrow, Arial, sans-serif',
            fontSize: `clamp(20px, ${SIZE * 0.107}px, 52px)`,   /* 32/300 = 0.107 */
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: '0.9',
            transform: 'scaleY(2)',
          }}>
            AFFIRMATION<br />AUDIO 432HZ
          </div>
        </div>
      </div>
    </div>
  )
}
