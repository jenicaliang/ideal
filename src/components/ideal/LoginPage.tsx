import { useEffect, useRef, useState } from 'react'

const css = (v: string) => `var(${v})`
const CAM_SIZE = 160

function PixelButton({ children, onClick, disabled = false, position = 'solo' }: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  position?: 'solo' | 'left' | 'right'
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: css('--mono'),
        fontSize: css('--size-button'),
        fontWeight: 400,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        background: disabled ? 'transparent' : hovered ? css('--ink') : 'transparent',
        borderTop: `1.5px solid ${css('--ink')}`,
        borderBottom: `1.5px solid ${css('--ink')}`,
        borderLeft: `1.5px solid ${css('--ink')}`,
        borderRight: position === 'left' ? 'none' : `1.5px solid ${css('--ink')}`,
        borderRadius: position === 'solo' ? css('--radius') : 0,
        padding: '6px 18px',
        color: disabled ? css('--mid') : hovered ? css('--bg') : css('--ink'),
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}

function BottomBar({ onBack, onNext, onCancel, backDisabled = false, nextLabel = 'Next >' }: {
  onBack: () => void
  onNext: () => void
  onCancel: () => void
  backDisabled?: boolean
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
      <div style={{
        position: 'absolute',
        top: 0,
        left: 'clamp(12px, 1.5vw, 24px)',
        right: 'clamp(12px, 1.5vw, 24px)',
        height: '1px',
        backgroundColor: css('--mid'),
        opacity: 0.4,
      }} />

      {/* Back + Next flush together */}
      <div style={{ display: 'flex' }}>
  <PixelButton onClick={onBack} disabled={backDisabled} position='left'>
    {'< Back'}
  </PixelButton>
  <PixelButton onClick={onNext} position='right'>
    {nextLabel}
  </PixelButton>
</div>
<PixelButton onClick={onCancel} position='solo'>
  Cancel
</PixelButton>
    </div>
  )
}

