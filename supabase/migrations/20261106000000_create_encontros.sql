create table public.encontros (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  data date not null check (data in ('2026-11-20', '2026-11-21')),
  horario text not null check (horario in ('19h', '19h30', '20h', '20h30', '21h')),
  restaurante text not null check (restaurante in ('coco-bambu', 'clementina', 'barolo', 'magnit', 'antonina', 'bottega')),
  recado text check (char_length(recado) <= 500),
  fugas_do_nao int not null default 0 check (fugas_do_nao between 0 and 10000),
  user_agent text check (char_length(user_agent) <= 500)
);

alter table public.encontros enable row level security;

-- o site só consegue inserir; ninguém lê com a chave pública
create policy "convite pode inserir"
  on public.encontros for insert
  to anon
  with check (true);

revoke select, update, delete on public.encontros from anon, authenticated;
grant insert on public.encontros to anon;
