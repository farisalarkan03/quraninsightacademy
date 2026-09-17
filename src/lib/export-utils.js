// ============================================================
// QIA — Export Utilities (CSV & Excel)
// src/lib/export-utils.js
// ============================================================

import * as XLSX from 'xlsx'

// ────────────────────────────────────────────────────────────
// Helper: Flatten nested object (untuk export nested joins)
// ────────────────────────────────────────────────────────────
function flattenObject(obj, prefix = '') {
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}_${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      Object.assign(result, flattenObject(v, key))
    } else if (!Array.isArray(v)) {
      result[key] = v
    }
  }
  return result
}

// ────────────────────────────────────────────────────────────
// Export ke CSV
// ────────────────────────────────────────────────────────────
export function exportToCSV(data, filename = 'export') {
  if (!data || !data.length) { alert('Tidak ada data untuk diekspor.'); return }
  const flat = data.map(row => flattenObject(row))
  const headers = [...new Set(flat.flatMap(Object.keys))]
  const csvRows = [
    headers.join(','),
    ...flat.map(row =>
      headers.map(h => {
        const val = row[h] ?? ''
        const str = String(val).replace(/"/g, '""')
        return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str
      }).join(',')
    )
  ]
  const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

// ────────────────────────────────────────────────────────────
// Export ke Excel (.xlsx) — satu sheet
// ────────────────────────────────────────────────────────────
export function exportToExcel(data, filename = 'export', sheetName = 'Data') {
  if (!data || !data.length) { alert('Tidak ada data untuk diekspor.'); return }
  const flat = data.map(row => flattenObject(row))
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  // Auto column width
  const cols = Object.keys(flat[0] || {}).map(k => ({
    wch: Math.max(k.length, ...flat.map(r => String(r[k] ?? '').length))
  }))
  ws['!cols'] = cols
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ────────────────────────────────────────────────────────────
// Export multi-sheet Excel (semua tabel sekaligus)
// ────────────────────────────────────────────────────────────
export function exportAllToExcel(tables, filename = 'QIA_DataLengkap') {
  const wb = XLSX.utils.book_new()
  for (const [name, data] of Object.entries(tables)) {
    if (!data || !data.length) continue
    const flat = data.map(row => flattenObject(row))
    const ws = XLSX.utils.json_to_sheet(flat)
    const cols = Object.keys(flat[0] || {}).map(k => ({
      wch: Math.max(k.length, ...flat.map(r => String(r[k] ?? '').length))
    }))
    ws['!cols'] = cols
    XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 31)) // Excel sheet name max 31 chars
  }
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

// ────────────────────────────────────────────────────────────
// Export JSON
// ────────────────────────────────────────────────────────────
export function exportToJSON(data, filename = 'export') {
  if (!data || !data.length) { alert('Tidak ada data untuk diekspor.'); return }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${filename}.json`)
}

// ────────────────────────────────────────────────────────────
// Generate PDF print preview via browser print
// ────────────────────────────────────────────────────────────
export function printRaporPeserta(pesertaData) {
  const { peserta, mentor, kelas, kemajuan, penilaian, kehadiran_summary, riwayat_kehadiran, catatan_mentor } = pesertaData
  const kehadiran = kehadiran_summary || {}
  const nilaiList = (penilaian || []).slice(0, 10)
  const kemajuanList = (kemajuan || []).slice(0, 10)
  const totalPertemuan = (kehadiran.hadir || 0) + (kehadiran.izin || 0) + (kehadiran.sakit || 0) + (kehadiran.alpa || 0)
  const pctHadir = totalPertemuan > 0 ? Math.round((kehadiran.hadir / totalPertemuan) * 100) : 0
  const avgNilai = nilaiList.length > 0
    ? (nilaiList.reduce((s, n) => s + (n.nilai_angka || 0), 0) / nilaiList.length).toFixed(1)
    : '-'

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rapor — ${peserta?.nama_lengkap || ''}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1a0a02; background: #fff; padding: 20px; }
  .header { text-align: center; border-bottom: 3px solid #F0AF43; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; color: #221104; }
  .header p { color: #81511D; font-size: 13px; }
  .badge { display: inline-block; background: #221104; color: #F0AF43; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .info-card { background: #fdf0e2; border: 1px solid #e8d4bc; border-radius: 10px; padding: 14px; }
  .info-card h3 { font-size: 12px; color: #81511D; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .info-card .val { font-size: 15px; font-weight: 600; color: #1a0a02; }
  .stat-row { display: flex; gap: 12px; margin-bottom: 20px; }
  .stat-box { flex: 1; text-align: center; background: #221104; color: #fdf0e2; border-radius: 10px; padding: 12px 8px; }
  .stat-box .n { font-size: 24px; font-weight: 700; color: #F0AF43; }
  .stat-box .l { font-size: 11px; opacity: 0.7; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
  th { background: #221104; color: #F0AF43; padding: 8px 10px; text-align: left; font-size: 12px; }
  td { padding: 7px 10px; border-bottom: 1px solid #e8d4bc; }
  tr:nth-child(even) td { background: #fdf8f3; }
  h2.section { font-size: 14px; color: #221104; border-left: 3px solid #F0AF43; padding-left: 10px; margin: 16px 0 10px; }
  .footer { text-align: center; font-size: 11px; color: #81511D; margin-top: 24px; border-top: 1px solid #e8d4bc; padding-top: 12px; }
</style>
</head>
<body>
<div class="header">
  <h1>📖 Quran Insight Academy</h1>
  <p>Laporan Perkembangan Peserta Didik</p>
  <span class="badge">${peserta?.jenis?.toUpperCase() || 'BIMBEL'}</span>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>Nama Peserta Didik</h3>
    <div class="val">${peserta?.nama_lengkap || '-'}</div>
  </div>
  <div class="info-card">
    <h3>Kelas / Program</h3>
    <div class="val">${kelas?.nama_kelas || (peserta?.jenis === 'privat' ? 'Privat' : '-')}</div>
  </div>
  <div class="info-card">
    <h3>Mentor / Ustadz</h3>
    <div class="val">${mentor?.nama || '-'}</div>
  </div>
  <div class="info-card">
    <h3>Rata-rata Nilai</h3>
    <div class="val" style="color:#059669; font-size:20px;">${avgNilai}</div>
  </div>
</div>

<h2 class="section">Rekap Kehadiran</h2>
<div class="stat-row">
  <div class="stat-box"><div class="n">${kehadiran.hadir || 0}</div><div class="l">Hadir</div></div>
  <div class="stat-box"><div class="n">${kehadiran.izin || 0}</div><div class="l">Izin</div></div>
  <div class="stat-box"><div class="n">${kehadiran.sakit || 0}</div><div class="l">Sakit</div></div>
  <div class="stat-box"><div class="n">${kehadiran.alpa || 0}</div><div class="l">Alpa</div></div>
  <div class="stat-box" style="background:#059669;"><div class="n" style="color:#fff;">${pctHadir}%</div><div class="l">Kehadiran</div></div>
</div>

<h2 class="section">Riwayat Kemajuan Hafalan</h2>
<table>
  <tr><th>Tanggal</th><th>Kitab / Surah</th><th>Halaman / Ayat</th><th>Status</th></tr>
  ${kemajuanList.map(k => `<tr><td>${k.tanggal||''}</td><td>${k.kitab_surat||''}</td><td>${k.halaman_ayat||''}</td><td>${k.status_kelancaran||''}</td></tr>`).join('')}
</table>

<h2 class="section">Riwayat Penilaian</h2>
<table>
  <tr><th>Tanggal</th><th>Nilai</th><th>Adab</th><th>Tajwid</th><th>Kelancaran</th><th>Catatan</th></tr>
  ${nilaiList.map(n => `<tr><td>${n.tanggal||''}</td><td><b>${n.nilai_angka||'-'}</b></td><td>${n.nilai_adab||'-'}</td><td>${n.nilai_tajwid||'-'}</td><td>${n.nilai_kelancaran||'-'}</td><td>${n.catatan||''}</td></tr>`).join('')}
</table>

${catatan_mentor?.length ? `
<h2 class="section">Catatan Mentor</h2>
<table>
  <tr><th>Tanggal</th><th>Catatan</th></tr>
  ${(catatan_mentor || []).slice(0,5).map(c => `<tr><td>${c.tanggal||''}</td><td>${c.isi_catatan||''}</td></tr>`).join('')}
</table>` : ''}

<div class="footer">
  Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })} — Quran Insight Academy
</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body></html>`

  const win = window.open('', '_blank', 'width=800,height=900')
  win.document.write(html)
  win.document.close()
}

// ────────────────────────────────────────────────────────────
// Helper: Download blob
// ────────────────────────────────────────────────────────────
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}
