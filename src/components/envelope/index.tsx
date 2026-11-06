import { motion } from 'motion/react'
import { Component, lazy, Suspense, useState, type ReactNode } from 'react'
import EnvelopeCSS from './EnvelopeCSS'
import { Heart, Sparkle } from '../ui'

const Envelope3D = lazy(() => import('./Envelope3D'))

function canUse3D() {
  if (new URLSearchParams(location.search).has('css')) return false
  if ((navigator.hardwareConcurrency ?? 8) <= 2) return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

class Fallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function Envelope({ onOpened }: { onOpened: () => void }) {
  const [use3D, setUse3D] = useState(canUse3D)
  const [opening, setOpening] = useState(false)

  const css = <EnvelopeCSS opening={opening} onDone={onOpened} />

  return (
    <div
      className="relative flex h-dvh w-full cursor-pointer flex-col items-center justify-center overflow-hidden select-none"
      onClick={() => setOpening(true)}
      role="button"
      aria-label="abrir a cartinha"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[12%] text-center"
        animate={{ opacity: opening ? 0 : 1, y: opening ? -20 : 0 }}
      >
        <p className="font-hand text-3xl text-pink-deep">psiu...</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">chegou uma carta</h1>
      </motion.div>

      <Sparkle className="absolute top-[24%] left-[12%] rotate-12" size={26} />
      <Heart className="absolute top-[30%] right-[10%] -rotate-12" size={30} />
      <Sparkle className="absolute bottom-[22%] right-[16%]" size={18} fill="var(--color-lilac)" />
      <Heart className="absolute bottom-[26%] left-[10%] rotate-6" size={20} fill="var(--color-pink)" />

      <div className="h-[62dvh] w-full">
        {use3D ? (
          <Fallback fallback={css}>
            <Suspense fallback={<p className="mt-[25dvh] text-center font-hand text-2xl">dobrando a cartinha...</p>}>
              <Envelope3D opening={opening} onDone={onOpened} onFail={() => setUse3D(false)} />
            </Suspense>
          </Fallback>
        ) : (
          css
        )}
      </div>

      <motion.p
        className="pointer-events-none absolute inset-x-0 bottom-[10%] text-center font-display text-lg font-extrabold"
        animate={opening ? { opacity: 0 } : { y: [0, -6, 0], opacity: 1 }}
        transition={opening ? { duration: 0.2 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="brutal-card inline-block px-4 py-2" style={{ backgroundColor: 'var(--color-butter)' }}>
          toque pra abrir 💌
        </span>
      </motion.p>
    </div>
  )
}
