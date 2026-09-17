-- ============================================================
-- QIA — SQL Fix: RLS Recursion, Ambiguous Column & Portal Wali
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

-- 1. FUNGSI CEK ADMIN TANPA REKURSI (SECURITY DEFINER)
-- Menghindari infinite recursion pada policy profiles
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

-- 2. RESET & PERBAIKI POLICY RLS PADA PROFILES
drop policy if exists "Admin akses penuh profiles" on public.profiles;
drop policy if exists "Mentor baca profil sendiri" on public.profiles;
drop policy if exists "Mentor update profil sendiri" on public.profiles;
drop policy if exists "Public baca mentor" on public.profiles;
drop policy if exists "User baca profil sendiri" on public.profiles;
drop policy if exists "User update profil sendiri" on public.profiles;

alter table public.profiles enable row level security;

-- Admin memiliki akses penuh (menggunakan fungsi is_admin yang aman)
create policy "Admin akses penuh profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- User (termasuk mentor & admin) dapat membaca profil dirinya sendiri
create policy "User baca profil sendiri"
  on public.profiles for select
  using (id = auth.uid());

-- User dapat mengupdate profil dirinya sendiri
create policy "User update profil sendiri"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Anon / Public dapat membaca profil mentor untuk keperluan display kelas & portal wali
create policy "Public baca mentor"
  on public.profiles for select
  using (role = 'mentor');

-- 3. PERBAIKI POLICY PADA TABEL KELAS
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

-- 4. PERBAIKI POLICY PADA TABEL PESERTA DIDIK
drop policy if exists "Admin akses penuh peserta" on public.peserta_didik;
drop policy if exists "Mentor baca peserta yang diampu" on public.peserta_didik;
drop policy if exists "Mentor update peserta yang diampu" on public.peserta_didik;

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

-- 5. PERBAIKI POLICY PADA TABEL KEHADIRAN
drop policy if exists "Admin akses penuh kehadiran" on public.kehadiran;
drop policy if exists "Mentor CRUD kehadiran peserta yang diampu" on public.kehadiran;

alter table public.kehadiran enable row level security;

create policy "Admin akses penuh kehadiran"
  on public.kehadiran for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD kehadiran peserta yang diampu"
  on public.kehadiran for all
  using (id_mentor = auth.uid());

-- 6. PERBAIKI POLICY PADA TABEL KEMAJUAN
drop policy if exists "Admin akses penuh kemajuan" on public.kemajuan;
drop policy if exists "Mentor CRUD kemajuan peserta yang diampu" on public.kemajuan;

alter table public.kemajuan enable row level security;

create policy "Admin akses penuh kemajuan"
  on public.kemajuan for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD kemajuan peserta yang diampu"
  on public.kemajuan for all
  using (id_mentor = auth.uid());

-- 7. PERBAIKI POLICY PADA TABEL PENILAIAN
drop policy if exists "Admin akses penuh penilaian" on public.penilaian;
drop policy if exists "Mentor CRUD penilaian peserta yang diampu" on public.penilaian;

alter table public.penilaian enable row level security;

create policy "Admin akses penuh penilaian"
  on public.penilaian for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD penilaian peserta yang diampu"
  on public.penilaian for all
  using (id_mentor = auth.uid());

-- 8. PERBAIKI POLICY PADA TABEL CATATAN MENTOR & PELAJARAN TAMBAHAN
drop policy if exists "Admin akses penuh catatan_mentor" on public.catatan_mentor;
drop policy if exists "Mentor CRUD catatan peserta yang diampu" on public.catatan_mentor;
drop policy if exists "Admin akses penuh pelajaran_tambahan" on public.pelajaran_tambahan;
drop policy if exists "Mentor CRUD pelajaran peserta yang diampu" on public.pelajaran_tambahan;

alter table public.catatan_mentor enable row level security;
alter table public.pelajaran_tambahan enable row level security;

create policy "Admin akses penuh catatan_mentor"
  on public.catatan_mentor for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD catatan peserta yang diampu"
  on public.catatan_mentor for all
  using (id_mentor = auth.uid());

create policy "Admin akses penuh pelajaran_tambahan"
  on public.pelajaran_tambahan for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD pelajaran peserta yang diampu"
  on public.pelajaran_tambahan for all
  using (id_mentor = auth.uid());

-- 9. PERBAIKI POLICY PADA TABEL ACTIVITY LOGS
drop policy if exists "Admin baca semua activity_logs" on public.activity_logs;
drop policy if exists "Semua user insert activity_logs" on public.activity_logs;

alter table public.activity_logs enable row level security;

create policy "Admin baca semua activity_logs"
  on public.activity_logs for select
  using (public.is_admin());

create policy "Semua user insert activity_logs"
  on public.activity_logs for insert
  with check (id_user = auth.uid() or auth.uid() is not null);

