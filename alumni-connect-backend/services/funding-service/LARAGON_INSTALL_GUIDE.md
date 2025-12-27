# 🚀 Panduan Install Laragon di Disk D:

## Step 1: Download Laragon

### Option A: Download via Browser (Recommended)

1. **Buka browser** dan kunjungi:
   ```
   https://laragon.org/download/
   ```

2. **Download Laragon Full**:
   - Klik tombol **"Laragon Full"** (bukan Laragon Lite)
   - File size: ~200 MB
   - Includes: PHP 8.1, Apache, MySQL, Composer, Node.js

3. **Save file** ke Downloads:
   ```
   C:\Users\eliar\Downloads\laragon-wamp.exe
   ```

### Option B: Download via Command Line

```bash
# Download Laragon Full installer
curl -L -o ~/Downloads/laragon-full.exe "https://github.com/leokhoa/laragon/releases/download/6.0.0/laragon-wamp.exe"
```

---

## Step 2: Install Laragon ke Disk D:

1. **Run installer** yang sudah didownload:
   - Double-click `laragon-wamp.exe` dari Downloads

2. **Choose Installation Location** ⚠️ IMPORTANT:
   ```
   Default: C:\laragon
   
   UBAH KE: D:\laragon
   ```
   
   Pada dialog installer, klik **"Browse"** dan pilih `D:\laragon`

3. **Installation Options**:
   - ✅ Auto Virtual Hosts (check)
   - ✅ Add Laragon to Path (check)
   - ✅ Run Laragon when Windows starts (optional)

4. **Click "Install"** dan tunggu proses selesai (~5-10 menit)

---

## Step 3: First Time Setup

1. **Start Laragon**:
   - Double-click icon Laragon di Desktop
   - Atau buka dari Start Menu

2. **Click "Start All"**:
   - Apache akan start di port 80
   - MySQL akan start di port 3306
   - Tunggu sampai status indicator hijau semua

3. **Verify Installation**:
   - Klik kanan Laragon tray icon → **"Terminal"**
   - Test PHP:
     ```bash
     php --version
     # Should show: PHP 8.1.x or 8.2.x
     ```
   - Test Composer:
     ```bash
     composer --version
     # Should show: Composer 2.x.x
     ```

---

## Step 4: Setup PostgreSQL (untuk AlumniConnect)

Laragon default include MySQL, tapi AlumniConnect pakai PostgreSQL.

### Install PostgreSQL di Laragon:

1. **Download PostgreSQL**:
   - Klik kanan Laragon tray → **PostgreSQL** → **Download PostgreSQL**
   - Atau manual download dari: https://www.postgresql.org/download/windows/

2. **Extract ke Laragon**:
   ```
   Extract to: D:\laragon\bin\postgres\
   ```

3. **Restart Laragon**:
   - Click "Stop All"
   - Click "Start All"

4. **Verify PostgreSQL**:
   ```bash
   # Di Laragon Terminal
   psql --version
   ```

---

## Step 5: Setup Funding Service

Setelah Laragon terinstall, mari setup funding-service:

### 1. Buka Laragon Terminal

Klik kanan Laragon tray icon → **"Terminal"**

### 2. Navigate ke Funding Service

```bash
cd "/d/S1 Sistem Informasi - Ekstensi/Semester 1/Intergrasi Aplikasi Enterprise/Tubes_Uas/AlumniConnect/alumni-connect-backend/services/funding-service"
```

### 3. Install Dependencies

```bash
composer install
```

Seharusnya sekarang berhasil karena:
- ✅ PHP versi stable (8.1 atau 8.2)
- ✅ Composer latest version
- ✅ Semua extensions sudah enabled

### 4. Setup Environment

```bash
# Copy .env
cp .env.example .env

# Generate app key
php artisan key:generate
```

### 5. Update .env untuk PostgreSQL

Edit `.env` file:
```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=alumni_funding
DB_USERNAME=postgres
DB_PASSWORD=
```

### 6. Create Database

```bash
# Di Laragon Terminal, buka psql
psql -U postgres

# Create database
CREATE DATABASE alumni_funding;

# Exit psql
\q
```

### 7. Run Migrations

```bash
php artisan migrate

# Seed database
php artisan db:seed
```

### 8. Start Server

```bash
php artisan serve --port=4003
```

Server akan berjalan di: http://localhost:4003

---

## 🎯 Quick Commands Reference

### Laragon Management:
```bash
# Open Laragon Terminal
# (Click kanan tray icon → Terminal)

# Check PHP version
php --version

# Check Composer version
composer --version

# Switch PHP version (via Laragon GUI)
# Click kanan tray → PHP → Version → Select version
```

### Funding Service:
```bash
# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start server
php artisan serve --port=4003

# Clear cache (if needed)
php artisan cache:clear
php artisan config:clear
```

---

## ✅ Verification Checklist

Setelah install Laragon, pastikan:

- [ ] Laragon installed di `D:\laragon`
- [ ] Laragon tray icon hijau (all services running)
- [ ] `php --version` shows PHP 8.1 or 8.2
- [ ] `composer --version` shows Composer 2.x
- [ ] PostgreSQL installed and running
- [ ] Database `alumni_funding` created
- [ ] `composer install` runs successfully in funding-service
- [ ] `php artisan serve` starts without errors

---

## 🔧 Troubleshooting

### Port 80 Already in Use
**Solution**: 
1. Stop IIS atau service lain yang pakai port 80
2. Atau ubah Apache port di Laragon settings

### PostgreSQL Not Found
**Solution**:
1. Download PostgreSQL portable
2. Extract ke `D:\laragon\bin\postgres\postgres-xx`
3. Restart Laragon

### Composer Install Masih Error
**Solution**:
1. Pastikan PHP version di Laragon adalah 8.1 atau 8.2
2. Check: `php --version` di Laragon Terminal
3. Jika 8.5, switch via: Laragon → PHP → Version

---

## 🎉 Setelah Selesai

Setelah semua setup, Anda akan punya:
- ✅ PHP 8.1/8.2 (stable version)
- ✅ Composer (latest)
- ✅ PostgreSQL (working)
- ✅ Funding service (ready to run)

**Next Steps:**
1. Test GraphQL endpoint: http://localhost:4003/graphql-playground
2. Integrate dengan frontend
3. Test all features

---

Selamat! Anda sudah punya development environment yang lengkap dan stabil! 🚀
