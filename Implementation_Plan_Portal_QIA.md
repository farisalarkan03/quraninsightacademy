# Implementation Plan — Portal Quran Insight Academy (QIA)

Berdasarkan arsitektur yang sudah ada (Blogger → Landing Page → Postingan/Halaman → `/p/admin`, `/p/mentor`, `/p/portalwali` → GAS → Spreadsheet Database), berikut struktur implementasi lengkap untuk ketiga halaman inti: **Admin**, **Mentor**, dan **Portal Wali**.

---

## 1. Catatan Arsitektur Penting

Karena Blogger tidak punya backend/session server sendiri, semua logic (auth, CRUD, search) harus lewat **Google Apps Script (GAS)** sebagai REST API, dengan Spreadsheet sebagai database. Konsekuensinya:

- Setiap halaman (`/p/admin`, `/p/mentor`, `/p/portalwali`) berisi HTML + JS (embed di halaman Blogger) yang memanggil GAS via `fetch()` ke URL Web App GAS.
- GAS bertindak sebagai router: satu `doGet`/`doPost` dengan parameter `action` untuk membedakan operasi.
- Tidak ada session server asli → gunakan **token-based auth** (token disimpan di `sessionStorage`/`localStorage` browser, divalidasi ulang oleh GAS di setiap request).

---

## 2. Struktur Data (Sheet sebagai Tabel)

| Sheet | Kolom Utama |
|---|---|
| `Admin` | id_admin, nama, email, password_hash |
| `Mentor` | id_mentor, nama, email, password_hash, jenis_mentor (bimbel/privat), status, created_at |
| `PesertaDidik` | id_peserta, nama_lengkap, usia, jenis (privat/bimbel), id_mentor, email_wali, kode_akses_wali, tanggal_daftar, status |
| `Kemajuan` | id_log, id_peserta, tanggal, kitab, halaman, catatan_hafalan |
| `Penilaian` | id_penilaian, id_peserta, tanggal, nilai (0–10), catatan |
| `Kehadiran` | id_absen, id_peserta, tanggal, status (hadir/izin), keterangan |
| `PelajaranTambahan` | id, id_peserta, nama_pelajaran, deskripsi, tanggal |
| `CatatanMentor` | id, id_peserta, tanggal, isi_catatan |
| `Sessions` | token, id_user, role (admin/mentor), expired_at |
| `EmailLog` | id_log, id_peserta, jenis (notifikasi/laporan_pdf), tanggal_kirim, status_kirim |

Catatan: `kode_akses_wali` wajib diisi untuk setiap peserta (dibuat otomatis oleh sistem, format pendek — lihat bagian 6.1) agar Portal Wali tidak 100% terbuka bebas. `email_wali` digunakan sebagai tujuan pengiriman notifikasi dan laporan PDF otomatis.

---

## 3. Struktur Halaman

### A. `/p/admin` — Admin Portal
1. **Login Admin** — email + password
2. **Dashboard Statistik** (lihat detail di bagian 6.6) — ringkasan jumlah mentor, peserta didik (bimbel vs privat), grafik tren kehadiran & rata-rata nilai, aktivitas terbaru
3. **Manajemen Mentor**
   - Tambah mentor: nama, email, password (dibuatkan admin), jenis (bimbel/privat)
   - Edit / nonaktifkan mentor
4. **Manajemen Peserta Didik**
   - Tambah peserta: nama lengkap, usia, jenis (privat/bimbel), assign ke mentor, **email orang tua/wali** (untuk notifikasi & laporan PDF)
   - Generate `kode_akses_wali` otomatis saat peserta baru dibuat (kode unik pendek, lihat bagian 6.1)
   - Edit / pindah mentor / nonaktifkan peserta
   - Tombol "Kirim ulang kode akses" ke email wali jika kode hilang
5. **Laporan** — export rekap (kehadiran, nilai, progres) per periode
6. **Pengaturan Akun Admin** — ganti password

### B. `/p/mentor` — Mentor Portal
1. **Login Mentor** — sistem otomatis mendeteksi jenis mentor (bimbel/privat) dan hanya menampilkan peserta sesuai jenisnya
2. **Dashboard Mentor** — daftar peserta didik yang diampu
3. **Halaman Detail per Peserta**, berisi form input:
   - Kemajuan hafalan: kitab yang dipelajari + halaman saat ini
   - Penilaian (0–10)
   - Kehadiran: tandai hadir / izin
   - Pelajaran tambahan
   - Catatan mentor (bebas teks)
4. **Riwayat/Timeline** — histori seluruh entri di atas per peserta (agar mentor bisa lihat progres dari waktu ke waktu, bukan cuma data terbaru)
5. **Ganti Password**

