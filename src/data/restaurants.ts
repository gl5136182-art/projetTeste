// Fotos: salve uma foto de cada em public/restaurants/<slug>.jpg
// Itens marcados com "conferir" não foram confirmados no cardápio da unidade de Uberlândia.

export type Restaurant = {
  slug: string
  name: string
  tag: string
  description: string
  dishes: string[]
  color: string
  emoji: string
}

export const RESTAURANTS: Restaurant[] = [
  {
    slug: 'coco-bambu',
    name: 'Coco Bambu',
    tag: 'frutos do mar',
    description:
      'O clássico dos camarões: salão enorme, adega caprichada e pratos fartos pra dividir a dois.',
    dishes: ['Camarão Internacional', 'Camarão Coco Bambu', 'Moqueca Cearense'],
    color: 'var(--color-sky)',
    emoji: '🦐',
  },
  {
    slug: 'clementina',
    name: 'Clementina Bar e Ristoranti',
    tag: 'italiano',
    description:
      'Italiano aconchegante no Plaza Shopping Hotel, com piano ao vivo e vinho em meia garrafa pra brindar sem pressa.',
    // conferir
    dishes: ['Massas artesanais', 'Risotos', 'Vinho em meia garrafa'],
    color: 'var(--color-butter)',
    emoji: '🍝',
  },
  {
    slug: 'barolo',
    name: 'Barolo',
    tag: 'italiano & internacional',
    description:
      'Inspirado na tradição italiana e internacional, no Center Shopping. Massas, grelhados e frutos do mar.',
    // conferir
    dishes: ['Massas da casa', 'Grelhados', 'Frutos do mar'],
    color: 'var(--color-pink)',
    emoji: '🍷',
  },
  {
    slug: 'santa-chiara',
    name: 'Santa Chiara',
    tag: 'clima de bistrô',
    description:
      'Queridinho do Santa Mônica, um dos favoritos da cidade. Ambiente gostoso pra conversar a noite toda.',
    // conferir
    dishes: ['Prato da casa', 'Massas', 'Sobremesas'],
    color: 'var(--color-mint)',
    emoji: '🕯️',
  },
  {
    slug: 'alameda-270',
    name: 'Alameda 270',
    tag: 'contemporâneo',
    description:
      'Cozinha simples e sofisticada, ambiente confortável e atendimento elogiado. Perfeito pra uma noite especial.',
    // conferir (risoto de camarão citado em avaliações)
    dishes: ['Risoto de camarão', 'Pratos autorais', 'Drinks'],
    color: 'var(--color-lilac)',
    emoji: '🥂',
  },
]
