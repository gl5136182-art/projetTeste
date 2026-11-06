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
      'O clássico dos camarões, com pratos fartos pra dividir a dois. E de sobremesa tem cocada ao forno, servida quentinha.',
    // conferir: cardápio de outras unidades da rede
    dishes: ['Camarão Coco Bambu', 'Camarão Coco Brasil', 'Carbonara Coco Bambu'],
    color: 'var(--color-sky)',
    emoji: '🦐',
  },
  {
    slug: 'clementina',
    name: 'Clementina Bar e Ristoranti',
    tag: 'internacional',
    description:
      'Bar e ristorante aconchegante com piano ao vivo, carta caprichada de uísques e pratos internacionais.',
    // conferir: só recomendações de clientes
    dishes: ['Tamboril', 'Filé américain', 'Massas'],
    color: 'var(--color-butter)',
    emoji: '🎹',
  },
  {
    slug: 'barolo',
    name: 'Barolo',
    tag: 'italiano',
    description:
      'Chamada por clientes de melhor casa de massas da cidade. Tem também buffet de saladas e opção vegana.',
    dishes: ['Ancho com talharim fresco', 'Rondelli de gorgonzola com castanhas'],
    color: 'var(--color-pink)',
    emoji: '🍝',
  },
  {
    slug: 'magnit',
    name: 'Magnit Gourmet',
    tag: 'carnes nobres',
    description:
      'Premium e romântico: cortes selecionados da Grã-Bretanha e da Argentina, risotos cremosos e até jacaré na brasa.',
    dishes: ['Magret de pato', 'Picanha da Grã-Bretanha', 'Risoto de trufas negras'],
    color: 'var(--color-butter)',
    emoji: '🥩',
  },
  {
    slug: 'antonina',
    name: 'Antonina Osteria Tartuferia',
    tag: 'italiano & trufas',
    description:
      'Osteria focada em trufas, com menu degustação de três tempos. De sobremesa, tiramisù ou Banoffee Antonina.',
    dishes: ['Lasanha Al Tartufo', 'Burrata', 'Risoto'],
    color: 'var(--color-mint)',
    emoji: '🍄',
  },
  {
    slug: 'bottega',
    name: 'Bottega Ristorante',
    tag: 'italiano',
    description:
      'Cantina italiana aconchegante, perfeita pra dividir uma massa e um vinho sem olhar o relógio.',
    // conferir
    dishes: ['Massas frescas', 'Risotos', 'Tiramisù'],
    color: 'var(--color-lilac)',
    emoji: '🇮🇹',
  },
]