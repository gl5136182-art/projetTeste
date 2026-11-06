import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import AskScreen from './components/AskScreen'
import DateTimePicker from './components/DateTimePicker'
import Envelope from './components/envelope'
import RestaurantList from './components/RestaurantList'
import Success from './components/Success'
import Summary from './components/Summary'
import { saveEncontro } from './lib/supabase'

type Step = 'envelope' | 'ask' | 'date' | 'restaurant' | 'summary' | 'success'
const ORDER: Step[] = ['envelope', 'ask', 'date', 'restaurant', 'summary', 'success']

export default function App() {
  const [step, setStep] = useState<Step>('envelope')
  const [dir, setDir] = useState(1)
  const [dodges, setDodges] = useState(0)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [restaurant, setRestaurant] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [saved, setSaved] = useState(false)

  const go = (next: Step) => {
    setDir(ORDER.indexOf(next) > ORDER.indexOf(step) ? 1 : -1)
    setStep(next)
    window.scrollTo({ top: 0 })
  }

  const confirm = async () => {
    if (!date || !time || !restaurant) return
    setSending(true)
    const ok = await saveEncontro({ data: date, horario: time, restaurante: restaurant, recado: note.trim(), fugas_do_nao: dodges })
    setSaved(ok)
    setSending(false)
    go('success')
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md overflow-x-hidden">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: step === 'ask' ? 0 : d * 60, scale: step === 'ask' ? 0.92 : 1 }),
            center: { opacity: 1, x: 0, scale: 1 },
            exit: (d: number) => ({ opacity: 0, x: step === 'envelope' ? 0 : d * -60 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {step === 'envelope' && <Envelope onOpened={() => go('ask')} />}
          {step === 'ask' && (
            <AskScreen
              onYes={(n) => {
                setDodges(n)
                go('date')
              }}
            />
          )}
          {step === 'date' && (
            <DateTimePicker date={date} time={time} onDate={setDate} onTime={setTime} onBack={() => go('ask')} onNext={() => go('restaurant')} />
          )}
          {step === 'restaurant' && (
            <RestaurantList selected={restaurant} onSelect={setRestaurant} onBack={() => go('date')} onNext={() => go('summary')} />
          )}
          {step === 'summary' && date && time && restaurant && (
            <Summary
              date={date}
              time={time}
              restaurant={restaurant}
              note={note}
              onNote={setNote}
              sending={sending}
              onBack={() => go('restaurant')}
              onConfirm={confirm}
            />
          )}
          {step === 'success' && date && time && restaurant && (
            <Success date={date} time={time} restaurant={restaurant} note={note.trim()} saved={saved} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
