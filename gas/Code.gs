// ============================================================
// PORTAL QIA — Google Apps Script Backend
// Arsitektur: Blogger → GAS Web App → Google Spreadsheet
// ============================================================

// ---- KONFIGURASI ----
var SPREADSHEET_ID = '10HLucDVAqKOsqoB1CVUa5ZNfaBVLu10Gi8dUIVBRNB4';
var TEMPLATE_DOC_ID = '1pwnweYVNhAuv67iq5AVYV7vqzST7iY5y'; // untuk ekspor PDF
var LAPORAN_FOLDER_ID = '1JWMMGlXaoIIs5ra2D7BlJgLQGEVBLIwx';      // folder arsip PDF
var TOKEN_EXPIRY_HOURS = 8;
var CACHE_TTL = 600; // detik (10 menit)

// Karakter aman untuk kode akses wali (tidak ada 0/O, 1/I yang mirip)
var KODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// ============================================================
// ROUTER UTAMA
// ============================================================

function doGet(e) {
  var p = (e && e.parameter && (e.parameter.page || e.parameter.p)) || '';
  var action = (e && e.parameter && e.parameter.action) || '';

  // Jika ada parameter action, jalankan sebagai API (mengembalikan JSON)
  if (action) {
    return handleRequest(e);
  }

  // Jika diakses via browser URL (tanpa action), render tampilan UI HTML
  if (p === 'admin') {
    return HtmlService.createHtmlOutputFromFile('portal-admin')
      .setTitle('Admin Portal — Quran Insight Academy')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  if (p === 'mentor') {
    return HtmlService.createHtmlOutputFromFile('portal-mentor')
      .setTitle('Mentor Portal — Quran Insight Academy')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Default saat membuka link Web App GAS langsung: tampilkan Portal Wali
  return HtmlService.createHtmlOutputFromFile('portal-wali')
    .setTitle('Portal Wali — Quran Insight Academy')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var params = {};
    if (e.postData && e.postData.contents) {
      try { params = JSON.parse(e.postData.contents); } catch(err) { params = e.parameter || {}; }
    } else {
      params = e.parameter || {};
    }

    var action = params.action || '';

    switch(action) {
      case 'adminLogin':       return respond(adminLogin(params));
      case 'mentorLogin':      return respond(mentorLogin(params));
      case 'logout':           return respond(logout(params));
      case 'gantiPassword':    return respond(gantiPassword(params));

      case 'addMentor':        return respond(requireAdmin(params, addMentor));
      case 'editMentor':       return respond(requireAdmin(params, editMentor));
      case 'deactivateMentor': return respond(requireAdmin(params, deactivateMentor));
      case 'getMentorList':    return respond(requireAdmin(params, getMentorList));

      case 'addPesertaDidik':        return respond(requireAdmin(params, addPesertaDidik));
      case 'editPesertaDidik':       return respond(requireAdmin(params, editPesertaDidik));
      case 'deactivatePesertaDidik': return respond(requireAdmin(params, deactivatePesertaDidik));
      case 'kirimUlangKodeAkses':    return respond(requireAdmin(params, kirimUlangKodeAkses));
      case 'getDashboardStats':      return respond(requireAdmin(params, getDashboardStats));
      case 'getExportData':          return respond(requireAdmin(params, getExportData));

      case 'getPesertaByMentor':        return respond(requireMentor(params, getPesertaByMentor));
      case 'updateKemajuan':            return respond(requireMentor(params, updateKemajuan));
      case 'addPenilaian':              return respond(requireMentor(params, addPenilaian));
      case 'addKehadiran':              return respond(requireMentor(params, addKehadiran));
      case 'addPelajaranTambahan':      return respond(requireMentor(params, addPelajaranTambahan));
      case 'addCatatanMentor':          return respond(requireMentor(params, addCatatanMentor));
      case 'getRiwayatPeserta':         return respond(requireMentor(params, getRiwayatPeserta));
      case 'generateDanKirimLaporanPDF':return respond(requireMentor(params, generateDanKirimLaporanPDF));
      case 'simpanLaporanSesi':         return respond(requireMentor(params, simpanLaporanSesi));

      case 'searchPesertaPublic': return respond(searchPesertaPublic(params));
      case 'getGrafikPeserta':    return respond(getGrafikPeserta(params));

      default: return respond({ ok: false, error: 'Action tidak dikenal: ' + action });
    }
  } catch(err) {
    return respond({ ok: false, error: 'Server error: ' + err.message });
  }
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// HELPER SPREADSHEET
// ============================================================

function getSheet(name) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    initSheetHeaders(sheet, name);
  }
  return sheet;
}

function initSheetHeaders(sheet, name) {
  var headers = {
    'Admin':             ['id_admin', 'nama', 'email', 'password_hash', 'created_at'],
    'Mentor':            ['id_mentor', 'nama', 'email', 'password_hash', 'jenis_mentor', 'status', 'created_at'],
    'PesertaDidik':      ['id_peserta', 'nama_lengkap', 'usia', 'jenis', 'id_mentor', 'nama_mentor', 'email_wali', 'kode_akses_wali', 'tanggal_daftar', 'status'],
    'Kemajuan':          ['id_log', 'id_peserta', 'nama_peserta', 'tanggal', 'kitab', 'halaman', 'catatan_hafalan', 'id_mentor'],
    'Penilaian':         ['id_penilaian', 'id_peserta', 'nama_peserta', 'tanggal', 'nilai', 'catatan', 'id_mentor'],
    'Kehadiran':         ['id_absen', 'id_peserta', 'nama_peserta', 'tanggal', 'status_hadir', 'keterangan', 'id_mentor'],
    'PelajaranTambahan': ['id', 'id_peserta', 'nama_peserta', 'nama_pelajaran', 'deskripsi', 'tanggal', 'id_mentor'],
    'CatatanMentor':     ['id', 'id_peserta', 'nama_peserta', 'tanggal', 'isi_catatan', 'id_mentor'],
    'Sessions':          ['token', 'id_user', 'role', 'nama', 'expired_at'],
    'EmailLog':          ['id_log', 'id_peserta', 'jenis', 'tanggal_kirim', 'status_kirim', 'keterangan']
  };
  if (headers[name]) {
    sheet.appendRow(headers[name]);
    sheet.getRange(1, 1, 1, headers[name].length).setFontWeight('bold');
  }
}

function sheetToArray(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  return data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
}

function generateId(prefix) {
  return prefix + '_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);
}

function nowStr() {
  return Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
}

function todayStr() {
  return Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
}

function getPesertaById(id_peserta) {
  var rows = sheetToArray(getSheet('PesertaDidik'));
  return rows.find(function(r) { return r.id_peserta === id_peserta; }) || null;
}

