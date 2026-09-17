// ============================================================
// QIA — Portal Mentor (Absensi Massal Bimbel + Input Harian)
// src/pages/mentor.js
// ============================================================

import '@/styles/main.css'
import { authService, mentorService } from '@/lib/supabase.js'

// State
let state = {
  profile: null,
  kelasList: [],
  pesertaList: [],
  activeView: 'dashboard',  // dashboard | absensi-massal | peserta-detail | kelas
  selectedKelas: null,
  selectedPeserta: null,
  absensiRows: [],
}

export async function renderMentor(app, navigate, showToast) {
  document.title = 'Portal Asatidz — Quran Insight Academy'
  try {
    state.profile = await authService.getProfile()
    if (!state.profile || state.profile.role !== 'mentor') {
      renderMentorLogin(app, navigate, showToast)
      return
    }
  } catch {
    renderMentorLogin(app, navigate, showToast)
    return
  }

  app.innerHTML = buildMentorShell()
  attachMentorEvents(navigate, showToast)
  await loadMentorData(showToast)
  renderView('dashboard', showToast)
}

function renderMentorLogin(app, navigate, showToast) {
  app.innerHTML = `
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <div class="login-logo-icon"><span class="ms" style="font-size:36px;color:#221104;">menu_book</span></div>
        <h1>Portal Asatidz QIA</h1>
        <p>Absensi Massal, Materi & Kemajuan Peserta Didik</p>
      </div>

      <form id="mentor-login-form">
        <div class="form-group">
          <label class="form-label">Email Asatidz</label>
          <input type="email" id="mentor-login-email" class="form-control" placeholder="mentor@qia.id" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="mentor-login-pwd" class="form-control" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn btn-primary" id="btn-submit-mentor-login" style="width:100%;margin-top:16px;padding:12px;">
          <i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Portal Asatidz
        </button>
      </form>

      <div class="section-divider"><span>Pilih Akun Demo Uji Coba</span></div>

      <div style="display:flex;flex-direction:column;gap:8px;">
        <button type="button" id="btn-demo-bimbel" class="btn btn-secondary" style="width:100%;font-size:12.5px;text-align:left;display:flex;align-items:center;justify-content:space-between;">
          <span><i class="fa-solid fa-chalkboard-user mr-1" style="color:#F0AF43;"></i> Ust. Abdurrahman</span>
          <span class="nav-badge">Bimbel</span>
        </button>
        <button type="button" id="btn-demo-privat" class="btn btn-secondary" style="width:100%;font-size:12.5px;text-align:left;display:flex;align-items:center;justify-content:space-between;">
          <span><i class="fa-solid fa-user-graduate mr-1" style="color:#10b981;"></i> Ust. Hasan Al-Bashri</span>
          <span class="nav-badge" style="background:rgba(16,185,129,0.2);color:#10b981;">Privat</span>
        </button>
      </div>

      <div style="text-align:center;margin-top:20px;">
        <button onclick="window.navigate('/')" style="background:none;border:none;color:#c9a87a;font-size:13px;cursor:pointer;">
          <i class="fa-solid fa-arrow-left mr-1"></i> Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>`

  const form = document.getElementById('mentor-login-form')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('mentor-login-email').value
    const pwd   = document.getElementById('mentor-login-pwd').value
    const btn   = document.getElementById('btn-submit-mentor-login')
    btn.disabled = true
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Masuk…'
    try {
      await authService.login(email, pwd)
      showToast('Berhasil masuk sebagai Asatidz!', 'success')
      renderMentor(app, navigate, showToast)
    } catch (err) {
      showToast('Gagal masuk: ' + err.message, 'error')
      btn.disabled = false
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Portal Asatidz'
    }
  })

  document.getElementById('btn-demo-bimbel')?.addEventListener('click', async () => {
    showToast('Masuk sebagai Ust. Abdurrahman (Bimbel)…', 'info')
    await authService.login('mentor1@qia.id', 'demo123')
    showToast('Selamat datang, Ust. Abdurrahman!', 'success')
    renderMentor(app, navigate, showToast)
  })

  document.getElementById('btn-demo-privat')?.addEventListener('click', async () => {
    showToast('Masuk sebagai Ust. Hasan (Privat)…', 'info')
    await authService.login('mentor3@qia.id', 'demo123')
    showToast('Selamat datang, Ust. Hasan!', 'success')
    renderMentor(app, navigate, showToast)
  })
}

