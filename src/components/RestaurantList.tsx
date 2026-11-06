import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { RESTAURANTS, SURPRISE, type Restaurant } from '../data/restaurants'
import { BrutalButton, ScreenHeader, Sparkle } from './ui'

function Photo({ r }: { r: Restaurant }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center" style={{ backgroundColor: r.color }}>
        <div className="text-center">
          <span className="block text-5xl">{r.emoji}</span>
          <span className="mt-1 block font-hand text-2xl">{r.name}</span>
        </div>
      </div>
    )
  }
  return (
    <img
      src={`/restaurants/${r.slug}.jpg`}
      alt={r.name}
      loading="lazy"
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

type Props = { selected: string | null; onSelect: (slug: string) => void; onBack: () => void; onNext: () => void }

function ChosenStamp({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className="absolute top-4 right-3 rounded-lg border-[3px] border-pink-deep bg-white/90 px-3 py-1 font-display text-lg font-extrabold text-pink-deep uppercase"
          initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
          animate={{ scale: 1, opacity: 1, rotate: 10 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        >
          escolhido!
        </motion.span>
      )}
    </AnimatePresence>
  )
}

const SPARKS = [
  { top: '14%', left: '12%', size: 26 },
  { top: '62%', left: '8%', size: 16 },
  { top: '20%', left: '80%', size: 18 },
  { top: '68%', left: '84%', size: 28 },
  { top: '40%', left: '28%', size: 12 },
]

function SurpriseCard({ selected, delay, onSelect }: { selected: boolean; delay: number; onSelect: () => void }) {
  return (
    <motion.button
      onClick={onSelect}
      className="brutal-card relative overflow-hidden text-left"
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: selected ? 1.2 : 0,
        boxShadow: selected ? '7px 7px 0 var(--color-pink-deep)' : '4px 4px 0 #1a1a1a',
        borderWidth: selected ? 4 : 3,
      }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 24 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
    >
      <div
        className="relative grid h-44 w-full place-items-center overflow-hidden border-b-[3px] border-ink"
        style={{
          backgroundColor: 'var(--color-lilac)',
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0 14px, rgb(255 255 255 / 0.25) 14px 28px)',
        }}
      >
        {SPARKS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ top: s.top, left: s.left }}
            animate={{ rotate: [0, 20, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          >
            <Sparkle size={s.size} fill={i % 2 ? 'white' : 'var(--color-butter)'} />
          </motion.span>
        ))}
        <motion.span
          className="grid h-24 w-24 place-items-center rounded-full border-[3px] border-ink bg-white font-display text-6xl font-extrabold"
          style={{ boxShadow: 'var(--shadow-brutal)' }}
          animate={selected ? { rotate: [0, -12, 12, -6, 0], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          ?
        </motion.span>
      </div>
      <span className="absolute top-3 left-3 rounded-full border-2 border-ink bg-butter px-3 py-0.5 font-display text-xs font-extrabold">
        mistério
      </span>

      <ChosenStamp show={selected} />

      <div className="p-4">
        <h3 className="font-display text-2xl leading-tight font-extrabold">me surpreenda 🤫</h3>
        <p className="mt-1.5 text-[15px] leading-snug text-ink/75">
          Deixa que eu escolho o lugar e só conto quando a gente chegar. Prometo caprichar.
        </p>
      </div>
    </motion.button>
  )
}

export default function RestaurantList({ selected, onSelect, onBack, onNext }: Props) {
  const surprise = selected === SURPRISE
  return (
    <div className="flex min-h-dvh flex-col px-5 pt-6">
      <ScreenHeader step={2} total={4} onBack={onBack} kicker="agora a parte gostosa" title="onde a gente vai?" />

      <div className="flex flex-col gap-6">
        {RESTAURANTS.map((r, i) => {
          const sel = selected === r.slug
          return (
            <motion.button
              key={r.slug}
              onClick={() => onSelect(r.slug)}
              className="brutal-card relative overflow-hidden text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: sel ? -1.2 : 0,
                boxShadow: sel ? '7px 7px 0 var(--color-pink-deep)' : '4px 4px 0 #1a1a1a',
                borderWidth: sel ? 4 : 3,
              }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={sel}
            >
              <div className="aspect-[4/3] w-full overflow-hidden border-b-[3px] border-ink">
                <Photo r={r} />
              </div>
              <span
                className="absolute top-3 left-3 rounded-full border-2 border-ink px-3 py-0.5 font-display text-xs font-extrabold"
                style={{ backgroundColor: r.color }}
              >
                {r.tag}
              </span>

              <ChosenStamp show={sel} />

              <div className="p-4">
                <h3 className="font-display text-2xl leading-tight font-extrabold">{r.name}</h3>
                <p className="mt-1.5 text-[15px] leading-snug text-ink/75">{r.description}</p>
                <p className="mt-3 font-hand text-xl leading-none">pratos chefes:</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.dishes.map((d) => (
                    <span key={d} className="rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 text-sm font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          )
        })}

        <SurpriseCard selected={surprise} delay={RESTAURANTS.length * 0.06} onSelect={() => onSelect(SURPRISE)} />
      </div>

      <div className="sticky bottom-0 z-20 -mx-5 mt-4 bg-gradient-to-t from-cream via-cream/95 to-transparent px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <BrutalButton className="w-full" color="var(--color-pink-deep)" disabled={!selected} onClick={onNext}>
          {surprise ? 'confio em você! →' : selected ? 'esse aí! →' : 'escolhe um ♡'}
        </BrutalButton>
      </div>
    </div>
  )
}
