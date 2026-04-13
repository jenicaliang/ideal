import { useEffect, useState } from "react"
import PixelButton from "../ideal/shared/PixelButton"

function css(v: string) {
    return `var(${v})`
}

const DARK_BG = "#1e1e1e"
const DARK_INK = "#f5f3ef"
const DARK_MID = "rgba(245,243,239,0.45)"
const DARK_RED = "#b04a2f"

const CARDS = [
    {
        id: "work",
        name: "Marcus, 34",
        quote: '"I don\'t waste time on decisions that don\'t matter anymore."',
        goal: "Completing high-priority tasks before initiating new ones.",
        outcome: "Marcus reported a 40% reduction in incomplete projects within 6 weeks.",
    },
    {
        id: "relationships",
        name: "Sarah, 29",
        quote: '"My relationships are so much more efficient now."',
        goal: "Maintaining three high-quality social interactions per week.",
        outcome: "Sarah met her target consistently for 11 weeks.",
    },
    {
        id: "health",
        name: "Jonah, 41",
        quote: '"I don\'t have to listen to my body anymore. IDEAL does that for me."',
        goal: "Seven hours of sleep per night with a fixed wake time.",
        outcome: "Jonah reached baseline consistency within 3 weeks.",
    },
]

function ProfileSilhouette() {
    return (
        <div style={{
            width: 64,
            height: 64,
            background: "rgba(245,243,239,0.08)",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Head */}
            <div style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: DARK_MID,
            }} />
            {/* Shoulders / body */}
            <div style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 38,
                height: 24,
                borderRadius: "50% 50% 0 0",
                background: DARK_MID,
            }} />
        </div>
    )
}

function FlipCard({ card, flipped, onFlip }: {
    card: typeof CARDS[number]
    flipped: boolean
    onFlip: () => void
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <div
            onClick={onFlip}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: 220,
                height: 300,
                perspective: 1000,
                cursor: "pointer",
                flexShrink: 0,
                transform: hovered && !flipped ? "scale(1.03)" : "scale(1)",
                transition: "transform 0.2s ease",
            }}
        >
            <div style={{
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}>

                {/* Front */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    border: `1px solid rgba(245,243,239,0.15)`,
                    background: DARK_BG,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: 20,
                    boxSizing: "border-box",
                }}>
                    <ProfileSilhouette />

                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                        <p style={{
                            fontFamily: css("--sans"),
                            fontSize: 15,
                            fontWeight: 300,
                            color: DARK_INK,
                            lineHeight: css("--lh-body"),
                            margin: 0,
                            fontStyle: "italic",
                        }}>
                            {card.quote}
                        </p>
                    </div>

                    <p style={{
                        fontFamily: css("--mono"),
                        fontSize: 11,
                        color: DARK_MID,
                        margin: 0,
                        letterSpacing: "0.04em",
                    }}>
                        — {card.name}
                    </p>
                </div>

                {/* Back */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    border: `1px solid rgba(245,243,239,0.15)`,
                    background: "rgba(245,243,239,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 20,
                    boxSizing: "border-box",
                }}>
                    <div>
                        <p style={{
                            fontFamily: css("--mono"),
                            fontSize: 10,
                            color: DARK_RED,
                            margin: "0 0 6px 0",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                        }}>
                            Goal
                        </p>
                        <p style={{
                            fontFamily: css("--sans"),
                            fontSize: 14,
                            fontWeight: 300,
                            color: DARK_INK,
                            lineHeight: css("--lh-body"),
                            margin: 0,
                        }}>
                            {card.goal}
                        </p>
                    </div>

                    <div style={{
                        borderTop: "1px solid rgba(245,243,239,0.1)",
                        paddingTop: 16,
                    }}>
                        <p style={{
                            fontFamily: css("--mono"),
                            fontSize: 10,
                            color: DARK_RED,
                            margin: "0 0 6px 0",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                        }}>
                            Outcome
                        </p>
                        <p style={{
                            fontFamily: css("--sans"),
                            fontSize: 14,
                            fontWeight: 300,
                            color: DARK_INK,
                            lineHeight: css("--lh-body"),
                            margin: 0,
                        }}>
                            {card.outcome}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SocialProofPage({ onProceed, onBack }: {
    onProceed: () => void
    onBack: () => void
}) {
    const [visible, setVisible] = useState(false)
    const [flipped, setFlipped] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 200)
        return () => clearTimeout(t)
    }, [])

    function handleFlip(id: string) {
        setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            background: DARK_BG,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxSizing: "border-box",
            padding: `var(--space-6) var(--space-5)`,
            paddingBottom: 56,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-6)",
                width: "100%",
                maxWidth: 780,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
            }}>

                {/* Heading */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    textAlign: "center",
                }}>
                    <p style={{
                        fontFamily: css("--mono"),
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: DARK_MID,
                        margin: 0,
                    }}>
                        User outcomes
                    </p>
                    <h2 style={{
                        fontFamily: css("--sans"),
                        fontSize: "var(--size-headline)",
                        fontWeight: 300,
                        color: DARK_INK,
                        margin: 0,
                        lineHeight: css("--lh-tight"),
                    }}>
                        Don't just take our word for it.
                    </h2>
                </div>

                {/* Cards row */}
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "var(--space-5)",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {CARDS.map(card => (
                        <FlipCard
                            key={card.id}
                            card={card}
                            flipped={!!flipped[card.id]}
                            onFlip={() => handleFlip(card.id)}
                        />
                    ))}
                </div>
            </div>

            {/* BottomBar */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(8px, 1vh, 14px) clamp(12px, 1.5vw, 24px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: DARK_BG,
                    zIndex: 30,
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 'clamp(12px, 1.5vw, 24px)',
                    right: 'clamp(12px, 1.5vw, 24px)',
                    height: '1px',
                    backgroundColor: DARK_MID,
                    opacity: 0.4,
                }} />
                <PixelButton onClick={onBack} position="solo" variant="dark">{'< Back'}</PixelButton>
                <PixelButton onClick={onProceed} position="solo" variant="dark">{'Next >'}</PixelButton>
            </div>
        </div>
    )
}