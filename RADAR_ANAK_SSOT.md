# RADAR ANAK
## Single Source of Truth (SSOT) — Arsitektur & Desain Sistem

**Status:** Dokumen hidup (*living document*) — kontrak keputusan tunggal untuk seluruh arsitektur dan desain RADAR ANAK.

**Cakupan:** Dokumen ini mengatur **seluruh sistem RADAR ANAK**, yang terdiri dari dua sistem:

1. **Aplikasi web terpadu** — satu codebase Next.js, satu deployment, satu database — yang melayani dua pengalaman dengan filosofi desain yang sengaja dibuat berbeda: **Website Publik** (situs showcase, transparansi dampak, dan donasi yang diakses juri, donatur, dinas terkait, dan masyarakat umum) dan **Dashboard Operator** (alat kerja harian operator kelurahan, verifikator independen, RT/RW, dan admin konten).
2. **WhatsApp Bot** — kanal pelaporan berbasis percakapan untuk RT/RW dan warga. Webhook penerimanya hidup di aplikasi web yang sama, namun secara filosofi dan sifat interaksi ia berdiri sebagai sistem kedua yang berbeda dari kedua pengalaman web di atas (percakapan, bukan antarmuka web).

Setiap developer yang bergabung ke proyek ini wajib membaca dokumen ini secara utuh sebelum menyentuh kode. Dokumen ini bukan tutorial — ini adalah **kontrak keputusan**. Jika sebuah keputusan implementasi tidak sejalan dengan prinsip di sini, diskusikan dan revisi dokumen ini terlebih dahulu; jangan menyimpang diam-diam di kode. Ini termasuk memahami **mengapa** Website Publik dan Dashboard Operator sengaja dibuat terasa seperti dua produk yang berbeda meski hidup dalam satu repo yang sama, dan mengapa WhatsApp Bot dihitung sebagai sistem yang berdiri sendiri meski secara teknis "menumpang" pada aplikasi yang sama.

---

# 1. Vision & Philosophy

## 1.1 Mengapa Sistem Ini Ada

RADAR ANAK lahir dari satu fakta lapangan yang tidak nyaman: **kelurahan menyatakan tidak ada anak putus sekolah, padahal wawancara langsung ke RT/RW menemukan 7 anak.** Ini bukan soal warga menyembunyikan informasi — ini soal *tidak ada jalur mudah untuk melaporkannya*. RT/RW dan warga tidak punya cara sederhana menyampaikan "saya lihat ada anak yang berhenti sekolah" ke kelurahan, sehingga informasi itu berhenti di obrolan warung, tidak pernah sampai ke pihak yang bisa membantu.

Fakta lapangan yang sama ini melahirkan kebutuhan tiga audiens yang berbeda secara mendasar, dan RADAR ANAK dirancang untuk melayani ketiganya secara sengaja berbeda — bukan lewat satu antarmuka generik yang dipaksakan cocok untuk semua orang:

- **Warga dan RT/RW** butuh satu pintu pelaporan yang sudah familiar, tanpa perlu belajar aplikasi baru, tanpa perlu datang ke kantor kelurahan, tanpa perlu tahu harus lapor ke siapa — inilah yang dijawab **WhatsApp Bot** (Bagian 17).
- **Operator kelurahan dan verifikator** butuh alat kerja yang cepat, padat informasi, dan bisa diandalkan dipakai berulang setiap hari — termasuk saat sinyal internet buruk — inilah yang dijawab **Dashboard Operator**.
- **Publik** — juri, donatur, dinas terkait, masyarakat umum — butuh **dipercaya** dalam sepuluh detik pertama, lalu diberi bukti yang bisa mereka telusuri sendiri, bahwa masalah ini nyata dan program ini benar-benar menanganinya sampai tuntas — inilah yang dijawab **Website Publik**, sebagai instrumen kredibilitas, bukan brosur digital.

Ketiga kebutuhan ini tidak bisa dilayani satu bahasa desain atau satu antarmuka yang sama. Maka arsitektur sistem ini secara sengaja **memisahkan pengalaman** (filosofi desain berbeda untuk tiap permukaan) sambil **menyatukan infrastruktur data** (satu backend, satu database, satu tim yang merawat) di mana pun itu masuk akal untuk dilakukan.

## 1.2 Dua Sistem, Bukan Tiga

Secara arsitektural, RADAR ANAK terdiri dari **dua sistem** — bukan tiga permukaan yang berdiri sendiri-sendiri:

1. **Satu aplikasi web Next.js** yang melayani Website Publik dan Dashboard Operator sekaligus, dari satu codebase, satu deployment, satu database.
2. **WhatsApp Bot**, sebagai kanal pelaporan yang secara fundamental berbeda sifatnya (percakapan, bukan antarmuka web) — meski secara teknis endpoint webhook penerimanya tetap hidup di dalam aplikasi Next.js yang sama (Bagian 17), ia dihitung sebagai sistem kedua karena cara berinteraksi dengannya sama sekali berbeda dari membuka sebuah halaman web.

Prinsip inti untuk sistem pertama: **route group adalah batas desain, bukan batas data.** Website Publik hidup di `app/(public)/`, Dashboard Operator hidup di `app/(dashboard)/` — keduanya bagian dari aplikasi Next.js yang sama, di-deploy bersamaan, membaca dari database yang sama. Batas ini dijaga lewat dua mekanisme:

1. **Batas visual** — token desain (warna, tipografi, motion, radius, shadow) di-scope terpisah per route group lewat CSS variable override (Bagian 2, Bagian 10), bukan satu set token global yang dipakai bersama secara naif.
2. **Batas akses** — middleware Next.js melindungi seluruh `app/(dashboard)/*` dengan pengecekan autentikasi + peran (Bagian 3.4); Website Publik tidak punya gerbang otentikasi sama sekali karena memang untuk semua orang.

**Alasan menyatukan Website Publik dan Dashboard Operator, bukan memisahkannya jadi dua aplikasi:** dua deployment terpisah berarti dua pipeline CI/CD, dua tempat memantau error, dan — paling penting — risiko skema data yang perlahan tidak sinkron antara "database publik" dan "database dashboard" jika keduanya sempat dipisah secara fisik. Satu aplikasi dengan route group berarti satu sumber kebenaran skema (Bagian 15), diwariskan otomatis ke kedua pengalaman tanpa duplikasi.

Developer wajib memahami pembedaan ini sebelum menyentuh kode: mencampur bahasa visual keduanya (misalnya menaruh motion Awwwards-tier di Dashboard, atau kepadatan data ala Dashboard di Website Publik) adalah pelanggaran terhadap dokumen ini.

## 1.3 Filosofi Desain — Website Publik (`app/(public)/`)

**Swiss Editorial Design** menyediakan tulang punggung struktural: grid disiplin, tipografi hierarkis, margin yang dihormati, komposisi asimetris yang tetap patuh pada grid. Filosofi ini dipilih karena subjek yang dibawa situs ini — data anak putus sekolah, statistik penanganan, akuntabilitas program — adalah subjek yang menuntut *kredibilitas melalui ketertiban visual*. Swiss grid, secara historis, adalah bahasa visual laporan tahunan, jurnal ilmiah, dan dokumentasi institusional — ia berbicara "ini serius dan ini bisa dipercaya" tanpa perlu mengatakannya secara eksplisit.

**Neo-Brutalism** hadir sebagai *aksen*, bukan struktur. Ia dipakai secara sengaja terbatas: border tebal yang tidak berusaha bersembunyi, bayangan keras (hard offset shadow) tanpa blur, transisi antar-state yang tegas alih-alih memudar lembut. Fungsi brutalism di sini adalah menandai **momen kebenaran** — ketika situs menunjukkan angka temuan (7 anak, bukan 0 seperti klaim awal), border tebal dan potongan tajam itu berfungsi seperti garis bawah tebal di atas kertas: ia berkata "ini fakta, bukan opini, dan kami tidak menyembunyikannya di balik desain yang lembut."

**Awwwards Tier Experience** adalah standar kualitas motion dan interaksi — bukan gaya visual tersendiri, melainkan level eksekusi. Ia memastikan choreography animasi, transisi scroll, dan micro-interaction terasa disengaja dan presisi, bukan template generik yang "hidup" secara serampangan.

### Ketegangan yang Harus Dikelola

Ketiga filosofi ini punya potensi konflik yang harus ditangani secara eksplisit, bukan diabaikan: Neo-Brutalism secara historis condong ke gaya yang agresif, bahkan sinis. Situs ini berbicara tentang anak-anak rentan. **Brutalism yang tidak dikendalikan akan terasa tidak pantas terhadap subjeknya.** Maka aturan tegasnya: **Swiss grid adalah pagar, brutalism adalah aksen di dalam pagar itu — brutalism tidak pernah diizinkan mendikte struktur, hanya menandai penekanan pada titik-titik naratif tertentu** (reveal data, angka statistik, CTA donasi). Di luar titik-titik itu, situs tetap tenang, editorial, dan penuh ruang kosong yang menghormati martabat subjek yang dibicarakan.

Dengan batasan ini, hasil akhirnya adalah pengalaman yang terasa *tegas tapi bukan pamer* — persis nada yang dibutuhkan untuk meyakinkan orang dewasa yang skeptis (donatur, dinas, juri) bahwa mahasiswa KKN ini membangun sesuatu yang benar-benar dipikirkan matang, bukan sekadar proyek tugas kuliah.

## 1.4 Filosofi Desain — Dashboard Operator (`app/(dashboard)/`)

Dashboard menganut filosofi yang **secara sengaja berlawanan** dengan Website Publik: **utility-first, boring-is-good.** Tiga prinsip:

**Density over whitespace.** Operator kelurahan perlu melihat banyak kasus sekaligus dalam satu pandangan — ruang kosong lega yang jadi kebajikan di Website Publik justru jadi pemborosan di sini.

**Speed over spectacle.** Tidak ada choreography, tidak ada scroll-linked reveal, tidak ada GSAP. Setiap animasi di Dashboard dibatasi motion Tier 3 (Bagian 5) — transisi state singkat (<150ms) yang nyaris tidak disadari, karena antarmuka yang "menawan" di pemakaian pertama akan terasa mengganggu di pemakaian ke-50 (dipakai berulang, tiap hari, oleh orang yang sedang bekerja bukan berwisata visual).

**Resilience over polish.** Dashboard harus tetap berfungsi — meski terbatas — saat sinyal internet lemah (Bagian 3.5, PWA offline-first) karena inilah alat kerja yang menentukan apakah kasus anak benar-benar tertangani, bukan brosur yang boleh gagal dimuat sesekali.

**Prinsip pemisahan mutlak:** primitif UI Dashboard (Button, Card, Table) dibangun terpisah dari primitif Website Publik (Bagian 9), meski secara teknis berada dalam satu repo — mencegah "kebocoran" gaya brutalist ke dalam alat kerja yang butuh netral dan cepat dibaca.

## 1.5 Mengapa WhatsApp Bot Ada, dan Mengapa WhatsApp

**Masalah yang dijawab.** Temuan lapangan yang mendasari seluruh RADAR ANAK (Bagian 1.1) adalah soal *tidak adanya jalur mudah untuk melapor* — RT/RW dan warga tidak punya cara sederhana menyampaikan "saya lihat ada anak yang berhenti sekolah" ke kelurahan, sehingga informasi itu berhenti di obrolan warung. WhatsApp Bot menjawab persis masalah ini: menyediakan **satu pintu pelaporan yang sudah familiar** bagi siapa pun, tanpa perlu belajar aplikasi baru, tanpa perlu datang ke kantor kelurahan, tanpa perlu tahu harus lapor ke siapa.

**Mengapa WhatsApp, bukan aplikasi terpisah.** RT/RW dan warga sudah membuka WhatsApp setiap hari — memaksa mereka install aplikasi baru untuk urusan yang jarang terjadi (melaporkan satu-dua anak per tahun) hampir pasti akan diabaikan. WhatsApp menghilangkan seluruh hambatan itu: tidak ada instalasi, tidak ada akun baru, tidak ada kurva belajar. Pelapor cukup mengetik seperti mengirim pesan biasa ke teman.

