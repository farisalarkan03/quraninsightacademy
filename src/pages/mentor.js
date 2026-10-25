// ============================================================
// QIA — Portal Mentor (Absensi Massal Bimbel + Input Harian)
// src/pages/mentor.js
// ============================================================

import '@/styles/main.css'
import { authService, mentorService, waliService } from '@/lib/supabase.js'
import { printRaporPeserta } from '@/lib/export-utils.js'

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

      <div style="text-align:center;margin-top:20px;">
        <button onclick="window.navigate('/')" style="background:none;border:none;color:#c9a87a;font-size:13px;cursor:pointer;">
          <i class="fa-solid fa-arrow-left mr-1"></i> Kembali ke Beranda
        </button>
      </div>
      <div style="text-align:center;margin-top:14px;font-size:12.5px;color:#a07850;">
        Mengalami masalah saat login? Hubungi
        <a href="https://wa.me/62895422159690" target="_blank" rel="noopener noreferrer"
           style="color:#F0AF43;font-weight:600;text-decoration:none;">
          <i class="fa-brands fa-whatsapp" style="margin-right:3px;"></i>Administrator
        </a>
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

  <!-- Modal Portal Mentor (Tambah/Edit Laporan) -->
  <div class="modal-backdrop" id="mentor-modal">
    <div class="modal modal-lg" id="mentor-modal-inner" style="background:#221104;border:1px solid rgba(240,175,67,0.3);box-shadow:0 12px 40px rgba(0,0,0,0.85);">
      <div class="modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08);padding:16px 22px;">
        <span class="modal-title" id="mentor-modal-title" style="color:var(--cream-100);font-weight:700;font-size:1.1rem;"></span>
        <button class="modal-close" id="mentor-modal-close" style="color:var(--cream-100);background:none;border:none;font-size:18px;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body" id="mentor-modal-body" style="padding:22px;max-height:calc(85vh - 130px);overflow-y:auto;"></div>
      <div class="modal-footer" id="mentor-modal-footer" style="border-top:1px solid rgba(255,255,255,0.08);padding:14px 22px;display:flex;justify-content:flex-end;gap:10px;"></div>
    </div>
  </div>
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

  // Modal events
  document.getElementById('mentor-modal-close')?.addEventListener('click', () => {
    closeMentorModal()
  })
  document.getElementById('mentor-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'mentor-modal') {
      closeMentorModal()
    }
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
        <option value="hadir"  ${row.status_hadir==='hadir' ?'selected':''} style="color:#059669;">● Hadir</option>
        <option value="izin"   ${row.status_hadir==='izin'  ?'selected':''} style="color:#d97706;">◐ Izin</option>
        <option value="sakit"  ${row.status_hadir==='sakit' ?'selected':''} style="color:#3b82f6;">◑ Sakit</option>
        <option value="alpa"   ${row.status_hadir==='alpa'  ?'selected':''} style="color:#dc2626;">○ Alpa</option>
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
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return
  state.selectedPeserta = p

  main.innerHTML = `
  <div class="page-header" style="margin-bottom:20px;">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <button onclick="renderMentorView('santri-list')" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:6px;font-weight:700;">
        <i class="fa-solid fa-arrow-left"></i> Kembali ke Daftar
      </button>
      <div>
        <div class="page-title" style="font-size:1.5rem;font-weight:800;color:var(--brown-900);">Detail <span>Peserta Didik</span></div>
        <div class="page-breadcrumb" style="font-size:13px;color:var(--text-muted);font-weight:600;">${escapeHtml(p.nama_lengkap)} • ${escapeHtml(p.kelas?.nama_kelas || jenisLabel(p.jenis))}</div>
      </div>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:24px;max-width:980px;" id="detail-layout">
    <!-- Card Data Peserta Didik & Tombol Tambah Laporan di Atas -->
    <div class="card" style="padding:24px 26px;border:1.5px solid rgba(240,175,67,0.45);background:#180902;border-radius:16px;box-shadow:0 8px 32px rgba(26,10,2,0.35);">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-bottom:18px;border-bottom:1.5px solid rgba(240,175,67,0.25);">
        <!-- Data Siswa (Kiri) -->
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#81511D,#4F280C);border:2.5px solid #F0AF43;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#ffffff;flex-shrink:0;box-shadow:0 4px 16px rgba(240,175,67,0.4);">
            ${escapeHtml(p.nama_lengkap.charAt(0))}
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <h2 style="margin:0;font-size:1.35rem;color:#ffffff;font-weight:800;letter-spacing:0.3px;">${escapeHtml(p.nama_lengkap)}</h2>
              <span style="background:${p.jenis==='bimbel'?'#78350f':'#064e3b'};color:${p.jenis==='bimbel'?'#fde68a':'#a7f3d0'};border:1px solid ${p.jenis==='bimbel'?'#f59e0b':'#10b981'};padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;">${jenisLabel(p.jenis)}</span>
              <span style="background:${p.status==='aktif'?'#064e3b':'#450a0a'};color:${p.status==='aktif'?'#a7f3d0':'#fecaca'};border:1px solid ${p.status==='aktif'?'#10b981':'#ef4444'};padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;">${(p.status||'aktif').toUpperCase()}</span>
            </div>
            <div style="font-size:13px;color:#e8d4bc;margin-top:4px;font-weight:500;">
              ${p.usia ? p.usia + ' Tahun' : ''} ${p.jenis_kelamin ? '• ' + (p.jenis_kelamin==='L'?'Ikhwan (L)':'Akhwat (P)') : ''} • ID Santri: <strong style="color:#F0AF43;font-weight:800;">#${p.id}</strong>
            </div>
          </div>
        </div>

        <!-- Tombol Kanan: Tambah Laporan + PDF/WA Share -->
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="btn-tambah-laporan-top" onclick="window.openTambahLaporanModal(${pesertaId})" style="display:inline-flex;align-items:center;gap:8px;padding:11px 22px;font-weight:800;font-size:14px;background:linear-gradient(135deg,#F0AF43,#d97706);color:#1a0a02;border:none;border-radius:10px;box-shadow:0 4px 16px rgba(240,175,67,0.4);cursor:pointer;">
            <i class="fa-solid fa-plus-circle"></i> Tambah Laporan
          </button>
          <button id="btn-share-report" onclick="window.openShareModal(${pesertaId})" title="Kirim laporan ke Orang Tua" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;font-weight:800;font-size:14px;background:linear-gradient(135deg,#25D366,#128C7E);color:#ffffff;border:none;border-radius:10px;box-shadow:0 4px 16px rgba(37,211,102,0.35);cursor:pointer;">
            <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> PDF & Kirim WA
          </button>
        </div>
      </div>

      <!-- Detail Info Siswa (Grid) -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin-top:18px;">
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;">Kelas / Kelompok</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            <i class="fa-solid fa-chalkboard-user" style="color:#F0AF43;margin-right:6px;"></i> ${escapeHtml(p.kelas?.nama_kelas || jenisLabel(p.jenis))}
          </div>
        </div>
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;display:flex;align-items:center;justify-content:space-between;">
            <span>Orang Tua / Wali</span>
            <button onclick="window.openEditKontakWaliModal(${pesertaId})" style="background:none;border:none;color:#F0AF43;cursor:pointer;font-size:11px;font-weight:800;text-decoration:underline;padding:0;" title="Edit kontak wali">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          </div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            <i class="fa-solid fa-user-shield" style="color:#F0AF43;margin-right:6px;"></i> ${escapeHtml(p.nama_wali || 'Belum diisi')}
          </div>
        </div>
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;display:flex;align-items:center;justify-content:space-between;">
            <span>No. WhatsApp Wali</span>
            <button onclick="window.openEditKontakWaliModal(${pesertaId})" style="background:none;border:none;color:#F0AF43;cursor:pointer;font-size:11px;font-weight:800;text-decoration:underline;padding:0;" title="Input / Edit nomor WhatsApp wali">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          </div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            ${p.no_wa_wali ? `<a href="https://wa.me/${formatWaNumber(p.no_wa_wali)}" target="_blank" rel="noopener noreferrer" style="color:#4ade80;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"><i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> ${escapeHtml(p.no_wa_wali)}</a>` : '<span style="color:#fca5a5;font-size:12.5px;">⚠️ Belum diisi · <a href="javascript:void(0)" onclick="window.openEditKontakWaliModal(' + pesertaId + ')" style="color:#F0AF43;font-weight:800;">+ Input No. WA</a></span>'}
          </div>
        </div>
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;">Tanggal Terdaftar</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            <i class="fa-solid fa-calendar-check" style="color:#F0AF43;margin-right:6px;"></i> ${formatDate(p.tanggal_daftar)}
          </div>
        </div>
      </div>

      ${(p.alamat || p.catatan_umum || p.email_wali) ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:14px;margin-top:16px;padding-top:16px;border-top:1px dashed rgba(240,175,67,0.3);font-size:13.5px;">
          ${p.email_wali ? `<div><span style="color:#F0AF43;font-weight:700;">Email Wali:</span> <span style="color:#ffffff;font-weight:600;">${escapeHtml(p.email_wali)}</span></div>` : ''}
          ${p.alamat ? `<div><span style="color:#F0AF43;font-weight:700;">Alamat:</span> <span style="color:#ffffff;font-weight:600;">${escapeHtml(p.alamat)}</span></div>` : ''}
          ${p.catatan_umum ? `<div><span style="color:#F0AF43;font-weight:700;">Catatan Umum:</span> <span style="color:#ffffff;font-weight:600;">${escapeHtml(p.catatan_umum)}</span></div>` : ''}
        </div>
      ` : ''}
    </div>

    <!-- Histori Laporan yang di-input -->
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:12px;flex-wrap:wrap;">
        <h3 style="color:#1a0a02;margin:0;font-size:1.3rem;font-weight:800;display:flex;align-items:center;gap:10px;">
          <i class="fa-solid fa-clock-rotate-left" style="color:#d97706;"></i>
          Histori Laporan Sesi & Kehadiran
        </h3>
        <span id="histori-count-badge" style="background:#1a0a02;color:#fbbf24;font-size:12.5px;font-weight:800;padding:6px 16px;border-radius:20px;border:1.5px solid rgba(240,175,67,0.5);box-shadow:0 2px 8px rgba(0,0,0,0.18);">
          Memuat riwayat…
        </span>
      </div>

      <!-- Container Riwayat Laporan -->
      <div id="laporan-history-list">
        <div class="card" style="text-align:center;padding:40px;color:#d8bfa2;border:1.5px solid rgba(240,175,67,0.3);background:#180902;border-radius:14px;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
          <i class="fa-solid fa-spinner fa-spin fa-2x" style="color:#F0AF43;margin-bottom:12px;"></i>
          <p style="margin:0;font-size:14px;color:#ffffff;font-weight:600;">Memuat histori laporan peserta didik…</p>
        </div>
      </div>
    </div>
  </div>`

  window.renderMentorView = (v) => renderView(v, showToast)

  // Load history data
  loadPesertaHistory(pesertaId, showToast)
}

async function loadPesertaHistory(pesertaId, showToast) {
  const container = document.getElementById('laporan-history-list')
  if (!container) return

  try {
    const [kehadiranList, kemajuanList, penilaianList] = await Promise.all([
      mentorService.getRiwayatKehadiran(pesertaId, 50),
      mentorService.getKemajuan(pesertaId, 50),
      mentorService.getPenilaian(pesertaId, 50),
    ])

    // Update count badge
    const badge = document.getElementById('histori-count-badge')
    if (badge) badge.textContent = `${kehadiranList.length} Laporan Tercatat`

    // Map kemajuan & penilaian by date
    const kemajuanByDate = {}
    kemajuanList.forEach(k => {
      if (k.tanggal && !kemajuanByDate[k.tanggal]) kemajuanByDate[k.tanggal] = k
    })
    const penilaianByDate = {}
    penilaianList.forEach(p => {
      if (p.tanggal && !penilaianByDate[p.tanggal]) penilaianByDate[p.tanggal] = p
    })

    // Store in global window for modal edit access
    window._currentPesertaHistory = {
      pesertaId,
      kehadiranList,
      kemajuanList,
      penilaianList,
      kemajuanByDate,
      penilaianByDate
    }

    if (kehadiranList.length === 0) {
      container.innerHTML = `
      <div class="card" style="text-align:center;padding:48px 24px;background:#180902;border:1.5px dashed rgba(240,175,67,0.5);border-radius:14px;box-shadow:0 6px 24px rgba(26,10,2,0.25);">
        <div style="font-size:44px;margin-bottom:12px;">📋</div>
        <h4 style="color:#ffffff;margin:0 0 8px;font-size:18px;font-weight:800;">Belum Ada Histori Laporan</h4>
        <p style="font-size:14px;color:#e8d4bc;margin:0 auto 20px;max-width:440px;line-height:1.6;font-weight:500;">
          Belum ada data kehadiran atau laporan sesi yang dicatat untuk peserta didik ini. Klik tombol di bawah untuk menambah laporan baru.
        </p>
        <button class="btn btn-primary" onclick="window.openTambahLaporanModal(${pesertaId})" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;font-weight:800;background:linear-gradient(135deg,#F0AF43,#d97706);color:#1a0a02;border:none;border-radius:9px;box-shadow:0 4px 16px rgba(240,175,67,0.4);cursor:pointer;">
          <i class="fa-solid fa-plus-circle"></i> Tambah Laporan Sekarang
        </button>
      </div>`
      return
    }

    container.innerHTML = kehadiranList.map(rep => {
      const status = rep.status_hadir || 'hadir'

      return `
      <div class="card report-history-card" style="
        padding: 18px 22px;
        margin-bottom: 12px;
        background: #180902;
        border: 1.5px solid rgba(240,175,67,0.45);
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(26,10,2,0.25);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
        transition: all 0.2s ease;
      ">
        <!-- Judul Laporan + Status Badge + Tanggal Sesi -->
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <div style="width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#4f280c,#2b1406);border:1.5px solid #F0AF43;display:flex;align-items:center;justify-content:center;color:#F0AF43;font-size:19px;flex-shrink:0;box-shadow:0 4px 12px rgba(240,175,67,0.3);">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div>
            <div style="font-weight:800;font-size:16px;color:#ffffff;display:flex;align-items:center;gap:10px;flex-wrap:wrap;letter-spacing:0.2px;">
              <span>Laporan ${formatTanggalLaporan(rep.tanggal)}</span>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:800;${khBadgeStyle(status)}">
                ${khIcon(status)} ${status.toUpperCase()}
              </span>
            </div>
            <div style="font-size:13px;color:#e8d4bc;margin-top:4px;font-weight:600;">
              <i class="fa-regular fa-clock" style="color:#F0AF43;margin-right:5px;"></i> Tanggal Sesi: <strong style="color:#ffffff;font-weight:800;">${formatDate(rep.tanggal)}</strong>
            </div>
          </div>
        </div>

        <!-- Tombol Edit di Samping Laporan -->
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="btn btn-sm" onclick="window.openEditLaporanModal(${rep.id}, ${pesertaId})" style="
            background: linear-gradient(135deg, #F0AF43, #d97706);
            color: #1a0a02;
            font-weight: 800;
            font-size: 13.5px;
            padding: 9px 20px;
            border-radius: 9px;
            border: none;
            box-shadow: 0 4px 14px rgba(240,175,67,0.45);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 7px;
          ">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn btn-sm" onclick="window.deleteLaporan(${rep.id}, ${pesertaId})" title="Hapus laporan ini" style="
            background: #450a0a;
            color: #fecaca;
            border: 1.5px solid #ef4444;
            border-radius: 9px;
            padding: 9px 14px;
            cursor: pointer;
            font-weight: 700;
          ">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>`
    }).join('')

  } catch (err) {
    container.innerHTML = `<div class="card" style="padding:22px;color:#991b1b;background:#fee2e2;border:1.5px solid #ef4444;border-radius:12px;font-size:14px;font-weight:700;">Gagal memuat histori laporan: ${err.message}</div>`
  }
}

