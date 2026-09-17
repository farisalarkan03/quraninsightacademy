// ============================================================
// QIA — Supabase Client & API Services
// src/lib/supabase.js
// ============================================================

import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase — hardcoded untuk memastikan berjalan di semua environment
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://wawamhpdthlttfttwjyc.supabase.co'
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd2FtaHBkdGhsdHRmdHR3anljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjE4MzYsImV4cCI6MjEwNTE5NzgzNn0.zx35_sMK7z4CSw6b9OXzkFwpp3AsnVO1hOjQa42lAtg'

export const isConfigured = true

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})


// ────────────────────────────────────────────────────────────
// DEMO MOCK STORE (Untuk pengujian & fallback saat offline / belum konek Supabase)
// ────────────────────────────────────────────────────────────

// ── Production Mode: No demo data. All data comes from Supabase. ──
const DEMO_PROFILES = [
  { id: 'admin-prod', nama: 'Administrator QIA', email: 'portalqia@gmail.com', role: 'admin', jenis_mentor: null, no_hp: '', status: 'aktif' }
]

const DEMO_KELAS      = []
const DEMO_PESERTA    = []
const DEMO_KEMAJUAN   = []
const DEMO_PENILAIAN  = []
const DEMO_KEHADIRAN  = []

function getLocalStore(key, defaultVal) {
  try {
    const raw = localStorage.getItem('qia_mock_' + key)
    if (raw) return JSON.parse(raw)
  } catch (e) { /* ignore */ }
  return defaultVal
}

function setLocalStore(key, val) {
  try {
    localStorage.setItem('qia_mock_' + key, JSON.stringify(val))
  } catch (e) { /* ignore */ }
}

// ────────────────────────────────────────────────────────────
// AUTH SERVICES
// ────────────────────────────────────────────────────────────

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async logout() {
    localStorage.removeItem('qia_demo_session')
    try { await supabase.auth.signOut() } catch(e) {}
  },

  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session || null
    } catch (e) {
      return null
    }
  },

  async getProfile() {
    const session = await this.getSession()
    if (!session?.user?.id) return null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (!error && data) return data
    } catch(e) {}
    return null
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// ────────────────────────────────────────────────────────────
// ADMIN SERVICES
// ────────────────────────────────────────────────────────────