function buildMentorShell() {
  return `
<div class="portal-layout">
  <!-- Sidebar -->
  <button class="sidebar-toggle" id="sidebar-toggle">
    <i class="fa-solid fa-bars"></i>
  </button>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>

  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon"><span class="ms" style="font-size:20px;color:#221104;">menu_book</span></div>
      <div class="sidebar-logo-text">
        <h1>QIA Mentor</h1>
        <p>Portal Asatidz</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="sidebar-nav-label">Menu Utama</div>
      <div class="nav-item active" data-view="dashboard" id="nav-dashboard">
        <i class="fa-solid fa-house-chimney"></i> Dashboard
      </div>
      <div class="nav-item" data-view="kelas" id="nav-kelas" style="${isBimbel() ? '' : 'display:none'}">
        <i class="fa-solid fa-chalkboard-user"></i> Kelas Saya
      </div>
      <div class="nav-item" data-view="absensi-massal" id="nav-absensi" style="${isBimbel() ? '' : 'display:none'}">
        <i class="fa-solid fa-clipboard-list"></i> Absensi Massal
        <span class="nav-badge" id="badge-absensi">Bimbel</span>
      </div>
      <div class="nav-item" data-view="santri-list" id="nav-santri">
        <i class="fa-solid fa-users"></i> Daftar Peserta Didik
      </div>
      <div class="nav-item" data-view="ganti-password" id="nav-pwd">
        <i class="fa-solid fa-lock"></i> Ganti Password
      </div>
    </nav>

    <div class="sidebar-user">
      <div class="user-avatar" id="user-avatar">M</div>
      <div class="user-info">
        <div class="user-name" id="user-name">Memuat…</div>
        <div class="user-role" id="user-role-label">Mentor</div>
      </div>
      <button class="btn-logout" id="btn-logout" title="Keluar">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  </aside>

  <!-- Main -->
  <main class="main-content" id="main-content">
    <!-- Content rendered here -->
  </main>
</div>`
}

function isBimbel() {
  return state.profile?.jenis_mentor === 'bimbel' || state.profile?.jenis_mentor === 'keduanya'
}
function isPrivat() {
  return state.profile?.jenis_mentor === 'privat' || state.profile?.jenis_mentor === 'keduanya'
}

function attachMentorEvents(navigate, showToast) {
  // Sidebar toggle
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open')
    document.getElementById('sidebar-overlay').classList.toggle('show')
  })
  document.getElementById('sidebar-overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open')
    document.getElementById('sidebar-overlay').classList.remove('show')
  })

  // Nav items
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view
      renderView(view, showToast)
    })
  })

  // Logout
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await authService.logout()
    navigate('/')
  })
}

async function loadMentorData(showToast) {
  try {
    const id = state.profile.id
    state.kelasList  = await mentorService.getMyKelas(id)
    state.pesertaList = await mentorService.getMyPeserta(id)
    // Update sidebar user info
    document.getElementById('user-name').textContent = state.profile.nama || state.profile.email
    document.getElementById('user-role-label').textContent = jenisLabel(state.profile.jenis_mentor)
    document.getElementById('user-avatar').textContent = (state.profile.nama||'M').charAt(0)
    // Show/hide bimbel menus
    if (isBimbel()) {
      document.getElementById('nav-kelas')?.removeAttribute('style')
      document.getElementById('nav-absensi')?.removeAttribute('style')
    }
  } catch(e) {
    showToast('Gagal memuat data: ' + e.message, 'error')
  }
}

function setActiveNav(view) {
  document.querySelectorAll('.nav-item[data-view]').forEach(el => el.classList.remove('active'))
  const el = document.getElementById('nav-' + view.replace('-list','santri').replace('-massal','absensi').replace('-detail','santri'))
  if (el) el.classList.add('active')
}

function renderView(view, showToast) {
  state.activeView = view
  setActiveNav(view)
  const main = document.getElementById('main-content')

  switch(view) {
    case 'dashboard':     renderDashboard(main, showToast); break
    case 'kelas':         renderKelasSaya(main, showToast); break
    case 'absensi-massal':renderAbsensiMassal(main, showToast); break
    case 'santri-list':   renderSantriList(main, showToast); break
    case 'ganti-password':renderGantiPassword(main, showToast); break
    default: renderDashboard(main, showToast)
  }

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open')
  document.getElementById('sidebar-overlay').classList.remove('show')
}

// ── VIEWS ────────────────────────────────────────────────────