// ── HELPER FORMAT WA ──────────────────────────────────────
function formatWaNumber(phone) {
  if (!phone) return ''
  let cleaned = String(phone).replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned
  }
  return cleaned
}

// ── PDF & WHATSAPP SHARE ──────────────────────────────────
window.openShareModal = (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return

  const bodyHtml = `
  <div style="display:flex;flex-direction:column;gap:16px;">
    <!-- Info Santri Singkat -->
    <div style="background:#251105;border:1.5px solid rgba(240,175,67,0.3);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;">
      <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#81511D,#4F280C);border:1.5px solid #F0AF43;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#ffffff;flex-shrink:0;">${escapeHtml(p.nama_lengkap.charAt(0))}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:800;color:#ffffff;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(p.nama_lengkap)}</div>
        <div style="color:#e8d4bc;font-size:13px;margin-top:2px;">${escapeHtml(p.kelas?.nama_kelas || jenisLabel(p.jenis))} · Wali: ${escapeHtml(p.nama_wali || 'Belum diisi')}</div>
      </div>
    </div>

    <!-- Input / Edit No. WA Wali Langsung di Modal -->
    <div style="background:#200d03;border:1.5px solid rgba(240,175,67,0.35);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <label for="share-wa-input" style="font-size:12px;color:#F0AF43;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:6px;">
          <i class="fa-brands fa-whatsapp" style="font-size:16px;color:#25D366;"></i> Nomor WhatsApp Wali Santri:
        </label>
        <span id="share-wa-inline-status" style="font-size:11.5px;color:#4ade80;font-weight:700;"></span>
      </div>
      <div style="display:flex;gap:8px;">
        <input type="tel" id="share-wa-input" value="${escapeHtml(p.no_wa_wali || '')}" placeholder="Contoh: 08123456789 atau 628..." style="flex:1;padding:10px 14px;border:1.5px solid rgba(240,175,67,0.4);border-radius:8px;background:#180902;color:#ffffff;font-size:14px;font-weight:700;outline:none;" />
        <button type="button" onclick="window.saveWaInline(${pesertaId})" style="padding:10px 16px;background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;border:none;border-radius:8px;font-weight:800;font-size:12.5px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:6px;">
          <i class="fa-solid fa-floppy-disk"></i> Simpan
        </button>
      </div>
      <div style="font-size:11.5px;color:#d8bfa2;line-height:1.4;">
        💡 <em>Anda dapat langsung mengisi / mengubah nomor di atas. Pesan laporan WhatsApp akan langsung ditujukan ke nomor ini.</em>
      </div>
    </div>

    <p style="font-size:13.5px;color:#e8d4bc;margin:0;line-height:1.6;">Pilih opsi laporan yang ingin dibagikan:</p>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <button onclick="window.generatePesertaReport(${pesertaId})" style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:#251105;border:1.5px solid rgba(240,175,67,0.4);border-radius:12px;cursor:pointer;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='#F0AF43'" onmouseout="this.style.borderColor='rgba(240,175,67,0.4)'">
        <div style="width:42px;height:42px;background:linear-gradient(135deg,#b91c1c,#ef4444);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fa-solid fa-file-pdf" style="color:#ffffff;font-size:18px;"></i>
        </div>
        <div>
          <div style="color:#ffffff;font-weight:800;font-size:14px;">Cetak / Simpan sebagai PDF</div>
          <div style="color:#d8bfa2;font-size:12px;margin-top:2px;">Buka dialog cetak rapor resmi untuk disimpan sebagai file PDF</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:#F0AF43;margin-left:auto;"></i>
      </button>

      <button onclick="window.shareToWhatsApp(${pesertaId})" style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:#251105;border:1.5px solid rgba(37,211,102,0.4);border-radius:12px;cursor:pointer;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='#25D366'" onmouseout="this.style.borderColor='rgba(37,211,102,0.4)'">
        <div style="width:42px;height:42px;background:linear-gradient(135deg,#128C7E,#25D366);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fa-brands fa-whatsapp" style="color:#ffffff;font-size:20px;"></i>
        </div>
        <div>
          <div style="color:#ffffff;font-weight:800;font-size:14px;">Kirim Link Rapor ke WhatsApp Wali</div>
          <div style="color:#d8bfa2;font-size:12px;margin-top:2px;">Kirim chat WA berisi ringkasan & link khusus rapor anak</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:#25D366;margin-left:auto;"></i>
      </button>
    </div>
  </div>`

  const footerHtml = `<button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Tutup</button>`
  showMentorModal(`<i class="fa-solid fa-share-nodes" style="color:#F0AF43;margin-right:8px;"></i> Bagikan Laporan — ${escapeHtml(p.nama_lengkap)}`, bodyHtml, footerHtml)
}