function WebcamCapture({ onCaptured }: { onCaptured: (v: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loopRef = useRef<ReturnType<typeof setInterval>>()
  const [status, setStatus] = useState<'idle' | 'active' | 'captured'>('idle')
  const NATIVE = 64

  function drawPlaceholder() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const S = CAM_SIZE * dpr
    canvas.width = S
    canvas.height = S
    canvas.style.width = `${CAM_SIZE}px`
    canvas.style.height = `${CAM_SIZE}px`
    const ctx = canvas.getContext('2d')!
    const sc = S / 64
    ctx.fillStyle = '#b8b5b0'
    ctx.fillRect(0, 0, S, S)
    ctx.strokeStyle = '#82807c'
    ctx.lineWidth = dpr * 1.5
    ctx.lineCap = 'square'
    ctx.lineJoin = 'miter'
    ctx.strokeRect(16 * sc, 23 * sc, 32 * sc, 20 * sc)
    ctx.beginPath()
    ctx.arc(32 * sc, 33 * sc, 6 * sc, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(22 * sc, 23 * sc)
    ctx.lineTo(22 * sc, 19 * sc)
    ctx.lineTo(27 * sc, 19 * sc)
    ctx.lineTo(27 * sc, 23 * sc)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(4 * sc, 4 * sc)
    ctx.lineTo(60 * sc, 60 * sc)
    ctx.stroke()
  }

  function drawPixelFrame() {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    if (canvas.width !== NATIVE) {
      canvas.width = NATIVE
      canvas.height = NATIVE
      canvas.style.width = `${CAM_SIZE}px`
      canvas.style.height = `${CAM_SIZE}px`
    }
    const ctx = canvas.getContext('2d')!
    const off = document.createElement('canvas')
    off.width = NATIVE
    off.height = NATIVE
    const oc = off.getContext('2d')!
    oc.drawImage(video, 0, 0, NATIVE, NATIVE)
    const img = oc.getImageData(0, 0, NATIVE, NATIVE)
    for (let i = 0; i < img.data.length; i += 4) {
      const p = Math.round((0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2]) / 64) * 64
      img.data[i] = img.data[i + 1] = img.data[i + 2] = p
    }
    oc.putImageData(img, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(off, 0, 0, NATIVE, NATIVE)
  }

  useEffect(() => {
    drawPlaceholder()
    return () => {
      if (loopRef.current) clearInterval(loopRef.current)
      const s = videoRef.current?.srcObject as MediaStream | null
      s?.getTracks().forEach(t => t.stop())
    }
  }, [])

  async function activate() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 128, height: 128 }, audio: false })
      if (videoRef.current) {
        videoRef.current.srcObject = s
        await videoRef.current.play()
      }
      setStatus('active')
      loopRef.current = setInterval(drawPixelFrame, 80)
    } catch {
      setStatus('idle')
    }
  }

  function capture() {
    if (loopRef.current) clearInterval(loopRef.current)
    drawPixelFrame()
    setStatus('captured')
    onCaptured(true)
  }

  function recapture() {
    setStatus('active')
    onCaptured(false)
    loopRef.current = setInterval(drawPixelFrame, 80)
  }

  const statusText = {
    idle: 'Camera inactive.',
    active: 'Camera active.',
    captured: 'Identity captured.',
  }[status]

  const statusColor = {
    idle: css('--mid'),
    active: css('--ink'),
    captured: css('--red'),
  }[status]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: css('--space-5'),
      width: '100%',
    }}>
      <label style={{
        fontFamily: css('--mono'),
        fontSize: css('--size-label'),
        fontWeight: 400,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: css('--mid'),
        alignSelf: 'center',
      }}>
        Proof of identity:
      </label>
      <p style={{
        margin: 0,
        fontFamily: css('--mono'),
        fontSize: css('--size-label'),
        color: css('--mid'),
        letterSpacing: '0.1em',
        textAlign: 'center',
      }}>
        To make sure it's really you.
      </p>
      <div style={{
        width: CAM_SIZE,
        height: CAM_SIZE,
        flexShrink: 0,
        border: css('--border-strong'),
        borderRadius: css('--radius'),
        overflow: 'hidden',
        background: '#b8b5b0',
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
        />
        <canvas
          ref={canvasRef}
          width={NATIVE}
          height={NATIVE}
          style={{ width: '100%', height: '100%', imageRendering: 'pixelated', display: 'block' }}
        />
      </div>
      <p style={{
        margin: 0,
        fontFamily: css('--mono'),
        fontSize: css('--size-label'),
        fontWeight: 400,
        letterSpacing: '0.15em',
        color: statusColor,
        lineHeight: css('--lh-body'),
        textAlign: 'center',
      }}>
        {statusText}
      </p>
      <div style={{ display: 'flex', gap: css('--space-3') }}>
        {status === 'idle' && (
          <PixelButton onClick={activate}>Activate camera</PixelButton>
        )}
        {status === 'active' && (
          <PixelButton onClick={capture}>Capture</PixelButton>
        )}
        {status === 'captured' && (
          <PixelButton onClick={recapture}>Recapture</PixelButton>
        )}
      </div>
    </div>
  )
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
function useScrambledId(finalId: string, active: boolean) {
  const [display, setDisplay] = useState('')
  const ref = useRef<ReturnType<typeof setInterval>>()
  useEffect(() => {
    if (!finalId || !active) return
    let elapsed = 0
    ref.current = setInterval(() => {
      elapsed += 50
      const progress = Math.min(elapsed / 1200, 1)
      const resolved = Math.floor(progress * finalId.length)
      setDisplay(
        finalId.split('').map((c, i) =>
          i < resolved || c === '-' || c === ' '
            ? c
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      )
      if (progress >= 1) {
        clearInterval(ref.current)
        setDisplay(finalId)
      }
    }, 50)
    return () => clearInterval(ref.current)
  }, [finalId, active])
  return display
}

export default function LoginPage({ onComplete, onCancel }: {
  onComplete: () => void
  onCancel: () => void
}) {
  const [step, setStep] = useState<'headline' | 'id' | 'webcam'>('headline')
  const [visitorId, setVisitorId] = useState('')
  const [captured, setCaptured] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const errorTimer = useRef<ReturnType<typeof setTimeout>>()
  const scrambledId = useScrambledId(visitorId, step === 'id')

  useEffect(() => {
    let id = localStorage.getItem('ideal_visitor_id')
    if (!id) {
      id = 'USR-' + (4200000 + Math.floor(Math.random() * 800000))
      localStorage.setItem('ideal_visitor_id', id)
    }
    setVisitorId(id)
  }, [])

  function handleReady() {
    if (!captured) {
      setErrorVisible(true)
      if (errorTimer.current) clearTimeout(errorTimer.current)
      errorTimer.current = setTimeout(() => setErrorVisible(false), 2800)
      return
    }
    onComplete()
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

      {/* ── STEP 1: HEADLINE ── */}
      {step === 'headline' && (
        <div
          onClick={() => setStep('id')}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(32px, 5vh, 64px) clamp(32px, 5vw, 80px)',
            cursor: 'default',
            zIndex: 10,
            gap: css('--space-5'),
          }}
        >
          <h1 style={{
            fontFamily: css('--mono'),
            fontSize: css('--size-headline'),
            fontWeight: 400,
            color: css('--ink'),
            letterSpacing: '-0.01em',
            margin: 0,
            lineHeight: css('--lh-tight'),
            textTransform: 'uppercase',
            userSelect: 'none',
            textAlign: 'center',
          }}>
            READY TO LIVE<br />YOUR IDEAL LIFE?
          </h1>
          <p style={{
            margin: 0,
            fontFamily: css('--mono'),
            fontSize: css('--size-label'),
            color: css('--mid'),
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}>
            Click anywhere to continue
          </p>
        </div>
      )}

      {/* ── STEP 2: USER ID ── */}
      {step === 'id' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(32px, 5vh, 64px) clamp(32px, 5vw, 80px)',
          paddingBottom: 'clamp(80px, 10vh, 120px)',
          boxSizing: 'border-box',
          zIndex: 10,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: css('--space-4'),
            maxWidth: '520px',
            width: '100%',
            alignItems: 'center',
          }}>
            <label style={{
              fontFamily: css('--mono'),
              fontSize: css('--size-label'),
              fontWeight: 400,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: css('--mid'),
              alignSelf: 'flex-start',
            }}>
              Your assigned ID:
            </label>
            <div style={{
              fontFamily: css('--mono'),
              fontSize: css('--size-body-mono'),
              fontWeight: 400,
              color: css('--ink'),
              borderBottom: `1.5px solid ${css('--ink')}`,
              padding: '8px 0',
              letterSpacing: '0.05em',
              width: '100%',
            }}>
              {scrambledId}
            </div>
            <p style={{
              margin: 0,
              fontFamily: css('--mono'),
              fontSize: css('--size-label'),
              color: css('--mid'),
              letterSpacing: '0.1em',
              lineHeight: css('--lh-body'),
              alignSelf: 'flex-start',
            }}>
              This is your unique user ID.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 3: WEBCAM ── */}
      {step === 'webcam' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(32px, 5vh, 64px) clamp(32px, 5vw, 80px)',
          paddingBottom: 'clamp(80px, 10vh, 120px)',
          boxSizing: 'border-box',
          zIndex: 10,
        }}>
          <WebcamCapture onCaptured={setCaptured} />
        </div>
      )}

      {/* ── BOTTOM BAR (steps 2 + 3) ── */}
      {step === 'id' && (
        <BottomBar
          onBack={() => setStep('headline')}
          onNext={() => setStep('webcam')}
          onCancel={onCancel}
          backDisabled={true}
          nextLabel='Next >'
        />
      )}

      {step === 'webcam' && (
        <>
          {errorVisible && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(52px, 8vh, 80px)',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: css('--mono'),
              fontSize: css('--size-label'),
              color: css('--red'),
              letterSpacing: '0.1em',
              zIndex: 20,
            }}>
              Identity verification required to proceed.
            </div>
          )}
          <BottomBar
            onBack={() => setStep('id')}
            onNext={handleReady}
            onCancel={onCancel}
            backDisabled={false}
            nextLabel="I'M READY"
          />
        </>
      )}
    </div>
  )
}