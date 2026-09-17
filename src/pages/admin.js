// ============================================================
// QIA — Portal Admin (Dashboard + Kelas + Spreadsheet Editor + Export)
// src/pages/admin.js
// ============================================================

import '@/styles/main.css'
import '@/styles/spreadsheet.css'
import { authService, adminService } from '@/lib/supabase.js'
import { exportToCSV, exportToExcel, exportToJSON, exportAllToExcel } from '@/lib/export-utils.js'

// ── State ───────────────────────────────────────────────────
let state = {
  profile: null,
  stats: null,
  activeView: 'dashboard',
  // Spreadsheet
  ssActiveTab: 'peserta',
  ssData: { peserta: [], mentor: [], kelas: [], kehadiran: [], kemajuan: [], penilaian: [] },
  ssDirtyRows: new Set(),
  ssNewRows: [],
  ssSortCol: null,
  ssSortDir: 'asc',
  ssFilter: '',
}

export async function renderAdmin(app, navigate, showToast) {
  document.title = 'Portal Admin — Quran Insight Academy'
  try {
    state.profile = await authService.getProfile()
    if (!state.profile || state.profile.role !== 'admin') {
      renderAdminLogin(app, navigate, showToast)
      return
    }
  } catch {
    renderAdminLogin(app, navigate, showToast)
    return
  }

  app.innerHTML = buildAdminShell()
  attachAdminEvents(navigate, showToast)
  await loadAdminStats(showToast)
  renderAdminView('dashboard', showToast)
}

function renderAdminLogin(app, navigate, showToast) {
  app.innerHTML = `
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <div class="login-logo-icon"><span class="ms" style="font-size:36px;color:#221104;">menu_book</span></div>
        <h1>Portal Admin QIA</h1>
        <p>Manajemen Peserta Didik, Asatidz & Kelas</p>
      </div>

      <form id="admin-login-form">
        <div class="form-group">
          <label class="form-label">Email Administrator</label>
          <input type="email" id="admin-login-email" class="form-control" placeholder="admin@qia.id" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="admin-login-pwd" class="form-control" placeholder="••••••••" required />
        </div>
        <button type="submit" class="btn btn-primary" id="btn-submit-login" style="width:100%;margin-top:16px;padding:12px;">
          <i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Admin
        </button>
      </form>

      <div style="text-align:center;margin-top:20px;">
        <button onclick="window.navigate('/')" style="background:none;border:none;color:#c9a87a;font-size:13px;cursor:pointer;">
          <i class="fa-solid fa-arrow-left mr-1"></i> Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>`

  const form = document.getElementById('admin-login-form')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('admin-login-email').value
    const pwd   = document.getElementById('admin-login-pwd').value
    const btn   = document.getElementById('btn-submit-login')
    btn.disabled = true
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Masuk…'
    try {
      await authService.login(email, pwd)
      showToast('Berhasil masuk sebagai Admin!', 'success')
      renderAdmin(app, navigate, showToast)
    } catch (err) {
      showToast('Gagal masuk: ' + err.message, 'error')
      btn.disabled = false
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Admin'
    }
  })

}


function buildAdminShell() {
  return `
<div class="portal-layout">
  <button class="sidebar-toggle" id="sidebar-toggle"><i class="fa-solid fa-bars"></i></button>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>

  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon"><span class="ms" style="font-size:20px;color:#221104;">menu_book</span></div>
      <div class="sidebar-logo-text"><h1>QIA Admin</h1><p>Portal Administrator</p></div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-nav-label">Dashboard</div>
      <div class="nav-item active" data-view="dashboard" id="nav-dashboard">
        <i class="fa-solid fa-chart-pie"></i> Dashboard
      </div>
      <div class="sidebar-nav-label">Manajemen</div>
      <div class="nav-item" data-view="mentor" id="nav-mentor">
        <i class="fa-solid fa-chalkboard-user"></i> Mentor / Asatidz
      </div>
      <div class="nav-item" data-view="kelas" id="nav-kelas">
        <i class="fa-solid fa-door-open"></i> Kelas (Bimbel)
      </div>
      <div class="nav-item" data-view="peserta" id="nav-peserta">
        <i class="fa-solid fa-users"></i> Peserta Didik
      </div>
      <div class="sidebar-nav-label">Data & Ekspor</div>
      <div class="nav-item" data-view="spreadsheet" id="nav-spreadsheet">
        <i class="fa-solid fa-table"></i> Spreadsheet Editor
        <span class="nav-badge">Bulk</span>
      </div>
      <div class="nav-item" data-view="export" id="nav-export">
        <i class="fa-solid fa-file-export"></i> Export Data
      </div>
      <div class="sidebar-nav-label">Sistem</div>
      <div class="nav-item" data-view="activity" id="nav-activity">
        <i class="fa-solid fa-clock-rotate-left"></i> Log Aktivitas
      </div>
    </nav>
    <div class="sidebar-user">
      <div class="user-avatar" id="user-avatar">A</div>
      <div class="user-info">
        <div class="user-name" id="user-name">Admin</div>
        <div class="user-role" style="color:#F0AF43;">Administrator</div>
      </div>
      <button class="btn-logout" id="btn-logout"><i class="fa-solid fa-right-from-bracket"></i></button>
    </div>
  </aside>

  <main class="main-content" id="main-content"></main>
</div>

<!-- Generic Modal -->
<div class="modal-backdrop" id="admin-modal">
  <div class="modal" id="admin-modal-inner">
    <div class="modal-header">
      <span class="modal-title" id="admin-modal-title"></span>
      <button class="modal-close" id="admin-modal-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div id="admin-modal-body"></div>
    <div class="modal-footer" id="admin-modal-footer"></div>
  </div>
</div>`
}

function attachAdminEvents(navigate, showToast) {
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open')
    document.getElementById('sidebar-overlay').classList.toggle('show')
  })
  document.getElementById('sidebar-overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open')
    document.getElementById('sidebar-overlay').classList.remove('show')
  })
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => renderAdminView(item.dataset.view, showToast))
  })
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await authService.logout(); navigate('/')
  })
  document.getElementById('admin-modal-close').addEventListener('click', closeModal)
  document.getElementById('admin-modal').addEventListener('click', function(e) { if (e.target===this) closeModal() })
}

function setActiveNav(view) {
  document.querySelectorAll('.nav-item[data-view]').forEach(el => el.classList.remove('active'))
  document.getElementById('nav-'+view)?.classList.add('active')
}

