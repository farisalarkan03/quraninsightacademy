# Panduan Setup & Deployment Portal QIA

## Struktur File

```
portal-qia/
├── gas/
│   └── Code.gs          ← Backend Google Apps Script
└── pages/
    ├── portal-admin.html    ← Halaman Admin (/p/admin di Blogger)
    ├── portal-mentor.html   ← Halaman Mentor (/p/mentor di Blogger)
    └── portal-wali.html     ← Portal Wali (/p/portalwali di Blogger)
```

---

## Langkah 1: Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) → buat spreadsheet baru
2. Beri nama: **"Database Portal QIA"**
3. Salin **ID Spreadsheet** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_DI_SINI/edit
   ```
4. Simpan ID ini — akan dipakai di GAS

---

## Langkah 2: Setup Google Apps Script (GAS)

1. Di spreadsheet, klik **Extensions → Apps Script**
2. Hapus semua kode default yang ada
3. Copy-paste seluruh isi file `gas/Code.gs` ke editor
4. **Edit baris konfigurasi** di bagian atas:
   ```javascript
   var SPREADSHEET_ID = 'ID_SPREADSHEET_ANDA';      // dari Langkah 1
   var TEMPLATE_DOC_ID = 'ID_GOOGLE_DOC_TEMPLATE';  // (opsional, untuk PDF)
   var LAPORAN_FOLDER_ID = 'ID_FOLDER_DRIVE';        // (opsional, untuk PDF)
   ```

5. **Jalankan setup awal:**
   - Klik fungsi dropdown → pilih `setupAwal`
   - Klik ▶ (Run)
   - Izinkan akses yang diminta (Google akan minta otorisasi)
   - Cek Logger (View → Logs) untuk melihat hasil

6. **Deploy sebagai Web App:**
   - Klik **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me (your Google account)**
   - Who has access: **Anyone** ← PENTING agar Blogger bisa akses
   - Klik **Deploy**
   - Salin **Web App URL** yang muncul — format:
     ```
     https://script.google.com/macros/s/XXXXXXXX/exec
     ```

---

## Langkah 3: Setup Template PDF (Opsional)

1. Buka [Google Docs](https://docs.google.com) → buat dokumen baru
2. Buat template laporan dengan placeholder berikut:
   ```
   LAPORAN PERKEMBANGAN PESERTA DIDIK
   Quran Insight Academy
   
   Nama          : {{NAMA}}
   Usia          : {{USIA}} tahun
   Program       : {{JENIS}}
   Mentor        : {{MENTOR}}
   Terdaftar     : {{TANGGAL_DAFTAR}}
   
   REKAP KEHADIRAN
   Total Hadir   : {{TOTAL_HADIR}}
   Total Izin    : {{TOTAL_IZIN}}
   
   PENILAIAN
   Rata-rata Nilai: {{AVG_NILAI}} / 10
   
   PROGRES HAFALAN
   Terakhir      : {{PROGRES_TERAKHIR}}
   
   CATATAN MENTOR
   {{CATATAN_TERBARU}}
   
   Tanggal Laporan: {{TANGGAL_LAPORAN}}
   ```
3. Salin ID dokumen dari URL dan masukkan ke `TEMPLATE_DOC_ID` di GAS
4. Buat folder di Google Drive untuk arsip PDF, salin ID folder ke `LAPORAN_FOLDER_ID`

---

## Langkah 4: Pasang URL GAS di File HTML

Di ketiga file HTML, cari baris:
```javascript
const GAS_URL = 'GANTI_DENGAN_URL_GAS_WEB_APP_ANDA';
```

Ganti dengan URL Web App dari Langkah 2, contoh:
```javascript
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxdMQpEUGCxa3W9BB_HM5zIU71Q8b0OZFepAgOY0thu2hRzxC2HbNfEPFvzpoqNQoTc/exec';
```

> ⚠️ **PENTING:** Lakukan ini di **ketiga file HTML** (admin, mentor, wali)

---

## Langkah 5: Deploy ke Blogger

### Cara Embed HTML di Blogger:

1. Login ke Blogger → buat **Halaman Baru** (bukan postingan)
2. Klik **mode HTML** (bukan Compose)
3. Paste **seluruh isi HTML** file yang sesuai
4. Publish halaman dengan URL yang dikonfigurasi:
   - Admin: `/p/admin`
   - Mentor: `/p/mentor`
   - Portal Wali: `/p/portalwali`

> 💡 **Tips:** Blogger kadang memfilter beberapa tag HTML. Jika ada masalah tampilan, coba pakai theme Blogger yang minimal (misalnya "Simple"), atau gunakan **Custom Domain** untuk kontrol lebih penuh.

---

## Langkah 6: Setup Time Trigger (Laporan Bulanan)

Di GAS editor:
1. Klik ikon ⏰ **Triggers** di sidebar kiri
2. Klik **+ Add Trigger**
3. Pilih:
   - Function: `triggerLaporanBulanan`
   - Event source: **Time-driven**
   - Time type: **Month timer**
   - Day: **1** (tanggal 1 setiap bulan)
4. Save

---

## Akun Default Admin

Setelah `setupAwal()` dijalankan:
- **Email:** `admin@qia.id`
- **Password:** `Admin123!`

> ⚠️ **Harap ganti password segera setelah login pertama!**

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Unauthorized" saat login | Pastikan `SPREADSHEET_ID` benar di GAS |
| Email tidak terkirim | Aktifkan Gmail API di GAS project, cek kuota MailApp (100/hari gratis) |
| CORS error | Deploy ulang GAS sebagai "Anyone" |
| Data tidak tersimpan | Cek log di GAS (View → Logs) untuk error detail |
| PDF gagal dibuat | Pastikan `TEMPLATE_DOC_ID` dan `LAPORAN_FOLDER_ID` benar |
| Blogger memfilter script | Gunakan Blogger theme minimal, atau self-host HTML di GitHub Pages |

---

## Keamanan

- ✅ Password di-hash dengan SHA-256 + salt sebelum disimpan
- ✅ Session token kedaluwarsa otomatis setelah 8 jam
- ✅ Portal Wali dilindungi kode akses 6 karakter unik per peserta
- ✅ Rate limiting 10 percobaan per 5 menit di endpoint publik
- ✅ Validasi input di sisi GAS (server-side)
- ✅ Spreadsheet tidak diakses langsung — semua via GAS Web App

---

*Dibuat untuk Quran Insight Academy — Bersama Menuju Insan Qurani*
