import { AnimatePresence, motion } from 'motion/react'
import { AVAILABLE_DAYS, MONTH, MONTH_LABEL, TIMES, WEEKDAY_LABELS, YEAR } from '../data/dates'
import { BrutalButton, ScreenHeader, Sticker } from './ui'

type Props = {
  date: string | null
  time: string | null
  onDate: (iso: string) => void
  onTime: (t: string) => void
  onBack: () => void
  onNext: () => void
}

export default function DateTimePicker({ date, time, onDate, onTime, onBack, onNext }: Props) {
  const firstWeekday = new Date(YEAR, MONTH, 1).getDay()
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-6 pb-8">
      <ScreenHeader step={1} total={4} onBack={onBack} kicker="eba!! então..." title="qual dia fica melhor?" />

      <div className="brutal-card overflow-hidden" style={{ boxShadow: 'var(--shadow-brutal-lg)' }}>
        <div className="flex items-center justify-between border-b-[3px] border-ink bg-lilac px-4 py-3">
          <span className="font-display text-xl font-extrabold capitalize">{MONTH_LABEL}</span>
          <span className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 font-display text-sm font-extrabold">
            {YEAR}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 p-3">
          {WEEKDAY_LABELS.map((l, i) => (
            <span key={i} className="pb-1 text-center font-display text-xs font-extrabold text-ink/50">
              {l}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={i} />
            const avail = AVAILABLE_DAYS.find((d) => d.day === day)
            if (!avail) {
              return (
                <span
                  key={i}
                  className="relative grid aspect-square place-items-center text-sm text-ink/25 line-through decoration-ink/25"
                >
                  {day}
                </span>
              )
            }
            const selected = date === avail.iso
            return (
              <motion.button
                key={i}
                onClick={() => onDate(avail.iso)}
                className="relative grid aspect-square place-items-center rounded-xl border-[2.5px] border-ink font-display text-lg font-extrabold"
                style={{ backgroundColor: avail.color }}
                animate={
                  selected
                    ? { scale: 1.12, rotate: -4, boxShadow: '3px 3px 0 #1a1a1a' }
                    : { scale: [1, 1.06, 1], rotate: 0, boxShadow: '2px 2px 0 #1a1a1a' }
                }
                transition={selected ? { type: 'spring', stiffness: 400, damping: 15 } : { duration: 1.6, repeat: Infinity, delay: day * 0.1 }}
                whileTap={{ scale: 0.92 }}
                aria-pressed={selected}
                aria-label={`${avail.weekday}, ${day} de ${MONTH_LABEL}`}
              >
                {day}
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      className="absolute -top-8 -right-7 z-10"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    >
                      <Sticker who="jp" size={38} rotate={12} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {AVAILABLE_DAYS.map((d) => (
          <button
            key={d.iso}
            onClick={() => onDate(d.iso)}
            className="rounded-xl border-2 border-ink px-2 py-1.5 text-center transition-colors"
            style={{ backgroundColor: date === d.iso ? d.color : 'white' }}
          >
            <span className="block font-display text-sm font-extrabold">{d.weekday}</span>
            <span className="block font-hand text-lg leading-none">{d.vibe}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {date && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6"
          >
            <h2 className="font-display text-xl font-extrabold">
              e que horas? <span className="font-hand text-2xl font-bold text-pink-deep">te busco ♡</span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {TIMES.map((t) => {
                const sel = time === t
                return (
                  <motion.button
                    key={t}
                    onClick={() => onTime(t)}
                    whileTap={{ scale: 0.92 }}
                    animate={{ y: sel ? -3 : 0 }}
                    className="rounded-full border-[2.5px] border-ink px-4 py-2 font-display font-extrabold"
                    style={{
                      backgroundColor: sel ? 'var(--color-butter)' : 'white',
                      boxShadow: sel ? '3px 3px 0 #1a1a1a' : '1px 1px 0 #1a1a1a',
                    }}
                    aria-pressed={sel}
                  >
                    {t}
                  </motion.button>
                )
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-8">
        <BrutalButton className="w-full" color="var(--color-pink-deep)" disabled={!date || !time} onClick={onNext}>
          próximo →
        </BrutalButton>
      </div>
    </div>
  )
}
