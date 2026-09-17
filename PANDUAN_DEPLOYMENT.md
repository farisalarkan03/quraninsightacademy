# 🚀 Panduan Deployment — Portal QIA
## GitHub → Supabase → Cloudflare Pages

---

## LANGKAH 1 — Setup Supabase (Backend Database)

### 1.1 Buat Project Supabase
1. Buka **[supabase.com](https://supabase.com)** → klik **"New Project"**
2. Isi:
   - **Name**: `portal-qia`
   - **Database Password**: *(simpan baik-baik)*
   - **Region**: Southeast Asia (Singapore)
3. Tunggu hingga project selesai di-provision (~1-2 menit)

### 1.2 Jalankan Schema Database
1. Di Supabase Dashboard → **SQL Editor → New Query**
2. Copy-paste seluruh isi file `supabase/schema.sql`
3. Klik **"Run"** — pastikan muncul `Success`

### 1.3 Buat Akun Admin
1. Buka **Authentication → Users → Add User → Create new user**
2. Isi:
   - **Email**: `portalqia@gmail.com`
   - **Password**: `adminqia222`
   - ✅ **Auto Confirm User** (centang)
3. Klik **"Create User"**
4. **PENTING**: Salin UUID user yang baru dibuat

### 1.4 Jalankan Seed Admin
1. **SQL Editor → New Query**
2. Copy isi `supabase/seed.sql`
3. **Ganti** `v_admin_id` dengan UUID yang disalin:
   ```sql
   v_admin_id uuid := 'PASTE-UUID-ANDA-DI-SINI';
   ```
4. Klik **"Run"**

### 1.5 Ambil API Keys
1. **Project Settings → API**
2. Salin:
   - **Project URL** → `https://xxxxxxxxxx.supabase.co`
   - **anon / public key** → `eyJhbGci...`

---

## LANGKAH 2 — Push ke GitHub

### 2.1 Inisialisasi Git
```bash
cd "/Users/farisalarkan/Documents/ALL PROJECT/QURAN INSIGHT ACADEMY/WEBSITE QIA"
git init
git add .
git commit -m "feat: Initial commit — Portal QIA production ready"
```

### 2.2 Buat Repository di GitHub
1. Buka **github.com** → **"+"** → **"New repository"**
2. Name: `portal-qia` | Visibility: **Private**
3. **JANGAN** centang "Initialize with README"
4. Klik **"Create repository"**

### 2.3 Push ke GitHub
```bash
git remote add origin https://github.com/USERNAME/portal-qia.git
git branch -M main
git push -u origin main
```

---

## LANGKAH 3 — Deploy ke Cloudflare Pages

### 3.1 Hubungkan GitHub ke Cloudflare
1. **dash.cloudflare.com → Workers & Pages → Create application → Pages**
2. Klik **"Connect to Git"** → pilih GitHub → Authorize
3. Pilih repository `portal-qia` → **"Begin setup"**

### 3.2 Konfigurasi Build
| Pengaturan | Nilai |
|---|---|
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | `18` |

### 3.3 Environment Variables
| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | URL dari langkah 1.5 |
| `VITE_SUPABASE_ANON_KEY` | Anon key dari langkah 1.5 |

### 3.4 Deploy
Klik **"Save and Deploy"** — tunggu ~2-3 menit.
URL akan menjadi: **`https://portal-qia.pages.dev`**

---

## LANGKAH 4 — Verifikasi

1. Buka URL Cloudflare Pages
2. Login dengan `portalqia@gmail.com` / `adminqia222`
3. Tambah mentor & peserta didik via dashboard admin

---

## LANGKAH 5 — Update Kode (Future)

```bash
git add .
git commit -m "update: deskripsi perubahan"
git push
```
Cloudflare otomatis redeploy setiap push ke `main`.

---

## 🔧 Troubleshooting

- **Build Error**: Cek Node.js version = `18`, cek env variables
- **Login Gagal**: Pastikan URL & Anon Key Supabase benar, schema sudah dijalankan
- **Data Tidak Tersimpan**: Cek Supabase → Logs → API untuk error

---

## 📋 Kredensial Admin

| Item | Nilai |
|---|---|
| **Email** | `portalqia@gmail.com` |
| **Password** | `adminqia222` |

> ⚠️ **Simpan kredensial ini di tempat yang aman!**