### C. `/p/portalwali` — Portal Wali (Publik)
1. **Search bar** — cari berdasarkan nama peserta didik **+ kode akses wali** (kombinasi ini penting untuk privasi — lihat bagian 6)
2. **Hasil pencarian** — tampilkan profil peserta:
   - Nama, usia, jenis (privat/bimbel), nama mentor
   - Progres hafalan terakhir (kitab + halaman)
   - Riwayat penilaian
   - Rekap total hadir & izin
   - Pelajaran tambahan
   - Catatan mentor (opsional: ringkas atau lengkap, sesuai kebijakan)
3. Tidak ada login — tapi tetap dibatasi lewat kode akses agar tidak semua data anak bisa dicari bebas oleh siapa pun.

---

## 4. Alur Autentikasi

1. User submit form login → `POST` ke GAS dengan `action=login`
2. GAS cek email di sheet `Admin`/`Mentor`, cocokkan password hash (gunakan `Utilities.computeDigest` dengan salt — GAS tidak punya bcrypt native)
3. Jika valid → generate token acak, simpan di sheet `Sessions` dengan waktu kedaluwarsa (misal 8 jam)
4. Token dikirim balik ke browser, disimpan di `sessionStorage`
5. Setiap request berikutnya menyertakan token → GAS validasi token & expiry sebelum proses data
6. Logout → hapus token dari `Sessions` + clear `sessionStorage`

---

## 5. Contoh Endpoint GAS (berdasarkan parameter `action`)

```
action=adminLogin / mentorLogin
action=addMentor / editMentor / deactivateMentor
action=addPesertaDidik / editPesertaDidik
action=getPesertaByMentor
action=updateKemajuan
action=addPenilaian
action=addKehadiran
action=addPelajaranTambahan
action=addCatatanMentor
action=getRiwayatPeserta
action=searchPesertaPublic     (portal wali, butuh nama + kode akses)
action=getGrafikPeserta        (data untuk chart.js — kemajuan, nilai, kehadiran)
action=kirimUlangKodeAkses     (kirim ulang kode akses ke email_wali)
action=generateDanKirimLaporanPDF
action=getDashboardStats       (statistik untuk dashboard admin, di-cache)
```

---

## 6. Fitur Tambahan (Detail Implementasi)

### 6.1 Kode Akses Wali (Kode Unik Pendek per Peserta)

