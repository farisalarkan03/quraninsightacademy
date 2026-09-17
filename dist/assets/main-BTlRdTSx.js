import{c as ja}from"./vendor-Dx0atVpp.js";import{u as z,w as pa}from"./xlsx-DrgRuPKf.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();const Ia="https://wawamhpdthlttfttwjyc.supabase.co",Ba="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd2FtaHBkdGhsdHRmdHR3anljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjE4MzYsImV4cCI6MjEwNTE5NzgzNn0.zx35_sMK7z4CSw6b9OXzkFwpp3AsnVO1hOjQa42lAtg",Pa=!0,g=ja(Ia,Ba,{auth:{persistSession:!0,autoRefreshToken:!0}}),j=[{id:"admin-prod",nama:"Administrator QIA",email:"portalqia@gmail.com",role:"admin",jenis_mentor:null,no_hp:"",status:"aktif"}],E=[],I=[],D=[],M=[],q=[];function u(a,t){try{const e=localStorage.getItem("qia_mock_"+a);if(e)return JSON.parse(e)}catch{}return t}function A(a,t){try{localStorage.setItem("qia_mock_"+a,JSON.stringify(t))}catch{}}const L={async login(a,t){const{data:e,error:i}=await g.auth.signInWithPassword({email:a,password:t});if(i)throw i;return e},async logout(){localStorage.removeItem("qia_demo_session");try{await g.auth.signOut()}catch{}},async getSession(){try{const{data:{session:a}}=await g.auth.getSession();return a||null}catch{return null}},async getProfile(){var t;const a=await this.getSession();if(!((t=a==null?void 0:a.user)!=null&&t.id))return null;try{const{data:e,error:i}=await g.from("profiles").select("*").eq("id",a.user.id).single();if(!i&&e)return e}catch{}return null},onAuthStateChange(a){return g.auth.onAuthStateChange(a)}},h={async getDashboardStats(){try{const{data:o,error:d}=await g.rpc("get_admin_dashboard_stats");if(!d&&o)return{...o,total_santri_aktif:o.total_peserta,total_santri_bimbel:o.total_bimbel,total_santri_privat:o.total_privat,total_mentor_aktif:o.total_mentor,total_kelas_aktif:o.total_kelas}}catch{}const a=await this.getPesertaDidik(),t=await this.getMentors(),e=await this.getKelas(),i=a.filter(o=>o.status==="aktif").length,n=a.filter(o=>o.jenis==="bimbel"&&o.status==="aktif").length,s=a.filter(o=>o.jenis==="privat"&&o.status==="aktif").length,l=t.filter(o=>o.status==="aktif").length,r=e.filter(o=>o.status==="aktif").length;return{total_peserta:i,total_bimbel:n,total_privat:s,total_mentor:l,total_kelas:r,hadir_hari_ini:0,absensi_hari_ini:0,rata_nilai_bulan_ini:0,aktivitas_terbaru:[],total_santri_aktif:i,total_santri_bimbel:n,total_santri_privat:s,total_mentor_aktif:l,total_kelas_aktif:r,persentase_kehadiran_bulan_ini:100}},async getMentors(a={}){try{let e=g.from("profiles").select("*").eq("role","mentor").order("nama");a.status&&(e=e.eq("status",a.status)),a.jenis&&(e=e.eq("jenis_mentor",a.jenis));const{data:i,error:n}=await e;if(!n&&i)return i}catch{}const t=u("profiles",j).filter(e=>e.role==="mentor");return a.jenis?t.filter(e=>e.jenis_mentor===a.jenis||e.jenis_mentor==="keduanya"):t},async createMentor(a,t,e){try{const{data:s,error:l}=await g.auth.admin.createUser({email:a,password:t,email_confirm:!0,user_metadata:{nama:e.nama,role:"mentor"}});if(!l){const{data:r,error:o}=await g.from("profiles").update({...e,role:"mentor"}).eq("id",s.user.id).select().single();if(!o&&r)return r}}catch{}const i=u("profiles",j),n={id:"mentor-"+Date.now(),email:a,...e,role:"mentor",status:"aktif"};return i.push(n),A("profiles",i),n},async updateMentor(a,t){try{const{data:n,error:s}=await g.from("profiles").update(t).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=u("profiles",j),i=e.findIndex(n=>n.id===a);return i!==-1?(e[i]={...e[i],...t},A("profiles",e),e[i]):null},async getKelas(a={}){try{let i=g.from("kelas").select("*, mentor:profiles(id, nama, email, jenis_mentor)").order("nama_kelas");a.status&&(i=i.eq("status",a.status)),a.id_mentor&&(i=i.eq("id_mentor",a.id_mentor));const{data:n,error:s}=await i;if(!s&&n)return n}catch{}const t=u("kelas",E),e=u("profiles",j);return t.map(i=>({...i,mentor:e.find(n=>n.id===i.id_mentor)||{nama:"Asatidz"}}))},async createKelas(a){try{const{data:i,error:n}=await g.from("kelas").insert(a).select().single();if(!n&&i)return i}catch{}const t=u("kelas",E),e={id:Date.now(),status:"aktif",...a};return t.push(e),A("kelas",t),e},async updateKelas(a,t){try{const{data:n,error:s}=await g.from("kelas").update(t).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=u("kelas",E),i=e.findIndex(n=>n.id===a);return i!==-1?(e[i]={...e[i],...t},A("kelas",e),e[i]):null},async deleteKelas(a){try{await g.from("kelas").delete().eq("id",a)}catch{}const t=u("kelas",E).filter(e=>e.id!==a);A("kelas",t)},async getPesertaDidik(a={}){try{let n=g.from("peserta_didik").select("*, mentor:profiles(id, nama), kelas(id, nama_kelas)").order("nama_lengkap");a.jenis&&(n=n.eq("jenis",a.jenis)),a.id_kelas&&(n=n.eq("id_kelas",a.id_kelas)),a.id_mentor&&(n=n.eq("id_mentor",a.id_mentor)),a.status&&(n=n.eq("status",a.status));const{data:s,error:l}=await n;if(!l&&s)return s}catch{}const t=u("peserta",I),e=u("kelas",E),i=u("profiles",j);return t.map(n=>({...n,kelas:e.find(s=>s.id===n.id_kelas)||null,mentor:i.find(s=>s.id===n.id_mentor)||null}))},async createPeserta(a){try{const{data:i,error:n}=await g.from("peserta_didik").insert(a).select().single();if(!n&&i)return i}catch{}const t=u("peserta",I),e={id:Date.now(),tanggal_daftar:new Date().toISOString().split("T")[0],status:"aktif",...a};return t.push(e),A("peserta",t),e},async updatePeserta(a,t){try{const{data:n,error:s}=await g.from("peserta_didik").update(t).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=u("peserta",I),i=e.findIndex(n=>n.id===a);return i!==-1?(e[i]={...e[i],...t},A("peserta",e),e[i]):null},async bulkUpdatePeserta(a){try{await g.from("peserta_didik").upsert(a);return}catch{}const t=u("peserta",I);a.forEach(e=>{const i=t.findIndex(n=>n.id===e.id);i!==-1?t[i]={...t[i],...e}:t.push(e)}),A("peserta",t)},async exportAllData(a,t="*"){try{const{data:e,error:i}=await g.from(a).select(t).order("id");if(!i&&e)return e}catch{}return a==="peserta_didik"?u("peserta",I):a==="profiles"?u("profiles",j):a==="kelas"?u("kelas",E):a==="kehadiran"?u("kehadiran",q):a==="kemajuan"?u("kemajuan",D):a==="penilaian"?u("penilaian",M):[]},async exportAllTables(){try{const[a,t,e,i,n,s]=await Promise.all([g.from("peserta_didik").select("*, kelas(nama_kelas), mentor:profiles(nama)"),g.from("profiles").select("*").eq("role","mentor"),g.from("kelas").select("*, mentor:profiles(nama)"),g.from("kehadiran").select("*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)"),g.from("kemajuan").select("*, peserta:peserta_didik(nama_lengkap)"),g.from("penilaian").select("*, peserta:peserta_didik(nama_lengkap)")]);if(a.data)return{peserta:a.data,mentor:t.data,kelas:e.data,kehadiran:i.data,kemajuan:n.data,penilaian:s.data}}catch{}return{peserta:u("peserta",I),mentor:u("profiles",j).filter(a=>a.role==="mentor"),kelas:u("kelas",E),kehadiran:u("kehadiran",q),kemajuan:u("kemajuan",D),penilaian:u("penilaian",M)}},async logActivity(a,t,e,i={}){try{const{data:{user:n}}=await g.auth.getUser();await g.from("activity_logs").insert({id_user:n==null?void 0:n.id,action:a,entity_type:t,entity_id:String(e),detail:i})}catch{}}},_={async getMyKelas(a){try{const{data:e,error:i}=await g.from("kelas").select("*").eq("id_mentor",a).eq("status","aktif").order("nama_kelas");if(!i&&e)return e}catch{}return u("kelas",E).filter(e=>e.id_mentor===a||!a)},async getMyPeserta(a,t=null){try{let n=g.from("peserta_didik").select("*, kelas(id, nama_kelas)").eq("id_mentor",a).eq("status","aktif").order("nama_lengkap");t&&(n=n.eq("id_kelas",t));const{data:s,error:l}=await n;if(!l&&s)return s}catch{}const e=u("peserta",I),i=u("kelas",E);return e.filter(n=>(!a||n.id_mentor===a)&&(!t||n.id_kelas===t)).map(n=>({...n,kelas:i.find(s=>s.id===n.id_kelas)}))},async bulkSimpanAbsensi(a){try{const{data:e,error:i}=await g.rpc("bulk_upsert_kehadiran",{p_records:a});if(!i)return e}catch{}const t=u("kehadiran",q);return a.forEach(e=>{t.unshift({id:Date.now()+Math.random(),...e})}),A("kehadiran",t),{success:!0,count:a.length}},async getRiwayatKehadiran(a,t=30){try{const{data:i,error:n}=await g.from("kehadiran").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(t);if(!n&&i)return i}catch{}return u("kehadiran",q).filter(i=>i.id_peserta===Number(a)).slice(0,t)},async getKemajuan(a,t=20){try{const{data:i,error:n}=await g.from("kemajuan").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(t);if(!n&&i)return i}catch{}return u("kemajuan",D).filter(i=>i.id_peserta===Number(a)).slice(0,t)},async addKemajuan(a){try{const{data:i,error:n}=await g.from("kemajuan").insert(a).select().single();if(!n&&i)return i}catch{}const t=u("kemajuan",D),e={id:Date.now(),...a};return t.unshift(e),A("kemajuan",t),e},async getPenilaian(a,t=20){try{const{data:i,error:n}=await g.from("penilaian").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(t);if(!n&&i)return i}catch{}return u("penilaian",M).filter(i=>i.id_peserta===Number(a)).slice(0,t)},async addPenilaian(a){try{const{data:i,error:n}=await g.from("penilaian").insert(a).select().single();if(!n&&i)return i}catch{}const t=u("penilaian",M),e={id:Date.now(),...a};return t.unshift(e),A("penilaian",t),e},async getCatatan(a){return[]},async addCatatan(a){return{id:Date.now(),...a}},async getPelajaranTambahan(a){return[]},async addPelajaranTambahan(a){return{id:Date.now(),...a}},async updatePassword(a){{const{error:t}=await g.auth.updateUser({password:a});if(t)throw t}},async getChartData(a){const t=await this.getKemajuan(a,30),e=await this.getPenilaian(a,30),i=await this.getRiwayatKehadiran(a,60);return{kemajuan:t,penilaian:e,kehadiran:i}}},C={async searchPeserta(a){const t=(a||"").trim().toLowerCase();if(!t)return[];try{const{data:s,error:l}=await g.rpc("search_peserta_wali_by_name",{p_nama:t});if(!l&&s)return s}catch{}const e=u("peserta",I),i=u("kelas",E),n=u("profiles",j);return e.filter(s=>s.nama_lengkap.toLowerCase().includes(t)).map(s=>{const l=i.find(o=>o.id===s.id_kelas),r=n.find(o=>o.id===s.id_mentor);return{id:s.id,nama_lengkap:s.nama_lengkap,jenis:s.jenis,nama_kelas:(l==null?void 0:l.nama_kelas)||(s.jenis==="privat"?"Program Privat":"-"),nama_mentor:(r==null?void 0:r.nama)||"Asatidz QIA"}})},async getPesertaDetail(a){const t=Number(a);try{const{data:p,error:w}=await g.rpc("get_peserta_detail_wali",{p_peserta_id:t});if(!w&&p&&p.peserta)return p}catch{}const i=u("peserta",I).find(p=>p.id===t);if(!i)return null;const n=u("kelas",E),s=u("profiles",j),l=n.find(p=>p.id===(i==null?void 0:i.id_kelas)),r=s.find(p=>p.id===(i==null?void 0:i.id_mentor)),o=u("kemajuan",D).filter(p=>p.id_peserta===t),d=u("kehadiran",q).filter(p=>p.id_peserta===t),c=u("penilaian",M).filter(p=>p.id_peserta===t),f=d.filter(p=>p.status_hadir==="hadir").length,y=d.filter(p=>p.status_hadir==="izin").length,b=d.filter(p=>p.status_hadir==="sakit").length,k=d.filter(p=>p.status_hadir==="alpa").length;return{peserta:i,mentor:r||{nama:"Belum ditentukan"},kelas:l||{nama_kelas:i.jenis==="privat"?"Program Privat":"-"},kemajuan:o,penilaian:c,kehadiran_summary:{hadir:f,izin:y,sakit:b,alpa:k,total:d.length},riwayat_kehadiran:d,catatan_mentor:[]}},async getChartDataPeserta(a){const t=Number(a);{try{const{data:s,error:l}=await g.rpc("get_peserta_charts_wali",{p_peserta_id:t});if(!l&&s)return s}catch{}try{const[s,l,r]=await Promise.all([g.from("penilaian").select("tanggal, nilai_angka").eq("id_peserta",t).order("tanggal").limit(20),g.from("kehadiran").select("tanggal, status_hadir, materi_pembahasan").eq("id_peserta",t).order("tanggal").limit(60),g.from("kemajuan").select("tanggal, kitab_surat, halaman_ayat").eq("id_peserta",t).order("tanggal").limit(20)]);if(s.data)return{penilaian:s.data,kehadiran:l.data,kemajuan:r.data}}catch{}}const e=u("penilaian",M).filter(s=>s.id_peserta===t),i=u("kehadiran",q).filter(s=>s.id_peserta===t),n=u("kemajuan",D).filter(s=>s.id_peserta===t);return{penilaian:e,kehadiran:i,kemajuan:n}}},La=Object.freeze(Object.defineProperty({__proto__:null,adminService:h,authService:L,isConfigured:Pa,mentorService:_,supabase:g,waliService:C},Symbol.toStringTag,{value:"Module"}));function ma(a,t,e){document.title="Quran Insight Academy — Bimbingan Al-Quran Terpercaya",a.innerHTML=`
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
`,window.navigateTo=l=>t(l),window.navigate=l=>t(l);const i=document.getElementById("qiaMobileToggle"),n=document.getElementById("qiaNavLinks");i&&n&&i.addEventListener("click",()=>{n.classList.toggle("is-open")}),document.querySelectorAll(".qia-faq-btn").forEach(l=>{l.addEventListener("click",function(){const r=this.parentElement,o=r.classList.contains("is-active");document.querySelectorAll(".qia-faq-item").forEach(d=>d.classList.remove("is-active")),o||r.classList.add("is-active")})}),document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener("click",r=>{r.preventDefault(),n&&n.classList.remove("is-open");const o=l.getAttribute("href"),d=document.querySelector(o);d&&d.scrollIntoView({behavior:"smooth"})})})}const Sa="modulepreload",za=function(a){return"/"+a},ea={},Da=function(t,e,i){let n=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),r=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(e.map(o=>{if(o=za(o),o in ea)return;ea[o]=!0;const d=o.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${c}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Sa,d||(f.as="script"),f.crossOrigin="",f.href=o,r&&f.setAttribute("nonce",r),document.head.appendChild(f),d)return new Promise((y,b)=>{f.addEventListener("load",y),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${o}`)))})}))}function s(l){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=l,window.dispatchEvent(r),!r.defaultPrevented)throw l}return n.then(l=>{for(const r of l||[])r.status==="rejected"&&s(r.reason);return t().catch(s)})};function W(a,t=""){const e={};for(const[i,n]of Object.entries(a)){const s=t?`${t}_${i}`:i;n&&typeof n=="object"&&!Array.isArray(n)&&!(n instanceof Date)?Object.assign(e,W(n,s)):Array.isArray(n)||(e[s]=n)}return e}function ua(a,t="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const e=a.map(l=>W(l)),i=[...new Set(e.flatMap(Object.keys))],n=[i.join(","),...e.map(l=>i.map(r=>{const o=l[r]??"",d=String(o).replace(/"/g,'""');return d.includes(",")||d.includes('"')||d.includes(`
`)?`"${d}"`:d}).join(","))],s=new Blob(["\uFEFF"+n.join(`
`)],{type:"text/csv;charset=utf-8;"});ba(s,`${t}.csv`)}function ga(a,t="export",e="Data"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const i=a.map(r=>W(r)),n=z.json_to_sheet(i),s=z.book_new();z.book_append_sheet(s,n,e);const l=Object.keys(i[0]||{}).map(r=>({wch:Math.max(r.length,...i.map(o=>String(o[r]??"").length))}));n["!cols"]=l,pa(s,`${t}.xlsx`)}function fa(a,t="QIA_DataLengkap"){const e=z.book_new();for(const[i,n]of Object.entries(a)){if(!n||!n.length)continue;const s=n.map(o=>W(o)),l=z.json_to_sheet(s),r=Object.keys(s[0]||{}).map(o=>({wch:Math.max(o.length,...s.map(d=>String(d[o]??"").length))}));l["!cols"]=r,z.book_append_sheet(e,l,i.substring(0,31))}pa(e,`${t}.xlsx`)}function Ma(a,t="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const e=new Blob([JSON.stringify(a,null,2)],{type:"application/json"});ba(e,`${t}.json`)}function qa(a){var K;const{peserta:t,mentor:e,kelas:i,kemajuan:n,penilaian:s,kehadiran_summary:l,riwayat_kehadiran:r,catatan_mentor:o}=a,d=l||{},c=(s||[]).slice(0,10),f=(n||[]).slice(0,10),y=(d.hadir||0)+(d.izin||0)+(d.sakit||0)+(d.alpa||0),b=y>0?Math.round(d.hadir/y*100):0,k=c.length>0?(c.reduce((x,$a)=>x+($a.nilai_angka||0),0)/c.length).toFixed(1):"-",p=`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rapor — ${(t==null?void 0:t.nama_lengkap)||""}</title>
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
  <span class="badge">${((K=t==null?void 0:t.jenis)==null?void 0:K.toUpperCase())||"BIMBEL"}</span>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>Nama Peserta Didik</h3>
    <div class="val">${(t==null?void 0:t.nama_lengkap)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Kelas / Program</h3>
    <div class="val">${(i==null?void 0:i.nama_kelas)||((t==null?void 0:t.jenis)==="privat"?"Privat":"-")}</div>
  </div>
  <div class="info-card">
    <h3>Mentor / Ustadz</h3>
    <div class="val">${(e==null?void 0:e.nama)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Rata-rata Nilai</h3>
    <div class="val" style="color:#059669; font-size:20px;">${k}</div>
  </div>
</div>

<h2 class="section">Rekap Kehadiran</h2>
<div class="stat-row">
  <div class="stat-box"><div class="n">${d.hadir||0}</div><div class="l">Hadir</div></div>
  <div class="stat-box"><div class="n">${d.izin||0}</div><div class="l">Izin</div></div>
  <div class="stat-box"><div class="n">${d.sakit||0}</div><div class="l">Sakit</div></div>
  <div class="stat-box"><div class="n">${d.alpa||0}</div><div class="l">Alpa</div></div>
  <div class="stat-box" style="background:#059669;"><div class="n" style="color:#fff;">${b}%</div><div class="l">Kehadiran</div></div>
</div>

<h2 class="section">Riwayat Kemajuan Hafalan</h2>
<table>
  <tr><th>Tanggal</th><th>Kitab / Surah</th><th>Halaman / Ayat</th><th>Status</th></tr>
  ${f.map(x=>`<tr><td>${x.tanggal||""}</td><td>${x.kitab_surat||""}</td><td>${x.halaman_ayat||""}</td><td>${x.status_kelancaran||""}</td></tr>`).join("")}
</table>

<h2 class="section">Riwayat Penilaian</h2>
<table>
  <tr><th>Tanggal</th><th>Nilai</th><th>Adab</th><th>Tajwid</th><th>Kelancaran</th><th>Catatan</th></tr>
  ${c.map(x=>`<tr><td>${x.tanggal||""}</td><td><b>${x.nilai_angka||"-"}</b></td><td>${x.nilai_adab||"-"}</td><td>${x.nilai_tajwid||"-"}</td><td>${x.nilai_kelancaran||"-"}</td><td>${x.catatan||""}</td></tr>`).join("")}
</table>

${o!=null&&o.length?`
<h2 class="section">Catatan Mentor</h2>
<table>
  <tr><th>Tanggal</th><th>Catatan</th></tr>
  ${(o||[]).slice(0,5).map(x=>`<tr><td>${x.tanggal||""}</td><td>${x.isi_catatan||""}</td></tr>`).join("")}
</table>`:""}

<div class="footer">
  Dicetak: ${new Date().toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} — Quran Insight Academy
</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body></html>`,w=window.open("","_blank","width=800,height=900");w.document.write(p),w.document.close()}function ba(a,t){const e=URL.createObjectURL(a),i=document.createElement("a");i.href=e,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(e)}let v={profile:null,stats:null,activeView:"dashboard",ssActiveTab:"peserta",ssData:{peserta:[],mentor:[],kelas:[],kehadiran:[],kemajuan:[],penilaian:[]},ssDirtyRows:new Set,ssNewRows:[],ssSortCol:null,ssSortDir:"asc",ssFilter:""};async function Fa(a,t,e){document.title="Portal Admin — Quran Insight Academy";try{if(v.profile=await L.getProfile(),!v.profile||v.profile.role!=="admin"){ta(a,t,e);return}}catch{ta(a,t,e);return}a.innerHTML=va(),ya(t,e),await X(e),G("dashboard",e)}function ta(a,t,e){a.innerHTML=`
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
  </div>`,document.getElementById("admin-login-form").addEventListener("submit",async n=>{n.preventDefault();const s=document.getElementById("admin-login-email").value,l=document.getElementById("admin-login-pwd").value,r=document.getElementById("btn-submit-login");r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{const o=await L.login(s,l),d=o==null?void 0:o.user;if(!d)throw new Error("Login gagal, coba lagi.");v.profile={id:d.id,email:d.email,nama:"Administrator QIA",role:"admin",status:"aktif"};try{const{supabase:c}=await Da(async()=>{const{supabase:y}=await Promise.resolve().then(()=>La);return{supabase:y}},void 0),{data:f}=await c.from("profiles").select("*").eq("id",d.id).single();f&&(v.profile=f)}catch{}e("Berhasil masuk sebagai Admin!","success"),a.innerHTML=va(),ya(t,e),await X(e),G("dashboard",e)}catch(o){e("Gagal masuk: "+o.message,"error"),r.disabled=!1,r.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Admin'}})}function va(){return`
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
</div>`}function ya(a,t){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(e=>{e.addEventListener("click",()=>G(e.dataset.view,t))}),document.getElementById("btn-logout").addEventListener("click",async()=>{await L.logout(),a("/")}),document.getElementById("admin-modal-close").addEventListener("click",$),document.getElementById("admin-modal").addEventListener("click",function(e){e.target===this&&$()})}function Ca(a){var t;document.querySelectorAll(".nav-item[data-view]").forEach(e=>e.classList.remove("active")),(t=document.getElementById("nav-"+a))==null||t.classList.add("active")}function G(a,t){v.activeView=a,Ca(a);const e=document.getElementById("main-content");switch(document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show"),a){case"dashboard":U(e),X(t).then(()=>{v.activeView==="dashboard"&&U(e)});break;case"mentor":T(e,t);break;case"kelas":R(e,t);break;case"peserta":N(e,t);break;case"spreadsheet":Ha(e,t);break;case"export":Qa(e,t);break;case"activity":Oa(e,t);break;default:U(e)}window.renderAdminView=i=>G(i,t)}async function X(a){var t,e;try{v.stats=await h.getDashboardStats();const i=document.getElementById("user-name");i&&(i.textContent=((t=v.profile)==null?void 0:t.nama)||"Admin");const n=document.getElementById("user-avatar");n&&(n.textContent=(((e=v.profile)==null?void 0:e.nama)||"A").charAt(0))}catch(i){a&&a("Gagal load stats: "+i.message,"error")}}function U(a,t){const e=v.stats||{};a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Admin</span></div>
      <div class="page-breadcrumb">${new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
    </div>
    <button class="btn btn-primary" onclick="renderAdminView('spreadsheet')">
      <i class="fa-solid fa-table"></i> Buka Spreadsheet Editor
    </button>
  </div>

  <div class="grid-4" style="margin-bottom:24px;">
    ${[[e.total_peserta||0,"Total Peserta Didik","fa-users","stat-icon-gold"],[e.total_bimbel||0,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[e.total_privat||0,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[e.total_mentor||0,"Mentor Aktif","fa-person-chalkboard","stat-icon-blue"],[e.total_kelas||0,"Kelas Aktif","fa-door-open","stat-icon-gold"],[e.hadir_hari_ini||0,"Hadir Hari Ini","fa-calendar-check","stat-icon-emerald"],[e.absensi_hari_ini||0,"Sesi Hari Ini","fa-clipboard-list","stat-icon-brown"],[e.rata_nilai_bulan_ini||0,"Rata Nilai Bulan Ini","fa-star","stat-icon-blue"]].map(([i,n,s,l])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${l}"><i class="fa-solid ${s}" style="color:white;"></i></div>
      <div><div class="stat-value">${i}</div><div class="stat-label">${n}</div></div>
    </div>`).join("")}
  </div>

  <!-- Quick actions -->
  <div class="grid-3" style="margin-bottom:24px;">
    ${[["fa-chalkboard-user","Tambah Mentor","Daftarkan ustadz/ustadzah baru","btn-gold","mentor"],["fa-door-open","Buat Kelas Baru","Tambah kelas bimbel & assign mentor","btn-emerald","kelas"],["fa-user-plus","Tambah Peserta Didik","Daftarkan peserta didik baru","btn-blue","peserta"],["fa-table","Spreadsheet Editor","Edit data secara massal","btn-gold","spreadsheet"],["fa-file-export","Export Data","Download data ke Excel/CSV","btn-brown","export"],["fa-clock-rotate-left","Log Aktivitas","Lihat riwayat aksi admin & mentor","btn-gray","activity"]].map(([i,n,s,l,r])=>`
    <button onclick="renderAdminView('${r}')"
      style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:var(--radius);
      padding:20px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.25s;"
      onmouseover="this.style.borderColor='var(--gold-500)';this.style.transform='translateY(-2px)'"
      onmouseout="this.style.borderColor='var(--border-dark)';this.style.transform=''">
      <i class="fa-solid ${i}" style="font-size:22px;color:#F0AF43;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;color:var(--cream-100);font-size:14px;margin-bottom:4px;">${n}</div>
      <div style="font-size:12px;color:var(--text-card-muted);">${s}</div>
    </button>`).join("")}
  </div>

  <!-- Charts Ringkasan & Analitik -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-bottom:24px;">
    <div class="card">
      <h3 style="color:var(--cream-100);font-size:14px;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-chart-pie" style="color:#F0AF43;"></i> Distribusi Peserta Didik
      </h3>
      <div style="position:relative;height:210px;display:flex;align-items:center;justify-content:center;">
        <canvas id="admin-chart-distribusi"></canvas>
      </div>
    </div>
    <div class="card">
      <h3 style="color:var(--cream-100);font-size:14px;margin-bottom:14px;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-chart-column" style="color:#10b981;"></i> Rangkuman Data Sistem
      </h3>
      <div style="position:relative;height:210px;display:flex;align-items:center;justify-content:center;">
        <canvas id="admin-chart-sistem"></canvas>
      </div>
    </div>
  </div>

  <!-- Activity -->
  <div class="card">
    <h3 style="color:var(--cream-100);font-size:14px;margin-bottom:14px;">
      <i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Aktivitas Terbaru
    </h3>
    ${(e.aktivitas_terbaru||[]).length===0?'<p style="color:var(--text-card-muted);font-size:13px;">Belum ada aktivitas tercatat.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${(e.aktivitas_terbaru||[]).slice(0,6).map(i=>`
        <div style="padding:10px 14px;background:rgba(255,255,255,0.04);border-radius:10px;
          display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--cream-100);">${i.action}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${i.entity_type||""} ${i.entity_id?"#"+i.entity_id:""}</div>
          </div>
          <div style="font-size:11px;color:var(--text-card-muted);white-space:nowrap;">${wa(i.created_at)}</div>
        </div>`).join("")}
      </div>`}
  </div>`,Ka(e)}function Ka(a){setTimeout(()=>{const t=document.getElementById("admin-chart-distribusi");if(t&&typeof Chart<"u"){const i=a.total_bimbel||0,n=a.total_privat||0;i+n===0?t.parentElement.innerHTML=`
          <div style="text-align:center;color:var(--text-card-muted);font-size:12.5px;">
            <i class="fa-solid fa-chart-pie" style="font-size:28px;opacity:0.35;margin-bottom:8px;color:#F0AF43;display:block;"></i>
            Belum ada data peserta didik
          </div>`:new Chart(t,{type:"doughnut",data:{labels:["Bimbel Kelompok","Program Privat"],datasets:[{data:[i,n],backgroundColor:["#10b981","#F0AF43"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"68%",plugins:{legend:{position:"bottom",labels:{color:"#fdf0e2",boxWidth:12,padding:12,font:{size:12}}}}}})}const e=document.getElementById("admin-chart-sistem");e&&typeof Chart<"u"&&new Chart(e,{type:"bar",data:{labels:["Peserta Bimbel","Peserta Privat","Mentor Aktif","Kelas Aktif"],datasets:[{label:"Jumlah",data:[a.total_bimbel||0,a.total_privat||0,a.total_mentor||0,a.total_kelas||0],backgroundColor:["rgba(16,185,129,0.75)","rgba(240,175,67,0.75)","rgba(59,130,246,0.75)","rgba(217,119,6,0.75)"],borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{color:"#c9a87a",stepSize:1,font:{size:11}},grid:{color:"rgba(255,255,255,0.06)"}},x:{ticks:{color:"#c9a87a",font:{size:11}},grid:{display:!1}}}}})},50)}async function T(a,t){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Mentor / <span>Asatidz</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-mentor">
      <i class="fa-solid fa-plus"></i> Tambah Mentor
    </button>
  </div>
  <div id="mentor-list-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;try{const e=await h.getMentors();document.getElementById("mentor-list-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama</th><th>Email</th><th>Jenis</th><th>No HP</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${e.length===0?'<tr><td colspan="6" style="text-align:center;padding:28px;color:#81511D;">Belum ada mentor.</td></tr>':e.map(i=>`<tr>
              <td><div style="font-weight:600;">${i.nama}</div></td>
              <td><span style="font-size:12px;">${i.email}</span></td>
              <td>${xa(i.jenis_mentor)}</td>
              <td><span style="font-size:13px;">${i.no_hp||"-"}</span></td>
              <td>${aa(i.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editMentor('${i.id}')"><i class="fa-solid fa-pen"></i></button>
                  ${i.status==="aktif"?`<button class="btn btn-danger btn-sm" onclick="toggleMentorStatus('${i.id}','nonaktif')"><i class="fa-solid fa-ban"></i></button>`:`<button class="btn btn-success btn-sm" onclick="toggleMentorStatus('${i.id}','aktif')"><i class="fa-solid fa-check"></i></button>`}
                </div>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`,window.editMentor=i=>{const n=e.find(s=>s.id===i);n&&S("Edit Mentor",`
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-group"><label class="form-label">Nama</label><input type="text" class="form-control" id="em-nama" value="${n.nama}" /></div>
        <div class="form-group"><label class="form-label">No HP</label><input type="text" class="form-control" id="em-nohp" value="${n.no_hp||""}" /></div>
        <div class="form-group"><label class="form-label">Jenis Mentor</label>
          <select class="form-control" id="em-jenis">
            <option value="bimbel" ${n.jenis_mentor==="bimbel"?"selected":""}>Bimbel</option>
            <option value="privat" ${n.jenis_mentor==="privat"?"selected":""}>Privat</option>
            <option value="keduanya" ${n.jenis_mentor==="keduanya"?"selected":""}>Keduanya</option>
          </select>
        </div>
      </div>`,async()=>{await h.updateMentor(i,{nama:document.getElementById("em-nama").value,no_hp:document.getElementById("em-nohp").value,jenis_mentor:document.getElementById("em-jenis").value}),t("Mentor diperbarui!","success"),$(),T(a,t)})},window.toggleMentorStatus=async(i,n)=>{await h.updateMentor(i,{status:n}),t(`Mentor ${n==="aktif"?"diaktifkan":"dinonaktifkan"}!`,"success"),T(a,t)}}catch(e){t("Gagal memuat mentor: "+e.message,"error")}document.getElementById("btn-tambah-mentor").addEventListener("click",()=>{S("Tambah Mentor Baru",`
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
    </div>`,async()=>{const e=document.getElementById("nm-email").value,i=document.getElementById("nm-pw").value;if(!e||!i){t("Isi email dan password.","info");return}try{await h.createMentor(e,i,{nama:document.getElementById("nm-nama").value,no_hp:document.getElementById("nm-nohp").value,jenis_mentor:document.getElementById("nm-jenis").value}),t("Mentor berhasil ditambahkan!","success"),$(),T(a,t)}catch(n){t("Gagal: "+n.message,"error")}})})}async function R(a,t){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Kelas <span>Bimbel</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-kelas"><i class="fa-solid fa-plus"></i> Buat Kelas Baru</button>
  </div>
  <div id="kelas-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[e,i,n]=await Promise.all([h.getKelas(),h.getMentors({status:"aktif"}),h.getPesertaDidik({jenis:"bimbel",status:"aktif"})]).catch(s=>(t("Gagal memuat data.","error"),[[],[],[]]));document.getElementById("kelas-wrapper").innerHTML=`
  <div class="grid-3">
    ${e.length===0?'<div style="grid-column:1/-1;text-align:center;padding:40px;color:#81511D;">Belum ada kelas. Buat kelas pertama!</div>':e.map(s=>{var r;const l=n.filter(o=>o.id_kelas===s.id);return`
        <div class="card anim-fadeInUp" style="position:relative;">
          <div style="position:absolute;top:16px;right:16px;">${aa(s.status)}</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <div>
              <h3 style="color:var(--cream-100);font-size:14px;">${s.nama_kelas}</h3>
              <div style="font-size:12px;color:var(--text-card-muted);">${((r=s.mentor)==null?void 0:r.nama)||"Belum ada mentor"}</div>
            </div>
          </div>
          ${s.hari_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:4px;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${s.hari_jadwal}</div>`:""}
          ${s.jam_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:10px;"><i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${s.jam_jadwal}</div>`:""}
          <div style="font-size:13px;color:var(--cream-100);margin-bottom:8px;"><i class="fa-solid fa-users" style="color:#10b981;"></i> ${l.length} / ${s.kapasitas||20} peserta didik</div>
          <!-- Santri list mini -->
          <div style="max-height:80px;overflow-y:auto;margin-bottom:12px;">
            ${l.map(o=>`<div style="font-size:12px;color:var(--text-card-muted);padding:2px 0;">• ${o.nama_lengkap}</div>`).join("")}
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="editKelas(${s.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="kelolaSantriKelas(${s.id},'${s.nama_kelas}')">
              <i class="fa-solid fa-user-plus"></i> Kelola Peserta Didik
            </button>
          </div>
        </div>`}).join("")}
  </div>`,document.getElementById("btn-tambah-kelas").addEventListener("click",()=>{S("Buat Kelas Baru",`
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="nk-nama" placeholder="cth: Tahsin Al-Jazari A" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="nk-desc" rows="2" placeholder="Deskripsi kelas…"></textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="nk-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${i.filter(s=>s.jenis_mentor==="bimbel"||s.jenis_mentor==="keduanya").map(s=>`<option value="${s.id}">${s.nama}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="nk-hari" placeholder="cth: Senin & Rabu" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="nk-jam" placeholder="cth: 15:30 – 17:00" /></div>
      </div>
      <div class="form-group"><label class="form-label">Kapasitas Maksimal</label><input type="number" class="form-control" id="nk-kap" value="15" /></div>
    </div>`,async()=>{const s=document.getElementById("nk-nama").value.trim();if(!s){t("Isi nama kelas.","info");return}try{await h.createKelas({nama_kelas:s,deskripsi:document.getElementById("nk-desc").value,id_mentor:document.getElementById("nk-mentor").value||null,hari_jadwal:document.getElementById("nk-hari").value,jam_jadwal:document.getElementById("nk-jam").value,kapasitas:parseInt(document.getElementById("nk-kap").value)||15}),t("Kelas berhasil dibuat!","success"),$(),R(a,t)}catch(l){t("Gagal: "+l.message,"error")}})}),window.editKelas=s=>{const l=e.find(r=>r.id===s);l&&S("Edit Kelas",`
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="ek-nama" value="${l.nama_kelas}" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="ek-desc" rows="2">${l.deskripsi||""}</textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="ek-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${i.filter(r=>r.jenis_mentor==="bimbel"||r.jenis_mentor==="keduanya").map(r=>`<option value="${r.id}" ${l.id_mentor===r.id?"selected":""}>${r.nama}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="ek-hari" value="${l.hari_jadwal||""}" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="ek-jam" value="${l.jam_jadwal||""}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="ek-status">
          <option value="aktif" ${l.status==="aktif"?"selected":""}>Aktif</option>
          <option value="nonaktif" ${l.status==="nonaktif"?"selected":""}>Nonaktif</option>
        </select>
      </div>
    </div>`,async()=>{await h.updateKelas(s,{nama_kelas:document.getElementById("ek-nama").value,deskripsi:document.getElementById("ek-desc").value,id_mentor:document.getElementById("ek-mentor").value||null,hari_jadwal:document.getElementById("ek-hari").value,jam_jadwal:document.getElementById("ek-jam").value,status:document.getElementById("ek-status").value}),t("Kelas diperbarui!","success"),$(),R(a,t)})},window.kelolaSantriKelas=(s,l)=>{const r=n.filter(d=>d.id_kelas===s),o=n.filter(d=>!d.id_kelas||d.id_kelas!==s);S(`Kelola Peserta Didik — ${l}`,`
    <div>
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--gold-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
          Peserta Didik di Kelas Ini (${r.length})
        </div>
        ${r.length===0?'<p style="font-size:13px;color:var(--text-card-muted);">Belum ada peserta didik</p>':r.map(d=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;
            background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:6px;">
            <span style="font-size:13px;color:var(--cream-100);">${d.nama_lengkap}</span>
            <button class="btn btn-danger btn-sm" onclick="pindahSantriKelas(${d.id}, null, this.closest('.modal-backdrop'))">
              <i class="fa-solid fa-xmark"></i> Hapus dari Kelas
            </button>
          </div>`).join("")}
      </div>
      <div style="border-top:1px solid var(--border-dark);padding-top:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--gold-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
          Tambah Peserta Didik ke Kelas
        </div>
        <select class="form-control" id="ss-add-santri" style="margin-bottom:10px;">
          <option value="">-- Pilih Peserta Didik --</option>
          ${o.map(d=>`<option value="${d.id}">${d.nama_lengkap} ${d.id_kelas?"(sudah di kelas lain)":""}</option>`).join("")}
        </select>
        <button class="btn btn-primary btn-sm" onclick="tambahSantriKeKelas(${s})">
          <i class="fa-solid fa-plus"></i> Tambahkan
        </button>
      </div>
    </div>`,null)},window.pindahSantriKelas=async(s,l)=>{try{await h.updatePeserta(s,{id_kelas:l}),t("Peserta didik berhasil dipindahkan!","success"),$(),R(a,t)}catch(r){t("Gagal: "+r.message,"error")}},window.tambahSantriKeKelas=async s=>{var r;const l=parseInt((r=document.getElementById("ss-add-santri"))==null?void 0:r.value);if(!l){t("Pilih peserta didik.","info");return}await window.pindahSantriKelas(l,s)}}async function N(a,t){a.innerHTML=`<div class="page-header">
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
  <div id="peserta-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[e,i,n]=await Promise.all([h.getPesertaDidik({status:"aktif"}),h.getMentors({status:"aktif"}),h.getKelas({status:"aktif"})]).catch(l=>(t("Gagal memuat data.","error"),[[],[],[]]));function s(l){document.getElementById("peserta-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama Lengkap</th><th>Usia</th><th>Jenis</th><th>Kelas</th><th>Mentor</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${l.length===0?'<tr><td colspan="7" style="text-align:center;padding:28px;color:#81511D;">Tidak ada peserta didik ditemukan.</td></tr>':l.map(r=>{var o,d;return`<tr>
              <td><div style="font-weight:600;">${r.nama_lengkap}</div><div style="font-size:11px;color:#81511D;">${r.nama_wali||""}</div></td>
              <td>${r.usia||"-"}</td>
              <td>${xa(r.jenis)}</td>
              <td><span style="font-size:13px;">${((o=r.kelas)==null?void 0:o.nama_kelas)||"-"}</span></td>
              <td><span style="font-size:13px;">${((d=r.mentor)==null?void 0:d.nama)||"-"}</span></td>
              <td>${aa(r.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editPeserta(${r.id})"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-danger btn-sm" onclick="nonaktifPeserta(${r.id})"><i class="fa-solid fa-ban"></i></button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>`}s(e),document.getElementById("peserta-search").addEventListener("input",l=>{const r=l.target.value.toLowerCase();s(e.filter(o=>o.nama_lengkap.toLowerCase().includes(r)))}),window.editPeserta=l=>{const r=e.find(o=>o.id===l);r&&(S("Edit Peserta Didik",ia(r,i,n),async()=>{await h.updatePeserta(l,na()),t("Peserta didik diperbarui!","success"),$(),N(a,t)}),handleJenisChange())},window.nonaktifPeserta=async l=>{confirm("Nonaktifkan peserta didik ini?")&&(await h.updatePeserta(l,{status:"nonaktif"}),t("Peserta didik dinonaktifkan.","info"),N(a,t))},document.getElementById("btn-tambah-peserta").addEventListener("click",()=>{S("Tambah Peserta Didik Baru",ia(null,i,n),async()=>{const l=na();if(!l.nama_lengkap){t("Isi nama peserta didik.","info");return}try{await h.createPeserta(l),t("Peserta didik berhasil didaftarkan!","success"),$(),N(a,t)}catch(r){t("Gagal: "+r.message,"error")}}),handleJenisChange()})}function ia(a,t,e){return`
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nama Lengkap</label>
      <input type="text" class="form-control" id="pf-nama" value="${(a==null?void 0:a.nama_lengkap)||""}" placeholder="Nama lengkap peserta didik" /></div>
    <div class="form-group"><label class="form-label">Usia</label>
      <input type="number" class="form-control" id="pf-usia" value="${(a==null?void 0:a.usia)||""}" placeholder="10" /></div>
    <div class="form-group"><label class="form-label">Jenis Kelamin</label>
      <select class="form-control" id="pf-jk">
        <option value="L" ${(a==null?void 0:a.jenis_kelamin)==="L"?"selected":""}>Laki-laki</option>
        <option value="P" ${(a==null?void 0:a.jenis_kelamin)==="P"?"selected":""}>Perempuan</option>
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Jenis Program</label>
      <select class="form-control" id="pf-jenis" onchange="handleJenisChange()">
        <option value="bimbel" ${(a==null?void 0:a.jenis)==="bimbel"?"selected":""}>Bimbel Kelompok</option>
        <option value="privat" ${(a==null?void 0:a.jenis)==="privat"?"selected":""}>Privat</option>
      </select></div>
    <div class="form-group" id="pf-kelas-group"><label class="form-label">Kelas (Bimbel)</label>
      <select class="form-control" id="pf-kelas">
        <option value="">-- Pilih Kelas --</option>
        ${e.map(i=>`<option value="${i.id}" ${(a==null?void 0:a.id_kelas)===i.id?"selected":""}>${i.nama_kelas}</option>`).join("")}
      </select></div>
    <div class="form-group"><label class="form-label">Assign Mentor</label>
      <select class="form-control" id="pf-mentor">
        <option value="">-- Pilih Mentor --</option>
        ${t.map(i=>`<option value="${i.id}" ${(a==null?void 0:a.id_mentor)===i.id?"selected":""}>${i.nama} (${i.jenis_mentor})</option>`).join("")}
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nama Wali</label>
      <input type="text" class="form-control" id="pf-wali" value="${(a==null?void 0:a.nama_wali)||""}" placeholder="Nama orang tua/wali" /></div>
    <div class="form-group"><label class="form-label">Email Wali</label>
      <input type="email" class="form-control" id="pf-email-wali" value="${(a==null?void 0:a.email_wali)||""}" /></div>
    <div class="form-group"><label class="form-label">No WA Wali</label>
      <input type="text" class="form-control" id="pf-wa-wali" value="${(a==null?void 0:a.no_wa_wali)||""}" /></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Catatan Umum</label>
      <textarea class="form-control" id="pf-catatan" rows="2">${(a==null?void 0:a.catatan_umum)||""}</textarea></div>
  </div>`}function na(){var a,t,e,i,n,s,l,r,o,d,c;return{nama_lengkap:(t=(a=document.getElementById("pf-nama"))==null?void 0:a.value)==null?void 0:t.trim(),usia:parseInt((e=document.getElementById("pf-usia"))==null?void 0:e.value)||null,jenis_kelamin:(i=document.getElementById("pf-jk"))==null?void 0:i.value,jenis:(n=document.getElementById("pf-jenis"))==null?void 0:n.value,id_kelas:parseInt((s=document.getElementById("pf-kelas"))==null?void 0:s.value)||null,id_mentor:((l=document.getElementById("pf-mentor"))==null?void 0:l.value)||null,nama_wali:(r=document.getElementById("pf-wali"))==null?void 0:r.value,email_wali:(o=document.getElementById("pf-email-wali"))==null?void 0:o.value,no_wa_wali:(d=document.getElementById("pf-wa-wali"))==null?void 0:d.value,catatan_umum:(c=document.getElementById("pf-catatan"))==null?void 0:c.value}}window.handleJenisChange=()=>{var e;const a=(e=document.getElementById("pf-jenis"))==null?void 0:e.value,t=document.getElementById("pf-kelas-group");t&&(t.style.display=a==="bimbel"?"":"none")};async function Ha(a,t){a.innerHTML=`
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
      ${[["peserta","group","Peserta Didik"],["mentor","co_present","Mentor"],["kelas","school","Kelas"],["kehadiran","calendar_month","Kehadiran"],["kemajuan","menu_book","Kemajuan"],["penilaian","grade","Penilaian"]].map(([e,i,n])=>`
      <div class="sheet-tab ${e==="peserta"?"active":""}" data-tab="${e}" onclick="switchSSTab('${e}',this)">
        <span class="ms" style="font-size:16px;vertical-align:middle;margin-right:4px;">${i}</span>${n}
      </div>`).join("")}
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
  </div>`,v.ssActiveTab="peserta",await Q("peserta",t),document.getElementById("btn-batch-save").addEventListener("click",()=>Na(t)),window.switchSSTab=async(e,i)=>{document.querySelectorAll(".sheet-tab").forEach(n=>n.classList.remove("active")),i.classList.add("active"),v.ssActiveTab=e,v.ssDirtyRows.clear(),v.ssNewRows=[],await Q(e,t)},window.filterSS=e=>{v.ssFilter=e,ha(v.ssData[v.ssActiveTab])},window.reloadSS=async()=>{await Q(v.ssActiveTab,t)},window.addSSRow=()=>Ra(),window.exportSSTab=e=>{const i=v.ssData[v.ssActiveTab]||[];e==="csv"?ua(i,`QIA_${v.ssActiveTab}`):ga(i,`QIA_${v.ssActiveTab}`,v.ssActiveTab)},window.exportAllSS=async()=>{t("Mengumpulkan semua data…","info");try{const e=await h.exportAllTables();fa(e,"QIA_DataLengkap"),t("Export berhasil!","success")}catch(e){t("Gagal export: "+e.message,"error")}}}const O={peserta:{table:"peserta_didik",fetch:()=>h.getPesertaDidik()},mentor:{table:"profiles",fetch:()=>h.getMentors()},kelas:{table:"kelas",fetch:()=>h.getKelas()},kehadiran:{table:"kehadiran",fetch:()=>h.exportAllData("kehadiran","*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)")},kemajuan:{table:"kemajuan",fetch:()=>h.exportAllData("kemajuan","*, peserta:peserta_didik(nama_lengkap)")},penilaian:{table:"penilaian",fetch:()=>h.exportAllData("penilaian","*, peserta:peserta_didik(nama_lengkap)")}};async function Q(a,t){var n,s;const e=document.getElementById("ss-scroll");e.innerHTML='<div style="text-align:center;padding:48px;"><div class="spinner" style="margin:0 auto;width:36px;height:36px;"></div></div>';const i=document.getElementById("ss-table-name");i&&(i.textContent=((n=O[a])==null?void 0:n.table)||a);try{const l=await((s=O[a])==null?void 0:s.fetch())||[];v.ssData[a]=l,ha(l,t)}catch(l){e.innerHTML=`<div style="padding:40px;text-align:center;color:#e05c4b;"><i class="fa-solid fa-triangle-exclamation" style="font-size:32px;margin-bottom:12px;display:block;"></i>${l.message}</div>`,t("Gagal memuat data: "+l.message,"error")}}function ha(a,t){const e=a||[],i=(v.ssFilter||"").toLowerCase(),n=i?e.filter(f=>Object.values(f).some(y=>String(y||"").toLowerCase().includes(i))):e,s=document.getElementById("ss-row-count"),l=document.getElementById("ss-row-total");if(s&&(s.textContent=`${n.length} dari ${e.length} baris`),l&&(l.textContent=n.length),n.length===0){document.getElementById("ss-scroll").innerHTML=`<div style="text-align:center;padding:60px 24px;color:#81511D;">
      <div style="font-size:42px;margin-bottom:12px;opacity:0.4;">🔍</div>
      <p>Tidak ada data yang cocok dengan filter.</p>
    </div>`;return}const r=n[0],o=Object.entries(r).filter(([f,y])=>typeof y!="object"||y===null).map(([f])=>f),d=new Set(["nama_lengkap","nama","usia","jenis","status","email_wali","no_wa_wali","no_hp","jenis_mentor","nama_kelas","hari_jadwal","jam_jadwal","kapasitas","status_hadir","materi_pembahasan","catatan_sesi","perkembangan_materi","kitab_surat","halaman_ayat","status_kelancaran","catatan_hafalan","nilai_angka","nilai_adab","nilai_tajwid","nilai_kelancaran","catatan","nama_wali","catatan_umum","deskripsi"]),c=document.getElementById("ss-scroll");c.innerHTML=`
  <table class="ss-table" id="ss-table-el">
    <thead>
      <tr>
        <th class="ss-th row-num header-row-num">No</th>
        ${o.map(f=>`<th class="ss-th">${f}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${n.map((f,y)=>`
      <tr id="ss-tr-${y}" class="${v.ssDirtyRows.has(f.id)?"row-dirty":""}">
        <td class="row-num">${y+1}</td>
        ${o.map(b=>{const k=f[b];return d.has(b),`<td class="ss-cell" data-row="${y}" data-col="${b}" data-id="${f.id||""}">
            <div class="ss-cell-inner ${ka(b,k)}" title="${k||""}">${k==null?"":String(k)}</div>
          </td>`}).join("")}
      </tr>`).join("")}
    </tbody>
  </table>`,c.querySelectorAll(".ss-cell").forEach(f=>{f.addEventListener("click",function(){if(this.classList.contains("cell-editing"))return;const y=this.dataset.col,b=parseInt(this.dataset.row),k=this.dataset.id;d.has(y)&&Ta(this,n[b],y,b,k)})})}function Ta(a,t,e,i,n,s,l){document.querySelectorAll(".ss-cell.cell-editing").forEach(b=>b.classList.remove("cell-editing")),a.classList.add("cell-editing");const r=t[e],o=a.querySelector(".ss-cell-inner");o.style.display="none";const d={status:["aktif","nonaktif","lulus"],status_hadir:["hadir","izin","sakit","alpa"],jenis:["bimbel","privat"],jenis_mentor:["bimbel","privat","keduanya"],status_kelancaran:["lancar","cukup","perlu_ulang"],jenis_kelamin:["L","P"]};let c;d[e]?(c=document.createElement("select"),c.className="ss-cell-editor-select",d[e].forEach(b=>{const k=document.createElement("option");k.value=b,k.textContent=b,b===String(r)&&(k.selected=!0),c.appendChild(k)})):(c=document.createElement("input"),c.type="text",c.className="ss-cell-editor",c.value=r==null?"":String(r)),a.appendChild(c),c.focus(),c.select&&c.select();const f=()=>{const b=c.tagName==="SELECT"?c.value:c.value.trim();if(a.removeChild(c),o.style.display="",o.textContent=b,o.className=`ss-cell-inner ${ka(e,b)}`,a.classList.remove("cell-editing"),String(b)!==String(r||"")){t[e]=b,v.ssDirtyRows.add(n||i);const k=document.getElementById("ss-tr-"+i);k&&k.classList.add("row-dirty"),document.getElementById("ss-dirty-count").style.display="";const p=document.getElementById("btn-batch-save");p&&(p.disabled=!1)}},y=()=>{a.removeChild(c),o.style.display="",a.classList.remove("cell-editing")};c.addEventListener("blur",f),c.addEventListener("keydown",b=>{b.key==="Enter"&&(b.preventDefault(),f()),b.key==="Escape"&&y()})}function Ra(){const t=document.getElementById("ss-scroll").querySelector("tbody");if(!t)return;const e=t.rows.length,i=document.createElement("tr");i.id=`ss-tr-${e}`,i.classList.add("row-new"),i.innerHTML=`<td class="row-num">NEW</td><td colspan="20" style="padding:12px 16px;"><input type="text" placeholder="Gunakan form 'Tambah Peserta Didik' untuk baris baru yang valid…" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#81511D;" readonly /></td>`,t.appendChild(i),i.scrollIntoView({behavior:"smooth"})}async function Na(a){var l;const t=v.ssActiveTab,i=(v.ssData[t]||[]).filter(r=>v.ssDirtyRows.has(r.id)||v.ssDirtyRows.has(String(r.id)));if(i.length===0){a("Tidak ada perubahan.","info");return}const n=document.getElementById("btn-batch-save");if(n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…',!((l=O[t])==null?void 0:l.table)){a("Tabel tidak dikenali.","error");return}try{const r=i.map(o=>{const{peserta:d,mentor:c,kelas:f,...y}=o;return y});await h.bulkUpdatePeserta(r),v.ssDirtyRows.clear(),document.getElementById("ss-dirty-count").style.display="none",a(`${i.length} baris berhasil disimpan! ✅`,"success"),n.disabled=!0,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan',await Q(t,a)}catch(r){a("Gagal menyimpan: "+r.message,"error"),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan'}}function ka(a,t){return t?a==="status"?t==="aktif"?"text-green":t==="nonaktif"?"text-red":"":a==="status_hadir"?t==="hadir"?"text-green":t==="alpa"?"text-red":t==="izin"?"text-yellow":"text-blue":a==="status_kelancaran"?t==="lancar"?"text-green":t==="perlu_ulang"?"text-red":"text-yellow":"":""}function Qa(a,t){a.innerHTML=`
  <div class="page-header">
    <div><div class="page-title">Export <span>Data</span></div>
    <div class="page-breadcrumb">Unduh data ke file Excel, CSV, atau JSON</div></div>
  </div>

  <div class="grid-2">
    ${[["fa-users","Peserta Didik","Semua data peserta didik aktif beserta info wali","peserta"],["fa-chalkboard-user","Mentor / Asatidz","Daftar semua mentor","mentor"],["fa-door-open","Kelas Bimbel","Data kelas beserta mentor pengampu","kelas"],["fa-calendar-check","Data Kehadiran","Rekap seluruh absensi peserta didik","kehadiran"],["fa-book-quran","Kemajuan Hafalan","Riwayat kemajuan hafalan semua peserta didik","kemajuan"],["fa-star","Penilaian","Data penilaian semua peserta didik","penilaian"]].map(([e,i,n,s])=>`
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="width:44px;height:44px;border-radius:12px;
          background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
          display:flex;align-items:center;justify-content:center;font-size:20px;color:#1a0a02;">
          <i class="fa-solid ${e}"></i></div>
        <div>
          <h4 style="color:var(--cream-100);">${i}</h4>
          <p style="font-size:12px;color:var(--text-card-muted);">${n}</p>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="doExport('${s}','excel')">
          <i class="fa-solid fa-file-excel" style="color:#10b981;"></i> Excel
        </button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('${s}','csv')">
          <i class="fa-solid fa-file-csv" style="color:#F0AF43;"></i> CSV
        </button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('${s}','json')">
          <i class="fa-solid fa-file-code" style="color:#60a5fa;"></i> JSON
        </button>
      </div>
    </div>`).join("")}
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
  </div>`,window.doExport=async(e,i)=>{var n;t("Mengambil data…","info");try{const s=await((n=O[e])==null?void 0:n.fetch())||[];i==="csv"&&ua(s,`QIA_${e}`),i==="excel"&&ga(s,`QIA_${e}`,e),i==="json"&&Ma(s,`QIA_${e}`),t("Export berhasil!","success")}catch(s){t("Gagal export: "+s.message,"error")}},document.getElementById("btn-export-all").addEventListener("click",async()=>{t("Mengumpulkan semua data…","info");try{const e=await h.exportAllTables();fa(e,"QIA_DataLengkap"),t("Export berhasil!","success")}catch(e){t("Gagal: "+e.message,"error")}})}async function Oa(a,t){a.innerHTML=`<div class="page-header">
    <div class="page-title">Log <span>Aktivitas</span></div>
  </div>
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th><th>ID</th></tr></thead>
      <tbody id="activity-tbody"><tr><td colspan="5" style="text-align:center;padding:28px;"><div class="spinner" style="margin:0 auto;width:28px;height:28px;"></div></td></tr></tbody>
    </table>
  </div>`;try{const e=await h.getDashboardStats(),i=(e==null?void 0:e.aktivitas_terbaru)||[];document.getElementById("activity-tbody").innerHTML=i.length===0?'<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Belum ada log aktivitas.</td></tr>':i.map(n=>{var s;return`<tr>
        <td style="font-size:12px;">${wa(n.created_at)}</td>
        <td style="font-size:12px;">${((s=n.id_user)==null?void 0:s.slice(0,8))||"system"}…</td>
        <td><span style="font-weight:600;">${n.action}</span></td>
        <td>${n.entity_type||"-"}</td>
        <td style="font-size:12px;">${n.entity_id||"-"}</td>
      </tr>`}).join("")}catch{t("Gagal memuat log.","error")}}function S(a,t,e){document.getElementById("admin-modal-title").textContent=a,document.getElementById("admin-modal-body").innerHTML=t;const i=document.getElementById("admin-modal-footer");e?(i.innerHTML=`
    <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" id="modal-save-btn"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>`,document.getElementById("modal-save-btn").addEventListener("click",e)):i.innerHTML='<button class="btn btn-ghost" onclick="closeModal()">Tutup</button>';const n=document.getElementById("admin-modal-inner");n.className=t.length>1500?"modal modal-lg":"modal",document.getElementById("admin-modal").classList.add("show")}function $(){document.getElementById("admin-modal").classList.remove("show")}window.closeModal=$;function xa(a){return`<span class="badge ${{bimbel:"badge-gold",privat:"badge-emerald",keduanya:"badge-blue"}[a]||"badge-gray"}">${a||"-"}</span>`}function aa(a){return a==="aktif"?'<span class="badge badge-emerald">● Aktif</span>':`<span class="badge badge-red">● ${a}</span>`}function wa(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}let m={profile:null,kelasList:[],pesertaList:[],activeView:"dashboard",selectedKelas:null,selectedPeserta:null,absensiRows:[]};async function _a(a,t,e){document.title="Portal Asatidz — Quran Insight Academy";try{if(m.profile=await L.getProfile(),!m.profile||m.profile.role!=="mentor"){sa(a,t,e);return}}catch{sa(a,t,e);return}a.innerHTML=Wa(),Ga(t,e),await Va(e),P("dashboard",e)}function sa(a,t,e){a.innerHTML=`
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
    </div>
  </div>`,document.getElementById("mentor-login-form").addEventListener("submit",async n=>{n.preventDefault();const s=document.getElementById("mentor-login-email").value,l=document.getElementById("mentor-login-pwd").value,r=document.getElementById("btn-submit-mentor-login");r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{await L.login(s,l),e("Berhasil masuk sebagai Asatidz!","success"),_a(a,t,e)}catch(o){e("Gagal masuk: "+o.message,"error"),r.disabled=!1,r.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Portal Asatidz'}})}function Wa(){return`
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
      <div class="nav-item" data-view="kelas" id="nav-kelas" style="${F()?"":"display:none"}">
        <i class="fa-solid fa-chalkboard-user"></i> Kelas Saya
      </div>
      <div class="nav-item" data-view="absensi-massal" id="nav-absensi" style="${F()?"":"display:none"}">
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
</div>`}function F(){var a,t;return((a=m.profile)==null?void 0:a.jenis_mentor)==="bimbel"||((t=m.profile)==null?void 0:t.jenis_mentor)==="keduanya"}function Ga(a,t){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.view;P(i,t)})}),document.getElementById("btn-logout").addEventListener("click",async()=>{await L.logout(),a("/")})}async function Va(a){var t,e;try{const i=m.profile.id;m.kelasList=await _.getMyKelas(i),m.pesertaList=await _.getMyPeserta(i),document.getElementById("user-name").textContent=m.profile.nama||m.profile.email,document.getElementById("user-role-label").textContent=V(m.profile.jenis_mentor),document.getElementById("user-avatar").textContent=(m.profile.nama||"M").charAt(0),F()&&((t=document.getElementById("nav-kelas"))==null||t.removeAttribute("style"),(e=document.getElementById("nav-absensi"))==null||e.removeAttribute("style"))}catch(i){a("Gagal memuat data: "+i.message,"error")}}function Ua(a){document.querySelectorAll(".nav-item[data-view]").forEach(e=>e.classList.remove("active"));const t=document.getElementById("nav-"+a.replace("-list","santri").replace("-massal","absensi").replace("-detail","santri"));t&&t.classList.add("active")}function P(a,t){m.activeView=a,Ua(a);const e=document.getElementById("main-content");switch(a){case"dashboard":la(e,t);break;case"kelas":Ja(e,t);break;case"absensi-massal":Ya(e,t);break;case"santri-list":ae(e,t);break;case"ganti-password":ee(e,t);break;default:la(e,t)}document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}function la(a,t){var n;const e=m.pesertaList.filter(s=>s.jenis==="bimbel").length,i=m.pesertaList.filter(s=>s.jenis==="privat").length;a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Mentor</span></div>
      <div class="page-breadcrumb">Selamat datang, ${((n=m.profile)==null?void 0:n.nama)||"—"}</div>
    </div>
    <div style="font-size:13px;color:var(--text-muted);">
      <i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
    </div>
  </div>

  <!-- Stats -->
  <div class="grid-4" style="margin-bottom:28px;">
    ${[[`${m.pesertaList.length}`,"Total Peserta Didik","fa-users","stat-icon-gold"],[e,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[i,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[`${m.kelasList.length}`,"Kelas Aktif","fa-door-open","stat-icon-blue"]].map(([s,l,r,o])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${o}"><i class="fa-solid ${r}" style="color:white;"></i></div>
      <div><div class="stat-value">${s}</div><div class="stat-label">${l}</div></div>
    </div>`).join("")}
  </div>

  <!-- Shortcut actions -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;">
    ${F()?`
    <button onclick="renderMentorView('absensi-massal')"
      style="background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;
      padding:20px;border-radius:16px;border:none;cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
      <i class="fa-solid fa-clipboard-list" style="font-size:24px;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Absensi Massal</div>
      <div style="font-size:12px;opacity:0.75;margin-top:4px;">Input absen seluruh kelas sekaligus</div>
    </button>`:""}
    <button onclick="renderMentorView('santri-list')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-users" style="font-size:24px;color:#F0AF43;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Daftar Peserta Didik</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">Lihat & kelola peserta didik bimbingan</div>
    </button>
    ${F()?`
    <button onclick="renderMentorView('kelas')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-chalkboard" style="font-size:24px;color:#10b981;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Kelas Saya</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">${m.kelasList.length} kelas aktif</div>
    </button>`:""}
  </div>

  <!-- Daftar santri ringkas -->
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h3 style="color:var(--cream-100);font-size:14px;">Peserta Didik Bimbingan Saya</h3>
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">Lihat Semua →</button>
    </div>
    ${m.pesertaList.length===0?'<p style="color:var(--text-card-muted);font-size:14px;">Belum ada peserta didik yang ditugaskan.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${m.pesertaList.slice(0,6).map(s=>{var l;return`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;
          background:rgba(255,255,255,0.04);border-radius:10px;
          border:1px solid transparent;cursor:pointer;transition:all 0.2s;"
          onclick="openSantriDetail(${s.id})"
          onmouseover="this.style.background='rgba(240,175,67,0.08)';this.style.borderColor='rgba(240,175,67,0.15)'"
          onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='transparent'">
          <div style="width:36px;height:36px;border-radius:50%;
            background:linear-gradient(135deg,var(--brown-600),var(--brown-300));
            display:flex;align-items:center;justify-content:center;
            font-weight:700;font-size:14px;color:#fdf0e2;flex-shrink:0;">${s.nama_lengkap.charAt(0)}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;color:var(--cream-100);font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.nama_lengkap}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${((l=s.kelas)==null?void 0:l.nama_kelas)||V(s.jenis)}</div>
          </div>
          <span class="${s.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${s.jenis}</span>
        </div>`}).join("")}
      </div>`}
  </div>`,window.renderMentorView=s=>P(s,t),window.openSantriDetail=s=>Aa(s,a,t)}function Ja(a,t){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Kelas <span>Saya</span></div>
      <div class="page-breadcrumb">${m.kelasList.length} kelas aktif yang Anda ampu</div>
    </div>
    <button onclick="renderMentorView('absensi-massal')" class="btn btn-primary">
      <i class="fa-solid fa-clipboard-list"></i> Absensi Massal
    </button>
  </div>
  <div class="grid-3">
    ${m.kelasList.length===0?'<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon"><span class="ms" style="font-size:40px;color:var(--gold-400);">school</span></div><h3>Belum ada kelas</h3><p>Anda belum memiliki kelas aktif.</p></div></div>':m.kelasList.map(e=>{const i=m.pesertaList.filter(n=>n.id_kelas===e.id);return`
        <div class="card anim-fadeInUp">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <span class="badge badge-gold">${i.length} peserta didik</span>
          </div>
          <h3 style="color:var(--cream-100);font-size:15px;margin-bottom:6px;">${e.nama_kelas}</h3>
          <p style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">${e.deskripsi||"Tidak ada deskripsi"}</p>
          ${e.hari_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:6px;">
            <i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${e.hari_jadwal}</div>`:""}
          ${e.jam_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">
            <i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${e.jam_jadwal}</div>`:""}
          <div style="display:flex;flex-direction:column;gap:6px;max-height:120px;overflow-y:auto;">
            ${i.map(n=>`
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-card-muted);">
              <div style="width:24px;height:24px;border-radius:50%;
                background:linear-gradient(135deg,var(--brown-600),var(--brown-400));
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:700;color:#fdf0e2;flex-shrink:0;">${n.nama_lengkap.charAt(0)}</div>
              ${n.nama_lengkap}
            </div>`).join("")}
          </div>
          <button onclick="openAbsensiMassal(${e.id})" class="btn btn-secondary btn-sm" style="width:100%;margin-top:14px;">
            <i class="fa-solid fa-clipboard-list"></i> Absensi Kelas Ini
          </button>
        </div>`}).join("")}
  </div>`,window.renderMentorView=e=>P(e,t),window.openAbsensiMassal=e=>{m.selectedKelas=m.kelasList.find(i=>i.id===e)||null,P("absensi-massal",t)}}function Ya(a,t){var i;const e=new Date().toISOString().slice(0,10);a.innerHTML=`
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
          ${m.kelasList.map(n=>{var s;return`<option value="${n.id}" ${((s=m.selectedKelas)==null?void 0:s.id)===n.id?"selected":""}>${n.nama_kelas}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal Sesi</label>
        <input type="date" class="form-control" id="absensi-tanggal" value="${e}" />
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
  </div>`,document.getElementById("btn-load-absensi").addEventListener("click",()=>{const n=parseInt(document.getElementById("absensi-kelas-select").value);if(!n){t("Pilih kelas terlebih dahulu.","info");return}m.selectedKelas=m.kelasList.find(l=>l.id===n);const s=m.pesertaList.filter(l=>l.id_kelas===n);if(s.length===0){t("Tidak ada peserta didik di kelas ini.","info");return}m.absensiRows=s.map(l=>({id_peserta:l.id,nama:l.nama_lengkap,status_hadir:"hadir",perkembangan_materi:"",catatan:""})),Za(s)}),(i=document.getElementById("btn-simpan-absensi"))==null||i.addEventListener("click",()=>Xa(t)),window.setAllStatus=n=>{m.absensiRows.forEach(s=>s.status_hadir=n),document.querySelectorAll(".status-select").forEach(s=>{s.value=n,updateRowStyle(s)})},window.renderMentorView=n=>P(n,t)}function Za(a){const t=document.getElementById("absensi-table-wrapper"),e=document.getElementById("absensi-tbody");t.style.display="block",document.getElementById("absensi-count-label").textContent=`${a.length} peserta didik dalam kelas`,e.innerHTML=m.absensiRows.map((i,n)=>`
  <tr id="absensi-row-${n}" style="border-bottom:1px solid rgba(240,175,67,0.15);${n%2===1?"background:rgba(255,255,255,0.03);":""}">
    <td style="padding:10px 16px;color:#F0AF43;font-weight:700;">${n+1}</td>
    <td style="padding:10px 16px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;
          background:linear-gradient(135deg,#d97706,#F0AF43);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;color:#1a0a02;">${i.nama.charAt(0)}</div>
        <span style="font-weight:600;color:#ffffff;font-size:14px;letter-spacing:0.2px;">${i.nama}</span>
      </div>
    </td>
    <td style="padding:10px 16px;text-align:center;">
      <select class="status-select form-control-light" data-idx="${n}"
        style="width:130px;text-align:center;font-weight:600;"
        onchange="updateAbsensiStatus(this)">
        <option value="hadir"  ${i.status_hadir==="hadir"?"selected":""} style="color:#059669;">✅ Hadir</option>
        <option value="izin"   ${i.status_hadir==="izin"?"selected":""} style="color:#d97706;">📝 Izin</option>
        <option value="sakit"  ${i.status_hadir==="sakit"?"selected":""} style="color:#3b82f6;">🤒 Sakit</option>
        <option value="alpa"   ${i.status_hadir==="alpa"?"selected":""} style="color:#dc2626;">❌ Alpa</option>
      </select>
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light perkembangan-input" data-idx="${n}"
        value="${i.perkembangan_materi}"
        placeholder="Perkembangan materi peserta didik ini…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'perkembangan_materi')" />
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light catatan-input" data-idx="${n}"
        value="${i.catatan}"
        placeholder="Catatan khusus…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'catatan')" />
    </td>
  </tr>`).join(""),window.updateAbsensiStatus=i=>{const n=parseInt(i.dataset.idx);m.absensiRows[n].status_hadir=i.value,updateRowStyle(i)},window.updateAbsensiField=(i,n)=>{const s=parseInt(i.dataset.idx);m.absensiRows[s][n]=i.value},window.updateRowStyle=i=>{const n={hadir:"rgba(16,185,129,0.08)",izin:"rgba(240,175,67,0.08)",sakit:"rgba(59,130,246,0.08)",alpa:"rgba(239,68,68,0.08)"},s=parseInt(i.dataset.idx),l=document.getElementById("absensi-row-"+s);l&&(l.style.background=n[i.value]||"")}}async function Xa(a){var r,o,d,c,f,y;const t=(r=m.selectedKelas)==null?void 0:r.id,e=(o=document.getElementById("absensi-tanggal"))==null?void 0:o.value,i=(c=(d=document.getElementById("absensi-materi"))==null?void 0:d.value)==null?void 0:c.trim(),n=(y=(f=document.getElementById("absensi-catatan"))==null?void 0:f.value)==null?void 0:y.trim();if(!t||!e){a("Pilih kelas dan tanggal.","info");return}if(m.absensiRows.length===0){a("Muat daftar peserta didik terlebih dahulu.","info");return}const s=document.getElementById("btn-simpan-absensi");s.disabled=!0,s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';const l=m.absensiRows.map(b=>({id_peserta:b.id_peserta,id_mentor:m.profile.id,id_kelas:t,tanggal:e,status_hadir:b.status_hadir,materi_pembahasan:i||null,perkembangan_materi:b.perkembangan_materi||null,catatan_sesi:n||null||b.catatan||null}));try{await _.bulkSimpanAbsensi(l),a(`Absensi ${l.length} peserta didik berhasil disimpan! ✅`,"success"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}catch(b){a("Gagal menyimpan: "+b.message,"error"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}}function ae(a,t){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Daftar <span>Peserta Didik</span></div>
      <div class="page-breadcrumb">${m.pesertaList.length} peserta didik bimbingan Anda</div>
    </div>
    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass search-icon" style="color:var(--brown-400);"></i>
      <input type="text" id="santri-search" placeholder="Cari nama peserta didik…"
        class="form-control-light search-input" style="min-width:240px;" />
    </div>
  </div>

  <!-- Kelas filter tabs (bimbel only) -->
  ${F()&&m.kelasList.length>0?`
  <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
    <button class="btn btn-primary btn-sm active-kelas-tab" data-kelas-filter="all" onclick="filterByKelas('all',this)">Semua</button>
    ${m.kelasList.map(e=>`<button class="btn btn-ghost btn-sm" data-kelas-filter="${e.id}" onclick="filterByKelas('${e.id}',this)">${e.nama_kelas}</button>`).join("")}
    <button class="btn btn-ghost btn-sm" data-kelas-filter="privat" onclick="filterByKelas('privat',this)">Privat</button>
  </div>`:""}

  <div id="santri-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>`,window.currentKelasFilter="all",window.filterByKelas=(e,i)=>{var n;document.querySelectorAll("[data-kelas-filter]").forEach(s=>{s.classList.remove("btn-primary"),s.classList.add("btn-ghost")}),i.classList.remove("btn-ghost"),i.classList.add("btn-primary"),window.currentKelasFilter=e,J(ra(((n=document.getElementById("santri-search"))==null?void 0:n.value)||"",e))},window.openSantriDetail=e=>Aa(e,a,t),window.renderMentorView=e=>P(e,t),document.getElementById("santri-search").addEventListener("input",e=>{J(ra(e.target.value,window.currentKelasFilter||"all"))}),J(m.pesertaList)}function ra(a,t){return m.pesertaList.filter(e=>{const i=!a||e.nama_lengkap.toLowerCase().includes(a.toLowerCase());return t==="all"?i:t==="privat"?i&&e.jenis==="privat":i&&String(e.id_kelas)===String(t)})}function J(a,t){const e=document.getElementById("santri-grid");if(e){if(a.length===0){e.innerHTML=`<div style="grid-column:1/-1"><div class="empty-state">
      <div class="empty-state-icon">🔍</div><h3>Tidak ada peserta didik ditemukan</h3></div></div>`;return}e.innerHTML=a.map(i=>{var n;return`
  <div class="card" style="cursor:pointer;padding:18px 20px;"
    onclick="openSantriDetail(${i.id})"
    onmouseover="this.style.borderColor='rgba(240,175,67,0.5)'" onmouseout="this.style.borderColor='var(--border-dark)'">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:44px;height:44px;border-radius:50%;
        background:linear-gradient(135deg,var(--brown-600),var(--brown-300));
        display:flex;align-items:center;justify-content:center;
        font-size:18px;font-weight:700;color:#fdf0e2;flex-shrink:0;">${i.nama_lengkap.charAt(0)}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;color:var(--cream-100);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i.nama_lengkap}</div>
        <div style="font-size:11.5px;color:var(--text-card-muted);">${((n=i.kelas)==null?void 0:n.nama_kelas)||V(i.jenis)}</div>
      </div>
      <span class="${i.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${i.jenis}</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="event.stopPropagation();openSantriDetail(${i.id})" class="btn btn-secondary btn-sm" style="flex:1;">
        <i class="fa-solid fa-eye"></i> Detail
      </button>
    </div>
  </div>`}).join("")}}function Aa(a,t,e){var n;const i=m.pesertaList.find(s=>s.id===a);i&&(m.selectedPeserta=i,t.innerHTML=`
  <div class="page-header">
    <div style="display:flex;align-items:center;gap:12px;">
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div>
        <div class="page-title">${i.nama_lengkap}</div>
        <div class="page-breadcrumb">${((n=i.kelas)==null?void 0:n.nama_kelas)||V(i.jenis)}</div>
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
  </div>`,window.renderMentorView=s=>P(s,e),H(a),document.getElementById("btn-save-kemajuan").addEventListener("click",async()=>{const s={id_peserta:a,id_mentor:m.profile.id,tanggal:document.getElementById("inp-tgl-kemajuan").value,kitab_surat:document.getElementById("inp-kitab").value.trim(),halaman_ayat:document.getElementById("inp-halaman").value.trim(),status_kelancaran:document.getElementById("inp-kelancaran").value,catatan_hafalan:document.getElementById("inp-catatan-hafalan").value.trim()};if(!s.kitab_surat){e("Isi kitab/surah terlebih dahulu.","info");return}try{await _.addKemajuan(s),e("Kemajuan hafalan tersimpan! ✅","success"),document.getElementById("inp-kitab").value="",document.getElementById("inp-halaman").value="",document.getElementById("inp-catatan-hafalan").value="",H(a,e)}catch(l){e("Gagal: "+l.message,"error")}}),document.getElementById("btn-save-nilai").addEventListener("click",async()=>{const s=parseFloat(document.getElementById("inp-nilai").value);if(isNaN(s)){e("Isi nilai angka.","info");return}try{await _.addPenilaian({id_peserta:a,id_mentor:m.profile.id,tanggal:document.getElementById("inp-tgl-nilai").value,nilai_angka:s,nilai_adab:parseInt(document.getElementById("inp-adab").value)||null,nilai_tajwid:parseInt(document.getElementById("inp-tajwid").value)||null,nilai_kelancaran:parseInt(document.getElementById("inp-kelancaran-nilai").value)||null,catatan:document.getElementById("inp-catatan-nilai").value.trim()}),e("Penilaian tersimpan! ✅","success"),document.getElementById("inp-nilai").value="",H(a,e)}catch(l){e("Gagal: "+l.message,"error")}}),document.getElementById("btn-save-catatan").addEventListener("click",async()=>{const s=document.getElementById("inp-catatan").value.trim();if(!s){e("Tulis catatan terlebih dahulu.","info");return}try{await _.addCatatan({id_peserta:a,id_mentor:m.profile.id,isi_catatan:s}),e("Catatan tersimpan! ✅","success"),document.getElementById("inp-catatan").value="",H(a,e)}catch(l){e("Gagal: "+l.message,"error")}}))}async function H(a,t){const e=document.getElementById("history-panel");if(e)try{const[i,n,s,l]=await Promise.all([_.getKemajuan(a,8),_.getPenilaian(a,8),_.getCatatan(a),_.getRiwayatKehadiran(a,10)]);e.innerHTML=`
    <h4 style="color:var(--cream-100);margin-bottom:14px;"><i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Riwayat Peserta Didik</h4>

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Hafalan Terakhir</div>
    ${i.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin-bottom:12px;">Belum ada catatan</p>':i.slice(0,4).map(r=>`
      <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;">
        <div style="font-size:12.5px;color:var(--cream-100);font-weight:600;">${r.kitab_surat} — ${r.halaman_ayat||""}</div>
        <div style="font-size:11px;color:var(--text-card-muted);margin-top:2px;">${Y(r.tanggal)} • ${te(r.status_kelancaran)}</div>
      </div>`).join("")}

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px;">Penilaian Terakhir</div>
    ${n.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin-bottom:12px;">Belum ada penilaian</p>':n.slice(0,4).map(r=>`
      <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;color:var(--cream-100);font-weight:700;">${r.nilai_angka}</div>
          <div style="font-size:11px;color:var(--text-card-muted);">${Y(r.tanggal)}</div>
        </div>
        <div style="font-size:11px;color:var(--text-card-muted);text-align:right;">
          Adab ${r.nilai_adab||"-"} • Tajwid ${r.nilai_tajwid||"-"} • Lancar ${r.nilai_kelancaran||"-"}
        </div>
      </div>`).join("")}

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px;">Riwayat Absensi</div>
    ${l.length===0?'<p style="font-size:12px;color:var(--text-card-muted);">Belum ada absensi</p>':l.slice(0,6).map(r=>`
      <div style="padding:7px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:5px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
          <span style="font-size:12px;font-weight:700;color:${ie(r.status_hadir)};">${ne(r.status_hadir)} ${r.status_hadir}</span>
          <span style="font-size:11px;color:var(--text-card-muted);">${Y(r.tanggal)}</span>
        </div>
        ${r.materi_pembahasan?`<div style="font-size:11px;color:var(--text-card-muted);">📚 ${r.materi_pembahasan}</div>`:""}
        ${r.perkembangan_materi?`<div style="font-size:11px;color:var(--text-card-muted);font-style:italic;">${r.perkembangan_materi}</div>`:""}
      </div>`).join("")}`}catch{e&&(e.innerHTML='<p style="color:#e05c4b;font-size:13px;">Gagal memuat riwayat.</p>')}}function ee(a,t){a.innerHTML=`
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
  </div>`,document.getElementById("btn-ganti-pw").addEventListener("click",async()=>{const e=document.getElementById("inp-new-pw").value,i=document.getElementById("inp-confirm-pw").value;if(!e||e.length<8){t("Password minimal 8 karakter.","info");return}if(e!==i){t("Konfirmasi password tidak cocok.","error");return}try{await _.updatePassword(e),t("Password berhasil diubah! ✅","success"),document.getElementById("inp-new-pw").value="",document.getElementById("inp-confirm-pw").value=""}catch(n){t("Gagal: "+n.message,"error")}})}function V(a){return a==="bimbel"?"Bimbel Kelompok":a==="privat"?"Privat":a||"-"}function te(a){return a==="lancar"?'<span class="ms" style="font-size:15px;color:#10b981;vertical-align:middle;">check_circle</span> Lancar':a==="cukup"?'<span class="ms" style="font-size:15px;color:#F0AF43;vertical-align:middle;">help</span> Cukup':'<span class="ms" style="font-size:15px;color:#ef4444;vertical-align:middle;">replay</span> Perlu Diulang'}function ie(a){return a==="hadir"?"#10b981":a==="izin"?"#F0AF43":a==="sakit"?"#60a5fa":"#e05c4b"}function ne(a){return a==="hadir"?'<span class="ms" style="font-size:15px;color:#10b981;">check_circle</span>':a==="izin"?'<span class="ms" style="font-size:15px;color:#F0AF43;">description</span>':a==="sakit"?'<span class="ms" style="font-size:15px;color:#60a5fa;">sick</span>':'<span class="ms" style="font-size:15px;color:#ef4444;">cancel</span>'}function Y(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function oa(a,t,e){document.title="Portal Wali — Quran Insight Academy",a.innerHTML=se(),le(t,e)}function se(){return`
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
`}function le(a,t){window.navigateTo=o=>a(o);const e=document.getElementById("wali-search-input"),i=document.getElementById("wali-search-btn"),n=document.getElementById("wali-guide"),s=document.getElementById("wali-loading"),l=document.getElementById("wali-content");document.getElementById("detail-modal-close").addEventListener("click",()=>{document.getElementById("detail-modal").classList.remove("show")}),document.getElementById("detail-modal").addEventListener("click",function(o){o.target===this&&this.classList.remove("show")});async function r(){const o=e.value.trim();if(!o||o.length<2){t("Masukkan minimal 2 huruf nama peserta didik.","info"),e.focus();return}n.style.display="none",s.style.display="block",l.style.display="none",l.innerHTML="";try{const d=await C.searchPeserta(o);if(s.style.display="none",l.style.display="block",!d||d.length===0){l.innerHTML=`
          <div style="text-align:center;padding:48px;">
            <div style="font-size:52px;margin-bottom:16px;opacity:0.4;">🔍</div>
            <h3 style="color:#4F280C;">Peserta didik tidak ditemukan</h3>
            <p style="color:#81511D;font-size:14px;margin-top:8px;">
              Tidak ada peserta didik aktif dengan nama "<strong>${o}</strong>". Pastikan ejaan sudah benar.
            </p>
          </div>`;return}re(d,t)}catch(d){s.style.display="none",l.style.display="block",l.innerHTML=`<div style="text-align:center;padding:48px;color:#e05c4b;">
        <i class="fa-solid fa-circle-exclamation" style="font-size:36px;margin-bottom:12px;"></i>
        <p>Gagal memuat data: ${d.message}</p></div>`,t("Gagal memuat data. Periksa koneksi Anda.","error")}}i.addEventListener("click",r),e.addEventListener("keydown",o=>{o.key==="Enter"&&r()}),window.openDetailWali=async function(o){var d;document.getElementById("detail-modal").classList.add("show"),document.getElementById("detail-modal-title").textContent="Memuat detail…",document.getElementById("detail-modal-body").innerHTML=`
      <div style="text-align:center;padding:48px;">
        <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
          border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div>
      </div>`;try{const c=await C.getPesertaDetail(o);if(!c||!c.peserta){document.getElementById("detail-modal").classList.remove("show"),t("Data peserta didik tidak ditemukan.","error");return}document.getElementById("detail-modal-title").textContent=`Profil — ${((d=c.peserta)==null?void 0:d.nama_lengkap)||""}`,document.getElementById("detail-modal-body").innerHTML=de(c),await ce(o,c)}catch(c){document.getElementById("detail-modal").classList.remove("show"),t("Gagal memuat detail: "+c.message,"error")}},window.printRapor=async function(o,d){try{const c=await C.getPesertaDetail(o);c&&c.peserta?qa(c):t("Data peserta didik belum lengkap untuk dicetak.","error")}catch(c){t("Gagal mencetak rapor: "+c.message,"error")}}}function re(a,t){const e=document.getElementById("wali-content"),i=a.length;e.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
      <h3 style="color:#1a0a02;font-size:1rem;font-weight:700;">
        <i class="fa-solid fa-users" style="color:#F0AF43;"></i> &nbsp;${i} Peserta Didik Ditemukan
      </h3>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${a.map(n=>oe(n)).join("")}
    </div>`}function oe(a){const t=a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa>0?Math.round(a.total_hadir/(a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa)*100):0,e=a.nama_kelas||(a.jenis==="privat"?"Program Privat":"-"),i=a.kitab_surat_terakhir?`${a.kitab_surat_terakhir}${a.halaman_ayat_terakhir?" — "+a.halaman_ayat_terakhir:""}`:"Belum ada catatan";return`
  <div style="background:white;border:1px solid rgba(129,81,29,0.15);border-radius:16px;
    padding:20px 24px;box-shadow:0 4px 16px rgba(0,0,0,0.06);
    transition:all 0.25s;cursor:pointer;display:block;"
    onclick="openDetailWali(${a.id})"
    onmouseover="this.style.boxShadow='0 8px 32px rgba(240,175,67,0.2)';this.style.borderColor='rgba(240,175,67,0.4)'"
    onmouseout="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)';this.style.borderColor='rgba(129,81,29,0.15)'">

    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
      <!-- Profil -->
      <div style="display:flex;align-items:center;gap:14px;flex:1;min-width:200px;">
        <div style="width:52px;height:52px;border-radius:50%;
          background:linear-gradient(135deg,#4F280C,#D4934E);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:20px;font-weight:700;color:#fdf0e2;">
          ${a.nama_lengkap.charAt(0)}
        </div>
        <div>
          <div style="font-weight:700;color:#1a0a02;font-size:15px;">${a.nama_lengkap}</div>
          <div style="font-size:12px;color:#81511D;margin-top:2px;">
            <i class="fa-solid fa-person" style="color:#D4934E;"></i> ${a.usia?a.usia+" tahun":"-"} 
            &nbsp;•&nbsp;
            <i class="fa-solid fa-layer-group" style="color:#D4934E;"></i> ${e}
          </div>
          <div style="font-size:12px;color:#81511D;margin-top:2px;">
            <i class="fa-solid fa-user-tie" style="color:#D4934E;"></i> ${a.nama_mentor||"Belum ditentukan"}
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
        <!-- Nilai -->
        <div style="text-align:center;min-width:72px;">
          <div style="font-size:22px;font-weight:800;color:${Ea(a.rata_nilai)};">${a.rata_nilai||"-"}</div>
          <div style="font-size:10px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">Rata Nilai</div>
        </div>
        <!-- Kehadiran -->
        <div style="text-align:center;min-width:72px;">
          <div style="font-size:22px;font-weight:800;color:${t>=80?"#10b981":t>=60?"#F0AF43":"#e05c4b"};">
            ${t}%
          </div>
          <div style="font-size:10px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">Kehadiran</div>
        </div>
        <!-- Lihat Detail -->
        <button onclick="event.stopPropagation();openDetailWali(${a.id})"
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
        <strong style="color:#4F280C;">Hafalan Terakhir:</strong> ${i}
      </div>
      <div style="font-size:12.5px;color:#81511D;">
        <i class="fa-regular fa-calendar-check" style="color:#10b981;"></i>
        <strong style="color:#4F280C;">Hadir:</strong> ${a.total_hadir}x 
        &nbsp;<i class="fa-regular fa-calendar-times" style="color:#F0AF43;"></i>
        <strong style="color:#4F280C;">Izin/Sakit:</strong> ${(a.total_izin||0)+(a.total_sakit||0)}x
        &nbsp;<i class="fa-solid fa-triangle-exclamation" style="color:#e05c4b;font-size:11px;"></i>
        <strong style="color:#4F280C;">Alpa:</strong> ${a.total_alpa||0}x
      </div>
    </div>
  </div>`}function de(a){var k;const{peserta:t,mentor:e,kelas:i,kemajuan:n,penilaian:s,kehadiran_summary:l,riwayat_kehadiran:r,catatan_mentor:o}=a,d=l||{},c=(d.hadir||0)+(d.izin||0)+(d.sakit||0)+(d.alpa||0),f=c>0?Math.round(d.hadir/c*100):0,y=(s||[]).length>0?(s.reduce((p,w)=>p+(w.nilai_angka||0),0)/s.length).toFixed(1):"-",b=(i==null?void 0:i.nama_kelas)||((t==null?void 0:t.jenis)==="privat"?"Program Privat":"-");return`
  <div style="padding:4px 0;color:#1a0a02;">
    <!-- Profile Header -->
    <div style="background:linear-gradient(135deg,#221104,#3a1c08);border-radius:16px;padding:24px;margin-bottom:20px;
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div style="width:64px;height:64px;border-radius:50%;flex-shrink:0;
        background:linear-gradient(135deg,#4F280C,#D4934E);
        display:flex;align-items:center;justify-content:center;
        font-size:26px;font-weight:700;color:#fdf0e2;">
        ${((k=t==null?void 0:t.nama_lengkap)==null?void 0:k.charAt(0))||"?"}
      </div>
      <div style="flex:1;">
        <h2 style="color:#fdf0e2;font-size:1.2rem;margin-bottom:6px;">${(t==null?void 0:t.nama_lengkap)||"-"}</h2>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-person" style="color:#F0AF43;"></i> ${t!=null&&t.usia?t.usia+" tahun":"-"}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-layer-group" style="color:#F0AF43;"></i> ${b}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-user-tie" style="color:#F0AF43;"></i> ${(e==null?void 0:e.nama)||"Belum ditentukan"}</span>
          ${i!=null&&i.hari_jadwal?`<span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${i.hari_jadwal} ${i.jam_jadwal||""}</span>`:""}
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button onclick="printRapor(${t==null?void 0:t.id},'${t==null?void 0:t.nama_lengkap}')"
          style="padding:9px 16px;border-radius:10px;border:1px solid rgba(240,175,67,0.3);
          background:rgba(240,175,67,0.12);color:#F0AF43;font-size:13px;font-weight:600;cursor:pointer;
          transition:all 0.2s;" onmouseover="this.style.background='rgba(240,175,67,0.22)'" onmouseout="this.style.background='rgba(240,175,67,0.12)'">
          <i class="fa-solid fa-print"></i> Cetak Rapor
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">
      ${[[y,"Rata Nilai",Ea(parseFloat(y)),"fa-star"],[f+"%","Kehadiran",f>=80?"#10b981":f>=60?"#F0AF43":"#e05c4b","fa-calendar-check"],[d.hadir||0,"Total Hadir","#10b981","fa-circle-check"],[(d.izin||0)+(d.sakit||0),"Izin/Sakit","#60a5fa","fa-memo-circle-info"],[d.alpa||0,"Alpa","#e05c4b","fa-circle-exclamation"],[(s||[]).length,"Total Penilaian","#F0AF43","fa-clipboard-check"]].map(([p,w,K,x])=>`
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:14px 16px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:${K};margin-bottom:4px;">${p}</div>
        <div style="font-size:11px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">${w}</div>
      </div>`).join("")}
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
      ${(n||[]).length===0?'<p style="color:#81511D;font-size:13px;">Belum ada catatan kemajuan.</p>':`<div style="display:flex;flex-direction:column;gap:0;">
          ${(n||[]).slice(0,10).map((p,w)=>`
          <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;
            border-bottom:${w<n.length-1?"1px solid rgba(129,81,29,0.1)":"none"};">
            <div style="width:32px;height:32px;border-radius:50%;
              background:${p.status_kelancaran==="lancar"?"rgba(16,185,129,0.15)":p.status_kelancaran==="cukup"?"rgba(240,175,67,0.15)":"rgba(239,68,68,0.15)"};
              display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="ms" style="font-size:18px;color:${p.status_kelancaran==="lancar"?"#10b981":p.status_kelancaran==="cukup"?"#F0AF43":"#ef4444"};">
                ${p.status_kelancaran==="lancar"?"check_circle":p.status_kelancaran==="cukup"?"help":"replay"}
              </span>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;color:#1a0a02;font-size:13.5px;">
                ${p.kitab_surat} ${p.halaman_ayat?"— "+p.halaman_ayat:""}
              </div>
              ${p.catatan_hafalan?`<div style="font-size:12px;color:#81511D;margin-top:2px;font-style:italic;">"${p.catatan_hafalan}"</div>`:""}
            </div>
            <div style="font-size:11px;color:#81511D;white-space:nowrap;">${Z(p.tanggal)}</div>
          </div>`).join("")}
        </div>`}
    </div>

    <!-- Riwayat Kehadiran & Materi -->
    <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
      <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
        <i class="fa-solid fa-calendar-days" style="color:#10b981;"></i> Riwayat Kehadiran & Materi
      </h4>
      ${(r||[]).length===0?'<p style="color:#81511D;font-size:13px;">Belum ada catatan absensi.</p>':`<div style="overflow-x:auto;">
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
              ${(r||[]).slice(0,20).map((p,w)=>`
              <tr style="border-bottom:1px solid rgba(129,81,29,0.07);${w%2===1?"background:#fdf8f3;":""}">
                <td style="padding:9px 12px;color:#1a0a02;">${Z(p.tanggal)}</td>
                <td style="padding:9px 12px;">${pe(p.status_hadir)}</td>
                <td style="padding:9px 12px;color:#4F280C;">${p.materi_pembahasan||"-"}</td>
                <td style="padding:9px 12px;color:#81511D;font-size:12px;font-style:italic;">${p.catatan_sesi||p.perkembangan_materi||"-"}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>`}
    </div>

    <!-- Catatan Mentor -->
    ${(o||[]).length>0?`
    <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;">
      <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
        <i class="fa-solid fa-comment-dots" style="color:#60a5fa;"></i> Catatan Ustadz/Ustadzah
      </h4>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${(o||[]).slice(0,5).map(p=>`
        <div style="background:#f8f4ee;border-left:3px solid #F0AF43;border-radius:0 10px 10px 0;padding:12px 16px;">
          <div style="font-size:11px;color:#81511D;margin-bottom:4px;">${Z(p.tanggal)}</div>
          <div style="font-size:13.5px;color:#1a0a02;line-height:1.7;">${p.isi_catatan}</div>
        </div>`).join("")}
      </div>
    </div>`:""}
  </div>`}async function ce(a,t){try{const i=((await C.getChartDataPeserta(a)).penilaian||[]).slice(-12),n=document.getElementById("chart-nilai");i.length>0&&n?new Chart(n,{type:"line",data:{labels:i.map(o=>me(o.tanggal)),datasets:[{label:"Nilai",data:i.map(o=>o.nilai_angka),borderColor:"#F0AF43",backgroundColor:"rgba(240,175,67,0.15)",tension:.4,fill:!0,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{min:0,max:100,grid:{color:"rgba(0,0,0,0.05)"}},x:{grid:{display:!1}}}}}):n&&n.parentElement&&(n.parentElement.innerHTML=`
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-line" style="color:#F0AF43;"></i> Tren Nilai
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-chart-line" style="font-size:26px;margin-bottom:8px;color:#d97706;"></i>
          Belum ada riwayat penilaian
        </div>`);const s=t.kehadiran_summary||{},l=(s.hadir||0)+(s.izin||0)+(s.sakit||0)+(s.alpa||0),r=document.getElementById("chart-kehadiran");l>0&&r?new Chart(r,{type:"doughnut",data:{labels:["Hadir","Izin","Sakit","Alpa"],datasets:[{data:[s.hadir||0,s.izin||0,s.sakit||0,s.alpa||0],backgroundColor:["#10b981","#F0AF43","#60a5fa","#e05c4b"]}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{boxWidth:12,padding:12,font:{size:12}}}}}}):r&&r.parentElement&&(r.parentElement.innerHTML=`
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Rekap Kehadiran
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-calendar-check" style="font-size:26px;margin-bottom:8px;color:#10b981;"></i>
          Belum ada catatan absensi
        </div>`)}catch{}}function Ea(a){return a=parseFloat(a),isNaN(a)?"#81511D":a>=80?"#10b981":a>=65?"#F0AF43":"#e05c4b"}function pe(a){const t={hadir:["check_circle","#10b981","rgba(16,185,129,0.12)","Hadir"],izin:["description","#F0AF43","rgba(240,175,67,0.12)","Izin"],sakit:["sick","#60a5fa","rgba(59,130,246,0.12)","Sakit"],alpa:["cancel","#e05c4b","rgba(239,68,68,0.12)","Alpa"]},[e,i,n,s]=t[a]||["help","#81511D","rgba(0,0,0,0.06)",a];return`<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
    border-radius:20px;background:${n};color:${i};font-size:12px;font-weight:600;">
    <span class="ms" style="font-size:15px;">${e}</span> ${s}</span>`}function Z(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function me(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short"}):"-"}function da(a,t="info",e=3500){const i=document.getElementById("toast-container");if(!i)return;const n={success:"fa-circle-check",error:"fa-circle-xmark",info:"fa-circle-info"},s=document.createElement("div");s.className=`toast toast-${t}`,s.innerHTML=`<i class="fa-solid ${n[t]||"fa-circle-info"} toast-icon"></i> ${a}`,i.appendChild(s),requestAnimationFrame(()=>{requestAnimationFrame(()=>{s.classList.add("show")})}),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),350)},e)}const ca={"/":{render:ma},"/admin":{render:Fa},"/mentor":{render:_a},"/wali":{render:oa},"/portal-wali":{render:oa}};async function B(a,t=!0){const e=(a||"/").replace(/\/$/,"")||"/";t&&history.pushState({},"",e);const i=document.getElementById("app");if(!i)return;const n=ca[e]||ca["/"];i.style.opacity="0.7",i.style.transition="opacity 0.15s ease",await new Promise(s=>setTimeout(s,60)),i.innerHTML="",i.style.opacity="1";try{await n.render(i,B,da)}catch(s){console.error("Render error on route",e,s),da("Terjadi kesalahan saat memuat halaman: "+s.message,"error")}}window.navigate=B;window.navigateTo=B;document.addEventListener("click",a=>{const t=a.target.closest("[data-link]");if(t){a.preventDefault();const e=t.getAttribute("href")||t.dataset.link;e&&B(e)}});window.addEventListener("popstate",()=>{B(window.location.pathname,!1)});(async()=>{try{const a=document.getElementById("initial-loader");a&&(a.style.opacity="0",setTimeout(()=>{a.parentNode&&a.remove()},200)),L.onAuthStateChange(t=>{if(t==="SIGNED_OUT"){const e=window.location.pathname;(e==="/admin"||e==="/mentor")&&B("/")}}),await B(window.location.pathname,!1)}catch(a){console.error("Fatal boot error:",a);const t=document.getElementById("initial-loader");t&&t.remove();const e=document.getElementById("app");e&&!e.innerHTML.trim()&&ma(e,B)}})();
