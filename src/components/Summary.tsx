import { motion } from 'motion/react'
import { formatDay } from '../data/dates'
import { RESTAURANTS } from '../data/restaurants'
import { BrutalButton, ScreenHeader, Sticker } from './ui'

type Props = {
  date: string
  time: string
  restaurant: string
  note: string
  onNote: (s: string) => void
  sending: boolean
  onBack: () => void
  onConfirm: () => void
}

export default function Summary({ date, time, restaurant, note, onNote, sending, onBack, onConfirm }: Props) {
  const r = RESTAURANTS.find((x) => x.slug === restaurant)!
  const rows = [
    { label: 'quando', value: formatDay(date) },
    { label: 'que horas', value: time },
    { label: 'onde', value: r.name },
  ]

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-6 pb-8">
      <ScreenHeader step={3} total={4} onBack={onBack} kicker="quase lá!" title="confere nosso ingresso" />

      {/* ingresso com picote */}
      <motion.div
        className="relative mt-4"
        initial={{ y: 40, rotate: 4, opacity: 0 }}
        animate={{ y: 0, rotate: -1.5, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <div className="brutal-card overflow-visible" style={{ backgroundColor: 'var(--color-butter)', boxShadow: 'var(--shadow-brutal-lg)' }}>
          <div className="flex items-center justify-between border-b-[3px] border-dashed border-ink px-5 py-3">
            <span className="font-display text-sm font-extrabold tracking-[0.2em] uppercase">admit two</span>
            <span className="font-hand text-2xl">JP ♡ Valen</span>
          </div>
          <dl className="space-y-3 px-5 py-4 pr-28">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="font-hand text-lg leading-none text-ink/60">{row.label}</dt>
                <dd className="font-display text-xl leading-tight font-extrabold">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {/* furinhos laterais */}
        <span className="absolute top-[52px] -left-3 h-6 w-6 rounded-full border-[3px] border-ink bg-cream" />
        <span className="absolute top-[52px] -right-3 h-6 w-6 rounded-full border-[3px] border-ink bg-cream" />
        <div className="absolute -right-3 -bottom-5">
          <Sticker who="valen" size={120} rotate={8} />
        </div>
      </motion.div>

      <label className="mt-10 block">
        <span className="font-display text-lg font-extrabold">
          deixa um recadinho pro JP <span className="font-hand text-xl font-bold text-ink/50">(opcional)</span>
        </span>
        <textarea
          value={note}
          onChange={(e) => onNote(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="ex: me busca em casa? / não como frutos do mar / mal posso esperar..."
          className="brutal-card mt-2 w-full resize-none px-4 py-3 text-base outline-none placeholder:text-ink/35 focus:bg-[#fffdf8]"
          style={{ boxShadow: 'var(--shadow-brutal-sm)' }}
        />
      </label>

      <div className="mt-auto pt-6">
        <BrutalButton className="w-full text-xl" color="var(--color-mint)" disabled={sending} onClick={onConfirm}>
          {sending ? 'enviando... 💌' : 'confirmar encontro ♡'}
        </BrutalButton>
      </div>
    </div>
  )
}
