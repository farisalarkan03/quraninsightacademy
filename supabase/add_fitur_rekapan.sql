-- ============================================================
-- QIA — Fitur Rekapan Laporan (Bimbel Bulanan & Privat Paket)
-- File: supabase/add_fitur_rekapan.sql
-- 
-- Jalankan skrip ini di Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists public.rekapan_laporan (
  id                  serial primary key,
  id_peserta          int not null references public.peserta_didik(id) on delete cascade,
  id_mentor           uuid references public.profiles(id) on delete set null,
  jenis               text not null check (jenis in ('bimbel','privat')),
  judul_rekap         text not null,              -- e.g. 'Rekap Bulan Februari 2025' atau 'Paket 1 (8 Pertemuan)'
  periode_bulan       text,                       -- e.g. '2025-02' (khusus bimbel)
  nomor_paket         int,                        -- e.g. 1, 2, 3 (khusus privat)
  total_sesi          int not null default 0,     -- jumlah sesi yang terekap
  tanggal_mulai       date,
  tanggal_selesai     date,
  total_hadir         int not null default 0,
  total_izin          int not null default 0,
  total_sakit         int not null default 0,
  total_alpa          int not null default 0,
  rata_nilai          numeric(5,2),
  capaian_hafalan     text,
  catatan_evaluasi    text,                       -- evaluasi mentor
  rekomendasi         text,                       -- rekomendasi kelanjutan untuk orang tua
  sesi_ids            jsonb default '[]'::jsonb,  -- array id kehadiran yang masuk rekapan ini
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Indexing untuk query cepat
create index if not exists idx_rekapan_peserta on public.rekapan_laporan (id_peserta, created_at desc);

-- RLS (Row Level Security)
alter table public.rekapan_laporan enable row level security;

-- 1. Mentor & Admin bisa membaca rekapan
drop policy if exists "Mentor baca rekapan santri bimbingan" on public.rekapan_laporan;
create policy "Mentor baca rekapan santri bimbingan"
  on public.rekapan_laporan for select
  using (
    auth.uid() = id_mentor or
    exists (
      select 1 from public.peserta_didik pd
      where pd.id = id_peserta and pd.id_mentor = auth.uid()
    ) or
    exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.role = 'admin'
    )
  );

-- 2. Mentor & Admin bisa membuat rekapan
drop policy if exists "Mentor buat rekapan" on public.rekapan_laporan;
create policy "Mentor buat rekapan"
  on public.rekapan_laporan for insert
  with check (
    auth.uid() = id_mentor or
    exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.role in ('mentor', 'admin')
    )
  );

-- 3. Mentor & Admin bisa mengupdate rekapan
drop policy if exists "Mentor update rekapan" on public.rekapan_laporan;
create policy "Mentor update rekapan"
  on public.rekapan_laporan for update
  using (
    auth.uid() = id_mentor or
    exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.role in ('mentor', 'admin')
    )
  );

-- 4. Mentor & Admin bisa menghapus rekapan
drop policy if exists "Mentor delete rekapan" on public.rekapan_laporan;
create policy "Mentor delete rekapan"
  on public.rekapan_laporan for delete
  using (
    auth.uid() = id_mentor or
    exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.role in ('mentor', 'admin')
    )
  );

-- 5. Portal Wali (Anon) bisa membaca rekapan peserta aktif
drop policy if exists "Anon baca rekapan peserta aktif" on public.rekapan_laporan;
create policy "Anon baca rekapan peserta aktif"
  on public.rekapan_laporan for select
  using (
    exists (
      select 1 from public.peserta_didik pd
      where pd.id = id_peserta and pd.status = 'aktif'
    )
  );

-- Function helper untuk Portal Wali get_rekapan_wali
create or replace function public.get_rekapan_wali(p_peserta_id int)
returns jsonb
language plpgsql security definer as $$
begin
  return coalesce((
    select jsonb_agg(row_to_json(r.*) order by r.created_at desc)
    from public.rekapan_laporan r
    where r.id_peserta = p_peserta_id
  ), '[]'::jsonb);
end;
$$;

