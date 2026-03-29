import { useEffect, useRef } from 'react'

const css = (v: string) => `var(${v})`

export default function MitosisLoader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>()
  const startRef = useRef<number | null>(null)
  const DURATION = 2800

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
  ) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  function easeInOut(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  function drawCell(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, size: number, sp: number, vert: boolean, ink: string
  ) {
    const r = size * 0.18
    ctx.strokeStyle = ink
    ctx.lineWidth = 1.5
    if (sp <= 0) {
      roundRect(ctx, x - size / 2, y - size / 2, size, size, r)
      ctx.stroke()
      return
    }
    if (sp < 1) {
      const gap = sp * size * 0.55, pinch = (1 - sp) * size * 0.18
      if (!vert) {
        const lx = x - size / 2 - gap / 2, cw = size / 2 - pinch * 0.5
        ctx.beginPath()
        ctx.moveTo(lx + r, y - size / 2)
        ctx.lineTo(lx + cw - r, y - size / 2)
        ctx.quadraticCurveTo(lx + cw, y - size / 2, lx + cw, y - size / 2 + r)
        ctx.lineTo(lx + cw, y - pinch)
        ctx.quadraticCurveTo(lx + cw + pinch * 0.5, y, lx + cw, y + pinch)
        ctx.lineTo(lx + cw, y + size / 2 - r)
        ctx.quadraticCurveTo(lx + cw, y + size / 2, lx + cw - r, y + size / 2)
        ctx.lineTo(lx + r, y + size / 2)
        ctx.quadraticCurveTo(lx, y + size / 2, lx, y + size / 2 - r)
        ctx.lineTo(lx, y - size / 2 + r)
        ctx.quadraticCurveTo(lx, y - size / 2, lx + r, y - size / 2)
        ctx.closePath()
        ctx.stroke()
        const rx = x + gap / 2 + pinch * 0.5
        ctx.beginPath()
        ctx.moveTo(rx + r, y - size / 2)
        ctx.lineTo(rx + cw - r, y - size / 2)
        ctx.quadraticCurveTo(rx + cw, y - size / 2, rx + cw, y - size / 2 + r)
        ctx.lineTo(rx + cw, y + size / 2 - r)
        ctx.quadraticCurveTo(rx + cw, y + size / 2, rx + cw - r, y + size / 2)
        ctx.lineTo(rx + r, y + size / 2)
        ctx.quadraticCurveTo(rx, y + size / 2, rx, y + size / 2 - r)
        ctx.lineTo(rx, y + pinch)
        ctx.quadraticCurveTo(rx - pinch * 0.5, y, rx, y - pinch)
        ctx.lineTo(rx, y - size / 2 + r)
        ctx.quadraticCurveTo(rx, y - size / 2, rx + r, y - size / 2)
        ctx.closePath()
        ctx.stroke()
      } else {
        const topY = y - size / 2 - gap / 2, botY = y + gap / 2, ch = size / 2 - pinch * 0.5
        roundRect(ctx, x - size / 2, topY, size, ch, r)
        ctx.stroke()
        roundRect(ctx, x - size / 2, botY + pinch * 0.5, size, ch, r)
        ctx.stroke()
      }
    } else {
      const off = size * 0.55
      if (!vert) {
        roundRect(ctx, x - size - off / 2, y - size / 2, size, size, r)
        ctx.stroke()
        roundRect(ctx, x + off / 2, y - size / 2, size, size, r)
        ctx.stroke()
      } else {
        roundRect(ctx, x - size / 2, y - size - off / 2, size, size, r)
        ctx.stroke()
        roundRect(ctx, x - size / 2, y + off / 2, size, size, r)
        ctx.stroke()
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1, D = 280
    canvas.width = D * dpr
    canvas.height = D * dpr
    canvas.style.width = `${D}px`
    canvas.style.height = `${D}px`
    ctx.scale(dpr, dpr)
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#1e1e1e'
    const GEN = [0, 0.2, 0.48, 0.72, 0.88], cx = 140, cy = 140

    function frame(ts: number) {
      if (!startRef.current) startRef.current = ts
      const t = Math.min((ts - startRef.current) / DURATION, 1)
      ctx.clearRect(0, 0, D, D)
      let gen = 0
      for (let i = GEN.length - 1; i >= 0; i--) {
        if (t >= GEN[i]) { gen = i; break }
      }
      const gS = GEN[gen], gE = gen < GEN.length - 1 ? GEN[gen + 1] : 1
      const sp = easeInOut(Math.min((gE > gS ? (t - gS) / (gE - gS) : 1) * 1.4, 1))
      if (gen === 0) drawCell(ctx, cx, cy, 56, sp, false, ink)
      else if (gen === 1) {
        drawCell(ctx, cx - 25, cy, 42, sp, true, ink)
        drawCell(ctx, cx + 25, cy, 42, sp, true, ink)
      } else if (gen === 2)
        [[-50, -46], [50, -46], [-50, 46], [50, 46]].forEach(([dx, dy]) =>
          drawCell(ctx, cx + dx, cy + dy, 30, sp, false, ink))
      else if (gen === 3)
        [[-78, -44], [-26, -44], [26, -44], [78, -44], [-78, 44], [-26, 44], [26, 44], [78, 44]].forEach(([dx, dy]) =>
          drawCell(ctx, cx + dx, cy + dy, 20, sp, true, ink))
      else
        for (let row = 0; row < 4; row++)
          for (let col = 0; col < 4; col++) {
            const s = 14, px = cx - 52 + col * 34, py = cy - 52 + row * 34
            roundRect(ctx, px - s / 2, py - s / 2, s, s, s * 0.18)
            ctx.strokeStyle = ink
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
      if (t < 1) animRef.current = requestAnimationFrame(frame)
      else setTimeout(onDone, 300)
    }
    animRef.current = requestAnimationFrame(frame)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [onDone])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: css('--bg'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <canvas ref={canvasRef} />
      <p style={{
        marginTop: css('--space-5'),
        fontFamily: css('--mono'),
        fontSize: css('--size-caption'),
        fontWeight: 300,
        letterSpacing: '0.25em',
        color: css('--mid'),
        textTransform: 'uppercase',
      }}>
        Initializing
      </p>
    </div>
  )
}