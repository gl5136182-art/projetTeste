-- opção "me surpreenda": o JP escolhe o lugar
-- o banco foi criado com a lista antiga (santa-chiara, alameda-270) e já tem linhas com esses valores,
-- então eles continuam aceitos pra não quebrar o histórico
alter table public.encontros drop constraint encontros_restaurante_check;
alter table public.encontros add constraint encontros_restaurante_check
  check (restaurante in (
    'coco-bambu', 'clementina', 'barolo', 'magnit', 'antonina', 'bottega', 'surpresa',
    'santa-chiara', 'alameda-270'
  ));
