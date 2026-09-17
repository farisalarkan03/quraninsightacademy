// ============================================================
// QIA — Portal Wali (Pencarian Nama Santri)
// src/pages/portal-wali.js
// ============================================================

import { waliService } from '@/lib/supabase.js'
import { printRaporPeserta } from '@/lib/export-utils.js'

export function renderWali(app, navigate, showToast) {
  document.title = 'Portal Wali — Quran Insight Academy'
  app.innerHTML = buildWaliHTML()
  setupWaliEvents(navigate, showToast)
}

function buildWaliHTML() {
  return `
<div style="min-height:100vh;background:#f3e9dc;font-family:'Plus Jakarta Sans',sans-serif;">

  <!-- Navbar -->
  <nav style="background:#1a0a02;border-bottom:1px solid rgba(240,175,67,0.2);
    padding:0 24px;height:68px;display:flex;align-items:center;justify-content:space-between;
    position:sticky;top:0;z-index:100;">
    <div style="display:flex;align-items:center;gap:12px;">
      <button onclick="window.navigateTo('/')"
        style="background:none;border:none;color:#c9a87a;cursor:pointer;padding:6px 8px;border-radius:8px;
        transition:color 0.2s;font-size:14px;"
        onmouseover="this.style.color='#F0AF43'" onmouseout="this.style.color='#c9a87a'">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div style="width:38px;height:38px;border-radius:10px;
        background:linear-gradient(135deg,#d97706,#F0AF43);
        display:flex;align-items:center;justify-content:center;">
        <span class="ms" style="font-size:20px;color:#221104;">menu_book</span>
      </div>
      <div>
        <div style="font-weight:700;color:#fdf0e2;font-size:15px;">Portal Wali</div>
        <div style="font-size:11px;color:#F0AF43;">Quran Insight Academy</div>
      </div>
    </div>
  </nav>

  <!-- Hero Search -->
  <div style="background:linear-gradient(135deg,#1a0a02 0%,#221104 60%,#3a1c08 100%);
    padding:56px 24px 64px;text-align:center;position:relative;overflow:hidden;">
    <div style="position:absolute;width:500px;height:500px;border-radius:50%;
      background:radial-gradient(circle,rgba(240,175,67,0.1),transparent 70%);
      top:-150px;right:-100px;pointer-events:none;"></div>
    <div style="position:relative;z-index:1;">
      <div style="font-size:13px;font-weight:700;color:#F0AF43;text-transform:uppercase;
        letter-spacing:2px;margin-bottom:16px;">
        <i class="fa-solid fa-magnifying-glass"></i> &nbsp;Cek Perkembangan
      </div>
      <h1 style="color:#fdf0e2;margin-bottom:12px;font-size:clamp(1.6rem,4vw,2.5rem);">
        Pantau Perkembangan<br>
        <span style="color:#F0AF43;">Peserta Didik Anda</span>
      </h1>
      <p style="color:#c9a87a;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto;">
        Ketik nama peserta didik untuk melihat rekap kemajuan hafalan, nilai, dan kehadiran.
      </p>

      <!-- Search Box -->
      <div style="max-width:560px;margin:0 auto;">
        <div style="position:relative;display:flex;gap:0;">
          <div style="position:relative;flex:1;">
            <i class="fa-solid fa-magnifying-glass" style="
              position:absolute;left:18px;top:50%;transform:translateY(-50%);
              color:#c9a87a;font-size:16px;pointer-events:none;"></i>
            <input type="text" id="wali-search-input" placeholder="Cari nama peserta didik…"
              autocomplete="off"
              style="width:100%;padding:16px 16px 16px 48px;
              border:2px solid rgba(240,175,67,0.25);
              border-right:none;
              border-radius:14px 0 0 14px;
              background:rgba(255,255,255,0.06);
              color:#fdf0e2;font-size:16px;font-family:inherit;outline:none;
              transition:all 0.25s;"
              onfocus="this.style.borderColor='rgba(240,175,67,0.7)';this.style.background='rgba(240,175,67,0.08)'"
              onblur="this.style.borderColor='rgba(240,175,67,0.25)';this.style.background='rgba(255,255,255,0.06)'" />
          </div>
          <button id="wali-search-btn"
            style="padding:16px 28px;border-radius:0 14px 14px 0;border:2px solid rgba(240,175,67,0.25);
            border-left:none;
            background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;
            font-weight:700;font-size:15px;cursor:pointer;
            transition:all 0.25s;white-space:nowrap;"
            onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
            Cari Peserta Didik
          </button>
        </div>
        <p style="font-size:12px;color:#c9a87a;margin-top:10px;">
          <i class="fa-solid fa-shield-halved"></i> &nbsp;Data hanya dapat dilihat oleh orang tua / wali yang bersangkutan
        </p>
      </div>
    </div>
  </div>

  <!-- Results Area -->
  <div id="wali-results" style="max-width:900px;margin:0 auto;padding:32px 24px 60px;">
    <!-- Default: panduan -->
    <div id="wali-guide" style="text-align:center;padding:48px 24px;">
      <div style="margin-bottom:16px;"><span class="ms" style="font-size:64px;color:#81511D;opacity:0.4;">search</span></div>
      <h3 style="color:#4F280C;font-size:1.1rem;margin-bottom:8px;">Cari Nama Peserta Didik</h3>
      <p style="color:#81511D;font-size:14px;max-width:360px;margin:0 auto;">
        Masukkan nama peserta didik Anda di kotak pencarian di atas untuk melihat perkembangan belajarnya.
      </p>
    </div>

    <div id="wali-loading" style="display:none;text-align:center;padding:48px;">
      <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
        border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;
        margin:0 auto 16px;"></div>
      <p style="color:#81511D;">Mencari data peserta didik…</p>
    </div>

    <div id="wali-content" style="display:none;"></div>
  </div>

</div>

<!-- Detail Modal -->
<div class="modal-backdrop" id="detail-modal">
  <div class="modal modal-xl" style="background:#f3e9dc;border:1px solid rgba(129,81,29,0.2);">
    <div class="modal-header" style="border-bottom:1px solid rgba(129,81,29,0.18);">
      <span class="modal-title" id="detail-modal-title" style="color:#1a0a02;font-size:1.1rem;"></span>
      <button class="modal-close" id="detail-modal-close" style="color:#81511D;">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div id="detail-modal-body" style="overflow-y:auto;max-height:72vh;"></div>
  </div>
</div>

<style>
  @keyframes spin { to { transform: rotate(360deg); } }
  input::placeholder { color: rgba(201,168,122,0.5) !important; }
</style>
`
}

