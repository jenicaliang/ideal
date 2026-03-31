import React, { useEffect, useRef, useState } from 'react'
import PixelButton from './shared/PixelButton'
import BottomBar from './shared/BottomBar'

const css = (v: string) => `var(${v})`
const CAM_SIZE = 160

function WebcamCapture({ onCaptured }: { onCaptured: (v: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null)
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
  const s = videoRef.current?.srcObject as MediaStream | null
  s?.getTracks().forEach(t => t.stop())
  if (videoRef.current) videoRef.current.srcObject = null
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
      <label className="ideal-label" style={{
        color: css('--mid'),
        letterSpacing: '0.3em',
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
  const ref = useRef<ReturnType<typeof setInterval> | null>(null)
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
        if (ref.current) clearInterval(ref.current)
        setDisplay(finalId)
      }
    }, 50)
    return () => {
      if (ref.current) clearInterval(ref.current)
    }
  }, [finalId, active])
  return display
}

export default function LoginPage({ onComplete, onCancel, initialStep = 'headline' }: {
  onComplete: () => void
  onCancel: () => void
  initialStep?: 'headline' | 'id' | 'webcam'
}) {
  const [step, setStep] = useState<'headline' | 'id' | 'webcam'>(initialStep)
  const [visitorId, setVisitorId] = useState('')
  const [captured, setCaptured] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
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
          <h1 className="ideal-headline" style={{
            fontFamily: css('--mono'),
            fontWeight: 400,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            userSelect: 'none',
            textAlign: 'center',
          }}>
            READY TO LIVE<br />YOUR IDEAL LIFE?
          </h1>
          <p className="ideal-label" style={{
            color: css('--mid'),
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
            <label className="ideal-label" style={{
              color: css('--mid'),
              letterSpacing: '0.3em',
              alignSelf: 'flex-start',
            }}>
              Your assigned ID:
            </label>
            <div className="ideal-mono-body" style={{
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
            nextLabel="Next >"
          />
        </>
      )}
    </div>
  )
}