window.saveWaInline = async (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return

  const inputEl = document.getElementById('share-wa-input')
  const noWaWali = inputEl ? inputEl.value.trim() : ''
  if (!noWaWali) {
    alert('Mohon ketikkan nomor WhatsApp terlebih dahulu.')
    if (inputEl) inputEl.focus()
    return
  }

  p.no_wa_wali = noWaWali
  if (state.selectedPeserta && state.selectedPeserta.id === pesertaId) {
    state.selectedPeserta.no_wa_wali = noWaWali
  }

  const statusEl = document.getElementById('share-wa-inline-status')
  if (statusEl) statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…'

  try {
    await mentorService.updatePeserta(pesertaId, { no_wa_wali: noWaWali })
    if (statusEl) statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Tersimpan!'
    showToast('Nomor WhatsApp wali santri berhasil disimpan!', 'success')
  } catch (err) {
    console.error(err)
    if (statusEl) statusEl.innerHTML = '<span style="color:#fca5a5;">Gagal simpan</span>'
  }
}

window.openEditKontakWaliModal = (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return

  const bodyHtml = `
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div>
      <label style="display:block;font-size:12px;color:#F0AF43;font-weight:800;margin-bottom:6px;text-transform:uppercase;">Nama Orang Tua / Wali:</label>
      <input type="text" id="edit-kontak-nama" value="${escapeHtml(p.nama_wali || '')}" placeholder="Contoh: Bapak Ahmad / Ibu Fatimah" style="width:100%;padding:10px 14px;border:1.5px solid rgba(240,175,67,0.4);border-radius:8px;background:#180902;color:#ffffff;font-size:14px;font-weight:600;box-sizing:border-box;" />
    </div>
    <div>
      <label style="display:block;font-size:12px;color:#F0AF43;font-weight:800;margin-bottom:6px;text-transform:uppercase;">No. WhatsApp Wali:</label>
      <input type="tel" id="edit-kontak-wa" value="${escapeHtml(p.no_wa_wali || '')}" placeholder="Contoh: 08123456789 atau 628..." style="width:100%;padding:10px 14px;border:1.5px solid rgba(240,175,67,0.4);border-radius:8px;background:#180902;color:#ffffff;font-size:14px;font-weight:700;box-sizing:border-box;" />
      <div style="font-size:11.5px;color:#d8bfa2;margin-top:5px;">
        Nomor ini akan digunakan sebagai tujuan kirim link laporan & PDF rapor ananda.
      </div>
    </div>
  </div>`

  const footerHtml = `
    <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
    <button class="btn btn-primary" onclick="window.saveKontakWali(${pesertaId})" style="padding:10px 20px;font-weight:800;background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;border:none;border-radius:8px;cursor:pointer;">
      <i class="fa-solid fa-floppy-disk"></i> Simpan Kontak
    </button>`

  showMentorModal('<i class="fa-solid fa-address-book" style="color:#F0AF43;margin-right:8px;"></i> Edit Kontak Wali Santri', bodyHtml, footerHtml)
}