function setupWaliEvents(navigate, showToast) {
  window.navigateTo = (path) => navigate(path)

  const input   = document.getElementById('wali-search-input')
  const btn     = document.getElementById('wali-search-btn')
  const guide   = document.getElementById('wali-guide')
  const loading = document.getElementById('wali-loading')
  const content = document.getElementById('wali-content')

  // Close detail modal
  document.getElementById('detail-modal-close').addEventListener('click', () => {
    document.getElementById('detail-modal').classList.remove('show')
  })
  document.getElementById('detail-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('show')
  })

  async function doSearch() {
    const q = input.value.trim()
    if (!q || q.length < 2) {
      showToast('Masukkan minimal 2 huruf nama peserta didik.', 'info')
      input.focus(); return
    }
    guide.style.display   = 'none'
    loading.style.display = 'block'
    content.style.display = 'none'
    content.innerHTML     = ''

    try {
      const results = await waliService.searchPeserta(q)
      loading.style.display = 'none'
      content.style.display = 'block'
      if (!results || results.length === 0) {
        content.innerHTML = `
          <div style="text-align:center;padding:48px;">
            <div style="font-size:52px;margin-bottom:16px;opacity:0.4;">🔍</div>
            <h3 style="color:#4F280C;">Peserta didik tidak ditemukan</h3>
            <p style="color:#81511D;font-size:14px;margin-top:8px;">
              Tidak ada peserta didik aktif dengan nama "<strong>${q}</strong>". Pastikan ejaan sudah benar.
            </p>
          </div>`
        return
      }
      renderResultCards(results, showToast)
    } catch (err) {
      loading.style.display = 'none'
      content.style.display = 'block'
      content.innerHTML = `<div style="text-align:center;padding:48px;color:#e05c4b;">
        <i class="fa-solid fa-circle-exclamation" style="font-size:36px;margin-bottom:12px;"></i>
        <p>Gagal memuat data: ${err.message}</p></div>`
      showToast('Gagal memuat data. Periksa koneksi Anda.', 'error')
    }
  }

  btn.addEventListener('click', doSearch)
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch() })

  // Expose global functions for onclick
  window.openDetailWali = async function(id) {
    document.getElementById('detail-modal').classList.add('show')
    document.getElementById('detail-modal-title').textContent = 'Memuat detail…'
    document.getElementById('detail-modal-body').innerHTML = `
      <div style="text-align:center;padding:48px;">
        <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
          border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div>
      </div>`
    try {
      const data = await waliService.getPesertaDetail(id)
      if (!data || !data.peserta) {
        document.getElementById('detail-modal').classList.remove('show')
        showToast('Data peserta didik tidak ditemukan.', 'error')
        return
      }
      document.getElementById('detail-modal-title').textContent = `Profil — ${data.peserta?.nama_lengkap || ''}`
      document.getElementById('detail-modal-body').innerHTML = buildDetailHTML(data)
      // Render charts
      await renderDetailCharts(id, data)
    } catch (e) {
      document.getElementById('detail-modal').classList.remove('show')
      showToast('Gagal memuat detail: ' + e.message, 'error')
    }
  }

  window.printRapor = async function(id, nama) {
    try {
      const data = await waliService.getPesertaDetail(id)
      if (data && data.peserta) {
        printRaporPeserta(data)
      } else {
        showToast('Data peserta didik belum lengkap untuk dicetak.', 'error')
      }
    } catch(e) {
      showToast('Gagal mencetak rapor: ' + e.message, 'error')
    }
  }
}

