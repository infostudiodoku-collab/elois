-- =====================================================
-- Elois Atelier — Supabase Schema
-- Bu dosyayı Supabase Dashboard'da SQL Editor'e yapıştırıp
-- "Run" butonuna basın. Bir kez çalıştırmak yeterli.
-- =====================================================

-- 1) Site içeriği — tek satırlık tablo
-- Tüm site içeriği tek bir JSON satırında saklanır.
create table if not exists public.site_content (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_content_single_row check (id = 1)
);

-- 2) İletişim formundan gelen mesajlar
create table if not exists public.messages (
  id text primary key,
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- En yeni mesajları hızlı çekmek için index
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- 3) Row Level Security (RLS) — defansif güvenlik
-- service_role key RLS'i bypass eder, ama yine de açık kalsın.
-- Anon/public key ile bu tablolara erişilemez.
alter table public.site_content enable row level security;
alter table public.messages enable row level security;

-- Policy yok = anon erişim yok. Sadece backend (service_role) erişebilir.

-- =====================================================
-- Storage için NOT (SQL ile değil, UI'dan yapılır):
--
-- Supabase Dashboard → Storage → "New bucket"
--   - Bucket adı: uploads
--   - Public bucket: AÇIK (toggle'ı aç)
-- 
-- Bu bucket görsellerin halka açık URL ile servis edilmesini sağlar.
-- =====================================================
