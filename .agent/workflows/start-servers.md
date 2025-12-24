---
description: Cara menjalankan semua server AlumniConnect
---

# 🚀 Panduan Menjalankan Server AlumniConnect

AlumniConnect menggunakan arsitektur microservices dengan 4 server yang harus dijalankan:
1. **Identity Service** (Backend - Node.js)
2. **Event Service** (Backend - Python FastAPI)
3. **API Gateway** (Backend - Node.js Apollo Federation)
4. **Frontend** (React + Vite)

---

## 📋 Persiapan Awal

### Pastikan Dependencies Sudah Terinstall

**Untuk Service berbasis Node.js:**
```bash
# Di setiap direktori service Node.js, jalankan:
npm install
```

**Untuk Event Service (Python):**
```bash
# Di direktori event-service, jalankan:
pip install -r requirements.txt
# atau jika menggunakan virtual environment:
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

---

## 🖥️ Menjalankan Server (4 Terminal)

Anda membutuhkan **4 terminal terpisah** untuk menjalankan semua server secara bersamaan.

### Terminal 1: Identity Service (Port 4001)

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\identity-service"

npm run dev
```

**Status:** ✅ Running ketika muncul pesan `Server ready at http://localhost:4001/graphql`

---

### Terminal 2: Event Service (Port 4002)

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\event-service"

# Aktifkan virtual environment (jika menggunakan venv)
.\venv\Scripts\activate

# Jalankan server
uvicorn app.main:app --reload --port 4002
```

**Status:** ✅ Running ketika muncul pesan `Uvicorn running on http://127.0.0.1:4002`

---

### Terminal 3: API Gateway (Port 4000)

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\api-gateway"

npm run dev
```

**Status:** ✅ Running ketika muncul pesan `🚀 Gateway ready at http://localhost:4000/graphql`

> [!IMPORTANT]
> **API Gateway harus dijalankan SETELAH Identity Service dan Event Service sudah running!**

---

### Terminal 4: Frontend (Port 5173)

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-frontend"

npm run dev
```

**Status:** ✅ Running ketika muncul pesan seperti:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Akses aplikasi:** Buka browser dan kunjungi `http://localhost:5173`

---

## 📊 Ringkasan Port Server

| Server           | Port | Teknologi      | Command         |
|------------------|------|----------------|-----------------|
| Identity Service | 4001 | Node.js        | `npm run dev`   |
| Event Service    | 4002 | Python FastAPI | `uvicorn app.main:app --reload --port 4002` |
| API Gateway      | 4000 | Apollo Gateway | `npm run dev`   |
| Frontend         | 5173 | React + Vite   | `npm run dev`   |

---

## 🔄 Urutan Menjalankan Server

1. **Pertama:** Identity Service (Terminal 1)
2. **Kedua:** Event Service (Terminal 2)
3. **Ketiga:** API Gateway (Terminal 3) - *tunggu service 1 & 2 ready*
4. **Keempat:** Frontend (Terminal 4)

---

## 🛑 Menghentikan Server

Untuk menghentikan server, tekan `Ctrl + C` di setiap terminal.

---

## ⚠️ Troubleshooting

### Error: Port sudah digunakan
```bash
# Cari proses yang menggunakan port (contoh: port 4001)
netstat -ano | findstr :4001

# Matikan proses berdasarkan PID
taskkill /PID <PID> /F
```

### Error: Module not found (Node.js)
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Error: Python dependencies
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 🎯 Quick Start (Copy-Paste Ready)

Untuk memudahkan, berikut command lengkap untuk setiap terminal:

**Terminal 1:**
```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\identity-service" && npm run dev
```

**Terminal 2:**
```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\event-service" && source venv/Scripts/activate && uvicorn app.main:app --reload --port 4002
```

**Terminal 3:**
```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\api-gateway" && npm run dev
```

**Terminal 4:**
```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-frontend" && npm run dev
```