function renderResultCards(results, showToast) {
  const content = document.getElementById('wali-content')
  const total = results.length

  content.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
      <h3 style="color:#1a0a02;font-size:1rem;font-weight:700;">
        <i class="fa-solid fa-users" style="color:#F0AF43;"></i> &nbsp;${total} Peserta Didik Ditemukan
      </h3>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${results.map(p => buildResultCard(p)).join('')}
    </div>`
}

function buildResultCard(p) {
  const pctHadir = (p.total_hadir + p.total_izin + p.total_sakit + p.total_alpa) > 0
    ? Math.round((p.total_hadir / (p.total_hadir + p.total_izin + p.total_sakit + p.total_alpa)) * 100)
    : 0

  const kelasLabel = p.nama_kelas || (p.jenis === 'privat' ? 'Program Privat' : '-')
  const statusHafalan = p.kitab_surat_terakhir
    ? `${p.kitab_surat_terakhir}${p.halaman_ayat_terakhir ? ' — ' + p.halaman_ayat_terakhir : ''}`
    : 'Belum ada catatan'

  return `
  <div style="background:white;border:1px solid rgba(129,81,29,0.15);border-radius:16px;
    padding:20px 24px;box-shadow:0 4px 16px rgba(0,0,0,0.06);
    transition:all 0.25s;cursor:pointer;display:block;"
    onclick="openDetailWali(${p.id})"
    onmouseover="this.style.boxShadow='0 8px 32px rgba(240,175,67,0.2)';this.style.borderColor='rgba(240,175,67,0.4)'"
    onmouseout="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)';this.style.borderColor='rgba(129,81,29,0.15)'">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
      <!-- Profil -->
      <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:200px;">
        <div style="width:52px;height:52px;border-radius:50%;
          background:linear-gradient(135deg,#4F280C,#D4934E);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:20px;font-weight:700;color:#fdf0e2;">
          ${p.nama_lengkap.charAt(0)}
        </div>
        <div>
          <div style="font-weight:700;color:#1a0a02;font-size:15px;">${p.nama_lengkap}</div>
          <div style="font-size:12px;color:#81511D;margin-top:2px;">
            <i class="fa-solid fa-person" style="color:#D4934E;"></i> ${p.usia ? p.usia + ' tahun' : '-'} 
            &nbsp;•&nbsp;
            <i class="fa-solid fa-layer-group" style="color:#D4934E;"></i> ${kelasLabel}
          </div>
          <div style="font-size:12px;color:#81511D;margin-top:2px;">
            <i class="fa-solid fa-user-tie" style="color:#D4934E;"></i> ${p.nama_mentor || 'Belum ditentukan'}
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
        <!-- Nilai -->
        <div style="text-align:center;min-width:72px;">
          <div style="font-size:22px;font-weight:800;color:${scoreColor(p.rata_nilai)};">${p.rata_nilai || '-'}</div>
          <div style="font-size:10px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">Rata Nilai</div>
        </div>
        <!-- Kehadiran -->
        <div style="text-align:center;min-width:72px;">
          <div style="font-size:22px;font-weight:800;color:${pctHadir >= 80 ? '#10b981' : pctHadir >= 60 ? '#F0AF43' : '#e05c4b'};">
            ${pctHadir}%
          </div>
          <div style="font-size:10px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">Kehadiran</div>
        </div>
        <!-- Lihat Detail -->
        <button onclick="event.stopPropagation();openDetailWali(${p.id})"
          style="padding:9px 18px;border-radius:10px;border:none;cursor:pointer;
          background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;
          font-weight:700;font-size:13px;white-space:nowrap;transition:all 0.2s;"
          onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">
          <i class="fa-solid fa-eye"></i> Lihat Detail
        </button>
      </div>
    </div>

    <!-- Bottom info -->
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid rgba(129,81,29,0.1);
      display:flex;gap:20px;flex-wrap:wrap;">
      <div style="font-size:12.5px;color:#81511D;">
        <i class="fa-solid fa-book-quran" style="color:#F0AF43;"></i> 
        <strong style="color:#4F280C;">Hafalan Terakhir:</strong> ${statusHafalan}
      </div>
      <div style="font-size:12.5px;color:#81511D;">
        <i class="fa-regular fa-calendar-check" style="color:#10b981;"></i>
        <strong style="color:#4F280C;">Hadir:</strong> ${p.total_hadir}x 
        &nbsp;<i class="fa-regular fa-calendar-times" style="color:#F0AF43;"></i>
        <strong style="color:#4F280C;">Izin/Sakit:</strong> ${(p.total_izin || 0) + (p.total_sakit || 0)}x
        &nbsp;<i class="fa-solid fa-triangle-exclamation" style="color:#e05c4b;font-size:11px;"></i>
        <strong style="color:#4F280C;">Alpa:</strong> ${p.total_alpa || 0}x
      </div>
    </div>
  </div>`
}

function buildDetailHTML(data) {
  const { peserta, mentor, kelas, kemajuan, penilaian, kehadiran_summary, riwayat_kehadiran, catatan_mentor } = data
  const kh = kehadiran_summary || {}
  const totalKh = (kh.hadir||0)+(kh.izin||0)+(kh.sakit||0)+(kh.alpa||0)
  const pctH = totalKh > 0 ? Math.round((kh.hadir/totalKh)*100) : 0
  const avgNilai = (penilaian||[]).length > 0
    ? ((penilaian.reduce((s,n)=>s+(n.nilai_angka||0),0)/penilaian.length).toFixed(1))
    : '-'
  const kelasLabel = kelas?.nama_kelas || (peserta?.jenis === 'privat' ? 'Program Privat' : '-')

  return `
  <div style="padding:4px 0;color:#1a0a02;">
    <!-- Profile Header -->
    <div style="background:linear-gradient(135deg,#221104,#3a1c08);border-radius:16px;padding:24px;margin-bottom:20px;
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div style="width:64px;height:64px;border-radius:50%;flex-shrink:0;
        background:linear-gradient(135deg,#4F280C,#D4934E);
        display:flex;align-items:center;justify-content:center;
        font-size:26px;font-weight:700;color:#fdf0e2;">
        ${peserta?.nama_lengkap?.charAt(0) || '?'}
      </div>
      <div style="flex:1;">
        <h2 style="color:#fdf0e2;font-size:1.2rem;margin-bottom:6px;">${peserta?.nama_lengkap || '-'}</h2>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-person" style="color:#F0AF43;"></i> ${peserta?.usia ? peserta.usia+' tahun' : '-'}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-layer-group" style="color:#F0AF43;"></i> ${kelasLabel}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-user-tie" style="color:#F0AF43;"></i> ${mentor?.nama || 'Belum ditentukan'}</span>
          ${kelas?.hari_jadwal ? `<span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${kelas.hari_jadwal} ${kelas.jam_jadwal||''}</span>` : ''}
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button onclick="printRapor(${peserta?.id},'${peserta?.nama_lengkap}')"
          style="padding:9px 16px;border-radius:10px;border:1px solid rgba(240,175,67,0.3);
          background:rgba(240,175,67,0.12);color:#F0AF43;font-size:13px;font-weight:600;cursor:pointer;
          transition:all 0.2s;" onmouseover="this.style.background='rgba(240,175,67,0.22)'" onmouseout="this.style.background='rgba(240,175,67,0.12)'">
          <i class="fa-solid fa-print"></i> Cetak Rapor
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">
      ${[
        [avgNilai, 'Rata Nilai', scoreColor(parseFloat(avgNilai)), 'fa-star'],
        [pctH+'%', 'Kehadiran', pctH>=80?'#10b981':pctH>=60?'#F0AF43':'#e05c4b', 'fa-calendar-check'],
        [kh.hadir||0, 'Total Hadir', '#10b981', 'fa-circle-check'],
        [(kh.izin||0)+(kh.sakit||0), 'Izin/Sakit', '#60a5fa', 'fa-memo-circle-info'],
        [kh.alpa||0, 'Alpa', '#e05c4b', 'fa-circle-exclamation'],
        [(penilaian||[]).length, 'Total Penilaian', '#F0AF43', 'fa-clipboard-check'],
      ].map(([val,lbl,clr,icon]) => `
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:14px 16px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:${clr};margin-bottom:4px;">${val}</div>
        <div style="font-size:11px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">${lbl}</div>
      </div>`).join('')}
    </div>

    <!-- Charts -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-bottom:20px;">
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;">
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-line" style="color:#F0AF43;"></i> Tren Nilai
        </div>
        <canvas id="chart-nilai" height="160"></canvas>
      </div>
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;">
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Rekap Kehadiran
        </div>
        <canvas id="chart-kehadiran" height="160"></canvas>
      </div>
    </div>

    <!-- Kemajuan Hafalan -->
    <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
      <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
        <i class="fa-solid fa-book-quran" style="color:#F0AF43;"></i> Riwayat Kemajuan Hafalan
      </h4>
      ${(kemajuan||[]).length === 0 ? '<p style="color:#81511D;font-size:13px;">Belum ada catatan kemajuan.</p>' :
        `<div style="display:flex;flex-direction:column;gap:0;">
          ${(kemajuan||[]).slice(0,10).map((k,i) => `
          <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;
            border-bottom:${i<(kemajuan.length-1)?'1px solid rgba(129,81,29,0.1)':'none'};">
            <div style="width:32px;height:32px;border-radius:50%;
              background:${k.status_kelancaran==='lancar'?'rgba(16,185,129,0.15)':k.status_kelancaran==='cukup'?'rgba(240,175,67,0.15)':'rgba(239,68,68,0.15)'};
              display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="ms" style="font-size:18px;color:${k.status_kelancaran==='lancar'?'#10b981':k.status_kelancaran==='cukup'?'#F0AF43':'#ef4444'};">
                ${k.status_kelancaran==='lancar'?'check_circle':k.status_kelancaran==='cukup'?'help':'replay'}
              </span>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;color:#1a0a02;font-size:13.5px;">
                ${k.kitab_surat} ${k.halaman_ayat ? '— '+k.halaman_ayat : ''}
              </div>
              ${k.catatan_hafalan ? `<div style="font-size:12px;color:#81511D;margin-top:2px;font-style:italic;">"${k.catatan_hafalan}"</div>` : ''}
            </div>
            <div style="font-size:11px;color:#81511D;white-space:nowrap;">${formatDate(k.tanggal)}</div>
          </div>`).join('')}
        </div>`}
    </div>

    <!-- Riwayat Kehadiran & Materi -->
    <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
      <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
        <i class="fa-solid fa-calendar-days" style="color:#10b981;"></i> Riwayat Kehadiran & Materi
      </h4>
      ${(riwayat_kehadiran||[]).length === 0 ? '<p style="color:#81511D;font-size:13px;">Belum ada catatan absensi.</p>' :
        `<div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background:#f8f4ee;">
                <th style="padding:9px 12px;text-align:left;color:#4F280C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;border-bottom:1px solid rgba(129,81,29,0.12);">Tanggal</th>
                <th style="padding:9px 12px;text-align:left;color:#4F280C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;border-bottom:1px solid rgba(129,81,29,0.12);">Status</th>
                <th style="padding:9px 12px;text-align:left;color:#4F280C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;border-bottom:1px solid rgba(129,81,29,0.12);">Materi Pembahasan</th>
                <th style="padding:9px 12px;text-align:left;color:#4F280C;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;border-bottom:1px solid rgba(129,81,29,0.12);">Catatan</th>
              </tr>
            </thead>
            <tbody>
              ${(riwayat_kehadiran||[]).slice(0,20).map((kh,i) => `
              <tr style="border-bottom:1px solid rgba(129,81,29,0.07);${i%2===1?'background:#fdf8f3;':''}">
                <td style="padding:9px 12px;color:#1a0a02;">${formatDate(kh.tanggal)}</td>
                <td style="padding:9px 12px;">${statusBadge(kh.status_hadir)}</td>
                <td style="padding:9px 12px;color:#4F280C;">${kh.materi_pembahasan||'-'}</td>
                <td style="padding:9px 12px;color:#81511D;font-size:12px;font-style:italic;">${kh.catatan_sesi||kh.perkembangan_materi||'-'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`}
    </div>

    <!-- Catatan Mentor -->
    ${(catatan_mentor||[]).length > 0 ? `
    <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;">
      <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
        <i class="fa-solid fa-comment-dots" style="color:#60a5fa;"></i> Catatan Ustadz/Ustadzah
      </h4>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${(catatan_mentor||[]).slice(0,5).map(c => `
        <div style="background:#f8f4ee;border-left:3px solid #F0AF43;border-radius:0 10px 10px 0;padding:12px 16px;">
          <div style="font-size:11px;color:#81511D;margin-bottom:4px;">${formatDate(c.tanggal)}</div>
          <div style="font-size:13.5px;color:#1a0a02;line-height:1.7;">${c.isi_catatan}</div>
        </div>`).join('')}
      </div>
    </div>` : ''}
  </div>`
}

async function renderDetailCharts(pesertaId, data) {
  try {
    const charts = await waliService.getChartDataPeserta(pesertaId)
    // Chart Nilai
    const nilaiData = (charts.penilaian||[]).slice(-12)
    const chartNilaiEl = document.getElementById('chart-nilai')
    if (nilaiData.length > 0 && chartNilaiEl) {
      new Chart(chartNilaiEl, {
        type: 'line',
        data: {
          labels: nilaiData.map(n => formatDateShort(n.tanggal)),
          datasets: [{
            label: 'Nilai',
            data: nilaiData.map(n => n.nilai_angka),
            borderColor: '#F0AF43', backgroundColor: 'rgba(240,175,67,0.15)',
            tension: 0.4, fill: true, pointRadius: 4,
          }]
        },
        options: {
          responsive: true, plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      })
    } else if (chartNilaiEl && chartNilaiEl.parentElement) {
      chartNilaiEl.parentElement.innerHTML = `
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-line" style="color:#F0AF43;"></i> Tren Nilai
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-chart-line" style="font-size:26px;margin-bottom:8px;color:#d97706;"></i>
          Belum ada riwayat penilaian
        </div>`
    }

    // Chart Kehadiran
    const kh = data.kehadiran_summary || {}
    const totalKh = (kh.hadir||0) + (kh.izin||0) + (kh.sakit||0) + (kh.alpa||0)
    const chartKehadiranEl = document.getElementById('chart-kehadiran')
    if (totalKh > 0 && chartKehadiranEl) {
      new Chart(chartKehadiranEl, {
        type: 'doughnut',
        data: {
          labels: ['Hadir', 'Izin', 'Sakit', 'Alpa'],
          datasets: [{
            data: [kh.hadir||0, kh.izin||0, kh.sakit||0, kh.alpa||0],
            backgroundColor: ['#10b981','#F0AF43','#60a5fa','#e05c4b'],
          }]
        },
        options: {
          responsive: true, cutout: '65%',
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 12 } } } }
        }
      })
    } else if (chartKehadiranEl && chartKehadiranEl.parentElement) {
      chartKehadiranEl.parentElement.innerHTML = `
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Rekap Kehadiran
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-calendar-check" style="font-size:26px;margin-bottom:8px;color:#10b981;"></i>
          Belum ada catatan absensi
        </div>`
    }
  } catch(e) { /* chart tidak critical */ }
}

// ── Helpers ─────────────────────────────────────────────────
function scoreColor(v) {
  v = parseFloat(v)
  if (isNaN(v)) return '#81511D'
  if (v >= 80) return '#10b981'
  if (v >= 65) return '#F0AF43'
  return '#e05c4b'
}

function statusBadge(status) {
  const map = {
    hadir: ['check_circle', '#10b981', 'rgba(16,185,129,0.12)', 'Hadir'],
    izin:  ['description',  '#F0AF43',  'rgba(240,175,67,0.12)', 'Izin'],
    sakit: ['sick',         '#60a5fa',  'rgba(59,130,246,0.12)', 'Sakit'],
    alpa:  ['cancel',       '#e05c4b',  'rgba(239,68,68,0.12)',  'Alpa'],
  }
  const [icon, clr, bg, label] = map[status] || ['help', '#81511D', 'rgba(0,0,0,0.06)', status]
  return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
    border-radius:20px;background:${bg};color:${clr};font-size:12px;font-weight:600;">
    <span class="ms" style="font-size:15px;">${icon}</span> ${label}</span>`
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
}

function formatDateShort(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day:'numeric', month:'short' })
}