Detail lengkap alur percakapan, kontrak integrasi teknis, keamanan, biaya, dan batasan WhatsApp Bot dijelaskan penuh di **Bagian 17**.

---

# 2. Design Direction

## 2.1 Website Publik

**Tipografi.** Dua keluarga font: satu **display serif editorial** untuk headline dan angka statistik besar (memberi kesan "laporan/jurnal", bukan "aplikasi startup"), satu **grotesk sans** netral untuk UI, navigasi, dan body text (memastikan keterbacaan tinggi di layar). Angka statistik (7 anak, 15 dicegah, dst.) selalu memakai display serif dalam ukuran oversized — angka-angka ini adalah bukti dampak program, sehingga secara hierarki visual mereka harus menjadi elemen paling mencolok di halaman, bukan disamarkan sebagai teks biasa. Ukuran tipografi menggunakan skala fluida berbasis `clamp()`, bukan lompatan breakpoint kaku — ini penting khusus untuk angka besar bergaya editorial, yang jika di-breakpoint secara diskrit akan terlihat "meloncat" janggal antar ukuran layar.

**Grid.** Grid 12 kolom dengan gutter konsisten menjadi fondasi semua layout, termasuk layout yang terlihat asimetris (misalnya split dua panel di section kontras "klaim vs temuan"). Asimetri di sini adalah *disiplin*, bukan kebebasan — setiap elemen tetap snap ke garis grid yang sama; yang membuatnya terasa editorial adalah proporsi kolom yang tidak 50:50 melainkan, misalnya, 7:5 — pola yang lazim di majalah/laporan tercetak.

**Warna.** Palet dijaga sangat terbatas: latar netral seperti kertas (off-white, bukan putih murni untuk mengurangi silau digital), teks nyaris hitam, dan **satu** warna aksen yang direservasi khusus untuk momen "kebenaran/urgensi" (angka temuan, CTA donasi, status kasus yang berhasil ditangani). Warna aksen ini sengaja tidak dipakai dekoratif di tempat lain — begitu ia muncul di mana-mana, ia kehilangan daya kejut yang justru menjadi fungsinya.

**Elemen Struktural Brutalist.** Border tebal solid (bukan gradasi/blur), bayangan offset keras (`4px 4px 0`, tanpa blur radius), radius sudut nyaris nol di seluruh situs — dengan satu pengecualian eksplisit yang didokumentasikan di Bagian 10: kartu di Galeri Karya anak diberi radius kecil dan sudut yang sedikit lebih lembut, karena bagian ini secara sengaja diberi kehangatan berbeda (ini adalah karya anak-anak, bukan data kasus).

## 2.2 Dashboard Operator

**Tipografi.** Satu keluarga font saja: grotesk sans fungsional, tanpa serif editorial, tanpa ukuran oversized dekoratif. Ukuran mengikuti skala fungsional standar (bukan `clamp()` dramatis) — teks di Dashboard harus *scan-able* cepat, bukan dinikmati sebagai tipografi.

**Grid.** Grid data padat (*dense data grid*) — tabel, kartu kasus, dan kolom Kanban mengisi ruang secara efisien, bukan grid editorial asimetris bergaya majalah.

**Warna.** Warna di Dashboard **fungsional, bukan naratif** — dipakai untuk mengkodekan status (badge merah = mangkrak, kuning = menunggu bukti, hijau = selesai terverifikasi), bukan untuk membangun mood. Palet netral dasar bisa berbagi nilai HSL dasar dengan Website Publik (efisiensi token), tapi warna aksen "kebenaran" Website Publik **tidak** dipakai di sini — Dashboard punya sistem warna status sendiri yang independen.

**Elemen Struktural.** Tidak ada border tebal brutalist, tidak ada bayangan offset keras. Chrome antarmuka (border, shadow) dibuat setipis dan senetral mungkin — radius kecil konsisten (bukan nol), shadow lembut minimal hanya untuk menunjukkan elevasi (mis. modal di atas konten), karena di Dashboard **data adalah fokus visual, bukan bingkai di sekelilingnya.**

**Token yang dibagi lintas keduanya:** skala spacing dasar dan nilai HSL warna netral (agar tidak dua sistem angka spacing yang berbeda tanpa alasan) — didefinisikan sekali di konfigurasi Tailwind root, di-override warna aksen/status secara terpisah per route group lewat CSS variable scoping.

---

# 3. Frontend Architecture

## 3.1 Model Rendering: React Server Components sebagai Default

*(Berlaku untuk kedua route group)* Next.js App Router dipakai dengan filosofi **Server Components sebagai default, Client Components sebagai pengecualian yang disengaja**. Sebagian besar konten Website Publik adalah data yang di-fetch lalu ditampilkan (statistik agregat, konten Tentang Program, Laporan Publik) — ini murni tanggung jawab server, tidak butuh interaktivitas sisi klien. Client Components hanya dipakai secara eksplisit untuk: (1) apa pun yang menjalankan GSAP/animasi, (2) form interaktif (donasi, kontak), (3) peta interaktif, (4) cursor/gesture custom (Website Publik) — dan, di sisi Dashboard, untuk (5) Kanban board drag-and-drop, dan (6) berlangganan data real-time.

Alasan pemisahan tegas ini: setiap byte JavaScript yang dikirim ke browser adalah biaya performa. Sebuah situs showcase yang lambat dimuat justru merusak kredibilitas yang ingin dibangun — donatur yang menunggu 4 detik untuk melihat statistik dampak akan menutup tab sebelum data itu sempat meyakinkan mereka.

## 3.2 Satu Aplikasi, Dua Route Group

```
app/
  (public)/            → Website Publik: Beranda, Peta Transparansi, Dampak Program, Galeri Karya, Donasi
  (dashboard)/         → Dashboard Operator: dilindungi middleware auth
    layout.tsx         → root layout Dashboard, memuat provider Realtime + theme Dashboard
    page.tsx           → Ringkasan/Home
    kasus/             → Daftar & detail kasus, Kanban
    verifikasi/        → Modul khusus role verifikator
    konten/            → Manajemen konten Tentang Program & Laporan Publik (menyatu penuh ke dalam Dashboard sebagai satu section dengan role "admin konten", lihat Bagian 15.8)
  api/
    webhook/whatsapp/  → Route Handler penerima webhook Meta (Bagian 17)
    stats/             → Endpoint agregat publik (Edge Runtime)
    kasus/             → Route Handler CRUD kasus (Node Runtime, dilindungi RBAC)
```

Root layout aplikasi (`app/layout.tsx`) sengaja dibuat setipis mungkin — hanya font loading global dan provider paling dasar. Theme, provider motion (GSAP/Lenis), dan provider Realtime masing-masing didaftarkan di layout milik route group masing-masing (`(public)/layout.tsx` vs `(dashboard)/layout.tsx`), **bukan** di root — ini mencegah bundle Website Publik ikut membawa dependency Dashboard (Supabase Realtime subscription, TanStack Table, dnd-kit) yang tidak dibutuhkannya, dan sebaliknya.

## 3.3 Arsitektur Komponen — Website Publik

Komponen Website Publik dipecah menjadi tiga lapisan tanggung jawab yang tidak boleh tercampur dalam satu file:

1. **Data layer** — Server Component yang melakukan fetching, tidak tahu apa pun soal animasi.
2. **Presentation layer** — komponen murni (menerima props, me-render markup), tidak melakukan fetching.
3. **Motion layer** — Client Component tipis yang membungkus presentation layer khusus untuk menambahkan perilaku animasi (menggunakan hook motion reusable, lihat Bagian 9.3).

Pemisahan ini memastikan animasi tidak pernah "membajak" komponen data, dan komponen presentasi tetap bisa diuji/dipakai ulang tanpa dependency ke GSAP.

## 3.4 Tiga Kelas Halaman

- **Halaman nyaris-statis** (Website Publik: Tentang Program, Filosofi, Kerja Sama Instansi) — di-generate sebagai Static Site Generation penuh, direvalidasi hanya ketika admin konten memperbarui konten (on-demand revalidation via webhook), karena kontennya jarang berubah.
- **Halaman berbasis data agregat** (Website Publik: Beranda dengan statistik dampak, Peta Transparansi) — menggunakan Incremental Static Regeneration dengan interval revalidasi (Bagian 14), karena datanya berubah seiring kasus baru diproses di Dashboard, namun tidak butuh real-time.
- **Halaman real-time** (Dashboard: Ringkasan, Daftar Kasus, Kanban) — **BUKAN** ISR. Menggunakan langganan Supabase Realtime di Client Component sehingga kasus baru dan perubahan status muncul tanpa refresh manual — kebutuhan inti Dashboard karena operator harus tahu ada laporan baru sesegera mungkin, sementara Website Publik cukup data yang direvalidasi berkala tanpa kehilangan manfaat nyata bagi pengunjungnya.

## 3.5 Batas Autentikasi & RBAC

Middleware Next.js memeriksa setiap request ke `app/(dashboard)/*`: belum terautentikasi → redirect ke halaman login; terautentikasi tapi peran tidak sesuai sub-route (mis. RT/RW mencoba mengakses modul Verifikasi yang khusus verifikator independen) → ditolak dengan pesan jelas, dicatat di jejak audit (Bagian 15.1). Website Publik tidak melewati middleware ini sama sekali.

## 3.6 Lapisan PWA — Di-scope Hanya ke Dashboard

**Keputusan eksplisit:** kemampuan PWA (manifest, service worker, installable ke home screen, offline caching) hanya diaktifkan untuk `app/(dashboard)/*`. Website Publik **tidak** dibuat installable — pengunjung situs showcase datang sesekali, tidak perlu "menginstal" situs yang mereka lihat beberapa menit. Menambahkan service worker ke seluruh domain hanya menambah kompleksitas caching tanpa manfaat nyata di sisi Publik.

Strategi service worker Dashboard: *cache-first* untuk aset statis (shell aplikasi, ikon, font), *network-first dengan fallback ke cache* untuk data kasus — operator tetap bisa melihat data kasus terakhir yang berhasil dimuat saat sinyal hilang, meski tidak bisa mengubah status sampai koneksi kembali.

---

# 4. Frontend Technology Stack

## 4.1 Teknologi Bersama & Khusus Website Publik

### Next.js

**Tujuan:** Framework inti aplikasi.
**Masalah yang diselesaikan:** SEO (donatur dan dinas akan menemukan situs ini lewat pencarian atau tautan yang dibagikan; konten harus ter-render di sisi server untuk crawlability), performa loading awal (kombinasi SSG/ISR menghasilkan Time to First Byte yang jauh lebih cepat dibanding SPA murni), dan pengalaman developer yang matang (routing berbasis file, image optimization bawaan, font loading optimal).
**Kelebihan dibanding alternatif:** Dibanding Vite+React SPA murni, Next.js memberi SSR/SSG/ISR tanpa konfigurasi manual yang rumit. Dibanding Remix, ekosistem Next.js (khususnya di Vercel) memberi integrasi Edge Function dan Image Optimization yang lebih matang untuk kebutuhan situs media-berat seperti ini.
**Area implementasi:** Seluruh aplikasi.
**Dampak UX/performa:** Loading awal cepat = kesan pertama meyakinkan; App Router memungkinkan streaming render sehingga bagian atas halaman (hero) bisa tampil sebelum data statistik di bawahnya selesai di-fetch.

### React

**Tujuan:** Model komponen dan reconciliation UI.
**Masalah yang diselesaikan:** Mengelola state interaktif lokal (form, toggle menu, state peta) dengan model deklaratif yang dapat diprediksi.
**Kelebihan dibanding alternatif:** Ekosistem library animasi/aksesibilitas (Radix, GSAP React integration) paling matang ada di React; tim developer sudah familiar dengan React sehingga tidak ada learning-curve tambahan untuk handover ke tim KKN berikutnya.
**Area implementasi:** Seluruh UI interaktif.
**Dampak:** Fondasi, tidak berdiri sendiri sebagai keputusan berisiko.

### TypeScript

