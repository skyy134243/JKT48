# JKT48 Live Radar 🔴📡

> **Fan-made real-time live monitoring radar and zero-spam notification system for JKT48 members across IDN Live & SHOWROOM.**

![JKT48 Live Radar](https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg/440px-Angelina_Christy_%28Christy%29_at_the_JKT48_Summer_Festival.jpg)

---

## 🌟 Fitur Utama

1. **🔴 Live Detection Real-Time**
   - Memantau status siaran langsung member JKT48 di platform resmi: **IDN Live** dan **SHOWROOM**.
   - **Tanpa re-streaming** & tanpa video player custom: aplikasi langsung mengarahkan penggemar ke tautan resmi live.
2. **⭐ Oshi Priority System**
   - Pilih satu atau beberapa Oshi favorit.
   - Atur prioritas: **Prioritas 1 (Tinggi 🔴)**, **Prioritas 2 (Normal 🟡)**, atau **Prioritas 3 (Rendah ⚪)**.
3. **🔕 Anti-Spam & Deduplication**
   - State machine idempotency: hanya transisi `OFFLINE` → `LIVE` yang memicu live event.
   - Unique key per live: `memberId + platform + liveId`.
   - Polling berulang tidak akan mengirimkan notifikasi duplikat.
4. **🌙 Jam Hening (Quiet Hours)**
   - Fitur otomatis untuk menonaktifkan notifikasi suara pada jam tidur (misal 23:00 - 06:00), dengan opsi mengizinkan hanya Oshi Prioritas Tinggi.
5. **📱 Mobile-First & PWA**
   - Bottom navigation yang nyaman di genggaman (360px – 412px), desktop responsive sidebar, dan dukungan PWA offline shell.
6. **📊 Admin & Simulator Panel**
   - Monitor status kesehatan service provider, database, dan simulasi transisi live untuk pengujian.

---

## 🏗️ Struktur Folder Modular

```
jkt48-live-radar/
├── index.html                    # SPA App Shell & PWA Entrypoint
├── manifest.json                 # PWA Manifest
├── firebase-messaging-sw.js      # Service Worker (FCM Push & Click Routing)
├── vercel.json                   # Konfigurasi Vercel & Cron Scheduler
├── package.json                  # Metadata proyek
├── server.js                     # Local Dev Web Server
├── src/
│   ├── app/                      # Views & SPA Routing
│   │   ├── router.js             # Client SPA Router & event controller
│   │   ├── LandingView.js        # Landing page pengunjung
│   │   ├── HomeView.js           # Live Sekarang + Oshi status + Recent
│   │   ├── MemberListView.js     # Katalog member dengan filter & pencarian
│   │   ├── MemberProfileModal.js # Modal profil member & official links
│   │   ├── OshiView.js           # Manajemen prioritas Oshi
│   │   ├── NotificationView.js   # Notification center (Hari ini / Kemarin)
│   │   ├── SettingsView.js       # Pengaturan notifikasi & jam hening
│   │   ├── ProfileView.js        # Profil pengguna & logout
│   │   ├── OnboardingModal.js    # 4 langkah onboarding pengguna baru
│   │   └── AdminView.js          # Admin dashboard & live simulator
│   ├── components/               # Komponen UI
│   │   ├── Header.js             # Top bar logo & status
│   │   ├── BottomNav.js          # Mobile bottom navigation
│   │   ├── Sidebar.js            # Desktop sidebar navigation
│   │   ├── LiveCard.js           # Kartu live dengan tombol resmi "Buka Live"
│   │   ├── MemberCard.js         # Kartu katalog member & bintang Oshi
│   │   ├── NotificationCard.js   # Kartu riwayat notifikasi
│   │   └── Skeleton.js           # Shimmer skeleton loader
│   ├── lib/
│   │   ├── auth.js               # Firebase Auth Google sign-in manager
│   │   ├── database.js           # Firestore / Typed database layer
│   │   ├── firebase.js           # Firebase configuration
│   │   ├── notifications.js      # Web push permission & device registration
│   │   └── utils.js              # Helpers, sanitization & date formatters
│   ├── services/
│   │   ├── idnProvider.js        # Adapter sumber IDN Live
│   │   ├── showroomProvider.js   # Adapter sumber SHOWROOM Live
│   │   ├── liveMonitor.js        # State Machine deteksi live server-side
│   │   └── notificationRouter.js # Routing notifikasi & anti-spam
│   ├── data/
│   │   └── members.js            # Database resmi member JKT48
│   ├── types/
│   │   └── schemas.js            # Definisi tipe skema data
│   └── styles/
│       ├── main.css              # Design system variables & base layout
│       └── components.css        # Styling kartu, navigasi & dark mode
├── api/                          # Vercel Serverless Endpoints
│   ├── cron/monitor.js           # Cron execution (per menit)
│   ├── live/status.js            # Public API status live
│   └── admin/health.js           # API diagnostik kesehatan sistem
└── test/
    └── stateMachine.test.js      # Automated QA state machine suite
```

---

## 🚀 Menjalankan Secara Lokal

Untuk menjalankan di komputer lokal:
```bash
node server.js
```
Lalu buka browser di: `http://localhost:3000`

Untuk menjalankan pengujian state machine & keandalan anti-spam:
```bash
node test/stateMachine.test.js
```

---

## 🌐 Target Deployment

- **Hosting**: Vercel (`vercel deploy`)
- **Backend**: Vercel Serverless Functions + Cron Jobs
- **Database & Auth**: Google Firebase (Firestore, Firebase Authentication, Firebase Cloud Messaging)
- **Repository**: [github.com/skyy134243/JKT48](https://github.com/skyy134243/JKT48)
