import { motion, type HTMLMotionProps } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'

export function Sticker({
  who,
  size = 120,
  rotate = 0,
  className = '',
  style,
}: {
  who: 'jp' | 'valen'
  size?: number
  rotate?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <img
      src={`/caricaturas/${who}.webp`}
      alt={who === 'jp' ? 'JP' : 'Valen'}
      width={size}
      height={size}
      draggable={false}
      className={`sticker pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, rotate: `${rotate}deg`, ...style }}
    />
  )
}

type BtnProps = HTMLMotionProps<'button'> & { color?: string; children: ReactNode }

export function BrutalButton({ color = 'var(--color-pink)', className = '', style, children, ...rest }: BtnProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`brutal-btn px-6 py-3.5 text-lg ${className}`}
      style={{ backgroundColor: color, ...style }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function Heart({ size = 24, fill = 'var(--color-pink-deep)', className = '' }: { size?: number; fill?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 5.4 3.3 1.8-2.1 3.3-3.3 5.4-3.3 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
        fill={fill}
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({ size = 20, fill = 'var(--color-butter)', className = '' }: { size?: number; fill?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 1.5l2.4 7.1 7.1 2.4-7.1 2.4L12 20.5l-2.4-7.1-7.1-2.4 7.1-2.4z"
        fill={fill}
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`passo ${step} de ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.span
          key={i}
          className="block h-3 rounded-full border-2 border-ink"
          animate={{
            width: i + 1 === step ? 28 : 12,
            backgroundColor: i + 1 <= step ? 'var(--color-pink-deep)' : '#ffffff',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        />
      ))}
    </div>
  )
}

export function ScreenHeader({
  step,
  total,
  onBack,
  kicker,
  title,
}: {
  step: number
  total: number
  onBack?: () => void
  kicker: string
  title: ReactNode
}) {
  return (
    <header className="mb-5">
      <div className="mb-5 flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="brutal-btn h-10 w-10 bg-white text-xl"
            style={{ boxShadow: 'var(--shadow-brutal-sm)' }}
            aria-label="voltar"
          >
            ←
          </button>
        ) : (
          <span className="h-10 w-10" />
        )}
        <Stepper step={step} total={total} />
        <span className="h-10 w-10" />
      </div>
      <p className="font-hand text-2xl leading-none text-pink-deep">{kicker}</p>
      <h1 className="mt-1 font-display text-[2rem] leading-[1.05] font-extrabold tracking-tight">{title}</h1>
    </header>
  )
}