**Tujuan:** Type safety di seluruh codebase, termasuk bentuk data statistik yang dikonsumsi dari API agregat.
**Masalah yang diselesaikan:** Mencegah bug diam-diam ketika bentuk data dari backend berubah (misalnya field kategori kasus berubah nama) — TypeScript membuat perubahan itu gagal di waktu kompilasi, bukan tampil sebagai `undefined` di production yang dilihat donatur.
**Kelebihan dibanding alternatif:** Dibanding JavaScript murni, TypeScript memberi kontrak eksplisit antara data agregat dan komponen yang mengonsumsinya — krusial karena Website Publik dan Dashboard berbagi satu skema data.
**Area implementasi:** Seluruh codebase, tanpa pengecualian.
**Dampak:** Mengurangi kelas bug tertentu drastis, sedikit menambah waktu setup awal yang terbayar di maintenance jangka panjang.

### Tailwind CSS

**Tujuan:** Styling utility-first yang menegakkan design token secara konsisten.
**Masalah yang diselesaikan:** Mencegah drift visual (developer berbeda menulis `padding: 23px` vs `24px` di tempat berbeda) dengan memaksa semua nilai spacing/warna/radius diambil dari token yang didefinisikan sekali di konfigurasi (Bagian 10).
**Kelebihan dibanding alternatif:** Dibanding CSS Modules atau styled-components, Tailwind menghasilkan bundle CSS yang lebih kecil (hanya kelas yang benar-benar dipakai) dan mempercepat iterasi visual — penting karena situs ini punya banyak keputusan visual detail (border brutalist, shadow offset) yang perlu di-tweak cepat selama development.
**Area implementasi:** Seluruh styling, kecuali animasi yang dikendalikan GSAP langsung terhadap properti transform/opacity.
**Dampak:** Konsistensi visual terjaga otomatis; kurva belajar utility-class sudah diasumsikan dikuasai tim.

### GSAP (GreenSock Animation Platform)

**Tujuan:** Mesin choreography untuk seluruh animasi Website Publik yang membutuhkan kontrol timeline presisi (bukan sekadar transisi sederhana).
**Masalah yang diselesaikan:** Reveal bertahap dengan stagger yang presisi, animasi angka yang menghitung naik dengan easing custom, scroll-linked storytelling (ScrollTrigger) yang di-scrub langsung mengikuti posisi scroll pengguna — kebutuhan yang jauh melampaui kemampuan transisi CSS biasa.
**Kelebihan dibanding alternatif:** Dibanding Framer Motion, GSAP memberi kontrol timeline yang jauh lebih presisi untuk choreography multi-elemen kompleks (Bagian 6), khususnya lewat plugin ScrollTrigger yang tidak punya padanan setara di Framer Motion untuk kebutuhan *scrubbing* (animasi yang terikat langsung ke posisi scroll, bukan sekadar terpicu olehnya). **Keputusan eksplisit: Framer Motion TIDAK dipakai berdampingan dengan GSAP** — memakai dua mesin animasi sekaligus hanya menambah ukuran bundle tanpa manfaat tambahan, karena GSAP sendiri sudah menutupi seluruh kebutuhan animasi situs ini, termasuk kasus-kasus sederhana yang biasanya diserahkan ke Framer Motion.
**Area implementasi:** Seluruh animasi choreographed di Website Publik — hero reveal, kontras cerita, statistik, peta, transisi antar section.
**Dampak UX:** Timing dan easing yang presisi menciptakan kesan "disengaja" yang membedakan situs Awwwards-tier dari template generik.
**Batasan penting:** GSAP **hanya** diimpor di dalam route group `(public)`, tidak pernah di `(dashboard)` — ditegakkan lewat konvensi import dan review kode, bukan sekadar niat baik developer (lihat juga Bagian 4.3).

### Lenis

**Tujuan:** Smooth scroll yang menggantikan native scroll browser dengan scroll yang terasa lebih "berat"/premium dan dapat dikendalikan secara presisi.
**Masalah yang diselesaikan:** Native scroll browser tidak konsisten across device/browser dalam merespons ScrollTrigger GSAP; Lenis menormalkan posisi scroll agar animasi scroll-linked (Bagian 6) terasa presisi dan tidak patah-patah, khususnya saat scrubbing.
**Kelebihan dibanding alternatif:** Dibanding menulis smooth-scroll custom, Lenis ringan (tidak membawa dependency berat), dan sudah dirancang khusus untuk berintegrasi mulus dengan GSAP ScrollTrigger — kombinasi ini adalah standar de-facto situs Awwwards saat ini.
**Area implementasi:** Global di route group `(public)`, membungkus seluruh halaman Website Publik.
**Dampak UX:** Sensasi scroll yang lebih "premium"; dampak performa kecil karena Lenis hanya menormalkan event scroll, bukan menambahkan pekerjaan render berat.
**Batasan penting:** Sama seperti GSAP, hanya diimpor di `(public)`, tidak pernah di `(dashboard)`.

### SVG Animation

**Tujuan:** Elemen dekoratif (motif radar/deteksi), ikon garis, dan reveal berbasis path (garis grid yang "digambar" saat halaman dimuat) di Website Publik.
**Masalah yang diselesaikan:** Vektor yang scalable tanpa kehilangan ketajaman di layar resolusi tinggi, dan mendukung teknik reveal `stroke-dashoffset` yang menjadi salah satu tanda tangan visual situs (Bagian 6.1).
**Teknik:** Animasi path native (`stroke-dasharray`/`stroke-dashoffset` dikendalikan GSAP untuk presisi timing) dipakai alih-alih plugin DrawSVG berbayar — keputusan ini menghindari biaya lisensi tambahan (DrawSVG adalah plugin GSAP berbayar) sementara hasil visualnya identik untuk kebutuhan situs ini yang sebagian besar berupa garis lurus/kurva sederhana, bukan path kompleks yang benar-benar membutuhkan DrawSVG.
**Area implementasi:** Background grid Hero, ikon statistik, motif radar dekoratif.
**Dampak:** Kualitas visual tinggi tanpa biaya lisensi tambahan.

### SplitType

**Tujuan:** Memecah teks headline menjadi karakter/kata individual agar bisa di-stagger oleh GSAP.
**Masalah yang diselesaikan:** GSAP tidak bisa menganimasikan karakter individual dari sebuah string teks tanpa teks itu dipecah menjadi elemen DOM terpisah terlebih dahulu.
**Kelebihan dibanding alternatif:** Dibanding GSAP SplitText (plugin resmi tapi berbayar, bagian dari GSAP Club GreenSock), SplitType adalah library open-source ringan yang menghasilkan hasil pemecahan teks yang cukup untuk kebutuhan stagger reveal situs ini — keputusan ini menghindari biaya lisensi tanpa mengorbankan kualitas hasil akhir untuk use case sederhana (reveal headline), bukan use case kompleks (misalnya animasi teks yang mengikuti kurva).
**Area implementasi:** Headline Hero, pull-quote editorial, judul section.
**Dampak UX:** Reveal teks karakter-demi-karakter memberi kesan "typeset sedang disusun" — memperkuat metafora editorial.
**Batasan penting:** Sama seperti GSAP dan Lenis, hanya diimpor di `(public)`.

### Radix UI Primitives

**Tujuan:** Komponen dasar yang butuh perilaku aksesibilitas kompleks (dialog/modal donasi, dropdown navigasi mobile) — headless (tanpa styling bawaan), di-styling penuh dengan Tailwind sesuai design token situs.
**Masalah yang diselesaikan:** Focus trap, ARIA attributes yang benar, keyboard navigation, dan penanganan escape/overlay-click — semua ini sulit dan mudah salah jika dibangun dari nol, sementara Radix sudah menyelesaikannya secara battle-tested.
**Kelebihan dibanding alternatif:** Dibanding membangun modal/dropdown dari nol, atau memakai library UI bergaya (seperti Material UI) yang membawa opini visual sendiri yang harus di-override habis-habisan, Radix murni headless — cocok dengan filosofi desain sangat spesifik (Swiss+Brutalist) situs ini yang tidak ingin diwarisi gaya visual generik apa pun.
**Area implementasi:** Modal donasi, dropdown navigasi mobile, tooltip pada Peta Transparansi.
**Dampak:** Aksesibilitas yang benar tanpa mengorbankan kontrol visual penuh.

### react-hook-form + Zod

**Tujuan:** Manajemen state form (donasi, kontak instansi) dan validasi skema.
**Masalah yang diselesaikan:** Form dengan banyak field rentan re-render berlebihan jika dikelola lewat `useState` manual; react-hook-form memakai pendekatan uncontrolled input yang jauh lebih ringan performanya. Zod memberi satu skema validasi yang dipakai bersama di client (validasi instan) dan server (validasi ulang wajib demi keamanan, Bagian 15).
**Kelebihan dibanding alternatif:** Dibanding Formik (lebih berat, re-render lebih agresif) atau validasi manual (rawan drift antara aturan client dan server), kombinasi ini adalah standar industri saat ini dengan overhead bundle kecil.
**Area implementasi:** Form donasi, form kontak/kerja sama instansi.
**Dampak UX:** Validasi instan dengan pesan error yang jelas; dampak performa minimal karena uncontrolled input.

### Lucide Icons

**Tujuan:** Sistem ikon garis konsisten di seluruh aplikasi.
**Masalah yang diselesaikan:** Mencegah campur-aduk gaya ikon (sebagian filled, sebagian outline, dari sumber berbeda) yang merusak kesan disiplin editorial (Publik) maupun kejelasan fungsional (Dashboard).
**Kelebihan dibanding alternatif:** Tree-shakeable (hanya ikon yang dipakai masuk ke bundle), gaya garis konsisten — di Website Publik cocok dengan estetika Swiss-brutalist (bukan ikon 3D/gradient ala aplikasi konsumer), di Dashboard ikon yang sama dipakai dalam konteks garis fungsional yang lebih netral.
**Area implementasi:** Ikon pendamping statistik, navigasi, form (Publik); ikon status dan aksi (Dashboard).
**Dampak:** Konsistensi visual, bundle kecil.

## 4.2 Teknologi Tambahan — Khusus Dashboard Operator

**@dnd-kit** — **Tujuan:** drag-and-drop untuk Kanban board pelacakan kasus. **Masalah yang diselesaikan:** memindahkan kasus antar status (Baru → Diverifikasi → Dirujuk → Selesai) secara visual dan intuitif. **Kelebihan dibanding alternatif:** dibanding react-beautiful-dnd (sudah tidak aktif dikembangkan), @dnd-kit aktif dimaintain dan mendukung drag-drop lewat keyboard (aksesibilitas) — penting karena operator kelurahan mungkin memakai perangkat dengan kemampuan input beragam. **Area implementasi:** Kanban board kasus. **Dampak:** interaksi pelacakan kasus terasa cepat dan langsung, mengurangi kebutuhan berpindah halaman untuk update status.

**TanStack Table** — **Tujuan:** tabel daftar kasus dengan filter (kategori, status, RW, tanggal) dan sorting. **Masalah yang diselesaikan:** operator perlu menyaring puluhan kasus dengan cepat. **Kelebihan dibanding alternatif:** headless (tanpa opini visual, cocok distyling penuh sesuai token Dashboard sendiri), performan untuk dataset menengah tanpa perlu virtualisasi kompleks di skala satu kelurahan. **Area implementasi:** Daftar Kasus. **Dampak:** operator menemukan kasus relevan dalam hitungan detik, bukan scroll manual.

**Supabase Realtime** (sudah termasuk paket Supabase, bukan biaya tambahan) — **Tujuan:** notifikasi langsung saat kasus baru masuk dari WhatsApp Bot atau status berubah. **Masalah yang diselesaikan:** operator tidak perlu me-refresh halaman untuk tahu ada laporan baru. **Area implementasi:** Ringkasan, Daftar Kasus, Kanban. **Dampak:** kesan "hidup" pada alat kerja tanpa perlu polling manual yang boros resource.

