-- ============================================================
-- QIA — SQL Fix: Sinkronisasi Laporan (Mentor → Portal Wali)
-- 
-- MASALAH: Saat mentor mengedit/menghapus laporan di portal 
--          mentor, data lama (kemajuan & penilaian) masih 
--          muncul di portal wali karena tidak ikut terhapus.
--
-- SOLUSI:  
--   1. Trigger otomatis hapus kemajuan & penilaian terkait
--      ketika kehadiran dihapus
--   2. Policy anon read access agar portal wali bisa fallback
--      query langsung ke tabel (selain via RPC)
--   3. RPC get_peserta_detail_wali yang lebih robust
--
-- Jalankan skrip ini di Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. TRIGGER: Auto-Cascade Delete pada Kehadiran
--    Ketika row kehadiran dihapus, otomatis hapus kemajuan 
--    dan penilaian pada (id_peserta, tanggal) yang sama
-- ────────────────────────────────────────────────────────────
create or replace function public.cascade_delete_related_kehadiran()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Hapus kemajuan pada peserta+tanggal yang sama
  delete from public.kemajuan 
  where id_peserta = OLD.id_peserta 
    and tanggal = OLD.tanggal;
  
  -- Hapus penilaian pada peserta+tanggal yang sama
  delete from public.penilaian 
  where id_peserta = OLD.id_peserta 
    and tanggal = OLD.tanggal;
  
  return OLD;
end;
$$;

-- Drop trigger jika sudah ada, lalu buat ulang
drop trigger if exists trg_cascade_delete_kehadiran on public.kehadiran;
create trigger trg_cascade_delete_kehadiran
  before delete on public.kehadiran
  for each row
  execute procedure public.cascade_delete_related_kehadiran();

-- ────────────────────────────────────────────────────────────
-- 2. ANON READ ACCESS untuk Portal Wali
--    Portal wali diakses tanpa login (anon), jadi tabel-tabel
--    yang datanya ditampilkan harus bisa dibaca oleh anon.
--    RPC dengan SECURITY DEFINER sudah bypass RLS, tapi ini
--    juga menjamin fallback direct query bisa berfungsi.
-- ────────────────────────────────────────────────────────────

-- Kehadiran: anon bisa baca
drop policy if exists "Anon baca kehadiran peserta aktif" on public.kehadiran;
create policy "Anon baca kehadiran peserta aktif"
  on public.kehadiran for select
  using (
    exists (
      select 1 from public.peserta_didik pd 
      where pd.id = id_peserta and pd.status = 'aktif'
    )
  );

-- Kemajuan: anon bisa baca
drop policy if exists "Anon baca kemajuan peserta aktif" on public.kemajuan;
create policy "Anon baca kemajuan peserta aktif"
  on public.kemajuan for select
  using (
    exists (
      select 1 from public.peserta_didik pd 
      where pd.id = id_peserta and pd.status = 'aktif'
    )
  );

-- Penilaian: anon bisa baca
drop policy if exists "Anon baca penilaian peserta aktif" on public.penilaian;
create policy "Anon baca penilaian peserta aktif"
  on public.penilaian for select
  using (
    exists (
      select 1 from public.peserta_didik pd 
      where pd.id = id_peserta and pd.status = 'aktif'
    )
  );

-- Peserta Didik: pastikan anon bisa baca peserta aktif  
drop policy if exists "Public baca peserta aktif" on public.peserta_didik;
create policy "Public baca peserta aktif"
  on public.peserta_didik for select
  using (status = 'aktif');

