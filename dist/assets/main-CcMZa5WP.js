import{c as Ua}from"./vendor-Dx0atVpp.js";import{u as oa,w as Va}from"./xlsx-DrgRuPKf.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();const Ya="https://wawamhpdthlttfttwjyc.supabase.co",ue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd2FtaHBkdGhsdHRmdHR3anljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjE4MzYsImV4cCI6MjEwNTE5NzgzNn0.zx35_sMK7z4CSw6b9OXzkFwpp3AsnVO1hOjQa42lAtg",fe="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd2FtaHBkdGhsdHRmdHR3anljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTYyMTgzNiwiZXhwIjoyMTA1MTk3ODM2fQ.Y0YJb_boBNxiefIhyrD8Nss5EtaGW5o8KLCPnRjb16s",be=!0,h=Ua(Ya,ue,{auth:{persistSession:!0,autoRefreshToken:!0}}),Ca=Ua(Ya,fe,{auth:{persistSession:!1,autoRefreshToken:!1}}),na=[{id:"admin-prod",nama:"Administrator QIA",email:"portalqia@gmail.com",role:"admin",jenis_mentor:null,no_hp:"",status:"aktif"}],aa=[],la=[],fa=[],ba=[],xa=[];function j(a,t){try{const e=localStorage.getItem("qia_mock_"+a);if(e)return JSON.parse(e)}catch{}return t}function ya(a,t){try{localStorage.setItem("qia_mock_"+a,JSON.stringify(t))}catch{}}const ia={async login(a,t){const{data:e,error:i}=await h.auth.signInWithPassword({email:a,password:t});if(i)throw i;return e},async logout(){localStorage.removeItem("qia_demo_session");try{await h.auth.signOut()}catch{}},async getSession(){try{const{data:{session:a}}=await h.auth.getSession();return a||null}catch{return null}},async getProfile(){var t;const a=await this.getSession();if(!((t=a==null?void 0:a.user)!=null&&t.id))return null;try{const{data:e,error:i}=await h.from("profiles").select("*").eq("id",a.user.id).single();if(!i&&e)return e}catch{}return null},onAuthStateChange(a){return h.auth.onAuthStateChange(a)}},P={async getDashboardStats(){try{const{data:c,error:u}=await h.rpc("get_admin_dashboard_stats");if(!u&&c)return{...c,total_santri_aktif:c.total_peserta,total_santri_bimbel:c.total_bimbel,total_santri_privat:c.total_privat,total_mentor_aktif:c.total_mentor,total_kelas_aktif:c.total_kelas}}catch{}const a=await this.getPesertaDidik(),t=await this.getMentors(),e=await this.getKelas(),i=a.filter(c=>c.status==="aktif").length,n=a.filter(c=>c.jenis==="bimbel"&&c.status==="aktif").length,s=a.filter(c=>c.jenis==="privat"&&c.status==="aktif").length,l=t.filter(c=>c.status==="aktif").length,r=e.filter(c=>c.status==="aktif").length;return{total_peserta:i,total_bimbel:n,total_privat:s,total_mentor:l,total_kelas:r,hadir_hari_ini:0,absensi_hari_ini:0,rata_nilai_bulan_ini:0,aktivitas_terbaru:[],total_santri_aktif:i,total_santri_bimbel:n,total_santri_privat:s,total_mentor_aktif:l,total_kelas_aktif:r,persentase_kehadiran_bulan_ini:100}},async getMentors(a={}){try{let e=h.from("profiles").select("*").eq("role","mentor").order("nama");a.status&&(e=e.eq("status",a.status)),a.jenis&&(e=e.eq("jenis_mentor",a.jenis));const{data:i,error:n}=await e;if(!n&&i)return i}catch{}const t=j("profiles",na).filter(e=>e.role==="mentor");return a.jenis?t.filter(e=>e.jenis_mentor===a.jenis||e.jenis_mentor==="keduanya"):t},async createMentor(a,t,e){const{data:i,error:n}=await h.auth.signUp({email:a,password:t,options:{data:{nama:e.nama,role:"mentor"}}});if(n)throw new Error("Gagal membuat akun: "+n.message);if(!(i!=null&&i.user))throw new Error("Gagal membuat akun mentor.");const s=i.user.id,{data:l,error:r}=await h.from("profiles").upsert({id:s,email:a,...e,role:"mentor",status:"aktif"}).select().single();if(r)throw new Error("Gagal menyimpan profil mentor: "+r.message);return l},async updateMentor(a,t){const{data:e,error:i}=await h.from("profiles").update(t).eq("id",a).select().single();if(i)throw new Error("Gagal update mentor: "+i.message);return e},async resetMentorPassword(a,t){if(!Ca)throw new Error("Service role key belum dikonfigurasi. Tambahkan VITE_SUPABASE_SERVICE_ROLE_KEY di file .env");const{data:e,error:i}=await Ca.auth.admin.updateUserById(a,{password:t});if(i)throw new Error("Gagal mengubah password: "+i.message);return e},async getKelas(a={}){try{let i=h.from("kelas").select("*, mentor:profiles(id, nama, email, jenis_mentor)").order("nama_kelas");a.status&&(i=i.eq("status",a.status)),a.id_mentor&&(i=i.eq("id_mentor",a.id_mentor));const{data:n,error:s}=await i;if(!s&&n)return n}catch{}const t=j("kelas",aa),e=j("profiles",na);return t.map(i=>({...i,mentor:e.find(n=>n.id===i.id_mentor)||{nama:"Asatidz"}}))},async createKelas(a){const{data:t,error:e}=await h.from("kelas").insert(a).select().single();if(e)throw new Error("Gagal membuat kelas: "+e.message);return t},async updateKelas(a,t){const{data:e,error:i}=await h.from("kelas").update(t).eq("id",a).select().single();if(i)throw new Error("Gagal update kelas: "+i.message);return e},async deleteKelas(a){const{error:t}=await h.from("kelas").delete().eq("id",a);if(t)throw new Error("Gagal hapus kelas: "+t.message)},async getPesertaDidik(a={}){try{let n=h.from("peserta_didik").select("*, mentor:profiles(id, nama), kelas(id, nama_kelas)").order("nama_lengkap");a.jenis&&(n=n.eq("jenis",a.jenis)),a.id_kelas&&(n=n.eq("id_kelas",a.id_kelas)),a.id_mentor&&(n=n.eq("id_mentor",a.id_mentor)),a.status&&(n=n.eq("status",a.status));const{data:s,error:l}=await n;if(!l&&s)return s}catch{}const t=j("peserta",la),e=j("kelas",aa),i=j("profiles",na);return t.map(n=>({...n,kelas:e.find(s=>s.id===n.id_kelas)||null,mentor:i.find(s=>s.id===n.id_mentor)||null}))},async createPeserta(a){const{data:t,error:e}=await h.from("peserta_didik").insert(a).select().single();if(e)throw new Error("Gagal mendaftarkan peserta: "+e.message);return t},async updatePeserta(a,t){const{data:e,error:i}=await h.from("peserta_didik").update(t).eq("id",a).select().single();if(i)throw new Error("Gagal update peserta: "+i.message);return e},async bulkUpdatePeserta(a){const{error:t}=await h.from("peserta_didik").upsert(a);if(t)throw new Error("Gagal simpan massal: "+t.message)},async deletePeserta(a){{const{error:t}=await h.from("peserta_didik").delete().eq("id",a);if(t)throw new Error("Gagal menghapus peserta: "+t.message);return!0}},async getPesertaDetail(a){const t=Number(a);try{const[e,i,n,s]=await Promise.all([h.from("peserta_didik").select("*, mentor:profiles(nama), kelas(nama_kelas)").eq("id",t).single(),h.from("kehadiran").select("*").eq("id_peserta",t).order("tanggal",{ascending:!1}),h.from("kemajuan").select("*").eq("id_peserta",t).order("tanggal",{ascending:!1}),h.from("penilaian").select("*").eq("id_peserta",t).order("tanggal",{ascending:!1})]);if(e.data){const l=i.data||[],r=n.data||[],c=s.data||[],u=l.filter(o=>o.status_hadir==="hadir").length,d=l.filter(o=>o.status_hadir==="izin").length,g=l.filter(o=>o.status_hadir==="sakit").length,p=l.filter(o=>o.status_hadir==="alpa").length;return{peserta:e.data,mentor:e.data.mentor||{nama:"Belum ditentukan"},kelas:e.data.kelas||{nama_kelas:e.data.jenis==="privat"?"Program Privat":"-"},kemajuan:r,penilaian:c,kehadiran_summary:{hadir:u,izin:d,sakit:g,alpa:p,total:l.length},riwayat_kehadiran:l}}}catch(e){console.error("adminService.getPesertaDetail error:",e)}return sa.getPesertaDetail(t)},async deleteRow(a,t){{const{error:e}=await h.from(a).delete().eq("id",t);if(e)throw new Error(`Gagal menghapus data dari ${a}: `+e.message);return!0}},async updateRow(a,t,e){{const{error:i}=await h.from(a).update(e).eq("id",t);if(i)throw new Error(`Gagal memperbarui data ${a}: `+i.message);return!0}},async exportAllData(a,t="*"){try{const{data:e,error:i}=await h.from(a).select(t).order("id");if(!i&&e)return e}catch{}return a==="peserta_didik"?j("peserta",la):a==="profiles"?j("profiles",na):a==="kelas"?j("kelas",aa):a==="kehadiran"?j("kehadiran",xa):a==="kemajuan"?j("kemajuan",fa):a==="penilaian"?j("penilaian",ba):[]},async exportAllTables(){try{const[a,t,e,i,n,s]=await Promise.all([h.from("peserta_didik").select("*, kelas(nama_kelas), mentor:profiles(nama)"),h.from("profiles").select("*").eq("role","mentor"),h.from("kelas").select("*, mentor:profiles(nama)"),h.from("kehadiran").select("*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)"),h.from("kemajuan").select("*, peserta:peserta_didik(nama_lengkap)"),h.from("penilaian").select("*, peserta:peserta_didik(nama_lengkap)")]);if(a.data)return{peserta:a.data,mentor:t.data,kelas:e.data,kehadiran:i.data,kemajuan:n.data,penilaian:s.data}}catch{}return{peserta:j("peserta",la),mentor:j("profiles",na).filter(a=>a.role==="mentor"),kelas:j("kelas",aa),kehadiran:j("kehadiran",xa),kemajuan:j("kemajuan",fa),penilaian:j("penilaian",ba)}},async logActivity(a,t,e,i={}){try{const{data:{user:n}}=await h.auth.getUser();await h.from("activity_logs").insert({id_user:n==null?void 0:n.id,action:a,entity_type:t,entity_id:String(e),detail:i})}catch{}}},T={async getMyKelas(a){try{const{data:e,error:i}=await h.from("kelas").select("*").eq("id_mentor",a).eq("status","aktif").order("nama_kelas");if(!i&&e)return e}catch{}return j("kelas",aa).filter(e=>e.id_mentor===a||!a)},async getMyPeserta(a,t=null){try{let n=h.from("peserta_didik").select("*, kelas(id, nama_kelas)").eq("id_mentor",a).eq("status","aktif").order("nama_lengkap");t&&(n=n.eq("id_kelas",t));const{data:s,error:l}=await n;if(!l&&s)return s}catch{}const e=j("peserta",la),i=j("kelas",aa);return e.filter(n=>(!a||n.id_mentor===a)&&(!t||n.id_kelas===t)).map(n=>({...n,kelas:i.find(s=>s.id===n.id_kelas)}))},async bulkSimpanAbsensi(a){{try{const{data:e,error:i}=await h.rpc("bulk_upsert_kehadiran",{p_records:a});if(!i)return e}catch{}const{error:t}=await h.from("kehadiran").upsert(a.map(e=>({...e})),{onConflict:"id_peserta,id_kelas,tanggal"});if(t)throw new Error("Gagal simpan absensi: "+t.message);return{success:!0,count:a.length}}},async addKehadiran(a){return this.bulkSimpanAbsensi([a])},async updateKehadiran(a,t){{const{data:e,error:i}=await h.from("kehadiran").update(t).eq("id",a).select().single();if(i)throw new Error("Gagal update kehadiran: "+i.message);return e}},async deleteKehadiran(a){{const{error:t}=await h.from("kehadiran").delete().eq("id",a);if(t)throw new Error("Gagal hapus kehadiran: "+t.message);return!0}},async getRiwayatKehadiran(a,t=30){try{const{data:i,error:n}=await h.from("kehadiran").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(t);if(!n&&i)return i}catch{}return j("kehadiran",xa).filter(i=>i.id_peserta===Number(a)).slice(0,t)},async getKemajuan(a,t=20){let e=[];try{const{data:n,error:s}=await h.from("kemajuan").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(t*2);!s&&n&&(e=n)}catch{}e.length||(e=j("kemajuan",fa).filter(n=>n.id_peserta===Number(a)));const i=new Map;return e.forEach(n=>{if(!n||!n.tanggal)return;const s=i.get(n.tanggal);(!s||(Number(n.id)||0)>(Number(s.id)||0))&&i.set(n.tanggal,n)}),Array.from(i.values()).sort((n,s)=>String(s.tanggal||"").localeCompare(String(n.tanggal||""))).slice(0,t)},async addKemajuan(a){const{data:t,error:e}=await h.from("kemajuan").insert(a).select().single();if(e)throw new Error("Gagal simpan kemajuan: "+e.message);return t},async updateKemajuan(a,t){{const{data:e,error:i}=await h.from("kemajuan").update(t).eq("id",a).select().single();if(i)throw new Error("Gagal update kemajuan: "+i.message);return e}},async deleteKemajuan(a){{const{error:t}=await h.from("kemajuan").delete().eq("id",a);if(t)throw new Error("Gagal hapus kemajuan: "+t.message);return!0}},async getPenilaian(a,t=20){let e=[];try{const{data:n,error:s}=await h.from("penilaian").select("*").eq("id_peserta",a).order("tanggal",{ascending:!1}).limit(t*2);!s&&n&&(e=n)}catch{}e.length||(e=j("penilaian",ba).filter(n=>n.id_peserta===Number(a)));const i=new Map;return e.forEach(n=>{if(!n||!n.tanggal)return;const s=i.get(n.tanggal);(!s||(Number(n.id)||0)>(Number(s.id)||0))&&i.set(n.tanggal,n)}),Array.from(i.values()).sort((n,s)=>String(s.tanggal||"").localeCompare(String(n.tanggal||""))).slice(0,t)},async addPenilaian(a){const{data:t,error:e}=await h.from("penilaian").insert(a).select().single();if(e)throw new Error("Gagal simpan penilaian: "+e.message);return t},async updatePenilaian(a,t){{const{data:e,error:i}=await h.from("penilaian").update(t).eq("id",a).select().single();if(i)throw new Error("Gagal update penilaian: "+i.message);return e}},async deletePenilaian(a){{const{error:t}=await h.from("penilaian").delete().eq("id",a);if(t)throw new Error("Gagal hapus penilaian: "+t.message);return!0}},async getCatatan(a){return[]},async addCatatan(a){return{id:Date.now(),...a}},async getPelajaranTambahan(a){return[]},async addPelajaranTambahan(a){return{id:Date.now(),...a}},async updatePeserta(a,t){const e=Number(a);try{const{data:s,error:l}=await h.from("peserta_didik").update(t).eq("id",e).select().single();if(!l&&s)return s}catch(s){console.error("mentorService.updatePeserta error:",s)}const i=j("peserta",la),n=i.findIndex(s=>Number(s.id)===e);return n!==-1?(i[n]={...i[n],...t},ya("peserta",i),i[n]):{id:e,...t}},async updatePassword(a){{const{error:t}=await h.auth.updateUser({password:a});if(t)throw t}},async getChartData(a){const t=await this.getKemajuan(a,30),e=await this.getPenilaian(a,30),i=await this.getRiwayatKehadiran(a,60);return{kemajuan:t,penilaian:e,kehadiran:i}},async deleteKemajuanByPesertaTanggal(a,t){{const{error:e}=await h.from("kemajuan").delete().eq("id_peserta",Number(a)).eq("tanggal",t);if(e)throw new Error("Gagal hapus kemajuan terkait: "+e.message);return!0}},async deletePenilaianByPesertaTanggal(a,t){{const{error:e}=await h.from("penilaian").delete().eq("id_peserta",Number(a)).eq("tanggal",t);if(e)throw new Error("Gagal hapus penilaian terkait: "+e.message);return!0}},async deleteRelatedByKehadiran(a,t){return(await Promise.allSettled([this.deleteKemajuanByPesertaTanggal(a,t),this.deletePenilaianByPesertaTanggal(a,t)])).forEach((i,n)=>{i.status==="rejected"&&console.warn(`deleteRelatedByKehadiran: partial failure [${n}]:`,i.reason)}),!0},async getRekapanList(a){const t=Number(a);try{const{data:i,error:n}=await h.from("rekapan_laporan").select("*").eq("id_peserta",t).order("created_at",{ascending:!1});if(!n&&i)return i}catch(i){console.warn("getRekapanList supabase error:",i)}return j("rekapan_laporan",[]).filter(i=>Number(i.id_peserta)===t)},async createRekapan(a){try{const{data:i,error:n}=await h.from("rekapan_laporan").insert(a).select().single();if(!n&&i)return i;n&&console.warn("createRekapan remote error, fallback local:",n.message)}catch(i){console.warn("createRekapan exception:",i)}const t=j("rekapan_laporan",[]),e={id:Date.now(),created_at:new Date().toISOString(),...a};return t.unshift(e),ya("rekapan_laporan",t),e},async updateRekapan(a,t){try{const{data:n,error:s}=await h.from("rekapan_laporan").update(t).eq("id",a).select().single();if(!s&&n)return n}catch{}const e=j("rekapan_laporan",[]),i=e.findIndex(n=>Number(n.id)===Number(a));return i!==-1?(e[i]={...e[i],...t,updated_at:new Date().toISOString()},ya("rekapan_laporan",e),e[i]):t},async deleteRekapan(a){try{const{error:e}=await h.from("rekapan_laporan").delete().eq("id",a);if(!e)return!0}catch{}const t=j("rekapan_laporan",[]).filter(e=>Number(e.id)!==Number(a));return ya("rekapan_laporan",t),!0}},sa={async searchPeserta(a){const t=(a||"").trim().toLowerCase();if(!t)return[];try{const{data:s,error:l}=await h.rpc("search_peserta_wali_by_name",{p_nama:t});if(!l&&s)return s}catch{}const e=j("peserta",la),i=j("kelas",aa),n=j("profiles",na);return e.filter(s=>s.nama_lengkap.toLowerCase().includes(t)).map(s=>{const l=i.find(c=>c.id===s.id_kelas),r=n.find(c=>c.id===s.id_mentor);return{id:s.id,nama_lengkap:s.nama_lengkap,jenis:s.jenis,nama_kelas:(l==null?void 0:l.nama_kelas)||(s.jenis==="privat"?"Program Privat":"-"),nama_mentor:(r==null?void 0:r.nama)||"Asatidz QIA"}})},async getPesertaDetail(a){const t=Number(a),e=b=>{if(!Array.isArray(b))return[];const I=new Map;return b.forEach(A=>{if(!A||!A.tanggal)return;const F=String(A.tanggal).trim(),y=I.get(F);(!y||(Number(A.id)||0)>(Number(y.id)||0))&&I.set(F,A)}),Array.from(I.values()).sort((A,F)=>String(F.tanggal||"").localeCompare(String(A.tanggal||"")))},i=await this.getRekapanPeserta(t);{try{const{data:b,error:I}=await h.rpc("get_peserta_detail_wali",{p_peserta_id:t});if(!I&&b&&b.peserta)return b.kemajuan=e(b.kemajuan),b.penilaian=e(b.penilaian),b.riwayat_kehadiran=e(b.riwayat_kehadiran),b.rekapan=i,b}catch{}try{const[b,I,A,F]=await Promise.all([h.from("peserta_didik").select("*, mentor:profiles(nama), kelas(nama_kelas)").eq("id",t).single(),h.from("kehadiran").select("*").eq("id_peserta",t).order("tanggal",{ascending:!1}),h.from("kemajuan").select("*").eq("id_peserta",t).order("tanggal",{ascending:!1}),h.from("penilaian").select("*").eq("id_peserta",t).order("tanggal",{ascending:!1})]);if(b.data){const y=e(I.data||[]),q=e(A.data||[]),z=e(F.data||[]),B=y.filter(v=>v.status_hadir==="hadir").length,k=y.filter(v=>v.status_hadir==="izin").length,$=y.filter(v=>v.status_hadir==="sakit").length,m=y.filter(v=>v.status_hadir==="alpa").length;return{peserta:b.data,mentor:b.data.mentor||{nama:"Belum ditentukan"},kelas:b.data.kelas||{nama_kelas:b.data.jenis==="privat"?"Program Privat":"-"},kemajuan:q,penilaian:z,kehadiran_summary:{hadir:B,izin:k,sakit:$,alpa:m,total:y.length},riwayat_kehadiran:y,rekapan:i,catatan_mentor:[]}}}catch{}}const s=j("peserta",la).find(b=>b.id===t);if(!s)return null;const l=j("kelas",aa),r=j("profiles",na),c=l.find(b=>b.id===(s==null?void 0:s.id_kelas)),u=r.find(b=>b.id===(s==null?void 0:s.id_mentor)),d=e(j("kemajuan",fa).filter(b=>b.id_peserta===t)),g=e(j("kehadiran",xa).filter(b=>b.id_peserta===t)),p=e(j("penilaian",ba).filter(b=>b.id_peserta===t)),o=g.filter(b=>b.status_hadir==="hadir").length,_=g.filter(b=>b.status_hadir==="izin").length,w=g.filter(b=>b.status_hadir==="sakit").length,E=g.filter(b=>b.status_hadir==="alpa").length;return{peserta:s,mentor:u||{nama:"Belum ditentukan"},kelas:c||{nama_kelas:s.jenis==="privat"?"Program Privat":"-"},kemajuan:d,penilaian:p,kehadiran_summary:{hadir:o,izin:_,sakit:w,alpa:E,total:g.length},riwayat_kehadiran:g,rekapan:i,catatan_mentor:[]}},async getRekapanPeserta(a){const t=Number(a);try{const{data:i,error:n}=await h.from("rekapan_laporan").select("*").eq("id_peserta",t).order("created_at",{ascending:!1});if(!n&&i)return i}catch{}return j("rekapan_laporan",[]).filter(i=>Number(i.id_peserta)===t)},async getChartDataPeserta(a){const t=Number(a);{try{const{data:s,error:l}=await h.rpc("get_peserta_charts_wali",{p_peserta_id:t});if(!l&&s)return s}catch{}try{const[s,l,r]=await Promise.all([h.from("penilaian").select("tanggal, nilai_angka").eq("id_peserta",t).order("tanggal").limit(20),h.from("kehadiran").select("tanggal, status_hadir, materi_pembahasan").eq("id_peserta",t).order("tanggal").limit(60),h.from("kemajuan").select("tanggal, kitab_surat, halaman_ayat").eq("id_peserta",t).order("tanggal").limit(20)]);if(s.data)return{penilaian:s.data,kehadiran:l.data,kemajuan:r.data}}catch{}}const e=j("penilaian",ba).filter(s=>s.id_peserta===t),i=j("kehadiran",xa).filter(s=>s.id_peserta===t),n=j("kemajuan",fa).filter(s=>s.id_peserta===t);return{penilaian:e,kehadiran:i,kemajuan:n}}},xe=Object.freeze(Object.defineProperty({__proto__:null,adminService:P,authService:ia,isConfigured:be,mentorService:T,supabase:h,waliService:sa},Symbol.toStringTag,{value:"Module"}));function Za(a,t,e){document.title="Quran Insight Academy — Bimbingan Al-Quran Terpercaya",a.innerHTML=`
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
`,window.navigateTo=l=>t(l),window.navigate=l=>t(l);const i=document.getElementById("qiaMobileToggle"),n=document.getElementById("qiaNavLinks");i&&n&&i.addEventListener("click",()=>{n.classList.toggle("is-open")}),document.querySelectorAll(".qia-faq-btn").forEach(l=>{l.addEventListener("click",function(){const r=this.parentElement,c=r.classList.contains("is-active");document.querySelectorAll(".qia-faq-item").forEach(u=>u.classList.remove("is-active")),c||r.classList.add("is-active")})}),document.querySelectorAll('a[href^="#"]').forEach(l=>{l.addEventListener("click",r=>{r.preventDefault(),n&&n.classList.remove("is-open");const c=l.getAttribute("href"),u=document.querySelector(c);u&&u.scrollIntoView({behavior:"smooth"})})})}const he="modulepreload",ye=function(a){return"/"+a},qa={},ve=function(t,e,i){let n=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),r=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(e.map(c=>{if(c=ye(c),c in qa)return;qa[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":he,u||(g.as="script"),g.crossOrigin="",g.href=c,r&&g.setAttribute("nonce",r),document.head.appendChild(g),u)return new Promise((p,o)=>{g.addEventListener("load",p),g.addEventListener("error",()=>o(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(l){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=l,window.dispatchEvent(r),!r.defaultPrevented)throw l}return n.then(l=>{for(const r of l||[])r.status==="rejected"&&s(r.reason);return t().catch(s)})};function _a(a,t=""){const e={};for(const[i,n]of Object.entries(a)){const s=t?`${t}_${i}`:i;n&&typeof n=="object"&&!Array.isArray(n)&&!(n instanceof Date)?Object.assign(e,_a(n,s)):Array.isArray(n)||(e[s]=n)}return e}function Xa(a,t="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const e=a.map(l=>_a(l)),i=[...new Set(e.flatMap(Object.keys))],n=[i.join(","),...e.map(l=>i.map(r=>{const c=l[r]??"",u=String(c).replace(/"/g,'""');return u.includes(",")||u.includes('"')||u.includes(`
`)?`"${u}"`:u}).join(","))],s=new Blob(["\uFEFF"+n.join(`
`)],{type:"text/csv;charset=utf-8;"});te(s,`${t}.csv`)}function ae(a,t="export",e="Data"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const i=a.map(r=>_a(r)),n=oa.json_to_sheet(i),s=oa.book_new();oa.book_append_sheet(s,n,e);const l=Object.keys(i[0]||{}).map(r=>({wch:Math.max(r.length,...i.map(c=>String(c[r]??"").length))}));n["!cols"]=l,Va(s,`${t}.xlsx`)}function ee(a,t="QIA_DataLengkap"){const e=oa.book_new();for(const[i,n]of Object.entries(a)){if(!n||!n.length)continue;const s=n.map(c=>_a(c)),l=oa.json_to_sheet(s),r=Object.keys(s[0]||{}).map(c=>({wch:Math.max(c.length,...s.map(u=>String(u[c]??"").length))}));l["!cols"]=r,oa.book_append_sheet(e,l,i.substring(0,31))}Va(e,`${t}.xlsx`)}function ke(a,t="export"){if(!a||!a.length){alert("Tidak ada data untuk diekspor.");return}const e=new Blob([JSON.stringify(a,null,2)],{type:"application/json"});te(e,`${t}.json`)}function Aa(a,t="tanggal"){if(!Array.isArray(a))return[];const e=new Map;return a.forEach(i=>{if(!i||!i[t])return;const n=String(i[t]).trim(),s=e.get(n);if(!s)e.set(n,i);else{const l=Number(s.id)||0,r=Number(i.id)||0;if(r>l)e.set(n,i);else if(r===l){const c=(s.kitab_surat?1:0)+(s.nilai_angka!==void 0&&s.nilai_angka!==null?1:0);(i.kitab_surat?1:0)+(i.nilai_angka!==void 0&&i.nilai_angka!==null?1:0)>=c&&e.set(n,i)}}}),Array.from(e.values()).sort((i,n)=>String(n[t]||"").localeCompare(String(i[t]||"")))}function we(a){return a==null?"":String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function pa(a){return we(a).replace(/\r\n?/g,`
`)}function wa(a,t={}){var D;const{peserta:e,mentor:i,kelas:n,kemajuan:s,penilaian:l,kehadiran_summary:r,riwayat_kehadiran:c,catatan_mentor:u}=a||{},d=t.rekapan||a.rekapan_terpilih||null;let g=Aa(s,"tanggal"),p=Aa(l,"tanggal"),o=Aa(c,"tanggal");if(d)if(Array.isArray(d.sesi_ids)&&d.sesi_ids.length>0){const f=new Set(d.sesi_ids.map(Number));o=o.filter(H=>f.has(Number(H.id)));const R=new Set(o.map(H=>H.tanggal).filter(Boolean));g=g.filter(H=>R.has(H.tanggal)),p=p.filter(H=>R.has(H.tanggal))}else d.periode_bulan?(o=o.filter(f=>String(f.tanggal||"").startsWith(d.periode_bulan)),g=g.filter(f=>String(f.tanggal||"").startsWith(d.periode_bulan)),p=p.filter(f=>String(f.tanggal||"").startsWith(d.periode_bulan))):d.tanggal_mulai&&d.tanggal_selesai&&(o=o.filter(f=>f.tanggal>=d.tanggal_mulai&&f.tanggal<=d.tanggal_selesai),g=g.filter(f=>f.tanggal>=d.tanggal_mulai&&f.tanggal<=d.tanggal_selesai),p=p.filter(f=>f.tanggal>=d.tanggal_mulai&&f.tanggal<=d.tanggal_selesai));const _=g.slice(0,30),w=p.slice(0,30),E=o.filter(f=>f.catatan_sesi||f.perkembangan_materi).map(f=>({tanggal:f.tanggal||"",status:f.status_hadir||"",catatan:f.catatan_sesi||f.perkembangan_materi||""})).slice(0,30),b=(d==null?void 0:d.total_hadir)!==void 0&&(d==null?void 0:d.total_hadir)!==null?d.total_hadir:o.length>0?o.filter(f=>f.status_hadir==="hadir").length:(r==null?void 0:r.hadir)||0,I=(d==null?void 0:d.total_izin)!==void 0&&(d==null?void 0:d.total_izin)!==null?d.total_izin:o.length>0?o.filter(f=>f.status_hadir==="izin").length:(r==null?void 0:r.izin)||0,A=(d==null?void 0:d.total_sakit)!==void 0&&(d==null?void 0:d.total_sakit)!==null?d.total_sakit:o.length>0?o.filter(f=>f.status_hadir==="sakit").length:(r==null?void 0:r.sakit)||0,F=(d==null?void 0:d.total_alpa)!==void 0&&(d==null?void 0:d.total_alpa)!==null?d.total_alpa:o.length>0?o.filter(f=>f.status_hadir==="alpa"||!["hadir","izin","sakit"].includes(f.status_hadir)&&f.status_hadir).length:(r==null?void 0:r.alpa)||0,y=b+I+A+F,q=y>0?Math.round(b/y*100):r!=null&&r.total?Math.round((r.hadir||0)/r.total*100):0,z=w.filter(f=>f.nilai_angka!==null&&f.nilai_angka!==void 0&&!isNaN(parseFloat(f.nilai_angka))),B=(d==null?void 0:d.rata_nilai)!==void 0&&(d==null?void 0:d.rata_nilai)!==null?Number(d.rata_nilai).toFixed(1):z.length>0?(z.reduce((f,R)=>f+parseFloat(R.nilai_angka),0)/z.length).toFixed(1):"-",k=d!=null&&d.judul_rekap?`Laporan ${d.judul_rekap}`:(e==null?void 0:e.jenis)==="privat"?"Laporan Perkembangan Program Privat":"Laporan Perkembangan Peserta Didik",$=d!=null&&d.judul_rekap?`${((e==null?void 0:e.jenis)||"BIMBEL").toUpperCase()} — ${d.judul_rekap.toUpperCase()}`:((D=e==null?void 0:e.jenis)==null?void 0:D.toUpperCase())||"BIMBEL",m=`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Rapor — ${(e==null?void 0:e.nama_lengkap)||""} — ${(d==null?void 0:d.judul_rekap)||"QIA"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1a0a02; background: #fff; padding: 20px; }
  .header { text-align: center; border-bottom: 3px solid #F0AF43; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { font-size: 22px; color: #221104; }
  .header p { color: #81511D; font-size: 14px; font-weight: 700; margin-top: 4px; }
  .badge { display: inline-block; background: #221104; color: #F0AF43; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 8px; }
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
  .note-box .note-text { font-size: 13px; color: #1a0a02; line-height: 1.6; white-space: pre-line; overflow-wrap: anywhere; }
  .note-paragraph { white-space: pre-line; overflow-wrap: anywhere; }
  .note-cell { white-space: pre-line; overflow-wrap: anywhere; line-height: 1.6; vertical-align: top; }
  .badge-status { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
  .badge-hadir { background: #d1fae5; color: #065f46; }
  .badge-izin  { background: #fef3c7; color: #92400e; }
  .badge-sakit { background: #dbeafe; color: #1e40af; }
  .badge-alpa  { background: #fee2e2; color: #991b1b; }
  .rekap-eval-card { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 14px 18px; margin-bottom: 18px; }
  .footer { text-align: center; font-size: 11px; color: #81511D; margin-top: 24px; border-top: 1px solid #e8d4bc; padding-top: 12px; }
</style>
</head>
<body>
<div class="header">
  <h1>Quran Insight Academy</h1>
  <p>${k}</p>
  <span class="badge">${$}</span>
</div>

<div class="info-grid">
  <div class="info-card">
    <h3>Nama Peserta Didik</h3>
    <div class="val">${(e==null?void 0:e.nama_lengkap)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Kelas / Program</h3>
    <div class="val">${(n==null?void 0:n.nama_kelas)||((e==null?void 0:e.jenis)==="privat"?"Program Privat":"-")}</div>
  </div>
  <div class="info-card">
    <h3>Mentor / Ustadz</h3>
    <div class="val">${(i==null?void 0:i.nama)||"-"}</div>
  </div>
  <div class="info-card">
    <h3>Rata-rata Nilai</h3>
    <div class="val" style="color:#059669; font-size:20px;">${B}</div>
  </div>
</div>

${d?`
<div class="rekap-eval-card">
  <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
    📋 Evaluasi Rekapan: ${d.judul_rekap||"Rekapan"}
  </div>
  ${d.catatan_evaluasi?`<div class="note-paragraph" style="font-size:13px;color:#1e293b;line-height:1.6;margin-bottom:8px;"><strong>Catatan Mentor:</strong> ${pa(d.catatan_evaluasi)}</div>`:""}
  ${d.rekomendasi?`<div class="note-paragraph" style="font-size:13px;color:#166534;line-height:1.6;margin-bottom:6px;"><strong>Rekomendasi Kelanjutan:</strong> ${pa(d.rekomendasi)}</div>`:""}
  ${d.capaian_hafalan?`<div class="note-paragraph" style="font-size:12.5px;color:#334155;"><strong>Capaian Hafalan Terakhir:</strong> ${pa(d.capaian_hafalan)}</div>`:""}
</div>
`:""}

<h2 class="section">Rekap Kehadiran ${d?`(${y} Sesi)`:""}</h2>
<div class="stat-row">
  <div class="stat-box"><div class="n">${b}</div><div class="l">Hadir</div></div>
  <div class="stat-box"><div class="n">${I}</div><div class="l">Izin</div></div>
  <div class="stat-box"><div class="n">${A}</div><div class="l">Sakit</div></div>
  <div class="stat-box"><div class="n">${F}</div><div class="l">Alpa</div></div>
  <div class="stat-box" style="background:#059669;"><div class="n" style="color:#fff;">${q}%</div><div class="l">Kehadiran</div></div>
</div>

<h2 class="section">Riwayat Kemajuan Hafalan</h2>
<table>
  <tr><th>Tanggal</th><th>Kitab / Surah</th><th>Halaman / Ayat</th><th>Status</th></tr>
  ${_.length>0?_.map(f=>`<tr>
        <td>${f.tanggal||""}</td>
        <td>${f.kitab_surat||"-"}</td>
        <td>${f.halaman_ayat||"-"}</td>
        <td><span style="font-weight:600;text-transform:capitalize;">${f.status_kelancaran||"-"}</span></td>
      </tr>`).join(""):'<tr><td colspan="4" style="text-align:center;color:#81511D;font-style:italic;padding:12px;">Belum ada catatan kemajuan hafalan</td></tr>'}
</table>

${E.length?`
<h2 class="section">Catatan Sesi</h2>
${E.map(f=>{const R=f.status==="hadir"?"badge-hadir":f.status==="izin"?"badge-izin":f.status==="sakit"?"badge-sakit":f.status==="alpa"?"badge-alpa":"";return`<div class="note-box">
  <div class="note-meta">${f.tanggal}${f.status?` &nbsp;·&nbsp; <span class="badge-status ${R}">${f.status}</span>`:""}</div>
  <div class="note-text">${pa(f.catatan)}</div>
</div>`}).join("")}`:""}

${u!=null&&u.length?`
<h2 class="section">Catatan Mentor</h2>
<table>
  <tr><th>Tanggal</th><th>Catatan</th></tr>
  ${(u||[]).slice(0,5).map(f=>`<tr><td style="vertical-align:top;">${f.tanggal||""}</td><td class="note-cell">${pa(f.isi_catatan||"")}</td></tr>`).join("")}
</table>`:""}

<div class="footer">
  Dicetak: ${new Date().toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} — Quran Insight Academy
</div>
<script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body></html>`,v=window.open("","_blank","width=800,height=900");v.document.write(m),v.document.close()}function te(a,t){const e=URL.createObjectURL(a),i=document.createElement("a");i.href=e,i.download=t,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(e)}let L={profile:null,stats:null,activeView:"dashboard",ssActiveTab:"peserta_bimbel",ssData:{peserta_bimbel:[],peserta_privat:[],mentor:[],kelas:[],kehadiran:[],kemajuan:[],penilaian:[]},ssDirtyRows:new Set,ssNewRows:[],ssSortCol:null,ssSortDir:"asc",ssFilter:""};async function _e(a,t,e){document.title="Portal Admin — Quran Insight Academy";try{if(L.profile=await ia.getProfile(),!L.profile||L.profile.role!=="admin"){Ta(a,t,e);return}}catch{Ta(a,t,e);return}a.innerHTML=ie(),ne(t,e),await Fa(e),$a("dashboard",e)}function Ta(a,t,e){a.innerHTML=`
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
  </div>`,document.getElementById("admin-login-form").addEventListener("submit",async n=>{n.preventDefault();const s=document.getElementById("admin-login-email").value,l=document.getElementById("admin-login-pwd").value,r=document.getElementById("btn-submit-login");r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{const c=await ia.login(s,l),u=c==null?void 0:c.user;if(!u)throw new Error("Login gagal, coba lagi.");L.profile={id:u.id,email:u.email,nama:"Administrator QIA",role:"admin",status:"aktif"};try{const{supabase:d}=await ve(async()=>{const{supabase:p}=await Promise.resolve().then(()=>xe);return{supabase:p}},void 0),{data:g}=await d.from("profiles").select("*").eq("id",u.id).single();g&&(L.profile=g)}catch{}e("Berhasil masuk sebagai Admin!","success"),a.innerHTML=ie(),ne(t,e),await Fa(e),$a("dashboard",e)}catch(c){e("Gagal masuk: "+c.message,"error"),r.disabled=!1,r.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Admin'}})}function ie(){return`
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
</div>`}function ne(a,t){document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),document.querySelectorAll(".nav-item[data-view]").forEach(e=>{e.addEventListener("click",()=>$a(e.dataset.view,t))}),document.getElementById("btn-logout").addEventListener("click",async()=>{await ia.logout(),a("/")}),document.getElementById("admin-modal-close").addEventListener("click",O),document.getElementById("admin-modal").addEventListener("click",function(e){e.target===this&&O()})}function $e(a){var t;document.querySelectorAll(".nav-item[data-view]").forEach(e=>e.classList.remove("active")),(t=document.getElementById("nav-"+a))==null||t.classList.add("active")}function $a(a,t){L.activeView=a,$e(a);const e=document.getElementById("main-content");switch(document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show"),a){case"dashboard":Ea(e),Fa(t).then(()=>{L.activeView==="dashboard"&&Ea(e)});break;case"mentor":va(e,t);break;case"kelas":ka(e,t);break;case"peserta":ga(e,t);break;case"spreadsheet":Ee(e,t);break;case"export":Fe(e,t);break;case"activity":Pe(e,t);break;default:Ea(e)}window.renderAdminView=i=>$a(i,t)}async function Fa(a){var t,e;try{L.stats=await P.getDashboardStats();const i=document.getElementById("user-name");i&&(i.textContent=((t=L.profile)==null?void 0:t.nama)||"Admin");const n=document.getElementById("user-avatar");n&&(n.textContent=(((e=L.profile)==null?void 0:e.nama)||"A").charAt(0))}catch(i){a&&a("Gagal load stats: "+i.message,"error")}}function Ea(a,t){const e=L.stats||{};a.innerHTML=`
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
          <div style="font-size:11px;color:var(--text-card-muted);white-space:nowrap;">${oe(i.created_at)}</div>
        </div>`).join("")}
      </div>`}
  </div>`,Ae(e)}function Ae(a){setTimeout(()=>{const t=document.getElementById("admin-chart-distribusi");if(t&&typeof Chart<"u"){const i=a.total_bimbel||0,n=a.total_privat||0;i+n===0?t.parentElement.innerHTML=`
          <div style="text-align:center;color:var(--text-card-muted);font-size:12.5px;">
            <i class="fa-solid fa-chart-pie" style="font-size:28px;opacity:0.35;margin-bottom:8px;color:#F0AF43;display:block;"></i>
            Belum ada data peserta didik
          </div>`:new Chart(t,{type:"doughnut",data:{labels:["Bimbel Kelompok","Program Privat"],datasets:[{data:[i,n],backgroundColor:["#10b981","#F0AF43"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"68%",plugins:{legend:{position:"bottom",labels:{color:"#fdf0e2",boxWidth:12,padding:12,font:{size:12}}}}}})}const e=document.getElementById("admin-chart-sistem");e&&typeof Chart<"u"&&new Chart(e,{type:"bar",data:{labels:["Peserta Bimbel","Peserta Privat","Mentor Aktif","Kelas Aktif"],datasets:[{label:"Jumlah",data:[a.total_bimbel||0,a.total_privat||0,a.total_mentor||0,a.total_kelas||0],backgroundColor:["rgba(16,185,129,0.75)","rgba(240,175,67,0.75)","rgba(59,130,246,0.75)","rgba(217,119,6,0.75)"],borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{color:"#c9a87a",stepSize:1,font:{size:11}},grid:{color:"rgba(255,255,255,0.06)"}},x:{ticks:{color:"#c9a87a",font:{size:11}},grid:{display:!1}}}}})},50)}async function va(a,t){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Mentor / <span>Asatidz</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-mentor">
      <i class="fa-solid fa-plus"></i> Tambah Mentor
    </button>
  </div>
  <div id="mentor-list-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;try{const e=await P.getMentors();document.getElementById("mentor-list-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama</th><th>Email</th><th>Jenis</th><th>No HP</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${e.length===0?'<tr><td colspan="6" style="text-align:center;padding:28px;color:#81511D;">Belum ada mentor.</td></tr>':e.map(i=>`<tr>
              <td><div style="font-weight:600;">${i.nama}</div></td>
              <td><span style="font-size:12px;">${i.email}</span></td>
              <td>${re(i.jenis_mentor)}</td>
              <td><span style="font-size:13px;">${i.no_hp||"-"}</span></td>
              <td>${Pa(i.status)}</td>
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
    </div>`,window.editMentor=i=>{const n=e.find(s=>s.id===i);n&&Q("Edit Mentor",`
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
      </div>`,async()=>{await P.updateMentor(i,{nama:document.getElementById("em-nama").value,no_hp:document.getElementById("em-nohp").value,jenis_mentor:document.getElementById("em-jenis").value}),t("Mentor diperbarui!","success"),O(),va(a,t)})},window.toggleMentorStatus=async(i,n)=>{await P.updateMentor(i,{status:n}),t(`Mentor ${n==="aktif"?"diaktifkan":"dinonaktifkan"}!`,"success"),va(a,t)},window.changeMentorPassword=(i,n)=>{Q(`Ubah Password — ${n}`,`
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
      </div>`,async()=>{const s=document.getElementById("cp-pw").value,l=document.getElementById("cp-pw2").value;if(!s||s.length<8){t("Password minimal 8 karakter.","info");return}if(s!==l){t("Konfirmasi password tidak cocok.","error");return}try{await P.resetMentorPassword(i,s),t(`Password ${n} berhasil diubah!`,"success"),O()}catch(r){t("Gagal: "+r.message,"error")}}),setTimeout(()=>{const s=document.getElementById("cp-pw2"),l=document.getElementById("cp-match-msg");s&&l&&s.addEventListener("input",()=>{const r=document.getElementById("cp-pw").value;if(!s.value){l.textContent="";return}s.value===r?l.innerHTML='<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> <span style="color:#16a34a;">Password cocok</span>':l.innerHTML='<i class="fa-solid fa-circle-xmark" style="color:#dc2626;"></i> <span style="color:#dc2626;">Password tidak cocok</span>'})},100)}}catch(e){t("Gagal memuat mentor: "+e.message,"error")}document.getElementById("btn-tambah-mentor").addEventListener("click",()=>{Q("Tambah Mentor Baru",`
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
    </div>`,async()=>{const e=document.getElementById("nm-email").value,i=document.getElementById("nm-pw").value;if(!e||!i){t("Isi email dan password.","info");return}try{await P.createMentor(e,i,{nama:document.getElementById("nm-nama").value,no_hp:document.getElementById("nm-nohp").value,jenis_mentor:document.getElementById("nm-jenis").value}),t("Mentor berhasil ditambahkan!","success"),O(),va(a,t)}catch(n){t("Gagal: "+n.message,"error")}})})}async function ka(a,t){a.innerHTML=`<div class="page-header">
    <div><div class="page-title">Kelas <span>Bimbel</span></div></div>
    <button class="btn btn-primary" id="btn-tambah-kelas"><i class="fa-solid fa-plus"></i> Buat Kelas Baru</button>
  </div>
  <div id="kelas-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[e,i,n]=await Promise.all([P.getKelas(),P.getMentors({status:"aktif"}),P.getPesertaDidik({jenis:"bimbel",status:"aktif"})]).catch(s=>(t("Gagal memuat data.","error"),[[],[],[]]));document.getElementById("kelas-wrapper").innerHTML=`
  <div class="grid-3">
    ${e.length===0?'<div style="grid-column:1/-1;text-align:center;padding:40px;color:#81511D;">Belum ada kelas. Buat kelas pertama!</div>':e.map(s=>{var r;const l=n.filter(c=>c.id_kelas===s.id);return`
        <div class="card anim-fadeInUp" style="position:relative;">
          <div style="position:absolute;top:16px;right:16px;">${Pa(s.status)}</div>
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
            ${l.map(c=>`<div style="font-size:12px;color:var(--text-card-muted);padding:2px 0;">• ${c.nama_lengkap}</div>`).join("")}
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary btn-sm" onclick="editKelas(${s.id})"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="kelolaSantriKelas(${s.id},'${s.nama_kelas}')">
              <i class="fa-solid fa-user-plus"></i> Kelola Peserta Didik
            </button>
          </div>
        </div>`}).join("")}
  </div>`,document.getElementById("btn-tambah-kelas").addEventListener("click",()=>{Q("Buat Kelas Baru",`
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
    </div>`,async()=>{const s=document.getElementById("nk-nama").value.trim();if(!s){t("Isi nama kelas.","info");return}try{await P.createKelas({nama_kelas:s,deskripsi:document.getElementById("nk-desc").value,id_mentor:document.getElementById("nk-mentor").value||null,hari_jadwal:document.getElementById("nk-hari").value,jam_jadwal:document.getElementById("nk-jam").value,kapasitas:parseInt(document.getElementById("nk-kap").value)||15}),t("Kelas berhasil dibuat!","success"),O(),ka(a,t)}catch(l){t("Gagal: "+l.message,"error")}})}),window.editKelas=s=>{const l=e.find(r=>r.id===s);l&&Q("Edit Kelas",`
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
    </div>`,async()=>{await P.updateKelas(s,{nama_kelas:document.getElementById("ek-nama").value,deskripsi:document.getElementById("ek-desc").value,id_mentor:document.getElementById("ek-mentor").value||null,hari_jadwal:document.getElementById("ek-hari").value,jam_jadwal:document.getElementById("ek-jam").value,status:document.getElementById("ek-status").value}),t("Kelas diperbarui!","success"),O(),ka(a,t)})},window.kelolaSantriKelas=(s,l)=>{const r=n.filter(u=>u.id_kelas===s),c=n.filter(u=>!u.id_kelas||u.id_kelas!==s);Q(`Kelola Peserta Didik — ${l}`,`
    <div>
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--gold-400);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
          Peserta Didik di Kelas Ini (${r.length})
        </div>
        ${r.length===0?'<p style="font-size:13px;color:var(--text-card-muted);">Belum ada peserta didik</p>':r.map(u=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;
            background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:6px;">
            <span style="font-size:13px;color:var(--cream-100);">${u.nama_lengkap}</span>
            <button class="btn btn-danger btn-sm" onclick="pindahSantriKelas(${u.id}, null, this.closest('.modal-backdrop'))">
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
          ${c.map(u=>`<option value="${u.id}">${u.nama_lengkap} ${u.id_kelas?"(sudah di kelas lain)":""}</option>`).join("")}
        </select>
        <button class="btn btn-primary btn-sm" onclick="tambahSantriKeKelas(${s})">
          <i class="fa-solid fa-plus"></i> Tambahkan
        </button>
      </div>
    </div>`,null)},window.pindahSantriKelas=async(s,l)=>{try{await P.updatePeserta(s,{id_kelas:l}),t("Peserta didik berhasil dipindahkan!","success"),O(),ka(a,t)}catch(r){t("Gagal: "+r.message,"error")}},window.tambahSantriKeKelas=async s=>{var r;const l=parseInt((r=document.getElementById("ss-add-santri"))==null?void 0:r.value);if(!l){t("Pilih peserta didik.","info");return}await window.pindahSantriKelas(l,s)}}async function ga(a,t){a.innerHTML=`<div class="page-header">
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
  <div id="peserta-wrapper"><div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div></div></div>`;const[e,i,n]=await Promise.all([P.getPesertaDidik({status:"aktif"}),P.getMentors({status:"aktif"}),P.getKelas({status:"aktif"})]).catch(l=>(t("Gagal memuat data.","error"),[[],[],[]]));function s(l){document.getElementById("peserta-wrapper").innerHTML=`
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Nama Lengkap</th><th>Jenis</th><th>Mentor</th><th>Status</th><th>Aksi</th>
        </tr></thead>
        <tbody>
          ${l.length===0?'<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Tidak ada peserta didik ditemukan.</td></tr>':l.map(r=>{var c;return`<tr>
              <td><div style="font-weight:600;">${r.nama_lengkap}</div><div style="font-size:11px;color:#81511D;">${r.nama_wali||""}</div></td>
              <td>${re(r.jenis)}</td>
              <td><span style="font-size:13px;">${((c=r.mentor)==null?void 0:c.nama)||"-"}</span></td>
              <td>${Pa(r.status)}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-ghost btn-sm" title="Lihat Laporan" onclick="lihatLaporanPeserta(${r.id},'${(r.nama_lengkap||"").replace(/'/g,"\\'")}')" style="color:#0ea5e9;"><i class="fa-solid fa-chart-line"></i></button>
                  <button class="btn btn-ghost btn-sm" title="Edit Peserta" onclick="editPeserta(${r.id})"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn-ghost btn-sm" title="Nonaktifkan" onclick="nonaktifPeserta(${r.id})" style="color:#d97706;"><i class="fa-solid fa-ban"></i></button>
                  <button class="btn btn-danger btn-sm" title="Hapus Permanen" onclick="hapusPeserta(${r.id}, '${(r.nama_lengkap||"").replace(/'/g,"\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                </div>
              </td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>`}s(e),document.getElementById("peserta-search").addEventListener("input",l=>{const r=l.target.value.toLowerCase();s(e.filter(c=>c.nama_lengkap.toLowerCase().includes(r)))}),window.editPeserta=l=>{const r=e.find(c=>c.id===l);r&&(Q("Edit Peserta Didik",Ka(r,i,n),async()=>{await P.updatePeserta(l,Ra()),t("Peserta didik diperbarui!","success"),O(),ga(a,t)}),handleJenisChange())},window.nonaktifPeserta=async l=>{confirm("Nonaktifkan peserta didik ini?")&&(await P.updatePeserta(l,{status:"nonaktif"}),t("Peserta didik dinonaktifkan.","info"),ga(a,t))},window.hapusPeserta=async(l,r)=>{if(confirm(`Hapus "${r}" secara permanen dari database?

Semua riwayat nilai, kemajuan hafalan, dan absensi peserta didik ini juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan!`))try{await P.deletePeserta(l),t(`Peserta didik "${r}" berhasil dihapus dari database!`,"success"),ga(a,t)}catch(c){t("Gagal menghapus: "+c.message,"error")}},window.lihatLaporanPeserta=async(l,r,c="kehadiran")=>{Q(`📊 Progress & Laporan: ${r}`,'<div style="text-align:center;padding:40px;"><div class="spinner" style="margin:0 auto;"></div><p style="margin-top:12px;color:#81511D;font-weight:600;">Memuat data laporan…</p></div>',null);try{const u=await P.getPesertaDetail(l);if(!u){t("Data tidak ditemukan.","error"),O();return}const{kemajuan:d=[],penilaian:g=[],riwayat_kehadiran:p=[],kehadiran_summary:o={}}=u,_=g.length>0?(g.reduce((A,F)=>A+(F.nilai_angka||0),0)/g.length).toFixed(1):"-",w=`
      <div style="font-family:inherit;color:#1a0a02;">
        <!-- Stats ringkas dengan kontras tinggi -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
          <div style="background:#ffffff;border:1.5px solid rgba(16,185,129,0.35);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#059669;">${o.hadir||0}</div>
            <div style="font-size:11px;font-weight:700;color:#047857;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Hadir</div>
          </div>
          <div style="background:#ffffff;border:1.5px solid rgba(249,115,22,0.35);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#ea580c;">${(o.izin||0)+(o.sakit||0)}</div>
            <div style="font-size:11px;font-weight:700;color:#c2410c;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Izin/Sakit</div>
          </div>
          <div style="background:#ffffff;border:1.5px solid rgba(239,68,68,0.35);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#dc2626;">${o.alpa||0}</div>
            <div style="font-size:11px;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Alpa</div>
          </div>
          <div style="background:#ffffff;border:1.5px solid rgba(240,175,67,0.45);border-radius:12px;padding:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:24px;font-weight:800;color:#b45309;">${_}</div>
            <div style="font-size:11px;font-weight:700;color:#78350f;text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;">Rata Nilai</div>
          </div>
        </div>

        <!-- Tabs laporan -->
        <div style="display:flex;gap:8px;margin-bottom:14px;border-bottom:2px solid rgba(129,81,29,0.15);padding-bottom:10px;">
          <button id="ltab-kehadiran" onclick="switchLaporanTab('kehadiran')" style="padding:7px 15px;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;transition:all 0.2s;">Kehadiran (${p.length})</button>
          <button id="ltab-kemajuan" onclick="switchLaporanTab('kemajuan')" style="padding:7px 15px;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;transition:all 0.2s;">Kemajuan Hafalan (${d.length})</button>
          <button id="ltab-penilaian" onclick="switchLaporanTab('penilaian')" style="padding:7px 15px;border-radius:8px;font-weight:700;font-size:12.5px;cursor:pointer;transition:all 0.2s;">Penilaian (${g.length})</button>
        </div>
        <div id="laporan-tab-content"></div>
      </div>`,E=document.getElementById("admin-modal-body");E&&(E.innerHTML=w);const b=document.getElementById("admin-modal-inner");b&&(b.className="modal modal-lg");const I=document.getElementById("admin-modal-footer");I&&(I.innerHTML='<button class="btn btn-primary" onclick="closeModal()" style="background:#2b1406;color:#fdf0e2;border:none;padding:8px 22px;font-weight:700;border-radius:8px;box-shadow:0 2px 8px rgba(43,20,6,0.2);">Tutup</button>'),window._laporanData={kehadiran:p,kemajuan:d,penilaian:g,pesertaId:l,namaPeserta:r},window.switchLaporanTab=A=>{["kehadiran","kemajuan","penilaian"].forEach(k=>{const $=document.getElementById(`ltab-${k}`);$&&(k===A?($.style.background="linear-gradient(135deg, #d97706, #F0AF43)",$.style.color="#1a0a02",$.style.border="none",$.style.fontWeight="800",$.style.boxShadow="0 2px 8px rgba(240,175,67,0.3)"):($.style.background="#ffffff",$.style.color="#4F280C",$.style.border="1.5px solid rgba(129,81,29,0.22)",$.style.fontWeight="600",$.style.boxShadow="none"))});const{kehadiran:F,kemajuan:y,penilaian:q}=window._laporanData,z=document.getElementById("laporan-tab-content");if(!z)return;const B=k=>{const $=String(k||"").toLowerCase();return $==="hadir"||$==="lancar"?`<span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(16,185,129,0.15);color:#047857;border:1px solid rgba(16,185,129,0.35);">● ${k}</span>`:$==="alpa"||$==="perlu_ulang"||$==="perlu_latihan"?`<span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(239,68,68,0.15);color:#b91c1c;border:1px solid rgba(239,68,68,0.35);">● ${k}</span>`:`<span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(249,115,22,0.15);color:#c2410c;border:1px solid rgba(249,115,22,0.35);">● ${k||"-"}</span>`};A==="kehadiran"?z.innerHTML=F.length===0?'<p style="color:#81511D;font-weight:600;text-align:center;padding:32px;background:#ffffff;border:1.5px dashed rgba(129,81,29,0.2);border-radius:10px;">Belum ada data riwayat kehadiran.</p>':`<div style="max-height:350px;overflow-y:auto;border:1.5px solid rgba(129,81,29,0.18);border-radius:10px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
              <table style="width:100%;border-collapse:collapse;font-size:13px;background:#ffffff;">
                <thead style="position:sticky;top:0;z-index:2;"><tr style="background:#2b1406;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Tanggal</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Status</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Materi</th>
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;">Catatan</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#F0AF43;letter-spacing:0.5px;text-transform:uppercase;width:80px;">Aksi</th>
                </tr></thead>
                <tbody>
                  ${F.map((k,$)=>`<tr id="lrow-kehadiran-${$}" style="background:${$%2===0?"#ffffff":"#fdfaf6"};border-bottom:1px solid rgba(129,81,29,0.1);">
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:12.5px;">${k.tanggal||"-"}</strong></td>
                    <td style="padding:9px 12px;">${B(k.status_hadir)}</td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-size:12.5px;font-weight:600;">${k.materi_pembahasan||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12px;line-height:1.45;">${k.catatan_sesi||k.perkembangan_materi||"-"}</span></td>
                    <td style="padding:9px 12px;text-align:center;">
                      <div style="display:flex;gap:5px;justify-content:center;">
                        <button title="Edit" onclick="editLaporan('kehadiran',${$})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(240,175,67,0.6);color:#b45309;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-pen"></i></button>
                        <button title="Hapus" onclick="hapusLaporan('kehadiran',${k.id||0},${$})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(239,68,68,0.5);color:#dc2626;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </div>`:A==="kemajuan"?z.innerHTML=y.length===0?'<p style="color:#81511D;font-weight:600;text-align:center;padding:32px;background:#ffffff;border:1.5px dashed rgba(129,81,29,0.2);border-radius:10px;">Belum ada data kemajuan hafalan.</p>':`<div style="max-height:350px;overflow-y:auto;border:1.5px solid rgba(129,81,29,0.18);border-radius:10px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
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
                  ${y.map((k,$)=>`<tr id="lrow-kemajuan-${$}" style="background:${$%2===0?"#ffffff":"#fdfaf6"};border-bottom:1px solid rgba(129,81,29,0.1);">
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:12.5px;">${k.tanggal||"-"}</strong></td>
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:13.5px;">${k.kitab_surat||"-"}</strong></td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12.5px;font-weight:600;">${k.halaman_ayat||"-"}</span></td>
                    <td style="padding:9px 12px;">${B(k.status_kelancaran)}</td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12px;line-height:1.45;">${k.catatan_hafalan||"-"}</span></td>
                    <td style="padding:9px 12px;text-align:center;">
                      <div style="display:flex;gap:5px;justify-content:center;">
                        <button title="Edit" onclick="editLaporan('kemajuan',${$})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(240,175,67,0.6);color:#b45309;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-pen"></i></button>
                        <button title="Hapus" onclick="hapusLaporan('kemajuan',${k.id||0},${$})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(239,68,68,0.5);color:#dc2626;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </div>`:A==="penilaian"&&(z.innerHTML=q.length===0?'<p style="color:#81511D;font-weight:600;text-align:center;padding:32px;background:#ffffff;border:1.5px dashed rgba(129,81,29,0.2);border-radius:10px;">Belum ada data penilaian.</p>':`<div style="max-height:350px;overflow-y:auto;border:1.5px solid rgba(129,81,29,0.18);border-radius:10px;background:#ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.03);">
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
                  ${q.map((k,$)=>`<tr id="lrow-penilaian-${$}" style="background:${$%2===0?"#ffffff":"#fdfaf6"};border-bottom:1px solid rgba(129,81,29,0.1);">
                    <td style="padding:9px 12px;"><strong style="color:#2b1406;font-size:12.5px;">${k.tanggal||"-"}</strong></td>
                    <td style="padding:9px 12px;"><b style="color:#059669;font-size:16px;">${k.nilai_angka||"-"}</b></td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-weight:600;font-size:13px;">${k.nilai_adab||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-weight:600;font-size:13px;">${k.nilai_tajwid||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#2b1406;font-weight:600;font-size:13px;">${k.nilai_kelancaran||"-"}</span></td>
                    <td style="padding:9px 12px;"><span style="color:#4F280C;font-size:12px;line-height:1.45;">${k.catatan||"-"}</span></td>
                    <td style="padding:9px 12px;text-align:center;">
                      <div style="display:flex;gap:5px;justify-content:center;">
                        <button title="Edit" onclick="editLaporan('penilaian',${$})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(240,175,67,0.6);color:#b45309;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fef3c7'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-pen"></i></button>
                        <button title="Hapus" onclick="hapusLaporan('penilaian',${k.id||0},${$})" style="padding:4px 9px;border-radius:6px;background:#ffffff;border:1.5px solid rgba(239,68,68,0.5);color:#dc2626;cursor:pointer;font-size:12px;transition:all 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#ffffff'"><i class="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>`).join("")}
                </tbody>
              </table>
            </div>`)},window.hapusLaporan=async(A,F,y)=>{const q={kehadiran:"kehadiran",kemajuan:"kemajuan",penilaian:"penilaian"};if(!F){t("ID data tidak ditemukan, tidak bisa dihapus.","error");return}if(confirm("Hapus data laporan ini secara permanen?"))try{await P.deleteRow(q[A],F),t("Data laporan berhasil dihapus!","success"),window.lihatLaporanPeserta(l,r,A)}catch(z){t("Gagal menghapus: "+z.message,"error")}},window.editLaporan=(A,F)=>{const y=window._laporanData[A][F];if(!y)return;let q="";A==="kehadiran"?q=`
            <div style="display:grid;gap:12px;color:#1a0a02;">
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Tanggal</label>
                <input type="date" id="el-tgl" value="${y.tanggal||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Status Hadir</label>
                <select id="el-status" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;">
                  ${["hadir","izin","sakit","alpa"].map(B=>`<option value="${B}" ${y.status_hadir===B?"selected":""}>${B}</option>`).join("")}
                </select></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Materi</label>
                <input type="text" id="el-materi" value="${y.materi_pembahasan||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Catatan Sesi</label>
                <textarea id="el-catatan" rows="2" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:500;">${y.catatan_sesi||y.perkembangan_materi||""}</textarea></div>
            </div>`:A==="kemajuan"?q=`
            <div style="display:grid;gap:12px;color:#1a0a02;">
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Tanggal</label>
                <input type="date" id="el-tgl" value="${y.tanggal||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Kitab/Surah</label>
                <input type="text" id="el-kitab" value="${y.kitab_surat||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Halaman/Ayat</label>
                <input type="text" id="el-halaman" value="${y.halaman_ayat||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Status Kelancaran</label>
                <select id="el-kelancaran" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;">
                  ${["lancar","cukup","perlu_latihan"].map(B=>`<option value="${B}" ${y.status_kelancaran===B?"selected":""}>${B}</option>`).join("")}
                </select></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Catatan Hafalan</label>
                <textarea id="el-catatan" rows="2" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:500;">${y.catatan_hafalan||""}</textarea></div>
            </div>`:A==="penilaian"&&(q=`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;color:#1a0a02;">
              <div style="grid-column:1/-1"><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Tanggal</label>
                <input type="date" id="el-tgl" value="${y.tanggal||""}" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Angka</label>
                <input type="number" id="el-nilai" value="${y.nilai_angka||""}" class="form-control" min="0" max="100" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Adab (1-5)</label>
                <input type="number" id="el-adab" value="${y.nilai_adab||""}" class="form-control" min="1" max="5" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Tajwid (1-5)</label>
                <input type="number" id="el-tajwid" value="${y.nilai_tajwid||""}" class="form-control" min="1" max="5" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Nilai Kelancaran (1-5)</label>
                <input type="number" id="el-kelnilai" value="${y.nilai_kelancaran||""}" class="form-control" min="1" max="5" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:600;" /></div>
              <div style="grid-column:1/-1"><label style="font-size:12px;font-weight:700;color:#4F280C;display:block;margin-bottom:4px;">Catatan</label>
                <textarea id="el-catatan" rows="2" class="form-control" style="background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);color:#2b1406;font-weight:500;">${y.catatan||""}</textarea></div>
            </div>`),Q(`Edit ${A.charAt(0).toUpperCase()+A.slice(1)} #${F+1}`,q,async()=>{var $,m,v,D,f,R,H,V,Y,Z,M,N,C,G,Ma,Da;let B={};const k={kehadiran:"kehadiran",kemajuan:"kemajuan",penilaian:"penilaian"};if(A==="kehadiran"?B={tanggal:($=document.getElementById("el-tgl"))==null?void 0:$.value,status_hadir:(m=document.getElementById("el-status"))==null?void 0:m.value,materi_pembahasan:((v=document.getElementById("el-materi"))==null?void 0:v.value)||null,catatan_sesi:((D=document.getElementById("el-catatan"))==null?void 0:D.value)||null,perkembangan_materi:((f=document.getElementById("el-catatan"))==null?void 0:f.value)||null}:A==="kemajuan"?B={tanggal:(R=document.getElementById("el-tgl"))==null?void 0:R.value,kitab_surat:(H=document.getElementById("el-kitab"))==null?void 0:H.value,halaman_ayat:(V=document.getElementById("el-halaman"))==null?void 0:V.value,status_kelancaran:(Y=document.getElementById("el-kelancaran"))==null?void 0:Y.value,catatan_hafalan:((Z=document.getElementById("el-catatan"))==null?void 0:Z.value)||null}:A==="penilaian"&&(B={tanggal:(M=document.getElementById("el-tgl"))==null?void 0:M.value,nilai_angka:parseFloat((N=document.getElementById("el-nilai"))==null?void 0:N.value)||null,nilai_adab:parseInt((C=document.getElementById("el-adab"))==null?void 0:C.value)||null,nilai_tajwid:parseInt((G=document.getElementById("el-tajwid"))==null?void 0:G.value)||null,nilai_kelancaran:parseInt((Ma=document.getElementById("el-kelnilai"))==null?void 0:Ma.value)||null,catatan:((Da=document.getElementById("el-catatan"))==null?void 0:Da.value)||null}),!y.id){t("ID tidak ditemukan, tidak bisa disimpan.","error");return}try{await P.updateRow(k[A],y.id,B),t("Data laporan berhasil diperbarui!","success"),window.lihatLaporanPeserta(l,r,A)}catch(me){t("Gagal update: "+me.message,"error")}});const z=document.querySelector("#admin-modal-footer .btn-ghost");z&&(z.onclick=()=>window.lihatLaporanPeserta(l,r,A))},window.switchLaporanTab(c)}catch(u){O(),t("Gagal memuat laporan: "+u.message,"error")}},document.getElementById("btn-tambah-peserta").addEventListener("click",()=>{Q("Tambah Peserta Didik Baru",Ka(null,i,n),async()=>{const l=Ra();if(!l.nama_lengkap){t("Isi nama peserta didik.","info");return}try{await P.createPeserta(l),t("Peserta didik berhasil didaftarkan!","success"),O(),ga(a,t)}catch(r){t("Gagal: "+r.message,"error")}}),handleJenisChange()})}function Ka(a,t,e){return`
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
        ${e.map(i=>{var n,s;return`<option value="${i.id}" data-mentor="${i.id_mentor||((n=i.mentor)==null?void 0:n.id)||""}" ${(a==null?void 0:a.id_kelas)===i.id?"selected":""}>${i.nama_kelas}${(s=i.mentor)!=null&&s.nama?" (Mentor: "+i.mentor.nama+")":""}</option>`}).join("")}
      </select></div>
    <div class="form-group"><label class="form-label">Assign Mentor</label>
      <select class="form-control" id="pf-mentor">
        <option value="">-- Pilih Mentor --</option>
        ${t.map(i=>`<option value="${i.id}" ${(a==null?void 0:a.id_mentor)===i.id?"selected":""}>${i.nama} (${i.jenis_mentor})</option>`).join("")}
      </select></div>
    <div class="form-group" style="grid-column:1/-1"><label class="form-label">Catatan Umum</label>
      <textarea class="form-control" id="pf-catatan" rows="2">${(a==null?void 0:a.catatan_umum)||""}</textarea></div>
  </div>`}function Ra(){var a,t,e,i,n,s,l;return{nama_lengkap:(t=(a=document.getElementById("pf-nama"))==null?void 0:a.value)==null?void 0:t.trim(),jenis_kelamin:(e=document.getElementById("pf-jk"))==null?void 0:e.value,jenis:(i=document.getElementById("pf-jenis"))==null?void 0:i.value,id_kelas:parseInt((n=document.getElementById("pf-kelas"))==null?void 0:n.value)||null,id_mentor:((s=document.getElementById("pf-mentor"))==null?void 0:s.value)||null,catatan_umum:(l=document.getElementById("pf-catatan"))==null?void 0:l.value}}window.handleKelasChange=()=>{const a=document.getElementById("pf-kelas"),t=document.getElementById("pf-mentor");if(!a||!t)return;const e=a.options[a.selectedIndex],i=e==null?void 0:e.getAttribute("data-mentor");i&&(t.value=i)};window.handleJenisChange=()=>{var e;const a=(e=document.getElementById("pf-jenis"))==null?void 0:e.value,t=document.getElementById("pf-kelas-group");t&&(t.style.display=a==="bimbel"?"":"none"),a==="bimbel"&&window.handleKelasChange()};async function Ee(a,t){a.innerHTML=`
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
      ${[["peserta_bimbel","groups","Peserta Bimbel"],["peserta_privat","person","Peserta Privat"],["mentor","co_present","Mentor"],["kelas","school","Kelas"],["kehadiran","calendar_month","Kehadiran"],["kemajuan","menu_book","Kemajuan"],["penilaian","grade","Penilaian"]].map(([e,i,n])=>`
      <div class="sheet-tab ${e==="peserta_bimbel"?"active":""}" data-tab="${e}" onclick="switchSSTab('${e}',this)">
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
  </div>`,L.ssActiveTab="peserta_bimbel",await ma("peserta_bimbel",t),document.getElementById("btn-batch-save").addEventListener("click",()=>Se(t)),window.switchSSTab=async(e,i)=>{document.querySelectorAll(".sheet-tab").forEach(n=>n.classList.remove("active")),i.classList.add("active"),L.ssActiveTab=e,L.ssDirtyRows.clear(),L.ssNewRows=[],await ma(e,t)},window.filterSS=e=>{L.ssFilter=e,se(L.ssData[L.ssActiveTab])},window.reloadSS=async()=>{await ma(L.ssActiveTab,t)},window.addSSRow=()=>Be(),window.exportSSTab=e=>{const i=L.ssData[L.ssActiveTab]||[];e==="csv"?Xa(i,`QIA_${L.ssActiveTab}`):ae(i,`QIA_${L.ssActiveTab}`,L.ssActiveTab)},window.deleteSSRow=async(e,i,n)=>{var r;if(!e)return;const s=((r=ha[i])==null?void 0:r.table)||i,l=n?`"${n}"`:"data ini";if(confirm(`Hapus ${l} secara permanen dari database?

Tindakan ini tidak dapat dibatalkan!`))try{i==="peserta"||i==="peserta_bimbel"||i==="peserta_privat"?await P.deletePeserta(e):await P.deleteRow(s,e),t("Data berhasil dihapus dari database! ✅","success"),await ma(i,t)}catch(c){t("Gagal menghapus: "+c.message,"error")}},window.exportAllSS=async()=>{t("Mengumpulkan semua data…","info");try{const e=await P.exportAllTables();ee(e,"QIA_DataLengkap"),t("Export berhasil!","success")}catch(e){t("Gagal export: "+e.message,"error")}}}const je={peserta_bimbel:new Set(["id","usia","id_kelas","id_mentor","nama_wali","email_wali","alamat","no_wa_wali","catatan_umum","created_at","updated_at"]),peserta_privat:new Set(["id","usia","id_kelas","id_mentor","nama_wali","email_wali","alamat","no_wa_wali","catatan_umum","created_at","updated_at"])},ha={peserta_bimbel:{table:"peserta_didik",fetch:async()=>(await P.getPesertaDidik({jenis:"bimbel"})).map(t=>{var e,i;return{nama_lengkap:t.nama_lengkap,jenis_kelamin:t.jenis_kelamin,jenis:t.jenis,kelas:((e=t.kelas)==null?void 0:e.nama_kelas)||"-",mentor:((i=t.mentor)==null?void 0:i.nama)||"-",status:t.status,_id:t.id}})},peserta_privat:{table:"peserta_didik",fetch:async()=>(await P.getPesertaDidik({jenis:"privat"})).map(t=>{var e;return{nama_lengkap:t.nama_lengkap,jenis_kelamin:t.jenis_kelamin,jenis:t.jenis,mentor:((e=t.mentor)==null?void 0:e.nama)||"-",status:t.status,_id:t.id}})},mentor:{table:"profiles",fetch:()=>P.getMentors()},kelas:{table:"kelas",fetch:()=>P.getKelas()},kehadiran:{table:"kehadiran",fetch:()=>P.exportAllData("kehadiran","*, peserta:peserta_didik(nama_lengkap), kelas(nama_kelas)")},kemajuan:{table:"kemajuan",fetch:()=>P.exportAllData("kemajuan","*, peserta:peserta_didik(nama_lengkap)")},penilaian:{table:"penilaian",fetch:()=>P.exportAllData("penilaian","*, peserta:peserta_didik(nama_lengkap)")}};async function ma(a,t){var s,l;const e=document.getElementById("ss-scroll");e.innerHTML='<div style="text-align:center;padding:48px;"><div class="spinner" style="margin:0 auto;width:36px;height:36px;"></div></div>';const i=document.getElementById("ss-table-name"),n={peserta_bimbel:"peserta_didik (bimbel)",peserta_privat:"peserta_didik (privat)"};i&&(i.textContent=n[a]||((s=ha[a])==null?void 0:s.table)||a);try{const r=await((l=ha[a])==null?void 0:l.fetch())||[];L.ssData[a]=r,se(r,t)}catch(r){e.innerHTML=`<div style="padding:40px;text-align:center;color:#e05c4b;"><i class="fa-solid fa-triangle-exclamation" style="font-size:32px;margin-bottom:12px;display:block;"></i>${r.message}</div>`,t("Gagal memuat data: "+r.message,"error")}}function se(a,t){const e=a||[],i=(L.ssFilter||"").toLowerCase(),n=i?e.filter(p=>Object.values(p).some(o=>String(o||"").toLowerCase().includes(i))):e,s=document.getElementById("ss-row-count"),l=document.getElementById("ss-row-total");if(s&&(s.textContent=`${n.length} dari ${e.length} baris`),l&&(l.textContent=n.length),n.length===0){document.getElementById("ss-scroll").innerHTML=`<div style="text-align:center;padding:60px 24px;color:#81511D;">
      <div style="font-size:42px;margin-bottom:12px;opacity:0.4;">🔍</div>
      <p>Tidak ada data yang cocok dengan filter.</p>
    </div>`;return}const r=je[L.ssActiveTab]||new Set,c=n[0],u=Object.entries(c).filter(([p,o])=>(typeof o!="object"||o===null)&&!r.has(p)&&p!=="_id").map(([p])=>p),d=new Set(["nama_lengkap","nama","jenis","status","jenis_kelamin","no_hp","jenis_mentor","nama_kelas","hari_jadwal","jam_jadwal","kapasitas","status_hadir","materi_pembahasan","catatan_sesi","perkembangan_materi","kitab_surat","halaman_ayat","status_kelancaran","catatan_hafalan","nilai_angka","nilai_adab","nilai_tajwid","nilai_kelancaran","catatan","deskripsi"]),g=document.getElementById("ss-scroll");g.innerHTML=`
  <table class="ss-table" id="ss-table-el">
    <thead>
      <tr>
        <th class="ss-th row-num header-row-num" style="width:36px;min-width:36px;">#</th>
        ${u.map(p=>`<th class="ss-th">${p}</th>`).join("")}
        <th class="ss-th" style="width:48px;min-width:48px;text-align:center;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      ${n.map((p,o)=>`
      <tr id="ss-tr-${o}" class="${L.ssDirtyRows.has(p.id||p._id)?"row-dirty":""}">
        <td class="row-num" style="width:36px;min-width:36px;font-size:11px;">${o+1}</td>
        ${u.map(_=>{const w=p[_];return`<td class="ss-cell" data-row="${o}" data-col="${_}" data-id="${p.id||p._id||""}">
            <div class="ss-cell-inner ${le(_,w)}" title="${w||""}">${w==null?"":String(w)}</div>
          </td>`}).join("")}
        <td style="text-align:center;padding:4px 6px;border-right:1px solid #e8edf2;border-bottom:1px solid #e8edf2;">
          <button class="btn btn-ghost btn-sm" style="color:#ef4444;padding:3px 7px;border-radius:4px;cursor:pointer;" title="Hapus dari database" onclick="deleteSSRow('${p.id||p._id||""}', '${L.ssActiveTab}', '${(p.nama_lengkap||p.nama||"").replace(/'/g,"\\'")}')">
            <i class="fa-solid fa-trash-can" style="font-size:12px;"></i>
          </button>
        </td>
      </tr>`).join("")}
    </tbody>
  </table>`,g.querySelectorAll(".ss-cell").forEach(p=>{p.addEventListener("click",function(){if(this.classList.contains("cell-editing"))return;const o=this.dataset.col,_=parseInt(this.dataset.row),w=this.dataset.id;d.has(o)&&ze(this,n[_],o,_,w)})})}function ze(a,t,e,i,n,s,l){document.querySelectorAll(".ss-cell.cell-editing").forEach(o=>o.classList.remove("cell-editing")),a.classList.add("cell-editing");const r=t[e],c=a.querySelector(".ss-cell-inner");c.style.display="none";const u={status:["aktif","nonaktif","lulus"],status_hadir:["hadir","izin","sakit","alpa"],jenis:["bimbel","privat"],jenis_mentor:["bimbel","privat","keduanya"],status_kelancaran:["lancar","cukup","perlu_ulang"],jenis_kelamin:["L","P"]};let d;u[e]?(d=document.createElement("select"),d.className="ss-cell-editor-select",u[e].forEach(o=>{const _=document.createElement("option");_.value=o,_.textContent=o,o===String(r)&&(_.selected=!0),d.appendChild(_)})):(d=document.createElement("input"),d.type="text",d.className="ss-cell-editor",d.value=r==null?"":String(r)),a.appendChild(d),d.focus(),d.select&&d.select();const g=()=>{const o=d.tagName==="SELECT"?d.value:d.value.trim();if(a.removeChild(d),c.style.display="",c.textContent=o,c.className=`ss-cell-inner ${le(e,o)}`,a.classList.remove("cell-editing"),String(o)!==String(r||"")){t[e]=o,L.ssDirtyRows.add(n||i);const _=document.getElementById("ss-tr-"+i);_&&_.classList.add("row-dirty"),document.getElementById("ss-dirty-count").style.display="";const w=document.getElementById("btn-batch-save");w&&(w.disabled=!1)}},p=()=>{a.removeChild(d),c.style.display="",a.classList.remove("cell-editing")};d.addEventListener("blur",g),d.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),g()),o.key==="Escape"&&p()})}function Be(){const t=document.getElementById("ss-scroll").querySelector("tbody");if(!t)return;const e=t.rows.length,i=document.createElement("tr");i.id=`ss-tr-${e}`,i.classList.add("row-new"),i.innerHTML=`<td class="row-num">NEW</td><td colspan="20" style="padding:12px 16px;"><input type="text" placeholder="Gunakan form 'Tambah Peserta Didik' untuk baris baru yang valid…" style="width:100%;background:transparent;border:none;outline:none;font-size:13px;color:#81511D;" readonly /></td>`,t.appendChild(i),i.scrollIntoView({behavior:"smooth"})}async function Se(a){var l;const t=L.ssActiveTab,i=(L.ssData[t]||[]).filter(r=>L.ssDirtyRows.has(r.id)||L.ssDirtyRows.has(String(r.id)));if(i.length===0){a("Tidak ada perubahan.","info");return}const n=document.getElementById("btn-batch-save");if(n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…',!((l=ha[t])==null?void 0:l.table)){a("Tabel tidak dikenali.","error");return}try{const r=i.map(c=>{const{peserta:u,mentor:d,kelas:g,...p}=c;return p});await P.bulkUpdatePeserta(r),L.ssDirtyRows.clear(),document.getElementById("ss-dirty-count").style.display="none",a(`${i.length} baris berhasil disimpan! ✅`,"success"),n.disabled=!0,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan',await ma(t,a)}catch(r){a("Gagal menyimpan: "+r.message,"error"),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Semua Perubahan'}}function le(a,t){return t?a==="status"?t==="aktif"?"text-green":t==="nonaktif"?"text-red":"":a==="status_hadir"?t==="hadir"?"text-green":t==="alpa"?"text-red":t==="izin"?"text-yellow":"text-blue":a==="status_kelancaran"?t==="lancar"?"text-green":t==="perlu_ulang"?"text-red":"text-yellow":"":""}function Fe(a,t){a.innerHTML=`
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
  </div>`,window.doExport=async(e,i)=>{var n;t("Mengambil data…","info");try{const s=await((n=ha[e])==null?void 0:n.fetch())||[];i==="csv"&&Xa(s,`QIA_${e}`),i==="excel"&&ae(s,`QIA_${e}`,e),i==="json"&&ke(s,`QIA_${e}`),t("Export berhasil!","success")}catch(s){t("Gagal export: "+s.message,"error")}},document.getElementById("btn-export-all").addEventListener("click",async()=>{t("Mengumpulkan semua data…","info");try{const e=await P.exportAllTables();ee(e,"QIA_DataLengkap"),t("Export berhasil!","success")}catch(e){t("Gagal: "+e.message,"error")}})}async function Pe(a,t){a.innerHTML=`<div class="page-header">
    <div class="page-title">Log <span>Aktivitas</span></div>
  </div>
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th><th>ID</th></tr></thead>
      <tbody id="activity-tbody"><tr><td colspan="5" style="text-align:center;padding:28px;"><div class="spinner" style="margin:0 auto;width:28px;height:28px;"></div></td></tr></tbody>
    </table>
  </div>`;try{const e=await P.getDashboardStats(),i=(e==null?void 0:e.aktivitas_terbaru)||[];document.getElementById("activity-tbody").innerHTML=i.length===0?'<tr><td colspan="5" style="text-align:center;padding:28px;color:#81511D;">Belum ada log aktivitas.</td></tr>':i.map(n=>{var s;return`<tr>
        <td style="font-size:12px;">${oe(n.created_at)}</td>
        <td style="font-size:12px;">${((s=n.id_user)==null?void 0:s.slice(0,8))||"system"}…</td>
        <td><span style="font-weight:600;">${n.action}</span></td>
        <td>${n.entity_type||"-"}</td>
        <td style="font-size:12px;">${n.entity_id||"-"}</td>
      </tr>`}).join("")}catch{t("Gagal memuat log.","error")}}function Q(a,t,e){document.getElementById("admin-modal-title").textContent=a,document.getElementById("admin-modal-body").innerHTML=t;const i=document.getElementById("admin-modal-footer");e?(i.innerHTML=`
    <button class="btn btn-ghost" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" id="modal-save-btn"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>`,document.getElementById("modal-save-btn").addEventListener("click",e)):i.innerHTML='<button class="btn btn-ghost" onclick="closeModal()">Tutup</button>';const n=document.getElementById("admin-modal-inner");n.className=t.length>1500?"modal modal-lg":"modal",document.getElementById("admin-modal").classList.add("show")}function O(){document.getElementById("admin-modal").classList.remove("show")}window.closeModal=O;function re(a){return`<span class="badge ${{bimbel:"badge-gold",privat:"badge-emerald",keduanya:"badge-blue"}[a]||"badge-gray"}">${a||"-"}</span>`}function Pa(a){return a==="aktif"?'<span class="badge badge-emerald">● Aktif</span>':`<span class="badge badge-red">● ${a}</span>`}function oe(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"-"}let x={profile:null,kelasList:[],pesertaList:[],activeView:"dashboard",selectedKelas:null,selectedPeserta:null,absensiRows:[]},Ba=null;function K(a,t="info",e=3500){typeof Ba=="function"?Ba(a,t,e):typeof window.showToast=="function"?window.showToast(a,t,e):console.log(`[Toast ${t}]:`,a)}async function de(a,t,e){document.title="Portal Asatidz — Quran Insight Academy",Ba=e,e&&(window.showToast=e);try{if(x.profile=await ia.getProfile(),!x.profile||x.profile.role!=="mentor"){Ha(a,t,e);return}}catch{Ha(a,t,e);return}a.innerHTML=Le(),Ie(t,e),await Me(e),ta("dashboard",e)}function Ha(a,t,e){a.innerHTML=`
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
  </div>`,document.getElementById("mentor-login-form").addEventListener("submit",async n=>{n.preventDefault();const s=document.getElementById("mentor-login-email").value,l=document.getElementById("mentor-login-pwd").value,r=document.getElementById("btn-submit-mentor-login");r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Masuk…';try{await ia.login(s,l),e("Berhasil masuk sebagai Asatidz!","success"),de(a,t,e)}catch(c){e("Gagal masuk: "+c.message,"error"),r.disabled=!1,r.innerHTML='<i class="fa-solid fa-right-to-bracket mr-1"></i> Masuk Portal Asatidz'}})}function Le(){return`
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
      <div class="nav-item" data-view="kelas" id="nav-kelas" style="${da()?"":"display:none"}">
        <i class="fa-solid fa-chalkboard-user"></i> Kelas Saya
      </div>
      <div class="nav-item" data-view="absensi-massal" id="nav-absensi" style="${da()?"":"display:none"}">
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
</div>`}function da(){var a,t;return((a=x.profile)==null?void 0:a.jenis_mentor)==="bimbel"||((t=x.profile)==null?void 0:t.jenis_mentor)==="keduanya"}function Ie(a,t){var e,i;document.getElementById("sidebar-toggle").addEventListener("click",()=>{document.getElementById("sidebar").classList.toggle("open"),document.getElementById("sidebar-overlay").classList.toggle("show")}),document.getElementById("sidebar-overlay").addEventListener("click",()=>{document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}),(e=document.getElementById("mentor-modal-close"))==null||e.addEventListener("click",()=>{J()}),(i=document.getElementById("mentor-modal"))==null||i.addEventListener("click",n=>{n.target.id==="mentor-modal"&&J()}),document.querySelectorAll(".nav-item[data-view]").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.view;ta(s,t)})}),document.getElementById("btn-logout").addEventListener("click",async()=>{await ia.logout(),a("/")})}async function Me(a){var t,e;try{const i=x.profile.id;x.kelasList=await T.getMyKelas(i),x.pesertaList=await T.getMyPeserta(i),document.getElementById("user-name").textContent=x.profile.nama||x.profile.email,document.getElementById("user-role-label").textContent=U(x.profile.jenis_mentor),document.getElementById("user-avatar").textContent=(x.profile.nama||"M").charAt(0),da()&&((t=document.getElementById("nav-kelas"))==null||t.removeAttribute("style"),(e=document.getElementById("nav-absensi"))==null||e.removeAttribute("style"))}catch(i){a("Gagal memuat data: "+i.message,"error")}}function De(a){document.querySelectorAll(".nav-item[data-view]").forEach(e=>e.classList.remove("active"));const t=document.getElementById("nav-"+a.replace("-list","santri").replace("-massal","absensi").replace("-detail","santri"));t&&t.classList.add("active")}function ta(a,t){x.activeView=a,De(a);const e=document.getElementById("main-content");switch(a){case"dashboard":Na(e,t);break;case"kelas":Ce(e,t);break;case"absensi-massal":qe(e,t);break;case"santri-list":Re(e,t);break;case"ganti-password":He(e,t);break;default:Na(e,t)}document.getElementById("sidebar").classList.remove("open"),document.getElementById("sidebar-overlay").classList.remove("show")}function Na(a,t){var n;const e=x.pesertaList.filter(s=>s.jenis==="bimbel").length,i=x.pesertaList.filter(s=>s.jenis==="privat").length;a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Dashboard <span>Mentor</span></div>
      <div class="page-breadcrumb">Selamat datang, ${((n=x.profile)==null?void 0:n.nama)||"—"}</div>
    </div>
    <div style="font-size:13px;color:var(--text-muted);">
      <i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
    </div>
  </div>

  <!-- Stats -->
  <div class="grid-4" style="margin-bottom:28px;">
    ${[[`${x.pesertaList.length}`,"Total Peserta Didik","fa-users","stat-icon-gold"],[e,"Peserta Didik Bimbel","fa-chalkboard-user","stat-icon-emerald"],[i,"Peserta Didik Privat","fa-user-graduate","stat-icon-brown"],[`${x.kelasList.length}`,"Kelas Aktif","fa-door-open","stat-icon-blue"]].map(([s,l,r,c])=>`
    <div class="stat-card anim-fadeInUp">
      <div class="stat-icon ${c}"><i class="fa-solid ${r}" style="color:white;"></i></div>
      <div><div class="stat-value">${s}</div><div class="stat-label">${l}</div></div>
    </div>`).join("")}
  </div>

  <!-- Shortcut actions -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;">
    ${da()?`
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
    ${da()?`
    <button onclick="renderMentorView('kelas')"
      style="background:var(--bg-card);color:var(--cream-100);
      padding:20px;border-radius:16px;border:1px solid var(--border-dark);cursor:pointer;text-align:left;
      font-family:inherit;transition:all 0.2s;"
      onmouseover="this.style.borderColor='var(--gold-500)'" onmouseout="this.style.borderColor='var(--border-dark)'">
      <i class="fa-solid fa-chalkboard" style="font-size:24px;color:#10b981;margin-bottom:10px;display:block;"></i>
      <div style="font-weight:700;font-size:15px;">Kelas Saya</div>
      <div style="font-size:12px;color:var(--text-card-muted);margin-top:4px;">${x.kelasList.length} kelas aktif</div>
    </button>`:""}
  </div>

  <!-- Daftar santri ringkas -->
  <div class="card">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <h3 style="color:var(--cream-100);font-size:14px;">Peserta Didik Bimbingan Saya</h3>
      <button onclick="renderMentorView('santri-list')" class="btn btn-ghost btn-sm">Lihat Semua →</button>
    </div>
    ${x.pesertaList.length===0?'<p style="color:var(--text-card-muted);font-size:14px;">Belum ada peserta didik yang ditugaskan.</p>':`<div style="display:flex;flex-direction:column;gap:8px;">
        ${x.pesertaList.slice(0,6).map(s=>{var l;return`
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
            <div style="font-size:11px;color:var(--text-card-muted);">${((l=s.kelas)==null?void 0:l.nama_kelas)||U(s.jenis)}</div>
          </div>
          <span class="${s.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${s.jenis}</span>
        </div>`}).join("")}
      </div>`}
  </div>`,window.renderMentorView=s=>ta(s,t),window.openSantriDetail=s=>La(s,a,t)}function Ce(a,t){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Kelas <span>Saya</span></div>
      <div class="page-breadcrumb">${x.kelasList.length} kelas aktif yang Anda ampu</div>
    </div>
    <button onclick="renderMentorView('absensi-massal')" class="btn btn-primary">
      <i class="fa-solid fa-clipboard-list"></i> Absensi Massal
    </button>
  </div>
  <div class="grid-3">
    ${x.kelasList.length===0?'<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon"><span class="ms" style="font-size:40px;color:var(--gold-400);">school</span></div><h3>Belum ada kelas</h3><p>Anda belum memiliki kelas aktif.</p></div></div>':x.kelasList.map(e=>{const i=x.pesertaList.filter(n=>n.id_kelas===e.id);return`
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
  </div>`,window.renderMentorView=e=>ta(e,t),window.openAbsensiMassal=e=>{x.selectedKelas=x.kelasList.find(i=>i.id===e)||null,ta("absensi-massal",t)}}function qe(a,t){var i;const e=new Date().toISOString().slice(0,10);a.innerHTML=`
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
          ${x.kelasList.map(n=>{var s;return`<option value="${n.id}" ${((s=x.selectedKelas)==null?void 0:s.id)===n.id?"selected":""}>${n.nama_kelas}</option>`}).join("")}
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
  </div>`,document.getElementById("btn-load-absensi").addEventListener("click",()=>{const n=parseInt(document.getElementById("absensi-kelas-select").value);if(!n){t("Pilih kelas terlebih dahulu.","info");return}x.selectedKelas=x.kelasList.find(l=>l.id===n);const s=x.pesertaList.filter(l=>l.id_kelas===n);if(s.length===0){t("Tidak ada peserta didik di kelas ini.","info");return}x.absensiRows=s.map(l=>({id_peserta:l.id,nama:l.nama_lengkap,status_hadir:"hadir",perkembangan_materi:"",catatan:""})),Te(s)}),(i=document.getElementById("btn-simpan-absensi"))==null||i.addEventListener("click",()=>Ke(t)),window.setAllStatus=n=>{x.absensiRows.forEach(s=>s.status_hadir=n),document.querySelectorAll(".status-select").forEach(s=>{s.value=n,updateRowStyle(s)})},window.renderMentorView=n=>ta(n,t)}function Te(a){const t=document.getElementById("absensi-table-wrapper"),e=document.getElementById("absensi-tbody");t.style.display="block",document.getElementById("absensi-count-label").textContent=`${a.length} peserta didik dalam kelas`,e.innerHTML=x.absensiRows.map((i,n)=>`
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
        <option value="hadir"  ${i.status_hadir==="hadir"?"selected":""} style="color:#059669;">● Hadir</option>
        <option value="izin"   ${i.status_hadir==="izin"?"selected":""} style="color:#d97706;">◐ Izin</option>
        <option value="sakit"  ${i.status_hadir==="sakit"?"selected":""} style="color:#3b82f6;">◑ Sakit</option>
        <option value="alpa"   ${i.status_hadir==="alpa"?"selected":""} style="color:#dc2626;">○ Alpa</option>
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
  </tr>`).join(""),window.updateAbsensiStatus=i=>{const n=parseInt(i.dataset.idx);x.absensiRows[n].status_hadir=i.value,updateRowStyle(i)},window.updateAbsensiField=(i,n)=>{const s=parseInt(i.dataset.idx);x.absensiRows[s][n]=i.value},window.updateRowStyle=i=>{const n={hadir:"rgba(16,185,129,0.08)",izin:"rgba(240,175,67,0.08)",sakit:"rgba(59,130,246,0.08)",alpa:"rgba(239,68,68,0.08)"},s=parseInt(i.dataset.idx),l=document.getElementById("absensi-row-"+s);l&&(l.style.background=n[i.value]||"")}}async function Ke(a){var r,c,u,d,g,p;const t=(r=x.selectedKelas)==null?void 0:r.id,e=(c=document.getElementById("absensi-tanggal"))==null?void 0:c.value,i=(d=(u=document.getElementById("absensi-materi"))==null?void 0:u.value)==null?void 0:d.trim(),n=(p=(g=document.getElementById("absensi-catatan"))==null?void 0:g.value)==null?void 0:p.trim();if(!t||!e){a("Pilih kelas dan tanggal.","info");return}if(x.absensiRows.length===0){a("Muat daftar peserta didik terlebih dahulu.","info");return}const s=document.getElementById("btn-simpan-absensi");s.disabled=!0,s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';const l=x.absensiRows.map(o=>({id_peserta:o.id_peserta,id_mentor:x.profile.id,id_kelas:t,tanggal:e,status_hadir:o.status_hadir,materi_pembahasan:i||null,perkembangan_materi:o.perkembangan_materi||null,catatan_sesi:n||null||o.catatan||null}));try{await T.bulkSimpanAbsensi(l),a(`Absensi ${l.length} peserta didik berhasil disimpan! ✅`,"success"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}catch(o){a("Gagal menyimpan: "+o.message,"error"),s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Absensi & Materi'}}function Re(a,t){a.innerHTML=`
  <div class="page-header">
    <div>
      <div class="page-title">Daftar <span>Peserta Didik</span></div>
      <div class="page-breadcrumb">${x.pesertaList.length} peserta didik bimbingan Anda</div>
    </div>
    <div class="search-wrapper">
      <i class="fa-solid fa-magnifying-glass search-icon" style="color:var(--brown-400);"></i>
      <input type="text" id="santri-search" placeholder="Cari nama peserta didik…"
        class="form-control-light search-input" style="min-width:240px;" />
    </div>
  </div>

  <!-- Kelas filter tabs (bimbel only) -->
  ${da()&&x.kelasList.length>0?`
  <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;">
    <button class="btn btn-primary btn-sm active-kelas-tab" data-kelas-filter="all" onclick="filterByKelas('all',this)">Semua</button>
    ${x.kelasList.map(e=>`<button class="btn btn-ghost btn-sm" data-kelas-filter="${e.id}" onclick="filterByKelas('${e.id}',this)">${e.nama_kelas}</button>`).join("")}
    <button class="btn btn-ghost btn-sm" data-kelas-filter="privat" onclick="filterByKelas('privat',this)">Privat</button>
  </div>`:""}

  <div id="santri-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>`,window.currentKelasFilter="all",window.filterByKelas=(e,i)=>{var n;document.querySelectorAll("[data-kelas-filter]").forEach(s=>{s.classList.remove("btn-primary"),s.classList.add("btn-ghost")}),i.classList.remove("btn-ghost"),i.classList.add("btn-primary"),window.currentKelasFilter=e,ja(Wa(((n=document.getElementById("santri-search"))==null?void 0:n.value)||"",e))},window.openSantriDetail=e=>La(e,a,t),window.renderMentorView=e=>ta(e,t),document.getElementById("santri-search").addEventListener("input",e=>{ja(Wa(e.target.value,window.currentKelasFilter||"all"))}),ja(x.pesertaList)}function Wa(a,t){return x.pesertaList.filter(e=>{const i=!a||e.nama_lengkap.toLowerCase().includes(a.toLowerCase());return t==="all"?i:t==="privat"?i&&e.jenis==="privat":i&&String(e.id_kelas)===String(t)})}function ja(a,t){const e=document.getElementById("santri-grid");if(e){if(a.length===0){e.innerHTML=`<div style="grid-column:1/-1"><div class="empty-state">
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
        <div style="font-size:11.5px;color:var(--text-card-muted);">${((n=i.kelas)==null?void 0:n.nama_kelas)||U(i.jenis)}</div>
      </div>
      <span class="${i.jenis==="bimbel"?"badge badge-gold":"badge badge-emerald"}">${i.jenis}</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="event.stopPropagation();openSantriDetail(${i.id})" class="btn btn-secondary btn-sm" style="flex:1;">
        <i class="fa-solid fa-eye"></i> Detail
      </button>
    </div>
  </div>`}).join("")}}function La(a,t,e){var n,s;const i=x.pesertaList.find(l=>l.id===a);i&&(x.selectedPeserta=i,t.innerHTML=`
  <div class="page-header" style="margin-bottom:20px;">
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <button onclick="renderMentorView('santri-list')" class="btn btn-secondary btn-sm" style="display:inline-flex;align-items:center;gap:6px;font-weight:700;">
        <i class="fa-solid fa-arrow-left"></i> Kembali ke Daftar
      </button>
      <div>
        <div class="page-title" style="font-size:1.5rem;font-weight:800;color:var(--brown-900);">Detail <span>Peserta Didik</span></div>
        <div class="page-breadcrumb" style="font-size:13px;color:var(--text-muted);font-weight:600;">${S(i.nama_lengkap)} • ${S(((n=i.kelas)==null?void 0:n.nama_kelas)||U(i.jenis))}</div>
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
            ${S(i.nama_lengkap.charAt(0))}
          </div>
          <div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <h2 style="margin:0;font-size:1.35rem;color:#ffffff;font-weight:800;letter-spacing:0.3px;">${S(i.nama_lengkap)}</h2>
              <span style="background:${i.jenis==="bimbel"?"#78350f":"#064e3b"};color:${i.jenis==="bimbel"?"#fde68a":"#a7f3d0"};border:1px solid ${i.jenis==="bimbel"?"#f59e0b":"#10b981"};padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;">${U(i.jenis)}</span>
              <span style="background:${i.status==="aktif"?"#064e3b":"#450a0a"};color:${i.status==="aktif"?"#a7f3d0":"#fecaca"};border:1px solid ${i.status==="aktif"?"#10b981":"#ef4444"};padding:3px 10px;border-radius:14px;font-size:11.5px;font-weight:800;">${(i.status||"aktif").toUpperCase()}</span>
            </div>
            <div style="font-size:13px;color:#e8d4bc;margin-top:4px;font-weight:500;">
              ${i.usia?i.usia+" Tahun":""} ${i.jenis_kelamin?"• "+(i.jenis_kelamin==="L"?"Ikhwan (L)":"Akhwat (P)"):""} • ID Santri: <strong style="color:#F0AF43;font-weight:800;">#${i.id}</strong>
            </div>
          </div>
        </div>

        <!-- Tombol Kanan: Tambah Laporan + PDF/WA Share -->
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="btn-tambah-laporan-top" onclick="window.openTambahLaporanModal(${a})" style="display:inline-flex;align-items:center;gap:8px;padding:11px 22px;font-weight:800;font-size:14px;background:linear-gradient(135deg,#F0AF43,#d97706);color:#1a0a02;border:none;border-radius:10px;box-shadow:0 4px 16px rgba(240,175,67,0.4);cursor:pointer;">
            <i class="fa-solid fa-plus-circle"></i> Tambah Laporan
          </button>
          <button id="btn-share-report" onclick="window.openShareModal(${a})" title="Kirim laporan ke Orang Tua" style="display:inline-flex;align-items:center;gap:8px;padding:11px 18px;font-weight:800;font-size:14px;background:linear-gradient(135deg,#25D366,#128C7E);color:#ffffff;border:none;border-radius:10px;box-shadow:0 4px 16px rgba(37,211,102,0.35);cursor:pointer;">
            <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> PDF & Kirim WA
          </button>
        </div>
      </div>

      <!-- Detail Info Siswa (Grid) -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin-top:18px;">
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;">Kelas / Kelompok</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            <i class="fa-solid fa-chalkboard-user" style="color:#F0AF43;margin-right:6px;"></i> ${S(((s=i.kelas)==null?void 0:s.nama_kelas)||U(i.jenis))}
          </div>
        </div>
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;display:flex;align-items:center;justify-content:space-between;">
            <span>Orang Tua / Wali</span>
            <button onclick="window.openEditKontakWaliModal(${a})" style="background:none;border:none;color:#F0AF43;cursor:pointer;font-size:11px;font-weight:800;text-decoration:underline;padding:0;" title="Edit kontak wali">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          </div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            <i class="fa-solid fa-user-shield" style="color:#F0AF43;margin-right:6px;"></i> ${S(i.nama_wali||"Belum diisi")}
          </div>
        </div>
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;display:flex;align-items:center;justify-content:space-between;">
            <span>No. WhatsApp Wali</span>
            <button onclick="window.openEditKontakWaliModal(${a})" style="background:none;border:none;color:#F0AF43;cursor:pointer;font-size:11px;font-weight:800;text-decoration:underline;padding:0;" title="Input / Edit nomor WhatsApp wali">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          </div>
          <div id="peserta-no-wa-wrapper" style="font-size:14px;color:#ffffff;font-weight:700;">
            ${i.no_wa_wali?`<a href="https://wa.me/${Ia(i.no_wa_wali)}" target="_blank" rel="noopener noreferrer" style="color:#4ade80;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"><i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> ${S(i.no_wa_wali)}</a>`:'<span style="color:#fca5a5;font-size:12.5px;">⚠️ Belum diisi · <a href="javascript:void(0)" onclick="window.openEditKontakWaliModal('+a+')" style="color:#F0AF43;font-weight:800;">+ Input No. WA</a></span>'}
          </div>
        </div>
        <div>
          <div style="font-size:11.5px;color:#F0AF43;text-transform:uppercase;letter-spacing:0.5px;font-weight:800;margin-bottom:3px;">Tanggal Terdaftar</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">
            <i class="fa-solid fa-calendar-check" style="color:#F0AF43;margin-right:6px;"></i> ${ua(i.tanggal_daftar)}
          </div>
        </div>
      </div>

      ${i.alamat||i.catatan_umum||i.email_wali?`
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:14px;margin-top:16px;padding-top:16px;border-top:1px dashed rgba(240,175,67,0.3);font-size:13.5px;">
          ${i.email_wali?`<div><span style="color:#F0AF43;font-weight:700;">Email Wali:</span> <span style="color:#ffffff;font-weight:600;">${S(i.email_wali)}</span></div>`:""}
          ${i.alamat?`<div><span style="color:#F0AF43;font-weight:700;">Alamat:</span> <span style="color:#ffffff;font-weight:600;">${S(i.alamat)}</span></div>`:""}
          ${i.catatan_umum?`<div><span style="color:#F0AF43;font-weight:700;">Catatan Umum:</span> <span style="color:#ffffff;font-weight:600;">${S(i.catatan_umum)}</span></div>`:""}
        </div>
      `:""}
    </div>

    <!-- Card Rekapan Laporan (Bimbel: Bulanan / Privat: Paket) -->
    <div id="rekapan-section-container" class="card" style="padding:22px 26px;border:1.5px solid rgba(240,175,67,0.45);background:#180902;border-radius:16px;box-shadow:0 8px 32px rgba(26,10,2,0.35);">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1px solid rgba(240,175,67,0.25);">
        <div>
          <h3 style="color:#ffffff;margin:0 0 4px;font-size:1.2rem;font-weight:800;display:flex;align-items:center;gap:10px;">
            <i class="fa-solid fa-file-invoice" style="color:#F0AF43;"></i>
            <span>${i.jenis==="privat"?"Rekapan Paket Program Privat":"Rekapan Bulanan Santri Bimbel"}</span>
          </h3>
          <div style="font-size:12.5px;color:#e8d4bc;font-weight:500;">
            ${i.jenis==="privat"?"Tentukan jumlah pertemuan paket secara fleksibel. Ketika paket selesai, buat rekapan untuk disinkronkan ke wali.":"Terbitkan rekapan resmi per bulan untuk capaian hafalan, rata-rata nilai, dan evaluasi bulanan."}
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.openBuatRekapModal(${a})" style="display:inline-flex;align-items:center;gap:8px;font-weight:800;padding:10px 20px;font-size:13.5px;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;border:none;border-radius:10px;box-shadow:0 4px 14px rgba(16,185,129,0.35);cursor:pointer;">
          <i class="fa-solid fa-plus-circle"></i> ${i.jenis==="privat"?"Rekap Paket Selesai":"Buat Rekapan Bulanan"}
        </button>
      </div>

      <!-- Container list rekapan tersimpan -->
      <div id="rekapan-cards-list" style="margin-top:16px;">
        <div style="font-size:13px;color:#d8bfa2;text-align:center;padding:16px;">
          <i class="fa-solid fa-spinner fa-spin"></i> Memuat data rekapan…
        </div>
      </div>
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
  </div>`,window.renderMentorView=l=>ta(l,e),ra(a))}async function ra(a,t){var n;const e=document.getElementById("laporan-history-list"),i=document.getElementById("rekapan-cards-list");if(e)try{const[s,l,r,c]=await Promise.all([T.getRiwayatKehadiran(a,50),T.getKemajuan(a,50),T.getPenilaian(a,50),T.getRekapanList(a)]),u=document.getElementById("histori-count-badge");u&&(u.textContent=`${s.length} Sesi Tercatat • ${c.length} Rekapan`);const d={};l.forEach(o=>{o.tanggal&&!d[o.tanggal]&&(d[o.tanggal]=o)});const g={};r.forEach(o=>{o.tanggal&&!g[o.tanggal]&&(g[o.tanggal]=o)});const p={};if(c.forEach(o=>{Array.isArray(o.sesi_ids)&&o.sesi_ids.forEach(_=>{p[_]=o.judul_rekap})}),window._currentPesertaHistory={pesertaId:a,kehadiranList:s,kemajuanList:l,penilaianList:r,kemajuanByDate:d,penilaianByDate:g,rekapanList:c,sesiToRekapMap:p},i&&(c.length===0?i.innerHTML=`
        <div style="padding:16px 20px;background:#200d03;border:1.5px dashed rgba(240,175,67,0.35);border-radius:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div style="font-size:13px;color:#e8d4bc;">
            Belum ada rekapan resmi yang diterbitkan untuk peserta ini. Klik tombol <strong>"${((n=x.selectedPeserta)==null?void 0:n.jenis)==="privat"?"Rekap Paket Selesai":"Buat Rekapan Bulanan"}"</strong> untuk membuat rekapan.
          </div>
        </div>`:i.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${c.map(o=>`
          <div style="background:#200d03;border:1.5px solid rgba(16,185,129,0.35);border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span style="font-size:15px;font-weight:800;color:#ffffff;display:inline-flex;align-items:center;gap:8px;">
                  <i class="fa-solid fa-award" style="color:#10b981;"></i> ${S(o.judul_rekap)}
                </span>
                <span style="background:#064e3b;color:#a7f3d0;border:1px solid #10b981;font-size:11px;font-weight:800;padding:2px 8px;border-radius:10px;">
                  ${o.total_sesi} Sesi
                </span>
                ${o.tanggal_mulai?`<span style="font-size:12px;color:#cbd5e1;">${ua(o.tanggal_mulai)} s/d ${ua(o.tanggal_selesai||o.tanggal_mulai)}</span>`:""}
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <button onclick="window.printRekapanItem(${o.id}, ${a})" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#251105;border:1.5px solid #F0AF43;color:#F0AF43;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;">
                  <i class="fa-solid fa-file-pdf"></i> Cetak PDF Rapor
                </button>
                <button onclick="window.deleteRekapanItem(${o.id}, ${a})" title="Hapus rekapan" style="background:#450a0a;border:1px solid #ef4444;color:#fecaca;padding:7px 11px;border-radius:8px;cursor:pointer;font-size:12px;">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>

            <!-- Stats Ringkas -->
            <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;color:#e8d4bc;padding-top:6px;border-top:1px dashed rgba(240,175,67,0.2);">
              <span>Hadir: <strong style="color:#4ade80;">${o.total_hadir||0}</strong></span>
              <span>Izin: <strong style="color:#fbbf24;">${o.total_izin||0}</strong></span>
              <span>Sakit: <strong style="color:#60a5fa;">${o.total_sakit||0}</strong></span>
              <span>Alpa: <strong style="color:#f87171;">${o.total_alpa||0}</strong></span>
              ${o.rata_nilai?`<span>Rata Nilai: <strong style="color:#F0AF43;">${o.rata_nilai}</strong></span>`:""}
              ${o.capaian_hafalan?`<span>Hafalan Terakhir: <strong style="color:#ffffff;">${S(o.capaian_hafalan)}</strong></span>`:""}
            </div>

            ${o.catatan_evaluasi?`
            <div style="font-size:12.5px;color:#fdf0e2;line-height:1.5;background:#180902;padding:8px 12px;border-radius:8px;border-left:3px solid #10b981;">
              <strong>Evaluasi Mentor:</strong> ${S(o.catatan_evaluasi)}
            </div>`:""}
            ${o.rekomendasi?`
            <div style="font-size:12.5px;color:#a7f3d0;line-height:1.5;background:#064e3b;padding:8px 12px;border-radius:8px;">
              <strong>Rekomendasi:</strong> ${S(o.rekomendasi)}
            </div>`:""}
          </div>`).join("")}
        </div>`),s.length===0){e.innerHTML=`
      <div class="card" style="text-align:center;padding:48px 24px;background:#180902;border:1.5px dashed rgba(240,175,67,0.5);border-radius:14px;box-shadow:0 6px 24px rgba(26,10,2,0.25);">
        <div style="font-size:44px;margin-bottom:12px;">📋</div>
        <h4 style="color:#ffffff;margin:0 0 8px;font-size:18px;font-weight:800;">Belum Ada Histori Laporan Sesi</h4>
        <p style="font-size:14px;color:#e8d4bc;margin:0 auto 20px;max-width:440px;line-height:1.6;font-weight:500;">
          Belum ada data kehadiran atau laporan sesi yang dicatat untuk peserta didik ini. Klik tombol di bawah untuk menambah laporan baru.
        </p>
        <button class="btn btn-primary" onclick="window.openTambahLaporanModal(${a})" style="display:inline-flex;align-items:center;gap:8px;padding:10px 22px;font-weight:800;background:linear-gradient(135deg,#F0AF43,#d97706);color:#1a0a02;border:none;border-radius:9px;box-shadow:0 4px 16px rgba(240,175,67,0.4);cursor:pointer;">
          <i class="fa-solid fa-plus-circle"></i> Tambah Laporan Sekarang
        </button>
      </div>`;return}e.innerHTML=s.map(o=>{const _=o.status_hadir||"hadir",w=p[o.id];return`
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
              <span>Laporan ${pe(o.tanggal)}</span>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:800;${ce(_)}">
                ${Ne(_)} ${_.toUpperCase()}
              </span>
              ${w?`
                <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:3px 9px;border-radius:12px;background:#064e3b;color:#a7f3d0;border:1px solid #10b981;font-weight:800;">
                  <i class="fa-solid fa-box-archive"></i> ${S(w)}
                </span>
              `:`
                <span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;padding:3px 9px;border-radius:12px;background:#2d1708;color:#fbbf24;border:1px solid rgba(240,175,67,0.3);font-weight:700;">
                  <i class="fa-solid fa-clock"></i> Sesi Berjalan
                </span>
              `}
            </div>
            <div style="font-size:13px;color:#e8d4bc;margin-top:4px;font-weight:600;">
              <i class="fa-regular fa-clock" style="color:#F0AF43;margin-right:5px;"></i> Tanggal Sesi: <strong style="color:#ffffff;font-weight:800;">${ua(o.tanggal)}</strong>
              ${o.materi_pembahasan?` • Materi: <span style="color:#cbd5e1;">${S(o.materi_pembahasan)}</span>`:""}
            </div>
          </div>
        </div>

        <!-- Tombol Edit di Samping Laporan -->
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="btn btn-sm" onclick="window.openEditLaporanModal(${o.id}, ${a})" style="
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
          <button class="btn btn-sm" onclick="window.deleteLaporan(${o.id}, ${a})" title="Hapus laporan ini" style="
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
      </div>`}).join("")}catch(s){e.innerHTML=`<div class="card" style="padding:22px;color:#991b1b;background:#fee2e2;border:1.5px solid #ef4444;border-radius:12px;font-size:14px;font-weight:700;">Gagal memuat histori laporan: ${s.message}</div>`}}function Ia(a){if(!a)return"";let t=String(a).replace(/\D/g,"");return t.startsWith("0")?t="62"+t.slice(1):t.startsWith("8")&&(t="62"+t),t}window.openShareModal=a=>{var l;const t=x.pesertaList.find(r=>r.id===a);if(!t)return;const i=(window._currentPesertaHistory||{}).rekapanList||[],n=`
  <div style="display:flex;flex-direction:column;gap:16px;">
    <!-- Info Santri Singkat -->
    <div style="background:#251105;border:1.5px solid rgba(240,175,67,0.3);border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:14px;">
      <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#81511D,#4F280C);border:1.5px solid #F0AF43;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#ffffff;flex-shrink:0;">${S(t.nama_lengkap.charAt(0))}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:800;color:#ffffff;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${S(t.nama_lengkap)}</div>
        <div style="color:#e8d4bc;font-size:13px;margin-top:2px;">${S(((l=t.kelas)==null?void 0:l.nama_kelas)||U(t.jenis))} · Wali: ${S(t.nama_wali||"Belum diisi")}</div>
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
        <input type="tel" id="share-wa-input" value="${S(t.no_wa_wali||"")}" placeholder="Contoh: 08123456789 atau 628..." style="flex:1;padding:10px 14px;border:1.5px solid rgba(240,175,67,0.4);border-radius:8px;background:#180902;color:#ffffff;font-size:14px;font-weight:700;outline:none;" />
        <button type="button" onclick="window.saveWaInline(${a})" style="padding:10px 16px;background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;border:none;border-radius:8px;font-weight:800;font-size:12.5px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:6px;">
          <i class="fa-solid fa-floppy-disk"></i> Simpan
        </button>
      </div>
      <div style="font-size:11.5px;color:#d8bfa2;line-height:1.4;">
        💡 <em>Anda dapat langsung mengisi / mengubah nomor di atas. Pesan laporan WhatsApp akan langsung ditujukan ke nomor ini.</em>
      </div>
    </div>

    <p style="font-size:13.5px;color:#e8d4bc;margin:0;line-height:1.6;">Pilih opsi laporan yang ingin dibagikan:</p>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <!-- Opsi 1: Cetak Full / Berjalan -->
      <button onclick="window.generatePesertaReport(${a})" style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:#251105;border:1.5px solid rgba(240,175,67,0.4);border-radius:12px;cursor:pointer;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='#F0AF43'" onmouseout="this.style.borderColor='rgba(240,175,67,0.4)'">
        <div style="width:42px;height:42px;background:linear-gradient(135deg,#b91c1c,#ef4444);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fa-solid fa-file-pdf" style="color:#ffffff;font-size:18px;"></i>
        </div>
        <div>
          <div style="color:#ffffff;font-weight:800;font-size:14px;">Cetak Rapor Keseluruhan / Sesi Berjalan (PDF)</div>
          <div style="color:#d8bfa2;font-size:12px;margin-top:2px;">Buka dialog cetak rapor lengkap semua sesi aktif santri</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:#F0AF43;margin-left:auto;"></i>
      </button>

      <!-- Opsi Rekapan Tersimpan (Jika ada) -->
      ${i.length>0?`
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
        <div style="font-size:12px;color:#F0AF43;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">
          Pilih Rapor Rekapan Tertentu:
        </div>
        ${i.map(r=>`
        <button onclick="closeMentorModal();window.printRekapanItem(${r.id}, ${a})" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#1c0d03;border:1.5px solid rgba(16,185,129,0.4);border-radius:10px;cursor:pointer;text-align:left;transition:all 0.2s;">
          <div style="width:36px;height:36px;background:#064e3b;border:1px solid #10b981;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#a7f3d0;">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="color:#ffffff;font-weight:800;font-size:13.5px;">Cetak Rapor: ${S(r.judul_rekap)}</div>
            <div style="color:#cbd5e1;font-size:11.5px;">${r.total_sesi} Sesi • Rata Nilai: ${r.rata_nilai||"-"}</div>
          </div>
          <i class="fa-solid fa-print" style="color:#10b981;"></i>
        </button>`).join("")}
      </div>`:""}

      <!-- Opsi Kirim WhatsApp -->
      <button onclick="window.shareToWhatsApp(${a})" style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:#251105;border:1.5px solid rgba(37,211,102,0.4);border-radius:12px;cursor:pointer;text-align:left;transition:all 0.2s;" onmouseover="this.style.borderColor='#25D366'" onmouseout="this.style.borderColor='rgba(37,211,102,0.4)'">
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
  </div>`;ca(`<i class="fa-solid fa-share-nodes" style="color:#F0AF43;margin-right:8px;"></i> Bagikan Laporan — ${S(t.nama_lengkap)}`,n,'<button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Tutup</button>')};window.openBuatRekapModal=a=>{const t=x.pesertaList.find(c=>c.id===a);if(!t)return;const e=window._currentPesertaHistory||{},i=e.kehadiranList||[],n=e.kemajuanByDate||{},s=e.penilaianByDate||{},l=e.rekapanList||[],r=new Set;if(l.forEach(c=>{Array.isArray(c.sesi_ids)&&c.sesi_ids.forEach(u=>r.add(Number(u)))}),t.jenis==="privat"){const c=l.filter(o=>o.jenis==="privat").length+1,u=`Paket ${c}`,d=`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="padding:12px 16px;background:#251105;border-radius:10px;border-left:4px solid #10b981;font-size:13.5px;color:#ffffff;line-height:1.5;">
        Rekap paket privat untuk <strong>${S(t.nama_lengkap)}</strong>. Tentukan nama paket & pilih sesi-sesi yang masuk dalam paket ini secara fleksibel.
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Nama / Judul Paket</label>
          <input type="text" class="form-control" id="modal-rekap-judul" value="${u}" placeholder="Contoh: Paket 1 (8 Pertemuan)" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Nomor Paket</label>
          <input type="number" class="form-control" id="modal-rekap-nomor-paket" value="${c}" min="1" />
        </div>
      </div>

      <!-- Pemilihan Sesi yang Masuk Paket -->
      <div style="padding:14px;background:#200d03;border:1.5px solid rgba(240,175,67,0.3);border-radius:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
          <label style="color:#F0AF43;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">
            Pilih Sesi Pertemuan Paket:
          </label>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-ghost" onclick="window._quickSelectSesi(4)" style="color:#F0AF43;border:1px solid rgba(240,175,67,0.3);font-size:11px;padding:3px 8px;">4 Sesi</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window._quickSelectSesi(8)" style="color:#F0AF43;border:1px solid rgba(240,175,67,0.3);font-size:11px;padding:3px 8px;">8 Sesi</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window._quickSelectSesi(12)" style="color:#F0AF43;border:1px solid rgba(240,175,67,0.3);font-size:11px;padding:3px 8px;">12 Sesi</button>
            <button type="button" class="btn btn-sm btn-ghost" onclick="window._quickSelectSesi('unrecapped')" style="color:#10b981;border:1px solid rgba(16,185,129,0.3);font-size:11px;padding:3px 8px;">Belum Direkap</button>
          </div>
        </div>

        <div id="sesi-checkbox-list" style="max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px;">
          ${i.length===0?'<div style="color:#d8bfa2;font-size:12.5px;">Belum ada sesi kehadiran tercatat.</div>':i.map((o,_)=>{const w=r.has(Number(o.id)),E=!w&&_<8?"checked":"";return`
            <label style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#180902;border:1px solid ${w?"rgba(255,255,255,0.1)":"rgba(240,175,67,0.25)"};border-radius:8px;cursor:pointer;font-size:13px;color:#ffffff;">
              <input type="checkbox" class="sesi-rekap-check" value="${o.id}" data-tanggal="${o.tanggal}" data-status="${o.status_hadir}" ${E} onchange="window._updateLiveRekapSummary()" />
              <span style="font-weight:700;color:#F0AF43;">${ua(o.tanggal)}</span>
              <span style="font-size:11.5px;padding:2px 8px;border-radius:10px;font-weight:700;${ce(o.status_hadir)}">${(o.status_hadir||"hadir").toUpperCase()}</span>
              <span style="color:#d8bfa2;font-size:12px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${S(o.materi_pembahasan||o.catatan_sesi||"Sesi Belajar")}</span>
              ${w?'<span style="font-size:10px;color:#94a3b8;border:1px solid #64748b;padding:1px 6px;border-radius:6px;">Sudah di paket lain</span>':""}
            </label>`}).join("")}
        </div>

        <!-- Live Ringkasan Sesi Terpilih -->
        <div id="rekap-live-summary" style="margin-top:12px;padding:10px 14px;background:#2d1708;border-radius:8px;font-size:12.5px;color:#ffffff;">
          Memuat ringkasan sesi…
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" style="color:#F0AF43;font-weight:700;">Catatan Evaluasi Akhir Paket</label>
        <textarea class="form-control" id="modal-rekap-evaluasi" rows="3" placeholder="Tuliskan evaluasi capaian hafalan, tajwid, adab, dan pemahaman santri selama paket ini…"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" style="color:#F0AF43;font-weight:700;">Rekomendasi Kelanjutan</label>
        <textarea class="form-control" id="modal-rekap-rekomendasi" rows="2" placeholder="Contoh: Direkomendasikan melanjutkan ke Paket berikutnya untuk kelancaran Juz 30 / naik jilid…"></textarea>
      </div>
    </div>`;ca(`<i class="fa-solid fa-box-check" style="color:#10b981;margin-right:8px;"></i> Rekap Paket Privat — ${S(t.nama_lengkap)}`,d,`
      <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
      <button class="btn btn-primary" id="btn-submit-rekap" style="min-width:180px;font-weight:800;background:linear-gradient(135deg,#10b981,#059669);color:#ffffff;border:none;">
        <i class="fa-solid fa-floppy-disk"></i> Simpan Rekap Paket
      </button>`),window._quickSelectSesi=o=>{const _=Array.from(document.querySelectorAll(".sesi-rekap-check"));_.forEach(w=>w.checked=!1),typeof o=="number"?_.slice(0,o).forEach(w=>w.checked=!0):o==="unrecapped"&&_.forEach(w=>{r.has(Number(w.value))||(w.checked=!0)}),window._updateLiveRekapSummary()},window._updateLiveRekapSummary=()=>{const o=Array.from(document.querySelectorAll(".sesi-rekap-check:checked")),_=new Set(o.map(k=>Number(k.value))),w=i.filter(k=>_.has(Number(k.id))),E=w.filter(k=>k.status_hadir==="hadir").length,b=w.filter(k=>k.status_hadir==="izin").length,I=w.filter(k=>k.status_hadir==="sakit").length,A=w.filter(k=>k.status_hadir==="alpa").length,y=w.map(k=>k.tanggal).filter(Boolean).map(k=>{var $;return($=s[k])==null?void 0:$.nilai_angka}).filter(k=>k!=null&&!isNaN(parseFloat(k))),q=y.length>0?(y.reduce((k,$)=>k+parseFloat($),0)/y.length).toFixed(1):"-",z=document.getElementById("modal-rekap-judul");z&&!z.dataset.manual&&(z.value=`Paket ${c} (${w.length} Pertemuan)`);const B=document.getElementById("rekap-live-summary");B&&(B.innerHTML=`
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <span><strong>Total Sesi:</strong> ${w.length}</span>
          <span style="color:#4ade80;">Hadir: ${E}</span>
          <span style="color:#fbbf24;">Izin: ${b}</span>
          <span style="color:#60a5fa;">Sakit: ${I}</span>
          <span style="color:#f87171;">Alpa: ${A}</span>
          <span><strong>Rata Nilai:</strong> <span style="color:#F0AF43;">${q}</span></span>
        </div>`)};const p=document.getElementById("modal-rekap-judul");p&&p.addEventListener("input",()=>{p.dataset.manual="1"}),window._updateLiveRekapSummary(),document.getElementById("btn-submit-rekap").addEventListener("click",async()=>{var R,H,V,Y,Z;const o=document.getElementById("btn-submit-rekap"),_=(((R=document.getElementById("modal-rekap-judul"))==null?void 0:R.value)||"").trim()||u,w=parseInt((H=document.getElementById("modal-rekap-nomor-paket"))==null?void 0:H.value)||c,E=(((V=document.getElementById("modal-rekap-evaluasi"))==null?void 0:V.value)||"").trim(),b=(((Y=document.getElementById("modal-rekap-rekomendasi"))==null?void 0:Y.value)||"").trim(),A=Array.from(document.querySelectorAll(".sesi-rekap-check:checked")).map(M=>Number(M.value));if(A.length===0){alert("Mohon pilih setidaknya 1 sesi pertemuan untuk direkap dalam paket ini.");return}const F=i.filter(M=>A.includes(Number(M.id))),y=F.map(M=>M.tanggal).filter(Boolean).sort(),q=y[0]||null,z=y[y.length-1]||null,B=F.filter(M=>M.status_hadir==="hadir").length,k=F.filter(M=>M.status_hadir==="izin").length,$=F.filter(M=>M.status_hadir==="sakit").length,m=F.filter(M=>M.status_hadir==="alpa").length,v=y.map(M=>{var N;return(N=s[M])==null?void 0:N.nilai_angka}).filter(M=>M!=null&&!isNaN(parseFloat(M))),D=v.length>0?parseFloat((v.reduce((M,N)=>M+parseFloat(N),0)/v.length).toFixed(1)):null;let f="";for(let M=0;M<y.length;M++){const N=y[y.length-1-M];if((Z=n[N])!=null&&Z.kitab_surat){f=`${n[N].kitab_surat} ${n[N].halaman_ayat||""}`.trim();break}}o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';try{await T.createRekapan({id_peserta:a,id_mentor:x.profile.id,jenis:"privat",judul_rekap:_,nomor_paket:w,total_sesi:A.length,tanggal_mulai:q,tanggal_selesai:z,total_hadir:B,total_izin:k,total_sakit:$,total_alpa:m,rata_nilai:D,capaian_hafalan:f||null,catatan_evaluasi:E||null,rekomendasi:b||null,sesi_ids:A}),J(),K("Rekapan paket privat berhasil disimpan! ✅","success"),ra(a,K)}catch(M){o.disabled=!1,o.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Rekap Paket',K("Gagal simpan rekapan: "+M.message,"error")}})}else{const c=[...new Set(i.map(E=>(E.tanggal||"").slice(0,7)).filter(Boolean))].sort().reverse(),u=new Date().toISOString().slice(0,7);c.includes(u)||c.unshift(u);const d=E=>{if(!E||E.length<7)return E;const[b,I]=E.split("-");return`${["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][parseInt(I)-1]||I} ${b}`},g=c[0],p=`Rekap Bulan ${d(g)}`,o=`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div style="padding:12px 16px;background:#251105;border-radius:10px;border-left:4px solid #F0AF43;font-size:13.5px;color:#ffffff;line-height:1.5;">
        Rekapan bulanan santri bimbel untuk <strong>${S(t.nama_lengkap)}</strong>. Sistem akan menghitung kehadiran dan nilai pada bulan terpilih secara otomatis.
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Pilih Bulan Periode</label>
          <select class="form-control" id="modal-rekap-bulan" onchange="window._onBimbelMonthChange()">
            ${c.map(E=>`<option value="${E}" ${E===g?"selected":""}>${d(E)}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Judul Rekapan</label>
          <input type="text" class="form-control" id="modal-rekap-judul" value="${p}" />
        </div>
      </div>

      <!-- Preview Sesi Bulan Terpilih -->
      <div style="padding:14px;background:#200d03;border:1.5px solid rgba(240,175,67,0.3);border-radius:12px;">
        <div id="rekap-bulan-live-summary" style="font-size:13px;color:#ffffff;">
          Memuat ringkasan bulan…
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" style="color:#F0AF43;font-weight:700;">Catatan Evaluasi Bulanan</label>
        <textarea class="form-control" id="modal-rekap-evaluasi" rows="3" placeholder="Tuliskan catatan evaluasi belajar, akhlak, dan hafalan santri bulan ini…"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" style="color:#F0AF43;font-weight:700;">Pesan / Rekomendasi untuk Orang Tua</label>
        <textarea class="form-control" id="modal-rekap-rekomendasi" rows="2" placeholder="Contoh: Mohon bimbingan tilawah di rumah ditingkatkan pada surah-surah yang perlu diulang…"></textarea>
      </div>
    </div>`;ca(`<i class="fa-solid fa-calendar-star" style="color:#F0AF43;margin-right:8px;"></i> Rekap Bulanan Bimbel — ${S(t.nama_lengkap)}`,o,`
      <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
      <button class="btn btn-primary" id="btn-submit-rekap-bimbel" style="min-width:180px;font-weight:800;background:linear-gradient(135deg,#F0AF43,#d97706);color:#1a0a02;border:none;">
        <i class="fa-solid fa-floppy-disk"></i> Simpan Rekapan Bulanan
      </button>`),window._onBimbelMonthChange=()=>{var m;const E=((m=document.getElementById("modal-rekap-bulan"))==null?void 0:m.value)||g,b=document.getElementById("modal-rekap-judul");b&&!b.dataset.manual&&(b.value=`Rekap Bulan ${d(E)}`);const I=i.filter(v=>(v.tanggal||"").startsWith(E)),A=I.filter(v=>v.status_hadir==="hadir").length,F=I.filter(v=>v.status_hadir==="izin").length,y=I.filter(v=>v.status_hadir==="sakit").length,q=I.filter(v=>v.status_hadir==="alpa").length,B=I.map(v=>v.tanggal).filter(Boolean).map(v=>{var D;return(D=s[v])==null?void 0:D.nilai_angka}).filter(v=>v!=null&&!isNaN(parseFloat(v))),k=B.length>0?(B.reduce((v,D)=>v+parseFloat(D),0)/B.length).toFixed(1):"-",$=document.getElementById("rekap-bulan-live-summary");$&&($.innerHTML=`
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px;">
          <span><strong>Total Sesi:</strong> ${I.length}</span>
          <span style="color:#4ade80;">Hadir: ${A}</span>
          <span style="color:#fbbf24;">Izin: ${F}</span>
          <span style="color:#60a5fa;">Sakit: ${y}</span>
          <span style="color:#f87171;">Alpa: ${q}</span>
          <span><strong>Rata Nilai:</strong> <span style="color:#F0AF43;">${k}</span></span>
        </div>
        ${I.length===0?'<div style="color:#fca5a5;font-size:12px;">⚠️ Belum ada sesi kehadiran yang dicatat pada bulan ini.</div>':""}`)};const w=document.getElementById("modal-rekap-judul");w&&w.addEventListener("input",()=>{w.dataset.manual="1"}),window._onBimbelMonthChange(),document.getElementById("btn-submit-rekap-bimbel").addEventListener("click",async()=>{var V,Y,Z,M,N;const E=document.getElementById("btn-submit-rekap-bimbel"),b=((V=document.getElementById("modal-rekap-bulan"))==null?void 0:V.value)||g,I=(((Y=document.getElementById("modal-rekap-judul"))==null?void 0:Y.value)||"").trim()||`Rekap Bulan ${d(b)}`,A=(((Z=document.getElementById("modal-rekap-evaluasi"))==null?void 0:Z.value)||"").trim(),F=(((M=document.getElementById("modal-rekap-rekomendasi"))==null?void 0:M.value)||"").trim(),y=i.filter(C=>(C.tanggal||"").startsWith(b)),q=y.map(C=>Number(C.id)),z=y.map(C=>C.tanggal).filter(Boolean).sort(),B=z[0]||`${b}-01`,k=z[z.length-1]||null,$=y.filter(C=>C.status_hadir==="hadir").length,m=y.filter(C=>C.status_hadir==="izin").length,v=y.filter(C=>C.status_hadir==="sakit").length,D=y.filter(C=>C.status_hadir==="alpa").length,f=z.map(C=>{var G;return(G=s[C])==null?void 0:G.nilai_angka}).filter(C=>C!=null&&!isNaN(parseFloat(C))),R=f.length>0?parseFloat((f.reduce((C,G)=>C+parseFloat(G),0)/f.length).toFixed(1)):null;let H="";for(let C=0;C<z.length;C++){const G=z[z.length-1-C];if((N=n[G])!=null&&N.kitab_surat){H=`${n[G].kitab_surat} ${n[G].halaman_ayat||""}`.trim();break}}E.disabled=!0,E.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';try{await T.createRekapan({id_peserta:a,id_mentor:x.profile.id,jenis:"bimbel",judul_rekap:I,periode_bulan:b,total_sesi:q.length,tanggal_mulai:B,tanggal_selesai:k,total_hadir:$,total_izin:m,total_sakit:v,total_alpa:D,rata_nilai:R,capaian_hafalan:H||null,catatan_evaluasi:A||null,rekomendasi:F||null,sesi_ids:q}),J(),K("Rekapan bulanan bimbel berhasil disimpan! ✅","success"),ra(a,K)}catch(C){E.disabled=!1,E.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Rekapan Bulanan',K("Gagal simpan rekapan: "+C.message,"error")}})}};window.printRekapanItem=(a,t)=>{var l,r;const e=x.pesertaList.find(c=>c.id===t),i=window._currentPesertaHistory;if(!e||!i)return;const n=(i.rekapanList||[]).find(c=>Number(c.id)===Number(a));if(!n){K("Data rekapan tidak ditemukan.","error");return}const s={peserta:e,mentor:{nama:((l=x.profile)==null?void 0:l.nama_lengkap)||((r=x.profile)==null?void 0:r.nama)||"Mentor QIA"},kelas:e.kelas||{nama_kelas:e.jenis==="privat"?"Program Privat":U(e.jenis)},kemajuan:i.kemajuanList||[],penilaian:i.penilaianList||[],kehadiran_summary:{hadir:n.total_hadir||0,izin:n.total_izin||0,sakit:n.total_sakit||0,alpa:n.total_alpa||0,total:n.total_sesi||0},riwayat_kehadiran:i.kehadiranList||[],catatan_mentor:[]};wa(s,{rekapan:n})};window.deleteRekapanItem=async(a,t)=>{if(confirm("Apakah Anda yakin ingin menghapus rekapan ini? Sesi kehadiran santri tidak akan terhapus."))try{await T.deleteRekapan(a),K("Rekapan berhasil dihapus.","success"),ra(t,K)}catch(e){K("Gagal menghapus rekapan: "+e.message,"error")}};window.saveWaInline=async a=>{const t=x.pesertaList.find(l=>l.id===a);if(!t)return;const e=document.getElementById("share-wa-input"),i=e?e.value.trim():"";if(!i){alert("Mohon ketikkan nomor WhatsApp terlebih dahulu."),e&&e.focus();return}t.no_wa_wali=i,x.selectedPeserta&&x.selectedPeserta.id===a&&(x.selectedPeserta.no_wa_wali=i);const n=document.getElementById("share-wa-inline-status");n&&(n.style.color="#F0AF43",n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…');try{await T.updatePeserta(a,{no_wa_wali:i})}catch(l){console.warn("Simpan database warning:",l)}n&&(n.style.color="#4ade80",n.innerHTML='<i class="fa-solid fa-circle-check"></i> Nomor WA Tersimpan!',setTimeout(()=>{n&&(n.innerHTML="")},3500));const s=document.getElementById("peserta-no-wa-wrapper");s&&(s.innerHTML=`<a href="https://wa.me/${Ia(i)}" target="_blank" rel="noopener noreferrer" style="color:#4ade80;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"><i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> ${S(i)}</a>`),K("Nomor WhatsApp wali santri berhasil disimpan! ✅","success")};window.openEditKontakWaliModal=a=>{const t=x.pesertaList.find(n=>n.id===a);if(!t)return;const e=`
  <div style="display:flex;flex-direction:column;gap:14px;">
    <div>
      <label style="display:block;font-size:12px;color:#F0AF43;font-weight:800;margin-bottom:6px;text-transform:uppercase;">Nama Orang Tua / Wali:</label>
      <input type="text" id="edit-kontak-nama" value="${S(t.nama_wali||"")}" placeholder="Contoh: Bapak Ahmad / Ibu Fatimah" style="width:100%;padding:10px 14px;border:1.5px solid rgba(240,175,67,0.4);border-radius:8px;background:#180902;color:#ffffff;font-size:14px;font-weight:600;box-sizing:border-box;" />
    </div>
    <div>
      <label style="display:block;font-size:12px;color:#F0AF43;font-weight:800;margin-bottom:6px;text-transform:uppercase;">No. WhatsApp Wali:</label>
      <input type="tel" id="edit-kontak-wa" value="${S(t.no_wa_wali||"")}" placeholder="Contoh: 08123456789 atau 628..." style="width:100%;padding:10px 14px;border:1.5px solid rgba(240,175,67,0.4);border-radius:8px;background:#180902;color:#ffffff;font-size:14px;font-weight:700;box-sizing:border-box;" />
      <div style="font-size:11.5px;color:#d8bfa2;margin-top:5px;">
        Nomor ini akan digunakan sebagai tujuan kirim link laporan & PDF rapor ananda.
      </div>
    </div>
  </div>`,i=`
    <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
    <button class="btn btn-primary" onclick="window.saveKontakWali(${a})" style="padding:10px 20px;font-weight:800;background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;border:none;border-radius:8px;cursor:pointer;">
      <i class="fa-solid fa-floppy-disk"></i> Simpan Kontak
    </button>`;ca('<i class="fa-solid fa-address-book" style="color:#F0AF43;margin-right:8px;"></i> Edit Kontak Wali Santri',e,i)};window.saveKontakWali=async a=>{var s,l;const t=x.pesertaList.find(r=>r.id===a);if(!t)return;const e=(((s=document.getElementById("edit-kontak-nama"))==null?void 0:s.value)||"").trim(),i=(((l=document.getElementById("edit-kontak-wa"))==null?void 0:l.value)||"").trim();t.nama_wali=e,t.no_wa_wali=i,x.selectedPeserta&&x.selectedPeserta.id===a&&(x.selectedPeserta.nama_wali=e,x.selectedPeserta.no_wa_wali=i);try{await T.updatePeserta(a,{nama_wali:e,no_wa_wali:i})}catch(r){console.error("Error saving kontak wali:",r)}J(),K("Kontak wali santri berhasil diperbarui!","success");const n=document.getElementById("mentor-main-content");n&&La(a,n,K)};window.generatePesertaReport=a=>{var g,p;const t=x.pesertaList.find(o=>o.id===a),e=window._currentPesertaHistory;if(!t)return;J();const i=(e==null?void 0:e.pesertaId)===a&&e.kehadiranList?e.kehadiranList:[],n=(e==null?void 0:e.pesertaId)===a&&e.kemajuanByDate?Object.values(e.kemajuanByDate):(e==null?void 0:e.pesertaId)===a&&e.kemajuanList?e.kemajuanList:[],s=(e==null?void 0:e.pesertaId)===a&&e.penilaianByDate?Object.values(e.penilaianByDate):(e==null?void 0:e.pesertaId)===a&&e.penilaianList?e.penilaianList:[],l=i.filter(o=>o.status_hadir==="hadir").length,r=i.filter(o=>o.status_hadir==="izin").length,c=i.filter(o=>o.status_hadir==="sakit").length,u=i.filter(o=>o.status_hadir==="alpa"||!["hadir","izin","sakit"].includes(o.status_hadir)&&o.status_hadir).length,d={peserta:t,mentor:{nama:((g=x.profile)==null?void 0:g.nama_lengkap)||((p=x.profile)==null?void 0:p.nama)||"Mentor QIA"},kelas:t.kelas||{nama_kelas:t.jenis==="privat"?"Program Privat":U(t.jenis)},kemajuan:n,penilaian:s,kehadiran_summary:{hadir:l,izin:r,sakit:c,alpa:u,total:i.length},riwayat_kehadiran:i,catatan_mentor:[]};wa(d)};window.shareToWhatsApp=a=>{const t=x.pesertaList.find(c=>c.id===a);if(!t)return;const e=document.getElementById("share-wa-input"),i=e?e.value.trim():t.no_wa_wali||"";if(!i){alert("Mohon masukkan nomor WhatsApp wali terlebih dahulu pada kolom yang disediakan."),e&&e.focus();return}i!==t.no_wa_wali&&(t.no_wa_wali=i,x.selectedPeserta&&x.selectedPeserta.id===a&&(x.selectedPeserta.no_wa_wali=i),T.updatePeserta(a,{no_wa_wali:i}).catch(console.error)),J();const n=`${window.location.origin}/wali?id=${a}`,s=`Assalamu'alaikum Wr. Wb.

Kepada Yth. Bapak/Ibu *${t.nama_wali||"Orang Tua / Wali"}*,

Berikut kami sampaikan bahwa laporan perkembangan belajar ananda *${t.nama_lengkap}* di Quran Insight Academy dapat diakses melalui tautan resmi di bawah ini:

👉 ${n}

Melalui tautan tersebut, Bapak/Ibu dapat melihat catatan kehadiran, capaian materi & hafalan, evaluasi mentor, serta mengunduh dokumen PDF rapor resmi ananda.

Jazakumullah Khairan Katsiran atas perhatian dan kerjasamanya.

Wassalamu'alaikum Wr. Wb.
_Quran Insight Academy_`,r=`https://wa.me/${Ia(i)}?text=${encodeURIComponent(s)}`;window.open(r,"_blank")};window.openTambahLaporanModal=a=>{const t=x.pesertaList.find(s=>s.id===a);if(!t)return;const e=new Date().toISOString().slice(0,10),i=`
  <div style="display:flex;flex-direction:column;gap:18px;">
    <!-- Bagian 1: Kehadiran & Tanggal -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-calendar-check"></i> 1. Kehadiran & Materi Sesi
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tanggal Sesi</label>
          <input type="date" class="form-control" id="modal-inp-tgl-sesi" value="${e}" />
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
  </div>`;ca(`<i class="fa-solid fa-plus-circle" style="color:#F0AF43;margin-right:8px;"></i> Tambah Laporan Sesi — ${S(t.nama_lengkap)}`,i,`
    <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
    <button class="btn btn-primary" id="btn-modal-submit-tambah" style="min-width:160px;font-weight:800;">
      <i class="fa-solid fa-floppy-disk"></i> Simpan Laporan
    </button>
  `),document.getElementById("btn-modal-submit-tambah").addEventListener("click",async()=>{const s=document.getElementById("btn-modal-submit-tambah"),l=document.getElementById("modal-inp-tgl-sesi").value||e,r=document.getElementById("modal-inp-status-hadir").value,c=document.getElementById("modal-inp-materi").value.trim(),u=document.getElementById("modal-inp-kitab").value.trim(),d=document.getElementById("modal-inp-halaman").value.trim(),g=document.getElementById("modal-inp-kelancaran").value,p=document.getElementById("modal-inp-nilai").value,o=parseInt(document.getElementById("modal-inp-adab").value)||null,_=parseInt(document.getElementById("modal-inp-tajwid").value)||null,w=parseInt(document.getElementById("modal-inp-kelancaran-nilai").value)||null,E=document.getElementById("modal-inp-catatan").value.trim();s.disabled=!0,s.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';try{if(await T.addKehadiran({id_peserta:a,id_mentor:x.profile.id,id_kelas:t.id_kelas||null,tanggal:l,status_hadir:r,materi_pembahasan:c||null,perkembangan_materi:E||null,catatan_sesi:E||null}),await T.deleteKemajuanByPesertaTanggal(a,l),await T.deletePenilaianByPesertaTanggal(a,l),u&&await T.addKemajuan({id_peserta:a,id_mentor:x.profile.id,tanggal:l,kitab_surat:u,halaman_ayat:d||null,status_kelancaran:g,catatan_hafalan:E||null}),p){const b=parseFloat(p);isNaN(b)||await T.addPenilaian({id_peserta:a,id_mentor:x.profile.id,tanggal:l,nilai_angka:b,nilai_adab:o,nilai_tajwid:_,nilai_kelancaran:w,catatan:E||null})}J(),K("Laporan sesi berhasil disimpan! ✅","success"),ra(a,K)}catch(b){s.disabled=!1,s.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Simpan Laporan',K("Gagal simpan laporan: "+b.message,"error")}})};window.openEditLaporanModal=(a,t)=>{var u;const e=x.pesertaList.find(d=>d.id===t);if(!e)return;const i=window._currentPesertaHistory,n=(u=i==null?void 0:i.kehadiranList)==null?void 0:u.find(d=>Number(d.id)===Number(a));if(!n){K("Data laporan tidak ditemukan.","error");return}const s=i!=null&&i.kemajuanByDate?i.kemajuanByDate[n.tanggal]:null,l=i!=null&&i.penilaianByDate?i.penilaianByDate[n.tanggal]:null,r=`
  <div style="display:flex;flex-direction:column;gap:18px;">
    <div style="padding:12px 16px;background:#2d1708;border-radius:10px;border-left:4px solid #F0AF43;font-size:13.5px;color:#ffffff;line-height:1.5;">
      Mengedit data kehadiran dan materi sesi untuk peserta <strong style="color:#F0AF43;">${S(e.nama_lengkap)}</strong>.
    </div>

    <!-- Bagian 1: Kehadiran & Tanggal -->
    <div style="padding:16px;background:#2a1406;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 14px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-calendar-check"></i> 1. Kehadiran & Materi Sesi
      </h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;">
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tanggal Sesi</label>
          <input type="date" class="form-control" id="modal-edit-tgl" value="${n.tanggal}" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Status Kehadiran</label>
          <select class="form-control" id="modal-edit-status">
            <option value="hadir" ${n.status_hadir==="hadir"?"selected":""}>● Hadir</option>
            <option value="izin" ${n.status_hadir==="izin"?"selected":""}>◐ Izin</option>
            <option value="sakit" ${n.status_hadir==="sakit"?"selected":""}>◑ Sakit</option>
            <option value="alpa" ${n.status_hadir==="alpa"?"selected":""}>○ Alpa</option>
          </select>
        </div>
        <div class="form-group" style="grid-column:1/-1;">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Materi Pembahasan</label>
          <input type="text" class="form-control" id="modal-edit-materi" value="${S(n.materi_pembahasan||"")}" placeholder="cth: Tajwid Mad Thobi'i, Makhorijul Huruf" />
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
          <input type="text" class="form-control" id="modal-edit-kitab" value="${S((s==null?void 0:s.kitab_surat)||"")}" placeholder="cth: An-Naba, Al-Baqarah" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Halaman / Ayat</label>
          <input type="text" class="form-control" id="modal-edit-halaman" value="${S((s==null?void 0:s.halaman_ayat)||"")}" placeholder="cth: Ayat 1-10, Hal. 12" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Status Kelancaran</label>
          <select class="form-control" id="modal-edit-kelancaran">
            <option value="lancar" ${(s==null?void 0:s.status_kelancaran)==="lancar"?"selected":""}>● Lancar</option>
            <option value="cukup" ${(s==null?void 0:s.status_kelancaran)==="cukup"?"selected":""}>◐ Cukup</option>
            <option value="perlu_ulang" ${(s==null?void 0:s.status_kelancaran)==="perlu_ulang"?"selected":""}>○ Perlu Diulang</option>
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
          <input type="number" class="form-control" id="modal-edit-nilai" min="0" max="100" value="${(l==null?void 0:l.nilai_angka)??""}" placeholder="85" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Adab (1–5)</label>
          <input type="number" class="form-control" id="modal-edit-adab" min="1" max="5" value="${(l==null?void 0:l.nilai_adab)??""}" placeholder="5" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Tajwid (1–5)</label>
          <input type="number" class="form-control" id="modal-edit-tajwid" min="1" max="5" value="${(l==null?void 0:l.nilai_tajwid)??""}" placeholder="4" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#F0AF43;font-weight:700;">Kelancaran (1–5)</label>
          <input type="number" class="form-control" id="modal-edit-kelancaran-nilai" min="1" max="5" value="${(l==null?void 0:l.nilai_kelancaran)??""}" placeholder="4" />
        </div>
      </div>
    </div>

    <!-- Bagian 4: Catatan Sesi -->
    <div style="padding:16px;background:#2b1506;border-radius:12px;border:1.5px solid rgba(240,175,67,0.25);">
      <h4 style="color:#F0AF43;margin:0 0 10px;font-size:0.95rem;font-weight:800;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-comment-dots"></i> Catatan Sesi / Perkembangan
      </h4>
      <div class="form-group" style="margin:0;">
        <textarea class="form-control" id="modal-edit-catatan" rows="3" placeholder="Tuliskan catatan perkembangan hafalan, penilaian, keaktifan santri…">${S(n.catatan_sesi||n.perkembangan_materi||(s==null?void 0:s.catatan_hafalan)||(l==null?void 0:l.catatan)||"")}</textarea>
      </div>
    </div>
  </div>`;ca(`<i class="fa-solid fa-pen-to-square" style="color:#F0AF43;margin-right:8px;"></i> Edit Laporan — ${pe(n.tanggal)}`,r,`
    <button class="btn btn-ghost" onclick="closeMentorModal()" style="color:#ffffff;border:1px solid rgba(255,255,255,0.2);font-weight:700;">Batal</button>
    <button class="btn btn-primary" id="btn-modal-submit-edit" style="min-width:170px;font-weight:800;">
      <i class="fa-solid fa-check"></i> Simpan Perubahan
    </button>
  `),document.getElementById("btn-modal-submit-edit").addEventListener("click",async()=>{const d=document.getElementById("btn-modal-submit-edit"),g=document.getElementById("modal-edit-tgl").value||n.tanggal,p=document.getElementById("modal-edit-status").value,o=document.getElementById("modal-edit-materi").value.trim(),_=document.getElementById("modal-edit-kitab").value.trim(),w=document.getElementById("modal-edit-halaman").value.trim(),E=document.getElementById("modal-edit-kelancaran").value,b=document.getElementById("modal-edit-nilai").value,I=parseInt(document.getElementById("modal-edit-adab").value)||null,A=parseInt(document.getElementById("modal-edit-tajwid").value)||null,F=parseInt(document.getElementById("modal-edit-kelancaran-nilai").value)||null,y=document.getElementById("modal-edit-catatan").value.trim(),q=g!==n.tanggal,z=n.tanggal;d.disabled=!0,d.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan…';try{await T.updateKehadiran(n.id,{tanggal:g,status_hadir:p,materi_pembahasan:o||null,perkembangan_materi:y||null,catatan_sesi:y||null}),q&&await T.deleteKemajuanByPesertaTanggal(t,z),await T.deleteKemajuanByPesertaTanggal(t,g),_&&await T.addKemajuan({id_peserta:t,id_mentor:x.profile.id,tanggal:g,kitab_surat:_,halaman_ayat:w||null,status_kelancaran:E,catatan_hafalan:y||null}),q&&await T.deletePenilaianByPesertaTanggal(t,z),await T.deletePenilaianByPesertaTanggal(t,g);const B=b?parseFloat(b):NaN;isNaN(B)||await T.addPenilaian({id_peserta:t,id_mentor:x.profile.id,tanggal:g,nilai_angka:B,nilai_adab:I,nilai_tajwid:A,nilai_kelancaran:F,catatan:y||null}),J(),K("Data kehadiran dan laporan berhasil diperbarui! ✅","success"),ra(t,K)}catch(B){d.disabled=!1,d.innerHTML='<i class="fa-solid fa-check"></i> Simpan Perubahan',K("Gagal update laporan: "+B.message,"error")}})};window.deleteLaporan=async(a,t)=>{var e;if(confirm(`Apakah Anda yakin ingin menghapus data laporan kehadiran sesi ini?

Data kemajuan hafalan dan penilaian pada tanggal yang sama juga akan ikut terhapus.`))try{const i=window._currentPesertaHistory,n=(e=i==null?void 0:i.kehadiranList)==null?void 0:e.find(l=>Number(l.id)===Number(a)),s=n==null?void 0:n.tanggal;s&&await T.deleteRelatedByKehadiran(t,s),await T.deleteKehadiran(a),K("Laporan beserta data kemajuan & penilaian terkait berhasil dihapus.","info"),ra(t,K)}catch(i){K("Gagal menghapus laporan: "+i.message,"error")}};function ca(a,t,e){const i=document.getElementById("mentor-modal");i&&(document.getElementById("mentor-modal-title").innerHTML=a,document.getElementById("mentor-modal-body").innerHTML=t,document.getElementById("mentor-modal-footer").innerHTML=e,i.classList.add("show"))}function J(){var a;(a=document.getElementById("mentor-modal"))==null||a.classList.remove("show")}window.closeMentorModal=J;function He(a,t){a.innerHTML=`
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
  </div>`,document.getElementById("btn-ganti-pw").addEventListener("click",async()=>{const e=document.getElementById("inp-new-pw").value,i=document.getElementById("inp-confirm-pw").value;if(!e||e.length<8){t("Password minimal 8 karakter.","info");return}if(e!==i){t("Konfirmasi password tidak cocok.","error");return}try{await T.updatePassword(e),t("Password berhasil diubah! ✅","success"),document.getElementById("inp-new-pw").value="",document.getElementById("inp-confirm-pw").value=""}catch(n){t("Gagal: "+n.message,"error")}})}function U(a){return a==="bimbel"?"Bimbel Kelompok":a==="privat"?"Privat":a||"-"}function ce(a){return a==="hadir"?"background:#064e3b;color:#a7f3d0;border:1.5px solid #10b981;font-weight:800;":a==="izin"?"background:#78350f;color:#fde68a;border:1.5px solid #f59e0b;font-weight:800;":a==="sakit"?"background:#1e3a8a;color:#bfdbfe;border:1.5px solid #3b82f6;font-weight:800;":"background:#7f1d1d;color:#fecaca;border:1.5px solid #ef4444;font-weight:800;"}function Ne(a){return a==="hadir"?'<i class="fa-solid fa-circle-check" style="color:#a7f3d0;"></i>':a==="izin"?'<i class="fa-solid fa-file-lines" style="color:#fde68a;"></i>':a==="sakit"?'<i class="fa-solid fa-head-side-cough" style="color:#bfdbfe;"></i>':'<i class="fa-solid fa-circle-xmark" style="color:#fecaca;"></i>'}function ua(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function pe(a){if(!a)return"-";try{const e=String(a).split("T")[0].split("-");if(e.length===3){const i=parseInt(e[0],10),n=parseInt(e[1],10)-1,s=parseInt(e[2],10),l=new Date(i,n,s),r=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],c=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],u=r[l.getDay()],d=c[n];return`${u}, ${s} ${d} ${i}`}return a}catch{return a}}function S(a){return a==null?"":String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function za(a,t,e){document.title="Portal Wali — Quran Insight Academy";const i=new URLSearchParams(window.location.search),n=i.get("id")||i.get("santri");a.innerHTML=We(n),Oe(t,e,n)}function We(a){return`
<div style="min-height:100vh;background:#f3e9dc;font-family:'Plus Jakarta Sans',sans-serif;">

  <!-- Navbar -->
  <nav class="wali-nav">
    <div class="wali-nav-left">
      <button onclick="window.navigateTo('/')" class="wali-back-btn" title="Kembali ke Beranda">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div class="wali-logo-icon">
        <span class="ms" style="font-size:19px;color:#221104;">menu_book</span>
      </div>
      <div class="wali-nav-title-group">
        <div class="wali-nav-title">${a?"Laporan Santri":"Portal Wali"}</div>
        <div class="wali-nav-subtitle">Quran Insight Academy</div>
      </div>
    </div>
    ${a?`
    <button onclick="window.navigateTo('/wali')" class="wali-search-other-btn" title="Cari Santri Lain">
      <i class="fa-solid fa-magnifying-glass"></i> <span class="wali-btn-label">Santri Lain</span>
    </button>
    `:""}
  </nav>

  <!-- Hero Header -->
  ${a?`
  <div style="background:linear-gradient(135deg,#1a0a02 0%,#221104 60%,#3a1c08 100%);
    padding:32px 24px 36px;text-align:center;position:relative;overflow:hidden;">
    <div style="position:relative;z-index:1;">
      <div style="display:inline-flex;align-items:center;gap:8px;padding:4px 14px;border-radius:20px;
        background:rgba(240,175,67,0.15);border:1px solid rgba(240,175,67,0.35);color:#F0AF43;font-size:11.5px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
        <i class="fa-solid fa-graduation-cap"></i> Dokumen Resmi Perkembangan Santri
      </div>
      <h1 style="color:#fdf0e2;margin-bottom:6px;font-size:clamp(1.4rem,3.5vw,2rem);font-weight:800;">
        Laporan Perkembangan <span style="color:#F0AF43;">Peserta Didik</span>
      </h1>
      <p style="color:#c9a87a;max-width:540px;margin:0 auto;font-size:13px;line-height:1.6;">
        Pantau rekapan nilai, hafalan, kehadiran, dan catatan mentor ananda yang dapat dicetak atau disimpan sebagai PDF resmi.
      </p>
    </div>
  </div>
  `:`
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
  `}

  <!-- Results Area -->
  <div id="wali-results" style="max-width:960px;margin:0 auto;padding:28px 24px 60px;">
    <!-- Default: panduan -->
    ${a?"":`
    <div id="wali-guide" style="text-align:center;padding:48px 24px;">
      <div style="margin-bottom:16px;"><span class="ms" style="font-size:64px;color:#81511D;opacity:0.4;">search</span></div>
      <h3 style="color:#4F280C;font-size:1.1rem;margin-bottom:8px;">Cari Nama Peserta Didik</h3>
      <p style="color:#81511D;font-size:14px;max-width:360px;margin:0 auto;">
        Masukkan nama peserta didik Anda di kotak pencarian di atas untuk melihat perkembangan belajarnya.
      </p>
    </div>
    `}

    <div id="wali-loading" style="${a?"display:block;":"display:none;"}text-align:center;padding:48px;">
      <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
        border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;
        margin:0 auto 16px;"></div>
      <p style="color:#81511D;font-weight:600;">Memuat data laporan peserta didik…</p>
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

  /* Wali Portal Responsive Styles */
  .wali-nav {
    background: #1a0a02;
    border-bottom: 1px solid rgba(240,175,67,0.2);
    padding: 0 20px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    gap: 12px;
  }
  .wali-nav-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }
  .wali-back-btn {
    background: none;
    border: none;
    color: #c9a87a;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 8px;
    font-size: 15px;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .wali-back-btn:hover { color: #F0AF43; }
  .wali-logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #d97706, #F0AF43);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .wali-nav-title-group {
    min-width: 0;
    overflow: hidden;
  }
  .wali-nav-title {
    font-weight: 800;
    color: #fdf0e2;
    font-size: 14.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wali-nav-subtitle {
    font-size: 11px;
    color: #F0AF43;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wali-search-other-btn {
    background: rgba(240, 175, 67, 0.12);
    border: 1px solid rgba(240, 175, 67, 0.35);
    color: #F0AF43;
    padding: 7px 14px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .wali-search-other-btn:hover {
    background: rgba(240, 175, 67, 0.22);
  }

  /* Student Card Responsive */
  .wali-student-card {
    background: linear-gradient(135deg, #221104, #3a1c08);
    border-radius: 16px;
    padding: 22px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 4px 20px rgba(26,10,2,0.25);
    border: 1px solid rgba(240,175,67,0.25);
  }
  .wali-student-info-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 200px;
  }
  .wali-student-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    flex-shrink: 0;
    background: linear-gradient(135deg, #4F280C, #D4934E);
    border: 2px solid #F0AF43;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 800;
    color: #fdf0e2;
  }
  .wali-student-meta {
    flex: 1;
    min-width: 0;
  }
  .wali-student-name {
    color: #fdf0e2;
    font-size: 1.25rem;
    font-weight: 800;
    margin: 0 0 6px 0;
    line-height: 1.3;
  }
  .wali-student-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .wali-tag {
    font-size: 12px;
    color: #c9a87a;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .wali-student-action-row {
    flex-shrink: 0;
  }
  .wali-print-btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #d97706, #F0AF43);
    color: #1a0a02;
    font-size: 13.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(240,175,67,0.35);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .wali-print-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  /* Mobile Screen (< 640px) */
  @media (max-width: 640px) {
    .wali-nav {
      padding: 0 10px;
      height: 56px;
      gap: 6px;
    }
    .wali-logo-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
    }
    .wali-nav-title {
      font-size: 13px;
    }
    .wali-nav-subtitle {
      font-size: 10px;
    }
    .wali-search-other-btn {
      padding: 6px 10px;
      font-size: 11px;
      border-radius: 8px;
    }
    .wali-student-card {
      padding: 16px;
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }
    .wali-student-info-row {
      width: 100%;
      min-width: 0;
      gap: 12px;
    }
    .wali-student-avatar {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }
    .wali-student-name {
      font-size: 1.15rem;
      word-break: break-word;
    }
    .wali-student-action-row {
      width: 100%;
    }
    .wali-print-btn {
      width: 100%;
      padding: 11px 16px;
      font-size: 13.5px;
    }
    #wali-results {
      padding: 16px 12px 48px !important;
    }
  }

  @media (max-width: 380px) {
    .wali-btn-label {
      display: none;
    }
    .wali-search-other-btn {
      padding: 6px 9px;
    }
  }
</style>
`}function Oe(a,t,e=null){window.navigateTo=g=>a(g);const i=document.getElementById("wali-search-input"),n=document.getElementById("wali-search-btn"),s=document.getElementById("wali-guide"),l=document.getElementById("wali-loading"),r=document.getElementById("wali-content"),c=document.getElementById("detail-modal-close");c&&c.addEventListener("click",()=>{document.getElementById("detail-modal").classList.remove("show")});const u=document.getElementById("detail-modal");u&&u.addEventListener("click",function(g){g.target===this&&this.classList.remove("show")}),e&&(async()=>{var g;try{const p=await sa.getPesertaDetail(e);if(l&&(l.style.display="none"),!p||!p.peserta){r&&(r.style.display="block",r.innerHTML=`
              <div style="text-align:center;padding:56px 24px;background:#ffffff;border:1.5px solid rgba(129,81,29,0.15);border-radius:16px;">
                <div style="font-size:54px;margin-bottom:14px;">🔍</div>
                <h3 style="color:#4F280C;font-size:1.25rem;font-weight:800;margin-bottom:8px;">Data Peserta Didik Tidak Ditemukan</h3>
                <p style="color:#81511D;font-size:14px;max-width:440px;margin:0 auto 20px;line-height:1.6;">
                  Laporan santri dengan ID <strong>#${e}</strong> tidak ditemukan atau tautan sudah tidak aktif.
                </p>
                <button onclick="window.navigateTo('/wali')" style="display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:10px;border:none;background:linear-gradient(135deg,#d97706,#F0AF43);color:#1a0a02;font-weight:800;font-size:14px;cursor:pointer;">
                  <i class="fa-solid fa-magnifying-glass"></i> Cari Santri di Portal Wali
                </button>
              </div>`);return}document.title=`Laporan — ${((g=p.peserta)==null?void 0:g.nama_lengkap)||""} | Quran Insight Academy`,r&&(r.style.display="block",r.innerHTML=Oa(p)),await Ga(e,p)}catch(p){l&&(l.style.display="none"),r&&(r.style.display="block",r.innerHTML=`<div style="text-align:center;padding:48px;color:#e05c4b;"><p>Gagal memuat laporan: ${p.message}</p></div>`)}})();async function d(){if(!i)return;const g=i.value.trim();if(!g||g.length<2){t("Masukkan minimal 2 huruf nama peserta didik.","info"),i.focus();return}s&&(s.style.display="none"),l&&(l.style.display="block"),r&&(r.style.display="none",r.innerHTML="");try{const p=await sa.searchPeserta(g);if(l&&(l.style.display="none"),r){if(r.style.display="block",!p||p.length===0){r.innerHTML=`
            <div style="text-align:center;padding:48px;">
              <div style="font-size:52px;margin-bottom:16px;opacity:0.4;">🔍</div>
              <h3 style="color:#4F280C;">Peserta didik tidak ditemukan</h3>
              <p style="color:#81511D;font-size:14px;margin-top:8px;">
                Tidak ada peserta didik aktif dengan nama "<strong>${g}</strong>". Pastikan ejaan sudah benar.
              </p>
            </div>`;return}Ge(p,t)}}catch(p){l&&(l.style.display="none"),r&&(r.style.display="block",r.innerHTML=`<div style="text-align:center;padding:48px;color:#e05c4b;">
          <i class="fa-solid fa-circle-exclamation" style="font-size:36px;margin-bottom:12px;"></i>
          <p>Gagal memuat data: ${p.message}</p></div>`),t("Gagal memuat data. Periksa koneksi Anda.","error")}}n&&n.addEventListener("click",d),i&&i.addEventListener("keydown",g=>{g.key==="Enter"&&d()}),window.openDetailWali=async function(g){var p;document.getElementById("detail-modal").classList.add("show"),document.getElementById("detail-modal-title").textContent="Memuat detail…",document.getElementById("detail-modal-body").innerHTML=`
      <div style="text-align:center;padding:48px;">
        <div style="width:40px;height:40px;border:3px solid rgba(240,175,67,0.2);
          border-top-color:#F0AF43;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;"></div>
      </div>`;try{const o=await sa.getPesertaDetail(g);if(!o||!o.peserta){document.getElementById("detail-modal").classList.remove("show"),t("Data peserta didik tidak ditemukan.","error");return}window._currentWaliData=o,document.getElementById("detail-modal-title").textContent=`Profil — ${((p=o.peserta)==null?void 0:p.nama_lengkap)||""}`,document.getElementById("detail-modal-body").innerHTML=Oa(o),await Ga(g,o)}catch(o){document.getElementById("detail-modal").classList.remove("show"),t("Gagal memuat detail: "+o.message,"error")}},window.openPrintOptionsWali=async function(g){var E;let p=window._currentWaliData;if((!p||Number((E=p.peserta)==null?void 0:E.id)!==Number(g))&&(p=await sa.getPesertaDetail(g),window._currentWaliData=p),!p||!p.peserta){t("Data peserta didik belum lengkap untuk dicetak.","error");return}const o=p.rekapan||[];if(o.length===0){wa(p);return}const _=document.getElementById("wali-print-choice-modal");_&&_.remove();const w=document.createElement("div");w.className="modal-backdrop show",w.id="wali-print-choice-modal",w.style.zIndex="99999",w.innerHTML=`
      <div class="modal modal-md" style="background:#fdf8f3;border:1.5px solid #F0AF43;border-radius:14px;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.25);max-width:500px;width:90%;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <h3 style="margin:0;font-size:1.15rem;font-weight:800;color:#221104;display:flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-file-pdf" style="color:#e05c4b;"></i> Pilih Rapor yang Ingin Dicetak
          </h3>
          <button onclick="document.getElementById('wali-print-choice-modal').remove()" style="background:none;border:none;color:#81511D;font-size:22px;cursor:pointer;padding:0;line-height:1;">&times;</button>
        </div>
        <p style="font-size:13px;color:#81511D;margin:0 0 16px;line-height:1.5;">
          Tersedia laporan sesi berjalan serta rekapan resmi untuk ananda <strong>${W(p.peserta.nama_lengkap)}</strong>:
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;max-height:320px;overflow-y:auto;padding-right:4px;">
          <!-- Cetak Sesi Berjalan -->
          <button onclick="document.getElementById('wali-print-choice-modal').remove();printRaporPeserta(window._currentWaliData)" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#ffffff;border:1.5px solid rgba(129,81,29,0.3);border-radius:10px;cursor:pointer;text-align:left;transition:all 0.2s;">
            <div style="width:38px;height:38px;border-radius:8px;background:#221104;display:flex;align-items:center;justify-content:center;color:#F0AF43;flex-shrink:0;">
              <i class="fa-solid fa-list-check"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:800;font-size:13.5px;color:#221104;">Laporan Sesi Berjalan / Keseluruhan</div>
              <div style="font-size:11.5px;color:#81511D;">Cetak semua riwayat sesi aktif yang tercatat</div>
            </div>
          </button>

          <!-- List Rekapan Tersimpan -->
          ${o.map(b=>`
          <button onclick="document.getElementById('wali-print-choice-modal').remove();window.printRekapWali(${b.id})" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#ffffff;border:1.5px solid #10b981;border-radius:10px;cursor:pointer;text-align:left;transition:all 0.2s;">
            <div style="width:38px;height:38px;border-radius:8px;background:#064e3b;display:flex;align-items:center;justify-content:center;color:#a7f3d0;flex-shrink:0;">
              <i class="fa-solid fa-award"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:800;font-size:13.5px;color:#065f46;">${W(b.judul_rekap)}</div>
              <div style="font-size:11.5px;color:#81511D;">${b.total_sesi} Sesi • Rata Nilai: ${b.rata_nilai||"-"}</div>
            </div>
            <i class="fa-solid fa-print" style="color:#10b981;"></i>
          </button>`).join("")}
        </div>
        <div style="margin-top:16px;text-align:right;">
          <button onclick="document.getElementById('wali-print-choice-modal').remove()" class="btn btn-secondary btn-sm" style="font-weight:700;">Tutup</button>
        </div>
      </div>
    `,document.body.appendChild(w)},window.printRapor=function(g,p){window.openPrintOptionsWali(g)},window.switchWaliTab=function(g){const p=document.getElementById("wali-tab-btn-terbaru"),o=document.getElementById("wali-tab-btn-lampau"),_=document.getElementById("wali-tab-content-terbaru"),w=document.getElementById("wali-tab-content-lampau");g==="terbaru"?(p&&(p.style.background="#221104",p.style.color="#F0AF43",p.style.borderColor="transparent"),o&&(o.style.background="#ffffff",o.style.color="#4F280C",o.style.borderColor="rgba(129,81,29,0.3)"),_&&(_.style.display="block"),w&&(w.style.display="none")):(o&&(o.style.background="#221104",o.style.color="#F0AF43",o.style.borderColor="transparent"),p&&(p.style.background="#ffffff",p.style.color="#4F280C",p.style.borderColor="rgba(129,81,29,0.3)"),_&&(_.style.display="none"),w&&(w.style.display="block"))},window.printRekapWali=function(g){const p=window._currentWaliData;if(!p)return;const o=(p.rekapan||[]).find(_=>Number(_.id)===Number(g));if(!o){alert("Data rekapan tidak ditemukan.");return}wa(p,{rekapan:o})},window.toggleRekapSesiDetail=function(g){const p=document.getElementById(`rekap-sesi-detail-${g}`);if(!p)return;const o=p.style.display==="none";p.style.display=o?"block":"none";const _=document.getElementById(`btn-toggle-text-${g}`);_&&(_.textContent=o?"Sembunyikan Rincian Sesi":"Lihat Rincian Sesi Rekapan Ini")}}function Ge(a,t){const e=document.getElementById("wali-content"),i=a.length;e.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
      <h3 style="color:#1a0a02;font-size:1rem;font-weight:700;">
        <i class="fa-solid fa-users" style="color:#F0AF43;"></i> &nbsp;${i} Peserta Didik Ditemukan
      </h3>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${a.map(n=>Qe(n)).join("")}
    </div>`}function Qe(a){const t=a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa>0?Math.round(a.total_hadir/(a.total_hadir+a.total_izin+a.total_sakit+a.total_alpa)*100):0,e=a.nama_kelas||(a.jenis==="privat"?"Program Privat":"-"),i=a.kitab_surat_terakhir?`${a.kitab_surat_terakhir}${a.halaman_ayat_terakhir?" — "+a.halaman_ayat_terakhir:""}`:"Belum ada catatan";return`
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
          <div style="font-size:22px;font-weight:800;color:${ge(a.rata_nilai)};">${a.rata_nilai||"-"}</div>
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
  </div>`}function Oa(a){var $;const{peserta:t,mentor:e,kelas:i,catatan_mentor:n}=a||{},s=m=>{if(!Array.isArray(m))return[];const v=new Map;return m.forEach(D=>{if(!D||!D.tanggal)return;const f=String(D.tanggal).trim(),R=v.get(f);(!R||(Number(D.id)||0)>(Number(R.id)||0))&&v.set(f,D)}),Array.from(v.values()).sort((D,f)=>String(f.tanggal||"").localeCompare(String(D.tanggal||"")))},l=s(a==null?void 0:a.kemajuan),r=s(a==null?void 0:a.penilaian),c=s(a==null?void 0:a.riwayat_kehadiran),u=(a==null?void 0:a.rekapan)||[],d=u[0]||null,g=new Set;u.forEach(m=>{Array.isArray(m.sesi_ids)&&m.sesi_ids.forEach(v=>g.add(Number(v)))});const p=m=>{if(g.has(Number(m.id)))return!0;for(const v of u)if(Array.isArray(v.sesi_ids)&&v.sesi_ids.length>0){if(v.sesi_ids.map(Number).includes(Number(m.id)))return!0}else{if(v.periode_bulan&&String(m.tanggal||"").startsWith(v.periode_bulan))return!0;if(v.tanggal_mulai&&v.tanggal_selesai&&m.tanggal>=v.tanggal_mulai&&m.tanggal<=v.tanggal_selesai)return!0}return!1},o=c.filter(m=>!p(m)),_=new Set(o.map(m=>m.tanggal).filter(Boolean)),w=l.filter(m=>_.has(m.tanggal)),E=r.filter(m=>_.has(m.tanggal));a._sesiBerjalan=o,a._penilaianBerjalan=E;const b=o.filter(m=>m.status_hadir==="hadir").length,I=o.filter(m=>m.status_hadir==="izin").length,A=o.filter(m=>m.status_hadir==="sakit").length,F=o.filter(m=>m.status_hadir==="alpa"||!["hadir","izin","sakit"].includes(m.status_hadir)&&m.status_hadir).length,y=b+I+A+F,q=y>0?Math.round(b/y*100):o.length===0?100:0,z=E.filter(m=>m.nilai_angka!==null&&m.nilai_angka!==void 0&&!isNaN(parseFloat(m.nilai_angka))),B=z.length>0?(z.reduce((m,v)=>m+parseFloat(v.nilai_angka),0)/z.length).toFixed(1):o.length===0&&(d!=null&&d.rata_nilai)?String(d.rata_nilai):"-",k=(i==null?void 0:i.nama_kelas)||((t==null?void 0:t.jenis)==="privat"?"Program Privat":"-");return`
  <div style="padding:4px 0;color:#1a0a02;">
    <!-- Profile Header -->
    <div class="wali-student-card">
      <div class="wali-student-info-row">
        <div class="wali-student-avatar">
          ${(($=t==null?void 0:t.nama_lengkap)==null?void 0:$.charAt(0))||"?"}
        </div>
        <div class="wali-student-meta">
          <h2 class="wali-student-name">${(t==null?void 0:t.nama_lengkap)||"-"}</h2>
          <div class="wali-student-tags">
            <span class="wali-tag"><i class="fa-solid fa-layer-group" style="color:#F0AF43;"></i> ${k}</span>
            <span class="wali-tag"><i class="fa-solid fa-user-tie" style="color:#F0AF43;"></i> ${(e==null?void 0:e.nama)||"Belum ditentukan"}</span>
            ${i!=null&&i.hari_jadwal?`<span class="wali-tag"><i class="fa-solid fa-calendar" style="color:#F0AF43;"></i> ${i.hari_jadwal} ${i.jam_jadwal||""}</span>`:""}
          </div>
        </div>
      </div>
      <div class="wali-student-action-row">
        <button onclick="openPrintOptionsWali(${t==null?void 0:t.id})" class="wali-print-btn">
          <i class="fa-solid fa-file-pdf"></i> Cetak / Simpan PDF
        </button>
      </div>
    </div>

    <!-- Tabs: Laporan Terbaru / Berjalan vs Arsip Rekapan Lampau -->
    <div style="display:flex;gap:10px;margin-bottom:20px;border-bottom:1.5px solid rgba(129,81,29,0.18);padding-bottom:12px;flex-wrap:wrap;">
      <button id="wali-tab-btn-terbaru" onclick="switchWaliTab('terbaru')" style="padding:10px 20px;border-radius:10px;border:none;font-weight:800;font-size:13.5px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;background:#221104;color:#F0AF43;box-shadow:0 3px 10px rgba(0,0,0,0.15);transition:all 0.2s;">
        <i class="fa-solid fa-sparkles"></i> Laporan Terbaru / Berjalan
      </button>
      <button id="wali-tab-btn-lampau" onclick="switchWaliTab('lampau')" style="padding:10px 20px;border-radius:10px;border:1px solid rgba(129,81,29,0.3);font-weight:700;font-size:13.5px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;background:#ffffff;color:#4F280C;transition:all 0.2s;">
        <i class="fa-solid fa-box-archive"></i> Riwayat Rekapan Lampau
        ${u.length>0?`<span style="background:#F0AF43;color:#1a0a02;font-size:11px;font-weight:800;padding:2px 8px;border-radius:12px;">${u.length}</span>`:""}
      </button>
    </div>

    <!-- TAB CONTENT 1: LAPORAN TERBARU / BERJALAN -->
    <div id="wali-tab-content-terbaru">
      <!-- Highlight Rekapan Terkini Jika Ada -->
      ${d?`
      <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:16px 20px;margin-bottom:16px;box-shadow:0 4px 16px rgba(16,185,129,0.1);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px;">
          <span style="font-weight:800;color:#166534;font-size:14.5px;display:inline-flex;align-items:center;gap:8px;">
            <i class="fa-solid fa-award" style="color:#10b981;"></i> Rekapan Terkini: ${W(d.judul_rekap)}
          </span>
          <button onclick="window.printRekapWali(${d.id})" style="padding:6px 14px;background:#166534;color:#ffffff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
            <i class="fa-solid fa-file-pdf"></i> Cetak Rapor Ini
          </button>
        </div>
        ${d.catatan_evaluasi?`<div style="font-size:13px;color:#1e293b;line-height:1.6;margin-bottom:6px;"><strong>Evaluasi Mentor:</strong> ${W(d.catatan_evaluasi)}</div>`:""}
        ${d.rekomendasi?`<div style="font-size:13px;color:#166534;line-height:1.6;margin-bottom:4px;"><strong>Rekomendasi Kelanjutan:</strong> ${W(d.rekomendasi)}</div>`:""}
        <div style="font-size:11.5px;color:#64748b;margin-top:6px;">
          ${d.tanggal_mulai?`Periode: ${X(d.tanggal_mulai)} s/d ${X(d.tanggal_selesai||d.tanggal_mulai)} • `:""}Total ${d.total_sesi} Sesi • Rata Nilai: <strong>${d.rata_nilai||"-"}</strong>
        </div>
      </div>
      `:""}

      <!-- Status Periode / Paket Berjalan -->
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap;padding:0 2px;">
        <div style="font-size:13px;font-weight:800;color:#221104;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid fa-clock-rotate-left" style="color:#F0AF43;"></i>
          ${(t==null?void 0:t.jenis)==="privat"?d?`Sesi Paket Baru Berjalan: ${o.length} Pertemuan`:`Sesi Paket Berjalan: ${o.length} Pertemuan`:`Sesi Periode Berjalan: ${o.length} Pertemuan`}
        </div>
        ${u.length>0?`
        <span style="font-size:11.5px;color:#81511D;background:#fdf0e2;border:1px solid rgba(129,81,29,0.2);padding:3px 10px;border-radius:12px;">
          <i class="fa-solid fa-check-double" style="color:#10b981;"></i> ${(d==null?void 0:d.total_sesi)||0} sesi lampau telah selesai direkap
        </span>`:""}
      </div>

      <!-- Stats Row (Khusus Sesi Berjalan) -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;">
        ${[[B,"Rata Nilai",ge(parseFloat(B)),"fa-star"],[q+"%","Kehadiran",q>=80?"#10b981":q>=60?"#F0AF43":"#e05c4b","fa-calendar-check"],[b,"Total Hadir","#10b981","fa-circle-check"],[I+A,"Izin/Sakit","#60a5fa","fa-memo-circle-info"],[F,"Alpa","#e05c4b","fa-circle-exclamation"],[z.length,"Total Penilaian","#F0AF43","fa-clipboard-check"]].map(([m,v,D,f])=>`
        <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:14px 16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:${D};margin-bottom:4px;">${m}</div>
          <div style="font-size:11px;color:#81511D;text-transform:uppercase;letter-spacing:0.5px;">${v}</div>
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
            <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Rekap Kehadiran Sesi Berjalan
          </div>
          <canvas id="chart-kehadiran" height="160"></canvas>
        </div>
      </div>

      <!-- Kemajuan Hafalan Sesi Berjalan -->
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
        <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
          <i class="fa-solid fa-book-quran" style="color:#F0AF43;"></i> Riwayat Kemajuan Hafalan
        </h4>
        ${w.length===0?`
          <div style="padding:12px 14px;background:#fdf8f3;border-radius:8px;font-size:13px;color:#81511D;line-height:1.6;">
            ${d!=null&&d.capaian_hafalan?`<strong>Capaian hafalan terakhir paket lalu:</strong> ${W(d.capaian_hafalan)} <span style="display:block;font-size:11.5px;color:#81511D;margin-top:2px;">(Belum ada catatan hafalan baru di sesi berjalan ini)</span>`:"Belum ada catatan kemajuan hafalan pada sesi berjalan."}
          </div>`:`<div style="display:flex;flex-direction:column;gap:0;">
            ${w.slice(0,10).map((m,v)=>`
            <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;
              border-bottom:${v<w.length-1?"1px solid rgba(129,81,29,0.1)":"none"};">
              <div style="width:32px;height:32px;border-radius:50%;
                background:${m.status_kelancaran==="lancar"?"rgba(16,185,129,0.15)":m.status_kelancaran==="cukup"?"rgba(240,175,67,0.15)":"rgba(239,68,68,0.15)"};
                display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <span class="ms" style="font-size:18px;color:${m.status_kelancaran==="lancar"?"#10b981":m.status_kelancaran==="cukup"?"#F0AF43":"#ef4444"};">
                  ${m.status_kelancaran==="lancar"?"check_circle":m.status_kelancaran==="cukup"?"help":"replay"}
                </span>
              </div>
              <div style="flex:1;">
                <div style="font-weight:600;color:#1a0a02;font-size:13.5px;">
                  ${m.kitab_surat} ${m.halaman_ayat?"— "+m.halaman_ayat:""}
                </div>
                ${m.catatan_hafalan?`<div style="font-size:12px;color:#81511D;margin-top:2px;font-style:italic;">"${m.catatan_hafalan}"</div>`:""}
              </div>
              <div style="font-size:11px;color:#81511D;white-space:nowrap;">${X(m.tanggal)}</div>
            </div>`).join("")}
          </div>`}
      </div>

      <!-- Riwayat Kehadiran & Materi Sesi Berjalan -->
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
          <h4 style="color:#1a0a02;margin:0;font-size:14px;">
            <i class="fa-solid fa-calendar-days" style="color:#10b981;"></i> Riwayat Sesi Kehadiran & Materi (Sesi Berjalan)
          </h4>
          <span style="font-size:12px;color:#81511D;font-weight:700;background:#fdf0e2;padding:2px 8px;border-radius:10px;">
            ${o.length} Sesi Aktif
          </span>
        </div>
        ${o.length===0?`
          <div style="text-align:center;padding:24px 16px;background:#fdf8f3;border:1px dashed rgba(129,81,29,0.25);border-radius:10px;color:#81511D;font-size:13px;line-height:1.6;">
            <i class="fa-solid fa-circle-check" style="color:#10b981;margin-right:6px;font-size:16px;"></i>
            Semua pertemuan pada paket sebelumnya (${(d==null?void 0:d.judul_rekap)||"Paket"}) telah selesai direkap.<br>
            Belum ada sesi baru untuk paket berikutnya. Rincian sesi lampau dapat dilihat pada tab <strong>Riwayat Rekapan Lampau</strong> di atas.
          </div>
        `:`
          <div style="overflow-x:auto;">
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
                ${o.slice(0,20).map((m,v)=>`
                <tr style="border-bottom:1px solid rgba(129,81,29,0.07);${v%2===1?"background:#fdf8f3;":""}">
                  <td style="padding:9px 12px;color:#1a0a02;">${X(m.tanggal)}</td>
                  <td style="padding:9px 12px;">${Qa(m.status_hadir)}</td>
                  <td style="padding:9px 12px;color:#4F280C;">${m.materi_pembahasan||"-"}</td>
                  <td style="padding:9px 12px;color:#81511D;font-size:12px;font-style:italic;">${m.catatan_sesi||m.perkembangan_materi||"-"}</td>
                </tr>`).join("")}
              </tbody>
            </table>
          </div>`}
      </div>

      <!-- Catatan Mentor -->
      ${(n||[]).length>0?`
      <div style="background:white;border:1px solid rgba(129,81,29,0.12);border-radius:12px;padding:16px;">
        <h4 style="color:#1a0a02;margin-bottom:14px;font-size:14px;">
          <i class="fa-solid fa-comment-dots" style="color:#60a5fa;"></i> Catatan Ustadz/Ustadzah
        </h4>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${(n||[]).slice(0,5).map(m=>`
          <div style="background:#f8f4ee;border-left:3px solid #F0AF43;border-radius:0 10px 10px 0;padding:12px 16px;">
            <div style="font-size:11px;color:#81511D;margin-bottom:4px;">${X(m.tanggal)}</div>
            <div style="font-size:13.5px;color:#1a0a02;line-height:1.7;">${m.isi_catatan}</div>
          </div>`).join("")}
        </div>
      </div>`:""}
    </div>

    <!-- TAB CONTENT 2: RIWAYAT REKAPAN LAMPAU -->
    <div id="wali-tab-content-lampau" style="display:none;">
      ${u.length===0?`
      <div style="text-align:center;padding:48px 20px;background:white;border:1.5px dashed rgba(129,81,29,0.25);border-radius:14px;">
        <div style="font-size:44px;margin-bottom:12px;">📚</div>
        <h4 style="margin:0 0 8px;color:#221104;font-size:16px;font-weight:800;">Belum Ada Arsip Rekapan Lampau</h4>
        <p style="margin:0 auto;font-size:13px;color:#81511D;line-height:1.6;max-width:440px;">
          Seluruh aktivitas ananda saat ini masih tercatat di <strong>Laporan Terbaru / Berjalan</strong>. Rekapan bulanan atau rekapan paket yang telah selesai akan diarsipkan di sini setelah mentor menerbitkan rekapan resmi.
        </p>
      </div>
      `:`
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="font-size:13px;color:#81511D;">
          Berikut arsip rekapan resmi perkembangan ananda <strong>${W((t==null?void 0:t.nama_lengkap)||"")}</strong>:
        </div>
        ${u.map(m=>{const v=Array.isArray(m.sesi_ids)?m.sesi_ids.map(Number):[];let D=[];return v.length>0?D=c.filter(f=>v.includes(Number(f.id))):m.periode_bulan?D=c.filter(f=>String(f.tanggal||"").startsWith(m.periode_bulan)):m.tanggal_mulai&&m.tanggal_selesai&&(D=c.filter(f=>f.tanggal>=m.tanggal_mulai&&f.tanggal<=m.tanggal_selesai)),`
          <div style="background:white;border:1.5px solid rgba(129,81,29,0.18);border-radius:14px;padding:20px;box-shadow:0 4px 16px rgba(0,0,0,0.05);">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:12px;border-bottom:1px solid rgba(129,81,29,0.12);">
              <div>
                <span style="font-size:16px;font-weight:800;color:#221104;display:inline-flex;align-items:center;gap:8px;">
                  <i class="fa-solid fa-award" style="color:#10b981;"></i> ${W(m.judul_rekap)}
                </span>
                <div style="font-size:12px;color:#81511D;margin-top:2px;">
                  ${m.tanggal_mulai?`Periode: ${X(m.tanggal_mulai)} s/d ${X(m.tanggal_selesai||m.tanggal_mulai)} • `:""}Total ${m.total_sesi} Sesi
                </div>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button onclick="window.printRekapWali(${m.id})" style="padding:8px 14px;background:#221104;color:#F0AF43;border:none;border-radius:8px;font-size:12px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                  <i class="fa-solid fa-file-pdf"></i> Cetak PDF Rapor
                </button>
              </div>
            </div>

            <!-- Stats Ringkas -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:10px;margin:14px 0;">
              <div style="background:#f8f4ee;padding:10px;border-radius:8px;text-align:center;">
                <div style="font-size:18px;font-weight:800;color:#10b981;">${m.total_hadir||0}</div>
                <div style="font-size:10px;color:#81511D;text-transform:uppercase;">Hadir</div>
              </div>
              <div style="background:#f8f4ee;padding:10px;border-radius:8px;text-align:center;">
                <div style="font-size:18px;font-weight:800;color:#F0AF43;">${(m.total_izin||0)+(m.total_sakit||0)}</div>
                <div style="font-size:10px;color:#81511D;text-transform:uppercase;">Izin/Sakit</div>
              </div>
              <div style="background:#f8f4ee;padding:10px;border-radius:8px;text-align:center;">
                <div style="font-size:18px;font-weight:800;color:#e05c4b;">${m.total_alpa||0}</div>
                <div style="font-size:10px;color:#81511D;text-transform:uppercase;">Alpa</div>
              </div>
              <div style="background:#f8f4ee;padding:10px;border-radius:8px;text-align:center;">
                <div style="font-size:18px;font-weight:800;color:#221104;">${m.rata_nilai||"-"}</div>
                <div style="font-size:10px;color:#81511D;text-transform:uppercase;">Rata Nilai</div>
              </div>
            </div>

            ${m.capaian_hafalan?`
            <div style="font-size:12.5px;color:#4F280C;margin-bottom:8px;">
              <strong>Capaian Hafalan Terakhir:</strong> ${W(m.capaian_hafalan)}
            </div>`:""}

            ${m.catatan_evaluasi?`
            <div style="background:#fdf8f3;border-left:3px solid #10b981;border-radius:0 8px 8px 0;padding:10px 14px;font-size:13px;color:#1a0a02;line-height:1.6;margin-bottom:8px;">
              <strong>Evaluasi Mentor:</strong> ${W(m.catatan_evaluasi)}
            </div>`:""}

            ${m.rekomendasi?`
            <div style="background:#f0fdf4;border-left:3px solid #059669;border-radius:0 8px 8px 0;padding:10px 14px;font-size:13px;color:#166534;line-height:1.6;margin-bottom:12px;">
              <strong>Rekomendasi Kelanjutan:</strong> ${W(m.rekomendasi)}
            </div>`:""}

            <!-- Tombol Toggle Rincian Sesi -->
            <div style="margin-top:10px;">
              <button onclick="window.toggleRekapSesiDetail(${m.id})" style="background:none;border:none;color:#81511D;font-weight:800;font-size:12.5px;cursor:pointer;padding:0;text-decoration:underline;">
                <span id="btn-toggle-text-${m.id}">Lihat Rincian Sesi Rekapan Ini</span>
              </button>
            </div>

            <!-- Rincian Sesi (Collapsible) -->
            <div id="rekap-sesi-detail-${m.id}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px dashed rgba(129,81,29,0.2);">
              <h5 style="margin:0 0 10px;font-size:12px;color:#4F280C;text-transform:uppercase;letter-spacing:0.5px;">Daftar Sesi Rekapan:</h5>
              ${D.length===0?'<div style="font-size:12px;color:#81511D;">Tidak ada data detail sesi.</div>':`
              <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:12px;">
                  <thead>
                    <tr style="background:#f8f4ee;">
                      <th style="padding:6px 10px;text-align:left;color:#4F280C;">Tanggal</th>
                      <th style="padding:6px 10px;text-align:left;color:#4F280C;">Status</th>
                      <th style="padding:6px 10px;text-align:left;color:#4F280C;">Materi</th>
                      <th style="padding:6px 10px;text-align:left;color:#4F280C;">Catatan Sesi</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${D.map(f=>`
                    <tr style="border-bottom:1px solid rgba(129,81,29,0.08);">
                      <td style="padding:6px 10px;">${X(f.tanggal)}</td>
                      <td style="padding:6px 10px;">${Qa(f.status_hadir)}</td>
                      <td style="padding:6px 10px;">${W(f.materi_pembahasan||"-")}</td>
                      <td style="padding:6px 10px;color:#81511D;font-style:italic;">${W(f.catatan_sesi||f.perkembangan_materi||"-")}</td>
                    </tr>`).join("")}
                  </tbody>
                </table>
              </div>`}
            </div>
          </div>`}).join("")}
      </div>`}
    </div>
  </div>`}async function Ga(a,t){try{const e=await sa.getChartDataPeserta(a),n=(Array.isArray(t==null?void 0:t._penilaianBerjalan)?t._penilaianBerjalan:e.penilaian||[]).filter(p=>p.nilai_angka!==null&&p.nilai_angka!==void 0&&!isNaN(parseFloat(p.nilai_angka))).slice(-12),s=document.getElementById("chart-nilai");n.length>0&&s?new Chart(s,{type:"line",data:{labels:n.map(p=>Je(p.tanggal)),datasets:[{label:"Nilai",data:n.map(p=>p.nilai_angka),borderColor:"#F0AF43",backgroundColor:"rgba(240,175,67,0.15)",tension:.4,fill:!0,pointRadius:4}]},options:{responsive:!0,plugins:{legend:{display:!1}},scales:{y:{min:0,max:100,grid:{color:"rgba(0,0,0,0.05)"}},x:{grid:{display:!1}}}}}):s&&s.parentElement&&(s.parentElement.innerHTML=`
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-line" style="color:#F0AF43;"></i> Tren Nilai
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-chart-line" style="font-size:26px;margin-bottom:8px;color:#d97706;"></i>
          Belum ada riwayat penilaian di sesi berjalan
        </div>`);let l=0,r=0,c=0,u=0;if(Array.isArray(t==null?void 0:t._sesiBerjalan))l=t._sesiBerjalan.filter(p=>p.status_hadir==="hadir").length,r=t._sesiBerjalan.filter(p=>p.status_hadir==="izin").length,c=t._sesiBerjalan.filter(p=>p.status_hadir==="sakit").length,u=t._sesiBerjalan.filter(p=>p.status_hadir==="alpa"||!["hadir","izin","sakit"].includes(p.status_hadir)&&p.status_hadir).length;else{const p=(t==null?void 0:t.kehadiran_summary)||{};l=p.hadir||0,r=p.izin||0,c=p.sakit||0,u=p.alpa||0}const d=l+r+c+u,g=document.getElementById("chart-kehadiran");d>0&&g?new Chart(g,{type:"doughnut",data:{labels:["Hadir","Izin","Sakit","Alpa"],datasets:[{data:[l,r,c,u],backgroundColor:["#10b981","#F0AF43","#60a5fa","#e05c4b"]}]},options:{responsive:!0,cutout:"65%",plugins:{legend:{position:"bottom",labels:{boxWidth:12,padding:12,font:{size:12}}}}}}):g&&g.parentElement&&(g.parentElement.innerHTML=`
        <div style="font-size:13px;font-weight:700;color:#1a0a02;margin-bottom:12px;">
          <i class="fa-solid fa-chart-pie" style="color:#10b981;"></i> Rekap Kehadiran
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:140px;color:#81511D;opacity:0.75;font-size:12.5px;">
          <i class="fa-solid fa-calendar-check" style="font-size:26px;margin-bottom:8px;color:#10b981;"></i>
          Belum ada sesi pada paket berjalan
        </div>`)}catch{}}function ge(a){return a=parseFloat(a),isNaN(a)?"#81511D":a>=80?"#10b981":a>=65?"#F0AF43":"#e05c4b"}function Qa(a){const t={hadir:["check_circle","#10b981","rgba(16,185,129,0.12)","Hadir"],izin:["description","#F0AF43","rgba(240,175,67,0.12)","Izin"],sakit:["sick","#60a5fa","rgba(59,130,246,0.12)","Sakit"],alpa:["cancel","#e05c4b","rgba(239,68,68,0.12)","Alpa"]},[e,i,n,s]=t[a]||["help","#81511D","rgba(0,0,0,0.06)",a];return`<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;
    border-radius:20px;background:${n};color:${i};font-size:12px;font-weight:600;">
    <span class="ms" style="font-size:15px;">${e}</span> ${s}</span>`}function X(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}):"-"}function Je(a){return a?new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"short"}):"-"}function W(a){return a?String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Sa(a,t="info",e=3500){const i=document.getElementById("toast-container");if(!i)return;const n={success:"fa-circle-check",error:"fa-circle-xmark",info:"fa-circle-info"},s=document.createElement("div");s.className=`toast toast-${t}`,s.innerHTML=`<i class="fa-solid ${n[t]||"fa-circle-info"} toast-icon"></i> ${a}`,i.appendChild(s),requestAnimationFrame(()=>{requestAnimationFrame(()=>{s.classList.add("show")})}),setTimeout(()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),350)},e)}const Ja={"/":{render:Za},"/admin":{render:_e},"/mentor":{render:de},"/wali":{render:za},"/portal-wali":{render:za},"/laporan":{render:za}};async function ea(a,t=!0){const e=a||"/",[i]=e.split("?"),n=(i||"/").replace(/\/$/,"")||"/";t&&history.pushState({},"",e);const s=document.getElementById("app");if(!s)return;const l=Ja[n]||Ja["/"];s.style.opacity="0.7",s.style.transition="opacity 0.15s ease",await new Promise(r=>setTimeout(r,60)),s.innerHTML="",s.style.opacity="1";try{await l.render(s,ea,Sa)}catch(r){console.error("Render error on route",n,r),Sa("Terjadi kesalahan saat memuat halaman: "+r.message,"error")}}window.navigate=ea;window.navigateTo=ea;window.showToast=Sa;document.addEventListener("click",a=>{const t=a.target.closest("[data-link]");if(t){a.preventDefault();const e=t.getAttribute("href")||t.dataset.link;e&&ea(e)}});window.addEventListener("popstate",()=>{ea(window.location.pathname,!1)});(async()=>{try{const a=document.getElementById("initial-loader");a&&(a.style.opacity="0",setTimeout(()=>{a.parentNode&&a.remove()},200)),ia.onAuthStateChange(t=>{if(t==="SIGNED_OUT"){const e=window.location.pathname;(e==="/admin"||e==="/mentor")&&ea("/")}}),await ea(window.location.pathname,!1)}catch(a){console.error("Fatal boot error:",a);const t=document.getElementById("initial-loader");t&&t.remove();const e=document.getElementById("app");e&&!e.innerHTML.trim()&&Za(e,ea)}})();