**next-pwa / Serwist** — **Tujuan:** menghasilkan service worker untuk kemampuan PWA (Bagian 3.6). **Area implementasi:** hanya `(dashboard)`. **Dampak:** Dashboard bisa diinstal ke layar utama HP kader/operator, tetap berfungsi terbatas offline.

## 4.3 Teknologi yang Secara Sengaja Tidak Dipakai

Bagian ini sama pentingnya dengan daftar di atas — mendokumentasikan apa yang **tidak** dipakai mencegah developer di masa depan menambahkannya "karena populer" tanpa memahami bahwa itu sudah dipertimbangkan dan ditolak dengan alasan:

- **Framer Motion** — redundan dengan GSAP (Bagian 4.1), tidak dipakai berdampingan.
- **Three.js/WebGL** — situs ini membicarakan anak-anak dalam kondisi rentan; visual 3D/shader yang mencolok berisiko terasa tidak pantas secara tonal (mengalihkan perhatian dari subjek ke "kecanggihan teknis" semata), dan menambah beban performa signifikan di perangkat lawas yang mungkin dipakai dinas/kelurahan untuk mengakses situs ini. Storytelling yang dibutuhkan situs ini sepenuhnya bisa dicapai lewat SVG dan GSAP tanpa WebGL.
- **Redux/Zustand/state management global** — kompleksitas state Website Publik rendah (form lokal, toggle menu, state peta) dan cukup ditangani React state lokal/Context. Menambah state management global untuk kebutuhan sesederhana ini adalah over-engineering.
- **GraphQL** — bentuk data yang dikonsumsi (statistik agregat, konten) sudah diketahui dan stabil bentuknya; REST/Route Handler sederhana cukup, dan menghindari kompleksitas skema/resolver yang tidak sepadan manfaatnya untuk tim kecil yang akan serah-terima project ini.
- **Elasticsearch/Algolia** — jumlah konten situs ini kecil (belasan halaman/laporan, puluhan kasus); pencarian sungguhan adalah solusi untuk masalah yang tidak dimiliki sistem ini — filter tabel biasa (TanStack Table di Dashboard) sudah cukup.
- **GSAP/Lenis/SplitType di Dashboard** — motion Dashboard cukup CSS transition sederhana (Bagian 5); mengimpor mesin animasi choreography untuk antarmuka yang justru butuh terasa "diam dan cepat" adalah kontradiksi filosofis terhadap prinsip *speed over spectacle* (Bagian 1.4).
- **Python/FastAPI sebagai microservice terpisah untuk mesin skor risiko** — opsi ini sempat dipertimbangkan pada tahap awal perancangan Dashboard, mengingat logika yang dibawa (skor risiko, klasifikasi penyebab kasus) sempat terkesan berpotensi cukup kompleks untuk membenarkan ekosistem terpisah. Namun setelah kebutuhan riilnya dianalisis secara menyeluruh (Bagian 13), keputusan finalnya adalah **TIDAK** — mesin skor risiko tetap rule-based (bobot indikator sederhana, Bagian 17.6) yang cukup diimplementasikan sebagai fungsi TypeScript biasa di dalam Route Handler yang sama (lihat `lib/risk-engine/`, Bagian 9.1). Menjalankan bahasa/runtime kedua (Python) untuk logika sesederhana ini menambah kompleksitas operasional (dua environment, dua proses deploy, tim KKN penerus yang harus paham dua ekosistem sekaligus) yang tidak sepadan untuk skala pilot satu kelurahan. Keputusan ini terbuka untuk ditinjau ulang **hanya jika** mesin skor risiko berkembang menjadi model machine learning sungguhan yang benar-benar butuh ekosistem Python (Bagian 12 tidak menutup kemungkinan ini, tapi itu bukan kondisi saat ini).

---

# 5. Animation Strategy

## 5.1 Motion Hierarchy — Berlaku Berbeda per Route Group

Prinsip paling penting dalam dokumen ini: **tidak semua elemen berhak mendapat animasi yang sama beratnya.** Tanpa hierarki ini, situs akan terasa "hidup semua sekaligus" — melelahkan mata dan kehilangan fokus naratif. Namun hierarki ini berlaku **berbeda** untuk tiap route group.

**Website Publik memakai tiga tingkat penuh:**

- **Tier 1 — Signature Moments.** Choreography paling elaboratif, dipakai sangat terbatas: entrance Hero, reveal kontras "klaim vs temuan", dan reveal statistik dampak program. Ini adalah momen yang harus diingat pengunjung.
- **Tier 2 — Narrative Reinforcement.** Animasi scroll-triggered yang mendukung alur cerita (Cara Kerja Sistem, Peta Transparansi) — cukup terasa disengaja, tapi tidak berebut perhatian dengan Tier 1.
- **Tier 3 — Ambient/Micro-interaction.** Hover state, feedback klik, parallax halus. Nyaris tidak disadari secara sadar oleh pengguna, tapi terasa jika dihilangkan (interface terasa "mati").

Aturan tegas: **section yang berfungsi membangun kepercayaan finansial (Donasi Pendidikan) sengaja dijaga bermuatan motion rendah** — donatur yang diminta memberi uang untuk anak rentan tidak boleh merasa sedang "dijual" lewat animasi flashy; ketenangan visual di sini justru memperkuat kepercayaan.

**Dashboard Operator hanya memakai Tier 3.** Tidak ada Tier 1 atau Tier 2 di Dashboard — tidak ada entrance choreography, tidak ada scroll-linked reveal. Satu-satunya motion yang diizinkan: transisi state singkat (toast notifikasi kasus baru, kartu Kanban terangkat sedikit saat di-drag, highlight singkat saat status berubah) — semua di bawah 150ms, murni `opacity`/`transform`, tanpa easing dramatis.

**Alasan pemisahan tegas ini bukan sekadar preferensi gaya:** operator membuka Dashboard berkali-kali sehari selama berbulan-bulan. Animasi yang terasa "premium" pada kunjungan pertama menjadi gesekan yang mengganggu pada kunjungan ke-100 — hukum motion hierarchy di sini bukan cuma soal estetika dalam satu halaman, tapi soal frekuensi pemakaian jangka panjang.

## 5.2 Kebijakan Reduced Motion

`prefers-reduced-motion` dicek satu kali di root aplikasi, berlaku di kedua route group (meski dampaknya jauh lebih kecil di Dashboard karena motion budget-nya memang sudah minimal secara desain). Ketika aktif: seluruh parallax, cursor-follow, dan ambient loop dinonaktifkan sepenuhnya (bukan diperlambat — dihilangkan). Animasi esensial yang menyampaikan perubahan state (misalnya pesan error form muncul) tetap ada tapi disederhanakan menjadi cut instan tanpa transisi. Keputusan ini bukan sekadar kepatuhan aksesibilitas administratif — mengingat subjek situs adalah kerentanan anak, situs ini harus dapat diakses dengan nyaman oleh siapa pun tanpa terkecuali.

---

# 6. Motion Design System — Uraian Naratif per Section

## 6.1 Hero Section (Website Publik)

**Background grid.** Garis-garis grid Swiss digambar sendiri saat halaman dimuat lewat reveal `stroke-dashoffset` (durasi singkat, ~0.6 detik). Tujuannya membangun kesan "ini ruang yang dirancang dengan sengaja" dalam sepersekian detik pertama, sebelum konten lain muncul — anticipation beat yang menyiapkan mata pengguna untuk apa yang akan datang.

**Headline.** Dipecah per karakter dengan SplitType, muncul dengan stagger dan mask reveal bertepi tajam (clip-path swipe, bukan fade lembut — ini titik pertama brutalism muncul sebagai aksen). Easing `expo.out` memberi kesan mendarat percaya diri, bukan melayang ragu. Choreography: grid selesai (t=0.6s) → headline mulai muncul (t=0.6s, overlap sedikit untuk continuity) → selesai sekitar t=1.4s tergantung panjang teks.

**Subheadline.** Menyusul headline dengan overlap 0.3 detik, animasi tunggal (bukan per-karakter) karena hierarkinya di bawah headline — motion budget yang lebih rendah untuk elemen sekunder.

**CTA ("Lihat Dampak Program").** Muncul terakhir dalam urutan (t≈0.9s). State hover memakai pola brutalist klasik: bayangan offset yang "menyingkap" saat kursor mendekat, bukan sekadar highlight warna. Ini memberi feedback fisik yang jelas — penting karena sebagian pengunjung (pejabat dinas, orang tua calon donatur) mungkin bukan pengguna web yang sangat terbiasa.

**Motif dekoratif radar.** Sapuan garis melingkar berulang lambat (20 detik per putaran), dijalankan lewat CSS keyframes native — bukan GSAP — karena ini animasi ambient tanpa akhir yang tidak butuh kontrol timeline presisi; membebankannya ke compositor thread lewat CSS jauh lebih murah daripada menjalankannya lewat JavaScript RAF loop GSAP. Motif ini secara halus merujuk nama "RADAR" — deteksi yang terus berjalan.

**Scroll indicator.** Elemen kecil di bagian bawah, animasi bounce halus lewat CSS, memudar begitu IntersectionObserver mendeteksi pengguna sudah mulai scroll — sederhana, tidak butuh ScrollTrigger untuk sesuatu sesepele ini.

**Cursor interaction (desktop only).** Aksen kursor kecil (motif crosshair, merujuk tema deteksi) yang "tertarik" halus ke elemen interaktif memakai `quickTo` GSAP — teknik ini dipilih spesifik karena `quickTo` menghindari pembuatan tween baru di setiap event mousemove, krusial untuk menjaga performa tetap mulus saat kursor bergerak cepat.

**Transisi ke section berikutnya.** Hero tidak "berhenti" begitu saja — saat pengguna mulai scroll, ScrollTrigger dengan `pin` dan `scrub` membuat grid background Hero menyusut dan bertransformasi menjadi grid latar section berikutnya, sementara headline memudar dan naik keluar frame. Teknik `scrub` (bukan animasi otomatis) dipilih agar transisi terasa benar-benar terikat pada gerakan scroll pengguna sendiri — inilah signature move yang membedakan situs Awwwards-tier dari situs dengan animasi "putar otomatis begitu terlihat".

## 6.2 Section Kontras Cerita ("Klaim vs Temuan")

Ini jantung naratif situs, dan choreography-nya paling tegas mengekspresikan brutalism sebagai aksen kebenaran.

Layout dua panel: kiri "Klaim awal kelurahan: Tidak ada" — muncul lebih dulu dengan fade lembut bernada warna redup/desaturasi (mewakili asumsi yang keliru). Ada jeda sengaja (~0.4 detik, anticipation gap) sebelum panel kanan "Temuan lapangan: 7 anak" muncul dengan **potongan tajam instan** (clip-path reveal, bukan fade) disertai pergeseran ke warna aksen — kontras kecepatan dan gaya reveal antara kedua panel inilah yang secara visual *menyampaikan* kontras faktual yang sedang diceritakan, bukan sekadar mengiringinya.

Angka per RW (03=1, 04=0, 05=1, 06=0, 07=5) muncul sebagai penghitung individual yang menghitung naik dari nol, stagger dari kiri ke kanan, dengan delay yang sedikit meningkat untuk entri berangka lebih tinggi — menciptakan ritme visual yang memuncak tepat di RW 07, sinkron dengan fakta bahwa RW 07 memang titik konsentrasi tertinggi. Bar mini di bawah tiap angka tumbuh dengan durasi dan easing yang identik dengan tween angka di atasnya, sehingga keduanya "mendarat" di titik akhir secara bersamaan — presisi choreography semacam ini adalah yang membedakan hasil profesional dari template animasi generik.

Trigger: sekali saja saat section masuk viewport (ambang ~30%), tidak diulang saat pengguna scroll naik-turun — menghormati bahwa pengunjung yang kembali men-scroll tidak perlu disuguhi ulang "reveal kejutan" yang sama.

## 6.3 Section Dampak Program (Statistik: dicegah, ditangani, dst.)

