import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export type Encontro = {
  data: string
  horario: string
  restaurante: string
  recado: string
  fugas_do_nao: number
}

export async function saveEncontro(encontro: Encontro): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase não configurado (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')
    return false
  }
  // sem .select(): a policy só permite insert, então não pedimos a linha de volta
  const { error } = await supabase
    .from('encontros')
    .insert({ ...encontro, recado: encontro.recado || null, user_agent: navigator.userAgent.slice(0, 500) })
  if (error) console.error(error)
  return !error
}

export function whatsappLink(text: string) {
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '') ?? ''
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
