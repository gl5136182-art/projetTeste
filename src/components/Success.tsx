import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { formatDay } from '../data/dates'
import { SURPRISE, placeName } from '../data/restaurants'
import { whatsappLink } from '../lib/supabase'
import { BrutalButton, Heart, Sparkle, Sticker } from './ui'

type Props = { date: string; time: string; restaurant: string; note: string; saved: boolean }

export default function Success({ date, time, restaurant, note, saved }: Props) {
  const surprise = restaurant === SURPRISE

  useEffect(() => {
    const colors = ['#ffb5c8', '#ff7aa2', '#c9b6ff', '#ffe27a', '#b8f2d0']
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.55 }, colors, disableForReducedMotion: true })
    const t = setTimeout(
      () => confetti({ particleCount: 60, spread: 120, origin: { y: 0.35 }, colors, shapes: ['circle'], disableForReducedMotion: true }),
      450,
    )
    return () => clearTimeout(t)
  }, [])

  const message = [
    'Kingo, topei o encontro ♡',
    '',
    `📅 ${formatDay(date)}`,
    `⏰ ${time}`,
    surprise ? '📍 me surpreenda! 🤫' : `📍 ${placeName(restaurant)}`,
    ...(note ? ['', `💌 ${note}`] : []),
  ].join('\n')

  return (
    <div className="relative flex min-h-dvh flex-col items-center px-5 pt-14 pb-10 text-center">
      <Sparkle className="absolute top-10 left-8" size={28} />
      <Sparkle className="absolute top-24 right-10" size={18} fill="var(--color-lilac)" />

      <div className="relative flex h-52 w-full max-w-xs items-end justify-center">
        <motion.div initial={{ x: -90, rotate: -20 }} animate={{ x: 18, rotate: -6 }} transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.1 }}>
          <Sticker who="jp" size={160} />
        </motion.div>
        <motion.div initial={{ x: 90, rotate: 20 }} animate={{ x: -18, rotate: 6 }} transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.1 }}>
          <Sticker who="valen" size={160} />
        </motion.div>
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          initial={{ scale: 0, y: 30 }}
          animate={{ scale: [0, 1.3, 1], y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Heart size={52} />
        </motion.div>
      </div>

      <motion.h1
        className="mt-6 font-display text-5xl font-extrabold tracking-tight"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.3 }}
      >
        tá marcado! ♡
      </motion.h1>
      <p className="mt-2 font-hand text-2xl">
        {formatDay(date)}, {time}, {surprise ? 'num lugar surpresa 🤫' : `no ${placeName(restaurant)}`}
      </p>

      <div className="brutal-card mt-8 w-full max-w-sm px-5 py-5" style={{ backgroundColor: 'var(--color-pink)' }}>
        <p className="font-display text-lg leading-snug font-extrabold">
          {saved ? 'já anotei aqui do meu lado ✍️' : 'quase! falta só me avisar 👇'}
        </p>
        <p className="mt-1 text-[15px] text-ink/75">Me manda essa mensagem no zap pra eu surtar de felicidade em tempo real?</p>
        <BrutalButton
          className="mt-4 w-full"
          color="var(--color-mint)"
          onClick={() => window.open(whatsappLink(message), '_blank', 'noopener')}
        >
          me avisa no WhatsApp 💬
        </BrutalButton>
      </div>

      <p className="mt-8 font-hand text-2xl text-ink/60">mal posso esperar ♡ — JP</p>
    </div>
  )
}
