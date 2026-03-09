-- Enable pgcrypto (for gen_random_uuid)
create extension if not exists pgcrypto;

-- Complaints table
create table
  if not exists complaints (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    description text not null,
    category text not null,
    severity text not null default 'low',
    status text not null default 'open',
    submitted_by text,
    submitted_at timestamptz not null default now (),
    resolved_at timestamptz,
    resolution text,
    attachments jsonb,
    sentiment_score numeric not null default 0,
    sentiment_label text not null default 'Neutral',
    priority text not null default 'normal',
    support_count integer not null default 0
  );

-- Example insert
insert into
  complaints (
    title,
    description,
    category,
    severity,
    submitted_by
  )
values
  (
    'Water cooler not working near cafeteria',
    'The water cooler near the main cafeteria has been out of order for a week now.',
    'facilities',
    'low',
    'Anonymous'
  );