# Convite 💌

Site-convite mobile-first: envelope 3D → "aceita sair comigo?" → dia/horário → restaurante → recado → confirmação (Supabase + WhatsApp).

```bash
npm install
npm run dev
```

- `?css` na URL força o envelope em CSS (fallback sem WebGL).
- Datas/horários: `src/data/dates.ts` · Restaurantes: `src/data/restaurants.ts` (itens com `// conferir` não foram confirmados no cardápio).

## Fotos dos restaurantes

Salve uma foto de cada em `public/restaurants/` com estes nomes (sem foto, aparece um placeholder colorido):

`coco-bambu.jpg` · `clementina.jpg` · `barolo.jpg` · `santa-chiara.jpg` · `alameda-270.jpg`

Proporção 4:3, ~1200px de largura.

## Supabase

1. Crie um projeto (região São Paulo) em https://supabase.com/dashboard.
2. Rode `supabase/migrations/20261106000000_create_encontros.sql` no SQL Editor. A tabela só aceita **insert** pela chave pública, então ninguém lê as respostas pelo site.
3. Em **Project Settings → API**, copie a URL e a publishable key para o `.env.local`.
4. As respostas aparecem em **Table Editor → encontros**.

## Deploy (Vercel)

1. Suba a pasta para um repositório no GitHub.
2. Importe na Vercel (detecta Vite sozinho).
3. Em **Settings → Environment Variables**, adicione `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_WHATSAPP_NUMBER`.
