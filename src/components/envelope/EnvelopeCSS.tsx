import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Heart } from '../ui'

// fallback sem WebGL: mesmo roteiro do 3D (selo → aba → carta) com transforms CSS
export default function EnvelopeCSS({ opening, onDone }: { opening: boolean; onDone: () => void }) {
  // depois de passar de 90°, a aba vai para trás da carta
  const [flapBehind, setFlapBehind] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!opening) return
    const a = setTimeout(() => setFlapBehind(true), 700)
    const b = setTimeout(onDone, 2800)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [opening, onDone])

  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        ref={box}
        className="relative"
        style={{ width: 'min(82vw, 340px)', aspectRatio: '3 / 2' }}
        animate={opening ? { y: [0, 0, 120], opacity: [1, 1, 0] } : { y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={
          opening ? { duration: 2.8, times: [0, 0.7, 1], ease: 'easeInOut' } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* fundo */}
        <div className="absolute inset-0 z-0 rounded-lg border-[3px] border-ink bg-[#ff9db8]" />

        {/* carta */}
        <motion.div
          className="absolute inset-x-[6%] top-[7%] h-[86%] z-[2] flex flex-col items-center rounded-md border-[3px] border-ink bg-white pt-3"
          initial={false}
          // motion não anima "%" aqui de forma confiável, então usamos px
          animate={{ y: opening ? -(box.current?.offsetHeight ?? 200) * 0.6 : 0 }}
          transition={{ delay: 1, duration: 0.8, type: 'spring', bounce: 0.35 }}
        >
          <span className="font-hand text-3xl font-bold">oi, Valen ♡</span>
          <span className="font-hand text-xl">tenho uma pergunta...</span>
        </motion.div>

        {/* frente com o V */}
        <div
          className="absolute inset-0 z-[3] border-[3px] border-ink bg-pink"
          style={{ clipPath: 'polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)', borderRadius: 8 }}
        />
        <svg className="pointer-events-none absolute inset-0 z-[3] h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none">
          <polyline points="0,0 150,92 300,0" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
        </svg>
        <p className="absolute inset-x-0 bottom-[12%] z-[3] text-center font-hand text-3xl font-bold">Para: Valen ♡</p>

        {/* aba */}
        <motion.div
          className="absolute inset-x-0 top-0 origin-top"
          style={{ height: '62%', zIndex: flapBehind ? 1 : 4, transformPerspective: 900 }}
          initial={false}
          animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0 bg-[#ff9fb8]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 124" preserveAspectRatio="none">
            <polygon points="1.5,1.5 298.5,1.5 150,122" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <motion.div
            className="absolute left-1/2 bottom-0 grid h-14 w-14 -translate-x-1/2 translate-y-1/3 place-items-center rounded-full border-[3px] border-ink bg-[#e2365b]"
            animate={opening ? { scale: [1, 1.4, 0], rotate: 200 } : { scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <Heart size={26} fill="#ff6f8e" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