-- ────────────────────────────────────────────────────────────
-- 3. RPC: get_peserta_detail_wali (Diperbaiki)
--    Mengembalikan data terbaru tanpa duplikasi. Menggunakan
--    DISTINCT ON untuk menghindari data ganda pada tanggal
--    yang sama.
-- ────────────────────────────────────────────────────────────
create or replace function public.get_peserta_detail_wali(p_peserta_id int)
returns jsonb
language plpgsql security definer as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'peserta', row_to_json(pd.*),
    'mentor',  row_to_json(pr.*),
    'kelas',   row_to_json(k.*),
    'kemajuan', coalesce((
      select jsonb_agg(row_to_json(km_sub.*) order by km_sub.tanggal desc)
      from (
        select distinct on (km.tanggal) km.*
        from public.kemajuan km 
        where km.id_peserta = p_peserta_id
        order by km.tanggal desc, km.id desc
        limit 30
      ) km_sub
    ), '[]'::jsonb),
    'penilaian', coalesce((
      select jsonb_agg(row_to_json(pn_sub.*) order by pn_sub.tanggal desc)
      from (
        select distinct on (pn.tanggal) pn.*
        from public.penilaian pn 
        where pn.id_peserta = p_peserta_id
        order by pn.tanggal desc, pn.id desc
        limit 30
      ) pn_sub
    ), '[]'::jsonb),
    'kehadiran_summary', coalesce((
      select jsonb_build_object(
        'hadir', count(*) filter (where status_hadir = 'hadir'),
        'izin',  count(*) filter (where status_hadir = 'izin'),
        'sakit', count(*) filter (where status_hadir = 'sakit'),
        'alpa',  count(*) filter (where status_hadir = 'alpa'),
        'total', count(*)
      )
      from public.kehadiran where id_peserta = p_peserta_id
    ), '{"hadir":0,"izin":0,"sakit":0,"alpa":0,"total":0}'::jsonb),
    'riwayat_kehadiran', coalesce((
      select jsonb_agg(row_to_json(kh.*) order by kh.tanggal desc)
      from (
        select distinct on (kh_inner.tanggal, kh_inner.id_kelas) kh_inner.*
        from public.kehadiran kh_inner 
        where kh_inner.id_peserta = p_peserta_id
        order by kh_inner.tanggal desc, kh_inner.id_kelas, kh_inner.id desc
        limit 30
      ) kh
    ), '[]'::jsonb),
    'catatan_mentor', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'tanggal', cm.tanggal,
          'isi_catatan', cm.isi_catatan
        ) order by cm.tanggal desc
      )
      from public.catatan_mentor cm where cm.id_peserta = p_peserta_id
      limit 10
    ), '[]'::jsonb)
  )
  into v_result
  from public.peserta_didik pd
  left join public.profiles pr on pr.id = pd.id_mentor
  left join public.kelas k      on k.id  = pd.id_kelas
  where pd.id = p_peserta_id and pd.status = 'aktif';
  return v_result;
end;
$$;

-- ────────────────────────────────────────────────────────────
-- 4. RPC: get_peserta_charts_wali (Diperbaiki)
--    Mengambil data terbaru untuk chart di portal wali
-- ────────────────────────────────────────────────────────────
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
        select distinct on (tanggal) tanggal, nilai_angka 
        from public.penilaian
        where id_peserta = p_peserta_id
        order by tanggal desc, id desc 
        limit 12
      ) pn
    ), '[]'::jsonb),
    'kehadiran', coalesce((
      select jsonb_agg(
        jsonb_build_object('tanggal', kh.tanggal, 'status_hadir', kh.status_hadir)
        order by kh.tanggal asc
      )
      from (
        select distinct on (tanggal, coalesce(id_kelas, -1)) tanggal, status_hadir 
        from public.kehadiran
        where id_peserta = p_peserta_id
        order by tanggal desc, coalesce(id_kelas, -1), id desc
        limit 60
      ) kh
    ), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;

-- ────────────────────────────────────────────────────────────
-- 5. GRANT PERMISSIONS
-- ────────────────────────────────────────────────────────────
grant execute on function public.cascade_delete_related_kehadiran() to authenticated;
grant execute on function public.get_peserta_detail_wali(int) to anon, authenticated;
grant execute on function public.get_peserta_charts_wali(int) to anon, authenticated;
grant execute on function public.search_peserta_wali_by_name(text) to anon, authenticated;

-- Grant SELECT pada tabel-tabel yang dibutuhkan portal wali (anon)
grant select on public.peserta_didik to anon;
grant select on public.kehadiran to anon;
grant select on public.kemajuan to anon;
grant select on public.penilaian to anon;
grant select on public.profiles to anon;
grant select on public.kelas to anon;

-- ────────────────────────────────────────────────────────────
-- 6. PEMBERSIHAN DATA DUPLIKAT & UNIQUE INDEX
--    Menghapus rekaman kemajuan & penilaian yang tidak sengaja
--    terpencet >1 kali (hanya mempertahankan ID terbaru/terakhir).
-- ────────────────────────────────────────────────────────────
delete from public.kemajuan a
using public.kemajuan b
where a.id_peserta = b.id_peserta
  and a.tanggal = b.tanggal
  and a.id < b.id;

delete from public.penilaian a
using public.penilaian b
where a.id_peserta = b.id_peserta
  and a.tanggal = b.tanggal
  and a.id < b.id;

-- Cegah duplikasi di masa depan dengan unique index
create unique index if not exists uq_kemajuan_peserta_tanggal
  on public.kemajuan (id_peserta, tanggal);

create unique index if not exists uq_penilaian_peserta_tanggal
  on public.penilaian (id_peserta, tanggal);

-- ────────────────────────────────────────────────────────────
-- SELESAI!
-- Setelah menjalankan skrip ini:
-- ✅ Hapus laporan di mentor → kemajuan & penilaian ikut terhapus
-- ✅ Edit tanggal laporan → data lama terhapus, data baru tersimpan
-- ✅ Data duplikat kemajuan & penilaian yang tidak sengaja terpencet >1x dibersihkan
-- ✅ Unique index mencegah entri ganda di masa depan
-- ✅ Print PDF & Portal wali menampilkan 1 data fix per tanggal sesi
-- ────────────────────────────────────────────────────────────
