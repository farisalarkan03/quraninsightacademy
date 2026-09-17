# 📖 Quran Insight Academy (QIA)

Platform Web Modern untuk **Quran Insight Academy** — Bimbingan Al-Quran Terpercaya (Program Bimbel & Privat).

Arsitektur sistem dibangun dengan:
- **Frontend**: Single Page Application (SPA) berbasis Vanilla JS + CSS3 + Vite.
- **Hosting & CDN**: Cloudflare Pages.
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Auth).
- **Libraries**: Chart.js (Visualisasi Statistik), SheetJS / XLSX (Spreadsheet Export/Multi-Sheet).

---

## 🚀 Fitur Utama

1. **Landing Page Interaktif** (`/`):
   - Hero section modern dengan tipografi elegan bernuansa islami kontemporer.
   - Program Bimbel & Privat, keunggulan, testimoni, dan kalkulator infaq/biaya.
   - Form pendaftaran santri baru langsung terhubung ke database.

2. **Portal Wali Santri** (`/wali`):
   - **Pencarian instan hanya dengan mengetik nama santri** (tanpa perlu kode akses yang membingungkan).
   - Menampilkan informasi santri, rekap kehadiran, catatan materi/kemajuan hafalan, dan grafik nilai evaluasi.
   - Tombol cetak & unduh laporan ringkas.

3. **Portal Mentor / Asatidz** (`/mentor`):
   - Dashboard jadwal mengajar & statistik santri.
   - **Khusus Mentor Bimbel**:
     - Menu **Kelas Saya** untuk melihat daftar kelas kelompok yang diampu.
     - Menu **Absensi Massal**: Input presensi massal satu kelas sekaligus, tombol "Semua Hadir", serta pengisian **Perkembangan Materi** (surat/jilid) dan catatan santri pada sesi tersebut.
   - Daftar santri dan input nilai evaluasi berkala (Tajwid, Fashahah, Kelancaran, Adab).

4. **Portal Admin** (`/admin`):
   - Dashboard analitik & ringkasan operasional.
   - **Manajemen Kelas**: Tambah/edit kelas bimbel, atur mentor pengampu, dan jadwalkan pertemuan.
   - **Manajemen Santri**: Assign santri bimbel ke dalam kelas masing-masing.
   - **Spreadsheet Editor Massal**:
     - Editor tabel layaknya Excel di dalam browser.
     - Edit sel secara inline, tambah baris massal, dan simpan perubahan langsung ke Supabase.
   - **Ekspor Data**: Download CSV, Excel per tabel, dan **Multi-Sheet Excel Lengkap** dalam satu klik.

---

## 🛠️ Persyaratan Sistem

- **Node.js**: Versi 18 atau lebih baru.
- **Akun Supabase**: [supabase.com](https://supabase.com) (Gratis).
- **Akun Cloudflare**: [cloudflare.com](https://cloudflare.com) (Gratis).

---

## ⚡ Memulai Cepat (Development Lokal)

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Setup Database Supabase**:
   - Jalankan skrip `supabase/schema.sql` di SQL Editor Supabase.
   - Jalankan skrip `supabase/seed.sql` untuk data awal.
   - Salin URL & Anon Key dari Supabase ke `src/lib/supabase.js`.

3. **Jalankan local dev server**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy ke Cloudflare Pages

Ikuti panduan terperinci di [PANDUAN_SETUP_SUPABASE_CLOUDFLARE.md](PANDUAN_SETUP_SUPABASE_CLOUDFLARE.md).

Pengaturan build di Cloudflare Pages:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/`

---

## 📁 Struktur Direktori

```
├── public/
│   ├── _headers            # Security headers Cloudflare
│   └── _redirects          # SPA fallback routing Cloudflare
├── src/
│   ├── lib/
│   │   ├── supabase.js     # Supabase client & API services
│   │   └── export-utils.js # CSV & XLSX exporter
│   ├── pages/
│   │   ├── landing.js      # Halaman utama (Landing Page)
│   │   ├── portal-wali.js  # Portal Wali (Cari nama santri)
│   │   ├── mentor.js       # Portal Mentor (Kelas & Absensi Massal)
│   │   └── admin.js        # Portal Admin (Kelas & Spreadsheet Editor)
│   ├── styles/
│   │   ├── main.css        # Design System & Token Warna
│   │   └── spreadsheet.css # Gaya spreadsheet interaktif
│   └── main.js             # Client-side router & SPA bootstrap
├── supabase/
│   ├── schema.sql          # Tabel, RLS, Trigger, Helper Views
│   └── seed.sql            # Data awal/demo santri, mentor, kelas
├── index.html              # Entry HTML
├── package.json            # Dependensi & NPM scripts
├── vite.config.js          # Konfigurasi bundler Vite
└── wrangler.toml           # Konfigurasi Cloudflare Pages
```

---

## 📄 Lisensi
Hak Cipta © 2025 Quran Insight Academy.