Angka besar bergaya editorial menghitung naik dari 0 ke nilai akhir saat masuk viewport, memakai tweening numerik GSAP (bukan library counter terpisah — GSAP sendiri sudah mampu melakukan ini dengan presisi easing yang sama dengan animasi lain di situs, sehingga tidak perlu dependency tambahan). Easing memakai kurva yang melambat mendekati akhir (bukan linear) — detail ini penting karena counter linear terasa murah dan robotik, sementara deselerasi meniru cara manusia menghitung sungguhan.

Tiap kartu statistik diberi stagger 100ms — mata membaca fakta secara berurutan, bukan dibanjiri data sekaligus. Ikon pendamping tiap kartu "menggambar diri" (stroke reveal) sesaat sebelum angka mulai menghitung — dua langkah choreography per kartu: ikon tiba, lalu angka bergerak.

**Penting:** angka-angka ini bukan hardcode — mereka datang dari API agregat (Bagian 14). Animasi hitung-naik baru dipicu setelah data resolve; sebelum itu, kartu menampilkan skeleton bergaya blok solid (bukan shimmer gradient lembut, demi konsistensi dengan bahasa visual brutalist) berukuran identik dengan kartu final — mencegah pergeseran layout saat data tiba.

## 6.4 Section Peta Transparansi

Peta dasar memudar masuk lebih dulu (memberi konteks geografis), baru kemudian overlay data/heatmap muncul 0.3 detik kemudian — urutan ini disengaja agar pengguna berorientasi ke tempat dulu sebelum disodori data, menghindari beban kognitif dua elemen kompleks muncul bersamaan.

Marker tiap RW berdenyut halus sekali saat termuat (radiating ring, dihormati `prefers-reduced-motion`) untuk menarik perhatian ke keberadaannya, lalu diam. Hover/klik pada marker memunculkan kartu popup gaya editorial dengan border tegas — memakai teknik snap-reveal yang sama seperti section Kontras Cerita, bukan fade baru yang berbeda gaya. Konsistensi teknik ini penting: pengulangan bahasa visual yang sama untuk fungsi yang serupa ("mengungkap fakta") membangun sistem desain yang koheren, bukan koleksi efek acak per section.

## 6.5 Section Galeri Karya

Satu-satunya section yang secara sengaja diberi kehangatan berbeda dari nada brutalist situs secara umum — karena kontennya adalah karya kreatif anak-anak, bukan data kasus. Kartu karya muncul stagger per baris grid, dengan micro-tilt 2-3 derajat saat masuk yang kemudian mereda ke 0 derajat — sentuhan organik ini kontras sengaja dengan ketegasan garis lurus di section lain, menandakan pengunjung bahwa "di sini kita sedang melihat sesuatu yang dibuat tangan anak, bukan statistik". Hover hanya mengangkat kartu sedikit (translateY -4px, shadow menebal) — sesuai Tier 3, tidak butuh choreography rumit.

## 6.6 Section Donasi Pendidikan

Dijaga tenang secara sengaja (Bagian 5.1) — satu animasi entrance percaya diri saat section masuk viewport, tanpa gimmick lanjutan. Kepercayaan finansial dibangun lewat kejelasan dan ketenangan, bukan kejutan visual.

## 6.7 Footer, Kerja Sama Instansi, Laporan Publik

Motion minimal (fade-up sederhana saat scroll), sengaja diposisikan di Tier 3/tanpa animasi khusus — bagian ini adalah referensi, bukan momen naratif.

## 6.8 Dashboard Operator

**Notifikasi kasus baru.** Toast kecil slide-in dari sudut layar (150ms), auto-dismiss setelah beberapa detik atau saat diklik — memberi tahu operator ada laporan baru dari WhatsApp Bot tanpa mengganggu pekerjaan yang sedang berlangsung.

**Drag Kanban.** Kartu kasus terangkat sedikit (shadow tipis muncul) saat mulai di-drag, kembali datar instan saat dilepas di kolom baru — feedback fisik minimal, bukan pertunjukan.

**Loading state.** Skeleton blok solid (bukan shimmer gradient) saat data kasus sedang dimuat — konsisten secara teknik dengan skeleton Website Publik (Bagian 6.3), tapi alasannya berbeda di sini: bukan soal estetika brutalist, melainkan supaya terasa cepat dan tegas, tidak menghias proses tunggu yang seharusnya sesingkat mungkin.

**Perubahan status.** Badge status berubah warna dengan transisi warna singkat (150ms), tanpa animasi tambahan — perubahan status kasus adalah momen serius (kadang menyangkut nasib anak), bukan momen yang perlu dirayakan visual.

---

# 7. UX Principles

## 7.1 Website Publik

**Visual Hierarchy** — angka dampak program (oversized, serif editorial) sengaja dibuat elemen paling berat secara visual di halaman, karena angka itulah bukti nyata program ini bekerja; bobot visual harus sejalan dengan bobot naratif.

**Reading Flow** — grid Swiss menjaga arah baca kiri-ke-kanan, atas-ke-bawah konsisten, memastikan urutan "klaim keliru → temuan sebenarnya" terbaca sesuai urutan yang dimaksud, bukan sekadar dipindai acak.

**Editorial Composition** — margin lega, kolom asimetris (bukan semua-center seperti template landing page generik), pull-quote bergaya majalah untuk kutipan kelurahan/testimoni — semua ini membangun kesan laporan institusional yang serius.

**White Space** — mengingat subjek adalah anak-anak dalam kondisi rentan, ruang kosong yang cukup mencegah situs terasa eksploitatif atau padat sensasional; ruang kosong di sini adalah bentuk penghormatan terhadap martabat subjek yang dibicarakan.

**Progressive Disclosure** — beranda menyajikan headline statistik dan narasi inti; detail metodologi lengkap, RAB, dan proses penanganan kasus tersedia di halaman "Tentang Program" dan Laporan Publik yang dapat diunduh — pengunjung sekali lewat tidak dibanjiri detail, sementara pengunjung yang melakukan due-diligence (donatur besar, dinas) tetap punya akses ke kedalaman penuh.

**Motion Hierarchy** — dijelaskan penuh di Bagian 5.1.

**Interaction Feedback** — setiap elemen yang bisa diklik memberi respons taktil segera (pergeseran bayangan brutalist saat ditekan, bukan sekadar hover warna) — penting karena sebagian pengunjung target (pejabat dinas yang lebih senior) mungkin kurang terbiasa dengan interface web modern dan butuh kepastian eksplisit bahwa klik mereka terdaftar.

**Accessibility** — bukan formalitas kepatuhan, melainkan keselarasan etis dengan misi: situs yang bicara soal inklusi pendidikan anak wajib inklusif secara aksesibilitas. HTML semantik, ARIA lewat Radix, kontras warna AA minimum diuji eksplisit meski palet brutalist cenderung berani, navigasi keyboard penuh khususnya di form donasi/kontak.

**Reduced Motion Support** — dijelaskan penuh di Bagian 5.2.

## 7.2 Dashboard Operator — Prinsip Tambahan

**Information Density.** Operator perlu melihat banyak kasus dalam satu pandangan, bukan satu per scroll — kepadatan di sini adalah kebajikan, kebalikan dari prinsip White Space di Website Publik.

**Error Prevention (bukan sekadar Feedback).** Perubahan status ke "Selesai" memerlukan konfirmasi eksplisit dan bukti terlampir (sesuai mekanisme maker-checker, Bagian 15.10) — UI secara aktif mencegah kesalahan yang berkonsekuensi nyata, bukan hanya memberi tahu setelah terjadi.

**Glanceability.** Status kasus harus terbaca sekilas lewat warna badge tanpa perlu membuka detail — penting karena operator sering melakukan triase cepat sebelum memutuskan kasus mana yang ditangani lebih dulu.

**Offline Resilience.** Operator tetap bisa melihat (meski tidak selalu mengubah) data kasus terakhir saat sinyal internet hilang (Bagian 3.6) — kegagalan koneksi tidak boleh berarti kehilangan akses total ke informasi kritis.

## 7.3 WhatsApp Bot — Prinsip Percakapan

**Percakapan Bertahap, Bukan Formulir.** Alih-alih formulir panjang yang membingungkan, bot bertanya satu per satu, seperti percakapan biasa — pelapor tidak pernah dihadapkan dengan banyak field sekaligus, karena audiens utamanya (RT/RW dan warga) belum tentu terbiasa mengisi formulir digital, tapi hampir pasti terbiasa membalas chat.

**Transparansi Tindak Lanjut.** Pelapor bisa memeriksa status laporannya kapan saja (Bagian 17.5) — prinsip ini menjawab kekhawatiran paling umum pelapor awam: "apakah laporan saya benar-benar diproses, atau menghilang begitu saja?"

---

# 8. Performance Strategy

## 8.1 Website Publik

**Lazy Loading** — section di bawah lipatan pertama (Galeri Karya, Peta Transparansi) dimuat lewat `next/dynamic`; peta secara khusus di-load dengan `ssr:false` karena library peta umumnya tidak kompatibel server-side rendering, dan hanya di-fetch saat section itu mendekati viewport (IntersectionObserver-triggered dynamic import) — bukan sekadar lazy saat route dimuat.

**Code Splitting** — otomatis lewat routing Next.js, ditambah pemisahan manual untuk plugin GSAP berat (ScrollTrigger dimuat hanya di komponen yang benar-benar membutuhkannya).

**Dynamic Import** — dipakai eksplisit untuk peta dan komponen admin konten yang tidak boleh masuk bundle publik.

**Image Optimization** — `next/image` menangani responsive srcset dan negosiasi format WebP/AVIF otomatis, krusial untuk Galeri Karya yang berisi banyak gambar.

**SVG Optimization** — pipeline SVGO di proses build memangkas metadata berlebih dari SVG dekoratif; SVG kecil (ikon, motif hero) di-inline langsung sebagai komponen React lewat SVGR untuk menghindari request jaringan tambahan pada elemen above-the-fold.

**Font Loading** — `next/font` dengan subset karakter terbatas (Latin + diakritik Indonesia saja, bukan seluruh rentang Unicode), `font-display: swap`, hanya weight yang benar-benar dipakai di atas lipatan yang di-preload.

**GPU Acceleration** — seluruh animasi GSAP/CSS dibatasi memanipulasi `transform` dan `opacity` saja (tidak pernah `top`/`left`/`width`/`height` langsung), agar tetap berjalan di compositor thread. `will-change` dipakai sesaat selama animasi aktif saja, dilepas setelahnya untuk menghindari pemborosan memori dari layer promotion permanen.

**Avoid Layout Shift** — kontainer gambar/peta diberi `aspect-ratio` eksplisit sebelum konten dimuat; skeleton statistik berukuran identik dengan kartu final (Bagian 6.3) mencegah CLS saat data async tiba.

**Animation Performance** — ScrollTrigger dengan ambang `once` dan viewport threshold memastikan elemen di luar layar tidak ikut dianimasikan; animasi ambient tak berujung (motif radar) sengaja didorong ke CSS native, bukan RAF loop JavaScript.

**Bundle Optimization** — GSAP diimpor secara tree-shaken (hanya plugin yang dipakai, bukan bundle penuh); bundle dianalisis rutin lewat `@next/bundle-analyzer`; target eksplisit: JavaScript kritikal jalur atas-lipatan dijaga di bawah ambang yang disepakati tim agar loading awal tetap cepat di koneksi lambat.

## 8.2 Dashboard Operator — Strategi Tambahan

**Caching offline-first.** Service worker (Bagian 3.6, 4.2) memakai strategi *cache-first* untuk shell aplikasi (agar Dashboard tetap bisa dibuka meski offline) dan *stale-while-revalidate* untuk data kasus (tampilkan data cache terakhir segera, sinkron ulang begitu koneksi kembali).

**Prioritas bundle berbeda dari Website Publik.** Karena Dashboard dipakai berulang oleh pengguna yang sama (bukan pengunjung sekali lewat), *ukuran bundle awal* kurang kritis dibanding *keandalan setelah dimuat pertama kali* — service worker meng-cache aset agresif setelah kunjungan pertama sehingga kunjungan berikutnya nyaris instan meski di koneksi lemah.

---

# 9. Developer Convention

