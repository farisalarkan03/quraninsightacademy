// ============================================================
// QIA — Landing Page (Sesuai template.xml — Hanya Portal Wali Publik)
// src/pages/landing.js
// ============================================================

export function renderLanding(app, navigate, showToast) {
  document.title = 'Quran Insight Academy — Bimbingan Al-Quran Terpercaya'

  app.innerHTML = `
<div class="qia-landing" id="landing-root">

  <!-- ── NAVBAR ── -->
  <nav class="qia-navbar">
    <div class="qia-container qia-navbar-inner">
      <a class="qia-brand" onclick="window.navigate('/')">
        <img alt="Quran Insight Academy" class="qia-brand-logo" 
             src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2TbWuspeS-Fc6jCrtgc1pqFQ8LPJR8ZXMDWhKto44zpjFHlNeBuDYvqbFNOmWw3EtXJYlXg0ldQ674DVn4LkAR6_YeXLCAk3O1t7ZdksFM_RAHDKiwa55tonFyY-4z6VNP9o01cc_F5ktiu7fSKveccIkNnvPvUfd4jWORj_MH-W5d6rVEgrItJyTpR98/s1600/3.png" 
             onerror="this.style.display='none'; document.getElementById('brand-fallback-icon').style.display='inline-flex';" />
        <span id="brand-fallback-icon" class="ms" style="display:none;font-size:32px;color:#81511D;">menu_book</span>
        <div class="qia-brand-text">Quran <span>Insight Academy</span></div>
      </a>

      <div class="qia-nav-links" id="qiaNavLinks">
        <a href="#tentang">Tentang</a>
        <a href="#program">Program</a>
        <a href="#portal">Portal Peserta Didik</a>
        <a href="#faq">FAQ</a>
        <a href="#kontak">Kontak</a>
      </div>

      <div class="qia-nav-actions">
        <button class="qia-btn qia-btn-primary" onclick="window.navigate('/portal-wali')" id="btn-nav-wali">
          <span class="ms">lock</span> Portal Wali
        </button>
      </div>

      <button class="qia-mobile-toggle" id="qiaMobileToggle" type="button" aria-label="Toggle Menu">
        <span class="ms">menu</span>
      </button>
    </div>
  </nav>

  <!-- ── HERO SECTION ── -->
  <section class="qia-hero" id="hero">
    <div class="qia-container">
      <div class="qia-badge">
        <span class="ms">auto_awesome</span> Bimbel &amp; Privat Al Quran Modern
      </div>
      <h1>Bimbingan Al-Quran <span>Modern &amp; Terstruktur</span> untuk Buah Hati Ayah Bunda</h1>
      <p>Membantu putra-putri Ayah Bunda membaca, menghafal, dan memahami Al-Qur'an dengan metode yang menyenangkan, mentor tersertifikasi, dan laporan perkembangan yang terintegrasi secara real-time.</p>

      <div class="qia-hero-ctas">
        <a class="qia-btn qia-btn-wa qia-btn-lg" href="https://wa.me/6285355258891" target="_blank" rel="noopener noreferrer">
          <svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
          </svg>
          Daftar via WhatsApp
        </a>
        <button class="qia-btn qia-btn-primary qia-btn-lg" onclick="window.navigate('/portal-wali')" id="btn-hero-wali">
          <span class="ms">search</span> Cek Progres Peserta Didik
        </button>
      </div>

      <!-- Stats Box -->
      <div class="qia-stats">
        <div class="qia-stat-item">
          <div class="qia-stat-num">500+</div>
          <div class="qia-stat-label">Peserta Didik Aktif</div>
        </div>
        <div class="qia-stat-item">
          <div class="qia-stat-num">100%</div>
          <div class="qia-stat-label">Mentor Competent</div>
        </div>
        <div class="qia-stat-item">
          <div class="qia-stat-num">4.9/5</div>
          <div class="qia-stat-label">Kepuasan Wali</div>
        </div>
        <div class="qia-stat-item">
          <div class="qia-stat-num">Real-Time</div>
          <div class="qia-stat-label">Laporan Portal Wali</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── KEUNGGULAN SECTION ── -->
  <section class="qia-section" id="tentang">
    <div class="qia-container">
      <div class="qia-section-header">
        <span class="qia-section-eyebrow">Keunggulan QIA</span>
        <h2 class="qia-section-title">Mengapa Memilih Quran Insight Academy?</h2>
        <p class="qia-section-desc">Kami mengombinasikan kehangatan bimbingan islami dengan teknologi pemantauan modern untuk memberikan pengalaman belajar terbaik.</p>
      </div>

      <div class="qia-grid-3">
        <div class="qia-card">
          <div class="qia-card-icon"><span class="ms">menu_book</span></div>
          <h3>Metode Interaktif &amp; Ramah Anak</h3>
          <p>Pendekatan belajar bertahap yang disesuaikan dengan kemampuan peserta didik, membuat anak senang dan ketagihan belajar Al-Qur'an.</p>
        </div>

        <div class="qia-card">
          <div class="qia-card-icon"><span class="ms">monitoring</span></div>
          <h3>Portal Wali Real-Time</h3>
          <p>Wali peserta didik dapat memantau kehadiran, nilai, serta progres hafalan anak kapan saja secara langsung tanpa kode akses yang rumit.</p>
        </div>

        <div class="qia-card">
          <div class="qia-card-icon"><span class="ms">school</span></div>
          <h3>Mentor Terpilih &amp; Sabar</h3>
          <p>Guru-guru pengajar yang berkompeten, bersertifikasi, serta berpengalaman dalam membimbing anak-anak dan remaja.</p>
        </div>

        <div class="qia-card">
          <div class="qia-card-icon"><span class="ms">schedule</span></div>
          <h3>Jadwal Belajar Fleksibel</h3>
          <p>Waktu sesi belajar yang dapat disesuaikan dengan aktivitas sekolah anak dan fleksibilitas keluarga.</p>
        </div>

        <div class="qia-card">
          <div class="qia-card-icon"><span class="ms">verified</span></div>
          <h3>Evaluasi &amp; Sertifikasi Bulanan</h3>
          <p>Laporan hasil belajar bulanan lengkap yang dikirimkan langsung dan tercatat dalam sistem sertifikasi peserta didik.</p>
        </div>

        <div class="qia-card">
          <div class="qia-card-icon"><span class="ms">group</span></div>
          <h3>Privat &amp; Semi Privat Class</h3>
          <p>Pilihan kelas privat 1-on-1 intensif atau kelas kelompok kecil untuk menjaga fokus dan perhatian pengajar.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── PROGRAM SECTION ── -->
  <section class="qia-section" id="program" style="background: rgba(212, 147, 78, 0.15); border-top: 1px solid rgba(129, 81, 29, 0.2); border-bottom: 1px solid rgba(129, 81, 29, 0.2);">
    <div class="qia-container">
      <div class="qia-section-header">
        <span class="qia-section-eyebrow">Pilihan Program</span>
        <h2 class="qia-section-title">Program Belajar Quran Insight Academy</h2>
        <p class="qia-section-desc">Pilih jalur belajar yang paling sesuai dengan kebutuhan dan target pembelajaran putra-putri Ayah Bunda.</p>
      </div>

      <div class="qia-grid-3">
        <!-- Program 1: Bimbel Terstruktur -->
        <div class="qia-program-card">
          <div>
            <span class="qia-tag">Kelas SD – SMA</span>
            <h3>Bimbel Al-Qur’an Terstruktur</h3>
            <p>Belajar Al-Qur’an dalam kelompok dengan kurikulum dan target yang disesuaikan dengan kemampuan peserta.</p>
            <ul class="qia-program-list">
              <li>Maksimal 10 peserta per kelas</li>
              <li>Tahsin, Tajwid &amp; Tahfizh</li>
              <li>Materi sesuai kemampuan peserta</li>
              <li>Laporan perkembangan bulanan</li>
            </ul>
          </div>
          <a class="qia-btn qia-btn-wa" href="https://wa.me/6285355258891?text=Halo%20QIA,%20saya%20tertarik%20dengan%20Program%20Regular%20Class" target="_blank" rel="noopener noreferrer">
            <svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/></svg>
            Daftar Regular Class
          </a>
        </div>

        <!-- Program 2: Fun Quran Kids -->
        <div class="qia-program-card">
          <div>
            <span class="qia-tag">Kelas Usia 3–7 Tahun</span>
            <h3>Belajar Al-Qur’an dengan Ceria</h3>
            <p>Mengenal Al-Qur’an melalui aktivitas interaktif, pembiasaan Islami, dan pembelajaran yang menyenangkan.</p>
            <ul class="qia-program-list">
              <li>Maksimal 5 peserta per kelas</li>
              <li>Hijaiyah, Iqra &amp; hafalan</li>
              <li>Doa, adab &amp; storytelling Islami</li>
              <li>Aktivitas edukatif sesuai usia</li>
            </ul>
          </div>
          <a class="qia-btn qia-btn-wa" href="https://wa.me/6285355258891?text=Halo%20QIA,%20saya%20tertarik%20dengan%20Program%20Fun%20Quran%20Kids" target="_blank" rel="noopener noreferrer">
            <svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/></svg>
            Daftar Fun Qur’an Kids
          </a>
        </div>

        <!-- Program 3: Private Quran -->
        <div class="qia-program-card">
          <div>
            <span class="qia-tag">Kelas 1–5 Peserta</span>
            <h3>Belajar Al-Qur’an di Rumah</h3>
            <p>Pendampingan personal bersama Mentor QIA dengan program yang disesuaikan dengan kebutuhan dan target Ananda.</p>
            <ul class="qia-program-list">
              <li>Private 1–2 atau Semi Private 3–5</li>
              <li>Mentor datang langsung ke rumah</li>
              <li>Kurikulum sesuai level &amp; target</li>
              <li>Laporan melalui WhatsApp &amp; Portal Wali</li>
            </ul>
          </div>
          <a class="qia-btn qia-btn-primary" href="https://wa.me/6285355258891?text=Halo%20QIA,%20saya%20tertarik%20dengan%20Program%20Private%20Quran" target="_blank" rel="noopener noreferrer">
            <svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/></svg>
            Daftar Private Qur’an
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ── PORTAL DIGITAL SECTION (HANYA PORTAL WALI) ── -->
  <section class="qia-section" id="portal">
    <div class="qia-container">
      <div class="qia-section-header">
        <span class="qia-section-eyebrow">Akses Terintegrasi</span>
        <h2 class="qia-section-title">Portal Digital QIA</h2>
        <p class="qia-section-desc">Pantau perkembangan belajar putra-putri Ayah Bunda secara real-time melalui Portal Wali Peserta Didik.</p>
      </div>

      <div style="max-width: 480px; margin: 0 auto;">
        <div class="qia-card" style="text-align:center;">
          <div class="qia-card-icon" style="margin:0 auto 24px;"><span class="ms">verified_user</span></div>
          <span class="qia-portal-badge">Wali Peserta Didik</span>
          <h3>Portal Wali</h3>
          <p>Cek presensi, nilai, riwayat mutaba'ah hafalan, dan unduh laporan perkembangan anak.</p>
          <div style="margin-top:20px;">
            <button class="qia-btn qia-btn-primary" onclick="window.navigate('/portal-wali')" style="width:100%;justify-content:center;">
              <span class="ms">lock</span> Buka Portal Wali
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── FAQ SECTION ── -->
  <section class="qia-section" id="faq" style="background: rgba(212, 147, 78, 0.15); border-top: 1px solid rgba(129, 81, 29, 0.2);">
    <div class="qia-container">
      <div class="qia-section-header">
        <span class="qia-section-eyebrow">FAQ</span>
        <h2 class="qia-section-title">Pertanyaan Yang Sering Diajukan</h2>
        <p class="qia-section-desc">Informasi seputar pendaftaran dan sistem pembelajaran di Quran Insight Academy.</p>
      </div>

      <div class="qia-faq-list">
        <div class="qia-faq-item">
          <button class="qia-faq-btn" type="button">
            <span>Bagaimana cara mendaftar di Quran Insight Academy?</span>
            <span class="qia-faq-icon"><span class="ms">add</span></span>
          </button>
          <div class="qia-faq-body">
            Pendaftaran sangat mudah! Ayah Bunda cukup klik tombol <strong>Daftar via WhatsApp</strong>, tim admin kami akan menyapa Ayah Bunda untuk konsultasi level peserta didik, penyesuaian jadwal, dan pemilihan guru pembimbing.
          </div>
        </div>

        <div class="qia-faq-item">
          <button class="qia-faq-btn" type="button">
            <span>Bagaimana cara mendapatkan Kode Akses Portal Wali?</span>
            <span class="qia-faq-icon"><span class="ms">add</span></span>
          </button>
          <div class="qia-faq-body">
            Kini Ayah Bunda cukup membuka menu <strong>Portal Wali</strong> lalu mengetikkan nama ananda di kolom pencarian. Sistem akan langsung menampilkan seluruh rekap hafalan, kehadiran sesi belajar, dan grafik nilai secara instan!
          </div>
        </div>

        <div class="qia-faq-item">
          <button class="qia-faq-btn" type="button">
            <span>Apakah kelas dapat dilakukan secara online atau offline?</span>
            <span class="qia-faq-icon"><span class="ms">add</span></span>
          </button>
          <div class="qia-faq-body">
            QIA menyediakan opsi bimbingan privat online interaktif dari mana saja maupun privat/bimbel tatap muka (offline) dengan mentor yang datang langsung ke rumah atau lokasi belajar bersama.
          </div>
        </div>

        <div class="qia-faq-item">
          <button class="qia-faq-btn" type="button">
            <span>Berapa usia peserta didik yang diterima di QIA?</span>
            <span class="qia-faq-icon"><span class="ms">add</span></span>
          </button>
          <div class="qia-faq-body">
            Kami menerima peserta didik mulai usia anak usia dini (3–7 tahun untuk Fun Qur'an Kids), usia sekolah (SD, SMP, SMA), hingga kelas tahsin tajwid khusus untuk usia dewasa.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── CTA KONTAK SECTION ── -->
  <section class="qia-section" id="kontak">
    <div class="qia-container">
      <div class="qia-cta-box">
        <h2>Mulai Perjalanan Quran Putra-Putri Ayah Bunda Hari Ini</h2>
        <p>Konsultasikan kebutuhan belajar anak dan dapatkan sesi perkenalan bersama pengajar berpengalaman kami.</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
          <a class="qia-btn qia-btn-wa qia-btn-lg" href="https://wa.me/6285355258891" target="_blank" rel="noopener noreferrer">
            <svg class="wa-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/></svg>
            WhatsApp Admin
          </a>
          <button class="qia-btn qia-btn-primary qia-btn-lg" onclick="window.navigate('/portal-wali')">
            <span class="ms">key</span> Buka Portal Wali
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- ── FOOTER ── -->
  <footer class="qia-footer">
    <div class="qia-container qia-footer-inner">
      <div>
        <p><strong>Quran Insight Academy (QIA)</strong> — Bimbel &amp; Privat Al Quran Modern.</p>
        <p style="font-size:13px;margin-top:4px;">© 2026 Quran Insight Academy. All rights reserved.</p>
      </div>
      <div class="qia-footer-links">
        <a href="https://wa.me/6285355258891" target="_blank" rel="noopener noreferrer">WhatsApp Admin</a>
        <a href="https://instagram.com/quraninsightacademy" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a onclick="window.navigate('/portal-wali')">Portal Wali</a>
      </div>
    </div>
  </footer>

</div>
`

  // Attach global navigation
  window.navigateTo = (path) => navigate(path)
  window.navigate   = (path) => navigate(path)

  // Mobile menu toggle
  const mobileToggle = document.getElementById('qiaMobileToggle')
  const navLinks     = document.getElementById('qiaNavLinks')
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('is-open')
    })
  }

  // FAQ Accordion
  const faqBtns = document.querySelectorAll('.qia-faq-btn')
  faqBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.parentElement
      const isActive = item.classList.contains('is-active')
      document.querySelectorAll('.qia-faq-item').forEach(el => el.classList.remove('is-active'))
      if (!isActive) {
        item.classList.add('is-active')
      }
    })
  })

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      if (navLinks) navLinks.classList.remove('is-open')
      const targetId = a.getAttribute('href')
      const el = document.querySelector(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}
