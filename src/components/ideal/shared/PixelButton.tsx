import { useState, type ReactNode } from 'react'

const css = (v: string) => `var(${v})`

export default function PixelButton({ children, onClick, disabled = false, position = 'solo' }: {
  children: ReactNode
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

