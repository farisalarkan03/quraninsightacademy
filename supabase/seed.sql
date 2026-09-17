-- ============================================================
-- QIA — Production Seed (Admin Only)
-- Jalankan SETELAH schema.sql
-- Data peserta didik, kelas, kehadiran, dll diisi melalui aplikasi
-- ============================================================

-- PENTING: Jalankan langkah berikut di Supabase Dashboard SEBELUM script ini:
-- 1. Buka Authentication → Users → Add User
--    Email   : portalqia@gmail.com
--    Password: adminqia222
--    ✓ Auto Confirm User (centang)
-- 2. Salin UUID user yang baru dibuat, ganti nilai v_admin_id di bawah ini.

do $$
declare
  -- GANTI dengan UUID dari Supabase Auth Dashboard setelah membuat user portalqia@gmail.com
  v_admin_id uuid := '00000000-0000-0000-0000-000000000000';
begin

-- ── PROFILE ADMIN ─────────────────────────────────────────
-- Hanya 1 admin. Data lain (mentor, peserta) diisi via aplikasi.
insert into public.profiles (id, nama, email, role, jenis_mentor, no_hp, status)
values (
  v_admin_id,
  'Administrator QIA',
  'portalqia@gmail.com',
  'admin',
  null,
  '',
  'aktif'
)
on conflict (id) do update set
  nama   = excluded.nama,
  email  = excluded.email,
  role   = excluded.role,
  status = excluded.status;

end $$;