## 9.1 Struktur Folder

```
app/
  (public)/
  (dashboard)/
  api/
components/
  public/                 → primitif khusus Website Publik (Button brutalist, StatCounter, dst.)
  dashboard/              → primitif khusus Dashboard (Button fungsional, KanbanBoard, StatusBadge, dst.)
  shared/                 → benar-benar generik lintas keduanya (mis. primitif Toast paling dasar sebelum di-styling ulang per route group)
lib/
  motion/                 → HANYA dipakai oleh components/public — config easing/duration, timeline factory
  api/                    → client fetching data agregat
  validation/             → skema Zod
  risk-engine/            → fungsi TypeScript skor risiko & klasifikasi penyebab, rule-based (Bagian 17.6), dipanggil dari Route Handler
hooks/                    → custom hook reusable lintas fitur
public/                   → aset statis, SVG mentah
styles/                   → konfigurasi Tailwind, design token
```

**Aturan tegas:** `components/public` tidak pernah mengimpor dari `components/dashboard` dan sebaliknya — hanya `components/shared` yang boleh diimpor keduanya. Ini bukan sekadar konvensi rapi; ini adalah penegakan langsung dari prinsip pemisahan filosofi desain (Bagian 1.2).

## 9.2 Penamaan

- **Component:** PascalCase, satu komponen per file, nama file = nama komponen.
- **Animation/timeline function (khusus `components/public`):** pola `verb + Target`, contoh `revealHeroHeadline()`, `pulseStatCounter()`.
- **Hook:** prefix `use-`, dipromosikan ke `/hooks` global begitu dipakai ≥2 fitur berbeda; sebelum itu tetap kolokasi dengan fitur terkait.

## 9.3 Reusable Component & Timeline

Primitif desain sistem Website Publik (Button, Card, StatCounter, SectionHeading) dibangun satu kali di `components/public`, dipakai ulang di seluruh section — tidak ada tombol/kartu ad hoc per section. Pola motion yang berulang (fade-up + stagger dipakai banyak section) diabstraksi jadi hook seperti `useScrollReveal(ref, options)`, `useSplitTextReveal(ref)`, `useCounter(ref, targetValue)` — mencegah duplikasi logika GSAP yang sama ditulis ulang di banyak file. Primitif Dashboard (Button fungsional, Card, Table) dibangun terpisah di `components/dashboard` dengan prinsip yang sama: dibangun sekali, dipakai ulang, tidak ada styling ad hoc per pemakaian.

## 9.4 Utility Function & Motion Helper

`lib/utils.ts` menampung helper umum (penggabung className `cn()`, formatter angka/tanggal) yang dipakai lintas kedua route group. `lib/motion/config.ts` menjadi satu sumber kebenaran untuk kurva easing dan token durasi Website Publik — tidak ada easing string GSAP yang di-hardcode langsung di komponen; semua merujuk token dari file ini (Bagian 10). Token motion ini **hanya relevan untuk `components/public`**; Dashboard tidak butuh file token motion terpisah karena motion budget-nya sudah minimal dan cukup didefinisikan sebagai kelas Tailwind transisi standar.

## 9.5 Design Token & CSS Variable

Token diekstensikan lewat konfigurasi Tailwind, sekaligus diekspos sebagai CSS custom property agar fleksibel untuk kebutuhan runtime di masa depan (misalnya jika suatu saat dibutuhkan mode tema alternatif). Skala spacing dasar dan nilai HSL warna netral dibagi lintas kedua route group (didefinisikan sekali di konfigurasi Tailwind root), sementara warna aksen (Website Publik) dan warna status (Dashboard) di-override secara terpisah lewat CSS variable scoping per route group.

## 9.6 Strategi Responsif & Filosofi Breakpoint

Pendekatan mobile-first, namun breakpoint ditentukan **berdasarkan titik di mana desain benar-benar "patah" secara visual saat diuji**, bukan sekadar mengikuti standar sm/md/lg secara membabi-buta — penting khusus untuk elemen editorial (angka oversized, grid asimetris) yang tidak selalu patah di lebar layar standar. Tipografi besar menggunakan `clamp()` fluida agar tidak melompat kaku antar breakpoint.

---

# 10. Design Consistency

| Aspek | Website Publik | Dashboard Operator |
|---|---|---|
| Typography | Serif editorial + grotesk sans, skala fluida `clamp()`, line-height mengikuti baseline grid | Grotesk sans saja, skala fungsional standar |
| Grid | 12 kolom editorial, gutter konsisten, asimetri terkontrol (tetap snap ke grid — bukan chaos bebas) | Grid data padat |
| Color | Latar netral + satu warna aksen yang direservasi untuk momen kebenaran/urgensi, dipakai hemat agar tidak kehilangan daya kejut | Netral + palet status fungsional (merah/kuning/hijau) |
| Border | Tebal solid brutalist tanpa blur, satu token lebar border dipakai konsisten di seluruh kartu/tombol | Tipis, netral |
| Radius | Nyaris nol di seluruh situs, **kecuali** Galeri Karya (radius kecil, disengaja untuk kehangatan — pengecualian ini didokumentasikan agar tidak "diperbaiki" keliru oleh developer baru) | Kecil konsisten di semua elemen |
| Shadow | Bayangan offset keras (`4px 4px 0`, tanpa blur radius), bukan drop-shadow lembut | Lembut minimal, hanya untuk elevasi modal |
| Motion Duration | Token skala: `fast` 150ms (micro-interaction), `base` 400ms (reveal standar), `slow` 800ms (signature moment Hero/Kontras Cerita) | Hanya `fast` 150ms |
| Motion Easing | Token bernama: `confident` (expo.out, untuk entrance), `snap` (power4.out, untuk reveal brutalist tegas), `gentle` (sine.inOut, untuk loop ambient) | Easing default Tailwind, tidak ada token custom |
| Layer (z-index) | Skala token terdefinisi, tidak ada angka z-index acak tersebar di kode | Sama, skala token bersama |
| Icon Style | Lucide, stroke-width konsisten, garis dekoratif, tidak mencampur gaya filled/outline | Lucide, garis fungsional (ikon sama, konteks beda) |
| Illustration Style | Motif geometris abstrak bertema deteksi/radar, bukan ilustrasi literal/clip-art | — (tidak relevan, Dashboard tidak memakai ilustrasi dekoratif) |
| Interaction State | Hover/active/focus/disabled didefinisikan sekali sebagai token brutalist (shadow shift), diterapkan konsisten; state fokus tetap sangat terlihat meski palet warna terbatas | Hover netral (perubahan warna latar tipis) |

**Token yang dibagi lintas keduanya:** skala spacing dasar dan nilai HSL warna netral (agar tidak dua sistem angka spacing yang berbeda tanpa alasan) — didefinisikan sekali di konfigurasi Tailwind root, di-override warna aksen/status secara terpisah per route group lewat CSS variable scoping.

---

# 11. Component Behaviour

## 11.1 Website Publik

**StatCounter** — menerima nilai target, memicu hitung-naik sekali saat masuk viewport, langsung menampilkan nilai akhir tanpa animasi jika `prefers-reduced-motion` aktif.

**SectionReveal** (wrapper motion) — membungkus presentation component, tidak pernah membawa logika data fetching; menentukan Tier motion (1/2/3) lewat prop eksplisit sehingga developer baru langsung tahu tingkat choreography yang diharapkan tanpa menebak.

**Button** — state hover/active/focus/disabled mengikuti token interaksi terpusat (Bagian 10); tidak ada styling state ad hoc per pemakaian.

**Peta (Map)** — dimuat secara dinamis, menampilkan state loading bergaya blok solid, gagal-aman menampilkan pesan teks jika API peta tidak tersedia (tidak boleh membuat halaman blank/error).

**Form (Donasi/Kontak)** — validasi client instan lewat Zod resolver, validasi ulang wajib di server (Bagian 15), pesan error jelas dan dapat diakses lewat pembaca layar.

## 11.2 Dashboard Operator

**KanbanBoard** — menerima daftar kasus terkelompok per status, memakai @dnd-kit untuk drag-drop antar kolom; perpindahan ke kolom "Selesai" memicu modal konfirmasi wajib (tidak langsung berpindah), sesuai prinsip Error Prevention (Bagian 7.2).

**CaseCard** — menampilkan ringkasan kasus (inisial, RW, kategori, status); tidak pernah menampilkan data identitas penuh anak di tampilan ringkas (hanya di halaman Detail Kasus dengan akses dicatat di jejak audit).

**StatusBadge** — warna terikat token status (Bagian 10), tidak pernah dioverride ad hoc per pemakaian.

**RoleGate** — wrapper yang menyembunyikan/menonaktifkan elemen UI berdasarkan peran pengguna (operator/verifikator/RT-RW/admin konten); dipakai di level komponen, melengkapi (bukan menggantikan) middleware route-level di Bagian 3.5.

**RealtimeListener** — hook yang membungkus langganan Supabase Realtime, dipakai oleh Ringkasan/Daftar Kasus/Kanban; menangani reconnect otomatis saat koneksi terputus-sambung.

**OfflineIndicator** — indikator kecil dan jujur yang memberi tahu operator saat aplikasi sedang menampilkan data cache (offline), bukan data terkini — mencegah operator mengira data yang dilihat sudah paling baru padahal belum sinkron.

---

# 12. Future Scalability

**Ekspansi multi-kelurahan.** Karena Website Publik dan Dashboard kini satu sistem, ekspansi ke kelurahan lain menjadi lebih sederhana dari yang mungkin dibayangkan sebelumnya: bukan menduplikasi deployment untuk tiap kelurahan, cukup menambahkan kolom `kelurahan_id` di skema data sebagai penentu tenant, dengan filter diterapkan di level query — satu Dashboard, satu Website Publik, banyak tenant data. Di sisi Website Publik, ini diwujudkan lewat struktur route dinamis (`/kelurahan/[slug]`) yang datanya difilter berdasarkan `kelurahan_id` dan diberi makan dari section `konten/` di Dashboard yang sama — fondasi ini sudah harus dipikirkan sejak konvensi folder awal (Bagian 9.1), bukan ditambal belakangan.

**Kesiapan i18n.** Struktur konten sudah mengikuti pola key-based (bukan string hardcode di komponen) meski hanya Bahasa Indonesia yang diluncurkan pertama kali — memudahkan penambahan bahasa Inggris jika suatu saat dibutuhkan untuk audiens donatur/lembaga internasional.

**Ekstraksi design system.** Primitif UI Website Publik berpotensi diekstrak jadi package bersama jika Dashboard ingin mengadopsi sebagian token visual (meski filosofi keduanya sengaja berbeda) — token warna/spasi dasar bisa dibagi meski komponen tetap terpisah.

**Konten dikelola langsung di Dashboard.** Rancangan awal sempat memposisikan panel admin konten sebagai CMS mandiri yang berdiri sendiri (lihat pertimbangan lengkapnya di Bagian 15.8) — pertimbangan ini penting karena tim KKN berganti tiap semester, dan staf kelurahan yang mungkin ikut mengelola konten pasca-KKN tidak bisa diasumsikan bisa coding. Pada arsitektur final, konsep ini melebur sepenuhnya menjadi section `konten/` di dalam Dashboard yang sama (Bagian 3.2), dengan peran "admin konten" sebagai salah satu dari empat peran RBAC (Bagian 15.7) — bukan sistem ketiga yang perlu diserah-terimakan secara terpisah, cukup satu peran tambahan di sistem RBAC yang sudah ada.

---

# 13. Backend — Requirement Analysis

Tabel ini mencakup kebutuhan gabungan Website Publik **dan** Dashboard Operator, karena keduanya kini satu sistem dengan satu backend.