function renderDashboard(main, showToast) {
  const totalBimbel = state.pesertaList.filter(p=>p.jenis==='bimbel').length
  const totalPrivat  = state.pesertaList.filter(p=>p.jenis==='privat').length
  main.innerHTML = `
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Mentor</span></div>
      <div class="page-breadcrumb">Selamat datang, ${state.profile?.nama || '—'}</div>
    </div>
    <div style="font-size:13px;color:var(--text-muted);">
      <i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
    </div>
  </div>

  <!-- Stats -->
  <div class="grid-4" style="margin-bottom:28px;">
    ${[
      [`${state.pesertaList.length}`, 'Total Peserta Didik', 'fa-users', 'stat-icon-gold'],
      [totalBimbel, 'Peserta Didik Bimbel', 'fa-chalkboard-user', 'stat-icon-emerald'],
      [totalPrivat, 'Peserta Didik Privat', 'fa-user-graduate', 'stat-icon-brown'],
      [`${state.kelasList.length}`, 'Kelas Aktif', 'fa-door-open', 'stat-icon-blue'],
    ].map(([val,lbl,icon,cls]) => `
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${cls}"><i class="fa-solid ${icon}" style="color:white;"></i></div>
      <div><div class="stat-value">${val}</div><div class="stat-label">${lbl}</div></div>
    </div>`).join('')}
  </div>

  <!-- Shortcut actions -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;">
    ${isBimbel() ? `
    <button onclick="renderMentorView('absensi-massal')"
      style="background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;
      padding:20px;border-radius:16px;border:none;cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
      <i class="fa-solid fa-clipboard-list" style="font-size:24px;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Absensi Massal</div>
      <div style="font-size:12px;opacity:0.75;margin-top:4px;">Input absen seluruh kelas sekaligus</div>
    </button>` : ''}
    <button onclick="renderMentorView('santri-list')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-users" style="font-size:24px;color:#F0AF43;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Daftar Peserta Didik</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">Lihat & kelola peserta didik bimbingan</div>
    </button>
    ${isBimbel() ? `
    <button onclick="renderMentorView('kelas')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-chalkboard" style="font-size:24px;color:#10b981;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Kelas Saya</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">${state.kelasList.length} kelas aktif</div>
    </button>` : ''}
  </div>

  <!-- Daftar santri ringkas -->
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h3 style="color:var(--cream-100);font-size:14px;">Peserta Didik Bimbingan Saya</h3>
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">Lihat Semua →</button>
    </div>
    ${state.pesertaList.length === 0 ? '<p style="color:var(--text-card-muted);font-size:14px;">Belum ada peserta didik yang ditugaskan.</p>' :
      `<div style="display:flex;flex-direction:column;gap:8px;">
        ${state.pesertaList.slice(0,6).map(p => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;
          background:rgba(255,255,255,0.04);border-radius:10px;
          border:1px solid transparent;cursor:pointer;transition:all 0.2s;"
          onclick="openSantriDetail(${p.id})"
          onmouseover="this.style.background='rgba(240,175,67,0.08)';this.style.borderColor='rgba(240,175,67,0.15)'"
          onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='transparent'">
          <div style="width:36px;height:36px;border-radius:50%;
            background:linear-gradient(135deg,var(--brown-600),var(--brown-300));
            display:flex;align-items:center;justify-content:center;
            font-weight:700;font-size:14px;color:#fdf0e2;flex-shrink:0;">${p.nama_lengkap.charAt(0)}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;color:var(--cream-100);font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.nama_lengkap}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${p.kelas?.nama_kelas || jenisLabel(p.jenis)}</div>
          </div>
          <span class="${p.jenis==='bimbel'?'badge badge-gold':'badge badge-emerald'}">${p.jenis}</span>
        </div>`).join('')}
      </div>`}
  </div>`

  window.renderMentorView = (v) => renderView(v, showToast)
  window.openSantriDetail = (id) => openPesertaDetail(id, main, showToast)
}

function renderKelasSaya(main, showToast) {
  main.innerHTML = `
  <div class="page-header">
    <div>
      <div class="page-title">Kelas <span>Saya</span></div>
      <div class="page-breadcrumb">${state.kelasList.length} kelas aktif yang Anda ampu</div>
    </div>
    <button onclick="renderMentorView('absensi-massal')" class="btn btn-primary">
      <i class="fa-solid fa-clipboard-list"></i> Absensi Massal
    </button>
  </div>
  <div class="grid-3">
    ${state.kelasList.length === 0 ? `<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon"><span class="ms" style="font-size:40px;color:var(--gold-400);">school</span></div><h3>Belum ada kelas</h3><p>Anda belum memiliki kelas aktif.</p></div></div>` :
      state.kelasList.map(k => {
        const pesertaKelas = state.pesertaList.filter(p=>p.id_kelas===k.id)
        return `
        <div class="card anim-fadeInUp">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <span class="badge badge-gold">${pesertaKelas.length} peserta didik</span>
          </div>
          <h3 style="color:var(--cream-100);font-size:15px;margin-bottom:6px;">${k.nama_kelas}</h3>
          <p style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">${k.deskripsi || 'Tidak ada deskripsi'}</p>
          ${k.hari_jadwal ? `<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:6px;">
            <i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${k.hari_jadwal}</div>` : ''}
          ${k.jam_jadwal ? `<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">
            <i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${k.jam_jadwal}</div>` : ''}
          <div style="display:flex;flex-direction:column;gap:6px;max-height:120px;overflow-y:auto;">
            ${pesertaKelas.map(p=>`
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-card-muted);">
              <div style="width:24px;height:24px;border-radius:50%;
                background:linear-gradient(135deg,var(--brown-600),var(--brown-400));
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:700;color:#fdf0e2;flex-shrink:0;">${p.nama_lengkap.charAt(0)}</div>
              ${p.nama_lengkap}
            </div>`).join('')}
          </div>
          <button onclick="openAbsensiMassal(${k.id})" class="btn btn-secondary btn-sm" style="width:100%;margin-top:14px;">
            <i class="fa-solid fa-clipboard-list"></i> Absensi Kelas Ini
          </button>
        </div>`
      }).join('')}
  </div>`
  window.renderMentorView = (v) => renderView(v, showToast)
  window.openAbsensiMassal = (kelasId) => {
    state.selectedKelas = state.kelasList.find(k=>k.id===kelasId) || null
    renderView('absensi-massal', showToast)
  }
}

function renderAbsensiMassal(main, showToast) {
  const today = new Date().toISOString().slice(0,10)
  main.innerHTML = `
  <div class="page-header">
    <div>
      <div class="page-title">Absensi <span>Massal</span></div>
      <div class="page-breadcrumb">Input kehadiran seluruh peserta didik kelas sekaligus</div>
    </div>
  </div>

  <!-- Filter Kelas & Tanggal -->
  <div class="card" style="margin-bottom:20px;">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;align-items:end;">
      <div class="form-group">
        <label class="form-label">Pilih Kelas</label>
        <select class="form-control" id="absensi-kelas-select">
          <option value="">-- Pilih Kelas --</option>
          ${state.kelasList.map(k=>`<option value="${k.id}" ${state.selectedKelas?.id===k.id?'selected':''}>${k.nama_kelas}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal Sesi</label>
        <input type="date" class="form-control" id="absensi-tanggal" value="${today}" />
      </div>
      <div class="form-group">
        <label class="form-label">Materi Pembahasan</label>
        <input type="text" class="form-control" id="absensi-materi" placeholder="cth: Makharijul Huruf — Huruf Halq" />
      </div>
      <div>
        <button class="btn btn-primary" id="btn-load-absensi" style="width:100%;height:44px;">
          <i class="fa-solid fa-arrow-down-to-line"></i> Muat Daftar Peserta Didik
        </button>
      </div>
    </div>
    <!-- Catatan Sesi -->
    <div class="form-group" style="margin-top:14px;">
      <label class="form-label">Catatan Sesi / Evaluasi Kelas</label>
      <textarea class="form-control" id="absensi-catatan" rows="2"
        placeholder="Catatan evaluasi keseluruhan sesi, poin penting yang perlu ditindaklanjuti…"></textarea>
    </div>
  </div>

  <!-- Daftar Peserta Didik -->
  <div id="absensi-table-wrapper" style="display:none;">
    <div class="card" style="padding:0;overflow:hidden;">
      <!-- Sub-toolbar -->
      <div style="padding:14px 20px;background:var(--bg-card);border-bottom:1px solid var(--border-dark);
        display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-size:13px;color:var(--text-card-muted);" id="absensi-count-label"></span>
        <div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="setAllStatus('hadir')">
            <span class="ms" style="font-size:16px;vertical-align:middle;color:#10b981;">done_all</span> Semua Hadir
          </button>
          <button class="btn btn-secondary btn-sm" onclick="setAllStatus('alpa')">
            <span class="ms" style="font-size:16px;vertical-align:middle;color:#ef4444;">close</span> Semua Alpa
          </button>
        </div>
      </div>
      <!-- Table -->
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="background:#1a0a02;">
              <th style="padding:12px 16px;text-align:left;color:#F0AF43;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;width:50px;">#</th>
              <th style="padding:12px 16px;text-align:left;color:#F0AF43;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Nama Peserta Didik</th>
              <th style="padding:12px 16px;text-align:center;color:#F0AF43;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;min-width:160px;">Status Kehadiran</th>
              <th style="padding:12px 16px;text-align:left;color:#F0AF43;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Perkembangan Materi</th>
              <th style="padding:12px 16px;text-align:left;color:#F0AF43;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Catatan Individu</th>
            </tr>
          </thead>
          <tbody id="absensi-tbody"></tbody>
        </table>
      </div>
    </div>
    <!-- Save button -->
    <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px;">
      <button class="btn btn-success" id="btn-simpan-absensi" style="padding:12px 28px;">
        <i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi
      </button>
    </div>
  </div>`

  // Events
  document.getElementById('btn-load-absensi').addEventListener('click', () => {
    const kelasId = parseInt(document.getElementById('absensi-kelas-select').value)
    if (!kelasId) { showToast('Pilih kelas terlebih dahulu.', 'info'); return }
    state.selectedKelas = state.kelasList.find(k=>k.id===kelasId)
    const santri = state.pesertaList.filter(p=>p.id_kelas===kelasId)
    if (santri.length === 0) { showToast('Tidak ada peserta didik di kelas ini.', 'info'); return }
    state.absensiRows = santri.map(p=>({ id_peserta:p.id, nama:p.nama_lengkap, status_hadir:'hadir', perkembangan_materi:'', catatan:''}))
    renderAbsensiTable(santri)
  })

  document.getElementById('btn-simpan-absensi')?.addEventListener('click', () => simpanAbsensi(showToast))

  window.setAllStatus = (status) => {
    state.absensiRows.forEach(r => r.status_hadir = status)
    document.querySelectorAll('.status-select').forEach(sel => { sel.value = status; updateRowStyle(sel) })
  }

  window.renderMentorView = (v) => renderView(v, showToast)
}

function renderAbsensiTable(santri) {
  const wrapper = document.getElementById('absensi-table-wrapper')
  const tbody   = document.getElementById('absensi-tbody')
  wrapper.style.display = 'block'
  document.getElementById('absensi-count-label').textContent = `${santri.length} peserta didik dalam kelas`

  tbody.innerHTML = state.absensiRows.map((row, i) => `
  <tr id="absensi-row-${i}" style="border-bottom:1px solid rgba(240,175,67,0.15);${i%2===1?'background:rgba(255,255,255,0.03);':''}">
    <td style="padding:10px 16px;color:#F0AF43;font-weight:700;">${i+1}</td>
    <td style="padding:10px 16px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;
          background:linear-gradient(135deg,#d97706,#F0AF43);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;color:#1a0a02;">${row.nama.charAt(0)}</div>
        <span style="font-weight:600;color:#ffffff;font-size:14px;letter-spacing:0.2px;">${row.nama}</span>
      </div>
    </td>
    <td style="padding:10px 16px;text-align:center;">
      <select class="status-select form-control-light" data-idx="${i}"
        style="width:130px;text-align:center;font-weight:600;"
        onchange="updateAbsensiStatus(this)">
        <option value="hadir"  ${row.status_hadir==='hadir' ?'selected':''} style="color:#059669;">✅ Hadir</option>
        <option value="izin"   ${row.status_hadir==='izin'  ?'selected':''} style="color:#d97706;">📝 Izin</option>
        <option value="sakit"  ${row.status_hadir==='sakit' ?'selected':''} style="color:#3b82f6;">🤒 Sakit</option>
        <option value="alpa"   ${row.status_hadir==='alpa'  ?'selected':''} style="color:#dc2626;">❌ Alpa</option>
      </select>
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light perkembangan-input" data-idx="${i}"
        value="${row.perkembangan_materi}"
        placeholder="Perkembangan materi peserta didik ini…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'perkembangan_materi')" />
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light catatan-input" data-idx="${i}"
        value="${row.catatan}"
        placeholder="Catatan khusus…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'catatan')" />
    </td>
  </tr>`).join('')

  window.updateAbsensiStatus = (sel) => {
    const i = parseInt(sel.dataset.idx)
    state.absensiRows[i].status_hadir = sel.value
    updateRowStyle(sel)
  }
  window.updateAbsensiField = (inp, field) => {
    const i = parseInt(inp.dataset.idx)
    state.absensiRows[i][field] = inp.value
  }
  window.updateRowStyle = (sel) => {
    const colors = { hadir:'rgba(16,185,129,0.08)', izin:'rgba(240,175,67,0.08)', sakit:'rgba(59,130,246,0.08)', alpa:'rgba(239,68,68,0.08)' }
    const i = parseInt(sel.dataset.idx)
    const row = document.getElementById('absensi-row-'+i)
    if (row) { row.style.background = colors[sel.value] || '' }
  }
}

async function simpanAbsensi(showToast) {
  const kelasId  = state.selectedKelas?.id
  const tanggal  = document.getElementById('absensi-tanggal')?.value
  const materi   = document.getElementById('absensi-materi')?.value?.trim()
  const catatan  = document.getElementById('absensi-catatan')?.value?.trim()

  if (!kelasId || !tanggal) { showToast('Pilih kelas dan tanggal.', 'info'); return }
  if (state.absensiRows.length === 0) { showToast('Muat daftar peserta didik terlebih dahulu.', 'info'); return }

  const btn = document.getElementById('btn-simpan-absensi')
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…'

  const records = state.absensiRows.map(r => ({
    id_peserta: r.id_peserta,
    id_mentor:  state.profile.id,
    id_kelas:   kelasId,
    tanggal,
    status_hadir:        r.status_hadir,
    materi_pembahasan:   materi || null,
    perkembangan_materi: r.perkembangan_materi || null,
    catatan_sesi:        (catatan ? catatan : null) || (r.catatan || null),
  }))

  try {
    await mentorService.bulkSimpanAbsensi(records)
    showToast(`Absensi ${records.length} peserta didik berhasil disimpan! ✅`, 'success')
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'
  } catch(e) {
    showToast('Gagal menyimpan: ' + e.message, 'error')
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'
  }
}

function renderSantriList(main, showToast) {
  const [search, setSearch] = (() => {
    let q = ''
    return [() => q, (v) => { q = v }]
  })()

  const filterBy = (q) => state.pesertaList.filter(p =>
    p.nama_lengkap.toLowerCase().includes(q.toLowerCase()))

  main.innerHTML = `
  <div class="page-header">
    <div>
      <div class="page-title">Daftar <span>Peserta Didik</span></div>
      <div class="page-breadcrumb">${state.pesertaList.length} peserta didik bimbingan Anda</div>
    </div>
    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass search-icon" style="color:var(--brown-400);"></i>
      <input type="text" id="santri-search" placeholder="Cari nama peserta didik…"
        class="form-control-light search-input" style="min-width:240px;" />
    </div>
  </div>

  <!-- Kelas filter tabs (bimbel only) -->
  ${isBimbel() && state.kelasList.length > 0 ? `
  <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
    <button class="btn btn-primary btn-sm active-kelas-tab" data-kelas-filter="all" onclick="filterByKelas('all',this)">Semua</button>
    ${state.kelasList.map(k=>`<button class="btn btn-ghost btn-sm" data-kelas-filter="${k.id}" onclick="filterByKelas('${k.id}',this)">${k.nama_kelas}</button>`).join('')}
    <button class="btn btn-ghost btn-sm" data-kelas-filter="privat" onclick="filterByKelas('privat',this)">Privat</button>
  </div>` : ''}

  <div id="santri-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>`

  window.currentKelasFilter = 'all'
  window.filterByKelas = (kelasId, btn) => {
    document.querySelectorAll('[data-kelas-filter]').forEach(b=>{ b.classList.remove('btn-primary'); b.classList.add('btn-ghost') })
    btn.classList.remove('btn-ghost'); btn.classList.add('btn-primary')
    window.currentKelasFilter = kelasId
    renderSantriGrid(filterSantri(document.getElementById('santri-search')?.value||'', kelasId), showToast)
  }
  window.openSantriDetail = (id) => openPesertaDetail(id, main, showToast)
  window.renderMentorView = (v) => renderView(v, showToast)

  document.getElementById('santri-search').addEventListener('input', e => {
    renderSantriGrid(filterSantri(e.target.value, window.currentKelasFilter||'all'), showToast)
  })

  renderSantriGrid(state.pesertaList, showToast)
}

function filterSantri(q, kelasFilter) {
  return state.pesertaList.filter(p => {
    const matchQ = !q || p.nama_lengkap.toLowerCase().includes(q.toLowerCase())
    if (kelasFilter === 'all') return matchQ
    if (kelasFilter === 'privat') return matchQ && p.jenis === 'privat'
    return matchQ && String(p.id_kelas) === String(kelasFilter)
  })
}

function renderSantriGrid(list, showToast) {
  const grid = document.getElementById('santri-grid')
  if (!grid) return
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1"><div class="empty-state">
      <div class="empty-state-icon">🔍</div><h3>Tidak ada peserta didik ditemukan</h3></div></div>`
    return
  }
  grid.innerHTML = list.map(p => `
  <div class="card" style="cursor:pointer;padding:18px 20px;"
    onclick="openSantriDetail(${p.id})"
    onmouseover="this.style.borderColor='rgba(240,175,67,0.5)'" onmouseout="this.style.borderColor='var(--border-dark)'">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:44px;height:44px;border-radius:50%;
        background:linear-gradient(135deg,var(--brown-600),var(--brown-300));
        display:flex;align-items:center;justify-content:center;
        font-size:18px;font-weight:700;color:#fdf0e2;flex-shrink:0;">${p.nama_lengkap.charAt(0)}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;color:var(--cream-100);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.nama_lengkap}</div>
        <div style="font-size:11.5px;color:var(--text-card-muted);">${p.kelas?.nama_kelas || jenisLabel(p.jenis)}</div>
      </div>
      <span class="${p.jenis==='bimbel'?'badge badge-gold':'badge badge-emerald'}">${p.jenis}</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="event.stopPropagation();openSantriDetail(${p.id})" class="btn btn-secondary btn-sm" style="flex:1;">
        <i class="fa-solid fa-eye"></i> Detail
      </button>
    </div>
  </div>`).join('')
}

function openPesertaDetail(pesertaId, main, showToast) {
  const p = state.pesertaList.find(x=>x.id===pesertaId)
  if (!p) return
  state.selectedPeserta = p

  main.innerHTML = `
  <div class="page-header">
    <div style="display:flex;align-items:center;gap:12px;">
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div>
        <div class="page-title">${p.nama_lengkap}</div>
        <div class="page-breadcrumb">${p.kelas?.nama_kelas || jenisLabel(p.jenis)}</div>
      </div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 340px;gap:20px;" id="detail-layout">
    <!-- Left: Forms -->
    <div style="display:flex;flex-direction:column;gap:16px;">

      <!-- Kemajuan Hafalan -->
      <div class="card">
        <h4 style="color:var(--cream-100);margin-bottom:16px;"><i class="fa-solid fa-book-quran" style="color:#F0AF43;"></i> Input Kemajuan Hafalan</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div class="form-group">
            <label class="form-label">Kitab / Surah</label>
            <input type="text" class="form-control" id="inp-kitab" placeholder="cth: Al-Baqarah, Jilid 2" />
          </div>
          <div class="form-group">
            <label class="form-label">Halaman / Ayat</label>
            <input type="text" class="form-control" id="inp-halaman" placeholder="cth: Ayat 1-10, Hal. 12" />
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div class="form-group">
            <label class="form-label">Status Kelancaran</label>
            <select class="form-control" id="inp-kelancaran">
              <option value="lancar">✅ Lancar</option>
              <option value="cukup">⚠️ Cukup</option>
              <option value="perlu_ulang">🔄 Perlu Diulang</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal</label>
            <input type="date" class="form-control" id="inp-tgl-kemajuan" value="${new Date().toISOString().slice(0,10)}" />
          </div>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Catatan Hafalan</label>
          <textarea class="form-control" id="inp-catatan-hafalan" rows="2" placeholder="Catatan perkembangan hafalan…"></textarea>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-save-kemajuan">
          <i class="fa-solid fa-floppy-disk"></i> Simpan Kemajuan
        </button>
      </div>

      <!-- Penilaian -->
      <div class="card">
        <h4 style="color:var(--cream-100);margin-bottom:16px;"><i class="fa-solid fa-star" style="color:#F0AF43;"></i> Input Penilaian</h4>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px;">
          <div class="form-group">
            <label class="form-label">Nilai Angka (0–100)</label>
            <input type="number" class="form-control" id="inp-nilai" min="0" max="100" placeholder="85" />
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal</label>
            <input type="date" class="form-control" id="inp-tgl-nilai" value="${new Date().toISOString().slice(0,10)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Adab (1–5)</label>
            <input type="number" class="form-control" id="inp-adab" min="1" max="5" placeholder="5" />
          </div>
          <div class="form-group">
            <label class="form-label">Tajwid (1–5)</label>
            <input type="number" class="form-control" id="inp-tajwid" min="1" max="5" placeholder="4" />
          </div>
          <div class="form-group">
            <label class="form-label">Kelancaran (1–5)</label>
            <input type="number" class="form-control" id="inp-kelancaran-nilai" min="1" max="5" placeholder="4" />
          </div>
        </div>
        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label">Catatan Penilaian</label>
          <textarea class="form-control" id="inp-catatan-nilai" rows="2" placeholder="Catatan nilai…"></textarea>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-save-nilai">
          <i class="fa-solid fa-floppy-disk"></i> Simpan Penilaian
        </button>
      </div>

      <!-- Catatan Mentor -->
      <div class="card">
        <h4 style="color:var(--cream-100);margin-bottom:14px;"><i class="fa-solid fa-comment-dots" style="color:#60a5fa;"></i> Catatan Mentor</h4>
        <div class="form-group" style="margin-bottom:14px;">
          <textarea class="form-control" id="inp-catatan" rows="3" placeholder="Catatan perkembangan, observasi, atau pesan untuk orang tua / wali…"></textarea>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-save-catatan">
          <i class="fa-solid fa-floppy-disk"></i> Simpan Catatan
        </button>
      </div>
    </div>

    <!-- Right: History -->
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="card" id="history-panel">
        <h4 style="color:var(--cream-100);margin-bottom:14px;"><i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Riwayat Peserta Didik</h4>
        <div style="font-size:13px;color:var(--text-card-muted);text-align:center;padding:20px 0;">
          Memuat riwayat…
        </div>
      </div>
    </div>
  </div>`

  window.renderMentorView = (v) => renderView(v, showToast)

  // Load history
  loadPesertaHistory(pesertaId, showToast)

  // Save kemajuan
  document.getElementById('btn-save-kemajuan').addEventListener('click', async () => {
    const data = {
      id_peserta: pesertaId,
      id_mentor:  state.profile.id,
      tanggal:    document.getElementById('inp-tgl-kemajuan').value,
      kitab_surat:  document.getElementById('inp-kitab').value.trim(),
      halaman_ayat: document.getElementById('inp-halaman').value.trim(),
      status_kelancaran: document.getElementById('inp-kelancaran').value,
      catatan_hafalan:   document.getElementById('inp-catatan-hafalan').value.trim(),
    }
    if (!data.kitab_surat) { showToast('Isi kitab/surah terlebih dahulu.', 'info'); return }
    try {
      await mentorService.addKemajuan(data)
      showToast('Kemajuan hafalan tersimpan! ✅', 'success')
      document.getElementById('inp-kitab').value = ''
      document.getElementById('inp-halaman').value = ''
      document.getElementById('inp-catatan-hafalan').value = ''
      loadPesertaHistory(pesertaId, showToast)
    } catch(e) { showToast('Gagal: ' + e.message, 'error') }
  })

  // Save penilaian
  document.getElementById('btn-save-nilai').addEventListener('click', async () => {
    const nilai = parseFloat(document.getElementById('inp-nilai').value)
    if (isNaN(nilai)) { showToast('Isi nilai angka.', 'info'); return }
    try {
      await mentorService.addPenilaian({
        id_peserta: pesertaId, id_mentor: state.profile.id,
        tanggal: document.getElementById('inp-tgl-nilai').value,
        nilai_angka: nilai,
        nilai_adab:  parseInt(document.getElementById('inp-adab').value)||null,
        nilai_tajwid:parseInt(document.getElementById('inp-tajwid').value)||null,
        nilai_kelancaran:parseInt(document.getElementById('inp-kelancaran-nilai').value)||null,
        catatan: document.getElementById('inp-catatan-nilai').value.trim(),
      })
      showToast('Penilaian tersimpan! ✅', 'success')
      document.getElementById('inp-nilai').value = ''
      loadPesertaHistory(pesertaId, showToast)
    } catch(e) { showToast('Gagal: ' + e.message, 'error') }
  })

  // Save catatan
  document.getElementById('btn-save-catatan').addEventListener('click', async () => {
    const isi = document.getElementById('inp-catatan').value.trim()
    if (!isi) { showToast('Tulis catatan terlebih dahulu.', 'info'); return }
    try {
      await mentorService.addCatatan({ id_peserta: pesertaId, id_mentor: state.profile.id, isi_catatan: isi })
      showToast('Catatan tersimpan! ✅', 'success')
      document.getElementById('inp-catatan').value = ''
      loadPesertaHistory(pesertaId, showToast)
    } catch(e) { showToast('Gagal: ' + e.message, 'error') }
  })
}

async function loadPesertaHistory(pesertaId, showToast) {
  const panel = document.getElementById('history-panel')
  if (!panel) return
  try {
    const [kemajuan, penilaian, catatan, kehadiran] = await Promise.all([
      mentorService.getKemajuan(pesertaId, 8),
      mentorService.getPenilaian(pesertaId, 8),
      mentorService.getCatatan(pesertaId),
      mentorService.getRiwayatKehadiran(pesertaId, 10),
    ])
    panel.innerHTML = `
    <h4 style="color:var(--cream-100);margin-bottom:14px;"><i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Riwayat Peserta Didik</h4>

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Hafalan Terakhir</div>
    ${kemajuan.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin-bottom:12px;">Belum ada catatan</p>':
      kemajuan.slice(0,4).map(k=>`
      <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;">
        <div style="font-size:12.5px;color:var(--cream-100);font-weight:600;">${k.kitab_surat} — ${k.halaman_ayat||''}</div>
        <div style="font-size:11px;color:var(--text-card-muted);margin-top:2px;">${formatDate(k.tanggal)} • ${kelancaran(k.status_kelancaran)}</div>
      </div>`).join('')}

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px;">Penilaian Terakhir</div>
    ${penilaian.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin-bottom:12px;">Belum ada penilaian</p>':
      penilaian.slice(0,4).map(n=>`
      <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;color:var(--cream-100);font-weight:700;">${n.nilai_angka}</div>
          <div style="font-size:11px;color:var(--text-card-muted);">${formatDate(n.tanggal)}</div>
        </div>
        <div style="font-size:11px;color:var(--text-card-muted);text-align:right;">
          Adab ${n.nilai_adab||'-'} • Tajwid ${n.nilai_tajwid||'-'} • Lancar ${n.nilai_kelancaran||'-'}
        </div>
      </div>`).join('')}

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px;">Riwayat Absensi</div>
    ${kehadiran.length===0?'<p style="font-size:12px;color:var(--text-card-muted);">Belum ada absensi</p>':
      kehadiran.slice(0,6).map(k=>`
      <div style="padding:7px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:5px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
          <span style="font-size:12px;font-weight:700;color:${khColor(k.status_hadir)};">${khIcon(k.status_hadir)} ${k.status_hadir}</span>
          <span style="font-size:11px;color:var(--text-card-muted);">${formatDate(k.tanggal)}</span>
        </div>
        ${k.materi_pembahasan?`<div style="font-size:11px;color:var(--text-card-muted);">📚 ${k.materi_pembahasan}</div>`:''}
        ${k.perkembangan_materi?`<div style="font-size:11px;color:var(--text-card-muted);font-style:italic;">${k.perkembangan_materi}</div>`:''}
      </div>`).join('')}`
  } catch(e) {
    if (panel) panel.innerHTML = `<p style="color:#e05c4b;font-size:13px;">Gagal memuat riwayat.</p>`
  }
}

function renderGantiPassword(main, showToast) {
  main.innerHTML = `
  <div class="page-header">
    <div class="page-title">Ganti <span>Password</span></div>
  </div>
  <div class="card" style="max-width:420px;">
    <div class="form-group" style="margin-bottom:14px;">
      <label class="form-label">Password Baru</label>
      <input type="password" class="form-control" id="inp-new-pw" placeholder="Minimal 8 karakter" />
    </div>
    <div class="form-group" style="margin-bottom:20px;">
      <label class="form-label">Konfirmasi Password Baru</label>
      <input type="password" class="form-control" id="inp-confirm-pw" placeholder="Ulangi password baru" />
    </div>
    <button class="btn btn-primary" id="btn-ganti-pw">
      <i class="fa-solid fa-lock"></i> Ganti Password
    </button>
  </div>`
  document.getElementById('btn-ganti-pw').addEventListener('click', async () => {
    const pw  = document.getElementById('inp-new-pw').value
    const pw2 = document.getElementById('inp-confirm-pw').value
    if (!pw || pw.length < 8) { showToast('Password minimal 8 karakter.', 'info'); return }
    if (pw !== pw2) { showToast('Konfirmasi password tidak cocok.', 'error'); return }
    try {
      await mentorService.updatePassword(pw)
      showToast('Password berhasil diubah! ✅', 'success')
      document.getElementById('inp-new-pw').value = ''
      document.getElementById('inp-confirm-pw').value = ''
    } catch(e) { showToast('Gagal: ' + e.message, 'error') }
  })
}

// ── Helpers ─────────────────────────────────────────────────
function jenisLabel(jenis) {
  return jenis === 'bimbel' ? 'Bimbel Kelompok' : jenis === 'privat' ? 'Privat' : jenis || '-'
}
function kelancaran(s) {
  return s === 'lancar' ? '<span class="ms" style="font-size:15px;color:#10b981;vertical-align:middle;">check_circle</span> Lancar' : s === 'cukup' ? '<span class="ms" style="font-size:15px;color:#F0AF43;vertical-align:middle;">help</span> Cukup' : '<span class="ms" style="font-size:15px;color:#ef4444;vertical-align:middle;">replay</span> Perlu Diulang'
}
function khColor(s) {
  return s==='hadir'?'#10b981':s==='izin'?'#F0AF43':s==='sakit'?'#60a5fa':'#e05c4b'
}
function khIcon(s) {
  return s==='hadir'?'<span class="ms" style="font-size:15px;color:#10b981;">check_circle</span>':s==='izin'?'<span class="ms" style="font-size:15px;color:#F0AF43;">description</span>':s==='sakit'?'<span class="ms" style="font-size:15px;color:#60a5fa;">sick</span>':'<span class="ms" style="font-size:15px;color:#ef4444;">cancel</span>'
}
function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})
}
