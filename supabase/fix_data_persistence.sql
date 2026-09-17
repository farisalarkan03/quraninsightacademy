-- ============================================================
-- QIA — SQL Fix: Data Persistence & Profile Upsert
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

-- 1. PASTIKAN FUNGSI IS_ADMIN ADA (idempotent)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 2. PERBAIKI POLICY PROFILES: Izinkan admin INSERT (untuk upsert mentor baru)
-- Hapus semua policy profiles yang lama
drop policy if exists "Admin akses penuh profiles" on public.profiles;
drop policy if exists "User baca profil sendiri" on public.profiles;
drop policy if exists "User update profil sendiri" on public.profiles;
drop policy if exists "Public baca mentor" on public.profiles;
drop policy if exists "Mentor baca profil sendiri" on public.profiles;
drop policy if exists "Mentor update profil sendiri" on public.profiles;
drop policy if exists "User insert profil sendiri" on public.profiles;

alter table public.profiles enable row level security;

-- Admin memiliki akses penuh (select, insert, update, delete)
create policy "Admin akses penuh profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- User dapat membaca profil dirinya sendiri
create policy "User baca profil sendiri"
  on public.profiles for select
  using (id = auth.uid());

-- User dapat mengupdate profil dirinya sendiri
create policy "User update profil sendiri"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- User baru dapat INSERT profil dirinya sendiri (diperlukan untuk signUp mentor)
create policy "User insert profil sendiri"
  on public.profiles for insert
  with check (id = auth.uid());

-- Public dapat membaca profil mentor untuk display kelas & portal wali
create policy "Public baca mentor"
  on public.profiles for select
  using (role = 'mentor');

-- 3. PERBAIKI POLICY PESERTA DIDIK
drop policy if exists "Admin akses penuh peserta" on public.peserta_didik;
drop policy if exists "Mentor baca peserta yang diampu" on public.peserta_didik;
drop policy if exists "Mentor update peserta yang diampu" on public.peserta_didik;
drop policy if exists "Public baca peserta aktif" on public.peserta_didik;

alter table public.peserta_didik enable row level security;

create policy "Admin akses penuh peserta"
  on public.peserta_didik for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor baca peserta yang diampu"
  on public.peserta_didik for select
  using (id_mentor = auth.uid());

create policy "Mentor update peserta yang diampu"
  on public.peserta_didik for update
  using (id_mentor = auth.uid());

-- Portal wali: siapa pun bisa baca peserta (untuk search portal)
create policy "Public baca peserta aktif"
  on public.peserta_didik for select
  using (status = 'aktif');

-- 4. PERBAIKI POLICY KELAS
drop policy if exists "Admin akses penuh kelas" on public.kelas;
drop policy if exists "Mentor baca kelas yang diampu" on public.kelas;
drop policy if exists "Public baca kelas aktif" on public.kelas;

alter table public.kelas enable row level security;

create policy "Admin akses penuh kelas"
  on public.kelas for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor baca kelas yang diampu"
  on public.kelas for select
  using (id_mentor = auth.uid());

create policy "Public baca kelas aktif"
  on public.kelas for select
  using (status = 'aktif');

-- 5. PERBAIKI POLICY KEHADIRAN
drop policy if exists "Admin akses penuh kehadiran" on public.kehadiran;
drop policy if exists "Mentor CRUD kehadiran peserta yang diampu" on public.kehadiran;

alter table public.kehadiran enable row level security;

create policy "Admin akses penuh kehadiran"
  on public.kehadiran for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD kehadiran peserta yang diampu"
  on public.kehadiran for all
  using (id_mentor = auth.uid())
  with check (id_mentor = auth.uid());

-- 6. PERBAIKI POLICY KEMAJUAN
drop policy if exists "Admin akses penuh kemajuan" on public.kemajuan;
drop policy if exists "Mentor CRUD kemajuan peserta yang diampu" on public.kemajuan;

alter table public.kemajuan enable row level security;

create policy "Admin akses penuh kemajuan"
  on public.kemajuan for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD kemajuan peserta yang diampu"
  on public.kemajuan for all
  using (id_mentor = auth.uid())
  with check (id_mentor = auth.uid());

-- 7. PERBAIKI POLICY PENILAIAN
drop policy if exists "Admin akses penuh penilaian" on public.penilaian;
drop policy if exists "Mentor CRUD penilaian peserta yang diampu" on public.penilaian;

alter table public.penilaian enable row level security;

create policy "Admin akses penuh penilaian"
  on public.penilaian for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD penilaian peserta yang diampu"
  on public.penilaian for all
  using (id_mentor = auth.uid())
  with check (id_mentor = auth.uid());

-- 8. KONFIRMASI AKUN ADMIN
insert into public.profiles (id, nama, email, role, status)
values ('46920393-3829-46dd-a966-da64212464f1', 'Administrator QIA', 'portalqia@gmail.com', 'admin', 'aktif')
on conflict (id) do update
set role = 'admin', status = 'aktif', nama = 'Administrator QIA';

-- 9. GRANT PERMISSIONS
grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.search_peserta_wali_by_name(text) to anon, authenticated;
grant execute on function public.get_peserta_charts_wali(int) to anon, authenticated;
grant execute on function public.get_admin_dashboard_stats() to authenticated;

-- Jika ada RPC get_peserta_detail_wali
do $$
begin
  if exists (select 1 from pg_proc where proname = 'get_peserta_detail_wali') then
    execute 'grant execute on function public.get_peserta_detail_wali(int) to anon, authenticated';
  end if;
end $$;

-- 10. PASTIKAN SEQUENCE DAN TABLE GRANTS
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