- Dibuat otomatis oleh sistem saat admin menambahkan peserta didik baru (bukan diketik manual).
- Format: 6 karakter alfanumerik uppercase, contoh `Q3F7K2` (mudah diketik, cukup ruang kombinasi untuk skala ratusan/ribuan peserta).
- Generate di GAS: ambil karakter acak dari set `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (huruf/angka yang mirip seperti `0/O`, `1/I` dihilangkan agar tidak membingungkan saat dibaca wali).
- Sebelum disimpan, GAS cek dulu apakah kode sudah dipakai di sheet `PesertaDidik` — jika bentrok, generate ulang.
- Kode ini dikirim otomatis ke `email_wali` saat peserta pertama kali didaftarkan (lihat 6.2), dan admin bisa mengirim ulang kapan saja lewat tombol "Kirim ulang kode akses".
- Dipakai di `/p/portalwali` sebagai syarat wajib bersama nama peserta agar pencarian tidak terbuka bebas ke publik.

### 6.2 Notifikasi Email

- Dikirim via `MailApp`/`GmailApp` langsung dari GAS (tidak perlu layanan pihak ketiga).
- Jenis notifikasi otomatis ke `email_wali`:
  - **Peserta baru terdaftar** → berisi kode akses wali + link Portal Wali
  - **Update kemajuan/hafalan baru** dari mentor
  - **Penilaian baru** diinput mentor
  - **Laporan PDF bulanan** siap (lihat 6.4)
- Setiap pengiriman dicatat di sheet `EmailLog` (status sukses/gagal) agar admin bisa cek riwayat pengiriman.
- Mentor bisa memilih trigger notifikasi mana yang aktif per aksi (misalnya notifikasi kemajuan bisa langsung terkirim tiap update, atau digabung jadi rekap mingguan agar tidak spam ke wali — direkomendasikan opsi rekap mingguan sebagai default).

### 6.3 Grafik Progres

- Ditampilkan di halaman Mentor (progres peserta yang diampu) dan Portal Wali (progres anak yang dicari).
- Menggunakan **Chart.js**, data diambil dari sheet `Kemajuan`, `Penilaian`, dan `Kehadiran` lewat endpoint GAS (`action=getGrafikPeserta`).
- Jenis grafik:
  - Line chart: perkembangan halaman hafalan/kitab dari waktu ke waktu
  - Line/bar chart: tren nilai (0–10) per periode
  - Bar/donut chart: rekap kehadiran (hadir vs izin)

### 6.4 Export Laporan PDF per Peserta (Dikirim ke Email Orang Tua)

- Trigger: manual oleh mentor/admin ("Generate & Kirim Laporan"), atau otomatis bulanan lewat time-based trigger GAS.
- Alur teknis:
  1. GAS ambil seluruh data peserta (kemajuan, penilaian, kehadiran, pelajaran tambahan, catatan mentor) dari periode terkait
  2. Isi ke template Google Docs (dibuat sekali sebagai master template, isi diganti lewat `replaceText`)
  3. Export Google Docs → PDF (`getAs(MimeType.PDF)`)
  4. Kirim PDF sebagai attachment lewat `MailApp.sendEmail` ke `email_wali`
  5. Simpan salinan PDF di folder Drive khusus per peserta untuk arsip, dan catat di `EmailLog`
- Admin/mentor bisa lihat status pengiriman laporan di dashboard (terkirim/gagal, dengan opsi kirim ulang).

### 6.5 Caching

- Menggunakan `CacheService` (script cache) di GAS untuk endpoint yang sering diakses publik, terutama `action=searchPesertaPublic` dan `action=getGrafikPeserta` di Portal Wali.
- Data hasil query di-cache beberapa menit (misalnya 5–10 menit) agar tidak setiap request Portal Wali langsung baca ulang Spreadsheet (mengurangi beban kuota Sheets API & mempercepat respons).
- Cache di-invalidate otomatis saat ada update data terkait peserta tersebut (mentor input kemajuan baru → hapus cache peserta itu).

### 6.6 Statistik Dashboard Admin

- Ringkasan angka: total mentor (bimbel/privat), total peserta didik (bimbel/privat), total laporan PDF terkirim bulan ini
- Grafik tren kehadiran keseluruhan (semua peserta) per minggu/bulan
- Grafik rata-rata nilai per jenis peserta (bimbel vs privat) untuk melihat perbandingan performa
- Daftar aktivitas terbaru (log dari `EmailLog` dan histori input mentor)
- Data diambil lewat endpoint `action=getDashboardStats`, idealnya juga di-cache (lihat 6.5) karena dashboard sering dibuka admin.

### 6.7 Fitur Tambahan Lain yang Direkomendasikan

- Reset password mentor via email
- Log aktivitas/audit trail — siapa mengubah data apa dan kapan
- Backup otomatis spreadsheet (trigger harian ke Drive)
- Rate limiting sederhana di GAS untuk endpoint publik (cegah spam/scraping kode akses)
- Dukungan multi-mentor per peserta (jika ke depan 1 peserta bisa dibimbing >1 mentor)

---

## 7. Pertimbangan Keamanan

- Password wajib di-hash, jangan plain text
- Validasi & sanitasi semua input di sisi GAS (jangan percaya input client)
- Token session dengan waktu kedaluwarsa + validasi ulang tiap request
- Portal wali dibatasi dengan kode akses, bukan search nama bebas
- Spreadsheet tidak diakses langsung publik — semua lewat GAS Web App
- Set header CORS yang sesuai di `ContentService`/`HtmlService` GAS

---

## 8. Roadmap Implementasi

| Fase | Fokus |
|---|---|
| 1 | Setup struktur Spreadsheet + GAS dasar (routing `action`, auth) |
| 2 | Halaman Admin: login, CRUD mentor & peserta didik |
| 3 | Halaman Mentor: login, input kemajuan/penilaian/kehadiran/catatan |
| 4 | Halaman Portal Wali: search dengan kode akses, tampilan detail + grafik progres |
| 5 | Notifikasi email otomatis (kode akses, update kemajuan/nilai, rekap) |
| 6 | Export laporan PDF per peserta + pengiriman otomatis ke email wali |
| 7 | Statistik dashboard admin + caching untuk endpoint publik & dashboard |
| 8 | Testing, review keamanan (rate limiting, validasi kode akses), optimasi performa |
| 9 | Deployment ke Blogger + dokumentasi penggunaan untuk admin/mentor |

---

Struktur di atas fokus pada tiga halaman inti (admin, mentor, portal wali) yang saling terhubung lewat GAS + Spreadsheet, dengan penekanan pada privasi data peserta didik di sisi Portal Wali. Beri tahu saya kalau mau saya breakdown lebih detail salah satu bagian (misalnya skema lengkap GAS `doPost` per action, atau wireframe halaman).