// ============================================================
// AUTENTIKASI & TOKEN
// ============================================================

function hashPassword(plain) {
  var salt = 'QIA_SALT_2024';
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + plain);
  return bytes.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

function generateToken() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var token = '';
  for (var i = 0; i < 64; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
  return token;
}

function createSession(id_user, role, nama) {
  var token = generateToken();
  var expired = new Date();
  expired.setHours(expired.getHours() + TOKEN_EXPIRY_HOURS);
  getSheet('Sessions').appendRow([token, id_user, role, nama, Utilities.formatDate(expired, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss')]);
  return token;
}

function validateToken(token, expectedRole) {
  if (!token) return null;
  var rows = sheetToArray(getSheet('Sessions'));
  var now = new Date();
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.token === token) {
      if (new Date(r.expired_at) < now) return null;
      if (expectedRole && r.role !== expectedRole) return null;
      return r;
    }
  }
  return null;
}

function deleteSession(token) {
  var sheet = getSheet('Sessions');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === token) { sheet.deleteRow(i + 1); return; }
  }
}

function requireAdmin(params, fn) {
  var session = validateToken(params.token, 'admin');
  if (!session) return { ok: false, error: 'Unauthorized: token admin tidak valid atau kedaluwarsa' };
  return fn(params, session);
}

function requireMentor(params, fn) {
  var session = validateToken(params.token, 'mentor') || validateToken(params.token, 'admin');
  if (!session) return { ok: false, error: 'Unauthorized: token tidak valid atau kedaluwarsa' };
  return fn(params, session);
}

// ============================================================
// AUTH ACTIONS
// ============================================================

function adminLogin(params) {
  var email = (params.email || '').trim().toLowerCase();
  var password = params.password || '';
  if (!email || !password) return { ok: false, error: 'Email dan password wajib diisi' };
  var hash = hashPassword(password);
  var rows = sheetToArray(getSheet('Admin'));
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.email.toLowerCase() === email && r.password_hash === hash) {
      return { ok: true, token: createSession(r.id_admin, 'admin', r.nama), nama: r.nama, role: 'admin' };
    }
  }
  return { ok: false, error: 'Email atau password salah' };
}

function mentorLogin(params) {
  var email = (params.email || '').trim().toLowerCase();
  var password = params.password || '';
  if (!email || !password) return { ok: false, error: 'Email dan password wajib diisi' };
  var hash = hashPassword(password);
  var rows = sheetToArray(getSheet('Mentor'));
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.email.toLowerCase() === email && r.password_hash === hash) {
      if (r.status !== 'aktif') return { ok: false, error: 'Akun mentor tidak aktif' };
      return { ok: true, token: createSession(r.id_mentor, 'mentor', r.nama), nama: r.nama, role: 'mentor', jenis_mentor: r.jenis_mentor, id_mentor: r.id_mentor };
    }
  }
  return { ok: false, error: 'Email atau password salah' };
}

function logout(params) {
  if (params.token) deleteSession(params.token);
  return { ok: true };
}

function gantiPassword(params) {
  var session = validateToken(params.token);
  if (!session) return { ok: false, error: 'Unauthorized' };
  var passwordBaru = params.password_baru || '';
  if (passwordBaru.length < 6) return { ok: false, error: 'Password minimal 6 karakter' };
  var hash = hashPassword(passwordBaru);
  var sheetName = session.role === 'admin' ? 'Admin' : 'Mentor';
  var idCol = session.role === 'admin' ? 'id_admin' : 'id_mentor';
  var sheet = getSheet(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf(idCol)] === session.id_user) {
      sheet.getRange(i + 1, headers.indexOf('password_hash') + 1).setValue(hash);
      return { ok: true };
    }
  }
  return { ok: false, error: 'User tidak ditemukan' };
}

// ============================================================
// ADMIN: MENTOR
// ============================================================

function getMentorList(params, session) {
  var rows = sheetToArray(getSheet('Mentor'));
  return { ok: true, data: rows.map(function(r) {
    return { id_mentor: r.id_mentor, nama: r.nama, email: r.email, jenis_mentor: r.jenis_mentor, status: r.status, created_at: r.created_at };
  })};
}

function addMentor(params, session) {
  var nama = (params.nama || '').trim();
  var email = (params.email || '').trim().toLowerCase();
  var password = params.password || '';
  var jenis = params.jenis_mentor || 'bimbel';
  if (!nama || !email || !password) return { ok: false, error: 'Nama, email, dan password wajib diisi' };
  var rows = sheetToArray(getSheet('Mentor'));
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].email.toLowerCase() === email) return { ok: false, error: 'Email sudah terdaftar' };
  }
  var id = generateId('MNT');
  getSheet('Mentor').appendRow([id, nama, email, hashPassword(password), jenis, 'aktif', nowStr()]);
  return { ok: true, id_mentor: id };
}

function editMentor(params, session) {
  var id = params.id_mentor;
  if (!id) return { ok: false, error: 'id_mentor wajib diisi' };
  var sheet = getSheet('Mentor');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('id_mentor')] === id) {
      if (params.nama) sheet.getRange(i+1, headers.indexOf('nama')+1).setValue(params.nama);
      if (params.jenis_mentor) sheet.getRange(i+1, headers.indexOf('jenis_mentor')+1).setValue(params.jenis_mentor);
      if (params.password) sheet.getRange(i+1, headers.indexOf('password_hash')+1).setValue(hashPassword(params.password));
      return { ok: true };
    }
  }
  return { ok: false, error: 'Mentor tidak ditemukan' };
}

function deactivateMentor(params, session) {
  var id = params.id_mentor;
  if (!id) return { ok: false, error: 'id_mentor wajib diisi' };
  var sheet = getSheet('Mentor');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('id_mentor')] === id) {
      sheet.getRange(i+1, headers.indexOf('status')+1).setValue('nonaktif');
      return { ok: true };
    }
  }
  return { ok: false, error: 'Mentor tidak ditemukan' };
}

// ============================================================
// HELPER KODE AKSES WALI
// ============================================================

function generateKodeAkses() {
  var rows = sheetToArray(getSheet('PesertaDidik'));
  var existingCodes = rows.map(function(r) { return r.kode_akses_wali; });
  var kode;
  do {
    kode = '';
    for (var i = 0; i < 6; i++) kode += KODE_CHARS.charAt(Math.floor(Math.random() * KODE_CHARS.length));
  } while (existingCodes.indexOf(kode) !== -1);
  return kode;
}

// ============================================================
// ADMIN: PESERTA DIDIK
// ============================================================