| Kebutuhan | Berlaku? | Alasan |
|---|---|---|
| Backend (server logic) | Ya, signifikan | Mencakup statistik agregat, form donasi/kontak, CMS/konten ringan, **dan** seluruh operasi kasus (CRUD, verifikasi, rujukan) |
| Static Generation | Ya, untuk halaman Publik non-agregat | Konten (Tentang Program, Filosofi, Kerja Sama Instansi) jarang berubah — SSG dengan revalidasi on-demand saat admin konten memperbarui |
| Server-Side Rendering | Minim | Sebagian besar cukup ISR (Publik) atau Realtime (Dashboard); SSR hanya untuk edge case seperti filter laporan berbasis query param |
| Edge Runtime | Ya | Endpoint statistik agregat publik cocok di Edge Function — read-only, cache-friendly, latency rendah secara global, tanpa API khusus Node |
| Real-time | **Ya** | Website Publik sendiri tidak membutuhkan real-time (cukup data yang direvalidasi berkala) — namun Dashboard butuh notifikasi kasus baru & perubahan status langsung, dipenuhi lewat Supabase Realtime tanpa perlu WebSocket server terpisah. Karena keduanya kini satu sistem, jawaban untuk sistem gabungan adalah Ya |
| Scheduled Jobs | Ya | Reminder kasus mangkrak (cron harian, dikirim lewat WhatsApp — Bagian 17.5), revalidasi cache statistik publik berkala (mis. tiap jam); (opsional fase 2) generate Laporan Publik PDF bulanan otomatis |
| Authentication | Ya, penuh | Operator, verifikator independen, RT/RW terbatas, admin konten — empat peran, bukan sekadar satu akun admin untuk mengelola konten |
| Authorization | Ya, RBAC berlapis | Empat peran dengan cakupan akses berbeda, ditegakkan di middleware route + RoleGate komponen (Bagian 3.5, 11.2) |
| Media Processing | Ya | Resize/kompresi upload Galeri Karya, penyimpanan Laporan Publik PDF, upload bukti rujukan kasus |
| Search | **Tidak** | Volume konten dan kasus kecil; filter tabel (TanStack Table) di Dashboard dan navigasi sederhana di Publik sudah cukup — pencarian sungguhan adalah solusi untuk masalah yang tidak dimiliki sistem ini |
| Analytics | Ya, privacy-first (Publik) + audit trail (Dashboard) | Publik: mengukur jangkauan ke donatur/pengunjung tanpa tracking invasif — pertimbangan etis mengingat subjek situs adalah anak-anak. Dashboard: jejak audit sudah berfungsi sebagai log aktivitas dengan sendirinya |
| Logging | Ya, ringan | Error tracking produksi standar di seluruh aplikasi |
| Caching | Ya, dua mode | ISR + edge cache untuk halaman statis dan cache tag-based untuk API agregat (Publik); Realtime — bukan cache — untuk data kasus (Dashboard) |

---

# 14. Backend Architecture

## 14.1 Keputusan Utama: Next.js Route Handlers untuk Semuanya

Berdasarkan analisis kebutuhan gabungan di atas (Bagian 13) — mencakup statistik agregat, form ringan, **dan** operasi kasus/webhook WhatsApp/mesin skor risiko — keputusan arsitekturnya adalah **Next.js Route Handlers** yang berjalan di infrastruktur yang sama dengan frontend (Vercel), bukan layanan backend terpisah (NestJS/Express/Fastify/FastAPI), **untuk seluruh kebutuhan sistem**, termasuk operasi kasus, webhook WhatsApp, dan mesin skor risiko.

Opsi menjalankan sebagian logika (khususnya mesin skor risiko Dashboard) sebagai microservice terpisah — misalnya FastAPI berbasis Python — sempat dipertimbangkan pada tahap awal perancangan, mengingat logika yang dibawa (skor risiko, klasifikasi kasus) sempat terkesan berpotensi cukup berat untuk membenarkan runtime kedua. Namun setelah kebutuhan itu dianalisis secara menyeluruh (Bagian 13), keputusannya tetap Route Handlers untuk semuanya.

**Alasan eksplisit:** Menjalankan dua layanan terdeploy terpisah (atau dua bahasa/runtime sekaligus) menambah kompleksitas operasional (dua pipeline deploy, dua tempat memantau error, dua konfigurasi environment, dua ekosistem yang harus dipahami tim) yang tidak sepadan dengan beban logika yang sebenarnya — rule-based scoring, CRUD kasus, dan RBAC middleware tidak cukup berat untuk membenarkan runtime kedua (Python). Route Handlers memberi kesederhanaan "backend hidup dalam repo yang sama" — krusial untuk tim KKN yang harus serah-terima project ke tim berikutnya tanpa dokumentasi arsitektur terpisah yang rumit untuk dipelajari, dan tidak sepadan untuk skala pilot satu kelurahan.

**Keputusan ini terbuka untuk ditinjau ulang di masa depan hanya jika** mesin skor risiko berkembang menjadi model machine learning sungguhan yang benar-benar butuh ekosistem Python (Bagian 12 ekspansi tidak menutup kemungkinan ini, tapi itu bukan kondisi saat ini).

## 14.2 Pembagian Runtime

- **Endpoint statistik agregat publik** → Edge Function (Vercel Edge Runtime): read-only, cache-friendly, latency rendah secara global.
- **Endpoint form donasi/kontak** → Node runtime: butuh mengirim notifikasi email/webhook yang memerlukan API Node-specific yang tidak tersedia penuh di Edge Runtime.
- **Endpoint CRUD kasus, verifikasi, RBAC** → Node runtime (butuh sesi/JWT dari Supabase Auth).
- **CMS/konten admin (autentikasi + CRUD konten)** → Node runtime.
- **Webhook WhatsApp** (`/api/webhook/whatsapp`) → Node runtime, karena butuh verifikasi signature Meta memakai Node crypto API yang tidak tersedia penuh di Edge Runtime.

---

# 15. Data Architecture

## 15.1 Database — Satu Sumber Data untuk Seluruh Sistem

Satu instans **Supabase Postgres** melayani Website Publik **dan** Dashboard Operator, karena keduanya kini satu sistem — bukan dua database yang disinkronkan lewat mekanisme tambahan. Skema utama mencakup: tabel kasus, tabel verifikasi/bukti, tabel jejak audit, tabel akun & peran, tabel konten (menggantikan CMS terpisah), tabel galeri karya.

Row Level Security Postgres tetap menjadi penegak batas privasi: publik hanya bisa membaca **view agregat** (tanpa identitas), operator/verifikator membaca tabel penuh sesuai peran masing-masing — batas privasi ditegakkan di lapisan database itu sendiri, bukan semata mengandalkan disiplin kode aplikasi (defense in depth). Batas ini menjadi makin penting karena kedua pengalaman benar-benar berbagi database fisik yang sama, bukan sekadar berbagi secara konseptual.

**Alasan satu database:** Database terpisah berarti perlu mekanisme sinkronisasi tambahan (ETL, webhook replikasi) yang menambah titik kegagalan dan potensi data basi. Satu sumber data dengan lapisan akses berbeda jauh lebih sederhana dan lebih aman untuk dipertahankan tim kecil.

## 15.2 Realtime

Supabase Realtime dipakai untuk subscribe perubahan pada tabel kasus, dikonsumsi oleh `RealtimeListener` (Bagian 11.2) di Dashboard. Website Publik tidak berlangganan Realtime sama sekali — ia tetap memakai ISR (Bagian 3.4) karena publik tidak butuh update per detik.

## 15.3 ORM

**Keputusan:** Tidak memakai Prisma, mencakup seluruh sistem. Untuk kueri Website Publik (baca view agregat, tulis form) yang sederhana dan bentuknya stabil, klien Supabase langsung dengan tipe TypeScript yang di-generate dari skema database sudah memberi type-safety yang cukup tanpa overhead sinkronisasi skema tambahan yang dibawa Prisma. Kueri kompleks di sisi Dashboard (join kasus-verifikasi-audit) ditangani lewat Postgres view dan RPC function yang dipanggil via klien Supabase bertipe — bukan lewat Prisma. Pendekatan ini menjaga satu paradigma akses data yang konsisten di seluruh aplikasi, menghindari dua pendekatan ORM berbeda antara bagian Publik dan bagian Dashboard yang kini sama-sama hidup dalam satu codebase.

## 15.4 Cache

ISR bawaan Next.js (revalidate tag-based) menjadi lapisan cache utama untuk halaman Publik. **Keputusan eksplisit: tidak menambahkan Redis** pada tahap ini — skala trafik proyek sosial KKN tidak membenarkan kompleksitas operasional tambahan. Ambang kapan Redis layak dipertimbangkan kembali: jika ekspansi multi-kelurahan (Bagian 12) benar-benar meningkatkan trafik secara signifikan.

## 15.5 Storage & Asset Management

Supabase Storage — dipilih untuk mengonsolidasikan vendor dengan yang sudah dipakai (Supabase), menghindari akun pihak ketiga tambahan (S3/Cloudinary) yang harus dikelola tim kecil. Bucket yang dipakai:

- `galeri-karya/` — foto karya anak di Website Publik.
- `laporan-publik/` — dokumen Laporan Publik PDF.
- `bukti-rujukan/` — foto/dokumen bukti penyelesaian kasus di Dashboard, akses dibatasi berdasarkan peran.

Optimasi gambar upload dilakukan saat unggah (resize/kompresi) agar thumbnail Galeri Karya konsisten ukurannya dan tidak membebani bandwidth.

## 15.6 Image Processing

Resize/kompresi otomatis saat upload lewat fungsi transform Supabase Storage atau Edge Function ringan berbasis `sharp` — mencegah unggahan mentah besar membengkakkan penyimpanan/bandwidth situs.

## 15.7 API Layer

REST sederhana lewat Route Handler. **Keputusan eksplisit: bukan GraphQL** — bentuk data yang dikonsumsi sudah diketahui dan stabil; menambah lapisan resolver/skema GraphQL adalah kompleksitas tanpa manfaat sepadan untuk tim yang akan serah-terima project, berlaku juga untuk endpoint kasus/verifikasi yang lebih kompleks di Dashboard.

## 15.8 Validasi

Skema Zod yang sama dipakai di client (react-hook-form resolver) dan server (validasi ulang wajib) — satu sumber kebenaran aturan validasi, mencegah aturan client dan server perlahan tidak sinkron seiring waktu.

## 15.9 Rate Limiting

Endpoint form publik (donasi/kontak) diberi rate limiting berbasis IP (misalnya lewat Upstash Redis yang ringan dan serverless-friendly) — bot spam menyasar form kontak tanpa memandang skala/tujuan situs, sehingga perlindungan ini tetap perlu meski situs ini bukan platform besar. Endpoint kasus/verifikasi tambahan dilindungi RBAC, bukan rate limiting publik, karena hanya diakses pengguna terautentikasi.

## 15.10 Autentikasi & Otorisasi

Supabase Auth melayani **empat peran**:

- **Operator kelurahan** — akses penuh dashboard kasus.
- **Verifikator independen** — khusus mengonfirmasi penutupan kasus, sesuai prinsip *maker-checker* (orang yang menutup kasus bukan orang yang sama dengan yang memverifikasinya).
- **RT/RW** — akses terbatas, hanya kasus wilayahnya, tanpa akses verifikasi.
- **Admin konten** — hanya section `konten/`, tidak bisa menyentuh data kasus.

RBAC ditegakkan berlapis: middleware route (Bagian 3.5) + RoleGate komponen (Bagian 11.2) + Row Level Security database (Bagian 15.1) — pertahanan berlapis, bukan mengandalkan satu titik pemeriksaan saja.

## 15.11 Konten / CMS

Rancangan awal sempat mempertimbangkan panel admin konten sebagai CMS mandiri yang berdiri sendiri (bukan berlangganan CMS pihak ketiga berbayar seperti Sanity/Contentful, dan bukan pula CMS berbasis file/Git yang mengharuskan editor bisa coding) — melainkan panel admin minimal yang dibangun sendiri, berupa beberapa tabel Supabase sederhana (halaman konten, entri laporan, item galeri) dengan form CRUD dasar di balik login. **Alasan keberlanjutan di balik pendekatan ini:** tim KKN berganti tiap semester, dan staf kelurahan yang mungkin ikut mengelola konten pasca-KKN tidak bisa diasumsikan bisa coding — panel visual sederhana jauh lebih berkelanjutan daripada mengandalkan editor berbasis Markdown/Git, sekaligus menghindari biaya langganan CMS pihak ketiga yang tidak dianggarkan dalam RAB program.