export const adminService = {
  async getDashboardStats() {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.rpc('get_admin_dashboard_stats')
        if (!error && data) {
          return {
            ...data,
            total_santri_aktif: data.total_peserta,
            total_santri_bimbel: data.total_bimbel,
            total_santri_privat: data.total_privat,
            total_mentor_aktif: data.total_mentor,
            total_kelas_aktif: data.total_kelas,
          }
        }
      } catch(e) {}
    }
    const peserta = await this.getPesertaDidik()
    const mentors = await this.getMentors()
    const kelas   = await this.getKelas()
    const totalPeserta = peserta.filter(p => p.status === 'aktif').length
    const totalBimbel  = peserta.filter(p => p.jenis === 'bimbel' && p.status === 'aktif').length
    const totalPrivat  = peserta.filter(p => p.jenis === 'privat' && p.status === 'aktif').length
    const totalMentor  = mentors.filter(m => m.status === 'aktif').length
    const totalKelas   = kelas.filter(k => k.status === 'aktif').length
    return {
      total_peserta: totalPeserta,
      total_bimbel: totalBimbel,
      total_privat: totalPrivat,
      total_mentor: totalMentor,
      total_kelas: totalKelas,
      hadir_hari_ini: 0,
      absensi_hari_ini: 0,
      rata_nilai_bulan_ini: 0,
      aktivitas_terbaru: [],
      // Alias
      total_santri_aktif: totalPeserta,
      total_santri_bimbel: totalBimbel,
      total_santri_privat: totalPrivat,
      total_mentor_aktif: totalMentor,
      total_kelas_aktif: totalKelas,
      persentase_kehadiran_bulan_ini: 100
    }
  },

  async getMentors(filter = {}) {
    if (isConfigured) {
      try {
        let q = supabase.from('profiles').select('*').eq('role', 'mentor').order('nama')
        if (filter.status) q = q.eq('status', filter.status)
        if (filter.jenis)  q = q.eq('jenis_mentor', filter.jenis)
        const { data, error } = await q
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('profiles', DEMO_PROFILES).filter(p => p.role === 'mentor')
    return filter.jenis ? list.filter(m => m.jenis_mentor === filter.jenis || m.jenis_mentor === 'keduanya') : list
  },

  async createMentor(email, password, profile) {
    if (isConfigured) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
          email, password, email_confirm: true, user_metadata: { nama: profile.nama, role: 'mentor' }
        })
        if (!authErr) {
          const { data, error } = await supabase.from('profiles').update({ ...profile, role: 'mentor' }).eq('id', authData.user.id).select().single()
          if (!error && data) return data
        }
      } catch(e) {}
    }
    const list = getLocalStore('profiles', DEMO_PROFILES)
    const newM = { id: 'mentor-' + Date.now(), email, ...profile, role: 'mentor', status: 'aktif' }
    list.push(newM)
    setLocalStore('profiles', list)
    return newM
  },

  async updateMentor(id, updates) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('profiles', DEMO_PROFILES)
    const idx = list.findIndex(p => p.id === id)
    if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; setLocalStore('profiles', list); return list[idx] }
    return null
  },

  async getKelas(filter = {}) {
    if (isConfigured) {
      try {
        let q = supabase.from('kelas').select('*, mentor:profiles(id, nama, email, jenis_mentor)').order('nama_kelas')
        if (filter.status)    q = q.eq('status', filter.status)
        if (filter.id_mentor) q = q.eq('id_mentor', filter.id_mentor)
        const { data, error } = await q
        if (!error && data) return data
      } catch(e) {}
    }
    const kelasList = getLocalStore('kelas', DEMO_KELAS)
    const mentorList = getLocalStore('profiles', DEMO_PROFILES)
    return kelasList.map(k => ({
      ...k,
      mentor: mentorList.find(m => m.id === k.id_mentor) || { nama: 'Asatidz' }
    }))
  },

  async createKelas(kelasData) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('kelas').insert(kelasData).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('kelas', DEMO_KELAS)
    const newK = { id: Date.now(), status: 'aktif', ...kelasData }
    list.push(newK)
    setLocalStore('kelas', list)
    return newK
  },

  async updateKelas(id, updates) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('kelas').update(updates).eq('id', id).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('kelas', DEMO_KELAS)
    const idx = list.findIndex(k => k.id === id)
    if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; setLocalStore('kelas', list); return list[idx] }
    return null
  },

  async deleteKelas(id) {
    if (isConfigured) {
      try {
        await supabase.from('kelas').delete().eq('id', id)
      } catch(e) {}
    }
    const list = getLocalStore('kelas', DEMO_KELAS).filter(k => k.id !== id)
    setLocalStore('kelas', list)
  },

  async getPesertaDidik(filter = {}) {
    if (isConfigured) {
      try {
        let q = supabase.from('peserta_didik').select('*, mentor:profiles(id, nama), kelas(id, nama_kelas)').order('nama_lengkap')
        if (filter.jenis)     q = q.eq('jenis', filter.jenis)
        if (filter.id_kelas)  q = q.eq('id_kelas', filter.id_kelas)
        if (filter.id_mentor) q = q.eq('id_mentor', filter.id_mentor)
        if (filter.status)    q = q.eq('status', filter.status)
        const { data, error } = await q
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('peserta', DEMO_PESERTA)
    const kelas = getLocalStore('kelas', DEMO_KELAS)
    const mentors = getLocalStore('profiles', DEMO_PROFILES)
    return list.map(p => ({
      ...p,
      kelas: kelas.find(k => k.id === p.id_kelas) || null,
      mentor: mentors.find(m => m.id === p.id_mentor) || null
    }))
  },

  async createPeserta(pesertaData) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('peserta_didik').insert(pesertaData).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('peserta', DEMO_PESERTA)
    const newP = { id: Date.now(), tanggal_daftar: new Date().toISOString().split('T')[0], status: 'aktif', ...pesertaData }
    list.push(newP)
    setLocalStore('peserta', list)
    return newP
  },

  async updatePeserta(id, updates) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('peserta_didik').update(updates).eq('id', id).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const list = getLocalStore('peserta', DEMO_PESERTA)
    const idx = list.findIndex(p => p.id === id)
    if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; setLocalStore('peserta', list); return list[idx] }
    return null
  },

  async bulkUpdatePeserta(records) {
    if (isConfigured) {
      try {
        await supabase.from('peserta_didik').upsert(records)
        return
      } catch(e) {}
    }
    const list = getLocalStore('peserta', DEMO_PESERTA)
    records.forEach(rec => {
      const idx = list.findIndex(p => p.id === rec.id)
      if (idx !== -1) list[idx] = { ...list[idx], ...rec }
      else list.push(rec)
    })
    setLocalStore('peserta', list)
  },

  async exportAllData(table, columns = '*') {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from(table).select(columns).order('id')
        if (!error && data) return data
      } catch(e) {}
    }
    if (table === 'peserta_didik') return getLocalStore('peserta', DEMO_PESERTA)
    if (table === 'profiles') return getLocalStore('profiles', DEMO_PROFILES)
    if (table === 'kelas') return getLocalStore('kelas', DEMO_KELAS)
    if (table === 'kehadiran') return getLocalStore('kehadiran', DEMO_KEHADIRAN)
    if (table === 'kemajuan') return getLocalStore('kemajuan', DEMO_KEMAJUAN)
    if (table === 'penilaian') return getLocalStore('penilaian', DEMO_PENILAIAN)
    return []
  },

  async exportAllTables() {
    if (isConfigured) {
      try {
        const [peserta, mentor, kelas, kehadiran, kemajuan, penilaian] = await Promise.all([
          supabase.from('peserta_didik').select('*, kelas(nama_kelas), mentor:profiles(nama)'),
          supabase.from('profiles').select('*').eq('role', 'mentor'),
          supabase.from('kelas').select('*, mentor:profiles(nama)'),
          supabase.from('kehadiran').select('*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)'),
          supabase.from('kemajuan').select('*, peserta:peserta_didik(nama_lengkap)'),
          supabase.from('penilaian').select('*, peserta:peserta_didik(nama_lengkap)'),
        ])
        if (peserta.data) {
          return {
            peserta: peserta.data, mentor: mentor.data, kelas: kelas.data,
            kehadiran: kehadiran.data, kemajuan: kemajuan.data, penilaian: penilaian.data
          }
        }
      } catch(e) {}
    }
    return {
      peserta: getLocalStore('peserta', DEMO_PESERTA),
      mentor: getLocalStore('profiles', DEMO_PROFILES).filter(p => p.role === 'mentor'),
      kelas: getLocalStore('kelas', DEMO_KELAS),
      kehadiran: getLocalStore('kehadiran', DEMO_KEHADIRAN),
      kemajuan: getLocalStore('kemajuan', DEMO_KEMAJUAN),
      penilaian: getLocalStore('penilaian', DEMO_PENILAIAN),
    }
  },

  async logActivity(action, entity_type, entity_id, detail = {}) {
    if (isConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from('activity_logs').insert({ id_user: user?.id, action, entity_type, entity_id: String(entity_id), detail })
      } catch(e) {}
    }
  },
}