function addPesertaDidik(params, session) {
  var nama = (params.nama_lengkap || '').trim();
  var usia = params.usia || '';
  var jenis = params.jenis || 'bimbel';
  var id_mentor = params.id_mentor || '';
  var email_wali = (params.email_wali || '').trim().toLowerCase();
  var customKode = (params.kode_akses_wali || '').trim().toUpperCase();

  if (!nama || !email_wali || !id_mentor) return { ok: false, error: 'Nama, email wali, dan mentor wajib diisi' };

  var rows = sheetToArray(getSheet('PesertaDidik'));
  var kode;
  if (customKode) {
    var duplicate = rows.find(function(r) { return String(r.kode_akses_wali).trim().toUpperCase() === customKode; });
    if (duplicate) return { ok: false, error: 'Kode akses wali "' + customKode + '" sudah digunakan oleh peserta lain.' };
    kode = customKode;
  } else {
    kode = generateKodeAkses();
  }

  var mentors = sheetToArray(getSheet('Mentor'));
  var mentor = mentors.find(function(m) { return m.id_mentor === id_mentor; });
  if (!mentor) return { ok: false, error: 'Mentor tidak ditemukan' };

  var id = generateId('PST');
  getSheet('PesertaDidik').appendRow([id, nama, usia, jenis, id_mentor, mentor.nama, email_wali, kode, todayStr(), 'aktif']);

  try { kirimEmailKodeAkses(nama, email_wali, kode); catatEmailLog(id, 'kode_akses_baru', 'sukses', ''); }
  catch(e) { catatEmailLog(id, 'kode_akses_baru', 'gagal', e.message); }

  return { ok: true, id_peserta: id, kode_akses_wali: kode };
}

function editPesertaDidik(params, session) {
  var id = params.id_peserta;
  if (!id) return { ok: false, error: 'id_peserta wajib diisi' };
  var sheet = getSheet('PesertaDidik');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  if (params.kode_akses_wali) {
    var customKode = String(params.kode_akses_wali).trim().toUpperCase();
    if (customKode) {
      var rows = sheetToArray(sheet);
      var duplicate = rows.find(function(r) { 
        return r.id_peserta !== id && String(r.kode_akses_wali).trim().toUpperCase() === customKode; 
      });
      if (duplicate) return { ok: false, error: 'Kode akses wali "' + customKode + '" sudah digunakan oleh peserta lain.' };
    }
  }

  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('id_peserta')] === id) {
      if (params.nama_lengkap) sheet.getRange(i+1, headers.indexOf('nama_lengkap')+1).setValue(params.nama_lengkap);
      if (params.usia) sheet.getRange(i+1, headers.indexOf('usia')+1).setValue(params.usia);
      if (params.jenis) sheet.getRange(i+1, headers.indexOf('jenis')+1).setValue(params.jenis);
      if (params.email_wali) sheet.getRange(i+1, headers.indexOf('email_wali')+1).setValue(params.email_wali);
      if (params.kode_akses_wali) sheet.getRange(i+1, headers.indexOf('kode_akses_wali')+1).setValue(String(params.kode_akses_wali).trim().toUpperCase());
      if (params.id_mentor) {
        var mentors = sheetToArray(getSheet('Mentor'));
        var mentor = mentors.find(function(m) { return m.id_mentor === params.id_mentor; });
        if (mentor) {
          sheet.getRange(i+1, headers.indexOf('id_mentor')+1).setValue(params.id_mentor);
          sheet.getRange(i+1, headers.indexOf('nama_mentor')+1).setValue(mentor.nama);
        }
      }
      return { ok: true };
    }
  }
  return { ok: false, error: 'Peserta tidak ditemukan' };
}

function deactivatePesertaDidik(params, session) {
  var id = params.id_peserta;
  if (!id) return { ok: false, error: 'id_peserta wajib diisi' };
  var sheet = getSheet('PesertaDidik');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  for (var i = 1; i < data.length; i++) {
    if (data[i][headers.indexOf('id_peserta')] === id) {
      sheet.getRange(i+1, headers.indexOf('status')+1).setValue('nonaktif');
      return { ok: true };
    }
  }
  return { ok: false, error: 'Peserta tidak ditemukan' };
}

function kirimUlangKodeAkses(params, session) {
  var id = params.id_peserta;
  if (!id) return { ok: false, error: 'id_peserta wajib diisi' };
  var peserta = getPesertaById(id);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  try { kirimEmailKodeAkses(peserta.nama_lengkap, peserta.email_wali, peserta.kode_akses_wali); catatEmailLog(id, 'kirim_ulang_kode_akses', 'sukses', ''); }
  catch(e) { catatEmailLog(id, 'kirim_ulang_kode_akses', 'gagal', e.message); }
  return { ok: true };
}

// ============================================================
// MENTOR: DATA
// ============================================================

function getPesertaByMentor(params, session) {
  var id_mentor = session.role === 'mentor' ? session.id_user : (params.id_mentor || '');
  if (!id_mentor) return { ok: false, error: 'id_mentor tidak ditemukan' };
  var rows = sheetToArray(getSheet('PesertaDidik'));
  return { ok: true, data: rows.filter(function(r) { return r.id_mentor === id_mentor && r.status === 'aktif'; }).map(function(r) {
    return { id_peserta: r.id_peserta, nama_lengkap: r.nama_lengkap, usia: r.usia, jenis: r.jenis, email_wali: r.email_wali, kode_akses_wali: r.kode_akses_wali, tanggal_daftar: r.tanggal_daftar, id_mentor: r.id_mentor };
  })};
}