Pada arsitektur final, ini **melebur sepenuhnya** menjadi section `konten/` di dalam Dashboard yang sama (Bagian 3.2), dengan peran "admin konten" sebagai salah satu dari empat peran RBAC (Bagian 15.10) — bukan sistem/tabel terpisah secara konseptual, meski secara teknis tabel `konten` tetap hidup di database yang sama. Seluruh alasan keberlanjutan di atas tetap berlaku persis sama; yang berubah hanyalah panel ini kini hidup sebagai satu section di Dashboard, bukan aplikasi/sistem tersendiri yang perlu diserah-terimakan terpisah.

---

# 16. Governance Dokumen

Dokumen ini adalah **living document** — satu-satunya sumber kebenaran untuk seluruh keputusan desain dan arsitektur RADAR ANAK, mencakup Website Publik, Dashboard Operator, dan WhatsApp Bot. Setiap perubahan pada filosofi desain, pemilihan library, atau arsitektur backend **wajib** direfleksikan kembali ke dokumen ini sebelum diimplementasikan di kode — bukan sesudahnya.

Developer baru yang bergabung ke proyek ini wajib membaca dokumen ini secara utuh sebelum menyentuh kode, termasuk memahami **mengapa** kedua route group sengaja dibuat terasa seperti dua produk berbeda meski hidup dalam satu repo yang sama, dan mengapa WhatsApp Bot dihitung sebagai sistem kedua yang berdiri sendiri secara filosofi meski endpoint webhook-nya menumpang di aplikasi yang sama. Jika sebuah keputusan implementasi terasa tidak sejalan dengan prinsip di sini, itu adalah sinyal untuk berhenti dan mendiskusikannya — bukan untuk diam-diam menyimpang di kode.

---

# 17. WhatsApp Bot — Sistem Kedua

## 17.1 Tujuan WhatsApp Bot Ini Ada

Temuan lapangan yang mendasari seluruh RADAR ANAK adalah ini: kelurahan menyatakan tidak ada anak putus sekolah, tapi wawancara langsung ke RT/RW menemukan 7 anak. Ini bukan soal warga menyembunyikan informasi — ini soal **tidak ada jalur mudah untuk melaporkannya**. RT/RW dan warga tidak punya cara sederhana menyampaikan "saya lihat ada anak yang berhenti sekolah" ke kelurahan, sehingga informasi itu berhenti di obrolan warung, tidak pernah sampai ke pihak yang bisa membantu.

WhatsApp Bot menjawab persis masalah ini: menyediakan **satu pintu pelaporan yang sudah familiar** bagi siapa pun, tanpa perlu belajar aplikasi baru, tanpa perlu datang ke kantor kelurahan, tanpa perlu tahu harus lapor ke siapa.

## 17.2 Kenapa WhatsApp, Bukan Aplikasi Terpisah

RT/RW dan warga sudah membuka WhatsApp setiap hari — memaksa mereka install aplikasi baru untuk urusan yang jarang terjadi (melaporkan satu-dua anak per tahun) hampir pasti akan diabaikan. WhatsApp menghilangkan seluruh hambatan itu: tidak ada instalasi, tidak ada akun baru, tidak ada kurva belajar. Pelapor cukup mengetik seperti mengirim pesan biasa ke teman.

## 17.3 Arsitektur Teknis & Kontrak Integrasi

- **Kanal:** WhatsApp Cloud API — implementasi resmi Meta, diakses langsung tanpa perantara BSP (Business Solution Provider) pihak ketiga, sehingga tidak ada biaya platform bulanan tambahan yang biasanya dikenakan penyedia seperti Wati/360dialog.
- **Penerima pesan (webhook):** hidup sebagai satu endpoint (`/api/webhook/whatsapp`) di dalam aplikasi Next.js yang sama dengan Website Publik dan Dashboard Operator — bukan server terpisah, bukan sistem ketiga (Bagian 1.2). Endpoint ini berjalan di Node runtime (bukan Edge) karena membutuhkan verifikasi signature Meta memakai Node crypto API yang tidak tersedia penuh di Edge Runtime (Bagian 14.2).
- **Penyimpanan:** setiap laporan yang selesai dikumpulkan bot langsung tersimpan ke database yang sama dipakai Dashboard (Bagian 15.1), dan otomatis muncul di layar operator lewat notifikasi real-time (Bagian 15.2, Bagian 6.8) — tanpa integrasi tambahan apa pun.
- **Percakapan bertahap:** bot menuntun pelapor lewat mesin state percakapan singkat (bukan formulir web) — begitu informasi minimal terkumpul, kasus baru otomatis tersimpan dan langsung muncul di Dashboard tanpa integrasi frontend tambahan apa pun.
- **Reminder proaktif:** kasus yang mangkrak (sudah dirujuk tapi belum ada bukti tindak lanjut) memicu pesan pengingat ke operator lewat template WhatsApp kategori *utility*, dipicu oleh scheduled job harian yang sama dengan yang menjaga cache statistik publik tetap segar (Bagian 13, Bagian 14.2).

## 17.4 Alur Lengkap Pelaporan

**Langkah 1 — Memulai percakapan.** RT/RW atau warga mengirim pesan ke nomor WhatsApp resmi RADAR ANAK (bisa lewat kontak yang disimpan, atau memindai kode QR fisik yang ditempel di balai RW, posyandu, atau sekolah — memindai otomatis membuka percakapan tanpa perlu mengetik nomor).

**Langkah 2 — Bot menuntun bertahap.** Alih-alih formulir panjang yang membingungkan, bot bertanya satu per satu, seperti percakapan biasa:

> Bot: Halo, terima kasih sudah menghubungi RADAR ANAK. Apakah kamu ingin melaporkan anak yang putus sekolah atau berisiko putus sekolah?
> Pelapor: Iya, ada anak namanya Udin
> Bot: Baik. Udin tinggal di RW berapa?
> Pelapor: RW 07
> Bot: Menurutmu, kira-kira apa penyebab Udin tidak sekolah? (1) Masalah biaya (2) Masalah di sekolah/teman (3) Rumah jauh dari sekolah (4) Tidak yakin/lainnya
> Pelapor: 1
> Bot: Terima kasih sudah melapor. Laporan sudah kami terima dan akan ditindaklanjuti tim kami. Kami mungkin akan menghubungi lagi untuk informasi tambahan.

**Langkah 3 — Kasus otomatis tercatat.** Begitu informasi minimal terkumpul, bot menyimpan laporan sebagai kasus baru berstatus "Baru Dilaporkan", lengkap dengan kategori penyebab awal (dari pilihan yang dijawab pelapor).

**Langkah 4 — Muncul di Dashboard secara real-time.** Operator kelurahan langsung melihat notifikasi kasus baru tanpa refresh halaman (Bagian 6.8, 11.2). Tim KKN/kelurahan kemudian melakukan asesmen mendalam langsung ke anak/keluarga untuk memverifikasi dan melengkapi detail yang tidak bisa digali lewat chat singkat.

**Langkah 5 — Kategori awal disempurnakan manual.** Kategori penyebab yang dijawab pelapor di WhatsApp adalah dugaan awal, bukan final — operator bisa mengoreksi kategori ini di Dashboard setelah asesmen langsung, karena pelapor (tetangga/RT) belum tentu tahu detail sebenarnya.

## 17.5 Fitur Tambahan

**Cek status kasus.** Pelapor bisa mengirim pesan seperti "status Udin gimana?" dan bot membalas status terkini kasus tersebut (Baru Dilaporkan / Diverifikasi / Dirujuk-Menunggu Bukti / Selesai) — memberi rasa bahwa laporan mereka benar-benar ditindaklanjuti, bukan menghilang begitu saja.

**Kode QR fisik.** Ditempel di titik strategis (balai RW, posyandu, sekolah) khusus untuk warga yang mungkin tidak menyimpan kontak resmi atau kurang familiar mengetik nomor WhatsApp bisnis secara manual.

**Reminder otomatis ke operator (bukan ke pelapor).** Jika sebuah kasus sudah dirujuk tapi belum ada bukti tindak lanjut lebih dari beberapa hari, sistem secara otomatis mengirim pesan pengingat ke operator kelurahan lewat WhatsApp — bukan fitur yang dipakai warga, tapi bagian dari mekanisme akuntabilitas supaya kasus tidak mangkrak tanpa disadari (lihat mekanisme verifikasi berlapis, Bagian 15.10).

## 17.6 Keterkaitan dengan Sistem Lain

WhatsApp Bot bukan sistem berdiri sendiri — ia adalah **pintu masuk** ke satu database yang sama dipakai Dashboard Operator dan (dalam bentuk agregat, tanpa identitas) ditampilkan di Website Publik. Rangkaiannya:

**Pelaporan via WhatsApp → tersimpan sebagai kasus baru → muncul real-time di Dashboard → diverifikasi & dirujuk oleh operator → statistik agregatnya (setelah dianonimkan) tampil di Website Publik sebagai bukti dampak program.**

Mesin skor risiko yang sama dipakai untuk menghasilkan kategori awal yang bisa dikoreksi operator (Bagian 14.1, `lib/risk-engine/`) juga berfungsi sebagai **mesin klasifikasi penyebab** yang menyarankan kategori dan rekomendasi rujukan — dipanggil dari titik yang sama (Route Handler yang sama) saat kasus baru masuk, baik lewat WhatsApp maupun jalur lain. Engine ini sederhana secara sengaja (aturan berbobot, bukan model machine learning rumit) karena volume kasus di skala satu kelurahan tidak membenarkan kompleksitas tambahan (Bagian 4.3, Bagian 14.1).

## 17.7 Keamanan & Privasi

- Data yang dikumpulkan lewat chat (nama anak, RW, kategori dugaan) tersimpan di database yang sama dilindungi Row Level Security (Bagian 15.1) — pelapor sendiri tidak bisa melihat data kasus anak lain selain yang mereka laporkan sendiri (lewat fitur cek status).
- Bot tidak pernah meminta atau menyimpan data sensitif berlebihan (tidak ada NIK, tidak ada foto anak) lewat percakapan WhatsApp — detail lebih dalam hanya dikumpulkan lewat asesmen tatap muka langsung oleh tim, bukan lewat chat.
- Nomor WhatsApp pelapor tersimpan hanya untuk keperluan cek status dan tidak dipublikasikan atau dibagikan ke pihak mana pun di luar tim yang berwenang.

## 17.8 Estimasi Biaya

- **Hosting Cloud API:** Rp0 — WhatsApp Cloud API resmi Meta gratis di-hosting sendiri, tidak ada biaya BSP bulanan.
- **Pesan yang dikirim warga ke bot (melapor):** gratis, karena masuk kategori *service conversation* yang dipicu pengguna sendiri.
- **Reminder proaktif ke operator (kategori utility):** berbayar tapi sangat kecil — tarif dasar Meta untuk Indonesia sekitar Rp50–100 ribu per bulan pada volume kasus skala satu kelurahan, karena hanya notifikasi internal yang dikenakan biaya, bukan percakapan pelaporan itu sendiri.

## 17.9 Batasan yang Perlu Diperhatikan

- **Template pesan perlu disetujui Meta terlebih dulu** sebelum bisa dipakai untuk pesan proaktif (reminder) — proses persetujuan bisa memakan waktu beberapa hari, perlu direncanakan sebelum masa KKN berjalan penuh.
- **Bot ini bukan pengganti asesmen manusia.** Ia hanya mengumpulkan indikasi awal secepat mungkin; penggalian penyebab sesungguhnya tetap memerlukan kunjungan/wawancara langsung tim ke anak dan keluarga — bot dirancang untuk mempercepat *pelaporan*, bukan menggantikan *penanganan*.
- **Nomor WhatsApp bisnis resmi perlu diverifikasi Meta Business** sebelum bisa dipakai penuh — proses administratif yang sebaiknya dimulai di awal, bukan menjelang deadline pelaksanaan program.