function renderAdminView(view, showToast) {
  state.activeView = view
  setActiveNav(view)
  const main = document.getElementById('main-content')
  document.getElementById('sidebar').classList.remove('open')
  document.getElementById('sidebar-overlay').classList.remove('show')

  switch(view) {
    case 'dashboard':   renderAdminDashboard(main, showToast);  break
    case 'mentor':      renderMentorManage(main, showToast);     break
    case 'kelas':       renderKelasManage(main, showToast);      break
    case 'peserta':     renderPesertaManage(main, showToast);    break
    case 'spreadsheet': renderSpreadsheet(main, showToast);      break
    case 'export':      renderExport(main, showToast);           break
    case 'activity':    renderActivity(main, showToast);         break
    default: renderAdminDashboard(main, showToast)
  }
  window.renderAdminView = (v) => renderAdminView(v, showToast)
}

async function loadAdminStats(showToast) {
  try {
    state.stats = await adminService.getDashboardStats()
    document.getElementById('user-name').textContent = state.profile?.nama || 'Admin'
    document.getElementById('user-avatar').textContent = (state.profile?.nama||'A').charAt(0)
  } catch(e) { showToast('Gagal load stats: ' + e.message, 'error') }
}

// ── DASHBOARD ────────────────────────────────────────────────
function renderAdminDashboard(main, showToast) {
  const s = state.stats || {}
  main.innerHTML = `
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Admin</span></div>
      <div class="page-breadcrumb">${new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
    </div>
    <button class="btn btn-primary" onclick="renderAdminView('spreadsheet')">
      <i class="fa-solid fa-table"></i> Buka Spreadsheet Editor
    </button>
  </div>

  <div class="grid-4" style="margin-bottom:24px;">
    ${[
      [s.total_peserta||0, 'Total Peserta Didik', 'fa-users', 'stat-icon-gold'],
      [s.total_bimbel||0,  'Peserta Didik Bimbel', 'fa-chalkboard-user', 'stat-icon-emerald'],
      [s.total_privat||0,  'Peserta Didik Privat', 'fa-user-graduate', 'stat-icon-brown'],
      [s.total_mentor||0,  'Mentor Aktif', 'fa-person-chalkboard', 'stat-icon-blue'],
      [s.total_kelas||0,   'Kelas Aktif', 'fa-door-open', 'stat-icon-gold'],
      [s.hadir_hari_ini||0,'Hadir Hari Ini', 'fa-calendar-check', 'stat-icon-emerald'],
      [s.absensi_hari_ini||0,'Sesi Hari Ini','fa-clipboard-list','stat-icon-brown'],
      [s.rata_nilai_bulan_ini||0,'Rata Nilai Bulan Ini','fa-star','stat-icon-blue'],
    ].map(([val,lbl,icon,cls]) => `
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${cls}"><i class="fa-solid ${icon}" style="color:white;"></i></div>
      <div><div class="stat-value">${val}</div><div class="stat-label">${lbl}</div></div>
    </div>`).join('')}
  </div>

  <!-- Quick actions -->
  <div class="grid-3" style="margin-bottom:24px;">
    ${[
      ['fa-chalkboard-user','Tambah Mentor','Daftarkan ustadz/ustadzah baru','btn-gold','mentor'],
      ['fa-door-open','Buat Kelas Baru','Tambah kelas bimbel & assign mentor','btn-emerald','kelas'],
      ['fa-user-plus','Tambah Peserta Didik','Daftarkan peserta didik baru','btn-blue','peserta'],
      ['fa-table','Spreadsheet Editor','Edit data secara massal','btn-gold','spreadsheet'],
      ['fa-file-export','Export Data','Download data ke Excel/CSV','btn-brown','export'],
      ['fa-clock-rotate-left','Log Aktivitas','Lihat riwayat aksi admin & mentor','btn-gray','activity'],
    ].map(([icon,title,desc,cls,view])=>`
    <button onclick="renderAdminView('${view}')"
      style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:var(--radius);
      padding:20px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.25s;"
      onmouseover="this.style.borderColor='var(--gold-500)';this.style.transform='translateY(-2px)'"
      onmouseout="this.style.borderColor='var(--border-dark)';this.style.transform=''">
      <i class="fa-solid ${icon}" style="font-size:22px;color:#F0AF43;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;color:var(--cream-100);font-size:14px;margin-bottom:4px;">${title}</div>
      <div style="font-size:12px;color:var(--text-card-muted);">${desc}</div>
    </button>`).join('')}
  </div>

  <!-- Activity -->
  <div class="card">
    <h3 style="color:var(--cream-100);font-size:14px;margin-bottom:14px;">
      <i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Aktivitas Terbaru
    </h3>
    ${(s.aktivitas_terbaru||[]).length===0 ?
      '<p style="color:var(--text-card-muted);font-size:13px;">Belum ada aktivitas tercatat.</p>' :
      `<div style="display:flex;flex-direction:column;gap:8px;">
        ${(s.aktivitas_terbaru||[]).slice(0,6).map(a=>`
        <div style="padding:10px 14px;background:rgba(255,255,255,0.04);border-radius:10px;
          display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--cream-100);">${a.action}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${a.entity_type||''} ${a.entity_id?'#'+a.entity_id:''}</div>
          </div>
          <div style="font-size:11px;color:var(--text-card-muted);white-space:nowrap;">${fmtDate(a.created_at)}</div>
        </div>`).join('')}
      </div>`}
  </div>`
}