function updateKemajuan(params, session) {
  var id_peserta = params.id_peserta, kitab = (params.kitab || '').trim(), halaman = params.halaman, catatan = (params.catatan_hafalan || '').trim();
  if (!id_peserta || !kitab || !halaman) return { ok: false, error: 'id_peserta, kitab, dan halaman wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  var id = generateId('KMJ');
  getSheet('Kemajuan').appendRow([id, id_peserta, peserta.nama_lengkap, todayStr(), kitab, halaman, catatan, session.id_user]);
  try { kirimEmailNotifikasiKemajuan(peserta, kitab, halaman, catatan); catatEmailLog(id_peserta, 'update_kemajuan', 'sukses', ''); }
  catch(e) { catatEmailLog(id_peserta, 'update_kemajuan', 'gagal', e.message); }
  CacheService.getScriptCache().remove('grafik_' + id_peserta);
  return { ok: true, id: id };
}

function addPenilaian(params, session) {
  var id_peserta = params.id_peserta, nilai = parseFloat(params.nilai), catatan = (params.catatan || '').trim();
  if (!id_peserta || isNaN(nilai) || nilai < 0 || nilai > 10) return { ok: false, error: 'id_peserta dan nilai (0-10) wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  var id = generateId('PNL');
  getSheet('Penilaian').appendRow([id, id_peserta, peserta.nama_lengkap, todayStr(), nilai, catatan, session.id_user]);
  try { kirimEmailNotifikasiPenilaian(peserta, nilai, catatan); catatEmailLog(id_peserta, 'penilaian_baru', 'sukses', ''); }
  catch(e) { catatEmailLog(id_peserta, 'penilaian_baru', 'gagal', e.message); }
  CacheService.getScriptCache().remove('grafik_' + id_peserta);
  return { ok: true, id: id };
}

function addKehadiran(params, session) {
  var id_peserta = params.id_peserta, status_hadir = params.status_hadir || 'hadir', keterangan = (params.keterangan || '').trim(), tanggal = params.tanggal || todayStr();
  if (!id_peserta) return { ok: false, error: 'id_peserta wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  var id = generateId('ABN');
  getSheet('Kehadiran').appendRow([id, id_peserta, peserta.nama_lengkap, tanggal, status_hadir, keterangan, session.id_user]);
  CacheService.getScriptCache().remove('grafik_' + id_peserta);
  return { ok: true, id: id };
}

function addPelajaranTambahan(params, session) {
  var id_peserta = params.id_peserta, nama_pelajaran = (params.nama_pelajaran || '').trim(), deskripsi = (params.deskripsi || '').trim();
  if (!id_peserta || !nama_pelajaran) return { ok: false, error: 'id_peserta dan nama_pelajaran wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  var id = generateId('PLJ');
  getSheet('PelajaranTambahan').appendRow([id, id_peserta, peserta.nama_lengkap, nama_pelajaran, deskripsi, todayStr(), session.id_user]);
  return { ok: true, id: id };
}

function addCatatanMentor(params, session) {
  var id_peserta = params.id_peserta, isi = (params.isi_catatan || '').trim();
  if (!id_peserta || !isi) return { ok: false, error: 'id_peserta dan isi_catatan wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  var id = generateId('CAT');
  getSheet('CatatanMentor').appendRow([id, id_peserta, peserta.nama_lengkap, todayStr(), isi, session.id_user]);
  return { ok: true, id: id };
}

function getRiwayatPeserta(params, session) {
  var id_peserta = params.id_peserta;
  if (!id_peserta) return { ok: false, error: 'id_peserta wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };
  return {
    ok: true, peserta: peserta,
    kemajuan:           sheetToArray(getSheet('Kemajuan')).filter(function(r) { return r.id_peserta === id_peserta; }).reverse(),
    penilaian:          sheetToArray(getSheet('Penilaian')).filter(function(r) { return r.id_peserta === id_peserta; }).reverse(),
    kehadiran:          sheetToArray(getSheet('Kehadiran')).filter(function(r) { return r.id_peserta === id_peserta; }).reverse(),
    pelajaran_tambahan: sheetToArray(getSheet('PelajaranTambahan')).filter(function(r) { return r.id_peserta === id_peserta; }).reverse(),
    catatan_mentor:     sheetToArray(getSheet('CatatanMentor')).filter(function(r) { return r.id_peserta === id_peserta; }).reverse()
  };
}

// ============================================================
// PORTAL WALI (PUBLIK)
// ============================================================

function searchPesertaPublic(params) {
  var kode = (params.kode_akses || params.kode || '').trim().toUpperCase();
  if (!kode) return { ok: false, error: 'Kode akses wali wajib diisi' };

  // Rate limiting
  var cache = CacheService.getScriptCache();
  var rlKey = 'rl_' + kode;
  var attempts = parseInt(cache.get(rlKey) || '0');
  if (attempts >= 10) return { ok: false, error: 'Terlalu banyak percobaan. Coba lagi dalam 5 menit.' };
  cache.put(rlKey, (attempts + 1).toString(), 300);

  var rows = sheetToArray(getSheet('PesertaDidik'));
  var peserta = rows.find(function(r) { return String(r.kode_akses_wali).trim().toUpperCase() === kode; });
  if (!peserta) return { ok: false, error: 'Data tidak ditemukan. Pastikan kode akses benar.' };
  if (peserta.status !== 'aktif') return { ok: false, error: 'Peserta ini sudah tidak aktif.' };

  var id = peserta.id_peserta;
  var kemajuan  = sheetToArray(getSheet('Kemajuan')).filter(function(r) { return r.id_peserta === id; }).reverse();
  var penilaian = sheetToArray(getSheet('Penilaian')).filter(function(r) { return r.id_peserta === id; }).reverse();
  var kehadiran = sheetToArray(getSheet('Kehadiran')).filter(function(r) { return r.id_peserta === id; }).reverse();
  var pelajaran = sheetToArray(getSheet('PelajaranTambahan')).filter(function(r) { return r.id_peserta === id; }).reverse();
  var catatan   = sheetToArray(getSheet('CatatanMentor')).filter(function(r) { return r.id_peserta === id; }).reverse();

  return { ok: true, data: {
    id_peserta: id, nama_lengkap: peserta.nama_lengkap, kode_akses: kode,
    usia: peserta.usia, jenis: peserta.jenis, nama_mentor: peserta.nama_mentor, tanggal_daftar: peserta.tanggal_daftar,
    progres_terakhir: kemajuan.length > 0 ? { kitab: kemajuan[0].kitab, halaman: kemajuan[0].halaman, tanggal: kemajuan[0].tanggal } : null,
    riwayat_penilaian: penilaian.slice(0, 10),
    total_hadir: kehadiran.filter(function(r) { return r.status_hadir === 'hadir'; }).length,
    total_izin:  kehadiran.filter(function(r) { return r.status_hadir === 'izin'; }).length,
    pelajaran_tambahan: pelajaran.slice(0, 10),
    catatan_mentor: catatan.slice(0, 5)
  }};
}

function getGrafikPeserta(params) {
  var id_peserta = params.id_peserta, kode = (params.kode_akses || '').trim().toUpperCase();
  if (!id_peserta || !kode) return { ok: false, error: 'id_peserta dan kode_akses wajib diisi' };

  var rows = sheetToArray(getSheet('PesertaDidik'));
  if (!rows.find(function(r) { return r.id_peserta === id_peserta && String(r.kode_akses_wali).trim().toUpperCase() === kode; })) return { ok: false, error: 'Akses ditolak' };

  var cacheKey = 'grafik_' + id_peserta;
  var cache = CacheService.getScriptCache();
  var cached = cache.get(cacheKey);
  if (cached) return { ok: true, data: JSON.parse(cached) };

  var kemajuan  = sheetToArray(getSheet('Kemajuan')).filter(function(r) { return r.id_peserta === id_peserta; });
  var penilaian = sheetToArray(getSheet('Penilaian')).filter(function(r) { return r.id_peserta === id_peserta; });
  var kehadiran = sheetToArray(getSheet('Kehadiran')).filter(function(r) { return r.id_peserta === id_peserta; });

  var data = {
    grafik_kemajuan: kemajuan.map(function(r) { return { tanggal: r.tanggal, halaman: parseFloat(r.halaman) || 0, kitab: r.kitab }; }),
    grafik_nilai: penilaian.map(function(r) { return { tanggal: r.tanggal, nilai: parseFloat(r.nilai) || 0 }; }),
    grafik_kehadiran: { hadir: kehadiran.filter(function(r) { return r.status_hadir === 'hadir'; }).length, izin: kehadiran.filter(function(r) { return r.status_hadir === 'izin'; }).length }
  };

  cache.put(cacheKey, JSON.stringify(data), CACHE_TTL);
  return { ok: true, data: data };
}

// ============================================================
// DASHBOARD ADMIN
// ============================================================

function getDashboardStats(params, session) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('dashboard_stats');
  if (cached) return { ok: true, data: JSON.parse(cached) };

  var mentors  = sheetToArray(getSheet('Mentor'));
  var peserta  = sheetToArray(getSheet('PesertaDidik'));
  var kehadiran= sheetToArray(getSheet('Kehadiran'));
  var penilaian= sheetToArray(getSheet('Penilaian'));
  var emaillog = sheetToArray(getSheet('EmailLog'));

  var mentorAktif  = mentors.filter(function(m) { return m.status === 'aktif'; });
  var pesertaAktif = peserta.filter(function(p) { return p.status === 'aktif'; });
  var bulanIni = todayStr().substring(0, 7);

  // Tren kehadiran 8 minggu terakhir
  var weeks = {};
  kehadiran.forEach(function(r) {
    var d = new Date(r.tanggal);
    if (isNaN(d.getTime())) return;
    var day = d.getDay();
    var diff = d.getDate() - day + (day === 0 ? -6 : 1);
    var ws = new Date(d.getFullYear(), d.getMonth(), diff);
    var key = Utilities.formatDate(ws, 'Asia/Jakarta', 'yyyy-MM-dd');
    if (!weeks[key]) weeks[key] = { hadir: 0, izin: 0 };
    if (r.status_hadir === 'hadir') weeks[key].hadir++; else weeks[key].izin++;
  });
  var tren = Object.keys(weeks).sort().slice(-8).map(function(k) { return { minggu: k, hadir: weeks[k].hadir, izin: weeks[k].izin }; });

  // Rata-rata nilai per jenis
  var pesertaMap = {};
  peserta.forEach(function(p) { pesertaMap[p.id_peserta] = p.jenis; });
  var sums = { bimbel: 0, privat: 0 }, counts = { bimbel: 0, privat: 0 };
  penilaian.forEach(function(r) {
    var jenis = pesertaMap[r.id_peserta];
    if (jenis && sums[jenis] !== undefined) { sums[jenis] += parseFloat(r.nilai) || 0; counts[jenis]++; }
  });

  var stats = {
    total_mentor: mentorAktif.length,
    total_mentor_bimbel: mentorAktif.filter(function(m) { return m.jenis_mentor === 'bimbel'; }).length,
    total_mentor_privat: mentorAktif.filter(function(m) { return m.jenis_mentor === 'privat'; }).length,
    total_peserta: pesertaAktif.length,
    total_peserta_bimbel: pesertaAktif.filter(function(p) { return p.jenis === 'bimbel'; }).length,
    total_peserta_privat: pesertaAktif.filter(function(p) { return p.jenis === 'privat'; }).length,
    laporan_pdf_bulan_ini: emaillog.filter(function(e) { return e.jenis === 'laporan_pdf' && e.tanggal_kirim.toString().substring(0,7) === bulanIni && e.status_kirim === 'sukses'; }).length,
    tren_kehadiran: tren,
    nilai_per_jenis: {
      bimbel: counts.bimbel > 0 ? (sums.bimbel / counts.bimbel).toFixed(2) : 0,
      privat: counts.privat > 0 ? (sums.privat / counts.privat).toFixed(2) : 0
    },
    aktivitas_terbaru: emaillog.slice(-10).reverse()
  };

  cache.put('dashboard_stats', JSON.stringify(stats), CACHE_TTL);
  return { ok: true, data: stats };
}

function getExportData(params, session) {
  var dari = params.dari || '', sampai = params.sampai || '', id_mentor = params.id_mentor || '';
  var peserta = sheetToArray(getSheet('PesertaDidik'));
  if (id_mentor) peserta = peserta.filter(function(p) { return p.id_mentor === id_mentor; });

  return { ok: true, data: peserta.map(function(p) {
    var kehadiran = sheetToArray(getSheet('Kehadiran')).filter(function(r) { return r.id_peserta === p.id_peserta && (!dari || r.tanggal >= dari) && (!sampai || r.tanggal <= sampai); });
    var penilaian = sheetToArray(getSheet('Penilaian')).filter(function(r) { return r.id_peserta === p.id_peserta && (!dari || r.tanggal >= dari) && (!sampai || r.tanggal <= sampai); });
    var kemajuan  = sheetToArray(getSheet('Kemajuan')).filter(function(r) { return r.id_peserta === p.id_peserta; });
    var avgNilai  = penilaian.length > 0 ? (penilaian.reduce(function(s,r){return s+(parseFloat(r.nilai)||0);},0)/penilaian.length).toFixed(2) : '-';
    return {
      nama: p.nama_lengkap, jenis: p.jenis, mentor: p.nama_mentor,
      total_hadir: kehadiran.filter(function(r){return r.status_hadir==='hadir';}).length,
      total_izin:  kehadiran.filter(function(r){return r.status_hadir==='izin';}).length,
      avg_nilai: avgNilai,
      progres_terakhir: kemajuan.length > 0 ? kemajuan[kemajuan.length-1].kitab + ' hal. ' + kemajuan[kemajuan.length-1].halaman : '-'
    };
  })};
}

// ============================================================
// LAPORAN PDF
// ============================================================

function generateDanKirimLaporanPDF(params, session) {
  var id_peserta = params.id_peserta;
  if (!id_peserta) return { ok: false, error: 'id_peserta wajib diisi' };
  var peserta = getPesertaById(id_peserta);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };

  try {
    var kemajuan  = sheetToArray(getSheet('Kemajuan')).filter(function(r) { return r.id_peserta === id_peserta; });
    var penilaian = sheetToArray(getSheet('Penilaian')).filter(function(r) { return r.id_peserta === id_peserta; });
    var kehadiran = sheetToArray(getSheet('Kehadiran')).filter(function(r) { return r.id_peserta === id_peserta; });
    var catatan   = sheetToArray(getSheet('CatatanMentor')).filter(function(r) { return r.id_peserta === id_peserta; });

    var totalHadir = kehadiran.filter(function(r) { return r.status_hadir === 'hadir'; }).length;
    var totalIzin  = kehadiran.filter(function(r) { return r.status_hadir === 'izin'; }).length;
    var avgNilai   = penilaian.length > 0 ? (penilaian.reduce(function(s,r){return s+(parseFloat(r.nilai)||0);},0)/penilaian.length).toFixed(2) : '-';

    var templateFile = DriveApp.getFileById(TEMPLATE_DOC_ID);
    var folder = DriveApp.getFolderById(LAPORAN_FOLDER_ID);
    var copy = templateFile.makeCopy('Laporan_' + peserta.nama_lengkap + '_' + todayStr(), folder);
    var body = DocumentApp.openById(copy.getId()).getBody();

    body.replaceText('{{NAMA}}', peserta.nama_lengkap);
    body.replaceText('{{USIA}}', peserta.usia.toString());
    body.replaceText('{{JENIS}}', peserta.jenis);
    body.replaceText('{{MENTOR}}', peserta.nama_mentor);
    body.replaceText('{{TANGGAL_DAFTAR}}', peserta.tanggal_daftar.toString());
    body.replaceText('{{TOTAL_HADIR}}', totalHadir.toString());
    body.replaceText('{{TOTAL_IZIN}}', totalIzin.toString());
    body.replaceText('{{AVG_NILAI}}', avgNilai.toString());
    body.replaceText('{{PROGRES_TERAKHIR}}', kemajuan.length > 0 ? kemajuan[kemajuan.length-1].kitab + ' hal. ' + kemajuan[kemajuan.length-1].halaman : '-');
    body.replaceText('{{CATATAN_TERBARU}}', catatan.length > 0 ? catatan[catatan.length-1].isi_catatan : '-');
    body.replaceText('{{TANGGAL_LAPORAN}}', todayStr());

    var docFile = DriveApp.getFileById(copy.getId());
    docFile.getParents().next();
    var pdf = docFile.getAs(MimeType.PDF);

    var plainText = 'Assalamualaikum, terlampir laporan perkembangan ' + peserta.nama_lengkap + ' dari Quran Insight Academy.';
    MailApp.sendEmail({
      to: peserta.email_wali,
      subject: 'Laporan Perkembangan ' + peserta.nama_lengkap + ' — Quran Insight Academy',
      name: 'Quran Insight Academy',
      replyTo: 'portalqia@gmail.com',
      body: plainText,
      htmlBody: '<p>Assalamualaikum, terlampir laporan perkembangan <strong>' + peserta.nama_lengkap + '</strong> dari Quran Insight Academy.</p>',
      attachments: [pdf]
    });

    folder.createFile(pdf);
    docFile.setTrashed(true);
    catatEmailLog(id_peserta, 'laporan_pdf', 'sukses', '');
    CacheService.getScriptCache().remove('dashboard_stats');
    return { ok: true };
  } catch(e) {
    catatEmailLog(id_peserta, 'laporan_pdf', 'gagal', e.message);
    return { ok: false, error: 'Gagal generate PDF: ' + e.message };
  }
}

// ============================================================
// EMAIL
// ============================================================

function kirimEmailKodeAkses(nama, email_wali, kode) {
  var plainText = 'Assalamualaikum,\n\nAnak Anda, ' + nama + ', telah berhasil terdaftar di Quran Insight Academy.\n\nKode Akses Portal Wali: ' + kode + '\n\nSimpan kode ini untuk akses Portal Wali.';
  MailApp.sendEmail({
    to: email_wali,
    subject: 'Kode Akses Portal Wali — Quran Insight Academy',
    name: 'Quran Insight Academy',
    replyTo: 'portalqia@gmail.com',
    body: plainText,
    htmlBody: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#4F280C,#81511D);padding:24px;text-align:center;border-radius:8px 8px 0 0"><h2 style="color:#F0AF43;margin:0;font-size:22px">Quran Insight Academy</h2><p style="color:rgba(243,233,220,0.8);margin:6px 0 0;font-size:13px">Bersama Menuju Insan Qurani</p></div><div style="background:#FFF8F0;padding:24px;border-radius:0 0 8px 8px;border:1px solid rgba(129,81,29,0.15)"><p style="color:#221104">Assalamualaikum,</p><p style="color:#221104">Anak Anda, <strong>' + nama + '</strong>, telah berhasil terdaftar di <strong>Quran Insight Academy</strong>.</p><p style="color:#221104">Gunakan Kode Akses Wali berikut untuk memantau perkembangan anak Anda:</p><div style="background:linear-gradient(135deg,#4F280C,#81511D);color:#F0AF43;font-size:36px;font-weight:bold;letter-spacing:10px;padding:20px;border-radius:12px;text-align:center;margin:20px 0;box-shadow:0 8px 24px rgba(79,40,12,0.3)">' + kode + '</div><p style="color:#4F280C">Simpan kode ini baik-baik dan gunakan bersama nama anak Anda di Portal Wali.</p><p style="color:rgba(34,17,4,0.5);font-size:12px;margin-top:16px">© Quran Insight Academy · <a href="https://quraninsightacademy.blogspot.com" style="color:#81511D">Portal Wali</a></p></div></div>'
  });
}

function kirimEmailNotifikasiKemajuan(peserta, kitab, halaman, catatan) {
  var plainText = 'Update hafalan untuk ' + peserta.nama_lengkap + ':\nKitab: ' + kitab + '\nHalaman: ' + halaman + (catatan ? '\nCatatan: ' + catatan : '');
  MailApp.sendEmail({
    to: peserta.email_wali,
    subject: 'Update Hafalan ' + peserta.nama_lengkap + ' — QIA',
    name: 'Quran Insight Academy',
    replyTo: 'portalqia@gmail.com',
    body: plainText,
    htmlBody: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#4F280C,#81511D);padding:16px;text-align:center;border-radius:8px 8px 0 0"><h2 style="color:#F0AF43;margin:0;font-size:18px">Update Kemajuan Hafalan</h2></div><div style="padding:24px;background:#FFF8F0;border-radius:0 0 8px 8px;border:1px solid rgba(129,81,29,0.15)"><p style="color:#221104">Update hafalan untuk <strong>' + peserta.nama_lengkap + '</strong>:</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr><td style="color:#81511D;padding:8px 0;font-weight:600">Kitab:</td><td style="color:#221104"><strong>' + kitab + '</strong></td></tr><tr><td style="color:#81511D;padding:8px 0;font-weight:600">Halaman:</td><td style="color:#221104"><strong>' + halaman + '</strong></td></tr>' + (catatan ? '<tr><td style="color:#81511D;padding:8px 0;font-weight:600">Catatan:</td><td style="color:#221104">' + catatan + '</td></tr>' : '') + '</table><p style="color:rgba(34,17,4,0.5);font-size:12px">© Quran Insight Academy</p></div></div>'
  });
}

function kirimEmailNotifikasiPenilaian(peserta, nilai, catatan) {
  var plainText = peserta.nama_lengkap + ' mendapat penilaian: ' + nilai + ' / 10' + (catatan ? '\nCatatan Mentor: ' + catatan : '');
  MailApp.sendEmail({
    to: peserta.email_wali,
    subject: 'Penilaian Baru ' + peserta.nama_lengkap + ' — QIA',
    name: 'Quran Insight Academy',
    replyTo: 'portalqia@gmail.com',
    body: plainText,
    htmlBody: '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto"><div style="background:linear-gradient(135deg,#4F280C,#81511D);padding:16px;text-align:center;border-radius:8px 8px 0 0"><h2 style="color:#F0AF43;margin:0;font-size:18px">Penilaian Baru</h2></div><div style="padding:24px;background:#FFF8F0;border-radius:0 0 8px 8px;border:1px solid rgba(129,81,29,0.15)"><p style="color:#221104"><strong>' + peserta.nama_lengkap + '</strong> mendapat penilaian:</p><div style="font-size:52px;font-weight:bold;background:linear-gradient(135deg,#F0AF43,#D4934E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-align:center;margin:20px 0">' + nilai + '<span style="font-size:22px"> / 10</span></div>' + (catatan ? '<p style="color:#4F280C;background:rgba(240,175,67,0.1);padding:12px 16px;border-radius:8px;border-left:4px solid #F0AF43">Catatan Mentor: ' + catatan + '</p>' : '') + '<p style="color:rgba(34,17,4,0.5);font-size:12px;margin-top:16px">© Quran Insight Academy</p></div></div>'
  });
}

function catatEmailLog(id_peserta, jenis, status, keterangan) {
  getSheet('EmailLog').appendRow([generateId('LOG'), id_peserta, jenis, nowStr(), status, keterangan]);
}

// ============================================================
// LAPORAN SESI TERPADU — Simpan semua sekaligus + email narasi
// ============================================================

function simpanLaporanSesi(params, session) {
  var id = params.id_peserta;
  if (!id) return { ok: false, error: 'id_peserta wajib diisi' };
  var peserta = getPesertaById(id);
  if (!peserta) return { ok: false, error: 'Peserta tidak ditemukan' };

  var tanggal   = params.tanggal || todayStr();
  var hasil     = { kemajuan: false, penilaian: false, kehadiran: false, pelajaran: false, catatan: false };

  // 1. Kemajuan Hafalan
  if (params.kitab && params.halaman) {
    getSheet('Kemajuan').appendRow([generateId('KMJ'), id, params.kitab, params.halaman, params.catatan_hafalan || '', tanggal]);
    hasil.kemajuan = true;
  }

  // 2. Penilaian
  if (params.nilai !== undefined && params.nilai !== '') {
    var nilaiNum = parseFloat(params.nilai);
    if (!isNaN(nilaiNum) && nilaiNum >= 0 && nilaiNum <= 10) {
      getSheet('Penilaian').appendRow([generateId('PNL'), id, nilaiNum, params.catatan_nilai || '', tanggal]);
      hasil.penilaian = true;
    }
  }

  // 3. Kehadiran
  if (params.status_hadir) {
    getSheet('Kehadiran').appendRow([generateId('KHD'), id, params.status_hadir, params.keterangan_hadir || '', tanggal]);
    hasil.kehadiran = true;
  }

  // 4. Pelajaran Tambahan
  if (params.nama_pelajaran) {
    getSheet('PelajaranTambahan').appendRow([generateId('PLJ'), id, params.nama_pelajaran, params.deskripsi_pelajaran || '', tanggal]);
    hasil.pelajaran = true;
  }

  // 5. Catatan Mentor
  if (params.catatan_mentor) {
    getSheet('CatatanMentor').appendRow([generateId('CTT'), id, params.catatan_mentor, tanggal]);
    hasil.catatan = true;
  }

  // 6. Kirim email laporan narasi ke wali
  try {
    kirimEmailLaporanSesi(peserta, params, hasil, tanggal);
    catatEmailLog(id, 'laporan_sesi', 'sukses', '');
  } catch(e) {
    catatEmailLog(id, 'laporan_sesi', 'gagal', e.message);
  }

  CacheService.getScriptCache().remove('dashboard_stats');
  return { ok: true, hasil: hasil };
}

function kirimEmailLaporanSesi(peserta, params, hasil, tanggal) {
  var nama = peserta.nama_lengkap;

  // Narasi kehadiran
  var statusHadir = params.status_hadir || '';
  var narasiHadir = '';
  if (statusHadir === 'hadir') {
    narasiHadir = nama + ' hadir mengikuti sesi pembelajaran dengan penuh semangat';
  } else if (statusHadir === 'izin') {
    narasiHadir = nama + ' berhalangan hadir (izin)' + (params.keterangan_hadir ? ': ' + params.keterangan_hadir : '');
  }

  // Narasi hafalan
  var narasiHafalan = '';
  if (hasil.kemajuan) {
    narasiHafalan = 'Pada sesi ini, ' + nama + ' mempelajari <strong>' + params.kitab + '</strong> hingga halaman/ayat <strong>' + params.halaman + '</strong>.';
    if (params.catatan_hafalan) narasiHafalan += ' Catatan hafalan: ' + params.catatan_hafalan + '.';
  }

  // Narasi penilaian
  var narasiNilai = '';
  if (hasil.penilaian) {
    var n = parseFloat(params.nilai);
    var predikat = n >= 9 ? 'Sangat Baik ⭐' : n >= 7 ? 'Baik ✓' : n >= 5 ? 'Cukup' : 'Perlu Peningkatan';
    narasiNilai = 'Mentor memberikan penilaian <strong>' + n + ' / 10</strong> (' + predikat + ')';
    if (params.catatan_nilai) narasiNilai += ' dengan catatan: <em>' + params.catatan_nilai + '</em>';
    narasiNilai += '.';
  }

  // Narasi pelajaran tambahan
  var narasiPelajaran = '';
  if (hasil.pelajaran) {
    narasiPelajaran = 'Pelajaran tambahan yang dipelajari: <strong>' + params.nama_pelajaran + '</strong>';
    if (params.deskripsi_pelajaran) narasiPelajaran += ' — ' + params.deskripsi_pelajaran;
    narasiPelajaran += '.';
  }

  // Narasi catatan mentor
  var narasiCatatan = '';
  if (hasil.catatan) {
    narasiCatatan = params.catatan_mentor;
  }

  // Susun baris-baris HTML laporan
  var rowsHtml = '';
  if (narasiHadir)    rowsHtml += '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(129,81,29,0.12);font-weight:600;color:#81511D;vertical-align:top;width:140px">📅 Kehadiran</td><td style="padding:10px 0 10px 12px;border-bottom:1px solid rgba(129,81,29,0.12);color:#221104">' + narasiHadir + '</td></tr>';
  if (narasiHafalan)  rowsHtml += '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(129,81,29,0.12);font-weight:600;color:#81511D;vertical-align:top">📖 Hafalan</td><td style="padding:10px 0 10px 12px;border-bottom:1px solid rgba(129,81,29,0.12);color:#221104">' + narasiHafalan + '</td></tr>';
  if (narasiNilai)    rowsHtml += '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(129,81,29,0.12);font-weight:600;color:#81511D;vertical-align:top">⭐ Penilaian</td><td style="padding:10px 0 10px 12px;border-bottom:1px solid rgba(129,81,29,0.12);color:#221104">' + narasiNilai + '</td></tr>';
  if (narasiPelajaran)rowsHtml += '<tr><td style="padding:10px 0;border-bottom:1px solid rgba(129,81,29,0.12);font-weight:600;color:#81511D;vertical-align:top">🎓 Pelajaran Tambahan</td><td style="padding:10px 0 10px 12px;border-bottom:1px solid rgba(129,81,29,0.12);color:#221104">' + narasiPelajaran + '</td></tr>';
  if (narasiCatatan)  rowsHtml += '<tr><td style="padding:10px 0;font-weight:600;color:#81511D;vertical-align:top">📝 Pesan Mentor</td><td style="padding:10px 0 10px 12px;color:#221104;font-style:italic">"' + narasiCatatan + '"</td></tr>';

  var htmlBody =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">' +
      '<div style="background:linear-gradient(135deg,#4F280C,#81511D);padding:28px 24px;text-align:center;border-radius:12px 12px 0 0">' +
        '<h2 style="color:#F0AF43;margin:0;font-size:20px;letter-spacing:0.5px">Laporan Sesi Belajar</h2>' +
        '<p style="color:rgba(243,233,220,0.85);margin:6px 0 0;font-size:13px">Quran Insight Academy</p>' +
      '</div>' +
      '<div style="background:#FFF8F0;padding:24px;border-radius:0 0 12px 12px;border:1px solid rgba(129,81,29,0.15)">' +
        '<p style="color:#221104;margin-bottom:16px">Assalamualaikum Warahmatullahi Wabarakatuh,<br><br>' +
        'Berikut kami sampaikan laporan perkembangan sesi belajar <strong>' + nama + '</strong> pada tanggal <strong>' + tanggal + '</strong>:</p>' +
        '<table style="width:100%;border-collapse:collapse">' + rowsHtml + '</table>' +
        '<div style="margin-top:20px;background:linear-gradient(135deg,rgba(79,40,12,0.06),rgba(240,175,67,0.08));padding:16px;border-radius:10px;border-left:4px solid #F0AF43">' +
          '<p style="color:#4F280C;font-size:13px;margin:0">Jazakumullahu khairan atas kepercayaan Bapak/Ibu kepada Quran Insight Academy. Kami berkomitmen untuk terus membimbing putra-putri Anda menuju insan Qurani yang berakhlak mulia.</p>' +
        '</div>' +
        '<p style="color:rgba(34,17,4,0.45);font-size:11px;margin-top:20px;text-align:center">© Quran Insight Academy · <a href="https://quraninsightacademy.blogspot.com" style="color:#81511D">Portal Wali</a></p>' +
      '</div>' +
    '</div>';

  var plainText =
    'Laporan Sesi Belajar — ' + nama + ' (' + tanggal + ')\n\n' +
    (narasiHadir    ? 'Kehadiran: '          + narasiHadir.replace(/<[^>]+>/g,'') + '\n' : '') +
    (narasiHafalan  ? 'Hafalan: '            + narasiHafalan.replace(/<[^>]+>/g,'') + '\n' : '') +
    (narasiNilai    ? 'Penilaian: '          + narasiNilai.replace(/<[^>]+>/g,'') + '\n' : '') +
    (narasiPelajaran? 'Pelajaran Tambahan: ' + narasiPelajaran.replace(/<[^>]+>/g,'') + '\n' : '') +
    (narasiCatatan  ? 'Pesan Mentor: '       + narasiCatatan + '\n' : '') +
    '\nJazakumullahu khairan.\nQuran Insight Academy';

  MailApp.sendEmail({
    to: peserta.email_wali,
    subject: 'Laporan Sesi Belajar ' + nama + ' — ' + tanggal,
    name: 'Quran Insight Academy',
    replyTo: 'portalqia@gmail.com',
    body: plainText,
    htmlBody: htmlBody
  });
}

// ============================================================
// SETUP AWAL — Jalankan sekali dari GAS Editor
// ============================================================

function setupAwal() {
  ['Admin','Mentor','PesertaDidik','Kemajuan','Penilaian','Kehadiran','PelajaranTambahan','CatatanMentor','Sessions','EmailLog'].forEach(function(n) { getSheet(n); });
  var adminSheet = getSheet('Admin');
  if (sheetToArray(adminSheet).length === 0) {
    adminSheet.appendRow([generateId('ADM'), 'Administrator QIA', 'admin@qia.id', hashPassword('Admin123!'), nowStr()]);
    Logger.log('Admin default: admin@qia.id / Admin123! — SEGERA GANTI PASSWORD!');
  }
  Logger.log('Setup selesai!');
}

// Time-trigger bulanan — daftarkan di GAS Triggers
function triggerLaporanBulanan() {
  sheetToArray(getSheet('PesertaDidik')).filter(function(p) { return p.status === 'aktif'; }).forEach(function(p) {
    try { generateDanKirimLaporanPDF({ id_peserta: p.id_peserta }, { id_user: 'SYSTEM', role: 'admin' }); Utilities.sleep(2000); }
    catch(e) { Logger.log('Gagal: ' + p.nama_lengkap + ' — ' + e.message); }
  });
}
