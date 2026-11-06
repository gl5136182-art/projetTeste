import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { BrutalButton, Heart, Sticker } from './ui'

const NO_TEXTS = ['não', 'tem certeza?', 'pensa bem…', 'certeza mesmo?', 'o JP vai chorar 😭', 'última chance!', 'desiste 😌']

export default function AskScreen({ onYes }: { onYes: (dodges: number) => void }) {
  const [dodges, setDodges] = useState(0)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const area = useRef<HTMLDivElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)

  // pula para um ponto aleatório da área, longe de onde estava
  const flee = () => {
    const a = area.current?.getBoundingClientRect()
    const b = noRef.current?.getBoundingClientRect()
    if (!a || !b) return
    const maxX = a.width - b.width
    const maxY = a.height - b.height
    let x = 0
    let y = 0
    for (let i = 0; i < 10; i++) {
      x = Math.random() * maxX
      y = Math.random() * maxY
      const cur = pos ?? { x: b.left - a.left, y: b.top - a.top }
      if (Math.hypot(x - cur.x, y - cur.y) > Math.min(a.width, a.height) * 0.35) break
    }
    setPos({ x, y })
    setDodges((d) => d + 1)
  }

  const noScale = Math.max(0.55, 1 - dodges * 0.08)
  const yesScale = Math.min(1.5, 1 + dodges * 0.08)

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-10 pb-8">
      <div className="relative mx-auto mb-2 flex h-44 w-full max-w-sm items-end justify-center">
        <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 12, opacity: 1 }} transition={{ type: 'spring', delay: 0.15 }}>
          <Sticker who="jp" size={150} rotate={-8} />
        </motion.div>
        <motion.div
          className="z-10 -mx-3 mb-16"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={44} />
        </motion.div>
        <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: -12, opacity: 1 }} transition={{ type: 'spring', delay: 0.25 }}>
          <Sticker who="valen" size={150} rotate={7} />
        </motion.div>
      </div>

      <motion.div
        className="brutal-card px-5 py-6 text-center"
        style={{ backgroundColor: 'white' }}
        initial={{ y: 30, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: -1 }}
        transition={{ type: 'spring', delay: 0.35 }}
      >
        <p className="font-hand text-2xl text-pink-deep">Valen, eu tava pensando...</p>
        <h1 className="mt-1 font-display text-[2.2rem] leading-[1.05] font-extrabold tracking-tight">
          aceita sair comigo?
        </h1>
        <p className="mt-3 text-[15px] text-ink/70">
          Vou estar em Uberlândia nos dias 20 e 21 de novembro e queria muito te ver ♡
        </p>
      </motion.div>

      {/* área de fuga do "não" */}
      <div ref={area} className="relative mt-6 min-h-56 flex-1">
        <div className="flex items-start justify-center gap-4 pt-4">
          <motion.div animate={{ scale: yesScale }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
            <BrutalButton color="var(--color-mint)" className="px-9 text-xl" onClick={() => onYes(dodges)}>
              sim! ♡
            </BrutalButton>
          </motion.div>
          {pos === null && (
            <BrutalButton
              ref={noRef}
              color="white"
              className="text-xl"
              onPointerDown={(e) => {
                e.preventDefault()
                flee()
              }}
              onPointerEnter={(e) => e.pointerType === 'mouse' && flee()}
            >
              {NO_TEXTS[0]}
            </BrutalButton>
          )}
        </div>

        {pos !== null && (
          <motion.button
            ref={noRef}
            className="brutal-btn absolute top-0 left-0 bg-white px-5 py-3 text-lg whitespace-nowrap"
            initial={false}
            animate={{ x: pos.x, y: pos.y, scale: noScale, rotate: dodges % 2 ? 6 : -6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            onPointerDown={(e) => {
              e.preventDefault()
              flee()
            }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && flee()}
            onClick={(e) => {
              // garantia: se algum clique escapar (teclado), conta como fuga
              e.preventDefault()
              flee()
            }}
          >
            {NO_TEXTS[Math.min(dodges, NO_TEXTS.length - 1)]}
          </motion.button>
        )}
      </div>

      {dodges >= 3 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-hand text-xl text-ink/60">
          {dodges} tentativas e contando... 😏
        </motion.p>
      )}
    </div>
  )
}
