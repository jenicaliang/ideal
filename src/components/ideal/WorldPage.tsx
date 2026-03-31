import { useEffect, useState } from "react"
import React from "react"

function css(v: string) {
    return `var(${v})`
}

const THOUGHTS = [
    { id: "t0", text: "I'm tired of keeping track of all the things that are going on in my life.", value: "clarity", fear: "being overwhelmed", countRange: [3200, 8100] },
    { id: "t1", text: "I tend to overthink a lot of the decisions I make.", value: "certainty", fear: "indecision", countRange: [5400, 12000] },
    { id: "t2", text: "Sometimes, I just want someone to tell me exactly what to do.", value: "direction", fear: "aimlessness", countRange: [2800, 7400] },
    { id: "t3", text: "I'm not sure where I'll be in five years, and that really scares me.", value: "stability", fear: "the future", countRange: [6100, 14200] },
    { id: "t4", text: "I know what I want, but not how to achieve it.", value: "achievement", fear: "inadequacy", countRange: [4700, 10300] },
    { id: "t5", text: "I don't even know what I want from life.", value: "stability", fear: "the future", countRange: [3900, 9800] },
    { id: "t6", text: "I often feel like there's too much that I don't know.", value: "clarity", fear: "ignorance", countRange: [4100, 9200] },
    { id: "t7", text: "I want to make more informed decisions, but don't know how.", value: "certainty", fear: "indecision", countRange: [3300, 7700] },
    { id: "t8", text: "Life was easier when the path forward was clearer.", value: "direction", fear: "aimlessness", countRange: [5800, 13400] },
] as const

function formatCount(n: number): string {
    return n.toLocaleString("en-US")
}

function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

interface ThoughtState {
    id: string
    clicked: boolean
    count: number
}

export default function WorldPage() {
    const [thoughts, setThoughts] = useState<ThoughtState[]>([])
    const [anyClicked, setAnyClicked] = useState(false)
    const [bottomVisible, setBottomVisible] = useState(false)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("ideal_world_selections")
        const savedIds: string[] = saved ? JSON.parse(saved) : []
        const initial: ThoughtState[] = THOUGHTS.map((t) => ({
            id: t.id,
            clicked: savedIds.includes(t.id),
            count: randomInRange(t.countRange[0], t.countRange[1]),
        }))
        setThoughts(initial)
        if (savedIds.length > 0) {
            setAnyClicked(true)
            setBottomVisible(true)
        }
    }, [])

    function handleClick(id: string) {
        setThoughts((prev) => {
            const next = prev.map((t) => t.id === id ? { ...t, clicked: !t.clicked } : t)
            const clickedIds = next.filter((t) => t.clicked).map((t) => t.id)
            localStorage.setItem("ideal_world_selections", JSON.stringify(clickedIds))
            const selected = THOUGHTS.filter((t) => clickedIds.includes(t.id))
            localStorage.setItem("ideal_world_values", JSON.stringify(selected.map((t) => t.value)))
            localStorage.setItem("ideal_world_fears", JSON.stringify(selected.map((t) => t.fear)))
            return next
        })
        if (!anyClicked) {
            setAnyClicked(true)
            setTimeout(() => setBottomVisible(true), 300)
        }
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            background: css("--bg"),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            boxSizing: "border-box",
            padding: `${css("--space-6")} ${css("--space-5")}`,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: css("--space-4"),
                width: "100%",
                maxWidth: "620px",
            }}>
                <p className="ideal-body">
                    Which of these sounds like you?
                </p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: css("--space-3"),
                    width: "100%",
                }}>
                    {thoughts.map((thought, i) => {
                        const data = THOUGHTS[i]
                        const isHovered = hoveredId === thought.id
                        const isClicked = thought.clicked

                        return (
                            <div
                                key={thought.id}
                                onClick={() => handleClick(thought.id)}
                                onMouseEnter={() => setHoveredId(thought.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    padding: "10px",
                                    border: `1px solid ${isClicked ? css("--red") : css("--ink")}`,
                                    borderRadius: css("--radius"),
                                    cursor: "pointer",
                                    userSelect: "none",
                                    minHeight: 56,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    gap: css("--space-3"),
                                    background: isClicked
                                        ? `color-mix(in srgb, var(--red) 6%, var(--bg))`
                                        : isHovered
                                            ? `color-mix(in srgb, var(--ink) 4%, var(--bg))`
                                            : css("--bg"),
                                    transition: "background 0.2s ease, border-color 0.2s ease",
                                }}
                            >
                                <p style={{
                                    fontFamily: css("--sans"),
                                    fontSize: css("--size-label"),  // was --size-body
                                    fontWeight: 300,
                                    color: isClicked ? css("--red") : css("--ink"),
                                    lineHeight: css("--lh-body"),
                                    margin: 0,
                                    transition: "color 0.2s ease, opacity 0.3s ease",
                                    opacity: isClicked ? 0.9 : 1,
                                }}>
                                    {isClicked
                                        ? `${formatCount(thought.count)} others feel this way.`
                                        : data.text}
                                </p>

                                <div style={{
                                    width: 4,
                                    height: 4,
                                    background: isClicked ? css("--red") : css("--mid"),
                                    transition: "background 0.2s ease",
                                    alignSelf: "flex-end",
                                }} />
                            </div>
                        )
                    })}
                </div>

                {anyClicked && (
                    <div style={{
                        width: "100%",
                        opacity: bottomVisible ? 1 : 0,
                        transition: "opacity 0.6s ease",
                    }}>
                        <p className="ideal-body">
                            You're not alone in feeling this way.
                            <br />
                            <span style={{ color: css("--mid") }}>We're all exhausted.</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}