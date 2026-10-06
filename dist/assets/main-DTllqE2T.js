import{c as Va}from"./vendor-Dx0atVpp.js";import{u as H,w as La}from"./xlsx-DrgRuPKf.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const Ja="https://wawamhpdthlttfttwjyc.supabase.co",Ya="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd2FtaHBkdGhsdHRmdHR3anljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjE4MzYsImV4cCI6MjEwNTE5NzgzNn0.zx35_sMK7z4CSw6b9OXzkFwpp3AsnVO1hOjQa42lAtg",Za=!0,g=Va(Ja,Ya,{auth:{persistSession:!0,autoRefreshToken:!0}}),K=[{id:"admin-prod",nama:"Administrator QIA",email:"portalqia@gmail.com",role:"admin",jenis_mentor:null,no_hp:"",status:"aktif"}],M=[],T=[],O=[],U=[],W=[];function y(a,e){try{const t=localStorage.getItem("qia_mock_"+a);if(t)return JSON.parse(t)}catch{}return e}const C={async login(a,e){const{data:t,error:i}=await g.auth.signInWithPassword({email:a,password:e});if(i)throw i;return t},async logout(){localStorage.removeItem("qia_demo_session");try{await g.auth.signOut()}catch{}},async getSession(){try{const{data:{session:a}}=await g.auth.getSession();return a||null}catch{return null}},async getProfile(){var e;const a=await this.getSession();if(!((e=a==null?void 0:a.user)!=null&&e.id))return null;try{const{data:t,error:i}=await g.from("profiles").select("*").eq("id",a.user.id).single();if(!i&&t)return t}catch{}return null},onAuthStateChange(a){return g.auth.onAuthStateChange(a)}},h={async getDashboardStats(){try{const{data:o,error:d}=await g.rpc("get_admin_dashboard_stats");if(!d&&o)return{...o,total_santri_aktif:o.total_peserta,total_santri_bimbel:o.total_bimbel,total_santri_privat:o.total_privat,total_mentor_aktif:o.total_mentor,total_kelas_aktif:o.total_kelas}}catch{}const a=await this.getPesertaDidik(),e=await this.getMentors(),t=await this.getKelas(),i=a.filter(o=>o.status==="aktif").length,s=a.filter(o=>o.jenis==="bimbel"&&o.status==="aktif").length,n=a.filter(o=>o.jenis==="privat"&&o.status==="aktif").length,r=e.filter(o=>o.status==="aktif").length,l=t.filter(o=>o.status==="aktif").length;return{total_peserta:i,total_bimbel:s,total_privat:n,total_mentor:r,total_kelas:l,hadir_hari_ini:0,absensi_hari_ini:0,rata_nilai_bulan_ini:0,aktivitas_terbaru:[],total_santri_aktif:i,total_santri_bimbel:s,total_santri_privat:n,total_mentor_aktif:r,total_kelas_aktif:l,persentase_kehadiran_bulan_ini:100}},async getMentors(a={}){try{let t=g.from("profiles").select("*").eq("role","mentor").order("nama");a.status&&(t=t.eq("status",a.status)),a.jenis&&(t=t.eq("jenis_mentor",a.jenis));const{data:i,error:s}=await t;if(!s&&i)return i}catch{}const e=y("profiles",K).filter(t=>t.role==="mentor");return a.jenis?e.filter(t=>t.jenis_mentor===a.jenis||t.jenis_mentor==="keduanya"):e},async createMentor(a,e,t){const{data:i,error:s}=await g.auth.signUp({email:a,password:e,options:{data:{nama:t.nama,role:"mentor"}}});if(s)throw new Error("Gagal membuat akun: "+s.message);if(!(i!=null&&i.user))throw new Error("Gagal membuat akun mentor.");const n=i.user.id,{data:r,error:l}=await g.from("profiles").upsert({id:n,email:a,...t,role:"mentor",status:"aktif"}).select().single();if(l)throw new Error("Gagal menyimpan profil mentor: "+l.message);return r},async updateMentor(a,e){const{data:t,error:i}=await g.from("profiles").update(e).eq("id",a).select().single();if(i)throw new Error("Gagal update mentor: "+i.message);return t},async resetMentorPassword(a,e){throw new Error("Service role key belum dikonfigurasi. Tambahkan VITE_SUPABASE_SERVICE_ROLE_KEY di file .env")},async getKelas(a={}){try{let i=g.from("kelas").select("*, mentor:profiles(id, nama, email, jenis_mentor)").order("nama_kelas");a.status&&(i=i.eq("status",a.status)),a.id_mentor&&(i=i.eq("id_mentor",a.id_mentor));const{data:s,error:n}=await i;if(!n&&s)return s}catch{}const e=y("kelas",M),t=y("profiles",K);return e.map(i=>({...i,mentor:t.find(s=>s.id===i.id_mentor)||{nama:"Asatidz"}}))},async createKelas(a){const{data:e,error:t}=await g.from("kelas").insert(a).select().single();if(t)throw new Error("Gagal membuat kelas: "+t.message);return e},async updateKelas(a,e){const{data:t,error:i}=await g.from("kelas").update(e).eq("id",a).select().single();if(i)throw new Error("Gagal update kelas: "+i.message);return t},async deleteKelas(a){const{error:e}=await g.from("kelas").delete().eq("id",a);if(e)throw new Error("Gagal hapus kelas: "+e.message)},async getPesertaDidik(a={}){try{let s=g.from("peserta_didik").select("*, mentor:profiles(id, nama), kelas(id, nama_kelas)").order("nama_lengkap");a.jenis&&(s=s.eq("jenis",a.jenis)),a.id_kelas&&(s=s.eq("id_kelas",a.id_kelas)),a.id_mentor&&(s=s.eq("id_mentor",a.id_mentor)),a.status&&(s=s.eq("status",a.status));const{data:n,error:r}=await s;if(!r&&n)return n}catch{}const e=y("peserta",T),t=y("kelas",M),i=y("profiles",K);return e.map(s=>({...s,kelas:t.find(n=>n.id===s.id_kelas)||null,mentor:i.find(n=>n.id===s.id_mentor)||null}))},async createPeserta(a){const{data:e,error:t}=await g.from("peserta_didik").insert(a).select().single();if(t)throw new Error("Gagal mendaftarkan peserta: "+t.message);return e},async updatePeserta(a,e){const{data:t,error:i}=await g.from("peserta_didik").update(e).eq("id",a).select().single();if(i)throw new Error("Gagal update peserta: "+i.message);return t},async bulkUpdatePeserta(a){const{error:e}=await g.from("peserta_didik").upsert(a);if(e)throw new Error("Gagal simpan massal: "+e.message)},async deletePeserta(a){{const{error:e}=await g.from("peserta_didik").delete().eq("id",a);if(e)throw new Error("Gagal menghapus peserta: "+e.message);return!0}},async getPesertaDetail(a){const e=Number(a);try{const[t,i,s,n]=await Promise.all([g.from("peserta_didik").select("*, mentor:profiles(nama), kelas(nama_kelas)").eq("id",e).single(),g.from("kehadiran").select("*").eq("id_peserta",e).order("tanggal",{ascending:!1}),g.from("kemajuan").select("*").eq("id_peserta",e).order("tanggal",{ascending:!1}),g.from("penilaian").select("*").eq("id_peserta",e).order("tanggal",{ascending:!1})]);if(t.data){const r=i.data||[],l=s.data||[],o=n.data||[],d=r.filter(p=>p.status_hadir==="hadir").length,m=r.filter(p=>p.status_hadir==="izin").length,v=r.filter(p=>p.status_hadir==="sakit").length,b=r.filter(p=>p.status_hadir==="alpa").length;return{peserta:t.data,mentor:t.data.mentor||{nama:"Belum ditentukan"},kelas:t.data.kelas||{nama_kelas:t.data.jenis==="privat"?"Program Privat":"-"},kemajuan:l,penilaian:o,kehadiran_summary:{hadir:d,izin:m,sakit:v,alpa:b,total:r.length},riwayat_kehadiran:r}}}catch(t){console.error("adminService.getPesertaDetail error:",t)}return R.getPesertaDetail(e)},async deleteRow(a,e){{const{error:t}=await g.from(a).delete().eq("id",e);if(t)throw new Error(`Gagal menghapus data dari ${a}: `+t.message);return!0}},async updateRow(a,e,t){{const{error:i}=await g.from(a).update(t).eq("id",e);if(i)throw new Error(`Gagal memperbarui data ${a}: `+i.message);return!0}},async exportAllData(a,e="*"){try{const{data:t,error:i}=await g.from(a).select(e).order("id");if(!i&&t)return t}catch{}return a==="peserta_didik"?y("peserta",T):a==="profiles"?y("profiles",K):a==="kelas"?y("kelas",M):a==="kehadiran"?y("kehadiran",W):a==="kemajuan"?y("kemajuan",O):a==="penilaian"?y("penilaian",U):[]},async exportAllTables(){try{const[a,e,t,i,s,n]=await Promise.all([g.from("peserta_didik").select("*, kelas(nama_kelas), mentor:profiles(nama)"),g.from("profiles").select("*").eq("role","mentor"),g.from("kelas").select("*, mentor:profiles(nama)"),g.from("kehadiran").select("*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)"),g.from("kemajuan").select("*, peserta:peserta_didik(nama_lengkap)"),g.from("penilaian").select("*, peserta:peserta_didik(nama_lengkap)")]);if(a.data)return{peserta:a.data,mentor:e.data,kelas:t.data,kehadiran:i.data,kemajuan:s.data,penilaian:n.data}}catch{}return{peserta:y("peserta",T),mentor:y("profiles",K).filter(a=>a.role==="mentor"),kelas:y("kelas",M),kehadiran:y("kehadiran",W),kemajuan:y("kemajuan",O),penilaian:y("penilaian",U)}},async logActivity(a,e,t,i={}){try{const{data:{user:s}}=await g.auth.getUser();await g.from("activity_logs").insert({id_user:s==null?void 0:s.id,action:a,entity_type:e,entity_id:String(t),detail:i})}catch{}}},B={async getMyKelas(a){try{const{data:t,error:i}=await g.from("kelas").select("*").eq("id_mentor",a).eq("status","aktif").order("nama_kelas");if(!i&&t)return t}catch{}return y("kelas",M).filter(t=>t.id_mentor===a||!a)},async getMyPeserta(a,e=null){try{let s=g.from("peserta_didik").select("*, kelas(id, nama_kelas)").eq("id_mentor",a).eq("status","aktif").order("nama_lengkap");e&&(s=s.eq("id_kelas",e));const{data:n,error:r}=await s;if(!r&&n)return n}catch{}const t=y("peserta",T),i=y("kelas",M);return t.filter(s=>(!a||s.id_mentor===a)&&(!e||s.id_kelas===e)).map(s=>({...s,kelas:i.find(n=>n.id===s.id_kelas)}))},async bulkSimpanAbsensi(a){{try{const{data:t,error:i}=await g.rpc("bulk_upsert_kehadiran",{p_records:a});if(!i)return t}catch{}const{error:e}=await g.from("kehadiran").upsert(a.map(t=>({...t})),{onConflict:"id_peserta,id_kelas,tanggal"});if(e)throw new Error("Gagal simpan absensi: "+e.message);return{success:!0,count:a.length}}},async addKehadiran(a){return this.bulkSimpanAbsensi([a])},async getRiwayatKehadiran(a,e=30){try{const{data:i,error:s}=await g.from("kehadiran").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(e);if(!s&&i)return i}catch{}return y("kehadiran",W).filter(i=>i.id_peserta===Number(a)).slice(0,e)},async getKemajuan(a,e=20){try{const{data:i,error:s}=await g.from("kemajuan").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(e);if(!s&&i)return i}catch{}return y("kemajuan",O).filter(i=>i.id_peserta===Number(a)).slice(0,e)},async addKemajuan(a){const{data:e,error:t}=await g.from("kemajuan").insert(a).select().single();if(t)throw new Error("Gagal simpan kemajuan: "+t.message);return e},async getPenilaian(a,e=20){try{const{data:i,error:s}=await g.from("penilaian").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(e);if(!s&&i)return i}catch{}return y("penilaian",U).filter(i=>i.id_peserta===Number(a)).slice(0,e)},async addPenilaian(a){const{data:e,error:t}=await g.from("penilaian").insert(a).select().single();if(t)throw new Error("Gagal simpan penilaian: "+t.message);return e},async getCatatan(a){return[]},async addCatatan(a){return{id:Date.now(),...a}},async getPelajaranTambahan(a){return[]},async addPelajaranTambahan(a){return{id:Date.now(),...a}},async updatePassword(a){{const{error:e}=await g.auth.updateUser({password:a});if(e)throw e}},async getChartData(a){const e=await this.getKemajuan(a,30),t=await this.getPenilaian(a,30),i=await this.getRiwayatKehadiran(a,60);return{kemajuan:e,penilaian:t,kehadiran:i}}},R={async searchPeserta(a){const e=(a||"").trim().toLowerCase();if(!e)return[];try{const{data:n,error:r}=await g.rpc("search_peserta_wali_by_name",{p_nama:e});if(!r&&n)return n}catch{}const t=y("peserta",T),i=y("kelas",M),s=y("profiles",K);return t.filter(n=>n.nama_lengkap.toLowerCase().includes(e)).map(n=>{const r=i.find(o=>o.id===n.id_kelas),l=s.find(o=>o.id===n.id_mentor);return{id:n.id,nama_lengkap:n.nama_lengkap,jenis:n.jenis,nama_kelas:(r==null?void 0:r.nama_kelas)||(n.jenis==="privat"?"Program Privat":"-"),nama_mentor:(l==null?void 0:l.nama)||"Asatidz QIA"}})},async getPesertaDetail(a){const e=Number(a);try{const{data:c,error:A}=await g.rpc("get_peserta_detail_wali",{p_peserta_id:e});if(!A&&c&&c.peserta)return c}catch{}const i=y("peserta",T).find(c=>c.id===e);if(!i)return null;const s=y("kelas",M),n=y("profiles",K),r=s.find(c=>c.id===(i==null?void 0:i.id_kelas)),l=n.find(c=>c.id===(i==null?void 0:i.id_mentor)),o=y("kemajuan",O).filter(c=>c.id_peserta===e),d=y("kehadiran",W).filter(c=>c.id_peserta===e),m=y("penilaian",U).filter(c=>c.id_peserta===e),v=d.filter(c=>c.status_hadir==="hadir").length,b=d.filter(c=>c.status_hadir==="izin").length,p=d.filter(c=>c.status_hadir==="sakit").length,_=d.filter(c=>c.status_hadir==="alpa").length;return{peserta:i,mentor:l||{nama:"Belum ditentukan"},kelas:r||{nama_kelas:i.jenis==="privat"?"Program Privat":"-"},kemajuan:o,penilaian:m,kehadiran_summary:{hadir:v,izin:b,sakit:p,alpa:_,total:d.length},riwayat_kehadiran:d,catatan_mentor:[]}},async getChartDataPeserta(a){const e=Number(a);{try{const{data:n,error:r}=await g.rpc("get_peserta_charts_wali",{p_peserta_id:e});if(!r&&n)return n}catch{}try{const[n,r,l]=await Promise.all([g.from("penilaian").select("tanggal, nilai_angka").eq("id_peserta",e).order("tanggal").limit(20),g.from("kehadiran").select("tanggal, status_hadir, materi_pembahasan").eq("id_peserta",e).order("tanggal").limit(60),g.from("kemajuan").select("tanggal, kitab_surat, halaman_ayat").eq("id_peserta",e).order("tanggal").limit(20)]);if(n.data)return{penilaian:n.data,kehadiran:r.data,kemajuan:l.data}}catch{}}const t=y("penilaian",U).filter(n=>n.id_peserta===e),i=y("kehadiran",W).filter(n=>n.id_peserta===e),s=y("kemajuan",O).filter(n=>n.id_peserta===e);return{penilaian:t,kehadiran:i,kemajuan:s}}},Xa=Object.freeze(Object.defineProperty({__proto__:null,adminService:h,authService:C,isConfigured:Za,mentorService:B,supabase:g,waliService:R},Symbol.toStringTag,{value:"Module"}));function Da(a,e,t){document.title="Quran Insight Academy — Bimbingan Al-Quran Terpercaya",a.innerHTML=`
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
`,window.navigateTo=r=>e(r),window.navigate=r=>e(r);const i=document.getElementById("qiaMobileToggle"),s=document.getElementById("qiaNavLinks");i&&s&&i.addEventListener("click",()=>{s.classList.toggle("is-open")}),document.querySelectorAll(".qia-faq-btn").forEach(r=>{r.addEventListener("click",function(){const l=this.parentElement,o=l.classList.contains("is-active");document.querySelectorAll(".qia-faq-item").forEach(d=>d.classList.remove("is-active")),o||l.classList.add("is-active")})}),document.querySelectorAll('a[href^="#"]').forEach(r=>{r.addEventListener("click",l=>{l.preventDefault(),s&&s.classList.remove("is-open");const o=r.getAttribute("href"),d=document.querySelector(o);d&&d.scrollIntoView({behavior:"smooth"})})})}const ae="modulepreload",ee=function(a){return"/"+a},wa={},te=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(t.map(o=>{if(o=ee(o),o in wa)return;wa[o]=!0;const d=o.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${m}`))return;const v=document.createElement("link");if(v.rel=d?"stylesheet":ae,d||(v.as="script"),v.crossOrigin="",v.href=o,l&&v.setAttribute("nonce",l),document.head.appendChild(v),d)return new Promise((b,p)=>{v.addEventListener("load",b),v.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&n(l.reason);return e().catch(n)})};function Z(a,e=""){const t={};for(const[i,s]of Object.entries(a)){const n=e?`${e}_${i}`:i;s&&typeof s=="object"&&!Array.isArray(s)&&!(s instanceof Date)?Object.assign(t,Z(s,n)):Array.isArray(s)||(t[n]=s)}return t}function Ma(a,e="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const t=a.map(r=>Z(r)),i=[...new Set(t.flatMap(Object.keys))],s=[i.join(","),...t.map(r=>i.map(l=>{const o=r[l]??"",d=String(o).replace(/"/g,'""');return d.includes(",")||d.includes('"')||d.includes(`
`)?`"${d}"`:d}).join(","))],n=new Blob(["\uFEFF"+s.join(`
`)],{type:"text/csv;charset=utf-8;"});Ca(n,`${e}.csv`)}function Fa(a,e="export",t="Data"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const i=a.map(l=>Z(l)),s=H.json_to_sheet(i),n=H.book_new();H.book_append_sheet(n,s,t);const r=Object.keys(i[0]||{}).map(l=>({wch:Math.max(l.length,...i.map(o=>String(o[l]??"").length))}));s["!cols"]=r,La(n,`${e}.xlsx`)}function qa(a,e="QIA_DataLengkap"){const t=H.book_new();for(const[i,s]of Object.entries(a)){if(!s||!s.length)continue;const n=s.map(o=>Z(o)),r=H.json_to_sheet(n),l=Object.keys(n[0]||{}).map(o=>({wch:Math.max(o.length,...n.map(d=>String(d[o]??"").length))}));r["!cols"]=l,H.book_append_sheet(t,r,i.substring(0,31))}La(t,`${e}.xlsx`)}function ie(a,e="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const t=new Blob([JSON.stringify(a,null,2)],{type:"application/json"});Ca(t,`${e}.json`)}function ne(a){var j;const{peserta:e,mentor:t,kelas:i,kemajuan:s,penilaian:n,kehadiran_summary:r,riwayat_kehadiran:l,catatan_mentor:o}=a,d=r||{},m=(n||[]).slice(0,10),v=(s||[]).slice(0,10),b=(l||[]).filter(u=>u.catatan_sesi||u.perkembangan_materi).map(u=>({tanggal:u.tanggal||"",status:u.status_hadir||"",catatan:u.catatan_sesi||u.perkembangan_materi||""})).slice(0,20),p=(d.hadir||0)+(d.izin||0)+(d.sakit||0)+(d.alpa||0),_=p>0?Math.round(d.hadir/p*100):0,c=m.length>0?(m.reduce((u,E)=>u+(E.nilai_angka||0),0)/m.length).toFixed(1):"-",A=`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rapor — ${(e==null?void 0:e.nama_lengkap)||""}</title>
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
  .note-box { background: #fdf8f3; border: 1px solid #e8d4bc; border-left: 3px solid #F0AF43; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; }
  .note-box .note-meta { font-size: 11px; color: #81511D; margin-bottom: 4px; }
  .note-box .note-text { font-size: 13px; color: #1a0a02; line-height: 1.6; }
  .badge-status { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
  .badge-hadir { background: #d1fae5; color: #065f46; }
  .badge-izin  { background: #fef3c7; color: #92400e; }
  .badge-sakit { background: #dbeafe; color: #1e40af; }
  .badge-alpa  { background: #fee2e2; color: #991b1b; }
  .footer { text-align: center; font-size: 11px; color: #81511D; margin-top: 24px; border-top: 1px solid #e8d4bc; padding-top: 12px; }
</style>
</head>
<body>
<div class="header">
  <h1>Quran Insight Academy</h1>
  <p>Laporan Perkembangan Peserta Didik</p>
  <span class="badge">${((j=e==null?void 0:e.jenis)==null?void 0:j.toUpperCase())||"BIMBEL"}</span>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>Nama Peserta Didik</h3>
    <div class="val">${(e==null?void 0:e.nama_lengkap)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Kelas / Program</h3>
    <div class="val">${(i==null?void 0:i.nama_kelas)||((e==null?void 0:e.jenis)==="privat"?"Privat":"-")}</div>
  </div>
  <div class="info-card">
    <h3>Mentor / Ustadz</h3>
    <div class="val">${(t==null?void 0:t.nama)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Rata-rata Nilai</h3>
    <div class="val" style="color:#059669; font-size:20px;">${c}</div>
  </div>
</div>

<h2 class="section">Rekap Kehadiran</h2>
<div class="stat-row">
  <div class="stat-box"><div class="n">${d.hadir||0}</div><div class="l">Hadir</div></div>
  <div class="stat-box"><div class="n">${d.izin||0}</div><div class="l">Izin</div></div>
  <div class="stat-box"><div class="n">${d.sakit||0}</div><div class="l">Sakit</div></div>
  <div class="stat-box"><div class="n">${d.alpa||0}</div><div class="l">Alpa</div></div>
  <div class="stat-box" style="background:#059669;"><div class="n" style="color:#fff;">${_}%</div><div class="l">Kehadiran</div></div>
</div>

<h2 class="section">Riwayat Kemajuan Hafalan</h2>
<table>
  <tr><th>Tanggal</th><th>Kitab / Surah</th><th>Halaman / Ayat</th><th>Status</th></tr>
  ${v.map(u=>`<tr><td>${u.tanggal||""}</td><td>${u.kitab_surat||""}</td><td>${u.halaman_ayat||""}</td><td>${u.status_kelancaran||""}</td></tr>`).join("")}
</table>


${b.length?`
<h2 class="section">Catatan Sesi</h2>
${b.map(u=>{const E=u.status==="hadir"?"badge-hadir":u.status==="izin"?"badge-izin":u.status==="sakit"?"badge-sakit":u.status==="alpa"?"badge-alpa":"";return`<div class="note-box">
  <div class="note-meta">${u.tanggal}${u.status?` &nbsp;·&nbsp; <span class="badge-status ${E}">${u.status}</span>`:""}</div>
  <div class="note-text">${u.catatan}</div>
</div>`}).join("")}`:""}

${o!=null&&o.length?`
<h2 class="section">Catatan Mentor</h2>
<table>
  <tr><th>Tanggal</th><th>Catatan</th></tr>
  ${(o||[]).slice(0,5).map(u=>`<tr><td>${u.tanggal||""}</td><td>${u.isi_catatan||""}</td></tr>`).join("")}
</table>`:""}

<div class="footer">
  Dicetak: ${new Date().toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} — Quran Insight Academy
</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body></html>`,D=window.open("","_blank","width=800,height=900");D.document.write(A),D.document.close()}function Ca(a,e){const t=URL.createObjectURL(a),i=document.createElement("a");i.href=t,i.download=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(t)}let k={profile:null,stats:null,activeView:"dashboard",ssActiveTab:"peserta_bimbel",ssData:{peserta_bimbel:[],peserta_privat:[],mentor:[],kelas:[],kehadiran:[],kemajuan:[],penilaian:[]},ssDirtyRows:new Set,ssNewRows:[],ssSortCol:null,ssSortDir:"asc",ssFilter:""};async function se(a,e,t){document.title="Portal Admin — Quran Insight Academy";try{if(k.profile=await C.getProfile(),!k.profile||k.profile.role!=="admin"){_a(a,e,t);return}}catch{_a(a,e,t);return}a.innerHTML=Ka(),Ha(e,t),await sa(t),X("dashboard",t)}function _a(a,e,t){a.innerHTML=`
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
  </div>`,document.getElementById("admin-login-form").addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("admin-login-email").value,r=document.getElementById("admin-login-pwd").value,l=document.getElementById("btn-submit-login");l.disabled=!0,l.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{const o=await C.login(n,r),d=o==null?void 0:o.user;if(!d)throw new Error("Login gagal, coba lagi.");k.profile={id:d.id,email:d.email,nama:"Administrator QIA",role:"admin",status:"aktif"};try{const{supabase:m}=await te(async()=>{const{supabase:b}=await Promise.resolve().then(()=>Xa);return{supabase:b}},void 0),{data:v}=await m.from("profiles").select("*").eq("id",d.id).single();v&&(k.profile=v)}catch{}t("Berhasil masuk sebagai Admin!","success"),a.innerHTML=Ka(),Ha(e,t),await sa(t),X("dashboard",t)}catch(o){t("Gagal masuk: "+o.message,"error"),l.disabled=!1,l.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Admin'}})}function Ka(){return`
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
</div>`}function Ha(a,e){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(t=>{t.addEventListener("click",()=>X(t.dataset.view,e))}),document.getElementById("btn-logout").addEventListener("click",async()=>{await C.logout(),a("/")}),document.getElementById("admin-modal-close").addEventListener("click",I),document.getElementById("admin-modal").addEventListener("click",function(t){t.target===this&&I()})}function le(a){var e;document.querySelectorAll(".nav-item[data-view]").forEach(t=>t.classList.remove("active")),(e=document.getElementById("nav-"+a))==null||e.classList.add("active")}function X(a,e){k.activeView=a,le(a);const t=document.getElementById("main-content");switch(document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show"),a){case"dashboard":ea(t),sa(e).then(()=>{k.activeView==="dashboard"&&ea(t)});break;case"mentor":J(t,e);break;case"kelas":Y(t,e);break;case"peserta":Q(t,e);break;case"spreadsheet":oe(t,e);break;case"export":ue(t,e);break;case"activity":ge(t,e);break;default:ea(t)}window.renderAdminView=i=>X(i,e)}async function sa(a){var e,t;try{k.stats=await h.getDashboardStats();const i=document.getElementById("user-name");i&&(i.textContent=((e=k.profile)==null?void 0:e.nama)||"Admin");const s=document.getElementById("user-avatar");s&&(s.textContent=(((t=k.profile)==null?void 0:t.nama)||"A").charAt(0))}catch(i){a&&a("Gagal load stats: "+i.message,"error")}}function ea(a,e){const t=k.stats||{};a.innerHTML=`
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
    ${[[t.total_peserta||0,"Total Peserta Didik","fa-users","stat-icon-gold"],[t.total_bimbel||0,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[t.total_privat||0,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[t.total_mentor||0,"Mentor Aktif","fa-person-chalkboard","stat-icon-blue"],[t.total_kelas||0,"Kelas Aktif","fa-door-open","stat-icon-gold"],[t.hadir_hari_ini||0,"Hadir Hari Ini","fa-calendar-check","stat-icon-emerald"],[t.absensi_hari_ini||0,"Sesi Hari Ini","fa-clipboard-list","stat-icon-brown"],[t.rata_nilai_bulan_ini||0,"Rata Nilai Bulan Ini","fa-star","stat-icon-blue"]].map(([i,s,n,r])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${r}"><i class="fa-solid ${n}" style="color:white;"></i></div>
      <div><div class="stat-value">${i}</div><div class="stat-label">${s}</div></div>
    </div>`).join("")}
  </div>

  <!-- Quick actions -->
  <div class="grid-3" style="margin-bottom:24px;">
    ${[["fa-chalkboard-user","Tambah Mentor","Daftarkan ustadz/ustadzah baru","btn-gold","mentor"],["fa-door-open","Buat Kelas Baru","Tambah kelas bimbel & assign mentor","btn-emerald","kelas"],["fa-user-plus","Tambah Peserta Didik","Daftarkan peserta didik baru","btn-blue","peserta"],["fa-table","Spreadsheet Editor","Edit data secara massal","btn-gold","spreadsheet"],["fa-file-export","Export Data","Download data ke Excel/CSV","btn-brown","export"],["fa-clock-rotate-left","Log Aktivitas","Lihat riwayat aksi admin & mentor","btn-gray","activity"]].map(([i,s,n,r,l])=>`
    <button onclick="renderAdminView('${l}')"
      style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:var(--radius);
      padding:20px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.25s;"
      onmouseover="this.style.borderColor='var(--gold-500)';this.style.transform='translateY(-2px)'"
      onmouseout="this.style.borderColor='var(--border-dark)';this.style.transform=''">
      <i class="fa-solid ${i}" style="font-size:22px;color:#F0AF43;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;color:var(--cream-100);font-size:14px;margin-bottom:4px;">${s}</div>
      <div style="font-size:12px;color:var(--text-card-muted);">${n}</div>
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
    ${(t.aktivitas_terbaru||[]).length===0?'<p style="color:var(--text-card-muted);font-size:13px;">Belum ada aktivitas tercatat.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${(t.aktivitas_terbaru||[]).slice(0,6).map(i=>`
        <div style="padding:10px 14px;background:rgba(255,255,255,0.04);border-radius:10px;
          display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--cream-100);">${i.action}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${i.entity_type||""} ${i.entity_id?"#"+i.entity_id:""}</div>
          </div>
          <div style="font-size:11px;color:var(--text-card-muted);white-space:nowrap;">${Qa(i.created_at)}</div>
        </div>`).join("")}
      </div>`}
  </div>`,re(t)}function re(a){setTimeout(()=>{const e=document.getElementById("admin-chart-distribusi");if(e&&typeof Chart<"u"){const i=a.total_bimbel||0,s=a.total_privat||0;i+s===0?e.parentElement.innerHTML=`
          <div style="text-align:center;color:var(--text-card-muted);font-size:12.5px;">
            <i class="fa-solid fa-chart-pie" style="font-size:28px;opacity:0.35;margin-bottom:8px;color:#F0AF43;display:block;"></i>
            Belum ada data peserta didik
          </div>`:new Chart(e,{type:"doughnut",data:{labels:["Bimbel Kelompok","Program Privat"],datasets:[{data:[i,s],backgroundColor:["#10b981","#F0AF43"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"68%",plugins:{legend:{position:"bottom",labels:{color:"#fdf0e2",boxWidth:12,padding:12,font:{size:12}}}}}})}const t=document.getElementById("admin-chart-sistem");t&&typeof Chart<"u"&&new Chart(t,{type:"bar",data:{labels:["Peserta Bimbel","Peserta Privat","Mentor Aktif","Kelas Aktif"],datasets:[{label:"Jumlah",data:[a.total_bimbel||0,a.total_privat||0,a.total_mentor||0,a.total_kelas||0],backgroundColor:["rgba(16,185,129,0.75)","rgba(240,175,67,0.75)","rgba(59,130,246,0.75)","rgba(217,119,6,0.75)"],borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{color:"#c9a87a",stepSize:1,font:{size:11}},grid:{color:"rgba(255,255,255,0.06)"}},x:{ticks:{color:"#c9a87a",font:{size:11}},grid:{display:!1}}}}})},50)}async function J(a,e){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Mentor / <span>Asatidz</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-mentor">
      <i class="fa-solid fa-plus"></i> Tambah Mentor
    </button>
  </div>
  <div id="mentor-list-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;try{const t=await h.getMentors();document.getElementById("mentor-list-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama</th><th>Email</th><th>Jenis</th><th>No HP</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${t.length===0?'<tr><td colspan="6" style="text-align:center;padding:28px;color:#81511D;">Belum ada mentor.</td></tr>':t.map(i=>`<tr>
              <td><div style="font-weight:600;">${i.nama}</div></td>
              <td><span style="font-size:12px;">${i.email}</span></td>
              <td>${Na(i.jenis_mentor)}</td>
              <td><span style="font-size:13px;">${i.no_hp||"-"}</span></td>
              <td>${la(i.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editMentor('${i.id}')" title="Edit Mentor"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-warning btn-sm" onclick="changeMentorPassword('${i.id}','${i.nama.replace(/'/g,"&apos;")}')" title="Ubah Password" style="background:linear-gradient(135deg,#d97706,#b45309);color:#fff;border:none;"><i class="fa-solid fa-key"></i></button>
                  ${i.status==="aktif"?`<button class="btn btn-danger btn-sm" onclick="toggleMentorStatus('${i.id}','nonaktif')" title="Nonaktifkan"><i class="fa-solid fa-ban"></i></button>`:`<button class="btn btn-success btn-sm" onclick="toggleMentorStatus('${i.id}','aktif')" title="Aktifkan"><i class="fa-solid fa-check"></i></button>`}
                </div>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`,window.editMentor=i=>{const s=t.find(n=>n.id===i);s&&S("Edit Mentor",`
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="form-group"><label class="form-label">Nama</label><input type="text" class="form-control" id="em-nama" value="${s.nama}" /></div>
        <div class="form-group"><label class="form-label">No HP</label><input type="text" class="form-control" id="em-nohp" value="${s.no_hp||""}" /></div>
        <div class="form-group"><label class="form-label">Jenis Mentor</label>
          <select class="form-control" id="em-jenis">
            <option value="bimbel" ${s.jenis_mentor==="bimbel"?"selected":""}>Bimbel</option>
            <option value="privat" ${s.jenis_mentor==="privat"?"selected":""}>Privat</option>
            <option value="keduanya" ${s.jenis_mentor==="keduanya"?"selected":""}>Keduanya</option>
          </select>
        </div>
      </div>`,async()=>{await h.updateMentor(i,{nama:document.getElementById("em-nama").value,no_hp:document.getElementById("em-nohp").value,jenis_mentor:document.getElementById("em-jenis").value}),e("Mentor diperbarui!","success"),I(),J(a,e)})},window.toggleMentorStatus=async(i,s)=>{await h.updateMentor(i,{status:s}),e(`Mentor ${s==="aktif"?"diaktifkan":"dinonaktifkan"}!`,"success"),J(a,e)},window.changeMentorPassword=(i,s)=>{S(`Ubah Password — ${s}`,`
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:1px solid #f59e0b;border-radius:10px;padding:14px;font-size:13px;color:#92400e;">
          <i class="fa-solid fa-triangle-exclamation" style="margin-right:6px;"></i>
          Password baru akan langsung aktif. Pastikan sudah memberitahu mentor terkait.
        </div>
        <div class="form-group">
          <label class="form-label">Password Baru</label>
          <div style="position:relative;">
            <input type="password" class="form-control" id="cp-pw" placeholder="Min. 8 karakter" style="padding-right:44px;" />
            <button type="button" onclick="document.getElementById('cp-pw').type=document.getElementById('cp-pw').type==='password'?'text':'password'" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#81511D;font-size:16px;">
              <i class="fa-solid fa-eye" id="cp-eye-icon"></i>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Konfirmasi Password</label>
          <input type="password" class="form-control" id="cp-pw2" placeholder="Ulangi password baru" />
        </div>
        <div id="cp-match-msg" style="font-size:12px;min-height:18px;"></div>
      </div>`,async()=>{const n=document.getElementById("cp-pw").value,r=document.getElementById("cp-pw2").value;if(!n||n.length<8){e("Password minimal 8 karakter.","info");return}if(n!==r){e("Konfirmasi password tidak cocok.","error");return}try{await h.resetMentorPassword(i,n),e(`Password ${s} berhasil diubah!`,"success"),I()}catch(l){e("Gagal: "+l.message,"error")}}),setTimeout(()=>{const n=document.getElementById("cp-pw2"),r=document.getElementById("cp-match-msg");n&&r&&n.addEventListener("input",()=>{const l=document.getElementById("cp-pw").value;if(!n.value){r.textContent="";return}n.value===l?r.innerHTML='<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> <span style="color:#16a34a;">Password cocok</span>':r.innerHTML='<i class="fa-solid fa-circle-xmark" style="color:#dc2626;"></i> <span style="color:#dc2626;">Password tidak cocok</span>'})},100)}}catch(t){e("Gagal memuat mentor: "+t.message,"error")}document.getElementById("btn-tambah-mentor").addEventListener("click",()=>{S("Tambah Mentor Baru",`
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
    </div>`,async()=>{const t=document.getElementById("nm-email").value,i=document.getElementById("nm-pw").value;if(!t||!i){e("Isi email dan password.","info");return}try{await h.createMentor(t,i,{nama:document.getElementById("nm-nama").value,no_hp:document.getElementById("nm-nohp").value,jenis_mentor:document.getElementById("nm-jenis").value}),e("Mentor berhasil ditambahkan!","success"),I(),J(a,e)}catch(s){e("Gagal: "+s.message,"error")}})})}async function Y(a,e){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Kelas <span>Bimbel</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-kelas"><i class="fa-solid fa-plus"></i> Buat Kelas Baru</button>
  </div>
  <div id="kelas-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[t,i,s]=await Promise.all([h.getKelas(),h.getMentors({status:"aktif"}),h.getPesertaDidik({jenis:"bimbel",status:"aktif"})]).catch(n=>(e("Gagal memuat data.","error"),[[],[],[]]));document.getElementById("kelas-wrapper").innerHTML=`
  <div class="grid-3">
    ${t.length===0?'<div style="grid-column:1/-1;text-align:center;padding:40px;color:#81511D;">Belum ada kelas. Buat kelas pertama!</div>':t.map(n=>{var l;const r=s.filter(o=>o.id_kelas===n.id);return`
        <div class="card anim-fadeInUp" style="position:relative;">
          <div style="position:absolute;top:16px;right:16px;">${la(n.status)}</div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <div>
              <h3 style="color:var(--cream-100);font-size:14px;">${n.nama_kelas}</h3>
              <div style="font-size:12px;color:var(--text-card-muted);">${((l=n.mentor)==null?void 0:l.nama)||"Belum ada mentor"}</div>
            </div>
          </div>
          ${n.hari_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:4px;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${n.hari_jadwal}</div>`:""}
          ${n.jam_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:10px;"><i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${n.jam_jadwal}</div>`:""}
          <div style="font-size:13px;color:var(--cream-100);margin-bottom:8px;"><i class="fa-solid fa-users" style="color:#10b981;"></i> ${r.length} / ${n.kapasitas||20} peserta didik</div>
          <!-- Santri list mini -->
          <div style="max-height:80px;overflow-y:auto;margin-bottom:12px;">
            ${r.map(o=>`<div style="font-size:12px;color:var(--text-card-muted);padding:2px 0;">• ${o.nama_lengkap}</div>`).join("")}
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="editKelas(${n.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="kelolaSantriKelas(${n.id},'${n.nama_kelas}')">
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
          ${i.filter(n=>n.jenis_mentor==="bimbel"||n.jenis_mentor==="keduanya").map(n=>`<option value="${n.id}">${n.nama}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="nk-hari" placeholder="cth: Senin & Rabu" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="nk-jam" placeholder="cth: 15:30 – 17:00" /></div>
      </div>
      <div class="form-group"><label class="form-label">Kapasitas Maksimal</label><input type="number" class="form-control" id="nk-kap" value="15" /></div>
    </div>`,async()=>{const n=document.getElementById("nk-nama").value.trim();if(!n){e("Isi nama kelas.","info");return}try{await h.createKelas({nama_kelas:n,deskripsi:document.getElementById("nk-desc").value,id_mentor:document.getElementById("nk-mentor").value||null,hari_jadwal:document.getElementById("nk-hari").value,jam_jadwal:document.getElementById("nk-jam").value,kapasitas:parseInt(document.getElementById("nk-kap").value)||15}),e("Kelas berhasil dibuat!","success"),I(),Y(a,e)}catch(r){e("Gagal: "+r.message,"error")}})}),window.editKelas=n=>{const r=t.find(l=>l.id===n);r&&S("Edit Kelas",`
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="ek-nama" value="${r.nama_kelas}" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="ek-desc" rows="2">${r.deskripsi||""}</textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="ek-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${i.filter(l=>l.jenis_mentor==="bimbel"||l.jenis_mentor==="keduanya").map(l=>`<option value="${l.id}" ${r.id_mentor===l.id?"selected":""}>${l.nama}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="ek-hari" value="${r.hari_jadwal||""}" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="ek-jam" value="${r.jam_jadwal||""}" /></div>
      </div>
      <div class="form-group"><label class="form-label">Status</label>
        <select class="form-control" id="ek-status">
          <option value="aktif" ${r.status==="aktif"?"selected":""}>Aktif</option>
          <option value="nonaktif" ${r.status==="nonaktif"?"selected":""}>Nonaktif</option>
        </select>
      </div>
    </div>`,async()=>{await h.updateKelas(n,{nama_kelas:document.getElementById("ek-nama").value,deskripsi:document.getElementById("ek-desc").value,id_mentor:document.getElementById("ek-mentor").value||null,hari_jadwal:document.getElementById("ek-hari").value,jam_jadwal:document.getElementById("ek-jam").value,status:document.getElementById("ek-status").value}),e("Kelas diperbarui!","success"),I(),Y(a,e)})},window.kelolaSantriKelas=(n,r)=>{const l=s.filter(d=>d.id_kelas===n),o=s.filter(d=>!d.id_kelas||d.id_kelas!==n);S(`Kelola Peserta Didik — ${r}`,`
    <div>
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--gold-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
          Peserta Didik di Kelas Ini (${l.length})
        </div>
        ${l.length===0?'<p style="font-size:13px;color:var(--text-card-muted);">Belum ada peserta didik</p>':l.map(d=>`
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
        <button class="btn btn-primary btn-sm" onclick="tambahSantriKeKelas(${n})">
          <i class="fa-solid fa-plus"></i> Tambahkan
        </button>
      </div>
    </div>`,null)},window.pindahSantriKelas=async(n,r)=>{try{await h.updatePeserta(n,{id_kelas:r}),e("Peserta didik berhasil dipindahkan!","success"),I(),Y(a,e)}catch(l){e("Gagal: "+l.message,"error")}},window.tambahSantriKeKelas=async n=>{var l;const r=parseInt((l=document.getElementById("ss-add-santri"))==null?void 0:l.value);if(!r){e("Pilih peserta didik.","info");return}await window.pindahSantriKelas(r,n)}}async function Q(a,e){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Peserta <span>Didik</span></div></div>
    <div style="display:flex;gap:10px;">
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon" style="color:#81511D;"></i>
        <input type="text" id="peserta-search" placeholder="Cari nama peserta didik…"
          class="form-control search-input" style="min-width:240px;background:#ffffff!important;border:1.5px solid var(--cream-300)!important;color:#2b1406!important;font-weight:600!important;" />
      </div>
      <button class="btn btn-primary" id="btn-tambah-peserta"><i class="fa-solid fa-plus"></i> Tambah Peserta Didik</button>
    </div>
  </div>
  <div id="peserta-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[t,i,s]=await Promise.all([h.getPesertaDidik({status:"aktif"}),h.getMentors({status:"aktif"}),h.getKelas({status:"aktif"})]).catch(r=>(e("Gagal memuat data.","error"),[[],[],[]]));function n(r){document.getElementById("peserta-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama Lengkap</th><th>Jenis</th><th>Mentor</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${r.length===0?'<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Tidak ada peserta didik ditemukan.</td></tr>':r.map(l=>{var o;return`<tr>
              <td><div style="font-weight:600;">${l.nama_lengkap}</div><div style="font-size:11px;color:#81511D;">${l.nama_wali||""}</div></td>
              <td>${Na(l.jenis)}</td>
              <td><span style="font-size:13px;">${((o=l.mentor)==null?void 0:o.nama)||"-"}</span></td>
              <td>${la(l.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" title="Lihat Laporan" onclick="lihatLaporanPeserta(${l.id},'${(l.nama_lengkap||"").replace(/'/g,"\\'")}')" style="color:#0ea5e9;"><i class="fa-solid fa-chart-line"></i></button>
                  <button class="btn btn-ghost btn-sm" title="Edit Peserta" onclick="editPeserta(${l.id})"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-ghost btn-sm" title="Nonaktifkan" onclick="nonaktifPeserta(${l.id})" style="color:#d97706;"><i class="fa-solid fa-ban"></i></button>
                  <button class="btn btn-danger btn-sm" title="Hapus Permanen" onclick="hapusPeserta(${l.id}, '${(l.nama_lengkap||"").replace(/'/g,"\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>`}n(t),document.getElementById("peserta-search").addEventListener("input",r=>{const l=r.target.value.toLowerCase();n(t.filter(o=>o.nama_lengkap.toLowerCase().includes(l)))}),window.editPeserta=r=>{const l=t.find(o=>o.id===r);l&&(S("Edit Peserta Didik",$a(l,i,s),async()=>{await h.updatePeserta(r,Ea()),e("Peserta didik diperbarui!","success"),I(),Q(a,e)}),handleJenisChange())},window.nonaktifPeserta=async r=>{confirm("Nonaktifkan peserta didik ini?")&&(await h.updatePeserta(r,{status:"nonaktif"}),e("Peserta didik dinonaktifkan.","info"),Q(a,e))},window.hapusPeserta=async(r,l)=>{if(confirm(`Hapus "${l}" secara permanen dari database?

Semua riwayat nilai, kemajuan hafalan, dan absensi peserta didik ini juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan!`))try{await h.deletePeserta(r),e(`Peserta didik "${l}" berhasil dihapus dari database!`,"success"),Q(a,e)}catch(o){e("Gagal menghapus: "+o.message,"error")}},window.lihatLaporanPeserta=async(r,l,o="kehadiran")=>{S(`📊 Progress & Laporan: ${l}`,'<div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div><p style="margin-top:12px;color:#81511D;font-weight:600;">Memuat data laporan…</p></div>',null);try{const d=await h.getPesertaDetail(r);if(!d){e("Data tidak ditemukan.","error"),I();return}const{kemajuan:m=[],penilaian:v=[],riwayat_kehadiran:b=[],kehadiran_summary:p={}}=d,_=v.length>0?(v.reduce((u,E)=>u+(E.nilai_angka||0),0)/v.length).toFixed(1):"-",c=`
      <div style="font-family:inherit;color:#1a0a02;">
        <!-- Stats ringkas dengan kontras tinggi -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
          <div style="background:#ffffff;border:1.5px solid rgba(16,185,129,0.35);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#059669;">${p.hadir||0}</div>
            <div style="font-size:11px;font-weight:700;color:#047857;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Hadir</div>
          </div>
          <div style="background:#ffffff;border:1.5px solid rgba(249,115,22,0.35);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#ea580c;">${(p.izin||0)+(p.sakit||0)}</div>
            <div style="font-size:11px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Izin/Sakit</div>
          </div>
          <div style="background:#ffffff;border:1.5px solid rgba(239,68,68,0.35);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#dc2626;">${p.alpa||0}</div>
            <div style="font-size:11px;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Alpa</div>
          </div>
          <div style="background:#ffffff;border:1.5px solid rgba(240,175,67,0.45);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#b45309;">${_}</div>
            <div style="font-size:11px;font-weight:700;color:#78350f;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Rata Nilai</div>
          </div>
        </div>

        <!-- Tabs laporan -->
        <div style="display:flex;gap:8px;margin-bottom:14px;border-bottom:2px solid rgba(129,81,29,0.15);padding-bottom:10px;">
          <button id="ltab-kehadiran" onclick="switchLaporanTab('kehadiran')" style="padding:7px 15px;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;transition:all 0.2s;">Kehadiran (${b.length})</button>
          <button id="ltab-kemajuan" onclick="switchLaporanTab('kemajuan')" style="padding:7px 15px;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;transition:all 0.2s;">Kemajuan Hafalan (${m.length})</button>
          <button id="ltab-penilaian" onclick="switchLaporanTab('penilaian')" style="padding:7px 15px;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;transition:all 0.2s;">Penilaian (${v.length})</button>
        </div>
        <div id="laporan-tab-content"></div>
      </div>`,A=document.getElementById("admin-modal-body");A&&(A.innerHTML=c);const D=document.getElementById("admin-modal-inner");D&&(D.className="modal modal-lg");const j=document.getElementById("admin-modal-footer");j&&(j.innerHTML='<button class="btn btn-primary" onclick="closeModal()" style="background:#2b1406;color:#fdf0e2;border:none;padding:8px 22px;font-weight:700;border-radius:8px;box-shadow:0 2px 8px rgba(43,20,6,0.2);">Tutup</button>'),window._laporanData={kehadiran:b,kemajuan:m,penilaian:v,pesertaId:r,namaPeserta:l},window.switchLaporanTab=u=>{["kehadiran","kemajuan","penilaian"].forEach(w=>{const x=document.getElementById(`ltab-${w}`);x&&(w===u?(x.style.background="linear-gradient(135deg, #d97706, #F0AF43)",x.style.color="#1a0a02",x.style.border="none",x.style.fontWeight="800",x.style.boxShadow="0 2px 8px rgba(240,175,67,0.3)"):(x.style.background="#ffffff",x.style.color="#4F280C",x.style.border="1.5px solid rgba(129,81,29,0.22)",x.style.fontWeight="600",x.style.boxShadow="none"))});const{kehadiran:E,kemajuan:$,penilaian:P}=window._laporanData,L=document.getElementById("laporan-tab-content");if(!L)return;const z=w=>{const x=String(w||"").toLowerCase();return x==="hadir"||x==="lancar"?`<span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(16,185,129,0.15);color:#047857;border:1px solid rgba(16,185,129,0.35);">● ${w}</span>`:x==="alpa"||x==="perlu_ulang"||x==="perlu_latihan"?`<span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(239,68,68,0.15);color:#b91c1c;border:1px solid rgba(239,68,68,0.35);">● ${w}</span>`:`<span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(249,115,22,0.15);color:#c2410c;border:1px solid rgba(249,115,22,0.35);">● ${w||"-"}</span>`};u==="kehadiran"?L.innerHTML=E.length===0?'<p style="color:#81511D;font-weight:600;text-align:center;padding:32px;background:#ffffff;border:1.5px dashed rgba(129,81,29,0.2);border-radius:10px;">Belum ada data riwayat kehadiran.</p>':`<div style="max-height:350px;overflow-y:auto;border:1.5px solid rgba(129,81,29,0.18);border-radius:10px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
              <table style="width:100%;border-collapse:collapse;font-size:13px;background:#ffffff;">
                <thead style="position:sticky;top:0;z-index:2;"><tr style="background:#2b1406;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Tanggal</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Status</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Materi</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Catatan</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;width:80px;">Aksi</th>
                </tr></thead>
                <tbody>
                  ${E.map((w,x)=>`<tr id="lrow-kehadiran-${x}" style="background:${x%2===0?"#ffffff":"#fdfaf6"};border-bottom:1px solid rgba(129,81,29,0.1);">
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:12.5px;">${w.tanggal||"-"}</strong></td>
                    <td style="padding:9px 12px;">${z(w.status_hadir)}</td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-size:12.5px;font-weight:600;">${w.materi_pembahasan||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12px;line-height:1.45;">${w.catatan_sesi||w.perkembangan_materi||"-"}</span></td>
                    <td style="padding:9px 12px;text-align:center;">
                      <div style="display:flex;gap:5px;justify-content:center;">
                        <button title="Edit" onclick="editLaporan('kehadiran',${x})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(240,175,67,0.6);color:#b45309;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-pen"></i></button>
                        <button title="Hapus" onclick="hapusLaporan('kehadiran',${w.id||0},${x})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(239,68,68,0.5);color:#dc2626;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </div>`:u==="kemajuan"?L.innerHTML=$.length===0?'<p style="color:#81511D;font-weight:600;text-align:center;padding:32px;background:#ffffff;border:1.5px dashed rgba(129,81,29,0.2);border-radius:10px;">Belum ada data kemajuan hafalan.</p>':`<div style="max-height:350px;overflow-y:auto;border:1.5px solid rgba(129,81,29,0.18);border-radius:10px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
              <table style="width:100%;border-collapse:collapse;font-size:13px;background:#ffffff;">
                <thead style="position:sticky;top:0;z-index:2;"><tr style="background:#2b1406;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Tanggal</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Kitab/Surah</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Halaman/Ayat</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Status</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Catatan</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;width:80px;">Aksi</th>
                </tr></thead>
                <tbody>
                  ${$.map((w,x)=>`<tr id="lrow-kemajuan-${x}" style="background:${x%2===0?"#ffffff":"#fdfaf6"};border-bottom:1px solid rgba(129,81,29,0.1);">
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:12.5px;">${w.tanggal||"-"}</strong></td>
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:13.5px;">${w.kitab_surat||"-"}</strong></td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12.5px;font-weight:600;">${w.halaman_ayat||"-"}</span></td>
                    <td style="padding:9px 12px;">${z(w.status_kelancaran)}</td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12px;line-height:1.45;">${w.catatan_hafalan||"-"}</span></td>
                    <td style="padding:9px 12px;text-align:center;">
                      <div style="display:flex;gap:5px;justify-content:center;">
                        <button title="Edit" onclick="editLaporan('kemajuan',${x})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(240,175,67,0.6);color:#b45309;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-pen"></i></button>
                        <button title="Hapus" onclick="hapusLaporan('kemajuan',${w.id||0},${x})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(239,68,68,0.5);color:#dc2626;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </div>`:u==="penilaian"&&(L.innerHTML=P.length===0?'<p style="color:#81511D;font-weight:600;text-align:center;padding:32px;background:#ffffff;border:1.5px dashed rgba(129,81,29,0.2);border-radius:10px;">Belum ada data penilaian.</p>':`<div style="max-height:350px;overflow-y:auto;border:1.5px solid rgba(129,81,29,0.18);border-radius:10px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
              <table style="width:100%;border-collapse:collapse;font-size:13px;background:#ffffff;">
                <thead style="position:sticky;top:0;z-index:2;"><tr style="background:#2b1406;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Tanggal</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Nilai Angka</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Adab</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Tajwid</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Kelancaran</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Catatan</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;width:80px;">Aksi</th>
                </tr></thead>
                <tbody>
                  ${P.map((w,x)=>`<tr id="lrow-penilaian-${x}" style="background:${x%2===0?"#ffffff":"#fdfaf6"};border-bottom:1px solid rgba(129,81,29,0.1);">
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:12.5px;">${w.tanggal||"-"}</strong></td>
                    <td style="padding:9px 12px;"><b style="color:#059669;font-size:16px;">${w.nilai_angka||"-"}</b></td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-weight:600;font-size:13px;">${w.nilai_adab||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-weight:600;font-size:13px;">${w.nilai_tajwid||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-weight:600;font-size:13px;">${w.nilai_kelancaran||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12px;line-height:1.45;">${w.catatan||"-"}</span></td>
                    <td style="padding:9px 12px;text-align:center;">
                      <div style="display:flex;gap:5px;justify-content:center;">
                        <button title="Edit" onclick="editLaporan('penilaian',${x})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(240,175,67,0.6);color:#b45309;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-pen"></i></button>
                        <button title="Hapus" onclick="hapusLaporan('penilaian',${w.id||0},${x})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(239,68,68,0.5);color:#dc2626;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </div>`)},window.hapusLaporan=async(u,E,$)=>{const P={kehadiran:"kehadiran",kemajuan:"kemajuan",penilaian:"penilaian"};if(!E){e("ID data tidak ditemukan, tidak bisa dihapus.","error");return}if(confirm("Hapus data laporan ini secara permanen?"))try{await h.deleteRow(P[u],E),e("Data laporan berhasil dihapus!","success"),window.lihatLaporanPeserta(r,l,u)}catch(L){e("Gagal menghapus: "+L.message,"error")}},window.editLaporan=(u,E)=>{const $=window._laporanData[u][E];if(!$)return;let P="";u==="kehadiran"?P=`
            <div style="display:grid;gap:12px;color:#1a0a02;">
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Tanggal</label>
                <input type="date" id="el-tgl" value="${$.tanggal||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Status Hadir</label>
                <select id="el-status" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;">
                  ${["hadir","izin","sakit","alpa"].map(z=>`<option value="${z}" ${$.status_hadir===z?"selected":""}>${z}</option>`).join("")}
                </select></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Materi</label>
                <input type="text" id="el-materi" value="${$.materi_pembahasan||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Catatan Sesi</label>
                <textarea id="el-catatan" rows="2" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:500;">${$.catatan_sesi||$.perkembangan_materi||""}</textarea></div>
            </div>`:u==="kemajuan"?P=`
            <div style="display:grid;gap:12px;color:#1a0a02;">
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Tanggal</label>
                <input type="date" id="el-tgl" value="${$.tanggal||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Kitab/Surah</label>
                <input type="text" id="el-kitab" value="${$.kitab_surat||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Halaman/Ayat</label>
                <input type="text" id="el-halaman" value="${$.halaman_ayat||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Status Kelancaran</label>
                <select id="el-kelancaran" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;">
                  ${["lancar","cukup","perlu_latihan"].map(z=>`<option value="${z}" ${$.status_kelancaran===z?"selected":""}>${z}</option>`).join("")}
                </select></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Catatan Hafalan</label>
                <textarea id="el-catatan" rows="2" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:500;">${$.catatan_hafalan||""}</textarea></div>
            </div>`:u==="penilaian"&&(P=`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;color:#1a0a02;">
              <div style="grid-column:1/-1"><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Tanggal</label>
                <input type="date" id="el-tgl" value="${$.tanggal||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Angka</label>
                <input type="number" id="el-nilai" value="${$.nilai_angka||""}" class="form-control" min="0" max="100" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Adab (1-5)</label>
                <input type="number" id="el-adab" value="${$.nilai_adab||""}" class="form-control" min="1" max="5" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Tajwid (1-5)</label>
                <input type="number" id="el-tajwid" value="${$.nilai_tajwid||""}" class="form-control" min="1" max="5" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Kelancaran (1-5)</label>
                <input type="number" id="el-kelnilai" value="${$.nilai_kelancaran||""}" class="form-control" min="1" max="5" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div style="grid-column:1/-1"><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Catatan</label>
                <textarea id="el-catatan" rows="2" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:500;">${$.catatan||""}</textarea></div>
            </div>`),S(`Edit ${u.charAt(0).toUpperCase()+u.slice(1)} #${E+1}`,P,async()=>{var x,ra,oa,da,ca,pa,ma,ua,ga,fa,ba,va,ya,ha,xa,ka;let z={};const w={kehadiran:"kehadiran",kemajuan:"kemajuan",penilaian:"penilaian"};if(u==="kehadiran"?z={tanggal:(x=document.getElementById("el-tgl"))==null?void 0:x.value,status_hadir:(ra=document.getElementById("el-status"))==null?void 0:ra.value,materi_pembahasan:((oa=document.getElementById("el-materi"))==null?void 0:oa.value)||null,catatan_sesi:((da=document.getElementById("el-catatan"))==null?void 0:da.value)||null,perkembangan_materi:((ca=document.getElementById("el-catatan"))==null?void 0:ca.value)||null}:u==="kemajuan"?z={tanggal:(pa=document.getElementById("el-tgl"))==null?void 0:pa.value,kitab_surat:(ma=document.getElementById("el-kitab"))==null?void 0:ma.value,halaman_ayat:(ua=document.getElementById("el-halaman"))==null?void 0:ua.value,status_kelancaran:(ga=document.getElementById("el-kelancaran"))==null?void 0:ga.value,catatan_hafalan:((fa=document.getElementById("el-catatan"))==null?void 0:fa.value)||null}:u==="penilaian"&&(z={tanggal:(ba=document.getElementById("el-tgl"))==null?void 0:ba.value,nilai_angka:parseFloat((va=document.getElementById("el-nilai"))==null?void 0:va.value)||null,nilai_adab:parseInt((ya=document.getElementById("el-adab"))==null?void 0:ya.value)||null,nilai_tajwid:parseInt((ha=document.getElementById("el-tajwid"))==null?void 0:ha.value)||null,nilai_kelancaran:parseInt((xa=document.getElementById("el-kelnilai"))==null?void 0:xa.value)||null,catatan:((ka=document.getElementById("el-catatan"))==null?void 0:ka.value)||null}),!$.id){e("ID tidak ditemukan, tidak bisa disimpan.","error");return}try{await h.updateRow(w[u],$.id,z),e("Data laporan berhasil diperbarui!","success"),window.lihatLaporanPeserta(r,l,u)}catch(Wa){e("Gagal update: "+Wa.message,"error")}});const L=document.querySelector("#admin-modal-footer .btn-ghost");L&&(L.onclick=()=>window.lihatLaporanPeserta(r,l,u))},window.switchLaporanTab(o)}catch(d){I(),e("Gagal memuat laporan: "+d.message,"error")}},document.getElementById("btn-tambah-peserta").addEventListener("click",()=>{S("Tambah Peserta Didik Baru",$a(null,i,s),async()=>{const r=Ea();if(!r.nama_lengkap){e("Isi nama peserta didik.","info");return}try{await h.createPeserta(r),e("Peserta didik berhasil didaftarkan!","success"),I(),Q(a,e)}catch(l){e("Gagal: "+l.message,"error")}}),handleJenisChange()})}function $a(a,e,t){return`
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nama Lengkap</label>
      <input type="text" class="form-control" id="pf-nama" value="${(a==null?void 0:a.nama_lengkap)||""}" placeholder="Nama lengkap peserta didik" /></div>
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
      <select class="form-control" id="pf-kelas" onchange="handleKelasChange()">
        <option value="">-- Pilih Kelas --</option>
        ${t.map(i=>{var s,n;return`<option value="${i.id}" data-mentor="${i.id_mentor||((s=i.mentor)==null?void 0:s.id)||""}" ${(a==null?void 0:a.id_kelas)===i.id?"selected":""}>${i.nama_kelas}${(n=i.mentor)!=null&&n.nama?" (Mentor: "+i.mentor.nama+")":""}</option>`}).join("")}
      </select></div>
    <div class="form-group"><label class="form-label">Assign Mentor</label>
      <select class="form-control" id="pf-mentor">
        <option value="">-- Pilih Mentor --</option>
        ${e.map(i=>`<option value="${i.id}" ${(a==null?void 0:a.id_mentor)===i.id?"selected":""}>${i.nama} (${i.jenis_mentor})</option>`).join("")}
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Catatan Umum</label>
      <textarea class="form-control" id="pf-catatan" rows="2">${(a==null?void 0:a.catatan_umum)||""}</textarea></div>
  </div>`}function Ea(){var a,e,t,i,s,n,r;return{nama_lengkap:(e=(a=document.getElementById("pf-nama"))==null?void 0:a.value)==null?void 0:e.trim(),jenis_kelamin:(t=document.getElementById("pf-jk"))==null?void 0:t.value,jenis:(i=document.getElementById("pf-jenis"))==null?void 0:i.value,id_kelas:parseInt((s=document.getElementById("pf-kelas"))==null?void 0:s.value)||null,id_mentor:((n=document.getElementById("pf-mentor"))==null?void 0:n.value)||null,catatan_umum:(r=document.getElementById("pf-catatan"))==null?void 0:r.value}}window.handleKelasChange=()=>{const a=document.getElementById("pf-kelas"),e=document.getElementById("pf-mentor");if(!a||!e)return;const t=a.options[a.selectedIndex],i=t==null?void 0:t.getAttribute("data-mentor");i&&(e.value=i)};window.handleJenisChange=()=>{var t;const a=(t=document.getElementById("pf-jenis"))==null?void 0:t.value,e=document.getElementById("pf-kelas-group");e&&(e.style.display=a==="bimbel"?"":"none"),a==="bimbel"&&window.handleKelasChange()};async function oe(a,e){a.innerHTML=`
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
      ${[["peserta_bimbel","groups","Peserta Bimbel"],["peserta_privat","person","Peserta Privat"],["mentor","co_present","Mentor"],["kelas","school","Kelas"],["kehadiran","calendar_month","Kehadiran"],["kemajuan","menu_book","Kemajuan"],["penilaian","grade","Penilaian"]].map(([t,i,s])=>`
      <div class="sheet-tab ${t==="peserta_bimbel"?"active":""}" data-tab="${t}" onclick="switchSSTab('${t}',this)">
        <span class="ms" style="font-size:16px;vertical-align:middle;margin-right:4px;">${i}</span>${s}
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
  </div>`,k.ssActiveTab="peserta_bimbel",await G("peserta_bimbel",e),document.getElementById("btn-batch-save").addEventListener("click",()=>me(e)),window.switchSSTab=async(t,i)=>{document.querySelectorAll(".sheet-tab").forEach(s=>s.classList.remove("active")),i.classList.add("active"),k.ssActiveTab=t,k.ssDirtyRows.clear(),k.ssNewRows=[],await G(t,e)},window.filterSS=t=>{k.ssFilter=t,Ta(k.ssData[k.ssActiveTab])},window.reloadSS=async()=>{await G(k.ssActiveTab,e)},window.addSSRow=()=>pe(),window.exportSSTab=t=>{const i=k.ssData[k.ssActiveTab]||[];t==="csv"?Ma(i,`QIA_${k.ssActiveTab}`):Fa(i,`QIA_${k.ssActiveTab}`,k.ssActiveTab)},window.deleteSSRow=async(t,i,s)=>{var l;if(!t)return;const n=((l=V[i])==null?void 0:l.table)||i,r=s?`"${s}"`:"data ini";if(confirm(`Hapus ${r} secara permanen dari database?

Tindakan ini tidak dapat dibatalkan!`))try{i==="peserta"||i==="peserta_bimbel"||i==="peserta_privat"?await h.deletePeserta(t):await h.deleteRow(n,t),e("Data berhasil dihapus dari database! ✅","success"),await G(i,e)}catch(o){e("Gagal menghapus: "+o.message,"error")}},window.exportAllSS=async()=>{e("Mengumpulkan semua data…","info");try{const t=await h.exportAllTables();qa(t,"QIA_DataLengkap"),e("Export berhasil!","success")}catch(t){e("Gagal export: "+t.message,"error")}}}const de={peserta_bimbel:new Set(["id","usia","id_kelas","id_mentor","nama_wali","email_wali","alamat","no_wa_wali","catatan_umum","created_at","updated_at"]),peserta_privat:new Set(["id","usia","id_kelas","id_mentor","nama_wali","email_wali","alamat","no_wa_wali","catatan_umum","created_at","updated_at"])},V={peserta_bimbel:{table:"peserta_didik",fetch:async()=>(await h.getPesertaDidik({jenis:"bimbel"})).map(e=>{var t,i;return{nama_lengkap:e.nama_lengkap,jenis_kelamin:e.jenis_kelamin,jenis:e.jenis,kelas:((t=e.kelas)==null?void 0:t.nama_kelas)||"-",mentor:((i=e.mentor)==null?void 0:i.nama)||"-",status:e.status,_id:e.id}})},peserta_privat:{table:"peserta_didik",fetch:async()=>(await h.getPesertaDidik({jenis:"privat"})).map(e=>{var t;return{nama_lengkap:e.nama_lengkap,jenis_kelamin:e.jenis_kelamin,jenis:e.jenis,mentor:((t=e.mentor)==null?void 0:t.nama)||"-",status:e.status,_id:e.id}})},mentor:{table:"profiles",fetch:()=>h.getMentors()},kelas:{table:"kelas",fetch:()=>h.getKelas()},kehadiran:{table:"kehadiran",fetch:()=>h.exportAllData("kehadiran","*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)")},kemajuan:{table:"kemajuan",fetch:()=>h.exportAllData("kemajuan","*, peserta:peserta_didik(nama_lengkap)")},penilaian:{table:"penilaian",fetch:()=>h.exportAllData("penilaian","*, peserta:peserta_didik(nama_lengkap)")}};async function G(a,e){var n,r;const t=document.getElementById("ss-scroll");t.innerHTML='<div style="text-align:center;padding:48px;"><div class="spinner" style="margin:0 auto;width:36px;height:36px;"></div></div>';const i=document.getElementById("ss-table-name"),s={peserta_bimbel:"peserta_didik (bimbel)",peserta_privat:"peserta_didik (privat)"};i&&(i.textContent=s[a]||((n=V[a])==null?void 0:n.table)||a);try{const l=await((r=V[a])==null?void 0:r.fetch())||[];k.ssData[a]=l,Ta(l,e)}catch(l){t.innerHTML=`<div style="padding:40px;text-align:center;color:#e05c4b;"><i class="fa-solid fa-triangle-exclamation" style="font-size:32px;margin-bottom:12px;display:block;"></i>${l.message}</div>`,e("Gagal memuat data: "+l.message,"error")}}function Ta(a,e){const t=a||[],i=(k.ssFilter||"").toLowerCase(),s=i?t.filter(b=>Object.values(b).some(p=>String(p||"").toLowerCase().includes(i))):t,n=document.getElementById("ss-row-count"),r=document.getElementById("ss-row-total");if(n&&(n.textContent=`${s.length} dari ${t.length} baris`),r&&(r.textContent=s.length),s.length===0){document.getElementById("ss-scroll").innerHTML=`<div style="text-align:center;padding:60px 24px;color:#81511D;">
      <div style="font-size:42px;margin-bottom:12px;opacity:0.4;">🔍</div>
      <p>Tidak ada data yang cocok dengan filter.</p>
    </div>`;return}const l=de[k.ssActiveTab]||new Set,o=s[0],d=Object.entries(o).filter(([b,p])=>(typeof p!="object"||p===null)&&!l.has(b)&&b!=="_id").map(([b])=>b),m=new Set(["nama_lengkap","nama","jenis","status","jenis_kelamin","no_hp","jenis_mentor","nama_kelas","hari_jadwal","jam_jadwal","kapasitas","status_hadir","materi_pembahasan","catatan_sesi","perkembangan_materi","kitab_surat","halaman_ayat","status_kelancaran","catatan_hafalan","nilai_angka","nilai_adab","nilai_tajwid","nilai_kelancaran","catatan","deskripsi"]),v=document.getElementById("ss-scroll");v.innerHTML=`
  <table class="ss-table" id="ss-table-el">
    <thead>
      <tr>
        <th class="ss-th row-num header-row-num" style="width:36px;min-width:36px;">#</th>
        ${d.map(b=>`<th class="ss-th">${b}</th>`).join("")}
        <th class="ss-th" style="width:48px;min-width:48px;text-align:center;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      ${s.map((b,p)=>`
      <tr id="ss-tr-${p}" class="${k.ssDirtyRows.has(b.id||b._id)?"row-dirty":""}">
        <td class="row-num" style="width:36px;min-width:36px;font-size:11px;">${p+1}</td>
        ${d.map(_=>{const c=b[_];return`<td class="ss-cell" data-row="${p}" data-col="${_}" data-id="${b.id||b._id||""}">
            <div class="ss-cell-inner ${Ra(_,c)}" title="${c||""}">${c==null?"":String(c)}</div>
          </td>`}).join("")}
        <td style="text-align:center;padding:4px 6px;border-right:1px solid #e8edf2;border-bottom:1px solid #e8edf2;">
          <button class="btn btn-ghost btn-sm" style="color:#ef4444;padding:3px 7px;border-radius:4px;cursor:pointer;" title="Hapus dari database" onclick="deleteSSRow('${b.id||b._id||""}', '${k.ssActiveTab}', '${(b.nama_lengkap||b.nama||"").replace(/'/g,"\\'")}')">
            <i class="fa-solid fa-trash-can" style="font-size:12px;"></i>
          </button>
        </td>
      </tr>`).join("")}
    </tbody>
  </table>`,v.querySelectorAll(".ss-cell").forEach(b=>{b.addEventListener("click",function(){if(this.classList.contains("cell-editing"))return;const p=this.dataset.col,_=parseInt(this.dataset.row),c=this.dataset.id;m.has(p)&&ce(this,s[_],p,_,c)})})}function ce(a,e,t,i,s,n,r){document.querySelectorAll(".ss-cell.cell-editing").forEach(p=>p.classList.remove("cell-editing")),a.classList.add("cell-editing");const l=e[t],o=a.querySelector(".ss-cell-inner");o.style.display="none";const d={status:["aktif","nonaktif","lulus"],status_hadir:["hadir","izin","sakit","alpa"],jenis:["bimbel","privat"],jenis_mentor:["bimbel","privat","keduanya"],status_kelancaran:["lancar","cukup","perlu_ulang"],jenis_kelamin:["L","P"]};let m;d[t]?(m=document.createElement("select"),m.className="ss-cell-editor-select",d[t].forEach(p=>{const _=document.createElement("option");_.value=p,_.textContent=p,p===String(l)&&(_.selected=!0),m.appendChild(_)})):(m=document.createElement("input"),m.type="text",m.className="ss-cell-editor",m.value=l==null?"":String(l)),a.appendChild(m),m.focus(),m.select&&m.select();const v=()=>{const p=m.tagName==="SELECT"?m.value:m.value.trim();if(a.removeChild(m),o.style.display="",o.textContent=p,o.className=`ss-cell-inner ${Ra(t,p)}`,a.classList.remove("cell-editing"),String(p)!==String(l||"")){e[t]=p,k.ssDirtyRows.add(s||i);const _=document.getElementById("ss-tr-"+i);_&&_.classList.add("row-dirty"),document.getElementById("ss-dirty-count").style.display="";const c=document.getElementById("btn-batch-save");c&&(c.disabled=!1)}},b=()=>{a.removeChild(m),o.style.display="",a.classList.remove("cell-editing")};m.addEventListener("blur",v),m.addEventListener("keydown",p=>{p.key==="Enter"&&(p.preventDefault(),v()),p.key==="Escape"&&b()})}function pe(){const e=document.getElementById("ss-scroll").querySelector("tbody");if(!e)return;const t=e.rows.length,i=document.createElement("tr");i.id=`ss-tr-${t}`,i.classList.add("row-new"),i.innerHTML=`<td class="row-num">NEW</td><td colspan="20" style="padding:12px 16px;"><input type="text" placeholder="Gunakan form 'Tambah Peserta Didik' untuk baris baru yang valid…" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#81511D;" readonly /></td>`,e.appendChild(i),i.scrollIntoView({behavior:"smooth"})}async function me(a){var r;const e=k.ssActiveTab,i=(k.ssData[e]||[]).filter(l=>k.ssDirtyRows.has(l.id)||k.ssDirtyRows.has(String(l.id)));if(i.length===0){a("Tidak ada perubahan.","info");return}const s=document.getElementById("btn-batch-save");if(s.disabled=!0,s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…',!((r=V[e])==null?void 0:r.table)){a("Tabel tidak dikenali.","error");return}try{const l=i.map(o=>{const{peserta:d,mentor:m,kelas:v,...b}=o;return b});await h.bulkUpdatePeserta(l),k.ssDirtyRows.clear(),document.getElementById("ss-dirty-count").style.display="none",a(`${i.length} baris berhasil disimpan! ✅`,"success"),s.disabled=!0,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan',await G(e,a)}catch(l){a("Gagal menyimpan: "+l.message,"error"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan'}}function Ra(a,e){return e?a==="status"?e==="aktif"?"text-green":e==="nonaktif"?"text-red":"":a==="status_hadir"?e==="hadir"?"text-green":e==="alpa"?"text-red":e==="izin"?"text-yellow":"text-blue":a==="status_kelancaran"?e==="lancar"?"text-green":e==="perlu_ulang"?"text-red":"text-yellow":"":""}function ue(a,e){a.innerHTML=`
  <div class="page-header">
    <div><div class="page-title">Export <span>Data</span></div>
    <div class="page-breadcrumb">Unduh data ke file Excel, CSV, atau JSON</div></div>
  </div>

  <div class="grid-2">
    ${[["fa-users","Peserta Didik","Semua data peserta didik aktif beserta info wali","peserta"],["fa-chalkboard-user","Mentor / Asatidz","Daftar semua mentor","mentor"],["fa-door-open","Kelas Bimbel","Data kelas beserta mentor pengampu","kelas"],["fa-calendar-check","Data Kehadiran","Rekap seluruh absensi peserta didik","kehadiran"],["fa-book-quran","Kemajuan Hafalan","Riwayat kemajuan hafalan semua peserta didik","kemajuan"],["fa-star","Penilaian","Data penilaian semua peserta didik","penilaian"]].map(([t,i,s,n])=>`
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="width:44px;height:44px;border-radius:12px;
          background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
          display:flex;align-items:center;justify-content:center;font-size:20px;color:#1a0a02;">
          <i class="fa-solid ${t}"></i></div>
        <div>
          <h4 style="color:var(--cream-100);">${i}</h4>
          <p style="font-size:12px;color:var(--text-card-muted);">${s}</p>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="doExport('${n}','excel')">
          <i class="fa-solid fa-file-excel" style="color:#10b981;"></i> Excel
        </button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('${n}','csv')">
          <i class="fa-solid fa-file-csv" style="color:#F0AF43;"></i> CSV
        </button>
        <button class="btn btn-secondary btn-sm" onclick="doExport('${n}','json')">
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
  </div>`,window.doExport=async(t,i)=>{var s;e("Mengambil data…","info");try{const n=await((s=V[t])==null?void 0:s.fetch())||[];i==="csv"&&Ma(n,`QIA_${t}`),i==="excel"&&Fa(n,`QIA_${t}`,t),i==="json"&&ie(n,`QIA_${t}`),e("Export berhasil!","success")}catch(n){e("Gagal export: "+n.message,"error")}},document.getElementById("btn-export-all").addEventListener("click",async()=>{e("Mengumpulkan semua data…","info");try{const t=await h.exportAllTables();qa(t,"QIA_DataLengkap"),e("Export berhasil!","success")}catch(t){e("Gagal: "+t.message,"error")}})}async function ge(a,e){a.innerHTML=`<div class="page-header">
    <div class="page-title">Log <span>Aktivitas</span></div>
  </div>
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th><th>ID</th></tr></thead>
      <tbody id="activity-tbody"><tr><td colspan="5" style="text-align:center;padding:28px;"><div class="spinner" style="margin:0 auto;width:28px;height:28px;"></div></td></tr></tbody>
    </table>
  </div>`;try{const t=await h.getDashboardStats(),i=(t==null?void 0:t.aktivitas_terbaru)||[];document.getElementById("activity-tbody").innerHTML=i.length===0?'<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Belum ada log aktivitas.</td></tr>':i.map(s=>{var n;return`<tr>
        <td style="font-size:12px;">${Qa(s.created_at)}</td>
        <td style="font-size:12px;">${((n=s.id_user)==null?void 0:n.slice(0,8))||"system"}…</td>
        <td><span style="font-weight:600;">${s.action}</span></td>
        <td>${s.entity_type||"-"}</td>
        <td style="font-size:12px;">${s.entity_id||"-"}</td>
      </tr>`}).join("")}catch{e("Gagal memuat log.","error")}}function S(a,e,t){document.getElementById("admin-modal-title").textContent=a,document.getElementById("admin-modal-body").innerHTML=e;const i=document.getElementById("admin-modal-footer");t?(i.innerHTML=`
    <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" id="modal-save-btn"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>`,document.getElementById("modal-save-btn").addEventListener("click",t)):i.innerHTML='<button class="btn btn-ghost" onclick="closeModal()">Tutup</button>';const s=document.getElementById("admin-modal-inner");s.className=e.length>1500?"modal modal-lg":"modal",document.getElementById("admin-modal").classList.add("show")}function I(){document.getElementById("admin-modal").classList.remove("show")}window.closeModal=I;function Na(a){return`<span class="badge ${{bimbel:"badge-gold",privat:"badge-emerald",keduanya:"badge-blue"}[a]||"badge-gray"}">${a||"-"}</span>`}function la(a){return a==="aktif"?'<span class="badge badge-emerald">● Aktif</span>':`<span class="badge badge-red">● ${a}</span>`}function Qa(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}let f={profile:null,kelasList:[],pesertaList:[],activeView:"dashboard",selectedKelas:null,selectedPeserta:null,absensiRows:[]};async function Ga(a,e,t){document.title="Portal Asatidz — Quran Insight Academy";try{if(f.profile=await C.getProfile(),!f.profile||f.profile.role!=="mentor"){Aa(a,e,t);return}}catch{Aa(a,e,t);return}a.innerHTML=fe(),be(e,t),await ve(t),q("dashboard",t)}function Aa(a,e,t){a.innerHTML=`
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
  </div>`,document.getElementById("mentor-login-form").addEventListener("submit",async s=>{s.preventDefault();const n=document.getElementById("mentor-login-email").value,r=document.getElementById("mentor-login-pwd").value,l=document.getElementById("btn-submit-mentor-login");l.disabled=!0,l.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{await C.login(n,r),t("Berhasil masuk sebagai Asatidz!","success"),Ga(a,e,t)}catch(o){t("Gagal masuk: "+o.message,"error"),l.disabled=!1,l.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Portal Asatidz'}})}function fe(){return`
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
      <div class="nav-item" data-view="kelas" id="nav-kelas" style="${N()?"":"display:none"}">
        <i class="fa-solid fa-chalkboard-user"></i> Kelas Saya
      </div>
      <div class="nav-item" data-view="absensi-massal" id="nav-absensi" style="${N()?"":"display:none"}">
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
</div>`}function N(){var a,e;return((a=f.profile)==null?void 0:a.jenis_mentor)==="bimbel"||((e=f.profile)==null?void 0:e.jenis_mentor)==="keduanya"}function be(a,e){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.view;q(i,e)})}),document.getElementById("btn-logout").addEventListener("click",async()=>{await C.logout(),a("/")})}async function ve(a){var e,t;try{const i=f.profile.id;f.kelasList=await B.getMyKelas(i),f.pesertaList=await B.getMyPeserta(i),document.getElementById("user-name").textContent=f.profile.nama||f.profile.email,document.getElementById("user-role-label").textContent=aa(f.profile.jenis_mentor),document.getElementById("user-avatar").textContent=(f.profile.nama||"M").charAt(0),N()&&((e=document.getElementById("nav-kelas"))==null||e.removeAttribute("style"),(t=document.getElementById("nav-absensi"))==null||t.removeAttribute("style"))}catch(i){a("Gagal memuat data: "+i.message,"error")}}function ye(a){document.querySelectorAll(".nav-item[data-view]").forEach(t=>t.classList.remove("active"));const e=document.getElementById("nav-"+a.replace("-list","santri").replace("-massal","absensi").replace("-detail","santri"));e&&e.classList.add("active")}function q(a,e){f.activeView=a,ye(a);const t=document.getElementById("main-content");switch(a){case"dashboard":za(t,e);break;case"kelas":he(t,e);break;case"absensi-massal":xe(t,e);break;case"santri-list":_e(t,e);break;case"ganti-password":$e(t,e);break;default:za(t,e)}document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}function za(a,e){var s;const t=f.pesertaList.filter(n=>n.jenis==="bimbel").length,i=f.pesertaList.filter(n=>n.jenis==="privat").length;a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Mentor</span></div>
      <div class="page-breadcrumb">Selamat datang, ${((s=f.profile)==null?void 0:s.nama)||"—"}</div>
    </div>
    <div style="font-size:13px;color:var(--text-muted);">
      <i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
    </div>
  </div>

  <!-- Stats -->
  <div class="grid-4" style="margin-bottom:28px;">
    ${[[`${f.pesertaList.length}`,"Total Peserta Didik","fa-users","stat-icon-gold"],[t,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[i,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[`${f.kelasList.length}`,"Kelas Aktif","fa-door-open","stat-icon-blue"]].map(([n,r,l,o])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${o}"><i class="fa-solid ${l}" style="color:white;"></i></div>
      <div><div class="stat-value">${n}</div><div class="stat-label">${r}</div></div>
    </div>`).join("")}
  </div>

  <!-- Shortcut actions -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;">
    ${N()?`
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
    ${N()?`
    <button onclick="renderMentorView('kelas')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-chalkboard" style="font-size:24px;color:#10b981;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Kelas Saya</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">${f.kelasList.length} kelas aktif</div>
    </button>`:""}
  </div>

  <!-- Daftar santri ringkas -->
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h3 style="color:var(--cream-100);font-size:14px;">Peserta Didik Bimbingan Saya</h3>
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">Lihat Semua →</button>
    </div>
    ${f.pesertaList.length===0?'<p style="color:var(--text-card-muted);font-size:14px;">Belum ada peserta didik yang ditugaskan.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${f.pesertaList.slice(0,6).map(n=>{var r;return`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;
          background:rgba(255,255,255,0.04);border-radius:10px;
          border:1px solid transparent;cursor:pointer;transition:all 0.2s;"
          onclick="openSantriDetail(${n.id})"
          onmouseover="this.style.background='rgba(240,175,67,0.08)';this.style.borderColor='rgba(240,175,67,0.15)'"
          onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='transparent'">
          <div style="width:36px;height:36px;border-radius:50%;
            background:linear-gradient(135deg,var(--brown-600),var(--brown-300));
            display:flex;align-items:center;justify-content:center;
            font-weight:700;font-size:14px;color:#fdf0e2;flex-shrink:0;">${n.nama_lengkap.charAt(0)}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;color:var(--cream-100);font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n.nama_lengkap}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${((r=n.kelas)==null?void 0:r.nama_kelas)||aa(n.jenis)}</div>
          </div>
          <span class="${n.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${n.jenis}</span>
        </div>`}).join("")}
      </div>`}
  </div>`,window.renderMentorView=n=>q(n,e),window.openSantriDetail=n=>Oa(n,a,e)}function he(a,e){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Kelas <span>Saya</span></div>
      <div class="page-breadcrumb">${f.kelasList.length} kelas aktif yang Anda ampu</div>
    </div>
    <button onclick="renderMentorView('absensi-massal')" class="btn btn-primary">
      <i class="fa-solid fa-clipboard-list"></i> Absensi Massal
    </button>
  </div>
  <div class="grid-3">
    ${f.kelasList.length===0?'<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon"><span class="ms" style="font-size:40px;color:var(--gold-400);">school</span></div><h3>Belum ada kelas</h3><p>Anda belum memiliki kelas aktif.</p></div></div>':f.kelasList.map(t=>{const i=f.pesertaList.filter(s=>s.id_kelas===t.id);return`
        <div class="card anim-fadeInUp">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <span class="badge badge-gold">${i.length} peserta didik</span>
          </div>
          <h3 style="color:var(--cream-100);font-size:15px;margin-bottom:6px;">${t.nama_kelas}</h3>
          <p style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">${t.deskripsi||"Tidak ada deskripsi"}</p>
          ${t.hari_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:6px;">
            <i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${t.hari_jadwal}</div>`:""}
          ${t.jam_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">
            <i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${t.jam_jadwal}</div>`:""}
          <div style="display:flex;flex-direction:column;gap:6px;max-height:120px;overflow-y:auto;">
            ${i.map(s=>`
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-card-muted);">
              <div style="width:24px;height:24px;border-radius:50%;
                background:linear-gradient(135deg,var(--brown-600),var(--brown-400));
                display:flex;align-items:center;justify-content:center;
                font-size:11px;font-weight:700;color:#fdf0e2;flex-shrink:0;">${s.nama_lengkap.charAt(0)}</div>
              ${s.nama_lengkap}
            </div>`).join("")}
          </div>
          <button onclick="openAbsensiMassal(${t.id})" class="btn btn-secondary btn-sm" style="width:100%;margin-top:14px;">
            <i class="fa-solid fa-clipboard-list"></i> Absensi Kelas Ini
          </button>
        </div>`}).join("")}
  </div>`,window.renderMentorView=t=>q(t,e),window.openAbsensiMassal=t=>{f.selectedKelas=f.kelasList.find(i=>i.id===t)||null,q("absensi-massal",e)}}function xe(a,e){var i;const t=new Date().toISOString().slice(0,10);a.innerHTML=`
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
          ${f.kelasList.map(s=>{var n;return`<option value="${s.id}" ${((n=f.selectedKelas)==null?void 0:n.id)===s.id?"selected":""}>${s.nama_kelas}</option>`}).join("")}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal Sesi</label>
        <input type="date" class="form-control" id="absensi-tanggal" value="${t}" />
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
  </div>`,document.getElementById("btn-load-absensi").addEventListener("click",()=>{const s=parseInt(document.getElementById("absensi-kelas-select").value);if(!s){e("Pilih kelas terlebih dahulu.","info");return}f.selectedKelas=f.kelasList.find(r=>r.id===s);const n=f.pesertaList.filter(r=>r.id_kelas===s);if(n.length===0){e("Tidak ada peserta didik di kelas ini.","info");return}f.absensiRows=n.map(r=>({id_peserta:r.id,nama:r.nama_lengkap,status_hadir:"hadir",perkembangan_materi:"",catatan:""})),ke(n)}),(i=document.getElementById("btn-simpan-absensi"))==null||i.addEventListener("click",()=>we(e)),window.setAllStatus=s=>{f.absensiRows.forEach(n=>n.status_hadir=s),document.querySelectorAll(".status-select").forEach(n=>{n.value=s,updateRowStyle(n)})},window.renderMentorView=s=>q(s,e)}function ke(a){const e=document.getElementById("absensi-table-wrapper"),t=document.getElementById("absensi-tbody");e.style.display="block",document.getElementById("absensi-count-label").textContent=`${a.length} peserta didik dalam kelas`,t.innerHTML=f.absensiRows.map((i,s)=>`
  <tr id="absensi-row-${s}" style="border-bottom:1px solid rgba(240,175,67,0.15);${s%2===1?"background:rgba(255,255,255,0.03);":""}">
    <td style="padding:10px 16px;color:#F0AF43;font-weight:700;">${s+1}</td>
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
      <select class="status-select form-control-light" data-idx="${s}"
        style="width:130px;text-align:center;font-weight:600;"
        onchange="updateAbsensiStatus(this)">
        <option value="hadir"  ${i.status_hadir==="hadir"?"selected":""} style="color:#059669;">● Hadir</option>
        <option value="izin"   ${i.status_hadir==="izin"?"selected":""} style="color:#d97706;">◐ Izin</option>
        <option value="sakit"  ${i.status_hadir==="sakit"?"selected":""} style="color:#3b82f6;">◑ Sakit</option>
        <option value="alpa"   ${i.status_hadir==="alpa"?"selected":""} style="color:#dc2626;">○ Alpa</option>
      </select>
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light perkembangan-input" data-idx="${s}"
        value="${i.perkembangan_materi}"
        placeholder="Perkembangan materi peserta didik ini…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'perkembangan_materi')" />
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light catatan-input" data-idx="${s}"
        value="${i.catatan}"
        placeholder="Catatan khusus…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'catatan')" />
    </td>
  </tr>`).join(""),window.updateAbsensiStatus=i=>{const s=parseInt(i.dataset.idx);f.absensiRows[s].status_hadir=i.value,updateRowStyle(i)},window.updateAbsensiField=(i,s)=>{const n=parseInt(i.dataset.idx);f.absensiRows[n][s]=i.value},window.updateRowStyle=i=>{const s={hadir:"rgba(16,185,129,0.08)",izin:"rgba(240,175,67,0.08)",sakit:"rgba(59,130,246,0.08)",alpa:"rgba(239,68,68,0.08)"},n=parseInt(i.dataset.idx),r=document.getElementById("absensi-row-"+n);r&&(r.style.background=s[i.value]||"")}}async function we(a){var l,o,d,m,v,b;const e=(l=f.selectedKelas)==null?void 0:l.id,t=(o=document.getElementById("absensi-tanggal"))==null?void 0:o.value,i=(m=(d=document.getElementById("absensi-materi"))==null?void 0:d.value)==null?void 0:m.trim(),s=(b=(v=document.getElementById("absensi-catatan"))==null?void 0:v.value)==null?void 0:b.trim();if(!e||!t){a("Pilih kelas dan tanggal.","info");return}if(f.absensiRows.length===0){a("Muat daftar peserta didik terlebih dahulu.","info");return}const n=document.getElementById("btn-simpan-absensi");n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';const r=f.absensiRows.map(p=>({id_peserta:p.id_peserta,id_mentor:f.profile.id,id_kelas:e,tanggal:t,status_hadir:p.status_hadir,materi_pembahasan:i||null,perkembangan_materi:p.perkembangan_materi||null,catatan_sesi:s||null||p.catatan||null}));try{await B.bulkSimpanAbsensi(r),a(`Absensi ${r.length} peserta didik berhasil disimpan! ✅`,"success"),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}catch(p){a("Gagal menyimpan: "+p.message,"error"),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}}function _e(a,e){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Daftar <span>Peserta Didik</span></div>
      <div class="page-breadcrumb">${f.pesertaList.length} peserta didik bimbingan Anda</div>
    </div>
    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass search-icon" style="color:var(--brown-400);"></i>
      <input type="text" id="santri-search" placeholder="Cari nama peserta didik…"
        class="form-control-light search-input" style="min-width:240px;" />
    </div>
  </div>

  <!-- Kelas filter tabs (bimbel only) -->
  ${N()&&f.kelasList.length>0?`
  <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
    <button class="btn btn-primary btn-sm active-kelas-tab" data-kelas-filter="all" onclick="filterByKelas('all',this)">Semua</button>
    ${f.kelasList.map(t=>`<button class="btn btn-ghost btn-sm" data-kelas-filter="${t.id}" onclick="filterByKelas('${t.id}',this)">${t.nama_kelas}</button>`).join("")}
    <button class="btn btn-ghost btn-sm" data-kelas-filter="privat" onclick="filterByKelas('privat',this)">Privat</button>
  </div>`:""}

  <div id="santri-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>`,window.currentKelasFilter="all",window.filterByKelas=(t,i)=>{var s;document.querySelectorAll("[data-kelas-filter]").forEach(n=>{n.classList.remove("btn-primary"),n.classList.add("btn-ghost")}),i.classList.remove("btn-ghost"),i.classList.add("btn-primary"),window.currentKelasFilter=t,ta(ja(((s=document.getElementById("santri-search"))==null?void 0:s.value)||"",t))},window.openSantriDetail=t=>Oa(t,a,e),window.renderMentorView=t=>q(t,e),document.getElementById("santri-search").addEventListener("input",t=>{ta(ja(t.target.value,window.currentKelasFilter||"all"))}),ta(f.pesertaList)}function ja(a,e){return f.pesertaList.filter(t=>{const i=!a||t.nama_lengkap.toLowerCase().includes(a.toLowerCase());return e==="all"?i:e==="privat"?i&&t.jenis==="privat":i&&String(t.id_kelas)===String(e)})}function ta(a,e){const t=document.getElementById("santri-grid");if(t){if(a.length===0){t.innerHTML=`<div style="grid-column:1/-1"><div class="empty-state">
      <div class="empty-state-icon">🔍</div><h3>Tidak ada peserta didik ditemukan</h3></div></div>`;return}t.innerHTML=a.map(i=>{var s;return`
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
        <div style="font-size:11.5px;color:var(--text-card-muted);">${((s=i.kelas)==null?void 0:s.nama_kelas)||aa(i.jenis)}</div>
      </div>
      <span class="${i.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${i.jenis}</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="event.stopPropagation();openSantriDetail(${i.id})" class="btn btn-secondary btn-sm" style="flex:1;">
        <i class="fa-solid fa-eye"></i> Detail
      </button>
    </div>
  </div>`}).join("")}}function Oa(a,e,t){var s;const i=f.pesertaList.find(n=>n.id===a);i&&(f.selectedPeserta=i,e.innerHTML=`
  <div class="page-header">
    <div style="display:flex;align-items:center;gap:12px;">
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div>
        <div class="page-title">${i.nama_lengkap}</div>
        <div class="page-breadcrumb">${((s=i.kelas)==null?void 0:s.nama_kelas)||aa(i.jenis)}</div>
      </div>
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:24px;max-width:960px;" id="detail-layout">
    <!-- Card Form Terpadu Berurutan Ke Bawah -->
    <div class="card" id="card-laporan-sesi" style="padding:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div>
          <h3 style="color:var(--cream-100);margin:0 0 4px;font-size:1.15rem;display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-clipboard-list" style="color:#F0AF43;"></i>
            Input Laporan Sesi Peserta Didik
          </h3>
          <p style="margin:0;font-size:12.5px;color:var(--text-card-muted);">
            Isi bagian yang dibutuhkan (Hafalan / Penilaian / Catatan), lalu klik Simpan di bagian bawah.
          </p>
        </div>
      </div>

      <!-- SEKSI 1: KEHADIRAN & MATERI SESI -->
      <div style="margin-bottom:24px;padding:16px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid rgba(255,255,255,0.06);">
        <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-calendar-check"></i> 1. Kehadiran & Materi Sesi
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
          <div class="form-group">
            <label class="form-label">Tanggal Sesi</label>
            <input type="date" class="form-control" id="inp-tgl-sesi" value="${new Date().toISOString().slice(0,10)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Status Kehadiran</label>
            <select class="form-control" id="inp-status-hadir">
              <option value="hadir">● Hadir</option>
              <option value="izin">◐ Izin</option>
              <option value="sakit">◑ Sakit</option>
              <option value="alpa">○ Alpa</option>
              <option value="none">— Lewati Kehadiran —</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Materi Pembahasan</label>
            <input type="text" class="form-control" id="inp-materi" placeholder="cth: Tajwid Mad Thobi'i, Makhorijul Huruf" />
          </div>
        </div>
      </div>

      <!-- SEKSI 2: KEMAJUAN HAFALAN -->
      <div style="margin-bottom:24px;padding:16px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid rgba(255,255,255,0.06);">
        <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-book-quran"></i> 2. Kemajuan Hafalan
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px;">
          <div class="form-group">
            <label class="form-label">Kitab / Surah</label>
            <input type="text" class="form-control" id="inp-kitab" placeholder="cth: Al-Baqarah, Jilid 2" />
          </div>
          <div class="form-group">
            <label class="form-label">Halaman / Ayat</label>
            <input type="text" class="form-control" id="inp-halaman" placeholder="cth: Ayat 1-10, Hal. 12" />
          </div>
          <div class="form-group">
            <label class="form-label">Status Kelancaran</label>
            <select class="form-control" id="inp-kelancaran">
              <option value="lancar">● Lancar</option>
              <option value="cukup">◑ Cukup</option>
              <option value="perlu_ulang">○ Perlu Diulang</option>
            </select>
          </div>
        </div>
      </div>

      <!-- SEKSI 3: PENILAIAN -->
      <div style="margin-bottom:24px;padding:16px;background:rgba(255,255,255,0.02);border-radius:10px;border:1px solid rgba(255,255,255,0.06);">
        <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-star"></i> 3. Penilaian Sesi
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:14px;">
          <div class="form-group">
            <label class="form-label">Nilai Angka (0–100)</label>
            <input type="number" class="form-control" id="inp-nilai" min="0" max="100" placeholder="85" />
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
      </div>

      <!-- CATATAN SESI (Terpadu) -->
      <div style="margin-bottom:24px;padding:16px;background:rgba(240,175,67,0.04);border-radius:10px;border:1px solid rgba(240,175,67,0.15);">
        <h4 style="color:#F0AF43;margin:0 0 10px;font-size:0.95rem;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-comment-dots"></i> Catatan Sesi
        </h4>
        <div class="form-group" style="margin:0;">
          <textarea class="form-control" id="inp-catatan" rows="3" placeholder="Tuliskan catatan perkembangan hafalan, penilaian, keaktifan santri, atau pesan untuk orang tua…"></textarea>
        </div>
      </div>

      <!-- Tombol Simpan Terpadu di Bawah -->
      <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-lg" id="btn-save-laporan" style="min-width:240px;padding:12px 24px;font-size:14px;">
          <i class="fa-solid fa-floppy-disk"></i> Simpan Laporan Sesi
        </button>
        <span id="laporan-save-hint" style="font-size:12.5px;color:var(--text-card-muted);">
          <i class="fa-solid fa-circle-info" style="margin-right:4px;"></i> Semua bagian yang terisi akan otomatis tersimpan bersamaan
        </span>
      </div>
    </div>

    <!-- Riwayat Peserta Didik di Bawahnya -->
    <div class="card" id="history-panel" style="padding:24px;">
      <h4 style="color:var(--cream-100);margin-bottom:16px;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Riwayat Peserta Didik
      </h4>
      <div style="font-size:13px;color:var(--text-card-muted);text-align:center;padding:20px 0;">
        Memuat riwayat…
      </div>
    </div>
  </div>`,window.renderMentorView=n=>q(n,t),Ia(a),document.getElementById("btn-save-laporan").addEventListener("click",async()=>{const n=document.getElementById("btn-save-laporan"),r=new Date().toISOString().slice(0,10),l=document.getElementById("inp-tgl-sesi").value||r,o=document.getElementById("inp-status-hadir").value,d=document.getElementById("inp-materi").value.trim(),m=document.getElementById("inp-kitab").value.trim(),v=document.getElementById("inp-halaman").value.trim(),b=document.getElementById("inp-nilai").value,p=document.getElementById("inp-catatan").value.trim(),_=o!=="none",c=!!m,A=!!b;if(!_&&!c&&!A&&!!!p){t("Isi minimal satu bagian (Kehadiran, Hafalan, Penilaian, atau Catatan Sesi).","info");return}n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';const j=[],u=[];if(_)try{await B.addKehadiran({id_peserta:a,id_mentor:f.profile.id,id_kelas:i.id_kelas||null,tanggal:l,status_hadir:o,materi_pembahasan:d||null,perkembangan_materi:p||null,catatan_sesi:p||null}),u.push(`Kehadiran (${o})`),document.getElementById("inp-materi").value=""}catch(E){j.push("Kehadiran: "+E.message)}if(c)try{await B.addKemajuan({id_peserta:a,id_mentor:f.profile.id,tanggal:l,kitab_surat:m,halaman_ayat:v,status_kelancaran:document.getElementById("inp-kelancaran").value,catatan_hafalan:p||null}),u.push("Kemajuan Hafalan"),document.getElementById("inp-kitab").value="",document.getElementById("inp-halaman").value=""}catch(E){j.push("Hafalan: "+E.message)}if(A){const E=parseFloat(b);if(isNaN(E))j.push("Penilaian: nilai angka tidak valid");else try{await B.addPenilaian({id_peserta:a,id_mentor:f.profile.id,tanggal:l,nilai_angka:E,nilai_adab:parseInt(document.getElementById("inp-adab").value)||null,nilai_tajwid:parseInt(document.getElementById("inp-tajwid").value)||null,nilai_kelancaran:parseInt(document.getElementById("inp-kelancaran-nilai").value)||null,catatan:p||null}),u.push("Penilaian"),document.getElementById("inp-nilai").value="",document.getElementById("inp-adab").value="",document.getElementById("inp-tajwid").value="",document.getElementById("inp-kelancaran-nilai").value=""}catch($){j.push("Penilaian: "+$.message)}}u.length>0&&(document.getElementById("inp-catatan").value=""),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Laporan Sesi',u.length>0&&(t(`✅ Tersimpan: ${u.join(", ")}`,"success"),Ia(a)),j.length>0&&j.forEach(E=>t("Gagal — "+E,"error"))}))}async function Ia(a,e){const t=document.getElementById("history-panel");if(t)try{const[i,s,n,r]=await Promise.all([B.getKemajuan(a,8),B.getPenilaian(a,8),B.getCatatan(a),B.getRiwayatKehadiran(a,10)]);t.innerHTML=`
    <h4 style="color:var(--cream-100);margin-bottom:18px;display:flex;align-items:center;gap:8px;">
      <i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Riwayat Peserta Didik
    </h4>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;">
      <!-- Kolom Hafalan -->
      <div style="background:rgba(255,255,255,0.02);padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);">
        <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">
          <i class="fa-solid fa-book-quran" style="margin-right:6px;"></i> Hafalan Terakhir
        </div>
        ${i.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin:0;">Belum ada catatan</p>':i.slice(0,4).map(l=>`
          <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;">
            <div style="font-size:12.5px;color:var(--cream-100);font-weight:600;">${l.kitab_surat} — ${l.halaman_ayat||""}</div>
            <div style="font-size:11px;color:var(--text-card-muted);margin-top:2px;">${ia(l.tanggal)} • ${Ee(l.status_kelancaran)}</div>
          </div>`).join("")}
      </div>

      <!-- Kolom Penilaian -->
      <div style="background:rgba(255,255,255,0.02);padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);">
        <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">
          <i class="fa-solid fa-star" style="margin-right:6px;"></i> Penilaian Terakhir
        </div>
        ${s.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin:0;">Belum ada penilaian</p>':s.slice(0,4).map(l=>`
          <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <div style="font-size:13px;color:var(--cream-100);font-weight:700;">${l.nilai_angka}</div>
              <div style="font-size:11px;color:var(--text-card-muted);">${ia(l.tanggal)}</div>
            </div>
            <div style="font-size:11px;color:var(--text-card-muted);text-align:right;">
              Adab ${l.nilai_adab||"-"} • Tajwid ${l.nilai_tajwid||"-"} • Lancar ${l.nilai_kelancaran||"-"}
            </div>
          </div>`).join("")}
      </div>

      <!-- Kolom Absensi -->
      <div style="background:rgba(255,255,255,0.02);padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);">
        <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">
          <i class="fa-solid fa-calendar-check" style="margin-right:6px;"></i> Riwayat Absensi
        </div>
        ${r.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin:0;">Belum ada absensi</p>':r.slice(0,4).map(l=>`
          <div style="padding:7px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:5px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
              <span style="font-size:12px;font-weight:700;color:${Ae(l.status_hadir)};">${ze(l.status_hadir)} ${l.status_hadir}</span>
              <span style="font-size:11px;color:var(--text-card-muted);">${ia(l.tanggal)}</span>
            </div>
            ${l.materi_pembahasan?`<div style="font-size:11px;color:var(--text-card-muted);">📚 ${l.materi_pembahasan}</div>`:""}
            ${l.perkembangan_materi?`<div style="font-size:11px;color:var(--text-card-muted);font-style:italic;">${l.perkembangan_materi}</div>`:""}
          </div>`).join("")}
      </div>
    </div>`}catch{t&&(t.innerHTML='<p style="color:#e05c4b;font-size:13px;">Gagal memuat riwayat.</p>')}}function $e(a,e){a.innerHTML=`
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
  </div>`,document.getElementById("btn-ganti-pw").addEventListener("click",async()=>{const t=document.getElementById("inp-new-pw").value,i=document.getElementById("inp-confirm-pw").value;if(!t||t.length<8){e("Password minimal 8 karakter.","info");return}if(t!==i){e("Konfirmasi password tidak cocok.","error");return}try{await B.updatePassword(t),e("Password berhasil diubah! ✅","success"),document.getElementById("inp-new-pw").value="",document.getElementById("inp-confirm-pw").value=""}catch(s){e("Gagal: "+s.message,"error")}})}function aa(a){return a==="bimbel"?"Bimbel Kelompok":a==="privat"?"Privat":a||"-"}function Ee(a){return a==="lancar"?'<span class="ms" style="font-size:15px;color:#10b981;vertical-align:middle;">check_circle</span> Lancar':a==="cukup"?'<span class="ms" style="font-size:15px;color:#F0AF43;vertical-align:middle;">help</span> Cukup':'<span class="ms" style="font-size:15px;color:#ef4444;vertical-align:middle;">replay</span> Perlu Diulang'}function Ae(a){return a==="hadir"?"#10b981":a==="izin"?"#F0AF43":a==="sakit"?"#60a5fa":"#e05c4b"}function ze(a){return a==="hadir"?'<span class="ms" style="font-size:15px;color:#10b981;">check_circle</span>':a==="izin"?'<span class="ms" style="font-size:15px;color:#F0AF43;">description</span>':a==="sakit"?'<span class="ms" style="font-size:15px;color:#60a5fa;">sick</span>':'<span class="ms" style="font-size:15px;color:#ef4444;">cancel</span>'}function ia(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function Ba(a,e,t){document.title="Portal Wali — Quran Insight Academy",a.innerHTML=je(),Ie(e,t)}function je(){return`
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
            title="Cari Peserta Didik"
            style="padding:16px 20px;border-radius:0 14px 14px 0;border:2px solid rgba(240,175,67,0.25);
            border-left:none;
            background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;
            font-size:18px;cursor:pointer;
            transition:all 0.25s;display:flex;align-items:center;justify-content:center;"
            onmouseover="this.style.opacity='0.85';this.style.transform='scale(1.05)'"
            onmouseout="this.style.opacity='1';this.style.transform='scale(1)'">
            <i class="fa-solid fa-magnifying-glass"></i>
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
`}function Ie(a,e){window.navigateTo=o=>a(o);const t=document.getElementById("wali-search-input"),i=document.getElementById("wali-search-btn"),s=document.getElementById("wali-guide"),n=document.getElementById("wali-loading"),r=document.getElementById("wali-content");document.getElementById("detail-modal-close").addEventListener("click",()=>{document.getElementById("detail-modal").classList.remove("show")}),document.getElementById("detail-modal").addEventListener("click",function(o){o.target===this&&this.classList.remove("show")});async function l(){const o=t.value.trim();if(!o||o.length<2){e("Masukkan minimal 2 huruf nama peserta didik.","info"),t.focus();return}s.style.display="none",n.style.display="block",r.style.display="none",r.innerHTML="";try{const d=await R.searchPeserta(o);if(n.style.display="none",r.style.display="block",!d||d.length===0){r.innerHTML=`
          <div style="text-align:center;padding:48px;">
            <div style="font-size:52px;margin-bottom:16px;opacity:0.4;">🔍</div>
            <h3 style="color:#4F280C;">Peserta didik tidak ditemukan</h3>
            <p style="color:#81511D;font-size:14px;margin-top:8px;">
              Tidak ada peserta didik aktif dengan nama "<strong>${o}</strong>". Pastikan ejaan sudah benar.
            </p>
          </div>`;return}Be(d,e)}catch(d){n.style.display="none",r.style.display="block",r.innerHTML=`<div style="text-align:center;padding:48px;color:#e05c4b;">
        <i class="fa-solid fa-circle-exclamation" style="font-size:36px;margin-bottom:12px;"></i>
        <p>Gagal memuat data: ${d.message}</p></div>`,e("Gagal memuat data. Periksa koneksi Anda.","error")}}i.addEventListener("click",l),t.addEventListener("keydown",o=>{o.key==="Enter"&&l()}),window.openDetailWali=async function(o){var d;document.getElementById("detail-modal").classList.add("show"),document.getElementById("detail-modal-title").textContent="Memuat detail…",document.getElementById("detail-modal-body").innerHTML=`
      <div style="text-align:center;padding:48px;">
        <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
          border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div>
      </div>`;try{const m=await R.getPesertaDetail(o);if(!m||!m.peserta){document.getElementById("detail-modal").classList.remove("show"),e("Data peserta didik tidak ditemukan.","error");return}document.getElementById("detail-modal-title").textContent=`Profil — ${((d=m.peserta)==null?void 0:d.nama_lengkap)||""}`,document.getElementById("detail-modal-body").innerHTML=Pe(m),await Le(o,m)}catch(m){document.getElementById("detail-modal").classList.remove("show"),e("Gagal memuat detail: "+m.message,"error")}},window.printRapor=async function(o,d){try{const m=await R.getPesertaDetail(o);m&&m.peserta?ne(m):e("Data peserta didik belum lengkap untuk dicetak.","error")}catch(m){e("Gagal mencetak rapor: "+m.message,"error")}}}function Be(a,e){const t=document.getElementById("wali-content"),i=a.length;t.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
      <h3 style="color:#1a0a02;font-size:1rem;font-weight:700;">
        <i class="fa-solid fa-users" style="color:#F0AF43;"></i> &nbsp;${i} Peserta Didik Ditemukan
      </h3>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${a.map(s=>Se(s)).join("")}
    </div>`}function Se(a){const e=a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa>0?Math.round(a.total_hadir/(a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa)*100):0,t=a.nama_kelas||(a.jenis==="privat"?"Program Privat":"-"),i=a.kitab_surat_terakhir?`${a.kitab_surat_terakhir}${a.halaman_ayat_terakhir?" — "+a.halaman_ayat_terakhir:""}`:"Belum ada catatan";return`
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
            <i class="fa-solid fa-layer-group" style="color:#D4934E;"></i> ${t}
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
          <div style="font-size:22px;font-weight:800;color:${Ua(a.rata_nilai)};">${a.rata_nilai||"-"}</div>
          <div style="font-size:10px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">Rata Nilai</div>
        </div>
        <!-- Kehadiran -->
        <div style="text-align:center;min-width:72px;">
          <div style="font-size:22px;font-weight:800;color:${e>=80?"#10b981":e>=60?"#F0AF43":"#e05c4b"};">
            ${e}%
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
  </div>`}function Pe(a){var _;const{peserta:e,mentor:t,kelas:i,kemajuan:s,penilaian:n,kehadiran_summary:r,riwayat_kehadiran:l,catatan_mentor:o}=a,d=r||{},m=(d.hadir||0)+(d.izin||0)+(d.sakit||0)+(d.alpa||0),v=m>0?Math.round(d.hadir/m*100):0,b=(n||[]).length>0?(n.reduce((c,A)=>c+(A.nilai_angka||0),0)/n.length).toFixed(1):"-",p=(i==null?void 0:i.nama_kelas)||((e==null?void 0:e.jenis)==="privat"?"Program Privat":"-");return`
  <div style="padding:4px 0;color:#1a0a02;">
    <!-- Profile Header -->
    <div style="background:linear-gradient(135deg,#221104,#3a1c08);border-radius:16px;padding:24px;margin-bottom:20px;
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div style="width:64px;height:64px;border-radius:50%;flex-shrink:0;
        background:linear-gradient(135deg,#4F280C,#D4934E);
        display:flex;align-items:center;justify-content:center;
        font-size:26px;font-weight:700;color:#fdf0e2;">
        ${((_=e==null?void 0:e.nama_lengkap)==null?void 0:_.charAt(0))||"?"}
      </div>
      <div style="flex:1;">
        <h2 style="color:#fdf0e2;font-size:1.2rem;margin-bottom:6px;">${(e==null?void 0:e.nama_lengkap)||"-"}</h2>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-layer-group" style="color:#F0AF43;"></i> ${p}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-user-tie" style="color:#F0AF43;"></i> ${(t==null?void 0:t.nama)||"Belum ditentukan"}</span>
          ${i!=null&&i.hari_jadwal?`<span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${i.hari_jadwal} ${i.jam_jadwal||""}</span>`:""}
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button onclick="printRapor(${e==null?void 0:e.id},'${e==null?void 0:e.nama_lengkap}')"
          style="padding:9px 16px;border-radius:10px;border:1px solid rgba(240,175,67,0.3);
          background:rgba(240,175,67,0.12);color:#F0AF43;font-size:13px;font-weight:600;cursor:pointer;
          transition:all 0.2s;" onmouseover="this.style.background='rgba(240,175,67,0.22)'" onmouseout="this.style.background='rgba(240,175,67,0.12)'">
          <i class="fa-solid fa-print"></i> Cetak Rapor
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">
      ${[[b,"Rata Nilai",Ua(parseFloat(b)),"fa-star"],[v+"%","Kehadiran",v>=80?"#10b981":v>=60?"#F0AF43":"#e05c4b","fa-calendar-check"],[d.hadir||0,"Total Hadir","#10b981","fa-circle-check"],[(d.izin||0)+(d.sakit||0),"Izin/Sakit","#60a5fa","fa-memo-circle-info"],[d.alpa||0,"Alpa","#e05c4b","fa-circle-exclamation"],[(n||[]).length,"Total Penilaian","#F0AF43","fa-clipboard-check"]].map(([c,A,D,j])=>`
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:14px 16px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:${D};margin-bottom:4px;">${c}</div>
        <div style="font-size:11px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">${A}</div>
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
      ${(s||[]).length===0?'<p style="color:#81511D;font-size:13px;">Belum ada catatan kemajuan.</p>':`<div style="display:flex;flex-direction:column;gap:0;">
          ${(s||[]).slice(0,10).map((c,A)=>`
          <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;
            border-bottom:${A<s.length-1?"1px solid rgba(129,81,29,0.1)":"none"};">
            <div style="width:32px;height:32px;border-radius:50%;
              background:${c.status_kelancaran==="lancar"?"rgba(16,185,129,0.15)":c.status_kelancaran==="cukup"?"rgba(240,175,67,0.15)":"rgba(239,68,68,0.15)"};
              display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="ms" style="font-size:18px;color:${c.status_kelancaran==="lancar"?"#10b981":c.status_kelancaran==="cukup"?"#F0AF43":"#ef4444"};">
                ${c.status_kelancaran==="lancar"?"check_circle":c.status_kelancaran==="cukup"?"help":"replay"}
              </span>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;color:#1a0a02;font-size:13.5px;">
                ${c.kitab_surat} ${c.halaman_ayat?"— "+c.halaman_ayat:""}
              </div>
              ${c.catatan_hafalan?`<div style="font-size:12px;color:#81511D;margin-top:2px;font-style:italic;">"${c.catatan_hafalan}"</div>`:""}
            </div>
            <div style="font-size:11px;color:#81511D;white-space:nowrap;">${na(c.tanggal)}</div>
          </div>`).join("")}
        </div>`}
    </div>

    <!-- Riwayat Kehadiran & Materi -->
    <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
      <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
        <i class="fa-solid fa-calendar-days" style="color:#10b981;"></i> Riwayat Kehadiran & Materi
      </h4>
      ${(l||[]).length===0?'<p style="color:#81511D;font-size:13px;">Belum ada catatan absensi.</p>':`<div style="overflow-x:auto;">
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
              ${(l||[]).slice(0,20).map((c,A)=>`
              <tr style="border-bottom:1px solid rgba(129,81,29,0.07);${A%2===1?"background:#fdf8f3;":""}">
                <td style="padding:9px 12px;color:#1a0a02;">${na(c.tanggal)}</td>
                <td style="padding:9px 12px;">${De(c.status_hadir)}</td>
                <td style="padding:9px 12px;color:#4F280C;">${c.materi_pembahasan||"-"}</td>
                <td style="padding:9px 12px;color:#81511D;font-size:12px;font-style:italic;">${c.catatan_sesi||c.perkembangan_materi||"-"}</td>
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
        ${(o||[]).slice(0,5).map(c=>`
        <div style="background:#f8f4ee;border-left:3px solid #F0AF43;border-radius:0 10px 10px 0;padding:12px 16px;">
          <div style="font-size:11px;color:#81511D;margin-bottom:4px;">${na(c.tanggal)}</div>
          <div style="font-size:13.5px;color:#1a0a02;line-height:1.7;">${c.isi_catatan}</div>
        </div>`).join("")}
      </div>
    </div>`:""}
  </div>`}async function Le(a,e){try{const i=((await R.getChartDataPeserta(a)).penilaian||[]).slice(-12),s=document.getElementById("chart-nilai");i.length>0&&s?new Chart(s,{type:"line",data:{labels:i.map(o=>Me(o.tanggal)),datasets:[{label:"Nilai",data:i.map(o=>o.nilai_angka),borderColor:"#F0AF43",backgroundColor:"rgba(240,175,67,0.15)",tension:.4,fill:!0,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{min:0,max:100,grid:{color:"rgba(0,0,0,0.05)"}},x:{grid:{display:!1}}}}}):s&&s.parentElement&&(s.parentElement.innerHTML=`
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-line" style="color:#F0AF43;"></i> Tren Nilai
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-chart-line" style="font-size:26px;margin-bottom:8px;color:#d97706;"></i>
          Belum ada riwayat penilaian
        </div>`);const n=e.kehadiran_summary||{},r=(n.hadir||0)+(n.izin||0)+(n.sakit||0)+(n.alpa||0),l=document.getElementById("chart-kehadiran");r>0&&l?new Chart(l,{type:"doughnut",data:{labels:["Hadir","Izin","Sakit","Alpa"],datasets:[{data:[n.hadir||0,n.izin||0,n.sakit||0,n.alpa||0],backgroundColor:["#10b981","#F0AF43","#60a5fa","#e05c4b"]}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{boxWidth:12,padding:12,font:{size:12}}}}}}):l&&l.parentElement&&(l.parentElement.innerHTML=`
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Rekap Kehadiran
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-calendar-check" style="font-size:26px;margin-bottom:8px;color:#10b981;"></i>
          Belum ada catatan absensi
        </div>`)}catch{}}function Ua(a){return a=parseFloat(a),isNaN(a)?"#81511D":a>=80?"#10b981":a>=65?"#F0AF43":"#e05c4b"}function De(a){const e={hadir:["check_circle","#10b981","rgba(16,185,129,0.12)","Hadir"],izin:["description","#F0AF43","rgba(240,175,67,0.12)","Izin"],sakit:["sick","#60a5fa","rgba(59,130,246,0.12)","Sakit"],alpa:["cancel","#e05c4b","rgba(239,68,68,0.12)","Alpa"]},[t,i,s,n]=e[a]||["help","#81511D","rgba(0,0,0,0.06)",a];return`<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
    border-radius:20px;background:${s};color:${i};font-size:12px;font-weight:600;">
    <span class="ms" style="font-size:15px;">${t}</span> ${n}</span>`}function na(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function Me(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short"}):"-"}function Sa(a,e="info",t=3500){const i=document.getElementById("toast-container");if(!i)return;const s={success:"fa-circle-check",error:"fa-circle-xmark",info:"fa-circle-info"},n=document.createElement("div");n.className=`toast toast-${e}`,n.innerHTML=`<i class="fa-solid ${s[e]||"fa-circle-info"} toast-icon"></i> ${a}`,i.appendChild(n),requestAnimationFrame(()=>{requestAnimationFrame(()=>{n.classList.add("show")})}),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>n.remove(),350)},t)}const Pa={"/":{render:Da},"/admin":{render:se},"/mentor":{render:Ga},"/wali":{render:Ba},"/portal-wali":{render:Ba}};async function F(a,e=!0){const t=(a||"/").replace(/\/$/,"")||"/";e&&history.pushState({},"",t);const i=document.getElementById("app");if(!i)return;const s=Pa[t]||Pa["/"];i.style.opacity="0.7",i.style.transition="opacity 0.15s ease",await new Promise(n=>setTimeout(n,60)),i.innerHTML="",i.style.opacity="1";try{await s.render(i,F,Sa)}catch(n){console.error("Render error on route",t,n),Sa("Terjadi kesalahan saat memuat halaman: "+n.message,"error")}}window.navigate=F;window.navigateTo=F;document.addEventListener("click",a=>{const e=a.target.closest("[data-link]");if(e){a.preventDefault();const t=e.getAttribute("href")||e.dataset.link;t&&F(t)}});window.addEventListener("popstate",()=>{F(window.location.pathname,!1)});(async()=>{try{const a=document.getElementById("initial-loader");a&&(a.style.opacity="0",setTimeout(()=>{a.parentNode&&a.remove()},200)),C.onAuthStateChange(e=>{if(e==="SIGNED_OUT"){const t=window.location.pathname;(t==="/admin"||t==="/mentor")&&F("/")}}),await F(window.location.pathname,!1)}catch(a){console.error("Fatal boot error:",a);const e=document.getElementById("initial-loader");e&&e.remove();const t=document.getElementById("app");t&&!t.innerHTML.trim()&&Da(t,F)}})();