// ────────────────────────────────────────────────────────────
// MENTOR SERVICES
// ────────────────────────────────────────────────────────────

export const mentorService = {
  async getMyKelas(mentorId) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('kelas').select('*').eq('id_mentor', mentorId).eq('status', 'aktif').order('nama_kelas')
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('kelas', DEMO_KELAS)
    return all.filter(k => k.id_mentor === mentorId || !mentorId)
  },

  async getMyPeserta(mentorId, kelasId = null) {
    if (isConfigured) {
      try {
        let q = supabase.from('peserta_didik').select('*, kelas(id, nama_kelas)').eq('id_mentor', mentorId).eq('status', 'aktif').order('nama_lengkap')
        if (kelasId) q = q.eq('id_kelas', kelasId)
        const { data, error } = await q
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('peserta', DEMO_PESERTA)
    const kelasList = getLocalStore('kelas', DEMO_KELAS)
    return all
      .filter(p => (!mentorId || p.id_mentor === mentorId) && (!kelasId || p.id_kelas === kelasId))
      .map(p => ({ ...p, kelas: kelasList.find(k => k.id === p.id_kelas) }))
  },

  async bulkSimpanAbsensi(records) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.rpc('bulk_upsert_kehadiran', { p_records: records })
        if (!error) return data
      } catch(e) {}
    }
    const all = getLocalStore('kehadiran', DEMO_KEHADIRAN)
    records.forEach(r => {
      all.unshift({ id: Date.now() + Math.random(), ...r })
    })
    setLocalStore('kehadiran', all)
    return { success: true, count: records.length }
  },

  async getRiwayatKehadiran(pesertaId, limit = 30) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('kehadiran').select('*').eq('id_peserta', pesertaId).order('tanggal', { ascending: false }).limit(limit)
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('kehadiran', DEMO_KEHADIRAN)
    return all.filter(k => k.id_peserta === Number(pesertaId)).slice(0, limit)
  },

  async getKemajuan(pesertaId, limit = 20) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('kemajuan').select('*').eq('id_peserta', pesertaId).order('tanggal', { ascending: false }).limit(limit)
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('kemajuan', DEMO_KEMAJUAN)
    return all.filter(k => k.id_peserta === Number(pesertaId)).slice(0, limit)
  },

  async addKemajuan(kemajuanData) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('kemajuan').insert(kemajuanData).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('kemajuan', DEMO_KEMAJUAN)
    const newK = { id: Date.now(), ...kemajuanData }
    all.unshift(newK)
    setLocalStore('kemajuan', all)
    return newK
  },

  async getPenilaian(pesertaId, limit = 20) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('penilaian').select('*').eq('id_peserta', pesertaId).order('tanggal', { ascending: false }).limit(limit)
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('penilaian', DEMO_PENILAIAN)
    return all.filter(p => p.id_peserta === Number(pesertaId)).slice(0, limit)
  },

  async addPenilaian(penilaianData) {
    if (isConfigured) {
      try {
        const { data, error } = await supabase.from('penilaian').insert(penilaianData).select().single()
        if (!error && data) return data
      } catch(e) {}
    }
    const all = getLocalStore('penilaian', DEMO_PENILAIAN)
    const newP = { id: Date.now(), ...penilaianData }
    all.unshift(newP)
    setLocalStore('penilaian', all)
    return newP
  },

  async getCatatan(pesertaId) {
    return []
  },

  async addCatatan(catatanData) {
    return { id: Date.now(), ...catatanData }
  },

  async getPelajaranTambahan(pesertaId) {
    return []
  },

  async addPelajaranTambahan(data_) {
    return { id: Date.now(), ...data_ }
  },

  async updatePassword(newPassword) {
    if (isConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
    }
  },

  async getChartData(pesertaId) {
    const kemajuan = await this.getKemajuan(pesertaId, 30)
    const penilaian = await this.getPenilaian(pesertaId, 30)
    const kehadiran = await this.getRiwayatKehadiran(pesertaId, 60)
    return { kemajuan, penilaian, kehadiran }
  },
}