window.saveKontakWali = async (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return

  const namaWali = (document.getElementById('edit-kontak-nama')?.value || '').trim()
  const noWaWali = (document.getElementById('edit-kontak-wa')?.value || '').trim()

  p.nama_wali = namaWali
  p.no_wa_wali = noWaWali
  if (state.selectedPeserta && state.selectedPeserta.id === pesertaId) {
    state.selectedPeserta.nama_wali = namaWali
    state.selectedPeserta.no_wa_wali = noWaWali
  }

  try {
    await mentorService.updatePeserta(pesertaId, { nama_wali: namaWali, no_wa_wali: noWaWali })
  } catch (e) {
    console.error('Error saving kontak wali:', e)
  }

  closeMentorModal()
  showToast('Kontak wali santri berhasil diperbarui!', 'success')

  const main = document.getElementById('mentor-main-content')
  if (main) openPesertaDetail(pesertaId, main, showToast)
}

window.generatePesertaReport = (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  const hist = window._currentPesertaHistory
  if (!p) return
  closeMentorModal()

  const kehadiranList = (hist?.pesertaId === pesertaId && hist.kehadiranList) ? hist.kehadiranList : []
  // Ambil data kemajuan & penilaian yang sudah ter-filter 1 entri per tanggal (data fix dari mentor)
  const kemajuanList = (hist?.pesertaId === pesertaId && hist.kemajuanByDate)
    ? Object.values(hist.kemajuanByDate)
    : ((hist?.pesertaId === pesertaId && hist.kemajuanList) ? hist.kemajuanList : [])
  const penilaianList = (hist?.pesertaId === pesertaId && hist.penilaianByDate)
    ? Object.values(hist.penilaianByDate)
    : ((hist?.pesertaId === pesertaId && hist.penilaianList) ? hist.penilaianList : [])

  const hadirCount = kehadiranList.filter(r => r.status_hadir === 'hadir').length
  const izinCount  = kehadiranList.filter(r => r.status_hadir === 'izin').length
  const sakitCount = kehadiranList.filter(r => r.status_hadir === 'sakit').length
  const alpaCount  = kehadiranList.filter(r => r.status_hadir === 'alpa' || (!['hadir','izin','sakit'].includes(r.status_hadir) && r.status_hadir)).length

  const pesertaData = {
    peserta: p,
    mentor: { nama: state.profile?.nama_lengkap || state.profile?.nama || 'Mentor QIA' },
    kelas: p.kelas || { nama_kelas: p.jenis === 'privat' ? 'Program Privat' : jenisLabel(p.jenis) },
    kemajuan: kemajuanList,
    penilaian: penilaianList,
    kehadiran_summary: {
      hadir: hadirCount,
      izin: izinCount,
      sakit: sakitCount,
      alpa: alpaCount,
      total: kehadiranList.length
    },
    riwayat_kehadiran: kehadiranList,
    catatan_mentor: []
  }

  printRaporPeserta(pesertaData)
}

