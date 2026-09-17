# Panduan Lengkap Setup & Deployment: Supabase + Cloudflare Pages
**Quran Insight Academy (QIA) Web Platform**

Dokumen ini berisi panduan langkah demi langkah untuk melakukan setup database **Supabase** dan deployment frontend ke **Cloudflare Pages**.

---

## 📋 Daftar Isi
1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Langkah 1: Setup Database Supabase](#2-langkah-1-setup-database-supabase)
3. [Langkah 2: Konfigurasi Kredensial Supabase di Frontend](#3-langkah-2-konfigurasi-kredensial-supabase-di-frontend)
4. [Langkah 3: Pengujian Lokal (Development)](#4-langkah-3-pengujian-lokal-development)
5. [Langkah 4: Deploy ke Cloudflare Pages](#5-langkah-4-deploy-ke-cloudflare-pages)
6. [Panduan Penggunaan Fitur Utama](#6-panduan-penggunaan-fitur-utama)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Arsitektur Sistem

Platform QIA dibangun dengan arsitektur modern tanpa server (serverless):
- **Frontend / Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/) (CDN global ultra cepat, gratis SSL, auto build dari Git).
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL terkelola, Otentikasi bawaan, Row-Level Security / RLS, Rest API otomatis).
- **Fitur Khusus**:
  - **Portal Wali**: Mencari santri **hanya dengan mengetik nama** santri (tanpa kode akses yang rumit).
  - **Portal Mentor**: Khusus mentor Bimbel memiliki menu **Kelas** dan **Absensi Massal** per kelas dilengkapi isian **Perkembangan Materi** dan catatan santri.
  - **Portal Admin**: Dilengkapi menu **Kelas**, manajemen santri & mentor, serta **Spreadsheet Editor Massal** untuk edit langsung database seperti Excel serta fitur **Export Multi-Sheet Excel & CSV**.

---

## 2. Langkah 1: Setup Database Supabase

### 2.1 Buat Proyek Supabase
1. Kunjungi [supabase.com](https://supabase.com/) lalu login atau buat akun baru.
2. Klik tombol **"New Project"**.
3. Isi informasi proyek:
   - **Name**: `qia-academy` (atau nama lain yang diinginkan)
   - **Database Password**: Buat password yang kuat dan catat dengan aman.
   - **Region**: Pilih yang terdekat (misal: *Singapore / Southeast Asia - sin1*).
   - **Pricing Plan**: Free tier (sudah sangat mencukupi).
4. Klik **"Create new project"** dan tunggu 1-2 menit hingga provisioning selesai.

### 2.2 Eksekusi Skrip Schema SQL
1. Di dashboard Supabase, buka menu **SQL Editor** (ikon terminal di sidebar kiri).
2. Klik **"New query"**.
3. Buka file `supabase/schema.sql` di proyek Anda, salin seluruh kodenya, dan paste ke SQL Editor.
4. Klik tombol **"Run"** (atau tekan `Cmd + Enter` / `Ctrl + Enter`).
5. Pastikan muncul pesan **"Success. No rows returned"**.

> **Apa yang dibuat oleh `schema.sql`?**
> - Tabel: `profiles`, `kelas`, `peserta_didik`, `kehadiran`, `kemajuan`, `penilaian`, `laporan_pdf`, `activity_logs`.
> - Row Level Security (RLS) policies untuk keamanan data.
> - Relasi Foreign Key & Cascading.
> - Stored Procedure / Helper Views (seperti `cari_santri_publik` untuk pencarian nama santri aman tanpa perlu akses kode rahasia).

### 2.3 Eksekusi Skrip Seed Data (Data Awal / Demo)
1. Di SQL Editor Supabase, klik **"New query"** kembali.
2. Buka file `supabase/seed.sql`, salin seluruh kodenya, dan paste ke editor.
3. Klik tombol **"Run"**.
4. Data master kelas, mentor contoh, dan santri contoh kini telah terisi.

### 2.4 Buat Akun Admin Pertama di Supabase Auth
1. Masuk ke menu **Authentication** -> **Users** di sidebar Supabase.
2. Klik **"Add user"** -> **"Create user"**.
3. Masukkan:
   - **Email**: contoh `admin@qia.com`
   - **Password**: contoh `AdminQIA2025!`
   - Centang **"Auto Confirm User?"** agar email tidak perlu diverifikasi manual.
4. Klik **"Create user"**.
5. Salin **User UID** dari user yang baru dibuat.
6. Masuk kembali ke **SQL Editor** dan jalankan perintah berikut (ganti UID dan email sesuai milik Anda):

```sql
INSERT INTO profiles (id, email, nama_lengkap, role, jenis_mentor, is_active)
VALUES ('PASTE_USER_UID_DISINI', 'admin@qia.com', 'Administrator Utama', 'admin', 'keduanya', true)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', is_active = true;
```

---

## 3. Langkah 2: Konfigurasi Kredensial Supabase di Frontend

1. Di dashboard Supabase, buka menu **Project Settings** (ikon gear di pojok kiri bawah) -> **API**.
2. Salin:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (contoh: `eyJhbGciOi...`)
3. Buka file `src/lib/supabase.js` di proyek lokal Anda.
4. Perbarui baris konfigurasi di bagian atas:

```javascript
export const SUPABASE_CONFIG = {
  url: 'https://xyzcompany.supabase.co',        // Masukkan URL Supabase Anda
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Masukkan Anon Key Anda
}
```

*(Atau Anda juga dapat menggunakan environment variable Vite jika menyukai `.env`: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`)*.

---

## 4. Langkah 3: Pengujian Lokal (Development)

Pastikan Node.js (versi 18+) sudah terpasang di komputer Anda.

1. Buka terminal di folder proyek:
   ```bash
   cd "/Users/farisalarkan/Documents/ALL PROJECT/QURAN INSIGHT ACADEMY/WEBSITE QIA"
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```
4. Buka browser pada alamat yang tertera (biasanya `http://localhost:3000`).
5. Uji fitur-fitur berikut:
   - **Landing Page**: Navigasi ke `/`
   - **Portal Wali**: Buka `/wali` -> Cari nama salah satu santri contoh (misal: "Ahmad" atau "Fatimah") tanpa kode akses.
   - **Portal Admin**: Buka `/admin` -> Login dengan akun admin yang dibuat di Langkah 2.4.
   - **Portal Mentor**: Buka `/mentor` -> Login dengan akun mentor.

---

## 5. Langkah 4: Deploy ke Cloudflare Pages

Terdapat 2 opsi mudah untuk mendeply ke Cloudflare Pages:

### Opsi A: Menggunakan Git (GitHub / GitLab) — Direkomendasikan (Auto-Deploy)
1. Push repositori proyek Anda ke GitHub.
2. Login ke dashboard [Cloudflare](https://dash.cloudflare.com/).
3. Di sidebar kiri, klik **Workers & Pages** -> **Create application** -> Pilih tab **Pages** -> **Connect to Git**.
4. Pilih repositori GitHub Anda.
5. Konfigurasi build setting:
   - **Project name**: `quran-insight-academy` (atau sesuaikan)
   - **Production branch**: `main` (atau `master`)
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Klik **"Save and Deploy"**.
7. Cloudflare Pages akan membuild proyek dalam waktu < 1 menit dan memberikan domain publik gratis (misal: `https://quran-insight-academy.pages.dev`).

### Opsi B: Deploy Langsung via Wrangler CLI
Jika Anda tidak menggunakan GitHub:
1. Pastikan build bundle sudah dibuat:
   ```bash
   npm run build
   ```
2. Jalankan deployment dengan wrangler:
   ```bash
   npx wrangler pages deploy dist --project-name=qia-website
   ```
3. Ikuti prompt login Cloudflare sekali saja di browser Anda.

---

## 6. Panduan Penggunaan Fitur Utama

### 🌟 1. Portal Wali Santri (Buka `/wali`)
- Wali santri tidak perlu repot mengingat PIN atau kode akses acak.
- Cukup mengetikkan nama santri di kotak pencarian.
- Hasil menampilkan profil santri, kelas/program, riwayat kehadiran, rekap perkembangan materi terakhir, grafik nilai evaluasi, dan tombol cetak/unduh ringkasan.

### 🌟 2. Portal Mentor / Asatidz (Buka `/mentor`)
- **Dashboard**: Menampilkan jadwal dan statistik kelas/santri binaan.
- **Kelas Saya (Khusus Bimbel)**: Menampilkan daftar kelas kelompok yang diampu mentor beserta daftar santri di dalamnya.
- **Absensi Massal (Khusus Bimbel)**:
  1. Pilih kelas yang sedang berlangsung.
  2. Klik tombol **"Semua Hadir"** untuk kecepatan atau ubah status santri tertentu (Sakit/Izin/Alpa).
  3. Masukkan materi pertemuan hari ini (misal: *Surat Al-Baqarah ayat 1-15*).
  4. Tambahkan catatan santri jika ada santri yang membutuhkan perhatian khusus.
  5. Klik **"Simpan Absensi & Materi"** — data kehadiran dan kemajuan otomatis tercatat bersamaan!
- **Daftar Santri & Penilaian**: Untuk input nilai evaluasi berkala (Tajwid, Fashahah, Kelancaran, Adab).

### 🌟 3. Portal Admin (Buka `/admin`)
- **Manajemen Santri**: Tambah santri baru, tentukan program (Bimbel / Privat), dan masukkan ke kelas bimbel yang sesuai.
- **Manajemen Mentor**: Tambah mentor, atur peran (Bimbel / Privat / Keduanya).
- **Manajemen Kelas**: Tambah kelas baru, atur jadwal pertemuan (hari & jam) dan mentor pengampu.
- **Spreadsheet Editor Massal**:
  - Tampilan tabel interaktif layaknya Google Spreadsheet / Excel.
  - Tab data: `Peserta Didik`, `Mentor`, `Kelas`, `Kehadiran`, `Kemajuan`, `Penilaian`.
  - Klik sel mana saja untuk mengedit langsung.
  - Klik **"Tambah Baris"** untuk memasukkan data baru secara cepat.
  - Klik **"Simpan Perubahan"** untuk sinkronisasi massal langsung ke Supabase.
- **Unduh Data / Export**:
  - Tombol export format **CSV** dan **Excel (.xlsx)** di setiap tabel.
  - Tombol **"Download Semua Data (Multi-Sheet Excel)"** yang menggabungkan seluruh tabel database ke dalam satu file Excel dengan sheet terpisah.

---

## 7. Troubleshooting & FAQ

### T: Halaman 404 saat merefresh route seperti `/admin` di Cloudflare Pages?
**J:** Proyek ini sudah menyertakan file `public/_redirects` dengan isi:
```
/*    /index.html   200
```
Ini memastikan Cloudflare Pages melayani Single Page Application (SPA) dengan sempurna pada semua sub-rute.

### T: Apakah CORS perlu diatur di Supabase?
**J:** REST API Supabase secara default mengizinkan origin publik untuk anon key jika RLS telah aktif. Tidak ada konfigurasi CORS rumit yang diperlukan.

### T: Bagaimana cara menambahkan custom domain sendiri (contoh: `quraninsight.id`)?
**J:** Di dashboard Cloudflare Pages, buka tab **Custom domains** -> klik **Set up a custom domain** -> ketik domain Anda -> ikuti instruksi DNS otomatis dari Cloudflare.