-- 10. PERBAIKI FUNGSI SEARCH PESERTA WALI (HILANGKAN AMBIGUOUS COLUMN "id")
create or replace function public.search_peserta_wali_by_name(p_nama text)
returns table (
  id                    int,
  nama_lengkap          text,
  usia                  int,
  jenis_kelamin         text,
  jenis                 text,
  status                text,
  nama_mentor           text,
  nama_kelas            text,
  hari_jadwal           text,
  jam_jadwal            text,
  kitab_surat_terakhir  text,
  halaman_ayat_terakhir text,
  tgl_kemajuan_terakhir date,
  total_hadir           bigint,
  total_izin            bigint,
  total_sakit           bigint,
  total_alpa            bigint,
  rata_nilai            numeric,
  nilai_terakhir        numeric,
  tgl_nilai_terakhir    date
)
language plpgsql security definer as $$
begin
  return query
  select
    pd.id,
    pd.nama_lengkap,
    pd.usia,
    pd.jenis_kelamin,
    pd.jenis,
    pd.status,
    coalesce(pr.nama, 'Belum ditentukan') as nama_mentor,
    coalesce(k.nama_kelas, case when pd.jenis = 'privat' then 'Kelas Privat' else '-' end) as nama_kelas,
    k.hari_jadwal,
    k.jam_jadwal,
    km.kitab_surat  as kitab_surat_terakhir,
    km.halaman_ayat as halaman_ayat_terakhir,
    km.tanggal      as tgl_kemajuan_terakhir,
    coalesce(count(kh.id) filter (where kh.status_hadir = 'hadir'), 0) as total_hadir,
    coalesce(count(kh.id) filter (where kh.status_hadir = 'izin'), 0)  as total_izin,
    coalesce(count(kh.id) filter (where kh.status_hadir = 'sakit'), 0) as total_sakit,
    coalesce(count(kh.id) filter (where kh.status_hadir = 'alpa'), 0)  as total_alpa,
    round(avg(pn.nilai_angka), 1) as rata_nilai,
    pn_last.nilai_angka as nilai_terakhir,
    pn_last.tanggal     as tgl_nilai_terakhir
  from public.peserta_didik pd
  left join public.profiles pr on pr.id = pd.id_mentor
  left join public.kelas k     on k.id  = pd.id_kelas
  left join lateral (
    select km_sub.kitab_surat, km_sub.halaman_ayat, km_sub.tanggal
    from public.kemajuan km_sub
    where km_sub.id_peserta = pd.id
    order by km_sub.tanggal desc, km_sub.id desc
    limit 1
  ) km on true
  left join public.kehadiran kh on kh.id_peserta = pd.id
  left join public.penilaian pn on pn.id_peserta = pd.id
  left join lateral (
    select pn_sub.nilai_angka, pn_sub.tanggal
    from public.penilaian pn_sub
    where pn_sub.id_peserta = pd.id
    order by pn_sub.tanggal desc, pn_sub.id desc
    limit 1
  ) pn_last on true
  where (p_nama = '' or pd.nama_lengkap ilike '%' || p_nama || '%')
    and pd.status = 'aktif'
  group by
    pd.id, pd.nama_lengkap, pd.usia, pd.jenis_kelamin, pd.jenis, pd.status,
    pr.nama, k.nama_kelas, k.hari_jadwal, k.jam_jadwal,
    km.kitab_surat, km.halaman_ayat, km.tanggal,
    pn_last.nilai_angka, pn_last.tanggal
  order by pd.nama_lengkap;
end;
$$;

-- 11. RPC BARU: DATA CHART KHUSUS PORTAL WALI (SECURITY DEFINER)
create or replace function public.get_peserta_charts_wali(p_peserta_id int)
returns jsonb
language plpgsql security definer as $$
declare v_result jsonb;
begin
  select jsonb_build_object(
    'penilaian', coalesce((
      select jsonb_agg(
        jsonb_build_object('tanggal', pn.tanggal, 'nilai_angka', pn.nilai_angka)
        order by pn.tanggal asc
      )
      from (
        select tanggal, nilai_angka from public.penilaian
        where id_peserta = p_peserta_id
        order by tanggal desc limit 12
      ) pn
    ), '[]'::jsonb),
    'kehadiran', coalesce((
      select jsonb_agg(
        jsonb_build_object('tanggal', kh.tanggal, 'status_hadir', kh.status_hadir)
        order by kh.tanggal asc
      )
      from (
        select tanggal, status_hadir from public.kehadiran
        where id_peserta = p_peserta_id
        order by tanggal desc limit 60
      ) kh
    ), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

-- 12. PASTIKAN AKUN ADMIN TERDAFTAR DI PROFILES
insert into public.profiles (id, nama, email, role, status)
values ('46920393-3829-46dd-a966-da64212464f1', 'Administrator QIA', 'portalqia@gmail.com', 'admin', 'aktif')
on conflict (id) do update
set role = 'admin', status = 'aktif', nama = 'Administrator QIA';

-- 13. GRANT PERMISSION EXECUTE RPC UNTUK ANON & AUTHENTICATED
grant execute on function public.is_admin() to authenticated, anon;
grant execute on function public.search_peserta_wali_by_name(text) to anon, authenticated;
grant execute on function public.get_peserta_detail_wali(int) to anon, authenticated;
grant execute on function public.get_peserta_charts_wali(int) to anon, authenticated;
grant execute on function public.get_admin_dashboard_stats() to authenticated;