window.shareToWhatsApp = (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  const hist = window._currentPesertaHistory
  if (!p) return

  // Periksa apakah ada input nomor WA dari modal share
  const inputEl = document.getElementById('share-wa-input')
  const typedWa = inputEl ? inputEl.value.trim() : (p.no_wa_wali || '')
  if (!typedWa) {
    alert('Mohon masukkan nomor WhatsApp wali terlebih dahulu pada kolom yang disediakan.')
    if (inputEl) inputEl.focus()
    return
  }

  // Jika nomor baru / berbeda, simpan otomatis
  if (typedWa !== p.no_wa_wali) {
    p.no_wa_wali = typedWa
    if (state.selectedPeserta && state.selectedPeserta.id === pesertaId) {
      state.selectedPeserta.no_wa_wali = typedWa
    }
    mentorService.updatePeserta(pesertaId, { no_wa_wali: typedWa }).catch(console.error)
  }

  closeMentorModal()

  // Link khusus laporan peserta didik (langsung mengarah ke data santri bersangkutan)
  const laporanUrl = `${window.location.origin}/wali?id=${pesertaId}`

  const msg = `Assalamu'alaikum Wr. Wb.

Kepada Yth. Bapak/Ibu *${p.nama_wali || 'Orang Tua / Wali'}*,

Berikut kami sampaikan bahwa laporan perkembangan belajar ananda *${p.nama_lengkap}* di Quran Insight Academy dapat diakses melalui tautan resmi di bawah ini:

👉 ${laporanUrl}

Melalui tautan tersebut, Bapak/Ibu dapat melihat catatan kehadiran, capaian materi & hafalan, evaluasi mentor, serta mengunduh dokumen PDF rapor resmi ananda.

Jazakumullah Khairan Katsiran atas perhatian dan kerjasamanya.

Wassalamu'alaikum Wr. Wb.
_Quran Insight Academy_`

  const waNum = formatWaNumber(typedWa)
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`
  window.open(waUrl, '_blank')
}

// ── MODAL: TAMBAH LAPORAN ──────────────────────────────────
window.openTambahLaporanModal = (pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return

  const today = new Date().toISOString().slice(0, 10)

  const bodyHtml = `
  <div style="display:flex;flex-direction:column;gap:18px;">
    <!-- Bagian 1: Kehadiran & Tanggal -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-calendar-check"></i> 1. Kehadiran & Materi Sesi
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tanggal Sesi</label>
          <input type="date" class="form-control" id="modal-inp-tgl-sesi" value="${today}" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Status Kehadiran</label>
          <select class="form-control" id="modal-inp-status-hadir">
            <option value="hadir" selected>● Hadir</option>
            <option value="izin">◐ Izin</option>
            <option value="sakit">◑ Sakit</option>
            <option value="alpa">○ Alpa</option>
          </select>
        </div>
        <div class="form-group" style="grid-column:1/-1;">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Materi Pembahasan</label>
          <input type="text" class="form-control" id="modal-inp-materi" placeholder="cth: Tajwid Mad Thobi'i, Makhorijul Huruf, Iqro 3" />
        </div>
      </div>
    </div>

    <!-- Bagian 2: Kemajuan Hafalan (Opsional) -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-book-quran"></i> 2. Kemajuan Hafalan / Tahsin (Opsional)
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Kitab / Surah</label>
          <input type="text" class="form-control" id="modal-inp-kitab" placeholder="cth: An-Naba, Al-Baqarah, Jilid 2" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Halaman / Ayat</label>
          <input type="text" class="form-control" id="modal-inp-halaman" placeholder="cth: Ayat 1-10, Hal. 12" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Status Kelancaran</label>
          <select class="form-control" id="modal-inp-kelancaran">
            <option value="lancar" selected>● Lancar</option>
            <option value="cukup">◐ Cukup</option>
            <option value="perlu_ulang">○ Perlu Diulang</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bagian 3: Penilaian Sesi (Opsional) -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-star"></i> 3. Penilaian Sesi (Opsional)
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Nilai Angka (0–100)</label>
          <input type="number" class="form-control" id="modal-inp-nilai" min="0" max="100" placeholder="85" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Adab (1–5)</label>
          <input type="number" class="form-control" id="modal-inp-adab" min="1" max="5" placeholder="5" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tajwid (1–5)</label>
          <input type="number" class="form-control" id="modal-inp-tajwid" min="1" max="5" placeholder="4" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Kelancaran (1–5)</label>
          <input type="number" class="form-control" id="modal-inp-kelancaran-nilai" min="1" max="5" placeholder="4" />
        </div>
      </div>
    </div>

    <!-- Bagian 4: Catatan Sesi -->
    <div style="padding:16px;background:#2b1506;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 10px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-comment-dots"></i> Catatan Sesi / Perkembangan
      </h4>
      <div class="form-group" style="margin:0;">
        <textarea class="form-control" id="modal-inp-catatan" rows="3" placeholder="Tuliskan catatan perkembangan hafalan, penilaian, keaktifan santri, atau pesan untuk orang tua…"></textarea>
      </div>
    </div>
  </div>`

  const footerHtml = `
    <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
    <button class="btn btn-primary" id="btn-modal-submit-tambah" style="min-width:160px;font-weight:800;">
      <i class="fa-solid fa-floppy-disk"></i> Simpan Laporan
    </button>
  `

  showMentorModal(`<i class="fa-solid fa-plus-circle" style="color:#F0AF43;margin-right:8px;"></i> Tambah Laporan Sesi — ${escapeHtml(p.nama_lengkap)}`, bodyHtml, footerHtml)

  document.getElementById('btn-modal-submit-tambah').addEventListener('click', async () => {
    const btn = document.getElementById('btn-modal-submit-tambah')
    const tglSesi     = document.getElementById('modal-inp-tgl-sesi').value || today
    const statusHadir = document.getElementById('modal-inp-status-hadir').value
    const materi      = document.getElementById('modal-inp-materi').value.trim()
    const kitab       = document.getElementById('modal-inp-kitab').value.trim()
    const halaman     = document.getElementById('modal-inp-halaman').value.trim()
    const kelancaranV = document.getElementById('modal-inp-kelancaran').value
    const nilaiStr    = document.getElementById('modal-inp-nilai').value
    const adab        = parseInt(document.getElementById('modal-inp-adab').value) || null
    const tajwid      = parseInt(document.getElementById('modal-inp-tajwid').value) || null
    const kelancaranN = parseInt(document.getElementById('modal-inp-kelancaran-nilai').value) || null
    const catatan     = document.getElementById('modal-inp-catatan').value.trim()

    btn.disabled = true
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…'

    try {
      // 1. Simpan Kehadiran
      await mentorService.addKehadiran({
        id_peserta: pesertaId,
        id_mentor: state.profile.id,
        id_kelas: p.id_kelas || null,
        tanggal: tglSesi,
        status_hadir: statusHadir,
        materi_pembahasan: materi || null,
        perkembangan_materi: catatan || null,
        catatan_sesi: catatan || null,
      })

      // Bersihkan data kemajuan & penilaian lama/duplikat di tanggal ini agar tidak ganda
      await mentorService.deleteKemajuanByPesertaTanggal(pesertaId, tglSesi)
      await mentorService.deletePenilaianByPesertaTanggal(pesertaId, tglSesi)

      // 2. Simpan Kemajuan jika diisi
      if (kitab) {
        await mentorService.addKemajuan({
          id_peserta: pesertaId,
          id_mentor: state.profile.id,
          tanggal: tglSesi,
          kitab_surat: kitab,
          halaman_ayat: halaman || null,
          status_kelancaran: kelancaranV,
          catatan_hafalan: catatan || null,
        })
      }

      // 3. Simpan Penilaian jika diisi
      if (nilaiStr) {
        const nilai = parseFloat(nilaiStr)
        if (!isNaN(nilai)) {
          await mentorService.addPenilaian({
            id_peserta: pesertaId,
            id_mentor: state.profile.id,
            tanggal: tglSesi,
            nilai_angka: nilai,
            nilai_adab: adab,
            nilai_tajwid: tajwid,
            nilai_kelancaran: kelancaranN,
            catatan: catatan || null,
          })
        }
      }

      closeMentorModal()
      showToast('Laporan sesi berhasil disimpan! ✅', 'success')
      loadPesertaHistory(pesertaId, showToast)
    } catch (err) {
      btn.disabled = false
      btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Laporan'
      showToast('Gagal simpan laporan: ' + err.message, 'error')
    }
  })
}

// ── MODAL: EDIT LAPORAN (EDIT KEHADIRAN & SESI) ─────────────
window.openEditLaporanModal = (kehadiranId, pesertaId) => {
  const p = state.pesertaList.find(x => x.id === pesertaId)
  if (!p) return

  const history = window._currentPesertaHistory
  const rep = history?.kehadiranList?.find(k => Number(k.id) === Number(kehadiranId))
  if (!rep) {
    showToast('Data laporan tidak ditemukan.', 'error')
    return
  }

  const km = history?.kemajuanByDate ? history.kemajuanByDate[rep.tanggal] : null
  const pn = history?.penilaianByDate ? history.penilaianByDate[rep.tanggal] : null

  const bodyHtml = `
  <div style="display:flex;flex-direction:column;gap:18px;">
    <div style="padding:12px 16px;background:#2d1708;border-radius:10px;border-left:4px solid #F0AF43;font-size:13.5px;color:#ffffff;line-height:1.5;">
      Mengedit data kehadiran dan materi sesi untuk peserta <strong style="color:#F0AF43;">${escapeHtml(p.nama_lengkap)}</strong>.
    </div>

    <!-- Bagian 1: Kehadiran & Tanggal -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-calendar-check"></i> 1. Kehadiran & Materi Sesi
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tanggal Sesi</label>
          <input type="date" class="form-control" id="modal-edit-tgl" value="${rep.tanggal}" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Status Kehadiran</label>
          <select class="form-control" id="modal-edit-status">
            <option value="hadir" ${rep.status_hadir==='hadir'?'selected':''}>● Hadir</option>
            <option value="izin" ${rep.status_hadir==='izin'?'selected':''}>◐ Izin</option>
            <option value="sakit" ${rep.status_hadir==='sakit'?'selected':''}>◑ Sakit</option>
            <option value="alpa" ${rep.status_hadir==='alpa'?'selected':''}>○ Alpa</option>
          </select>
        </div>
        <div class="form-group" style="grid-column:1/-1;">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Materi Pembahasan</label>
          <input type="text" class="form-control" id="modal-edit-materi" value="${escapeHtml(rep.materi_pembahasan||'')}" placeholder="cth: Tajwid Mad Thobi'i, Makhorijul Huruf" />
        </div>
      </div>
    </div>

    <!-- Bagian 2: Kemajuan Hafalan -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-book-quran"></i> 2. Kemajuan Hafalan / Tahsin
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Kitab / Surah</label>
          <input type="text" class="form-control" id="modal-edit-kitab" value="${escapeHtml(km?.kitab_surat||'')}" placeholder="cth: An-Naba, Al-Baqarah" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Halaman / Ayat</label>
          <input type="text" class="form-control" id="modal-edit-halaman" value="${escapeHtml(km?.halaman_ayat||'')}" placeholder="cth: Ayat 1-10, Hal. 12" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Status Kelancaran</label>
          <select class="form-control" id="modal-edit-kelancaran">
            <option value="lancar" ${km?.status_kelancaran==='lancar'?'selected':''}>● Lancar</option>
            <option value="cukup" ${km?.status_kelancaran==='cukup'?'selected':''}>◐ Cukup</option>
            <option value="perlu_ulang" ${km?.status_kelancaran==='perlu_ulang'?'selected':''}>○ Perlu Diulang</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bagian 3: Penilaian Sesi -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-star"></i> 3. Penilaian Sesi
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Nilai Angka (0–100)</label>
          <input type="number" class="form-control" id="modal-edit-nilai" min="0" max="100" value="${pn?.nilai_angka ?? ''}" placeholder="85" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Adab (1–5)</label>
          <input type="number" class="form-control" id="modal-edit-adab" min="1" max="5" value="${pn?.nilai_adab ?? ''}" placeholder="5" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tajwid (1–5)</label>
          <input type="number" class="form-control" id="modal-edit-tajwid" min="1" max="5" value="${pn?.nilai_tajwid ?? ''}" placeholder="4" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Kelancaran (1–5)</label>
          <input type="number" class="form-control" id="modal-edit-kelancaran-nilai" min="1" max="5" value="${pn?.nilai_kelancaran ?? ''}" placeholder="4" />
        </div>
      </div>
    </div>

    <!-- Bagian 4: Catatan Sesi -->
    <div style="padding:16px;background:#2b1506;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 10px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-comment-dots"></i> Catatan Sesi / Perkembangan
      </h4>
      <div class="form-group" style="margin:0;">
        <textarea class="form-control" id="modal-edit-catatan" rows="3" placeholder="Tuliskan catatan perkembangan hafalan, penilaian, keaktifan santri…">${escapeHtml(rep.catatan_sesi || rep.perkembangan_materi || km?.catatan_hafalan || pn?.catatan || '')}</textarea>
      </div>
    </div>
  </div>`

  const footerHtml = `
    <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
    <button class="btn btn-primary" id="btn-modal-submit-edit" style="min-width:170px;font-weight:800;">
      <i class="fa-solid fa-check"></i> Simpan Perubahan
    </button>
  `

  showMentorModal(`<i class="fa-solid fa-pen-to-square" style="color:#F0AF43;margin-right:8px;"></i> Edit Laporan — ${formatTanggalLaporan(rep.tanggal)}`, bodyHtml, footerHtml)

  document.getElementById('btn-modal-submit-edit').addEventListener('click', async () => {
    const btn = document.getElementById('btn-modal-submit-edit')
    const tglSesi     = document.getElementById('modal-edit-tgl').value || rep.tanggal
    const statusHadir = document.getElementById('modal-edit-status').value
    const materi      = document.getElementById('modal-edit-materi').value.trim()
    const kitab       = document.getElementById('modal-edit-kitab').value.trim()
    const halaman     = document.getElementById('modal-edit-halaman').value.trim()
    const kelancaranV = document.getElementById('modal-edit-kelancaran').value
    const nilaiStr    = document.getElementById('modal-edit-nilai').value
    const adab        = parseInt(document.getElementById('modal-edit-adab').value) || null
    const tajwid      = parseInt(document.getElementById('modal-edit-tajwid').value) || null
    const kelancaranN = parseInt(document.getElementById('modal-edit-kelancaran-nilai').value) || null
    const catatan     = document.getElementById('modal-edit-catatan').value.trim()

    const tanggalBerubah = tglSesi !== rep.tanggal
    const tanggalLama = rep.tanggal

    btn.disabled = true
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…'

    try {
      // 1. Update Kehadiran
      await mentorService.updateKehadiran(rep.id, {
        tanggal: tglSesi,
        status_hadir: statusHadir,
        materi_pembahasan: materi || null,
        perkembangan_materi: catatan || null,
        catatan_sesi: catatan || null,
      })

      // 2. Handle Kemajuan
      if (tanggalBerubah) {
        await mentorService.deleteKemajuanByPesertaTanggal(pesertaId, tanggalLama)
      }
      // Hapus data kemajuan lama/duplikat di tglSesi agar hanya ada 1 data fix dari mentor
      await mentorService.deleteKemajuanByPesertaTanggal(pesertaId, tglSesi)
      if (kitab) {
        await mentorService.addKemajuan({
          id_peserta: pesertaId,
          id_mentor: state.profile.id,
          tanggal: tglSesi,
          kitab_surat: kitab,
          halaman_ayat: halaman || null,
          status_kelancaran: kelancaranV,
          catatan_hafalan: catatan || null,
        })
      }

      // 3. Handle Penilaian
      if (tanggalBerubah) {
        await mentorService.deletePenilaianByPesertaTanggal(pesertaId, tanggalLama)
      }
      // Hapus data penilaian lama/duplikat di tglSesi agar hanya ada 1 data fix dari mentor
      await mentorService.deletePenilaianByPesertaTanggal(pesertaId, tglSesi)
      const nilai = nilaiStr ? parseFloat(nilaiStr) : NaN
      if (!isNaN(nilai)) {
        await mentorService.addPenilaian({
          id_peserta: pesertaId,
          id_mentor: state.profile.id,
          tanggal: tglSesi,
          nilai_angka: nilai,
          nilai_adab: adab,
          nilai_tajwid: tajwid,
          nilai_kelancaran: kelancaranN,
          catatan: catatan || null,
        })
      }

      closeMentorModal()
      showToast('Data kehadiran dan laporan berhasil diperbarui! ✅', 'success')
      loadPesertaHistory(pesertaId, showToast)
    } catch (err) {
      btn.disabled = false
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Perubahan'
      showToast('Gagal update laporan: ' + err.message, 'error')
    }
  })
}

// ── HAPUS LAPORAN ──────────────────────────────────────────
window.deleteLaporan = async (kehadiranId, pesertaId) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data laporan kehadiran sesi ini?\n\nData kemajuan hafalan dan penilaian pada tanggal yang sama juga akan ikut terhapus.')) return
  try {
    // Cari tanggal kehadiran dari history cache untuk menghapus data terkait
    const history = window._currentPesertaHistory
    const rep = history?.kehadiranList?.find(k => Number(k.id) === Number(kehadiranId))
    const tanggalKehadiran = rep?.tanggal

    // Hapus kemajuan & penilaian pada tanggal yang sama (agar tidak jadi data hantu)
    if (tanggalKehadiran) {
      await mentorService.deleteRelatedByKehadiran(pesertaId, tanggalKehadiran)
    }

    // Hapus kehadiran utama
    await mentorService.deleteKehadiran(kehadiranId)
    showToast('Laporan beserta data kemajuan & penilaian terkait berhasil dihapus.', 'info')
    loadPesertaHistory(pesertaId, showToast)
  } catch (err) {
    showToast('Gagal menghapus laporan: ' + err.message, 'error')
  }
}

function showMentorModal(title, bodyHtml, footerHtml) {
  const m = document.getElementById('mentor-modal')
  if (!m) return
  document.getElementById('mentor-modal-title').innerHTML = title
  document.getElementById('mentor-modal-body').innerHTML = bodyHtml
  document.getElementById('mentor-modal-footer').innerHTML = footerHtml
  m.classList.add('show')
}

function closeMentorModal() {
  document.getElementById('mentor-modal')?.classList.remove('show')
}
window.closeMentorModal = closeMentorModal

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

function khBadgeStyle(s) {
  if (s === 'hadir') {
    return 'background:#064e3b;color:#a7f3d0;border:1.5px solid #10b981;font-weight:800;'
  } else if (s === 'izin') {
    return 'background:#78350f;color:#fde68a;border:1.5px solid #f59e0b;font-weight:800;'
  } else if (s === 'sakit') {
    return 'background:#1e3a8a;color:#bfdbfe;border:1.5px solid #3b82f6;font-weight:800;'
  } else {
    return 'background:#7f1d1d;color:#fecaca;border:1.5px solid #ef4444;font-weight:800;'
  }
}

function kelancaranBadge(s) {
  if (s === 'lancar') {
    return '<span style="display:inline-flex;align-items:center;gap:5px;background:#064e3b;color:#a7f3d0;border:1px solid #10b981;padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;"><i class="fa-solid fa-circle-check"></i> Lancar</span>'
  } else if (s === 'cukup') {
    return '<span style="display:inline-flex;align-items:center;gap:5px;background:#78350f;color:#fde68a;border:1px solid #f59e0b;padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;"><i class="fa-solid fa-circle-question"></i> Cukup</span>'
  } else {
    return '<span style="display:inline-flex;align-items:center;gap:5px;background:#7f1d1d;color:#fecaca;border:1px solid #ef4444;padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;"><i class="fa-solid fa-rotate-left"></i> Perlu Diulang</span>'
  }
}

function kelancaran(s) {
  return s === 'lancar' ? '<span class="ms" style="font-size:15px;color:#10b981;vertical-align:middle;">check_circle</span> Lancar' : s === 'cukup' ? '<span class="ms" style="font-size:15px;color:#F0AF43;vertical-align:middle;">help</span> Cukup' : '<span class="ms" style="font-size:15px;color:#ef4444;vertical-align:middle;">replay</span> Perlu Diulang'
}

function khBg(s) {
  return s === 'hadir' ? 'rgba(16,185,129,0.15)' : s === 'izin' ? 'rgba(240,175,67,0.15)' : s === 'sakit' ? 'rgba(96,165,250,0.15)' : 'rgba(239,68,68,0.15)'
}

function khBorder(s) {
  return s === 'hadir' ? 'rgba(16,185,129,0.3)' : s === 'izin' ? 'rgba(240,175,67,0.3)' : s === 'sakit' ? 'rgba(96,165,250,0.3)' : 'rgba(239,68,68,0.3)'
}

function khColor(s) {
  return s === 'hadir' ? '#10b981' : s === 'izin' ? '#F0AF43' : s === 'sakit' ? '#60a5fa' : '#e05c4b'
}

function khIcon(s) {
  return s === 'hadir' 
    ? '<i class="fa-solid fa-circle-check" style="color:#a7f3d0;"></i>' 
    : s === 'izin' 
    ? '<i class="fa-solid fa-file-lines" style="color:#fde68a;"></i>' 
    : s === 'sakit' 
    ? '<i class="fa-solid fa-head-side-cough" style="color:#bfdbfe;"></i>' 
    : '<i class="fa-solid fa-circle-xmark" style="color:#fecaca;"></i>'
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTanggalLaporan(dateStr) {
  if (!dateStr) return '-'
  try {
    const raw = String(dateStr).split('T')[0]
    const parts = raw.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const monthIdx = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, monthIdx, day)
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const dayName = days[d.getDay()]
      const monthName = months[monthIdx]
      return `${dayName}, ${day} ${monthName} ${year}`
    }
    return dateStr
  } catch (e) {
    return dateStr
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
