import { useEffect, useState } from "react"
import React from "react"
import PixelButton from "./shared/PixelButton"

function css(v: string) {
    return `var(${v})`
}

function ChoiceButton({ children, onClick }: {
    children: React.ReactNode
    onClick: () => void
}) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                fontFamily: css("--sans"),
                fontSize: css("--size-body"),
                fontWeight: 300,
                color: hovered ? css("--bg") : css("--ink"),
                background: hovered ? css("--ink") : "transparent",
                border: css("--border"),
                borderRadius: css("--radius"),
                padding: "14px 16px",
                textAlign: "left",
                cursor: "pointer",
                lineHeight: css("--lh-body"),
                transition: "background 0.2s ease, color 0.2s ease",
            }}
        >
            {children}
        </button>
    )
}

function inferFromStorage(): { value: string; fear: string; skipped: boolean } {
    try {
        const values: string[] = JSON.parse(localStorage.getItem("ideal_world_values") || "[]")
        const fears: string[] = JSON.parse(localStorage.getItem("ideal_world_fears") || "[]")

        if (values.length === 0 || fears.length === 0) {
            return { value: "time", fear: "inefficiency", skipped: true }
        }

        const vCount: Record<string, number> = {}
        const fCount: Record<string, number> = {}

        values.forEach((v) => { vCount[v] = (vCount[v] || 0) + 1 })
        fears.forEach((f) => { fCount[f] = (fCount[f] || 0) + 1 })

        const topValue = Object.entries(vCount).sort((a, b) => b[1] - a[1])[0][0]
        const topFear = Object.entries(fCount).sort((a, b) => b[1] - a[1])[0][0]

        return { value: topValue, fear: topFear, skipped: false }
    } catch {
        return { value: "time", fear: "inefficiency", skipped: true }
    }
}

const OPTIONS = [
    { id: "tackle", text: "I want to tackle it head on.", redirect: "That's commendable. What if you could do that by simply following the right steps?" },
    { id: "plan", text: "I want to create a plan.", redirect: "We think that way too. What if you already knew the best plan to follow?" },
    { id: "unsure", text: "I'm not sure.", redirect: "That's okay. What if the path forward was already mapped out for you?" },
    { id: "toomany", text: "I have too many ideas.", redirect: "We hear that a lot. What if you could narrow it all down to just one clear direction?" },
] as const

export default function InferencePage({ onProceed }: { onProceed: () => void }) {
    const [value, setValue] = useState("")
    const [fear, setFear] = useState("")
    const [mitoVisible, setMitoVisible] = useState(false)
    const [lineVisible, setLineVisible] = useState(false)
    const [optsVisible, setOptsVisible] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)
    const [redirect, setRedirect] = useState("")
    const [btnVisible, setBtnVisible] = useState(false)
    const [skipped, setSkipped] = useState(false)
    const [blink, setBlink] = useState(false)

    useEffect(() => {
        const { value, fear, skipped } = inferFromStorage()
        setValue(value)
        setFear(fear)
        setSkipped(skipped)

        const t1 = setTimeout(() => setMitoVisible(true), 200)
        const t2 = setTimeout(() => setLineVisible(true), 700)
        const t3 = setTimeout(() => setOptsVisible(true), 1400)

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [])

    useEffect(() => {
        const schedule = () => {
            const wait = 2000 + Math.random() * 2000
            setTimeout(() => {
                setBlink(true)
                setTimeout(() => {
                    setBlink(false)
                    schedule()
                }, 150)
            }, wait)
        }
        schedule()
    }, [])

    function handleSelect(id: string) {
        if (selected) return
        const opt = OPTIONS.find((o) => o.id === id)
        if (!opt) return
        setSelected(id)
        setRedirect(opt.redirect)
        setTimeout(() => setBtnVisible(true), 800)
    }

    function advance() {
        localStorage.setItem("ideal_goal_option", selected || "")
        onProceed()
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
            overflow: "hidden",
            boxSizing: "border-box",
            padding: `${css("--space-6")} ${css("--space-5")}`,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: css("--space-6"),
                width: "100%",
                maxWidth: 620,
            }}>

                {/* Mito + speech bubble */}
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: css("--space-4"),
                    opacity: mitoVisible ? 1 : 0,
                    transform: mitoVisible ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                        <img
                            src={blink ? "/mito_blink.png" : "/mito.png"}
                            width={40}
                            height={40}
                            style={{ display: "block", imageRendering: "pixelated" }}
                            alt="Mito"
                        />
                    </div>

                    <div style={{
                        border: css("--border"),
                        borderRadius: css("--radius"),
                        padding: "18px 16px",
                        position: "relative",
                        background: css("--bg"),
                        opacity: lineVisible ? 1 : 0,
                        transform: lineVisible ? "translateY(0)" : "translateY(4px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}>
                        {/* Speech bubble tail — outer */}
                        <div style={{
                            position: "absolute",
                            left: -7,
                            top: 12,
                            width: 0,
                            height: 0,
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderRight: `7px solid var(--ink)`,
                        }} />
                        {/* Speech bubble tail — inner */}
                        <div style={{
                            position: "absolute",
                            left: -5,
                            top: 12,
                            width: 0,
                            height: 0,
                            borderTop: "5px solid transparent",
                            borderBottom: "5px solid transparent",
                            borderRight: `7px solid var(--bg)`,
                        }} />

                        <p style={{
                            fontFamily: css("--sans"),
                            fontSize: css("--size-body"),
                            fontWeight: 300,
                            color: css("--ink"),
                            lineHeight: css("--lh-body"),
                            margin: 0,
                        }}>
                            {skipped ? (
                                <>
                                    So you didn't get through the resources. That's alright.{" "}
                                    We know you value time, and fear inefficiency.
                                    <br />
                                    So what do you want to do about it?
                                </>
                            ) : (
                                <>
                                    Based on what you've let us know, you value{" "}
                                    <strong style={{ fontFamily: css("--mono"), fontWeight: 400, fontSize: "0.9em" }}>
                                        {value}
                                    </strong>
                                    {", "}but fear{" "}
                                    <strong style={{ fontFamily: css("--mono"), fontWeight: 400, fontSize: "0.9em" }}>
                                        {fear}
                                    </strong>
                                    {"."}
                                    <br />
                                    So what do you want to do about it?
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Options / Redirect */}
                <div style={{
                    width: "100%",
                    opacity: optsVisible ? 1 : 0,
                    transform: optsVisible ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                }}>
                    {!selected ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: css("--space-3"),
                        }}>
                            {OPTIONS.map((opt) => (
                                <ChoiceButton key={opt.id} onClick={() => handleSelect(opt.id)}>
                                    {opt.text}
                                </ChoiceButton>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: css("--space-5"),
                        }}>
                            <p style={{
                                fontFamily: css("--sans"),
                                fontSize: css("--size-body"),
                                fontWeight: 300,
                                color: css("--ink"),
                                lineHeight: css("--lh-body"),
                                margin: 0,
                                animation: "fadeUp 0.5s ease forwards",
                            }}>
                                {redirect}
                            </p>

                            <div style={{
                                opacity: btnVisible ? 1 : 0,
                                transform: btnVisible ? "translateY(0)" : "translateY(6px)",
                                transition: "opacity 0.5s ease, transform 0.5s ease",
                            }}>
                                <PixelButton onClick={advance}>Tell me more</PixelButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}