// ── MENTOR MANAJEMEN ─────────────────────────────────────────
async function renderMentorManage(main, showToast) {
  main.innerHTML = `<div class="page-header">
    <div><div class="page-title">Mentor / <span>Asatidz</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-mentor">
      <i class="fa-solid fa-plus"></i> Tambah Mentor
    </button>
  </div>
  <div id="mentor-list-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`
  try {
    const mentors = await adminService.getMentors()
    document.getElementById('mentor-list-wrapper').innerHTML = `
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama</th><th>Email</th><th>Jenis</th><th>No HP</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${mentors.length===0?`<tr><td colspan="6" style="text-align:center;padding:28px;color:#81511D;">Belum ada mentor.</td></tr>`:
            mentors.map(m=>`<tr>
              <td><div style="font-weight:600;">${m.nama}</div></td>
              <td><span style="font-size:12px;">${m.email}</span></td>
              <td>${jenisChip(m.jenis_mentor)}</td>
              <td><span style="font-size:13px;">${m.no_hp||'-'}</span></td>
              <td>${statusChip(m.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editMentor('${m.id}')"><i class="fa-solid fa-pen"></i></button>
                  ${m.status==='aktif'?
                    `<button class="btn btn-danger btn-sm" onclick="toggleMentorStatus('${m.id}','nonaktif')"><i class="fa-solid fa-ban"></i></button>`:
                    `<button class="btn btn-success btn-sm" onclick="toggleMentorStatus('${m.id}','aktif')"><i class="fa-solid fa-check"></i></button>`}
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
    window.editMentor = (id) => {
      const m = mentors.find(x=>x.id===id)
      if (!m) return
      showModal('Edit Mentor', `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-group"><label class="form-label">Nama</label><input type="text" class="form-control" id="em-nama" value="${m.nama}" /></div>
        <div class="form-group"><label class="form-label">No HP</label><input type="text" class="form-control" id="em-nohp" value="${m.no_hp||''}" /></div>
        <div class="form-group"><label class="form-label">Jenis Mentor</label>
          <select class="form-control" id="em-jenis">
            <option value="bimbel" ${m.jenis_mentor==='bimbel'?'selected':''}>Bimbel</option>
            <option value="privat" ${m.jenis_mentor==='privat'?'selected':''}>Privat</option>
            <option value="keduanya" ${m.jenis_mentor==='keduanya'?'selected':''}>Keduanya</option>
          </select>
        </div>
      </div>`,
      async () => {
        await adminService.updateMentor(id, {
          nama: document.getElementById('em-nama').value,
          no_hp: document.getElementById('em-nohp').value,
          jenis_mentor: document.getElementById('em-jenis').value,
        })
        showToast('Mentor diperbarui!', 'success')
        closeModal(); renderMentorManage(main, showToast)
      })
    }
    window.toggleMentorStatus = async (id, status) => {
      await adminService.updateMentor(id, {status})
      showToast(`Mentor ${status==='aktif'?'diaktifkan':'dinonaktifkan'}!`, 'success')
      renderMentorManage(main, showToast)
    }
  } catch(e) { showToast('Gagal memuat mentor: ' + e.message, 'error') }

  document.getElementById('btn-tambah-mentor').addEventListener('click', () => {
    showModal('Tambah Mentor Baru', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Lengkap</label><input type="text" class="form-control" id="nm-nama" placeholder="Ust. Ahmad..." /></div>
      <div class="form-group"><label class="form-label">Email (Login)</label><input type="email" class="form-control" id="nm-email" placeholder="mentor@qia.id" /></div>
      <div class="form-group"><label class="form-label">Password Awal</label><input type="password" class="form-control" id="nm-pw" placeholder="Min 8 karakter" /></div>
      <div class="form-group"><label class="form-label">No HP</label><input type="text" class="form-control" id="nm-nohp" placeholder="08xx" /></div>
      <div class="form-group"><label class="form-label">Jenis Mentor</label>
        <select class="form-control" id="nm-jenis">
          <option value="bimbel">Bimbel Kelompok</option>
          <option value="privat">Privat</option>
          <option value="keduanya">Keduanya</option>
        </select>
      </div>
    </div>`,
    async () => {
      const email = document.getElementById('nm-email').value
      const pw    = document.getElementById('nm-pw').value
      if (!email || !pw) { showToast('Isi email dan password.', 'info'); return }
      try {
        await adminService.createMentor(email, pw, {
          nama: document.getElementById('nm-nama').value,
          no_hp: document.getElementById('nm-nohp').value,
          jenis_mentor: document.getElementById('nm-jenis').value,
        })
        showToast('Mentor berhasil ditambahkan!', 'success')
        closeModal(); renderMentorManage(main, showToast)
      } catch(e) { showToast('Gagal: ' + e.message, 'error') }
    })
  })
}

// ── KELAS MANAJEMEN ──────────────────────────────────────────
async function renderKelasManage(main, showToast) {
  main.innerHTML = `<div class="page-header">
    <div><div class="page-title">Kelas <span>Bimbel</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-kelas"><i class="fa-solid fa-plus"></i> Buat Kelas Baru</button>
  </div>
  <div id="kelas-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`

  const [kelasList, mentors, pesertaAll] = await Promise.all([
    adminService.getKelas(),
    adminService.getMentors({status:'aktif'}),
    adminService.getPesertaDidik({jenis:'bimbel',status:'aktif'}),
  ]).catch(e => { showToast('Gagal memuat data.','error'); return [[],[],[]] })

  document.getElementById('kelas-wrapper').innerHTML = `
  <div class="grid-3">
    ${kelasList.length===0?`<div style="grid-column:1/-1;text-align:center;padding:40px;color:#81511D;">Belum ada kelas. Buat kelas pertama!</div>`:
      kelasList.map(k=>{
        const santriKelas = pesertaAll.filter(p=>p.id_kelas===k.id)
        return `
        <div class="card anim-fadeInUp" style="position:relative;">
          <div style="position:absolute;top:16px;right:16px;">${statusChip(k.status)}</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <div>
              <h3 style="color:var(--cream-100);font-size:14px;">${k.nama_kelas}</h3>
              <div style="font-size:12px;color:var(--text-card-muted);">${k.mentor?.nama || 'Belum ada mentor'}</div>
            </div>
          </div>
          ${k.hari_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:4px;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${k.hari_jadwal}</div>`:''}
          ${k.jam_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:10px;"><i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${k.jam_jadwal}</div>`:''}
          <div style="font-size:13px;color:var(--cream-100);margin-bottom:8px;"><i class="fa-solid fa-users" style="color:#10b981;"></i> ${santriKelas.length} / ${k.kapasitas||20} peserta didik</div>
          <!-- Santri list mini -->
          <div style="max-height:80px;overflow-y:auto;margin-bottom:12px;">
            ${santriKelas.map(p=>`<div style="font-size:12px;color:var(--text-card-muted);padding:2px 0;">• ${p.nama_lengkap}</div>`).join('')}
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="editKelas(${k.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="kelolaSantriKelas(${k.id},'${k.nama_kelas}')">
              <i class="fa-solid fa-user-plus"></i> Kelola Peserta Didik
            </button>
          </div>
        </div>`}).join('')}
  </div>`

  document.getElementById('btn-tambah-kelas').addEventListener('click', () => {
    showModal('Buat Kelas Baru', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="nk-nama" placeholder="cth: Tahsin Al-Jazari A" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="nk-desc" rows="2" placeholder="Deskripsi kelas…"></textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="nk-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${mentors.filter(m=>m.jenis_mentor==='bimbel'||m.jenis_mentor==='keduanya').map(m=>`<option value="${m.id}">${m.nama}</option>`).join('')}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="nk-hari" placeholder="cth: Senin & Rabu" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="nk-jam" placeholder="cth: 15:30 – 17:00" /></div>
      </div>
      <div class="form-group"><label class="form-label">Kapasitas Maksimal</label><input type="number" class="form-control" id="nk-kap" value="15" /></div>
    </div>`,
    async () => {
      const nama = document.getElementById('nk-nama').value.trim()
      if (!nama) { showToast('Isi nama kelas.','info'); return }
      try {
        await adminService.createKelas({
          nama_kelas: nama,
          deskripsi:  document.getElementById('nk-desc').value,
          id_mentor:  document.getElementById('nk-mentor').value || null,
          hari_jadwal:document.getElementById('nk-hari').value,
          jam_jadwal: document.getElementById('nk-jam').value,
          kapasitas:  parseInt(document.getElementById('nk-kap').value)||15,
        })
        showToast('Kelas berhasil dibuat!', 'success')
        closeModal(); renderKelasManage(main, showToast)
      } catch(e) { showToast('Gagal: ' + e.message, 'error') }
    })
  })

  window.editKelas = (id) => {
    const k = kelasList.find(x=>x.id===id)
    if (!k) return
    showModal('Edit Kelas', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="ek-nama" value="${k.nama_kelas}" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="ek-desc" rows="2">${k.deskripsi||''}</textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="ek-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${mentors.filter(m=>m.jenis_mentor==='bimbel'||m.jenis_mentor==='keduanya').map(m=>`<option value="${m.id}" ${k.id_mentor===m.id?'selected':''}>${m.nama}</option>`).join('')}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="ek-hari" value="${k.hari_jadwal||''}" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="ek-jam" value="${k.jam_jadwal||''}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="ek-status">
          <option value="aktif" ${k.status==='aktif'?'selected':''}>Aktif</option>
          <option value="nonaktif" ${k.status==='nonaktif'?'selected':''}>Nonaktif</option>
        </select>
      </div>
    </div>`,
    async () => {
      await adminService.updateKelas(id, {
        nama_kelas: document.getElementById('ek-nama').value,
        deskripsi:  document.getElementById('ek-desc').value,
        id_mentor:  document.getElementById('ek-mentor').value || null,
        hari_jadwal:document.getElementById('ek-hari').value,
        jam_jadwal: document.getElementById('ek-jam').value,
        status:     document.getElementById('ek-status').value,
      })
      showToast('Kelas diperbarui!', 'success')
      closeModal(); renderKelasManage(main, showToast)
    })
  }

  window.kelolaSantriKelas = (kelasId, namaKelas) => {
    const santriDiKelas = pesertaAll.filter(p=>p.id_kelas===kelasId)
    const santriLain    = pesertaAll.filter(p=>!p.id_kelas || p.id_kelas!==kelasId)
    showModal(`Kelola Peserta Didik — ${namaKelas}`, `
    <div>
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--gold-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
          Peserta Didik di Kelas Ini (${santriDiKelas.length})
        </div>
        ${santriDiKelas.length===0?`<p style="font-size:13px;color:var(--text-card-muted);">Belum ada peserta didik</p>`:
          santriDiKelas.map(p=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;
            background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:6px;">
            <span style="font-size:13px;color:var(--cream-100);">${p.nama_lengkap}</span>
            <button class="btn btn-danger btn-sm" onclick="pindahSantriKelas(${p.id}, null, this.closest('.modal-backdrop'))">
              <i class="fa-solid fa-xmark"></i> Hapus dari Kelas
            </button>
          </div>`).join('')}
      </div>
      <div style="border-top:1px solid var(--border-dark);padding-top:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--gold-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
          Tambah Peserta Didik ke Kelas
        </div>
        <select class="form-control" id="ss-add-santri" style="margin-bottom:10px;">
          <option value="">-- Pilih Peserta Didik --</option>
          ${santriLain.map(p=>`<option value="${p.id}">${p.nama_lengkap} ${p.id_kelas?'(sudah di kelas lain)':''}</option>`).join('')}
        </select>
        <button class="btn btn-primary btn-sm" onclick="tambahSantriKeKelas(${kelasId})">
          <i class="fa-solid fa-plus"></i> Tambahkan
        </button>
      </div>
    </div>`, null)
  }

  window.pindahSantriKelas = async (pesertaId, kelasId) => {
    try {
      await adminService.updatePeserta(pesertaId, { id_kelas: kelasId })
      showToast('Peserta didik berhasil dipindahkan!', 'success')
      closeModal(); renderKelasManage(main, showToast)
    } catch(e) { showToast('Gagal: '+e.message,'error') }
  }
  window.tambahSantriKeKelas = async (kelasId) => {
    const pesertaId = parseInt(document.getElementById('ss-add-santri')?.value)
    if (!pesertaId) { showToast('Pilih peserta didik.','info'); return }
    await window.pindahSantriKelas(pesertaId, kelasId)
  }
}

// ── PESERTA DIDIK MANAJEMEN ──────────────────────────────────
async function renderPesertaManage(main, showToast) {
  main.innerHTML = `<div class="page-header">
    <div><div class="page-title">Peserta <span>Didik</span></div></div>
    <div style="display:flex;gap:10px;">
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon" style="color:var(--brown-400);"></i>
        <input type="text" id="peserta-search" placeholder="Cari nama peserta didik…"
          class="form-control search-input" style="min-width:220px;" />
      </div>
      <button class="btn btn-primary" id="btn-tambah-peserta"><i class="fa-solid fa-plus"></i> Tambah Peserta Didik</button>
    </div>
  </div>
  <div id="peserta-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`

  const [peserta, mentors, kelasList] = await Promise.all([
    adminService.getPesertaDidik({status:'aktif'}),
    adminService.getMentors({status:'aktif'}),
    adminService.getKelas({status:'aktif'}),
  ]).catch(e => { showToast('Gagal memuat data.','error'); return [[],[],[]] })

  function renderPesertaTable(list) {
    document.getElementById('peserta-wrapper').innerHTML = `
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama Lengkap</th><th>Usia</th><th>Jenis</th><th>Kelas</th><th>Mentor</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${list.length===0?`<tr><td colspan="7" style="text-align:center;padding:28px;color:#81511D;">Tidak ada peserta didik ditemukan.</td></tr>`:
            list.map(p=>`<tr>
              <td><div style="font-weight:600;">${p.nama_lengkap}</div><div style="font-size:11px;color:#81511D;">${p.nama_wali||''}</div></td>
              <td>${p.usia||'-'}</td>
              <td>${jenisChip(p.jenis)}</td>
              <td><span style="font-size:13px;">${p.kelas?.nama_kelas||'-'}</span></td>
              <td><span style="font-size:13px;">${p.mentor?.nama||'-'}</span></td>
              <td>${statusChip(p.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editPeserta(${p.id})"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-danger btn-sm" onclick="nonaktifPeserta(${p.id})"><i class="fa-solid fa-ban"></i></button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
  }

  renderPesertaTable(peserta)

  document.getElementById('peserta-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase()
    renderPesertaTable(peserta.filter(p=>p.nama_lengkap.toLowerCase().includes(q)))
  })

  window.editPeserta = (id) => {
    const p = peserta.find(x=>x.id===id)
    if (!p) return
    showModal('Edit Peserta Didik', buildPesertaForm(p, mentors, kelasList),
    async () => {
      await adminService.updatePeserta(id, collectPesertaForm())
      showToast('Peserta didik diperbarui!', 'success')
      closeModal(); renderPesertaManage(main, showToast)
    })
    handleJenisChange()
  }
  window.nonaktifPeserta = async (id) => {
    if (!confirm('Nonaktifkan peserta didik ini?')) return
    await adminService.updatePeserta(id, {status:'nonaktif'})
    showToast('Peserta didik dinonaktifkan.','info')
    renderPesertaManage(main, showToast)
  }

  document.getElementById('btn-tambah-peserta').addEventListener('click', () => {
    showModal('Tambah Peserta Didik Baru', buildPesertaForm(null, mentors, kelasList),
    async () => {
      const data = collectPesertaForm()
      if (!data.nama_lengkap) { showToast('Isi nama peserta didik.','info'); return }
      try {
        await adminService.createPeserta(data)
        showToast('Peserta didik berhasil didaftarkan!', 'success')
        closeModal(); renderPesertaManage(main, showToast)
      } catch(e) { showToast('Gagal: '+e.message,'error') }
    })
    handleJenisChange()
  })
}

function buildPesertaForm(p, mentors, kelasList) {
  return `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nama Lengkap</label>
      <input type="text" class="form-control" id="pf-nama" value="${p?.nama_lengkap||''}" placeholder="Nama lengkap peserta didik" /></div>
    <div class="form-group"><label class="form-label">Usia</label>
      <input type="number" class="form-control" id="pf-usia" value="${p?.usia||''}" placeholder="10" /></div>
    <div class="form-group"><label class="form-label">Jenis Kelamin</label>
      <select class="form-control" id="pf-jk">
        <option value="L" ${p?.jenis_kelamin==='L'?'selected':''}>Laki-laki</option>
        <option value="P" ${p?.jenis_kelamin==='P'?'selected':''}>Perempuan</option>
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Jenis Program</label>
      <select class="form-control" id="pf-jenis" onchange="handleJenisChange()">
        <option value="bimbel" ${p?.jenis==='bimbel'?'selected':''}>Bimbel Kelompok</option>
        <option value="privat" ${p?.jenis==='privat'?'selected':''}>Privat</option>
      </select></div>
    <div class="form-group" id="pf-kelas-group"><label class="form-label">Kelas (Bimbel)</label>
      <select class="form-control" id="pf-kelas">
        <option value="">-- Pilih Kelas --</option>
        ${kelasList.map(k=>`<option value="${k.id}" ${p?.id_kelas===k.id?'selected':''}>${k.nama_kelas}</option>`).join('')}
      </select></div>
    <div class="form-group"><label class="form-label">Assign Mentor</label>
      <select class="form-control" id="pf-mentor">
        <option value="">-- Pilih Mentor --</option>
        ${mentors.map(m=>`<option value="${m.id}" ${p?.id_mentor===m.id?'selected':''}>${m.nama} (${m.jenis_mentor})</option>`).join('')}
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nama Wali</label>
      <input type="text" class="form-control" id="pf-wali" value="${p?.nama_wali||''}" placeholder="Nama orang tua/wali" /></div>
    <div class="form-group"><label class="form-label">Email Wali</label>
      <input type="email" class="form-control" id="pf-email-wali" value="${p?.email_wali||''}" /></div>
    <div class="form-group"><label class="form-label">No WA Wali</label>
      <input type="text" class="form-control" id="pf-wa-wali" value="${p?.no_wa_wali||''}" /></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Catatan Umum</label>
      <textarea class="form-control" id="pf-catatan" rows="2">${p?.catatan_umum||''}</textarea></div>
  </div>`
}

function collectPesertaForm() {
  return {
    nama_lengkap: document.getElementById('pf-nama')?.value?.trim(),
    usia:         parseInt(document.getElementById('pf-usia')?.value)||null,
    jenis_kelamin:document.getElementById('pf-jk')?.value,
    jenis:        document.getElementById('pf-jenis')?.value,
    id_kelas:     parseInt(document.getElementById('pf-kelas')?.value)||null,
    id_mentor:    document.getElementById('pf-mentor')?.value||null,
    nama_wali:    document.getElementById('pf-wali')?.value,
    email_wali:   document.getElementById('pf-email-wali')?.value,
    no_wa_wali:   document.getElementById('pf-wa-wali')?.value,
    catatan_umum: document.getElementById('pf-catatan')?.value,
  }
}

window.handleJenisChange = () => {
  const jenis = document.getElementById('pf-jenis')?.value
  const grp   = document.getElementById('pf-kelas-group')
  if (grp) grp.style.display = jenis==='bimbel' ? '' : 'none'
}

// ── SPREADSHEET EDITOR ───────────────────────────────────────
async function renderSpreadsheet(main, showToast) {
  main.innerHTML = `
  <div class="page-header">
    <div><div class="page-title">Spreadsheet <span>Editor</span></div>
    <div class="page-breadcrumb">Edit database secara massal langsung dari browser</div></div>
    <button class="btn btn-success" id="btn-batch-save" disabled>
      <i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan
    </button>
  </div>

  <div class="spreadsheet-wrapper">
    <!-- Toolbar -->
    <div class="spreadsheet-toolbar">
      <span class="toolbar-title">📊 QIA Database Editor</span>
      <div class="search-wrapper" style="position:relative;">
        <i class="fa-solid fa-magnifying-glass" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#81511D;font-size:13px;"></i>
        <input type="text" id="ss-search" placeholder="Filter data…"
          style="padding:6px 10px 6px 30px;border-radius:8px;border:1px solid var(--border-dark);
          background:rgba(255,255,255,0.06);color:var(--cream-100);font-size:13px;outline:none;width:200px;"
          oninput="filterSS(this.value)" />
      </div>
      <div class="spacer"></div>
      <button class="btn btn-ghost btn-sm" onclick="addSSRow()"><i class="fa-solid fa-plus"></i> Tambah Baris</button>
      <button class="btn btn-ghost btn-sm" id="btn-refresh-ss" onclick="reloadSS()"><i class="fa-solid fa-rotate"></i> Refresh</button>
    </div>

    <!-- Tabs -->
    <div class="spreadsheet-tabs" id="ss-tabs">
      ${[['peserta','group','Peserta Didik'],['mentor','co_present','Mentor'],['kelas','school','Kelas'],['kehadiran','calendar_month','Kehadiran'],['kemajuan','menu_book','Kemajuan'],['penilaian','grade','Penilaian']].map(([key,icon,label])=>`
      <div class="sheet-tab ${key==='peserta'?'active':''}" data-tab="${key}" onclick="switchSSTab('${key}',this)">
        <span class="ms" style="font-size:16px;vertical-align:middle;margin-right:4px;">${icon}</span>${label}
      </div>`).join('')}
    </div>

    <!-- Search bar -->
    <div class="ss-search-bar">
      <span class="ss-row-count" id="ss-row-count">Memuat…</span>
      <span style="flex:1;"></span>
      <span class="ss-row-count" id="ss-dirty-count" style="color:#d97706;display:none;">
        <i class="fa-solid fa-circle-dot"></i> Ada perubahan belum disimpan
      </span>
    </div>

    <!-- Spreadsheet Grid -->
    <div class="spreadsheet-scroll" id="ss-scroll">
      <div style="text-align:center;padding:48px;">
        <div class="spinner" style="margin:0 auto;width:36px;height:36px;"></div>
        <p style="color:#81511D;margin-top:14px;font-size:13px;">Memuat data…</p>
      </div>
    </div>

    <!-- Status bar -->
    <div class="spreadsheet-statusbar">
      <span class="statusbar-item"><strong id="ss-table-name">peserta_didik</strong></span>
      <span class="statusbar-item">Baris: <strong id="ss-row-total">0</strong></span>
      <span class="statusbar-spacer"></span>
      <span class="statusbar-item" style="font-size:11px;color:#81511D;">Klik sel untuk mengedit • Enter untuk konfirmasi • Esc untuk batal</span>
    </div>

    <!-- Export panel -->
    <div class="export-panel">
      <span class="export-label"><i class="fa-solid fa-file-export"></i> Export Tab Aktif:</span>
      <button class="btn btn-ghost btn-sm" onclick="exportSSTab('csv')"><i class="fa-solid fa-file-csv" style="color:#10b981;"></i> CSV</button>
      <button class="btn btn-ghost btn-sm" onclick="exportSSTab('excel')"><i class="fa-solid fa-file-excel" style="color:#059669;"></i> Excel</button>
      <span style="border-left:1px solid var(--cream-300);margin:0 4px;height:20px;"></span>
      <button class="btn btn-secondary btn-sm" onclick="exportAllSS()"><i class="fa-solid fa-boxes-stacked"></i> Export Semua Tabel (.xlsx)</button>
    </div>
  </div>`

  // Load initial tab
  state.ssActiveTab = 'peserta'
  await loadSSData('peserta', showToast)

  // Batch save button
  document.getElementById('btn-batch-save').addEventListener('click', () => batchSave(showToast))

  window.switchSSTab = async (tab, el) => {
    document.querySelectorAll('.sheet-tab').forEach(t=>t.classList.remove('active'))
    el.classList.add('active')
    state.ssActiveTab = tab
    state.ssDirtyRows.clear()
    state.ssNewRows = []
    await loadSSData(tab, showToast)
  }
  window.filterSS  = (q) => { state.ssFilter = q; renderSSGrid(state.ssData[state.ssActiveTab], showToast) }
  window.reloadSS  = async () => { await loadSSData(state.ssActiveTab, showToast) }
  window.addSSRow  = () => addSSRow(showToast)
  window.exportSSTab = (fmt) => {
    const data = state.ssData[state.ssActiveTab]||[]
    if (fmt==='csv') exportToCSV(data, `QIA_${state.ssActiveTab}`)
    else exportToExcel(data, `QIA_${state.ssActiveTab}`, state.ssActiveTab)
  }
  window.exportAllSS = async () => {
    showToast('Mengumpulkan semua data…','info')
    try {
      const all = await adminService.exportAllTables()
      exportAllToExcel(all, 'QIA_DataLengkap')
      showToast('Export berhasil!','success')
    } catch(e) { showToast('Gagal export: '+e.message,'error') }
  }
}

const SS_TABLE_MAP = {
  peserta:   { table: 'peserta_didik', fetch: () => adminService.getPesertaDidik() },
  mentor:    { table: 'profiles',      fetch: () => adminService.getMentors() },
  kelas:     { table: 'kelas',         fetch: () => adminService.getKelas() },
  kehadiran: { table: 'kehadiran',     fetch: () => adminService.exportAllData('kehadiran', '*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)') },
  kemajuan:  { table: 'kemajuan',      fetch: () => adminService.exportAllData('kemajuan', '*, peserta:peserta_didik(nama_lengkap)') },
  penilaian: { table: 'penilaian',     fetch: () => adminService.exportAllData('penilaian', '*, peserta:peserta_didik(nama_lengkap)') },
}

async function loadSSData(tab, showToast) {
  const scroll = document.getElementById('ss-scroll')
  scroll.innerHTML = `<div style="text-align:center;padding:48px;"><div class="spinner" style="margin:0 auto;width:36px;height:36px;"></div></div>`
  const tableNameEl = document.getElementById('ss-table-name')
  if (tableNameEl) tableNameEl.textContent = SS_TABLE_MAP[tab]?.table || tab
  try {
    const data = await SS_TABLE_MAP[tab]?.fetch() || []
    state.ssData[tab] = data
    renderSSGrid(data, showToast)
  } catch(e) {
    scroll.innerHTML = `<div style="padding:40px;text-align:center;color:#e05c4b;"><i class="fa-solid fa-triangle-exclamation" style="font-size:32px;margin-bottom:12px;display:block;"></i>${e.message}</div>`
    showToast('Gagal memuat data: ' + e.message, 'error')
  }
}

function renderSSGrid(rawData, showToast) {
  const data = rawData || []
  const q = (state.ssFilter||'').toLowerCase()
  const filtered = q ? data.filter(row => Object.values(row).some(v => String(v||'').toLowerCase().includes(q))) : data

  const countEl = document.getElementById('ss-row-count')
  const totalEl = document.getElementById('ss-row-total')
  if (countEl) countEl.textContent = `${filtered.length} dari ${data.length} baris`
  if (totalEl) totalEl.textContent = filtered.length

  if (filtered.length === 0) {
    document.getElementById('ss-scroll').innerHTML = `<div style="text-align:center;padding:60px 24px;color:#81511D;">
      <div style="font-size:42px;margin-bottom:12px;opacity:0.4;">🔍</div>
      <p>Tidak ada data yang cocok dengan filter.</p>
    </div>`
    return
  }

  // Columns: flat keys, skip nested objects
  const firstRow = filtered[0]
  const cols = Object.entries(firstRow)
    .filter(([k,v]) => typeof v !== 'object' || v === null)
    .map(([k]) => k)

  const editableCols = new Set(['nama_lengkap','nama','usia','jenis','status','email_wali','no_wa_wali',
    'no_hp','jenis_mentor','nama_kelas','hari_jadwal','jam_jadwal','kapasitas',
    'status_hadir','materi_pembahasan','catatan_sesi','perkembangan_materi',
    'kitab_surat','halaman_ayat','status_kelancaran','catatan_hafalan',
    'nilai_angka','nilai_adab','nilai_tajwid','nilai_kelancaran','catatan',
    'nama_wali','catatan_umum','deskripsi'])

  const scroll = document.getElementById('ss-scroll')
  scroll.innerHTML = `
  <table class="ss-table" id="ss-table-el">
    <thead>
      <tr>
        <th class="ss-th row-num header-row-num">No</th>
        ${cols.map(c=>`<th class="ss-th">${c}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${filtered.map((row, ri) => `
      <tr id="ss-tr-${ri}" class="${state.ssDirtyRows.has(row.id)?'row-dirty':''}">
        <td class="row-num">${ri+1}</td>
        ${cols.map(c => {
          const val = row[c]
          const editable = editableCols.has(c) && c !== 'id'
          const isStatus = c === 'status' || c === 'status_hadir' || c === 'jenis' || c==='jenis_mentor' || c==='status_kelancaran' || c==='jenis_kelamin'
          return `<td class="ss-cell" data-row="${ri}" data-col="${c}" data-id="${row.id||''}">
            <div class="ss-cell-inner ${getValClass(c,val)}" title="${val||''}">${val === null || val === undefined ? '' : String(val)}</div>
          </td>`
        }).join('')}
      </tr>`).join('')}
    </tbody>
  </table>`

  // Click to edit
  scroll.querySelectorAll('.ss-cell').forEach(cell => {
    cell.addEventListener('click', function() {
      if (this.classList.contains('cell-editing')) return
      const col = this.dataset.col
      const ri  = parseInt(this.dataset.row)
      const id  = this.dataset.id
      if (!editableCols.has(col)) return
      startEditCell(this, filtered[ri], col, ri, id, filtered, showToast)
    })
  })
}

function startEditCell(cell, row, col, ri, id, allData, showToast) {
  // Mark all other cells done
  document.querySelectorAll('.ss-cell.cell-editing').forEach(c => c.classList.remove('cell-editing'))
  cell.classList.add('cell-editing')
  const currentVal = row[col]
  const inner = cell.querySelector('.ss-cell-inner')
  inner.style.display = 'none'

  const selectCols = {
    status:           ['aktif','nonaktif','lulus'],
    status_hadir:     ['hadir','izin','sakit','alpa'],
    jenis:            ['bimbel','privat'],
    jenis_mentor:     ['bimbel','privat','keduanya'],
    status_kelancaran:['lancar','cukup','perlu_ulang'],
    jenis_kelamin:    ['L','P'],
  }

  let editor
  if (selectCols[col]) {
    editor = document.createElement('select')
    editor.className = 'ss-cell-editor-select'
    selectCols[col].forEach(opt => {
      const o = document.createElement('option')
      o.value = opt; o.textContent = opt
      if (opt === String(currentVal)) o.selected = true
      editor.appendChild(o)
    })
  } else {
    editor = document.createElement('input')
    editor.type = 'text'
    editor.className = 'ss-cell-editor'
    editor.value = currentVal === null || currentVal === undefined ? '' : String(currentVal)
  }

  cell.appendChild(editor)
  editor.focus()
  if (editor.select) editor.select()

  const commit = () => {
    const newVal = editor.tagName === 'SELECT' ? editor.value : editor.value.trim()
    cell.removeChild(editor)
    inner.style.display = ''
    inner.textContent = newVal
    inner.className = `ss-cell-inner ${getValClass(col, newVal)}`
    cell.classList.remove('cell-editing')
    if (String(newVal) !== String(currentVal || '')) {
      // Mark dirty
      row[col] = newVal
      state.ssDirtyRows.add(id || ri)
      const tr = document.getElementById('ss-tr-'+ri)
      if (tr) tr.classList.add('row-dirty')
      document.getElementById('ss-dirty-count').style.display = ''
      const btn = document.getElementById('btn-batch-save')
      if (btn) { btn.disabled = false }
    }
  }
  const cancel = () => {
    cell.removeChild(editor)
    inner.style.display = ''
    cell.classList.remove('cell-editing')
  }
  editor.addEventListener('blur', commit)
  editor.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { cancel() }
  })
}

function addSSRow() {
  const scroll = document.getElementById('ss-scroll')
  const tbody = scroll.querySelector('tbody')
  if (!tbody) return
  const ri = tbody.rows.length
  const tr = document.createElement('tr')
  tr.id = `ss-tr-${ri}`
  tr.classList.add('row-new')
  tr.innerHTML = `<td class="row-num">NEW</td><td colspan="20" style="padding:12px 16px;"><input type="text" placeholder="Gunakan form 'Tambah Peserta Didik' untuk baris baru yang valid…" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#81511D;" readonly /></td>`
  tbody.appendChild(tr)
  tr.scrollIntoView({ behavior: 'smooth' })
}

async function batchSave(showToast) {
  const tab = state.ssActiveTab
  const data = state.ssData[tab] || []
  const dirtyData = data.filter(row => state.ssDirtyRows.has(row.id) || state.ssDirtyRows.has(String(row.id)))
  if (dirtyData.length === 0) { showToast('Tidak ada perubahan.','info'); return }

  const btn = document.getElementById('btn-batch-save')
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…'

  const table = SS_TABLE_MAP[tab]?.table
  if (!table) { showToast('Tabel tidak dikenali.','error'); return }

  try {
    // Filter only editable columns
    const cleanRows = dirtyData.map(row => {
      const { peserta, mentor, kelas, ...rest } = row
      return rest
    })
    await adminService.bulkUpdatePeserta(cleanRows) // generic upsert
    state.ssDirtyRows.clear()
    document.getElementById('ss-dirty-count').style.display = 'none'
    showToast(`${dirtyData.length} baris berhasil disimpan! ✅`, 'success')
    btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan'
    await loadSSData(tab, showToast)
  } catch(e) {
    showToast('Gagal menyimpan: ' + e.message, 'error')
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan'
  }
}

function getValClass(col, val) {
  if (!val) return ''
  if (col==='status') return val==='aktif'?'text-green':val==='nonaktif'?'text-red':''
  if (col==='status_hadir') return val==='hadir'?'text-green':val==='alpa'?'text-red':val==='izin'?'text-yellow':'text-blue'
  if (col==='status_kelancaran') return val==='lancar'?'text-green':val==='perlu_ulang'?'text-red':'text-yellow'
  return ''
}

// ── EXPORT PAGE ──────────────────────────────────────────────
function renderExport(main, showToast) {
  main.innerHTML = `
  <div class="page-header">
    <div><div class="page-title">Export <span>Data</span></div>
    <div class="page-breadcrumb">Unduh data ke file Excel, CSV, atau JSON</div></div>
  </div>

  <div class="grid-2">
    ${[
      ['fa-users','Peserta Didik','Semua data peserta didik aktif beserta info wali','peserta'],
      ['fa-chalkboard-user','Mentor / Asatidz','Daftar semua mentor','mentor'],
      ['fa-door-open','Kelas Bimbel','Data kelas beserta mentor pengampu','kelas'],
      ['fa-calendar-check','Data Kehadiran','Rekap seluruh absensi peserta didik','kehadiran'],
      ['fa-book-quran','Kemajuan Hafalan','Riwayat kemajuan hafalan semua peserta didik','kemajuan'],
      ['fa-star','Penilaian','Data penilaian semua peserta didik','penilaian'],
    ].map(([icon,title,desc,tab])=>`
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="width:44px;height:44px;border-radius:12px;
          background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
          display:flex;align-items:center;justify-content:center;font-size:20px;color:#1a0a02;">
          <i class="fa-solid ${icon}"></i></div>
        <div>
          <h4 style="color:var(--cream-100);">${title}</h4>
          <p style="font-size:12px;color:var(--text-card-muted);">${desc}</p>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="doExport('${tab}','excel')">
          <i class="fa-solid fa-file-excel" style="color:#10b981;"></i> Excel
        </button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('${tab}','csv')">
          <i class="fa-solid fa-file-csv" style="color:#F0AF43;"></i> CSV
        </button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('${tab}','json')">
          <i class="fa-solid fa-file-code" style="color:#60a5fa;"></i> JSON
        </button>
      </div>
    </div>`).join('')}
  </div>

  <div class="card" style="margin-top:20px;">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
      <div style="width:44px;height:44px;border-radius:12px;
        background:linear-gradient(135deg,var(--emerald-700),var(--emerald-500));
        display:flex;align-items:center;justify-content:center;font-size:20px;color:white;">
        <i class="fa-solid fa-boxes-stacked"></i></div>
      <div>
        <h4 style="color:var(--cream-100);">Export Semua Tabel Sekaligus</h4>
        <p style="font-size:12px;color:var(--text-card-muted);">Download 1 file Excel dengan 6 sheet (semua tabel)</p>
      </div>
    </div>
    <button class="btn btn-success" id="btn-export-all">
      <i class="fa-solid fa-file-excel"></i> Download Semua Data (Multi-Sheet Excel)
    </button>
  </div>`

  window.doExport = async (tab, fmt) => {
    showToast('Mengambil data…','info')
    try {
      const data = await SS_TABLE_MAP[tab]?.fetch() || []
      if (fmt==='csv')   exportToCSV(data, `QIA_${tab}`)
      if (fmt==='excel') exportToExcel(data, `QIA_${tab}`, tab)
      if (fmt==='json')  exportToJSON(data, `QIA_${tab}`)
      showToast('Export berhasil!','success')
    } catch(e) { showToast('Gagal export: '+e.message,'error') }
  }

  document.getElementById('btn-export-all').addEventListener('click', async () => {
    showToast('Mengumpulkan semua data…','info')
    try {
      const all = await adminService.exportAllTables()
      exportAllToExcel(all, 'QIA_DataLengkap')
      showToast('Export berhasil!','success')
    } catch(e) { showToast('Gagal: '+e.message,'error') }
  })
}

// ── ACTIVITY LOG ─────────────────────────────────────────────
async function renderActivity(main, showToast) {
  main.innerHTML = `<div class="page-header">
    <div class="page-title">Log <span>Aktivitas</span></div>
  </div>
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th><th>ID</th></tr></thead>
      <tbody id="activity-tbody"><tr><td colspan="5" style="text-align:center;padding:28px;"><div class="spinner" style="margin:0 auto;width:28px;height:28px;"></div></td></tr></tbody>
    </table>
  </div>`
  try {
    const stats = await adminService.getDashboardStats()
    const logs  = stats?.aktivitas_terbaru || []
    document.getElementById('activity-tbody').innerHTML = logs.length===0 ?
      `<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Belum ada log aktivitas.</td></tr>` :
      logs.map(a=>`<tr>
        <td style="font-size:12px;">${fmtDate(a.created_at)}</td>
        <td style="font-size:12px;">${a.id_user?.slice(0,8)||'system'}…</td>
        <td><span style="font-weight:600;">${a.action}</span></td>
        <td>${a.entity_type||'-'}</td>
        <td style="font-size:12px;">${a.entity_id||'-'}</td>
      </tr>`).join('')
  } catch(e) { showToast('Gagal memuat log.','error') }
}

// ── MODAL HELPERS ─────────────────────────────────────────────
function showModal(title, bodyHTML, onSave) {
  document.getElementById('admin-modal-title').textContent = title
  document.getElementById('admin-modal-body').innerHTML = bodyHTML
  const footer = document.getElementById('admin-modal-footer')
  if (onSave) {
    footer.innerHTML = `
    <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" id="modal-save-btn"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>`
    document.getElementById('modal-save-btn').addEventListener('click', onSave)
  } else {
    footer.innerHTML = `<button class="btn btn-ghost" onclick="closeModal()">Tutup</button>`
  }
  const inner = document.getElementById('admin-modal-inner')
  inner.className = bodyHTML.length > 1500 ? 'modal modal-lg' : 'modal'
  document.getElementById('admin-modal').classList.add('show')
}
function closeModal() {
  document.getElementById('admin-modal').classList.remove('show')
}
window.closeModal = closeModal

// ── Helpers ─────────────────────────────────────────────────
function jenisChip(jenis) {
  const map = { bimbel:'badge-gold', privat:'badge-emerald', keduanya:'badge-blue' }
  return `<span class="badge ${map[jenis]||'badge-gray'}">${jenis||'-'}</span>`
}
function statusChip(status) {
  return status === 'aktif'
    ? `<span class="badge badge-emerald">● Aktif</span>`
    : `<span class="badge badge-red">● ${status}</span>`
}
function fmtDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
}
