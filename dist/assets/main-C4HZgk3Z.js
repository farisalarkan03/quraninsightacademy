import{c as ja}from"./vendor-Dx0atVpp.js";import{u as q,w as ua}from"./xlsx-DrgRuPKf.js";(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function t(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();const ga={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key",VITE_SUPABASE_URL:"https://placeholder-qia.supabase.co"},N=typeof import.meta<"u"&&ga&&"https://placeholder-qia.supabase.co"||localStorage.getItem("qia_supabase_url")||"",fa=typeof import.meta<"u"&&ga&&"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key"||localStorage.getItem("qia_supabase_anon_key")||"",f=!!(N&&fa&&N.startsWith("http")&&!N.includes("placeholder")),Ba=f?N:"https://placeholder-qia.supabase.co",Sa=f?fa:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-anon-key",g=ja(Ba,Sa,{auth:{persistSession:!0,autoRefreshToken:f}}),_=[{id:"admin-prod",nama:"Administrator QIA",email:"portalqia@gmail.com",role:"admin",jenis_mentor:null,no_hp:"",status:"aktif"}],$=[],S=[],z=[],M=[],F=[];function m(a,i){try{const e=localStorage.getItem("qia_mock_"+a);if(e)return JSON.parse(e)}catch{}return i}function A(a,i){try{localStorage.setItem("qia_mock_"+a,JSON.stringify(i))}catch{}}const j={async login(a,i){if(f){const{data:t,error:n}=await g.auth.signInWithPassword({email:a,password:i});if(n)throw n;return t}const e=_.find(t=>t.email.toLowerCase()===a.toLowerCase().trim());if(e)return localStorage.setItem("qia_demo_session",JSON.stringify({user:{id:e.id,email:e.email},profile:e})),{user:{id:e.id,email:e.email},profile:e};if(a.includes("admin")){const t=_[0];return localStorage.setItem("qia_demo_session",JSON.stringify({user:{id:t.id,email:t.email},profile:t})),{user:{id:t.id,email:t.email},profile:t}}else{const t=_[1];return localStorage.setItem("qia_demo_session",JSON.stringify({user:{id:t.id,email:t.email},profile:t})),{user:{id:t.id,email:t.email},profile:t}}},async logout(){if(localStorage.removeItem("qia_demo_session"),f)try{await g.auth.signOut()}catch{}},async getSession(){if(f)try{const{data:{session:i}}=await g.auth.getSession();if(i)return i}catch{}const a=localStorage.getItem("qia_demo_session");if(a)try{return JSON.parse(a)}catch{}return null},async getProfile(){var i;const a=await this.getSession();if(!a)return null;if(f&&((i=a.user)!=null&&i.id))try{const{data:e,error:t}=await g.from("profiles").select("*").eq("id",a.user.id).single();if(!t&&e)return e}catch{}return a.profile?a.profile:_.find(e=>{var t;return e.id===((t=a.user)==null?void 0:t.id)})||_[0]},onAuthStateChange(a){return f?g.auth.onAuthStateChange(a):{data:{subscription:{unsubscribe:()=>{}}}}}},k={async getDashboardStats(){if(f)try{const{data:t,error:n}=await g.rpc("get_admin_dashboard_stats");if(!n&&t)return t}catch{}const a=await this.getPesertaDidik(),i=await this.getMentors(),e=await this.getKelas();return{total_santri_aktif:a.filter(t=>t.status==="aktif").length,total_santri_bimbel:a.filter(t=>t.jenis==="bimbel").length,total_santri_privat:a.filter(t=>t.jenis==="privat").length,total_mentor_aktif:i.filter(t=>t.status==="aktif").length,total_kelas_aktif:e.filter(t=>t.status==="aktif").length,persentase_kehadiran_bulan_ini:94.2}},async getMentors(a={}){if(f)try{let e=g.from("profiles").select("*").eq("role","mentor").order("nama");a.status&&(e=e.eq("status",a.status)),a.jenis&&(e=e.eq("jenis_mentor",a.jenis));const{data:t,error:n}=await e;if(!n&&t)return t}catch{}const i=m("profiles",_).filter(e=>e.role==="mentor");return a.jenis?i.filter(e=>e.jenis_mentor===a.jenis||e.jenis_mentor==="keduanya"):i},async createMentor(a,i,e){if(f)try{const{data:s,error:l}=await g.auth.admin.createUser({email:a,password:i,email_confirm:!0,user_metadata:{nama:e.nama,role:"mentor"}});if(!l){const{data:r,error:o}=await g.from("profiles").update({...e,role:"mentor"}).eq("id",s.user.id).select().single();if(!o&&r)return r}}catch{}const t=m("profiles",_),n={id:"mentor-"+Date.now(),email:a,...e,role:"mentor",status:"aktif"};return t.push(n),A("profiles",t),n},async updateMentor(a,i){if(f)try{const{data:n,error:s}=await g.from("profiles").update(i).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=m("profiles",_),t=e.findIndex(n=>n.id===a);return t!==-1?(e[t]={...e[t],...i},A("profiles",e),e[t]):null},async getKelas(a={}){if(f)try{let t=g.from("kelas").select("*, mentor:profiles(id, nama, email, jenis_mentor)").order("nama_kelas");a.status&&(t=t.eq("status",a.status)),a.id_mentor&&(t=t.eq("id_mentor",a.id_mentor));const{data:n,error:s}=await t;if(!s&&n)return n}catch{}const i=m("kelas",$),e=m("profiles",_);return i.map(t=>({...t,mentor:e.find(n=>n.id===t.id_mentor)||{nama:"Asatidz"}}))},async createKelas(a){if(f)try{const{data:t,error:n}=await g.from("kelas").insert(a).select().single();if(!n&&t)return t}catch{}const i=m("kelas",$),e={id:Date.now(),status:"aktif",...a};return i.push(e),A("kelas",i),e},async updateKelas(a,i){if(f)try{const{data:n,error:s}=await g.from("kelas").update(i).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=m("kelas",$),t=e.findIndex(n=>n.id===a);return t!==-1?(e[t]={...e[t],...i},A("kelas",e),e[t]):null},async deleteKelas(a){if(f)try{await g.from("kelas").delete().eq("id",a)}catch{}const i=m("kelas",$).filter(e=>e.id!==a);A("kelas",i)},async getPesertaDidik(a={}){if(f)try{let n=g.from("peserta_didik").select("*, mentor:profiles(id, nama), kelas(id, nama_kelas)").order("nama_lengkap");a.jenis&&(n=n.eq("jenis",a.jenis)),a.id_kelas&&(n=n.eq("id_kelas",a.id_kelas)),a.id_mentor&&(n=n.eq("id_mentor",a.id_mentor)),a.status&&(n=n.eq("status",a.status));const{data:s,error:l}=await n;if(!l&&s)return s}catch{}const i=m("peserta",S),e=m("kelas",$),t=m("profiles",_);return i.map(n=>({...n,kelas:e.find(s=>s.id===n.id_kelas)||null,mentor:t.find(s=>s.id===n.id_mentor)||null}))},async createPeserta(a){if(f)try{const{data:t,error:n}=await g.from("peserta_didik").insert(a).select().single();if(!n&&t)return t}catch{}const i=m("peserta",S),e={id:Date.now(),tanggal_daftar:new Date().toISOString().split("T")[0],status:"aktif",...a};return i.push(e),A("peserta",i),e},async updatePeserta(a,i){if(f)try{const{data:n,error:s}=await g.from("peserta_didik").update(i).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=m("peserta",S),t=e.findIndex(n=>n.id===a);return t!==-1?(e[t]={...e[t],...i},A("peserta",e),e[t]):null},async bulkUpdatePeserta(a){if(f)try{await g.from("peserta_didik").upsert(a);return}catch{}const i=m("peserta",S);a.forEach(e=>{const t=i.findIndex(n=>n.id===e.id);t!==-1?i[t]={...i[t],...e}:i.push(e)}),A("peserta",i)},async exportAllData(a,i="*"){if(f)try{const{data:e,error:t}=await g.from(a).select(i).order("id");if(!t&&e)return e}catch{}return a==="peserta_didik"?m("peserta",S):a==="profiles"?m("profiles",_):a==="kelas"?m("kelas",$):a==="kehadiran"?m("kehadiran",F):a==="kemajuan"?m("kemajuan",z):a==="penilaian"?m("penilaian",M):[]},async exportAllTables(){if(f)try{const[a,i,e,t,n,s]=await Promise.all([g.from("peserta_didik").select("*, kelas(nama_kelas), mentor:profiles(nama)"),g.from("profiles").select("*").eq("role","mentor"),g.from("kelas").select("*, mentor:profiles(nama)"),g.from("kehadiran").select("*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)"),g.from("kemajuan").select("*, peserta:peserta_didik(nama_lengkap)"),g.from("penilaian").select("*, peserta:peserta_didik(nama_lengkap)")]);if(a.data)return{peserta:a.data,mentor:i.data,kelas:e.data,kehadiran:t.data,kemajuan:n.data,penilaian:s.data}}catch{}return{peserta:m("peserta",S),mentor:m("profiles",_).filter(a=>a.role==="mentor"),kelas:m("kelas",$),kehadiran:m("kehadiran",F),kemajuan:m("kemajuan",z),penilaian:m("penilaian",M)}},async logActivity(a,i,e,t={}){if(f)try{const{data:{user:n}}=await g.auth.getUser();await g.from("activity_logs").insert({id_user:n==null?void 0:n.id,action:a,entity_type:i,entity_id:String(e),detail:t})}catch{}}},E={async getMyKelas(a){if(f)try{const{data:e,error:t}=await g.from("kelas").select("*").eq("id_mentor",a).eq("status","aktif").order("nama_kelas");if(!t&&e)return e}catch{}return m("kelas",$).filter(e=>e.id_mentor===a||!a)},async getMyPeserta(a,i=null){if(f)try{let n=g.from("peserta_didik").select("*, kelas(id, nama_kelas)").eq("id_mentor",a).eq("status","aktif").order("nama_lengkap");i&&(n=n.eq("id_kelas",i));const{data:s,error:l}=await n;if(!l&&s)return s}catch{}const e=m("peserta",S),t=m("kelas",$);return e.filter(n=>(!a||n.id_mentor===a)&&(!i||n.id_kelas===i)).map(n=>({...n,kelas:t.find(s=>s.id===n.id_kelas)}))},async bulkSimpanAbsensi(a){if(f)try{const{data:e,error:t}=await g.rpc("bulk_upsert_kehadiran",{p_records:a});if(!t)return e}catch{}const i=m("kehadiran",F);return a.forEach(e=>{i.unshift({id:Date.now()+Math.random(),...e})}),A("kehadiran",i),{success:!0,count:a.length}},async getRiwayatKehadiran(a,i=30){if(f)try{const{data:t,error:n}=await g.from("kehadiran").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(i);if(!n&&t)return t}catch{}return m("kehadiran",F).filter(t=>t.id_peserta===Number(a)).slice(0,i)},async getKemajuan(a,i=20){if(f)try{const{data:t,error:n}=await g.from("kemajuan").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(i);if(!n&&t)return t}catch{}return m("kemajuan",z).filter(t=>t.id_peserta===Number(a)).slice(0,i)},async addKemajuan(a){if(f)try{const{data:t,error:n}=await g.from("kemajuan").insert(a).select().single();if(!n&&t)return t}catch{}const i=m("kemajuan",z),e={id:Date.now(),...a};return i.unshift(e),A("kemajuan",i),e},async getPenilaian(a,i=20){if(f)try{const{data:t,error:n}=await g.from("penilaian").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(i);if(!n&&t)return t}catch{}return m("penilaian",M).filter(t=>t.id_peserta===Number(a)).slice(0,i)},async addPenilaian(a){if(f)try{const{data:t,error:n}=await g.from("penilaian").insert(a).select().single();if(!n&&t)return t}catch{}const i=m("penilaian",M),e={id:Date.now(),...a};return i.unshift(e),A("penilaian",i),e},async getCatatan(a){return[]},async addCatatan(a){return{id:Date.now(),...a}},async getPelajaranTambahan(a){return[]},async addPelajaranTambahan(a){return{id:Date.now(),...a}},async updatePassword(a){if(f){const{error:i}=await g.auth.updateUser({password:a});if(i)throw i}},async getChartData(a){const i=await this.getKemajuan(a,30),e=await this.getPenilaian(a,30),t=await this.getRiwayatKehadiran(a,60);return{kemajuan:i,penilaian:e,kehadiran:t}}},R={async searchPeserta(a){const i=(a||"").trim().toLowerCase();if(!i)return[];if(f)try{const{data:s,error:l}=await g.rpc("search_peserta_wali_by_name",{p_nama:i});if(!l&&s)return s}catch{}const e=m("peserta",S),t=m("kelas",$),n=m("profiles",_);return e.filter(s=>s.nama_lengkap.toLowerCase().includes(i)).map(s=>{const l=t.find(o=>o.id===s.id_kelas),r=n.find(o=>o.id===s.id_mentor);return{id:s.id,nama_lengkap:s.nama_lengkap,jenis:s.jenis,nama_kelas:(l==null?void 0:l.nama_kelas)||(s.jenis==="privat"?"Program Privat":"-"),nama_mentor:(r==null?void 0:r.nama)||"Asatidz QIA"}})},async getPesertaDetail(a){const i=Number(a);if(f)try{const{data:u,error:h}=await g.rpc("get_peserta_detail_wali",{p_peserta_id:i});if(!h&&u)return u}catch{}const e=m("peserta",S),t=e.find(u=>u.id===i)||e[0],n=m("kelas",$),s=m("profiles",_),l=n.find(u=>u.id===(t==null?void 0:t.id_kelas)),r=s.find(u=>u.id===(t==null?void 0:t.id_mentor)),o=m("kemajuan",z).filter(u=>u.id_peserta===i),d=m("kehadiran",F).filter(u=>u.id_peserta===i),c=m("penilaian",M).filter(u=>u.id_peserta===i);return{id:t.id,nama_lengkap:t.nama_lengkap,usia:t.usia,jenis_kelamin:t.jenis_kelamin,jenis:t.jenis,nama_kelas:(l==null?void 0:l.nama_kelas)||(t.jenis==="privat"?"Program Privat":"-"),nama_mentor:(r==null?void 0:r.nama)||"Asatidz QIA",status:t.status,kemajuan_terakhir:o.slice(0,5),kehadiran_terakhir:d.slice(0,10),penilaian_terakhir:c.slice(0,5),statistik:{total_pertemuan:d.length||10,total_hadir:d.filter(u=>u.status_hadir==="hadir").length||9,rata_nilai:c.length?Math.round(c.reduce((u,h)=>u+h.nilai_angka,0)/c.length):88}}},async getChartDataPeserta(a){const i=Number(a);if(f)try{const[s,l,r]=await Promise.all([g.from("penilaian").select("tanggal, nilai_angka").eq("id_peserta",i).order("tanggal").limit(20),g.from("kehadiran").select("tanggal, status_hadir, materi_pembahasan").eq("id_peserta",i).order("tanggal").limit(60),g.from("kemajuan").select("tanggal, kitab_surat, halaman_ayat").eq("id_peserta",i).order("tanggal").limit(20)]);if(s.data)return{penilaian:s.data,kehadiran:l.data,kemajuan:r.data}}catch{}const e=m("penilaian",M).filter(s=>s.id_peserta===i),t=m("kehadiran",F).filter(s=>s.id_peserta===i),n=m("kemajuan",z).filter(s=>s.id_peserta===i);return{penilaian:e,kehadiran:t,kemajuan:n}}};function ba(a,i,e){document.title="Quran Insight Academy — Bimbingan Al-Quran Terpercaya",a.innerHTML=`
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
`,window.navigateTo=l=>i(l),window.navigate=l=>i(l);const t=document.getElementById("qiaMobileToggle"),n=document.getElementById("qiaNavLinks");t&&n&&t.addEventListener("click",()=>{n.classList.toggle("is-open")}),document.querySelectorAll(".qia-faq-btn").forEach(l=>{l.addEventListener("click",function(){const r=this.parentElement,o=r.classList.contains("is-active");document.querySelectorAll(".qia-faq-item").forEach(d=>d.classList.remove("is-active")),o||r.classList.add("is-active")})}),document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener("click",r=>{r.preventDefault(),n&&n.classList.remove("is-open");const o=l.getAttribute("href"),d=document.querySelector(o);d&&d.scrollIntoView({behavior:"smooth"})})})}function J(a,i=""){const e={};for(const[t,n]of Object.entries(a)){const s=i?`${i}_${t}`:t;n&&typeof n=="object"&&!Array.isArray(n)&&!(n instanceof Date)?Object.assign(e,J(n,s)):Array.isArray(n)||(e[s]=n)}return e}function va(a,i="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const e=a.map(l=>J(l)),t=[...new Set(e.flatMap(Object.keys))],n=[t.join(","),...e.map(l=>t.map(r=>{const o=l[r]??"",d=String(o).replace(/"/g,'""');return d.includes(",")||d.includes('"')||d.includes(`
`)?`"${d}"`:d}).join(","))],s=new Blob(["\uFEFF"+n.join(`
`)],{type:"text/csv;charset=utf-8;"});ka(s,`${i}.csv`)}function ya(a,i="export",e="Data"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const t=a.map(r=>J(r)),n=q.json_to_sheet(t),s=q.book_new();q.book_append_sheet(s,n,e);const l=Object.keys(t[0]||{}).map(r=>({wch:Math.max(r.length,...t.map(o=>String(o[r]??"").length))}));n["!cols"]=l,ua(s,`${i}.xlsx`)}function ha(a,i="QIA_DataLengkap"){const e=q.book_new();for(const[t,n]of Object.entries(a)){if(!n||!n.length)continue;const s=n.map(o=>J(o)),l=q.json_to_sheet(s),r=Object.keys(s[0]||{}).map(o=>({wch:Math.max(o.length,...s.map(d=>String(d[o]??"").length))}));l["!cols"]=r,q.book_append_sheet(e,l,t.substring(0,31))}ua(e,`${i}.xlsx`)}function La(a,i="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const e=new Blob([JSON.stringify(a,null,2)],{type:"application/json"});ka(e,`${i}.json`)}function Pa(a){var K;const{peserta:i,mentor:e,kelas:t,kemajuan:n,penilaian:s,kehadiran_summary:l,riwayat_kehadiran:r,catatan_mentor:o}=a,d=l||{},c=(s||[]).slice(0,10),u=(n||[]).slice(0,10),h=(d.hadir||0)+(d.izin||0)+(d.sakit||0)+(d.alpa||0),b=h>0?Math.round(d.hadir/h*100):0,x=c.length>0?(c.reduce((w,Ia)=>w+(Ia.nilai_angka||0),0)/c.length).toFixed(1):"-",v=`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rapor — ${(i==null?void 0:i.nama_lengkap)||""}</title>
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
  <span class="badge">${((K=i==null?void 0:i.jenis)==null?void 0:K.toUpperCase())||"BIMBEL"}</span>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>Nama Peserta Didik</h3>
    <div class="val">${(i==null?void 0:i.nama_lengkap)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Kelas / Program</h3>
    <div class="val">${(t==null?void 0:t.nama_kelas)||((i==null?void 0:i.jenis)==="privat"?"Privat":"-")}</div>
  </div>
  <div class="info-card">
    <h3>Mentor / Ustadz</h3>
    <div class="val">${(e==null?void 0:e.nama)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Rata-rata Nilai</h3>
    <div class="val" style="color:#059669; font-size:20px;">${x}</div>
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
  ${u.map(w=>`<tr><td>${w.tanggal||""}</td><td>${w.kitab_surat||""}</td><td>${w.halaman_ayat||""}</td><td>${w.status_kelancaran||""}</td></tr>`).join("")}
</table>

<h2 class="section">Riwayat Penilaian</h2>
<table>
  <tr><th>Tanggal</th><th>Nilai</th><th>Adab</th><th>Tajwid</th><th>Kelancaran</th><th>Catatan</th></tr>
  ${c.map(w=>`<tr><td>${w.tanggal||""}</td><td><b>${w.nilai_angka||"-"}</b></td><td>${w.nilai_adab||"-"}</td><td>${w.nilai_tajwid||"-"}</td><td>${w.nilai_kelancaran||"-"}</td><td>${w.catatan||""}</td></tr>`).join("")}
</table>

${o!=null&&o.length?`
<h2 class="section">Catatan Mentor</h2>
<table>
  <tr><th>Tanggal</th><th>Catatan</th></tr>
  ${(o||[]).slice(0,5).map(w=>`<tr><td>${w.tanggal||""}</td><td>${w.isi_catatan||""}</td></tr>`).join("")}
</table>`:""}

<div class="footer">
  Dicetak: ${new Date().toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} — Quran Insight Academy
</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body></html>`,I=window.open("","_blank","width=800,height=900");I.document.write(v),I.document.close()}function ka(a,i){const e=URL.createObjectURL(a),t=document.createElement("a");t.href=e,t.download=i,document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(e)}let y={profile:null,stats:null,activeView:"dashboard",ssActiveTab:"peserta",ssData:{peserta:[],mentor:[],kelas:[],kehadiran:[],kemajuan:[],penilaian:[]},ssDirtyRows:new Set,ssNewRows:[],ssSortCol:null,ssSortDir:"asc",ssFilter:""};async function aa(a,i,e){document.title="Portal Admin — Quran Insight Academy";try{if(y.profile=await j.getProfile(),!y.profile||y.profile.role!=="admin"){ia(a,i,e);return}}catch{ia(a,i,e);return}a.innerHTML=Da(),qa(i,e),await Ma(e),ea("dashboard",e)}function ia(a,i,e){var n;a.innerHTML=`
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

      <div class="section-divider"><span>Atau Mode Uji Coba</span></div>

      <button type="button" id="btn-quick-admin" class="btn btn-secondary" style="width:100%;font-size:13px;">
        <i class="fa-solid fa-bolt mr-1"></i> Masuk Cepat Demo Admin
      </button>

      <div style="text-align:center;margin-top:20px;">
        <button onclick="window.navigate('/')" style="background:none;border:none;color:#c9a87a;font-size:13px;cursor:pointer;">
          <i class="fa-solid fa-arrow-left mr-1"></i> Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>`,document.getElementById("admin-login-form").addEventListener("submit",async s=>{s.preventDefault();const l=document.getElementById("admin-login-email").value,r=document.getElementById("admin-login-pwd").value,o=document.getElementById("btn-submit-login");o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{await j.login(l,r),e("Berhasil masuk sebagai Admin!","success"),aa(a,i,e)}catch(d){e("Gagal masuk: "+d.message,"error"),o.disabled=!1,o.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Admin'}}),(n=document.getElementById("btn-quick-admin"))==null||n.addEventListener("click",async()=>{e("Masuk dengan akun demo admin…","info"),await j.login("admin@qia.id","demo123"),e("Berhasil masuk mode admin!","success"),aa(a,i,e)})}function Da(){return`
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
</div>`}function qa(a,i){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(e=>{e.addEventListener("click",()=>ea(e.dataset.view,i))}),document.getElementById("btn-logout").addEventListener("click",async()=>{await j.logout(),a("/")}),document.getElementById("admin-modal-close").addEventListener("click",B),document.getElementById("admin-modal").addEventListener("click",function(e){e.target===this&&B()})}function za(a){var i;document.querySelectorAll(".nav-item[data-view]").forEach(e=>e.classList.remove("active")),(i=document.getElementById("nav-"+a))==null||i.classList.add("active")}function ea(a,i){y.activeView=a,za(a);const e=document.getElementById("main-content");switch(document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show"),a){case"dashboard":na(e);break;case"mentor":T(e,i);break;case"kelas":Q(e,i);break;case"peserta":O(e,i);break;case"spreadsheet":Fa(e,i);break;case"export":Na(e,i);break;case"activity":Ra(e,i);break;default:na(e)}window.renderAdminView=t=>ea(t,i)}async function Ma(a){var i,e;try{y.stats=await k.getDashboardStats(),document.getElementById("user-name").textContent=((i=y.profile)==null?void 0:i.nama)||"Admin",document.getElementById("user-avatar").textContent=(((e=y.profile)==null?void 0:e.nama)||"A").charAt(0)}catch(t){a("Gagal load stats: "+t.message,"error")}}function na(a,i){const e=y.stats||{};a.innerHTML=`
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
    ${[[e.total_peserta||0,"Total Peserta Didik","fa-users","stat-icon-gold"],[e.total_bimbel||0,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[e.total_privat||0,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[e.total_mentor||0,"Mentor Aktif","fa-person-chalkboard","stat-icon-blue"],[e.total_kelas||0,"Kelas Aktif","fa-door-open","stat-icon-gold"],[e.hadir_hari_ini||0,"Hadir Hari Ini","fa-calendar-check","stat-icon-emerald"],[e.absensi_hari_ini||0,"Sesi Hari Ini","fa-clipboard-list","stat-icon-brown"],[e.rata_nilai_bulan_ini||0,"Rata Nilai Bulan Ini","fa-star","stat-icon-blue"]].map(([t,n,s,l])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${l}"><i class="fa-solid ${s}" style="color:white;"></i></div>
      <div><div class="stat-value">${t}</div><div class="stat-label">${n}</div></div>
    </div>`).join("")}
  </div>

  <!-- Quick actions -->
  <div class="grid-3" style="margin-bottom:24px;">
    ${[["fa-chalkboard-user","Tambah Mentor","Daftarkan ustadz/ustadzah baru","btn-gold","mentor"],["fa-door-open","Buat Kelas Baru","Tambah kelas bimbel & assign mentor","btn-emerald","kelas"],["fa-user-plus","Tambah Peserta Didik","Daftarkan peserta didik baru","btn-blue","peserta"],["fa-table","Spreadsheet Editor","Edit data secara massal","btn-gold","spreadsheet"],["fa-file-export","Export Data","Download data ke Excel/CSV","btn-brown","export"],["fa-clock-rotate-left","Log Aktivitas","Lihat riwayat aksi admin & mentor","btn-gray","activity"]].map(([t,n,s,l,r])=>`
    <button onclick="renderAdminView('${r}')"
      style="background:var(--bg-card);border:1px solid var(--border-dark);border-radius:var(--radius);
      padding:20px;cursor:pointer;text-align:left;font-family:inherit;transition:all 0.25s;"
      onmouseover="this.style.borderColor='var(--gold-500)';this.style.transform='translateY(-2px)'"
      onmouseout="this.style.borderColor='var(--border-dark)';this.style.transform=''">
      <i class="fa-solid ${t}" style="font-size:22px;color:#F0AF43;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;color:var(--cream-100);font-size:14px;margin-bottom:4px;">${n}</div>
      <div style="font-size:12px;color:var(--text-card-muted);">${s}</div>
    </button>`).join("")}
  </div>

  <!-- Activity -->
  <div class="card">
    <h3 style="color:var(--cream-100);font-size:14px;margin-bottom:14px;">
      <i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Aktivitas Terbaru
    </h3>
    ${(e.aktivitas_terbaru||[]).length===0?'<p style="color:var(--text-card-muted);font-size:13px;">Belum ada aktivitas tercatat.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${(e.aktivitas_terbaru||[]).slice(0,6).map(t=>`
        <div style="padding:10px 14px;background:rgba(255,255,255,0.04);border-radius:10px;
          display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--cream-100);">${t.action}</div>
            <div style="font-size:11px;color:var(--text-card-muted);">${t.entity_type||""} ${t.entity_id?"#"+t.entity_id:""}</div>
          </div>
          <div style="font-size:11px;color:var(--text-card-muted);white-space:nowrap;">${Aa(t.created_at)}</div>
        </div>`).join("")}
      </div>`}
  </div>`}async function T(a,i){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Mentor / <span>Asatidz</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-mentor">
      <i class="fa-solid fa-plus"></i> Tambah Mentor
    </button>
  </div>
  <div id="mentor-list-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;try{const e=await k.getMentors();document.getElementById("mentor-list-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama</th><th>Email</th><th>Jenis</th><th>No HP</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${e.length===0?'<tr><td colspan="6" style="text-align:center;padding:28px;color:#81511D;">Belum ada mentor.</td></tr>':e.map(t=>`<tr>
              <td><div style="font-weight:600;">${t.nama}</div></td>
              <td><span style="font-size:12px;">${t.email}</span></td>
              <td>${_a(t.jenis_mentor)}</td>
              <td><span style="font-size:13px;">${t.no_hp||"-"}</span></td>
              <td>${ta(t.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editMentor('${t.id}')"><i class="fa-solid fa-pen"></i></button>
                  ${t.status==="aktif"?`<button class="btn btn-danger btn-sm" onclick="toggleMentorStatus('${t.id}','nonaktif')"><i class="fa-solid fa-ban"></i></button>`:`<button class="btn btn-success btn-sm" onclick="toggleMentorStatus('${t.id}','aktif')"><i class="fa-solid fa-check"></i></button>`}
                </div>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`,window.editMentor=t=>{const n=e.find(s=>s.id===t);n&&D("Edit Mentor",`
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
      </div>`,async()=>{await k.updateMentor(t,{nama:document.getElementById("em-nama").value,no_hp:document.getElementById("em-nohp").value,jenis_mentor:document.getElementById("em-jenis").value}),i("Mentor diperbarui!","success"),B(),T(a,i)})},window.toggleMentorStatus=async(t,n)=>{await k.updateMentor(t,{status:n}),i(`Mentor ${n==="aktif"?"diaktifkan":"dinonaktifkan"}!`,"success"),T(a,i)}}catch(e){i("Gagal memuat mentor: "+e.message,"error")}document.getElementById("btn-tambah-mentor").addEventListener("click",()=>{D("Tambah Mentor Baru",`
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
    </div>`,async()=>{const e=document.getElementById("nm-email").value,t=document.getElementById("nm-pw").value;if(!e||!t){i("Isi email dan password.","info");return}try{await k.createMentor(e,t,{nama:document.getElementById("nm-nama").value,no_hp:document.getElementById("nm-nohp").value,jenis_mentor:document.getElementById("nm-jenis").value}),i("Mentor berhasil ditambahkan!","success"),B(),T(a,i)}catch(n){i("Gagal: "+n.message,"error")}})})}async function Q(a,i){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Kelas <span>Bimbel</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-kelas"><i class="fa-solid fa-plus"></i> Buat Kelas Baru</button>
  </div>
  <div id="kelas-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[e,t,n]=await Promise.all([k.getKelas(),k.getMentors({status:"aktif"}),k.getPesertaDidik({jenis:"bimbel",status:"aktif"})]).catch(s=>(i("Gagal memuat data.","error"),[[],[],[]]));document.getElementById("kelas-wrapper").innerHTML=`
  <div class="grid-3">
    ${e.length===0?'<div style="grid-column:1/-1;text-align:center;padding:40px;color:#81511D;">Belum ada kelas. Buat kelas pertama!</div>':e.map(s=>{var r;const l=n.filter(o=>o.id_kelas===s.id);return`
        <div class="card anim-fadeInUp" style="position:relative;">
          <div style="position:absolute;top:16px;right:16px;">${ta(s.status)}</div>
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
  </div>`,document.getElementById("btn-tambah-kelas").addEventListener("click",()=>{D("Buat Kelas Baru",`
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="nk-nama" placeholder="cth: Tahsin Al-Jazari A" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="nk-desc" rows="2" placeholder="Deskripsi kelas…"></textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="nk-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${t.filter(s=>s.jenis_mentor==="bimbel"||s.jenis_mentor==="keduanya").map(s=>`<option value="${s.id}">${s.nama}</option>`).join("")}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="form-group"><label class="form-label">Hari Jadwal</label><input type="text" class="form-control" id="nk-hari" placeholder="cth: Senin & Rabu" /></div>
        <div class="form-group"><label class="form-label">Jam</label><input type="text" class="form-control" id="nk-jam" placeholder="cth: 15:30 – 17:00" /></div>
      </div>
      <div class="form-group"><label class="form-label">Kapasitas Maksimal</label><input type="number" class="form-control" id="nk-kap" value="15" /></div>
    </div>`,async()=>{const s=document.getElementById("nk-nama").value.trim();if(!s){i("Isi nama kelas.","info");return}try{await k.createKelas({nama_kelas:s,deskripsi:document.getElementById("nk-desc").value,id_mentor:document.getElementById("nk-mentor").value||null,hari_jadwal:document.getElementById("nk-hari").value,jam_jadwal:document.getElementById("nk-jam").value,kapasitas:parseInt(document.getElementById("nk-kap").value)||15}),i("Kelas berhasil dibuat!","success"),B(),Q(a,i)}catch(l){i("Gagal: "+l.message,"error")}})}),window.editKelas=s=>{const l=e.find(r=>r.id===s);l&&D("Edit Kelas",`
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group"><label class="form-label">Nama Kelas</label><input type="text" class="form-control" id="ek-nama" value="${l.nama_kelas}" /></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="ek-desc" rows="2">${l.deskripsi||""}</textarea></div>
      <div class="form-group"><label class="form-label">Assign Mentor</label>
        <select class="form-control" id="ek-mentor">
          <option value="">-- Pilih Mentor --</option>
          ${t.filter(r=>r.jenis_mentor==="bimbel"||r.jenis_mentor==="keduanya").map(r=>`<option value="${r.id}" ${l.id_mentor===r.id?"selected":""}>${r.nama}</option>`).join("")}
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
    </div>`,async()=>{await k.updateKelas(s,{nama_kelas:document.getElementById("ek-nama").value,deskripsi:document.getElementById("ek-desc").value,id_mentor:document.getElementById("ek-mentor").value||null,hari_jadwal:document.getElementById("ek-hari").value,jam_jadwal:document.getElementById("ek-jam").value,status:document.getElementById("ek-status").value}),i("Kelas diperbarui!","success"),B(),Q(a,i)})},window.kelolaSantriKelas=(s,l)=>{const r=n.filter(d=>d.id_kelas===s),o=n.filter(d=>!d.id_kelas||d.id_kelas!==s);D(`Kelola Peserta Didik — ${l}`,`
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
    </div>`,null)},window.pindahSantriKelas=async(s,l)=>{try{await k.updatePeserta(s,{id_kelas:l}),i("Peserta didik berhasil dipindahkan!","success"),B(),Q(a,i)}catch(r){i("Gagal: "+r.message,"error")}},window.tambahSantriKeKelas=async s=>{var r;const l=parseInt((r=document.getElementById("ss-add-santri"))==null?void 0:r.value);if(!l){i("Pilih peserta didik.","info");return}await window.pindahSantriKelas(l,s)}}async function O(a,i){a.innerHTML=`<div class="page-header">
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
  <div id="peserta-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[e,t,n]=await Promise.all([k.getPesertaDidik({status:"aktif"}),k.getMentors({status:"aktif"}),k.getKelas({status:"aktif"})]).catch(l=>(i("Gagal memuat data.","error"),[[],[],[]]));function s(l){document.getElementById("peserta-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama Lengkap</th><th>Usia</th><th>Jenis</th><th>Kelas</th><th>Mentor</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${l.length===0?'<tr><td colspan="7" style="text-align:center;padding:28px;color:#81511D;">Tidak ada peserta didik ditemukan.</td></tr>':l.map(r=>{var o,d;return`<tr>
              <td><div style="font-weight:600;">${r.nama_lengkap}</div><div style="font-size:11px;color:#81511D;">${r.nama_wali||""}</div></td>
              <td>${r.usia||"-"}</td>
              <td>${_a(r.jenis)}</td>
              <td><span style="font-size:13px;">${((o=r.kelas)==null?void 0:o.nama_kelas)||"-"}</span></td>
              <td><span style="font-size:13px;">${((d=r.mentor)==null?void 0:d.nama)||"-"}</span></td>
              <td>${ta(r.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" onclick="editPeserta(${r.id})"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-danger btn-sm" onclick="nonaktifPeserta(${r.id})"><i class="fa-solid fa-ban"></i></button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>`}s(e),document.getElementById("peserta-search").addEventListener("input",l=>{const r=l.target.value.toLowerCase();s(e.filter(o=>o.nama_lengkap.toLowerCase().includes(r)))}),window.editPeserta=l=>{const r=e.find(o=>o.id===l);r&&(D("Edit Peserta Didik",sa(r,t,n),async()=>{await k.updatePeserta(l,la()),i("Peserta didik diperbarui!","success"),B(),O(a,i)}),handleJenisChange())},window.nonaktifPeserta=async l=>{confirm("Nonaktifkan peserta didik ini?")&&(await k.updatePeserta(l,{status:"nonaktif"}),i("Peserta didik dinonaktifkan.","info"),O(a,i))},document.getElementById("btn-tambah-peserta").addEventListener("click",()=>{D("Tambah Peserta Didik Baru",sa(null,t,n),async()=>{const l=la();if(!l.nama_lengkap){i("Isi nama peserta didik.","info");return}try{await k.createPeserta(l),i("Peserta didik berhasil didaftarkan!","success"),B(),O(a,i)}catch(r){i("Gagal: "+r.message,"error")}}),handleJenisChange()})}function sa(a,i,e){return`
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
        ${e.map(t=>`<option value="${t.id}" ${(a==null?void 0:a.id_kelas)===t.id?"selected":""}>${t.nama_kelas}</option>`).join("")}
      </select></div>
    <div class="form-group"><label class="form-label">Assign Mentor</label>
      <select class="form-control" id="pf-mentor">
        <option value="">-- Pilih Mentor --</option>
        ${i.map(t=>`<option value="${t.id}" ${(a==null?void 0:a.id_mentor)===t.id?"selected":""}>${t.nama} (${t.jenis_mentor})</option>`).join("")}
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Nama Wali</label>
      <input type="text" class="form-control" id="pf-wali" value="${(a==null?void 0:a.nama_wali)||""}" placeholder="Nama orang tua/wali" /></div>
    <div class="form-group"><label class="form-label">Email Wali</label>
      <input type="email" class="form-control" id="pf-email-wali" value="${(a==null?void 0:a.email_wali)||""}" /></div>
    <div class="form-group"><label class="form-label">No WA Wali</label>
      <input type="text" class="form-control" id="pf-wa-wali" value="${(a==null?void 0:a.no_wa_wali)||""}" /></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Catatan Umum</label>
      <textarea class="form-control" id="pf-catatan" rows="2">${(a==null?void 0:a.catatan_umum)||""}</textarea></div>
  </div>`}function la(){var a,i,e,t,n,s,l,r,o,d,c;return{nama_lengkap:(i=(a=document.getElementById("pf-nama"))==null?void 0:a.value)==null?void 0:i.trim(),usia:parseInt((e=document.getElementById("pf-usia"))==null?void 0:e.value)||null,jenis_kelamin:(t=document.getElementById("pf-jk"))==null?void 0:t.value,jenis:(n=document.getElementById("pf-jenis"))==null?void 0:n.value,id_kelas:parseInt((s=document.getElementById("pf-kelas"))==null?void 0:s.value)||null,id_mentor:((l=document.getElementById("pf-mentor"))==null?void 0:l.value)||null,nama_wali:(r=document.getElementById("pf-wali"))==null?void 0:r.value,email_wali:(o=document.getElementById("pf-email-wali"))==null?void 0:o.value,no_wa_wali:(d=document.getElementById("pf-wa-wali"))==null?void 0:d.value,catatan_umum:(c=document.getElementById("pf-catatan"))==null?void 0:c.value}}window.handleJenisChange=()=>{var e;const a=(e=document.getElementById("pf-jenis"))==null?void 0:e.value,i=document.getElementById("pf-kelas-group");i&&(i.style.display=a==="bimbel"?"":"none")};async function Fa(a,i){a.innerHTML=`
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
      ${[["peserta","group","Peserta Didik"],["mentor","co_present","Mentor"],["kelas","school","Kelas"],["kehadiran","calendar_month","Kehadiran"],["kemajuan","menu_book","Kemajuan"],["penilaian","grade","Penilaian"]].map(([e,t,n])=>`
      <div class="sheet-tab ${e==="peserta"?"active":""}" data-tab="${e}" onclick="switchSSTab('${e}',this)">
        <span class="ms" style="font-size:16px;vertical-align:middle;margin-right:4px;">${t}</span>${n}
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
  </div>`,y.ssActiveTab="peserta",await U("peserta",i),document.getElementById("btn-batch-save").addEventListener("click",()=>Ha(i)),window.switchSSTab=async(e,t)=>{document.querySelectorAll(".sheet-tab").forEach(n=>n.classList.remove("active")),t.classList.add("active"),y.ssActiveTab=e,y.ssDirtyRows.clear(),y.ssNewRows=[],await U(e,i)},window.filterSS=e=>{y.ssFilter=e,xa(y.ssData[y.ssActiveTab])},window.reloadSS=async()=>{await U(y.ssActiveTab,i)},window.addSSRow=()=>Ka(),window.exportSSTab=e=>{const t=y.ssData[y.ssActiveTab]||[];e==="csv"?va(t,`QIA_${y.ssActiveTab}`):ya(t,`QIA_${y.ssActiveTab}`,y.ssActiveTab)},window.exportAllSS=async()=>{i("Mengumpulkan semua data…","info");try{const e=await k.exportAllTables();ha(e,"QIA_DataLengkap"),i("Export berhasil!","success")}catch(e){i("Gagal export: "+e.message,"error")}}}const W={peserta:{table:"peserta_didik",fetch:()=>k.getPesertaDidik()},mentor:{table:"profiles",fetch:()=>k.getMentors()},kelas:{table:"kelas",fetch:()=>k.getKelas()},kehadiran:{table:"kehadiran",fetch:()=>k.exportAllData("kehadiran","*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)")},kemajuan:{table:"kemajuan",fetch:()=>k.exportAllData("kemajuan","*, peserta:peserta_didik(nama_lengkap)")},penilaian:{table:"penilaian",fetch:()=>k.exportAllData("penilaian","*, peserta:peserta_didik(nama_lengkap)")}};async function U(a,i){var n,s;const e=document.getElementById("ss-scroll");e.innerHTML='<div style="text-align:center;padding:48px;"><div class="spinner" style="margin:0 auto;width:36px;height:36px;"></div></div>';const t=document.getElementById("ss-table-name");t&&(t.textContent=((n=W[a])==null?void 0:n.table)||a);try{const l=await((s=W[a])==null?void 0:s.fetch())||[];y.ssData[a]=l,xa(l,i)}catch(l){e.innerHTML=`<div style="padding:40px;text-align:center;color:#e05c4b;"><i class="fa-solid fa-triangle-exclamation" style="font-size:32px;margin-bottom:12px;display:block;"></i>${l.message}</div>`,i("Gagal memuat data: "+l.message,"error")}}function xa(a,i){const e=a||[],t=(y.ssFilter||"").toLowerCase(),n=t?e.filter(u=>Object.values(u).some(h=>String(h||"").toLowerCase().includes(t))):e,s=document.getElementById("ss-row-count"),l=document.getElementById("ss-row-total");if(s&&(s.textContent=`${n.length} dari ${e.length} baris`),l&&(l.textContent=n.length),n.length===0){document.getElementById("ss-scroll").innerHTML=`<div style="text-align:center;padding:60px 24px;color:#81511D;">
      <div style="font-size:42px;margin-bottom:12px;opacity:0.4;">🔍</div>
      <p>Tidak ada data yang cocok dengan filter.</p>
    </div>`;return}const r=n[0],o=Object.entries(r).filter(([u,h])=>typeof h!="object"||h===null).map(([u])=>u),d=new Set(["nama_lengkap","nama","usia","jenis","status","email_wali","no_wa_wali","no_hp","jenis_mentor","nama_kelas","hari_jadwal","jam_jadwal","kapasitas","status_hadir","materi_pembahasan","catatan_sesi","perkembangan_materi","kitab_surat","halaman_ayat","status_kelancaran","catatan_hafalan","nilai_angka","nilai_adab","nilai_tajwid","nilai_kelancaran","catatan","nama_wali","catatan_umum","deskripsi"]),c=document.getElementById("ss-scroll");c.innerHTML=`
  <table class="ss-table" id="ss-table-el">
    <thead>
      <tr>
        <th class="ss-th row-num header-row-num">No</th>
        ${o.map(u=>`<th class="ss-th">${u}</th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${n.map((u,h)=>`
      <tr id="ss-tr-${h}" class="${y.ssDirtyRows.has(u.id)?"row-dirty":""}">
        <td class="row-num">${h+1}</td>
        ${o.map(b=>{const x=u[b];return d.has(b),`<td class="ss-cell" data-row="${h}" data-col="${b}" data-id="${u.id||""}">
            <div class="ss-cell-inner ${wa(b,x)}" title="${x||""}">${x==null?"":String(x)}</div>
          </td>`}).join("")}
      </tr>`).join("")}
    </tbody>
  </table>`,c.querySelectorAll(".ss-cell").forEach(u=>{u.addEventListener("click",function(){if(this.classList.contains("cell-editing"))return;const h=this.dataset.col,b=parseInt(this.dataset.row),x=this.dataset.id;d.has(h)&&Ca(this,n[b],h,b,x)})})}function Ca(a,i,e,t,n,s,l){document.querySelectorAll(".ss-cell.cell-editing").forEach(b=>b.classList.remove("cell-editing")),a.classList.add("cell-editing");const r=i[e],o=a.querySelector(".ss-cell-inner");o.style.display="none";const d={status:["aktif","nonaktif","lulus"],status_hadir:["hadir","izin","sakit","alpa"],jenis:["bimbel","privat"],jenis_mentor:["bimbel","privat","keduanya"],status_kelancaran:["lancar","cukup","perlu_ulang"],jenis_kelamin:["L","P"]};let c;d[e]?(c=document.createElement("select"),c.className="ss-cell-editor-select",d[e].forEach(b=>{const x=document.createElement("option");x.value=b,x.textContent=b,b===String(r)&&(x.selected=!0),c.appendChild(x)})):(c=document.createElement("input"),c.type="text",c.className="ss-cell-editor",c.value=r==null?"":String(r)),a.appendChild(c),c.focus(),c.select&&c.select();const u=()=>{const b=c.tagName==="SELECT"?c.value:c.value.trim();if(a.removeChild(c),o.style.display="",o.textContent=b,o.className=`ss-cell-inner ${wa(e,b)}`,a.classList.remove("cell-editing"),String(b)!==String(r||"")){i[e]=b,y.ssDirtyRows.add(n||t);const x=document.getElementById("ss-tr-"+t);x&&x.classList.add("row-dirty"),document.getElementById("ss-dirty-count").style.display="";const v=document.getElementById("btn-batch-save");v&&(v.disabled=!1)}},h=()=>{a.removeChild(c),o.style.display="",a.classList.remove("cell-editing")};c.addEventListener("blur",u),c.addEventListener("keydown",b=>{b.key==="Enter"&&(b.preventDefault(),u()),b.key==="Escape"&&h()})}function Ka(){const i=document.getElementById("ss-scroll").querySelector("tbody");if(!i)return;const e=i.rows.length,t=document.createElement("tr");t.id=`ss-tr-${e}`,t.classList.add("row-new"),t.innerHTML=`<td class="row-num">NEW</td><td colspan="20" style="padding:12px 16px;"><input type="text" placeholder="Gunakan form 'Tambah Peserta Didik' untuk baris baru yang valid…" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#81511D;" readonly /></td>`,i.appendChild(t),t.scrollIntoView({behavior:"smooth"})}async function Ha(a){var l;const i=y.ssActiveTab,t=(y.ssData[i]||[]).filter(r=>y.ssDirtyRows.has(r.id)||y.ssDirtyRows.has(String(r.id)));if(t.length===0){a("Tidak ada perubahan.","info");return}const n=document.getElementById("btn-batch-save");if(n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…',!((l=W[i])==null?void 0:l.table)){a("Tabel tidak dikenali.","error");return}try{const r=t.map(o=>{const{peserta:d,mentor:c,kelas:u,...h}=o;return h});await k.bulkUpdatePeserta(r),y.ssDirtyRows.clear(),document.getElementById("ss-dirty-count").style.display="none",a(`${t.length} baris berhasil disimpan! ✅`,"success"),n.disabled=!0,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan',await U(i,a)}catch(r){a("Gagal menyimpan: "+r.message,"error"),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan'}}function wa(a,i){return i?a==="status"?i==="aktif"?"text-green":i==="nonaktif"?"text-red":"":a==="status_hadir"?i==="hadir"?"text-green":i==="alpa"?"text-red":i==="izin"?"text-yellow":"text-blue":a==="status_kelancaran"?i==="lancar"?"text-green":i==="perlu_ulang"?"text-red":"text-yellow":"":""}function Na(a,i){a.innerHTML=`
  <div class="page-header">
    <div><div class="page-title">Export <span>Data</span></div>
    <div class="page-breadcrumb">Unduh data ke file Excel, CSV, atau JSON</div></div>
  </div>

  <div class="grid-2">
    ${[["fa-users","Peserta Didik","Semua data peserta didik aktif beserta info wali","peserta"],["fa-chalkboard-user","Mentor / Asatidz","Daftar semua mentor","mentor"],["fa-door-open","Kelas Bimbel","Data kelas beserta mentor pengampu","kelas"],["fa-calendar-check","Data Kehadiran","Rekap seluruh absensi peserta didik","kehadiran"],["fa-book-quran","Kemajuan Hafalan","Riwayat kemajuan hafalan semua peserta didik","kemajuan"],["fa-star","Penilaian","Data penilaian semua peserta didik","penilaian"]].map(([e,t,n,s])=>`
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="width:44px;height:44px;border-radius:12px;
          background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
          display:flex;align-items:center;justify-content:center;font-size:20px;color:#1a0a02;">
          <i class="fa-solid ${e}"></i></div>
        <div>
          <h4 style="color:var(--cream-100);">${t}</h4>
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
  </div>`,window.doExport=async(e,t)=>{var n;i("Mengambil data…","info");try{const s=await((n=W[e])==null?void 0:n.fetch())||[];t==="csv"&&va(s,`QIA_${e}`),t==="excel"&&ya(s,`QIA_${e}`,e),t==="json"&&La(s,`QIA_${e}`),i("Export berhasil!","success")}catch(s){i("Gagal export: "+s.message,"error")}},document.getElementById("btn-export-all").addEventListener("click",async()=>{i("Mengumpulkan semua data…","info");try{const e=await k.exportAllTables();ha(e,"QIA_DataLengkap"),i("Export berhasil!","success")}catch(e){i("Gagal: "+e.message,"error")}})}async function Ra(a,i){a.innerHTML=`<div class="page-header">
    <div class="page-title">Log <span>Aktivitas</span></div>
  </div>
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th><th>ID</th></tr></thead>
      <tbody id="activity-tbody"><tr><td colspan="5" style="text-align:center;padding:28px;"><div class="spinner" style="margin:0 auto;width:28px;height:28px;"></div></td></tr></tbody>
    </table>
  </div>`;try{const e=await k.getDashboardStats(),t=(e==null?void 0:e.aktivitas_terbaru)||[];document.getElementById("activity-tbody").innerHTML=t.length===0?'<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Belum ada log aktivitas.</td></tr>':t.map(n=>{var s;return`<tr>
        <td style="font-size:12px;">${Aa(n.created_at)}</td>
        <td style="font-size:12px;">${((s=n.id_user)==null?void 0:s.slice(0,8))||"system"}…</td>
        <td><span style="font-weight:600;">${n.action}</span></td>
        <td>${n.entity_type||"-"}</td>
        <td style="font-size:12px;">${n.entity_id||"-"}</td>
      </tr>`}).join("")}catch{i("Gagal memuat log.","error")}}function D(a,i,e){document.getElementById("admin-modal-title").textContent=a,document.getElementById("admin-modal-body").innerHTML=i;const t=document.getElementById("admin-modal-footer");e?(t.innerHTML=`
    <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" id="modal-save-btn"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>`,document.getElementById("modal-save-btn").addEventListener("click",e)):t.innerHTML='<button class="btn btn-ghost" onclick="closeModal()">Tutup</button>';const n=document.getElementById("admin-modal-inner");n.className=i.length>1500?"modal modal-lg":"modal",document.getElementById("admin-modal").classList.add("show")}function B(){document.getElementById("admin-modal").classList.remove("show")}window.closeModal=B;function _a(a){return`<span class="badge ${{bimbel:"badge-gold",privat:"badge-emerald",keduanya:"badge-blue"}[a]||"badge-gray"}">${a||"-"}</span>`}function ta(a){return a==="aktif"?'<span class="badge badge-emerald">● Aktif</span>':`<span class="badge badge-red">● ${a}</span>`}function Aa(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}let p={profile:null,kelasList:[],pesertaList:[],activeView:"dashboard",selectedKelas:null,selectedPeserta:null,absensiRows:[]};async function G(a,i,e){document.title="Portal Asatidz — Quran Insight Academy";try{if(p.profile=await j.getProfile(),!p.profile||p.profile.role!=="mentor"){ra(a,i,e);return}}catch{ra(a,i,e);return}a.innerHTML=Ta(),Qa(i,e),await Oa(e),P("dashboard",e)}function ra(a,i,e){var n,s;a.innerHTML=`
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
  </div>`,document.getElementById("mentor-login-form").addEventListener("submit",async l=>{l.preventDefault();const r=document.getElementById("mentor-login-email").value,o=document.getElementById("mentor-login-pwd").value,d=document.getElementById("btn-submit-mentor-login");d.disabled=!0,d.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{await j.login(r,o),e("Berhasil masuk sebagai Asatidz!","success"),G(a,i,e)}catch(c){e("Gagal masuk: "+c.message,"error"),d.disabled=!1,d.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Portal Asatidz'}}),(n=document.getElementById("btn-demo-bimbel"))==null||n.addEventListener("click",async()=>{e("Masuk sebagai Ust. Abdurrahman (Bimbel)…","info"),await j.login("mentor1@qia.id","demo123"),e("Selamat datang, Ust. Abdurrahman!","success"),G(a,i,e)}),(s=document.getElementById("btn-demo-privat"))==null||s.addEventListener("click",async()=>{e("Masuk sebagai Ust. Hasan (Privat)…","info"),await j.login("mentor3@qia.id","demo123"),e("Selamat datang, Ust. Hasan!","success"),G(a,i,e)})}function Ta(){return`
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
      <div class="nav-item" data-view="kelas" id="nav-kelas" style="${C()?"":"display:none"}">
        <i class="fa-solid fa-chalkboard-user"></i> Kelas Saya
      </div>
      <div class="nav-item" data-view="absensi-massal" id="nav-absensi" style="${C()?"":"display:none"}">
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
</div>`}function C(){var a,i;return((a=p.profile)==null?void 0:a.jenis_mentor)==="bimbel"||((i=p.profile)==null?void 0:i.jenis_mentor)==="keduanya"}function Qa(a,i){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.view;P(t,i)})}),document.getElementById("btn-logout").addEventListener("click",async()=>{await j.logout(),a("/")})}async function Oa(a){var i,e;try{const t=p.profile.id;p.kelasList=await E.getMyKelas(t),p.pesertaList=await E.getMyPeserta(t),document.getElementById("user-name").textContent=p.profile.nama||p.profile.email,document.getElementById("user-role-label").textContent=V(p.profile.jenis_mentor),document.getElementById("user-avatar").textContent=(p.profile.nama||"M").charAt(0),C()&&((i=document.getElementById("nav-kelas"))==null||i.removeAttribute("style"),(e=document.getElementById("nav-absensi"))==null||e.removeAttribute("style"))}catch(t){a("Gagal memuat data: "+t.message,"error")}}function Ua(a){document.querySelectorAll(".nav-item[data-view]").forEach(e=>e.classList.remove("active"));const i=document.getElementById("nav-"+a.replace("-list","santri").replace("-massal","absensi").replace("-detail","santri"));i&&i.classList.add("active")}function P(a,i){p.activeView=a,Ua(a);const e=document.getElementById("main-content");switch(a){case"dashboard":oa(e,i);break;case"kelas":Ga(e,i);break;case"absensi-massal":Wa(e,i);break;case"santri-list":Ya(e,i);break;case"ganti-password":Xa(e,i);break;default:oa(e,i)}document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}function oa(a,i){var n;const e=p.pesertaList.filter(s=>s.jenis==="bimbel").length,t=p.pesertaList.filter(s=>s.jenis==="privat").length;a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Mentor</span></div>
      <div class="page-breadcrumb">Selamat datang, ${((n=p.profile)==null?void 0:n.nama)||"—"}</div>
    </div>
    <div style="font-size:13px;color:var(--text-muted);">
      <i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
    </div>
  </div>

  <!-- Stats -->
  <div class="grid-4" style="margin-bottom:28px;">
    ${[[`${p.pesertaList.length}`,"Total Peserta Didik","fa-users","stat-icon-gold"],[e,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[t,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[`${p.kelasList.length}`,"Kelas Aktif","fa-door-open","stat-icon-blue"]].map(([s,l,r,o])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${o}"><i class="fa-solid ${r}" style="color:white;"></i></div>
      <div><div class="stat-value">${s}</div><div class="stat-label">${l}</div></div>
    </div>`).join("")}
  </div>

  <!-- Shortcut actions -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;">
    ${C()?`
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
    ${C()?`
    <button onclick="renderMentorView('kelas')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-chalkboard" style="font-size:24px;color:#10b981;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Kelas Saya</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">${p.kelasList.length} kelas aktif</div>
    </button>`:""}
  </div>

  <!-- Daftar santri ringkas -->
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h3 style="color:var(--cream-100);font-size:14px;">Peserta Didik Bimbingan Saya</h3>
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">Lihat Semua →</button>
    </div>
    ${p.pesertaList.length===0?'<p style="color:var(--text-card-muted);font-size:14px;">Belum ada peserta didik yang ditugaskan.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${p.pesertaList.slice(0,6).map(s=>{var l;return`
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
  </div>`,window.renderMentorView=s=>P(s,i),window.openSantriDetail=s=>$a(s,a,i)}function Ga(a,i){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Kelas <span>Saya</span></div>
      <div class="page-breadcrumb">${p.kelasList.length} kelas aktif yang Anda ampu</div>
    </div>
    <button onclick="renderMentorView('absensi-massal')" class="btn btn-primary">
      <i class="fa-solid fa-clipboard-list"></i> Absensi Massal
    </button>
  </div>
  <div class="grid-3">
    ${p.kelasList.length===0?'<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon"><span class="ms" style="font-size:40px;color:var(--gold-400);">school</span></div><h3>Belum ada kelas</h3><p>Anda belum memiliki kelas aktif.</p></div></div>':p.kelasList.map(e=>{const t=p.pesertaList.filter(n=>n.id_kelas===e.id);return`
        <div class="card anim-fadeInUp">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
            <div style="width:44px;height:44px;border-radius:12px;
              background:linear-gradient(135deg,var(--gold-600),var(--gold-400));
              display:flex;align-items:center;justify-content:center;">
              <span class="ms" style="font-size:22px;color:#221104;">school</span>
            </div>
            <span class="badge badge-gold">${t.length} peserta didik</span>
          </div>
          <h3 style="color:var(--cream-100);font-size:15px;margin-bottom:6px;">${e.nama_kelas}</h3>
          <p style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">${e.deskripsi||"Tidak ada deskripsi"}</p>
          ${e.hari_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:6px;">
            <i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${e.hari_jadwal}</div>`:""}
          ${e.jam_jadwal?`<div style="font-size:12px;color:var(--text-card-muted);margin-bottom:14px;">
            <i class="fa-solid fa-clock" style="color:#F0AF43;"></i> ${e.jam_jadwal}</div>`:""}
          <div style="display:flex;flex-direction:column;gap:6px;max-height:120px;overflow-y:auto;">
            ${t.map(n=>`
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
  </div>`,window.renderMentorView=e=>P(e,i),window.openAbsensiMassal=e=>{p.selectedKelas=p.kelasList.find(t=>t.id===e)||null,P("absensi-massal",i)}}function Wa(a,i){var t;const e=new Date().toISOString().slice(0,10);a.innerHTML=`
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
          ${p.kelasList.map(n=>{var s;return`<option value="${n.id}" ${((s=p.selectedKelas)==null?void 0:s.id)===n.id?"selected":""}>${n.nama_kelas}</option>`}).join("")}
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
  </div>`,document.getElementById("btn-load-absensi").addEventListener("click",()=>{const n=parseInt(document.getElementById("absensi-kelas-select").value);if(!n){i("Pilih kelas terlebih dahulu.","info");return}p.selectedKelas=p.kelasList.find(l=>l.id===n);const s=p.pesertaList.filter(l=>l.id_kelas===n);if(s.length===0){i("Tidak ada peserta didik di kelas ini.","info");return}p.absensiRows=s.map(l=>({id_peserta:l.id,nama:l.nama_lengkap,status_hadir:"hadir",perkembangan_materi:"",catatan:""})),Ja(s)}),(t=document.getElementById("btn-simpan-absensi"))==null||t.addEventListener("click",()=>Va(i)),window.setAllStatus=n=>{p.absensiRows.forEach(s=>s.status_hadir=n),document.querySelectorAll(".status-select").forEach(s=>{s.value=n,updateRowStyle(s)})},window.renderMentorView=n=>P(n,i)}function Ja(a){const i=document.getElementById("absensi-table-wrapper"),e=document.getElementById("absensi-tbody");i.style.display="block",document.getElementById("absensi-count-label").textContent=`${a.length} peserta didik dalam kelas`,e.innerHTML=p.absensiRows.map((t,n)=>`
  <tr id="absensi-row-${n}" style="border-bottom:1px solid rgba(240,175,67,0.15);${n%2===1?"background:rgba(255,255,255,0.03);":""}">
    <td style="padding:10px 16px;color:#F0AF43;font-weight:700;">${n+1}</td>
    <td style="padding:10px 16px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;
          background:linear-gradient(135deg,#d97706,#F0AF43);flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;color:#1a0a02;">${t.nama.charAt(0)}</div>
        <span style="font-weight:600;color:#ffffff;font-size:14px;letter-spacing:0.2px;">${t.nama}</span>
      </div>
    </td>
    <td style="padding:10px 16px;text-align:center;">
      <select class="status-select form-control-light" data-idx="${n}"
        style="width:130px;text-align:center;font-weight:600;"
        onchange="updateAbsensiStatus(this)">
        <option value="hadir"  ${t.status_hadir==="hadir"?"selected":""} style="color:#059669;">✅ Hadir</option>
        <option value="izin"   ${t.status_hadir==="izin"?"selected":""} style="color:#d97706;">📝 Izin</option>
        <option value="sakit"  ${t.status_hadir==="sakit"?"selected":""} style="color:#3b82f6;">🤒 Sakit</option>
        <option value="alpa"   ${t.status_hadir==="alpa"?"selected":""} style="color:#dc2626;">❌ Alpa</option>
      </select>
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light perkembangan-input" data-idx="${n}"
        value="${t.perkembangan_materi}"
        placeholder="Perkembangan materi peserta didik ini…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'perkembangan_materi')" />
    </td>
    <td style="padding:10px 16px;">
      <input type="text" class="form-control-light catatan-input" data-idx="${n}"
        value="${t.catatan}"
        placeholder="Catatan khusus…"
        style="font-size:12.5px;"
        onchange="updateAbsensiField(this,'catatan')" />
    </td>
  </tr>`).join(""),window.updateAbsensiStatus=t=>{const n=parseInt(t.dataset.idx);p.absensiRows[n].status_hadir=t.value,updateRowStyle(t)},window.updateAbsensiField=(t,n)=>{const s=parseInt(t.dataset.idx);p.absensiRows[s][n]=t.value},window.updateRowStyle=t=>{const n={hadir:"rgba(16,185,129,0.08)",izin:"rgba(240,175,67,0.08)",sakit:"rgba(59,130,246,0.08)",alpa:"rgba(239,68,68,0.08)"},s=parseInt(t.dataset.idx),l=document.getElementById("absensi-row-"+s);l&&(l.style.background=n[t.value]||"")}}async function Va(a){var r,o,d,c,u,h;const i=(r=p.selectedKelas)==null?void 0:r.id,e=(o=document.getElementById("absensi-tanggal"))==null?void 0:o.value,t=(c=(d=document.getElementById("absensi-materi"))==null?void 0:d.value)==null?void 0:c.trim(),n=(h=(u=document.getElementById("absensi-catatan"))==null?void 0:u.value)==null?void 0:h.trim();if(!i||!e){a("Pilih kelas dan tanggal.","info");return}if(p.absensiRows.length===0){a("Muat daftar peserta didik terlebih dahulu.","info");return}const s=document.getElementById("btn-simpan-absensi");s.disabled=!0,s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';const l=p.absensiRows.map(b=>({id_peserta:b.id_peserta,id_mentor:p.profile.id,id_kelas:i,tanggal:e,status_hadir:b.status_hadir,materi_pembahasan:t||null,perkembangan_materi:b.perkembangan_materi||null,catatan_sesi:n||null||b.catatan||null}));try{await E.bulkSimpanAbsensi(l),a(`Absensi ${l.length} peserta didik berhasil disimpan! ✅`,"success"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}catch(b){a("Gagal menyimpan: "+b.message,"error"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}}function Ya(a,i){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Daftar <span>Peserta Didik</span></div>
      <div class="page-breadcrumb">${p.pesertaList.length} peserta didik bimbingan Anda</div>
    </div>
    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass search-icon" style="color:var(--brown-400);"></i>
      <input type="text" id="santri-search" placeholder="Cari nama peserta didik…"
        class="form-control-light search-input" style="min-width:240px;" />
    </div>
  </div>

  <!-- Kelas filter tabs (bimbel only) -->
  ${C()&&p.kelasList.length>0?`
  <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
    <button class="btn btn-primary btn-sm active-kelas-tab" data-kelas-filter="all" onclick="filterByKelas('all',this)">Semua</button>
    ${p.kelasList.map(e=>`<button class="btn btn-ghost btn-sm" data-kelas-filter="${e.id}" onclick="filterByKelas('${e.id}',this)">${e.nama_kelas}</button>`).join("")}
    <button class="btn btn-ghost btn-sm" data-kelas-filter="privat" onclick="filterByKelas('privat',this)">Privat</button>
  </div>`:""}

  <div id="santri-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>`,window.currentKelasFilter="all",window.filterByKelas=(e,t)=>{var n;document.querySelectorAll("[data-kelas-filter]").forEach(s=>{s.classList.remove("btn-primary"),s.classList.add("btn-ghost")}),t.classList.remove("btn-ghost"),t.classList.add("btn-primary"),window.currentKelasFilter=e,Y(da(((n=document.getElementById("santri-search"))==null?void 0:n.value)||"",e))},window.openSantriDetail=e=>$a(e,a,i),window.renderMentorView=e=>P(e,i),document.getElementById("santri-search").addEventListener("input",e=>{Y(da(e.target.value,window.currentKelasFilter||"all"))}),Y(p.pesertaList)}function da(a,i){return p.pesertaList.filter(e=>{const t=!a||e.nama_lengkap.toLowerCase().includes(a.toLowerCase());return i==="all"?t:i==="privat"?t&&e.jenis==="privat":t&&String(e.id_kelas)===String(i)})}function Y(a,i){const e=document.getElementById("santri-grid");if(e){if(a.length===0){e.innerHTML=`<div style="grid-column:1/-1"><div class="empty-state">
      <div class="empty-state-icon">🔍</div><h3>Tidak ada peserta didik ditemukan</h3></div></div>`;return}e.innerHTML=a.map(t=>{var n;return`
  <div class="card" style="cursor:pointer;padding:18px 20px;"
    onclick="openSantriDetail(${t.id})"
    onmouseover="this.style.borderColor='rgba(240,175,67,0.5)'" onmouseout="this.style.borderColor='var(--border-dark)'">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
      <div style="width:44px;height:44px;border-radius:50%;
        background:linear-gradient(135deg,var(--brown-600),var(--brown-300));
        display:flex;align-items:center;justify-content:center;
        font-size:18px;font-weight:700;color:#fdf0e2;flex-shrink:0;">${t.nama_lengkap.charAt(0)}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;color:var(--cream-100);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.nama_lengkap}</div>
        <div style="font-size:11.5px;color:var(--text-card-muted);">${((n=t.kelas)==null?void 0:n.nama_kelas)||V(t.jenis)}</div>
      </div>
      <span class="${t.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${t.jenis}</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="event.stopPropagation();openSantriDetail(${t.id})" class="btn btn-secondary btn-sm" style="flex:1;">
        <i class="fa-solid fa-eye"></i> Detail
      </button>
    </div>
  </div>`}).join("")}}function $a(a,i,e){var n;const t=p.pesertaList.find(s=>s.id===a);t&&(p.selectedPeserta=t,i.innerHTML=`
  <div class="page-header">
    <div style="display:flex;align-items:center;gap:12px;">
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div>
        <div class="page-title">${t.nama_lengkap}</div>
        <div class="page-breadcrumb">${((n=t.kelas)==null?void 0:n.nama_kelas)||V(t.jenis)}</div>
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
  </div>`,window.renderMentorView=s=>P(s,e),H(a),document.getElementById("btn-save-kemajuan").addEventListener("click",async()=>{const s={id_peserta:a,id_mentor:p.profile.id,tanggal:document.getElementById("inp-tgl-kemajuan").value,kitab_surat:document.getElementById("inp-kitab").value.trim(),halaman_ayat:document.getElementById("inp-halaman").value.trim(),status_kelancaran:document.getElementById("inp-kelancaran").value,catatan_hafalan:document.getElementById("inp-catatan-hafalan").value.trim()};if(!s.kitab_surat){e("Isi kitab/surah terlebih dahulu.","info");return}try{await E.addKemajuan(s),e("Kemajuan hafalan tersimpan! ✅","success"),document.getElementById("inp-kitab").value="",document.getElementById("inp-halaman").value="",document.getElementById("inp-catatan-hafalan").value="",H(a,e)}catch(l){e("Gagal: "+l.message,"error")}}),document.getElementById("btn-save-nilai").addEventListener("click",async()=>{const s=parseFloat(document.getElementById("inp-nilai").value);if(isNaN(s)){e("Isi nilai angka.","info");return}try{await E.addPenilaian({id_peserta:a,id_mentor:p.profile.id,tanggal:document.getElementById("inp-tgl-nilai").value,nilai_angka:s,nilai_adab:parseInt(document.getElementById("inp-adab").value)||null,nilai_tajwid:parseInt(document.getElementById("inp-tajwid").value)||null,nilai_kelancaran:parseInt(document.getElementById("inp-kelancaran-nilai").value)||null,catatan:document.getElementById("inp-catatan-nilai").value.trim()}),e("Penilaian tersimpan! ✅","success"),document.getElementById("inp-nilai").value="",H(a,e)}catch(l){e("Gagal: "+l.message,"error")}}),document.getElementById("btn-save-catatan").addEventListener("click",async()=>{const s=document.getElementById("inp-catatan").value.trim();if(!s){e("Tulis catatan terlebih dahulu.","info");return}try{await E.addCatatan({id_peserta:a,id_mentor:p.profile.id,isi_catatan:s}),e("Catatan tersimpan! ✅","success"),document.getElementById("inp-catatan").value="",H(a,e)}catch(l){e("Gagal: "+l.message,"error")}}))}async function H(a,i){const e=document.getElementById("history-panel");if(e)try{const[t,n,s,l]=await Promise.all([E.getKemajuan(a,8),E.getPenilaian(a,8),E.getCatatan(a),E.getRiwayatKehadiran(a,10)]);e.innerHTML=`
    <h4 style="color:var(--cream-100);margin-bottom:14px;"><i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i> Riwayat Peserta Didik</h4>

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Hafalan Terakhir</div>
    ${t.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin-bottom:12px;">Belum ada catatan</p>':t.slice(0,4).map(r=>`
      <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;">
        <div style="font-size:12.5px;color:var(--cream-100);font-weight:600;">${r.kitab_surat} — ${r.halaman_ayat||""}</div>
        <div style="font-size:11px;color:var(--text-card-muted);margin-top:2px;">${X(r.tanggal)} • ${Za(r.status_kelancaran)}</div>
      </div>`).join("")}

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px;">Penilaian Terakhir</div>
    ${n.length===0?'<p style="font-size:12px;color:var(--text-card-muted);margin-bottom:12px;">Belum ada penilaian</p>':n.slice(0,4).map(r=>`
      <div style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:13px;color:var(--cream-100);font-weight:700;">${r.nilai_angka}</div>
          <div style="font-size:11px;color:var(--text-card-muted);">${X(r.tanggal)}</div>
        </div>
        <div style="font-size:11px;color:var(--text-card-muted);text-align:right;">
          Adab ${r.nilai_adab||"-"} • Tajwid ${r.nilai_tajwid||"-"} • Lancar ${r.nilai_kelancaran||"-"}
        </div>
      </div>`).join("")}

    <div style="font-size:12px;font-weight:700;color:var(--brown-300);text-transform:uppercase;letter-spacing:0.5px;margin:12px 0 8px;">Riwayat Absensi</div>
    ${l.length===0?'<p style="font-size:12px;color:var(--text-card-muted);">Belum ada absensi</p>':l.slice(0,6).map(r=>`
      <div style="padding:7px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:5px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
          <span style="font-size:12px;font-weight:700;color:${ae(r.status_hadir)};">${ee(r.status_hadir)} ${r.status_hadir}</span>
          <span style="font-size:11px;color:var(--text-card-muted);">${X(r.tanggal)}</span>
        </div>
        ${r.materi_pembahasan?`<div style="font-size:11px;color:var(--text-card-muted);">📚 ${r.materi_pembahasan}</div>`:""}
        ${r.perkembangan_materi?`<div style="font-size:11px;color:var(--text-card-muted);font-style:italic;">${r.perkembangan_materi}</div>`:""}
      </div>`).join("")}`}catch{e&&(e.innerHTML='<p style="color:#e05c4b;font-size:13px;">Gagal memuat riwayat.</p>')}}function Xa(a,i){a.innerHTML=`
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
  </div>`,document.getElementById("btn-ganti-pw").addEventListener("click",async()=>{const e=document.getElementById("inp-new-pw").value,t=document.getElementById("inp-confirm-pw").value;if(!e||e.length<8){i("Password minimal 8 karakter.","info");return}if(e!==t){i("Konfirmasi password tidak cocok.","error");return}try{await E.updatePassword(e),i("Password berhasil diubah! ✅","success"),document.getElementById("inp-new-pw").value="",document.getElementById("inp-confirm-pw").value=""}catch(n){i("Gagal: "+n.message,"error")}})}function V(a){return a==="bimbel"?"Bimbel Kelompok":a==="privat"?"Privat":a||"-"}function Za(a){return a==="lancar"?'<span class="ms" style="font-size:15px;color:#10b981;vertical-align:middle;">check_circle</span> Lancar':a==="cukup"?'<span class="ms" style="font-size:15px;color:#F0AF43;vertical-align:middle;">help</span> Cukup':'<span class="ms" style="font-size:15px;color:#ef4444;vertical-align:middle;">replay</span> Perlu Diulang'}function ae(a){return a==="hadir"?"#10b981":a==="izin"?"#F0AF43":a==="sakit"?"#60a5fa":"#e05c4b"}function ee(a){return a==="hadir"?'<span class="ms" style="font-size:15px;color:#10b981;">check_circle</span>':a==="izin"?'<span class="ms" style="font-size:15px;color:#F0AF43;">description</span>':a==="sakit"?'<span class="ms" style="font-size:15px;color:#60a5fa;">sick</span>':'<span class="ms" style="font-size:15px;color:#ef4444;">cancel</span>'}function X(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function ca(a,i,e){document.title="Portal Wali — Quran Insight Academy",a.innerHTML=te(),ie(i,e)}function te(){return`
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
`}function ie(a,i){window.navigateTo=o=>a(o);const e=document.getElementById("wali-search-input"),t=document.getElementById("wali-search-btn"),n=document.getElementById("wali-guide"),s=document.getElementById("wali-loading"),l=document.getElementById("wali-content");document.getElementById("detail-modal-close").addEventListener("click",()=>{document.getElementById("detail-modal").classList.remove("show")}),document.getElementById("detail-modal").addEventListener("click",function(o){o.target===this&&this.classList.remove("show")});async function r(){const o=e.value.trim();if(!o||o.length<2){i("Masukkan minimal 2 huruf nama peserta didik.","info"),e.focus();return}n.style.display="none",s.style.display="block",l.style.display="none",l.innerHTML="";try{const d=await R.searchPeserta(o);if(s.style.display="none",l.style.display="block",!d||d.length===0){l.innerHTML=`
          <div style="text-align:center;padding:48px;">
            <div style="font-size:52px;margin-bottom:16px;opacity:0.4;">🔍</div>
            <h3 style="color:#4F280C;">Peserta didik tidak ditemukan</h3>
            <p style="color:#81511D;font-size:14px;margin-top:8px;">
              Tidak ada peserta didik aktif dengan nama "<strong>${o}</strong>". Pastikan ejaan sudah benar.
            </p>
          </div>`;return}ne(d,i)}catch(d){s.style.display="none",l.style.display="block",l.innerHTML=`<div style="text-align:center;padding:48px;color:#e05c4b;">
        <i class="fa-solid fa-circle-exclamation" style="font-size:36px;margin-bottom:12px;"></i>
        <p>Gagal memuat data: ${d.message}</p></div>`,i("Gagal memuat data. Periksa koneksi Anda.","error")}}t.addEventListener("click",r),e.addEventListener("keydown",o=>{o.key==="Enter"&&r()}),window.openDetailWali=async function(o){var d;document.getElementById("detail-modal").classList.add("show"),document.getElementById("detail-modal-title").textContent="Memuat detail…",document.getElementById("detail-modal-body").innerHTML=`
      <div style="text-align:center;padding:48px;">
        <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
          border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div>
      </div>`;try{const c=await R.getPesertaDetail(o);if(!c){i("Data tidak ditemukan","error");return}document.getElementById("detail-modal-title").textContent=`Profil — ${((d=c.peserta)==null?void 0:d.nama_lengkap)||""}`,document.getElementById("detail-modal-body").innerHTML=le(c),await re(o,c)}catch(c){i("Gagal memuat detail: "+c.message,"error")}},window.printRapor=async function(o,d){try{const c=await R.getPesertaDetail(o);c&&Pa(c)}catch(c){i("Gagal mencetak rapor: "+c.message,"error")}}}function ne(a,i){const e=document.getElementById("wali-content"),t=a.length;e.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
      <h3 style="color:#1a0a02;font-size:1rem;font-weight:700;">
        <i class="fa-solid fa-users" style="color:#F0AF43;"></i> &nbsp;${t} Peserta Didik Ditemukan
      </h3>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${a.map(n=>se(n)).join("")}
    </div>`}function se(a){const i=a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa>0?Math.round(a.total_hadir/(a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa)*100):0,e=a.nama_kelas||(a.jenis==="privat"?"Program Privat":"-"),t=a.kitab_surat_terakhir?`${a.kitab_surat_terakhir}${a.halaman_ayat_terakhir?" — "+a.halaman_ayat_terakhir:""}`:"Belum ada catatan";return`
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
          <div style="font-size:22px;font-weight:800;color:${i>=80?"#10b981":i>=60?"#F0AF43":"#e05c4b"};">
            ${i}%
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
        <strong style="color:#4F280C;">Hafalan Terakhir:</strong> ${t}
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
  </div>`}function le(a){var x;const{peserta:i,mentor:e,kelas:t,kemajuan:n,penilaian:s,kehadiran_summary:l,riwayat_kehadiran:r,catatan_mentor:o}=a,d=l||{},c=(d.hadir||0)+(d.izin||0)+(d.sakit||0)+(d.alpa||0),u=c>0?Math.round(d.hadir/c*100):0,h=(s||[]).length>0?(s.reduce((v,I)=>v+(I.nilai_angka||0),0)/s.length).toFixed(1):"-",b=(t==null?void 0:t.nama_kelas)||((i==null?void 0:i.jenis)==="privat"?"Program Privat":"-");return`
  <div style="padding:4px 0;color:#1a0a02;">
    <!-- Profile Header -->
    <div style="background:linear-gradient(135deg,#221104,#3a1c08);border-radius:16px;padding:24px;margin-bottom:20px;
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div style="width:64px;height:64px;border-radius:50%;flex-shrink:0;
        background:linear-gradient(135deg,#4F280C,#D4934E);
        display:flex;align-items:center;justify-content:center;
        font-size:26px;font-weight:700;color:#fdf0e2;">
        ${((x=i==null?void 0:i.nama_lengkap)==null?void 0:x.charAt(0))||"?"}
      </div>
      <div style="flex:1;">
        <h2 style="color:#fdf0e2;font-size:1.2rem;margin-bottom:6px;">${(i==null?void 0:i.nama_lengkap)||"-"}</h2>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-person" style="color:#F0AF43;"></i> ${i!=null&&i.usia?i.usia+" tahun":"-"}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-layer-group" style="color:#F0AF43;"></i> ${b}</span>
          <span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-user-tie" style="color:#F0AF43;"></i> ${(e==null?void 0:e.nama)||"Belum ditentukan"}</span>
          ${t!=null&&t.hari_jadwal?`<span style="font-size:12px;color:#c9a87a;"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${t.hari_jadwal} ${t.jam_jadwal||""}</span>`:""}
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button onclick="printRapor(${i==null?void 0:i.id},'${i==null?void 0:i.nama_lengkap}')"
          style="padding:9px 16px;border-radius:10px;border:1px solid rgba(240,175,67,0.3);
          background:rgba(240,175,67,0.12);color:#F0AF43;font-size:13px;font-weight:600;cursor:pointer;
          transition:all 0.2s;" onmouseover="this.style.background='rgba(240,175,67,0.22)'" onmouseout="this.style.background='rgba(240,175,67,0.12)'">
          <i class="fa-solid fa-print"></i> Cetak Rapor
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">
      ${[[h,"Rata Nilai",Ea(parseFloat(h)),"fa-star"],[u+"%","Kehadiran",u>=80?"#10b981":u>=60?"#F0AF43":"#e05c4b","fa-calendar-check"],[d.hadir||0,"Total Hadir","#10b981","fa-circle-check"],[(d.izin||0)+(d.sakit||0),"Izin/Sakit","#60a5fa","fa-memo-circle-info"],[d.alpa||0,"Alpa","#e05c4b","fa-circle-exclamation"],[(s||[]).length,"Total Penilaian","#F0AF43","fa-clipboard-check"]].map(([v,I,K,w])=>`
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:14px 16px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:${K};margin-bottom:4px;">${v}</div>
        <div style="font-size:11px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">${I}</div>
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
          ${(n||[]).slice(0,10).map((v,I)=>`
          <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;
            border-bottom:${I<n.length-1?"1px solid rgba(129,81,29,0.1)":"none"};">
            <div style="width:32px;height:32px;border-radius:50%;
              background:${v.status_kelancaran==="lancar"?"rgba(16,185,129,0.15)":v.status_kelancaran==="cukup"?"rgba(240,175,67,0.15)":"rgba(239,68,68,0.15)"};
              display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="ms" style="font-size:18px;color:${v.status_kelancaran==="lancar"?"#10b981":v.status_kelancaran==="cukup"?"#F0AF43":"#ef4444"};">
                ${v.status_kelancaran==="lancar"?"check_circle":v.status_kelancaran==="cukup"?"help":"replay"}
              </span>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;color:#1a0a02;font-size:13.5px;">
                ${v.kitab_surat} ${v.halaman_ayat?"— "+v.halaman_ayat:""}
              </div>
              ${v.catatan_hafalan?`<div style="font-size:12px;color:#81511D;margin-top:2px;font-style:italic;">"${v.catatan_hafalan}"</div>`:""}
            </div>
            <div style="font-size:11px;color:#81511D;white-space:nowrap;">${Z(v.tanggal)}</div>
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
              ${(r||[]).slice(0,20).map((v,I)=>`
              <tr style="border-bottom:1px solid rgba(129,81,29,0.07);${I%2===1?"background:#fdf8f3;":""}">
                <td style="padding:9px 12px;color:#1a0a02;">${Z(v.tanggal)}</td>
                <td style="padding:9px 12px;">${oe(v.status_hadir)}</td>
                <td style="padding:9px 12px;color:#4F280C;">${v.materi_pembahasan||"-"}</td>
                <td style="padding:9px 12px;color:#81511D;font-size:12px;font-style:italic;">${v.catatan_sesi||v.perkembangan_materi||"-"}</td>
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
        ${(o||[]).slice(0,5).map(v=>`
        <div style="background:#f8f4ee;border-left:3px solid #F0AF43;border-radius:0 10px 10px 0;padding:12px 16px;">
          <div style="font-size:11px;color:#81511D;margin-bottom:4px;">${Z(v.tanggal)}</div>
          <div style="font-size:13.5px;color:#1a0a02;line-height:1.7;">${v.isi_catatan}</div>
        </div>`).join("")}
      </div>
    </div>`:""}
  </div>`}async function re(a,i){try{const t=((await R.getChartDataPeserta(a)).penilaian||[]).slice(-12);t.length>0&&document.getElementById("chart-nilai")&&new Chart(document.getElementById("chart-nilai"),{type:"line",data:{labels:t.map(s=>de(s.tanggal)),datasets:[{label:"Nilai",data:t.map(s=>s.nilai_angka),borderColor:"#F0AF43",backgroundColor:"rgba(240,175,67,0.15)",tension:.4,fill:!0,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{min:0,max:100,grid:{color:"rgba(0,0,0,0.05)"}},x:{grid:{display:!1}}}}});const n=i.kehadiran_summary||{};document.getElementById("chart-kehadiran")&&new Chart(document.getElementById("chart-kehadiran"),{type:"doughnut",data:{labels:["Hadir","Izin","Sakit","Alpa"],datasets:[{data:[n.hadir||0,n.izin||0,n.sakit||0,n.alpa||0],backgroundColor:["#10b981","#F0AF43","#60a5fa","#e05c4b"]}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{boxWidth:12,padding:12,font:{size:12}}}}}})}catch{}}function Ea(a){return a=parseFloat(a),isNaN(a)?"#81511D":a>=80?"#10b981":a>=65?"#F0AF43":"#e05c4b"}function oe(a){const i={hadir:["check_circle","#10b981","rgba(16,185,129,0.12)","Hadir"],izin:["description","#F0AF43","rgba(240,175,67,0.12)","Izin"],sakit:["sick","#60a5fa","rgba(59,130,246,0.12)","Sakit"],alpa:["cancel","#e05c4b","rgba(239,68,68,0.12)","Alpa"]},[e,t,n,s]=i[a]||["help","#81511D","rgba(0,0,0,0.06)",a];return`<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
    border-radius:20px;background:${n};color:${t};font-size:12px;font-weight:600;">
    <span class="ms" style="font-size:15px;">${e}</span> ${s}</span>`}function Z(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function de(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short"}):"-"}function pa(a,i="info",e=3500){const t=document.getElementById("toast-container");if(!t)return;const n={success:"fa-circle-check",error:"fa-circle-xmark",info:"fa-circle-info"},s=document.createElement("div");s.className=`toast toast-${i}`,s.innerHTML=`<i class="fa-solid ${n[i]||"fa-circle-info"} toast-icon"></i> ${a}`,t.appendChild(s),requestAnimationFrame(()=>{requestAnimationFrame(()=>{s.classList.add("show")})}),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),350)},e)}const ma={"/":{render:ba},"/admin":{render:aa},"/mentor":{render:G},"/wali":{render:ca},"/portal-wali":{render:ca}};async function L(a,i=!0){const e=(a||"/").replace(/\/$/,"")||"/";i&&history.pushState({},"",e);const t=document.getElementById("app");if(!t)return;const n=ma[e]||ma["/"];t.style.opacity="0.7",t.style.transition="opacity 0.15s ease",await new Promise(s=>setTimeout(s,60)),t.innerHTML="",t.style.opacity="1";try{await n.render(t,L,pa)}catch(s){console.error("Render error on route",e,s),pa("Terjadi kesalahan saat memuat halaman: "+s.message,"error")}}window.navigate=L;window.navigateTo=L;document.addEventListener("click",a=>{const i=a.target.closest("[data-link]");if(i){a.preventDefault();const e=i.getAttribute("href")||i.dataset.link;e&&L(e)}});window.addEventListener("popstate",()=>{L(window.location.pathname,!1)});(async()=>{try{const a=document.getElementById("initial-loader");a&&(a.style.opacity="0",setTimeout(()=>{a.parentNode&&a.remove()},200)),j.onAuthStateChange(i=>{if(i==="SIGNED_OUT"){const e=window.location.pathname;(e==="/admin"||e==="/mentor")&&L("/")}}),await L(window.location.pathname,!1)}catch(a){console.error("Fatal boot error:",a);const i=document.getElementById("initial-loader");i&&i.remove();const e=document.getElementById("app");e&&!e.innerHTML.trim()&&ba(e,L)}})();
