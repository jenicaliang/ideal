import { useEffect, useRef, useState } from "react"
import React from 'react'
import PixelButton from './shared/PixelButton'

function css(v: string) {
  return `var(${v})`
}

function PillButton({ children, onClick, circle = false }: {
  children: React.ReactNode
  onClick: () => void
  circle?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: css("--mono"),
        fontSize: css("--size-label"),
        color: hovered ? css("--ink") : css("--mid"),
        background: hovered ? "rgba(0,0,0,0.08)" : "transparent",
        border: `1px solid ${css("--mid")}`,
        borderRadius: circle ? "50%" : 999,
        height: 30,
        ...(circle ? { width: 30, padding: 0, flexShrink: 0 } : { paddingInline: 15 }),
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      {children}
    </button>
  )
}

const TIERS = [
  { id: "physiological", label: "Physiological", cards: ["Where will I sleep?", "What will I eat?", "What will I wear?"] },
  { id: "safety", label: "Safety", cards: ["Where can I be safe?", "How can I be healthy?", "Do I have enough money?"] },
  { id: "belonging", label: "Love & Belonging", cards: ["Who can I trust?", "Do I belong here?", "Am I loved?"] },
  { id: "esteem", label: "Esteem", cards: ["Am I valued?", "Am I respected?", "What can I achieve?"] },
  { id: "actualization", label: "actualization", cards: ["Who am I?", "What are my values?", "What's the meaning of life?"] },
] as const

const N = TIERS.length

