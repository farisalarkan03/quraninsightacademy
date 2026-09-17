-- ============================================================
-- QIA (Quran Insight Academy) — Supabase PostgreSQL Schema
-- Cloudflare Pages + Supabase Architecture
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES (Admin & Mentor, synced with auth.users)
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nama        text not null,
  email       text not null unique,
  role        text not null check (role in ('admin','mentor')) default 'mentor',
  jenis_mentor text check (jenis_mentor in ('bimbel','privat','keduanya')),
  no_hp       text,
  foto_url    text,
  status      text not null default 'aktif' check (status in ('aktif','nonaktif')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 2. KELAS (Khusus Bimbel)
-- ────────────────────────────────────────────────────────────
create table if not exists public.kelas (
  id          serial primary key,
  nama_kelas  text not null,
  deskripsi   text,
  id_mentor   uuid references public.profiles(id) on delete set null,
  hari_jadwal text,  -- e.g. 'Senin, Rabu, Jumat'
  jam_jadwal  text,  -- e.g. '16:00 - 17:30'
  kapasitas   int default 20,
  status      text not null default 'aktif' check (status in ('aktif','nonaktif')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 3. PESERTA DIDIK
-- ────────────────────────────────────────────────────────────
create table if not exists public.peserta_didik (
  id              serial primary key,
  nama_lengkap    text not null,
  usia            int,
  jenis_kelamin   text check (jenis_kelamin in ('L','P')),
  jenis           text not null check (jenis in ('bimbel','privat')),
  id_mentor       uuid references public.profiles(id) on delete set null,
  id_kelas        int  references public.kelas(id) on delete set null,
  nama_wali       text,
  email_wali      text,
  no_wa_wali      text,
  alamat          text,
  tanggal_daftar  date default current_date,
  status          text not null default 'aktif' check (status in ('aktif','nonaktif','lulus')),
  catatan_umum    text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 4. KEHADIRAN (Absensi — Support Bulk Bimbel & Privat)
-- ────────────────────────────────────────────────────────────
create table if not exists public.kehadiran (
  id                  serial primary key,
  id_peserta          int  not null references public.peserta_didik(id) on delete cascade,
  id_mentor           uuid references public.profiles(id) on delete set null,
  id_kelas            int  references public.kelas(id) on delete set null,
  tanggal             date not null default current_date,
  status_hadir        text not null default 'hadir' check (status_hadir in ('hadir','izin','sakit','alpa')),
  materi_pembahasan   text,   -- Materi yang diajarkan pada sesi ini
  catatan_sesi        text,   -- Evaluasi keseluruhan sesi / catatan individual
  perkembangan_materi text,   -- Perkembangan materi peserta (detail)
  created_at          timestamptz default now()
);

create unique index if not exists kehadiran_peserta_tanggal_kelas
  on public.kehadiran (id_peserta, tanggal, coalesce(id_kelas, -1));

-- ────────────────────────────────────────────────────────────
-- 5. KEMAJUAN HAFALAN / TAHSIN
-- ────────────────────────────────────────────────────────────
create table if not exists public.kemajuan (
  id                  serial primary key,
  id_peserta          int  not null references public.peserta_didik(id) on delete cascade,
  id_mentor           uuid references public.profiles(id) on delete set null,
  tanggal             date not null default current_date,
  kitab_surat         text not null,  -- e.g. 'Al-Fatihah', 'Jilid 3', 'Al-Baqarah'
  halaman_ayat        text,           -- e.g. 'Ayat 1-5', 'Halaman 12', 'Bab 3'
  status_kelancaran   text check (status_kelancaran in ('lancar','cukup','perlu_ulang')),
  catatan_hafalan     text,
  created_at          timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 6. PENILAIAN
-- ────────────────────────────────────────────────────────────
create table if not exists public.penilaian (
  id              serial primary key,
  id_peserta      int  not null references public.peserta_didik(id) on delete cascade,
  id_mentor       uuid references public.profiles(id) on delete set null,
  tanggal         date not null default current_date,
  nilai_angka     numeric(5,2) check (nilai_angka between 0 and 100),
  nilai_adab      int check (nilai_adab between 1 and 5),
  nilai_tajwid    int check (nilai_tajwid between 1 and 5),
  nilai_kelancaran int check (nilai_kelancaran between 1 and 5),
  catatan         text,
  created_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 7. PELAJARAN TAMBAHAN
-- ────────────────────────────────────────────────────────────
create table if not exists public.pelajaran_tambahan (
  id              serial primary key,
  id_peserta      int  not null references public.peserta_didik(id) on delete cascade,
  id_mentor       uuid references public.profiles(id) on delete set null,
  nama_pelajaran  text not null,
  deskripsi       text,
  tanggal         date default current_date,
  created_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 8. CATATAN MENTOR
-- ────────────────────────────────────────────────────────────
create table if not exists public.catatan_mentor (
  id          serial primary key,
  id_peserta  int  not null references public.peserta_didik(id) on delete cascade,
  id_mentor   uuid references public.profiles(id) on delete set null,
  tanggal     date default current_date,
  isi_catatan text not null,
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 9. ACTIVITY LOGS (Audit Trail Admin)
-- ────────────────────────────────────────────────────────────
create table if not exists public.activity_logs (
  id          serial primary key,
  id_user     uuid references public.profiles(id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   text,
  detail      jsonb,
  created_at  timestamptz default now()
);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Auto-sync auth.users → profiles saat user mendaftar
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, nama, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'mentor')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at   before update on public.profiles   for each row execute procedure public.set_updated_at();
create trigger kelas_updated_at      before update on public.kelas       for each row execute procedure public.set_updated_at();
create trigger peserta_updated_at    before update on public.peserta_didik for each row execute procedure public.set_updated_at();

-- ============================================================
-- RPC FUNCTIONS
-- ============================================================

-- Portal Wali: Cari peserta berdasarkan nama (fuzzy, tanpa kode akses)
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

-- Portal Wali: Detail lengkap satu peserta (untuk halaman detail)
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
    'kemajuan', (
      select jsonb_agg(row_to_json(km.*) order by km.tanggal desc)
      from public.kemajuan km where km.id_peserta = p_peserta_id
      limit 30
    ),
    'penilaian', (
      select jsonb_agg(row_to_json(pn.*) order by pn.tanggal desc)
      from public.penilaian pn where pn.id_peserta = p_peserta_id
      limit 30
    ),
    'kehadiran_summary', (
      select jsonb_build_object(
        'hadir', count(*) filter (where status_hadir = 'hadir'),
        'izin',  count(*) filter (where status_hadir = 'izin'),
        'sakit', count(*) filter (where status_hadir = 'sakit'),
        'alpa',  count(*) filter (where status_hadir = 'alpa'),
        'total', count(*)
      )
      from public.kehadiran where id_peserta = p_peserta_id
    ),
    'riwayat_kehadiran', (
      select jsonb_agg(row_to_json(kh.*) order by kh.tanggal desc)
      from public.kehadiran kh where kh.id_peserta = p_peserta_id
      limit 30
    ),
    'catatan_mentor', (
      select jsonb_agg(
        jsonb_build_object(
          'tanggal', cm.tanggal,
          'isi_catatan', cm.isi_catatan
        ) order by cm.tanggal desc
      )
      from public.catatan_mentor cm where cm.id_peserta = p_peserta_id
      limit 10
    )
  )
  into v_result
  from public.peserta_didik pd
  left join public.profiles pr on pr.id = pd.id_mentor
  left join public.kelas k      on k.id  = pd.id_kelas
  where pd.id = p_peserta_id and pd.status = 'aktif';
  return v_result;
end;
$$;

-- Portal Wali: Data chart penilaian dan kehadiran
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

-- Admin: Dashboard Stats
create or replace function public.get_admin_dashboard_stats()
returns jsonb
language plpgsql security definer as $$
declare v_result jsonb;
begin
  select jsonb_build_object(
    'total_peserta',       (select count(*) from public.peserta_didik where status='aktif'),
    'total_bimbel',        (select count(*) from public.peserta_didik where jenis='bimbel' and status='aktif'),
    'total_privat',        (select count(*) from public.peserta_didik where jenis='privat' and status='aktif'),
    'total_mentor',        (select count(*) from public.profiles where role='mentor' and status='aktif'),
    'total_kelas',         (select count(*) from public.kelas where status='aktif'),
    'absensi_hari_ini',    (select count(*) from public.kehadiran where tanggal=current_date),
    'hadir_hari_ini',      (select count(*) from public.kehadiran where tanggal=current_date and status_hadir='hadir'),
    'rata_nilai_bulan_ini',(select round(avg(nilai_angka),1) from public.penilaian
                            where date_trunc('month', tanggal) = date_trunc('month', current_date)),
    'aktivitas_terbaru', (
      select jsonb_agg(row_to_json(al.*) order by al.created_at desc)
      from public.activity_logs al limit 10
    )
  ) into v_result;
  return v_result;
end;
$$;

-- Absensi Massal: Bulk insert/upsert kehadiran per kelas
create or replace function public.bulk_upsert_kehadiran(p_records jsonb)
returns jsonb
language plpgsql security definer as $$
declare
  v_record jsonb;
  v_count  int := 0;
begin
  for v_record in select * from jsonb_array_elements(p_records)
  loop
    insert into public.kehadiran (
      id_peserta, id_mentor, id_kelas, tanggal,
      status_hadir, materi_pembahasan, catatan_sesi, perkembangan_materi
    )
    values (
      (v_record->>'id_peserta')::int,
      (v_record->>'id_mentor')::uuid,
      (v_record->>'id_kelas')::int,
      (v_record->>'tanggal')::date,
      coalesce(v_record->>'status_hadir', 'hadir'),
      v_record->>'materi_pembahasan',
      v_record->>'catatan_sesi',
      v_record->>'perkembangan_materi'
    )
    on conflict (id_peserta, tanggal, coalesce(id_kelas, -1))
    do update set
      status_hadir        = excluded.status_hadir,
      materi_pembahasan   = coalesce(excluded.materi_pembahasan, kehadiran.materi_pembahasan),
      catatan_sesi        = coalesce(excluded.catatan_sesi, kehadiran.catatan_sesi),
      perkembangan_materi = coalesce(excluded.perkembangan_materi, kehadiran.perkembangan_materi);
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('success', true, 'count', v_count);
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Helper: Cek role admin tanpa perulangan tak terbatas (security definer)
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

alter table public.profiles         enable row level security;
alter table public.kelas             enable row level security;
alter table public.peserta_didik     enable row level security;
alter table public.kehadiran         enable row level security;
alter table public.kemajuan          enable row level security;
alter table public.penilaian         enable row level security;
alter table public.pelajaran_tambahan enable row level security;
alter table public.catatan_mentor    enable row level security;
alter table public.activity_logs     enable row level security;

-- PROFILES
create policy "Admin akses penuh profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "User baca profil sendiri"
  on public.profiles for select
  using (id = auth.uid());

create policy "User update profil sendiri"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Public baca mentor"
  on public.profiles for select
  using (role = 'mentor');

-- KELAS
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

-- PESERTA DIDIK
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

-- KEHADIRAN
create policy "Admin akses penuh kehadiran"
  on public.kehadiran for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD kehadiran peserta yang diampu"
  on public.kehadiran for all
  using (id_mentor = auth.uid());

-- KEMAJUAN
create policy "Admin akses penuh kemajuan"
  on public.kemajuan for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD kemajuan peserta yang diampu"
  on public.kemajuan for all
  using (id_mentor = auth.uid());

-- PENILAIAN
create policy "Admin akses penuh penilaian"
  on public.penilaian for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD penilaian peserta yang diampu"
  on public.penilaian for all
  using (id_mentor = auth.uid());

-- PELAJARAN TAMBAHAN
create policy "Admin akses penuh pelajaran_tambahan"
  on public.pelajaran_tambahan for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD pelajaran peserta yang diampu"
  on public.pelajaran_tambahan for all
  using (id_mentor = auth.uid());

-- CATATAN MENTOR
create policy "Admin akses penuh catatan_mentor"
  on public.catatan_mentor for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Mentor CRUD catatan peserta yang diampu"
  on public.catatan_mentor for all
  using (id_mentor = auth.uid());

-- ACTIVITY LOGS
create policy "Admin baca semua activity_logs"
  on public.activity_logs for select
  using (public.is_admin());

create policy "Semua user insert activity_logs"
  on public.activity_logs for insert
  with check (id_user = auth.uid() or auth.uid() is not null);

-- ============================================================
-- INDEXES (Performance)
-- ============================================================
create index if not exists idx_peserta_mentor    on public.peserta_didik(id_mentor);
create index if not exists idx_peserta_kelas     on public.peserta_didik(id_kelas);
create index if not exists idx_peserta_jenis     on public.peserta_didik(jenis);
create index if not exists idx_peserta_nama      on public.peserta_didik(nama_lengkap);
create index if not exists idx_kehadiran_peserta on public.kehadiran(id_peserta);
create index if not exists idx_kehadiran_tanggal on public.kehadiran(tanggal);
create index if not exists idx_kehadiran_kelas   on public.kehadiran(id_kelas);
create index if not exists idx_kemajuan_peserta  on public.kemajuan(id_peserta);
create index if not exists idx_penilaian_peserta on public.penilaian(id_peserta);
create index if not exists idx_kelas_mentor      on public.kelas(id_mentor);
