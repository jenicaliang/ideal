import { useState, type ReactNode } from 'react'

const css = (v: string) => `var(${v})`

const DARK_INK = "#f5f3ef"
const DARK_BG = "#1e1e1e"
const DARK_MID = "rgba(245,243,239,0.45)"

export default function PixelButton({ children, onClick, disabled = false, position = 'solo', variant = 'light' }: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  position?: 'solo' | 'left' | 'right'
  variant?: 'light' | 'dark'
}) {
  const [hovered, setHovered] = useState(false)

  const ink = variant === 'dark' ? DARK_INK : css('--ink')
  const bg = variant === 'dark' ? DARK_BG : css('--bg')
  const mid = variant === 'dark' ? DARK_MID : css('--mid')

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
        background: disabled ? 'transparent' : hovered ? ink : 'transparent',
        borderTop: `1.5px solid ${ink}`,
        borderBottom: `1.5px solid ${ink}`,
        borderLeft: `1.5px solid ${ink}`,
        borderRight: position === 'left' ? 'none' : `1.5px solid ${ink}`,
        borderRadius: position === 'solo' ? css('--radius') : 0,
        padding: '6px 18px',
        color: disabled ? mid : hovered ? bg : ink,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}