const TIER_TOOLTIPS: Record<string, string> = {
  physiological: "The most basic human needs: food, shelter, sleep, clothing. Without these, nothing else is possible.",
  safety: "The need for physical security, financial stability, and health. Uncertainty here is felt as immediate threat.",
  belonging: "Love, trust, and connection. The fear of not belonging is one of the most universal human anxieties.",
  esteem: "Confidence, reputation, and achievement. This section includes uncertainty about how we are perceived or what we can accomplish.",
  actualization: "The pursuit of meaning, purpose, and identity. The one need that resists easy definition or resolution.",
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const S = 750
const TH = Math.round((S * Math.sqrt(3)) / 2)
const CONTROLS_H = 80
const PADDING = 40

function xBounds(y: number) {
  const half = (S / 2) * (y / TH)
  return { xL: S / 2 - half, xR: S / 2 + half }
}

function tierY(i: number) {
  const yTop = (TH * (N - 1 - i)) / N
  const yBottom = (TH * (N - i)) / N
  return { yTop, yBottom }
}

function tierAt(px: number, py: number): number {
  if (py < 0 || py > TH) return -1
  const { xL, xR } = xBounds(py)
  if (px < xL || px > xR) return -1
  for (let i = 0; i < N; i++) {
    const { yTop, yBottom } = tierY(i)
    if (py >= yTop && py <= yBottom) return i
  }
  return -1
}

interface Card {
  id: string
  text: string
  tierIdx: number
  x: number
  y: number
  wrongFlash: boolean
}

function OnboardingOverlay({ onDismiss }: { onDismiss: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 80,
        background: "rgba(20,20,20,0.55)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 450,
          width: "calc(100% - 48px)",
          background: css("--ink"),
          borderRadius: css("--radius"),
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p className="ideal-label" style={{ color: css("--bg"), opacity: 0.45 }}>
          How to play
        </p>
        <p className="ideal-body" style={{ color: css("--bg") }}>
          Generate uncertainties and drag them into the tier of{" "}
          <strong style={{ fontWeight: 500 }}>Maslow's Hierarchy of Needs</strong>{" "}
          that best fits. Cards snap into place when sorted correctly; a red flash means try a different tier.
        </p>
        <p style={{
          fontFamily: css("--sans"),
          fontSize: css("--size-tooltip"),
          fontWeight: 300,
          color: css("--bg"),
          opacity: 0.55,
          lineHeight: css("--lh-body"),
          margin: 0,
        }}>
          To learn more about each tier, hover over the category labels on the triangle.
        </p>
        <div style={{ marginTop: "4px" }}>
          <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onDismiss}
            style={{
              fontFamily: css("--mono"),
              fontSize: css("--size-button"),
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              background: hovered ? css("--bg") : "transparent",
              border: `1.5px solid var(--bg)`,
              borderRadius: css("--radius"),
              padding: "9px 20px",
              color: hovered ? css("--ink") : css("--bg"),
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NeedsPage({ visibleKey }: { visibleKey?: number }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null)
  const dimsRef = useRef({ w: 0, h: 0 })

  const [cards, setCards] = useState<Card[]>([])
  const [placed, setPlaced] = useState<Record<number, string[]>>({})
  const [generated, setGenerated] = useState(false)
  const [genCount, setGenCount] = useState(0)
  const genCountRef = useRef(0)
  const [allPlaced, setAllPlaced] = useState(false)
  const [autosorting, setAutosorting] = useState(false)
  const [tooltip, setTooltip] = useState(false)
  const [actDisclaimer, setActDisclaimer] = useState(false)
  const [actHovered, setActHovered] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<number | null>(null)
  const [tooltipContent, setTooltipContent] = useState("")
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const updateDims = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (w > 0 && h > 0) {
        dimsRef.current = { w, h }
        setDims({ w, h })
      }
    }

    const ro = new ResizeObserver(updateDims)
    ro.observe(el)
    updateDims()

    const t1 = setTimeout(updateDims, 100)
    const t2 = setTimeout(updateDims, 300)
    const t3 = setTimeout(updateDims, 600)

    return () => {
      ro.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const t = setTimeout(() => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (w > 0 && h > 0) {
        dimsRef.current = { w, h }
        setDims({ w, h })
      }
    }, 50)
    return () => clearTimeout(t)
  }, [visibleKey])

  const availW = dims.w - PADDING * 2
  const availH = dims.h - CONTROLS_H - PADDING * 2
  const scale = dims.w > 0 ? Math.min(availW / S, availH / TH) * 0.9 : 1
  const scaledS = S * scale
  const scaledTH = TH * scale
  const TRI_LEFT = (dims.w - scaledS) / 2
  const TRI_TOP = PADDING + (availH - scaledTH) / 2

  function measureCardWidth(text: string) {
    if (typeof document === "undefined") return 220
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return 220
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "'Reddit Mono', monospace"
    const sizeRaw = getComputedStyle(document.documentElement).getPropertyValue("--size-label").trim() || "12px"
    ctx.font = `400 ${sizeRaw} ${mono}`
    return Math.max(60, Math.min(500, ctx.measureText(text).width + 34))
  }

  function scatter(items: { text: string }[]): { x: number; y: number }[] {
    const CARD_H = 36
    const PAD = 4
    const el = rootRef.current
    const CONTAINER_W = el ? el.offsetWidth : 0
    const CONTAINER_H = el ? el.offsetHeight : 0
    if (CONTAINER_W === 0 || CONTAINER_H === 0) return items.map(() => ({ x: PAD, y: PAD }))

    const aW = CONTAINER_W - PADDING * 2
    const aH = CONTAINER_H - CONTROLS_H - PADDING * 2
    const sc = Math.min(aW / S, aH / TH) * 0.9
    const sS = S * sc
    const sTH = TH * sc
    const triLeft = (CONTAINER_W - sS) / 2
    const triTop = PADDING + (aH - sTH) / 2
    const safeY2 = CONTAINER_H - CARD_H - PAD
    const cardWidths = items.map((item) => measureCardWidth(item.text))

    const leftRegion = {
      xMin: 0,
      xMax: triLeft - 4,
      yMin: Math.max(0, triTop),
      yMax: Math.min(safeY2, triTop + sTH),
    }
    const rightRegion = {
      xMin: triLeft + sS + 4,
      xMax: CONTAINER_W,
      yMin: Math.max(0, triTop),
      yMax: Math.min(safeY2, triTop + sTH),
    }
    const fallbackRegion = {
      xMin: 0,
      xMax: CONTAINER_W,
      yMin: 0,
      yMax: Math.max(1, triTop - CARD_H),
    }

    const positions: { x: number; y: number }[] = []
    const placedRects: { x: number; y: number; w: number; h: number }[] = []

    for (let i = 0; i < items.length; i++) {
      const w = cardWidths[i]
      const h = CARD_H
      const leftFits = leftRegion.xMax - leftRegion.xMin >= w
      const rightFits = rightRegion.xMax - rightRegion.xMin >= w
      const candidateRegions: { xMin: number; xMax: number; yMin: number; yMax: number }[] = []
      if (leftFits) candidateRegions.push(leftRegion)
      if (rightFits) candidateRegions.push(rightRegion)
      if (!leftFits && !rightFits) candidateRegions.push(fallbackRegion)

      const preferredRegion = candidateRegions.length > 1
        ? candidateRegions[i % candidateRegions.length]
        : candidateRegions[0]

      let attempts = 0
      let pos = { x: PAD, y: PAD }
      let placed = false

      while (attempts < 120 && !placed) {
        const region = attempts < 80
          ? preferredRegion
          : candidateRegions[Math.floor(Math.random() * candidateRegions.length)]
        const xMin = region.xMin
        const xMax = Math.max(region.xMin + 1, region.xMax - w)
        const yMin = region.yMin
        const yMax = Math.max(region.yMin + 1, region.yMax)
        pos = {
          x: xMin + Math.random() * Math.max(1, xMax - xMin),
          y: yMin + Math.random() * Math.max(1, yMax - yMin),
        }
        const overlaps = placedRects.some((r) => !(
          pos.x + w + 8 < r.x || pos.x > r.x + r.w + 8 ||
          pos.y + h + 8 < r.y || pos.y > r.y + r.h + 8
        ))
        if (!overlaps) placed = true
        attempts++
      }

      pos.x = Math.max(PAD, Math.min(CONTAINER_W - w - PAD, pos.x))
      pos.y = Math.max(PAD, Math.min(CONTAINER_H - h - PAD, pos.y))
      positions.push(pos)
      placedRects.push({ x: pos.x, y: pos.y, w, h })
    }
    return positions
  }

  function generate() {
    if (genCountRef.current >= 2) return
    const nextCount = genCountRef.current + 1
    genCountRef.current = nextCount
    setGenCount(nextCount)

    const usedTexts = new Set<string>([
      ...Object.values(placed).flat(),
      ...cards.map((c) => c.text),
    ])

    const available = shuffle(
      TIERS.flatMap((t, i) => {
        if (i === 4) return []
        return t.cards.map((text) => ({ text, tierIdx: i }))
      }).filter((a) => !usedTexts.has(a.text))
    )

    const count = Math.min(6 + Math.floor(Math.random() * 3), available.length)
    const picked = available.slice(0, count)
    const positions = scatter(picked)

    const newCards: Card[] = picked.map((p, i) => ({
      id: `c${nextCount}-${i}`,
      text: p.text,
      tierIdx: p.tierIdx,
      x: positions[i].x,
      y: positions[i].y,
      wrongFlash: false,
    }))

    setCards((prev) => [...prev, ...newCards])
    setGenerated(true)
  }

  function handleDrop(id: string, dropX: number, dropY: number) {
    const svgX = dropX / scale
    const svgY = dropY / scale
    const ti = tierAt(svgX, svgY)
    const card = cards.find((c) => c.id === id)
    if (!card) return
    if (ti === -1) return

    if (ti === card.tierIdx) {
      setCards((prev) => {
        const next = prev.filter((c) => c.id !== id)
        if (next.length === 0 && genCountRef.current >= 2)
          setTimeout(() => setAllPlaced(true), 400)
        return next
      })
      setPlaced((prev) => ({
        ...prev,
        [ti]: [...(prev[ti] || []), card.text],
      }))
    } else {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, wrongFlash: true } : c))
      )
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, wrongFlash: false } : c))
        )
      }, 600)
    }
  }

  function onMouseDown(e: React.MouseEvent, id: string) {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const card = cards.find((c) => c.id === id)
    if (!card) return

    const rect = container.getBoundingClientRect()
    dragRef.current = {
      id,
      ox: e.clientX - rect.left - card.x,
      oy: e.clientY - rect.top - card.y,
    }

    function onMove(ev: MouseEvent) {
      const dr = dragRef.current
      if (!dr) return
      const r = container!.getBoundingClientRect()
      const nx = ev.clientX - r.left - dr.ox
      const ny = ev.clientY - r.top - dr.oy
      setCards((prev) =>
        prev.map((c) => (c.id === dr.id ? { ...c, x: nx, y: ny } : c))
      )
    }

    function onUp(ev: MouseEvent) {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      const dr = dragRef.current
      if (!dr) return
      const capturedId = dr.id
      dragRef.current = null
      const r = container!.getBoundingClientRect()
      const dropX = ev.clientX - r.left - TRI_LEFT
      const dropY = ev.clientY - r.top - TRI_TOP
      handleDrop(capturedId, dropX, dropY)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  function autosort() {
    if (autosorting) return
    setAutosorting(true)
    const snapshot = [...cards]
    let delay = 0
    snapshot.forEach((card) => {
      setTimeout(() => {
        setCards((prev) => {
          const next = prev.filter((c) => c.id !== card.id)
          if (next.length === 0 && genCountRef.current >= 2)
            setTimeout(() => setAllPlaced(true), 400)
          return next
        })
        setPlaced((prev) => ({
          ...prev,
          [card.tierIdx]: [...(prev[card.tierIdx] || []), card.text],
        }))
      }, delay)
      delay += 240
    })
    setTimeout(() => setAutosorting(false), delay + 400)
  }

  return (
    <div
      ref={rootRef}
      style={{
        width: "100%",
        height: "100%",
        background: css("--bg"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseMove={(e) => {
        const rect = rootRef.current?.getBoundingClientRect()
        if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
    >
      {/* Top right controls */}
      <div style={{
        position: "absolute",
        top: css("--space-3"),
        right: 16,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span style={{ backgroundColor: css("--bg"), borderRadius: 999, display: 'inline-flex' }}>
          <PillButton onClick={() => setShowOnboarding(true)}>How to play</PillButton>
        </span>
        <span style={{ backgroundColor: css("--bg"), borderRadius: "50%", display: 'inline-flex' }}>
          <PillButton onClick={() => setTooltip((t) => !t)} circle>?</PillButton>
        </span>

        {tooltip && (
          <>
            <div onClick={() => setTooltip(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: 40,
                right: 0,
                width: 320,
                background: css("--bg"),
                border: css("--border"),
                borderRadius: css("--radius"),
                padding: "14px 16px",
                zIndex: 60,
              }}
            >
              <p style={{
                fontFamily: css("--sans"),
                fontSize: css("--size-tooltip"),
                fontWeight: 300,
                color: css("--ink"),
                lineHeight: css("--lh-body"),
                margin: 0,
              }}>
                <strong className="ideal-caption">
                  Maslow's Hierarchy of Needs
                </strong>
                <br /><br />
                In his 1943 paper "A Theory of Human Motivation," Abraham Maslow proposed that human needs can be organized into a hierarchy with basic survival at the bottom and self-achievement at the top. Uncertainty threatens every level.
              </p>
              <div style={{ marginTop: css("--space-3") }}>
                <PixelButton onClick={() => setTooltip(false)}>Close</PixelButton>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main container */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
        <svg
          width={scaledS}
          height={scaledTH}
          viewBox={`0 0 ${S} ${TH}`}
          style={{
            position: "absolute",
            left: TRI_LEFT,
            top: TRI_TOP,
            overflow: "visible",
            pointerEvents: "all",
            cursor: "default",
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const px = (e.clientX - rect.left) / scale
            const py = (e.clientY - rect.top) / scale
            const ti = tierAt(px, py)
            if (ti === 4) setActDisclaimer(true)
          }}
        >
          <polygon
            points={`${S / 2},1 ${S - 1},${TH - 1} 1,${TH - 1}`}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />

          {(() => {
            const { yTop, yBottom } = tierY(4)
            const midY = (yTop + yBottom) / 2
            const { xL, xR } = xBounds(midY)
            const centerX = (xL + xR) / 2
            const centerY = yTop + (yBottom - yTop) * 0.65
            const fontSize = actHovered ? 72 : 48
            const topBounds = xBounds(yTop)
            const botBounds = xBounds(yBottom)
            const clipPoints = [
              `${topBounds.xL},${yTop}`,
              `${topBounds.xR},${yTop}`,
              `${botBounds.xR},${yBottom}`,
              `${botBounds.xL},${yBottom}`,
            ].join(" ")

            return (
              <g
                style={{ cursor: "none" }}
                onMouseEnter={() => setActHovered(true)}
                onMouseLeave={() => setActHovered(false)}
                onClick={() => setActDisclaimer(true)}
              >
                <polygon points={clipPoints} fill="transparent" />
                <text
                  x={centerX}
                  y={centerY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontFamily: "'Reddit Mono', monospace",
                    fontSize: `${fontSize}px`,
                    fill: actHovered ? "var(--red)" : "var(--ink)",
                    userSelect: "none",
                    transition: "font-size 0.15s ease, fill 0.15s ease",
                    pointerEvents: "none",
                  }}
                >
                  ?
                </text>
              </g>
            )
          })()}

          {[1, 2, 3, 4].map((i) => {
            const y = (TH * i) / N
            const { xL, xR } = xBounds(y)
            const sq = 3
            const dashes: React.ReactElement[] = []
            for (let x = xL; x < xR; x += sq * 2) {
              dashes.push(
                <rect key={`dash-${i}-${Math.round(x)}`} x={x} y={y - sq / 2}
                  width={Math.min(sq, xR - x)} height={sq}
                  fill="var(--ink)" opacity="0.25"
                />
              )
            }
            return <g key={i}>{dashes}</g>
          })}

          {TIERS.map((tier, i) => {
            const { yTop, yBottom } = tierY(i)
            const isAct = i === 4
            const isHovered = hoveredTier === i
            const labelFill = isAct ? "transparent" : isHovered ? "var(--red)" : "var(--mid)"
            const midY = (yTop + yBottom) / 2
            const { xR: xRMid } = xBounds(midY)
            const dotX = xRMid - 6
            const labelY = yBottom - 10
            const dotY = labelY - 3

            function handleEnter(e: React.MouseEvent) {
              setHoveredTier(i)
              if (isAct) setActHovered(true)
              const svgRect = (e.currentTarget as SVGElement).closest("svg")?.getBoundingClientRect()
              const rootRect = rootRef.current?.getBoundingClientRect()
              if (svgRect && rootRect) {
                setTooltipPos({
                  x: svgRect.left - rootRect.left + (S / 2) * scale + 16,
                  y: svgRect.top - rootRect.top + labelY * scale - 12,
                })
              }
              setTooltipContent(TIER_TOOLTIPS[tier.id] || "")
            }

            function handleLeave() {
              setHoveredTier(null)
              if (isAct) setActHovered(false)
            }

            return (
              <g
                key={tier.id}
                style={{ cursor: isAct ? "none" : "pointer" }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onClick={() => isAct && setActDisclaimer(true)}
              >
                <text
                  x={S / 2} y={labelY}
                  textAnchor="middle"
                  style={{
                    fontFamily: "'Reddit Mono', monospace",
                    fontSize: "var(--size-caption)",
                    letterSpacing: "0.2em",
                    fill: labelFill,
                    userSelect: "none",
                    transition: "fill 0.15s",
                  }}
                >
                  {tier.label.toUpperCase()}
                </text>
                {!isAct && (
                  <>
                    <rect x={dotX - 8} y={dotY - 8} width={20} height={20} fill="transparent" style={{ cursor: "pointer" }} />
                    <rect x={dotX} y={dotY} width={3} height={3}
                      fill={isHovered ? "var(--red)" : "var(--mid)"}
                      opacity={isHovered ? 1 : 0.5}
                    />
                  </>
                )}
              </g>
            )
          })}

          {Object.entries(placed).map(([idxStr, texts]) => {
            const i = parseInt(idxStr)
            const { yTop, yBottom } = tierY(i)
            const bandH = yBottom - yTop
            const fontSize = 15
            const gap = 5
            const lineStep = fontSize + gap
            const totalH = texts.length > 0 ? lineStep * texts.length - gap : 0
            const startY = yTop + (bandH - totalH) / 2.7 + fontSize

            return texts.map((text, j) => (
              <text
                key={`placed-${i}-${j}`}
                x={S / 2} y={startY + j * lineStep}
                textAnchor="middle"
                style={{
                  fontFamily: "'Reddit Mono', monospace",
                  fontSize: `${fontSize}px`,
                  letterSpacing: "0.08em",
                  fill: "var(--ink)",
                  userSelect: "none",
                }}
              >
                {text}
              </text>
            ))
          })}
        </svg>

        {cards.map((card) => (
          <div
            key={card.id}
            onMouseDown={(e) => onMouseDown(e, card.id)}
            style={{
              position: "absolute",
              left: card.x,
              top: card.y,
              display: "inline-block",
              whiteSpace: "nowrap",
              minWidth: 60,
              maxWidth: 500,
              padding: "5px 8px",
              fontFamily: css("--mono"),
              fontSize: css("--size-label"),
              fontWeight: 400,
              letterSpacing: "0.1em",
              lineHeight: 1.4,
              color: css("--ink"),
              background: css("--bg"),
              border: `1px solid ${card.wrongFlash ? css("--red") : css("--ink")}`,
              borderRadius: css("--radius"),
              cursor: "grab",
              userSelect: "none",
              transition: "border-color 0.15s",
              zIndex: 10,
              boxShadow: card.wrongFlash ? `0 0 0 1px var(--red)` : "none",
            }}
          >
            {card.text}
          </div>
        ))}
      </div>

      {/* Bottom controls */}
      <div style={{
        position: "absolute",
        bottom: 16,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: css("--space-3"),
        zIndex: 20,
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {genCount < 2 && dims.w > 0 && (
            <PixelButton onClick={generate}>
              {genCount === 1 && cards.length === 0 ? "Generate again?" : "Generate uncertainties"}
            </PixelButton>
          )}
          {generated && cards.length > 0 && (
            <PixelButton onClick={autosort}>Autosort</PixelButton>
          )}
          {generated && cards.length === 0 && allPlaced && (
            <span style={{
              fontFamily: css("--mono"),
              fontSize: css("--size-label"),
              fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: css("--mid"),
              paddingBottom: "2em",
            }}>
              Sorting complete.
            </span>
          )}
        </div>
      </div>

      {/* Tier tooltip */}
      {hoveredTier !== null && hoveredTier !== 4 && (
        <div style={{
          position: "absolute",
          left: tooltipPos.x,
          top: tooltipPos.y,
          transform: "translateY(-100%)",
          maxWidth: 280,
          background: css("--bg"),
          border: css("--border"),
          borderRadius: css("--radius"),
          padding: "10px 12px",
          zIndex: 30,
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily: css("--sans"),
            fontSize: css("--size-tooltip"),
            fontWeight: 300,
            color: css("--ink"),
            lineHeight: css("--lh-body"),
            margin: 0,
          }}>
            {tooltipContent}
          </p>
        </div>
      )}

      {/* Act disclaimer */}
      {actDisclaimer && (
        <div
          onClick={() => setActDisclaimer(false)}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
            background: "rgba(30,30,30,0.18)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 400,
              background: css("--bg"),
              border: css("--border-strong"),
              borderRadius: css("--radius"),
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: css("--space-4"),
            }}
          >
            <p style={{
              fontFamily: css("--mono"),
              fontSize: css("--size-label"),
              fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: css("--red"),
              margin: 0,
            }}>
              Notice
            </p>
            <p style={{
              fontFamily: css("--sans"),
              fontSize: css("--size-body"),
              fontWeight: 300,
              color: css("--ink"),
              lineHeight: css("--lh-body"),
              margin: 0,
            }}>
              The highest tier is Self-Actualization: the pursuit of meaning, identity, and purpose—and the one need that isn't easily mapped onto this framework. We're still working on what uncertainties fall in this tier.
            </p>
            <div style={{ marginTop: css("--space-1") }}>
              <PixelButton onClick={() => setActDisclaimer(false)}>Understood</PixelButton>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <OnboardingOverlay onDismiss={() => setShowOnboarding(false)} />
      )}


    </div>
  )
}