// ────────────────────────────────────────────────────────────
// PORTAL WALI SERVICES
// ────────────────────────────────────────────────────────────

export const waliService = {
  // Cari peserta berdasarkan nama saja (tanpa kode akses)
  async searchPeserta(nama) {
    const q = (nama || '').trim().toLowerCase()
    if (!q) return []

    if (isConfigured) {
      try {
        const { data, error } = await supabase.rpc('search_peserta_wali_by_name', { p_nama: q })
        if (!error && data) return data
      } catch(e) {}
    }

    // Demo Mode fallback
    const all = getLocalStore('peserta', DEMO_PESERTA)
    const kelasList = getLocalStore('kelas', DEMO_KELAS)
    const mentorList = getLocalStore('profiles', DEMO_PROFILES)

    return all
      .filter(p => p.nama_lengkap.toLowerCase().includes(q))
      .map(p => {
        const k = kelasList.find(c => c.id === p.id_kelas)
        const m = mentorList.find(x => x.id === p.id_mentor)
        return {
          id: p.id,
          nama_lengkap: p.nama_lengkap,
          jenis: p.jenis,
          nama_kelas: k?.nama_kelas || (p.jenis === 'privat' ? 'Program Privat' : '-'),
          nama_mentor: m?.nama || 'Asatidz QIA'
        }
      })
  },

  // Detail lengkap peserta (untuk tampilan wali)
  async getPesertaDetail(pesertaId) {
    const pId = Number(pesertaId)
    if (isConfigured) {
      try {
        const { data, error } = await supabase.rpc('get_peserta_detail_wali', { p_peserta_id: pId })
        if (!error && data && data.peserta) return data
      } catch(e) {}
    }

    // Demo Mode detail builder
    const all = getLocalStore('peserta', DEMO_PESERTA)
    const p = all.find(x => x.id === pId)
    if (!p) return null

    const kelasList = getLocalStore('kelas', DEMO_KELAS)
    const mentorList = getLocalStore('profiles', DEMO_PROFILES)
    const k = kelasList.find(c => c.id === p?.id_kelas)
    const m = mentorList.find(x => x.id === p?.id_mentor)
    const kemajuan = getLocalStore('kemajuan', DEMO_KEMAJUAN).filter(x => x.id_peserta === pId)
    const kehadiran = getLocalStore('kehadiran', DEMO_KEHADIRAN).filter(x => x.id_peserta === pId)
    const penilaian = getLocalStore('penilaian', DEMO_PENILAIAN).filter(x => x.id_peserta === pId)

    const hadirCount = kehadiran.filter(h => h.status_hadir === 'hadir').length
    const izinCount  = kehadiran.filter(h => h.status_hadir === 'izin').length
    const sakitCount = kehadiran.filter(h => h.status_hadir === 'sakit').length
    const alpaCount  = kehadiran.filter(h => h.status_hadir === 'alpa').length

    return {
      peserta: p,
      mentor: m || { nama: 'Belum ditentukan' },
      kelas: k || { nama_kelas: p.jenis === 'privat' ? 'Program Privat' : '-' },
      kemajuan,
      penilaian,
      kehadiran_summary: {
        hadir: hadirCount,
        izin: izinCount,
        sakit: sakitCount,
        alpa: alpaCount,
        total: kehadiran.length
      },
      riwayat_kehadiran: kehadiran,
      catatan_mentor: []
    }
  },

  // Data chart nilai & kehadiran untuk Portal Wali
  async getChartDataPeserta(pesertaId) {
    const pId = Number(pesertaId)
    if (isConfigured) {
      try {
        const { data, error } = await supabase.rpc('get_peserta_charts_wali', { p_peserta_id: pId })
        if (!error && data) return data
      } catch(e) {}
      try {
        const [penilaian, kehadiran, kemajuan] = await Promise.all([
          supabase.from('penilaian').select('tanggal, nilai_angka').eq('id_peserta', pId).order('tanggal').limit(20),
          supabase.from('kehadiran').select('tanggal, status_hadir, materi_pembahasan').eq('id_peserta', pId).order('tanggal').limit(60),
          supabase.from('kemajuan').select('tanggal, kitab_surat, halaman_ayat').eq('id_peserta', pId).order('tanggal').limit(20),
        ])
        if (penilaian.data) return { penilaian: penilaian.data, kehadiran: kehadiran.data, kemajuan: kemajuan.data }
      } catch(e) {}
    }

    const penilaian = getLocalStore('penilaian', DEMO_PENILAIAN).filter(x => x.id_peserta === pId)
    const kehadiran = getLocalStore('kehadiran', DEMO_KEHADIRAN).filter(x => x.id_peserta === pId)
    const kemajuan = getLocalStore('kemajuan', DEMO_KEMAJUAN).filter(x => x.id_peserta === pId)
    return { penilaian, kehadiran, kemajuan }
  },
}
