# 🚀 Panduan Setup Funding Service (PHP/Laravel)

Panduan instalasi dan konfigurasi lengkap untuk Funding Service AlumniConnect.

---

## 📋 Prerequisites

Pastikan sudah terinstall:
- ✅ PHP 8.1 atau lebih baru
- ✅ Composer (PHP package manager)
- ✅ PostgreSQL server running
- ✅ Database `alumni_funding` sudah dibuat

---

## 🔧 Instalasi Step-by-Step

### Step 1: Masuk ke direktori funding-service

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\funding-service"
```

### Step 2: Install dependencies dengan Composer

```bash
composer install
```

> [!NOTE]
> Proses ini akan download semua package Laravel dan Lighthouse GraphQL. Bisa memakan waktu beberapa menit.

### Step 3: Copy file environment

```bash
cp .env.example .env  
# ATAU jika di Windows PowerShell:
copy .env.example .env
```

### Step 4: Generate application key

```bash
php artisan key:generate
```

Ini akan mengisi `APP_KEY` di file `.env` secara otomatis.

### Step 5: Konfigurasi database

Edit file `.env` dan pastikan konfigurasi database sudah benar:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=alumni_funding
DB_USERNAME=postgres
DB_PASSWORD=root
```

### Step 6: Konfigurasi JWT Secret

Pastikan JWT_SECRET di `.env` sama dengan Identity Service:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

> [!IMPORTANT]
> JWT Secret HARUS sama dengan yang ada di Identity Service agar autentikasi berfungsi!

### Step 7: Jalankan migrasi database

```bash
php artisan migrate
```

Ini akan membuat 3 tabel:
- `campaigns` - Data campaign crowdfunding
- `donations` - Data donasi
- `campaign_updates` - Update progress campaign

### Step 8: Seed data sample (opsional)

```bash
php artisan db:seed
```

Ini akan mengisi database dengan:
- 5 campaign contoh
- Beberapa donasi sample
- Campaign updates

### Step 9: Test server

```bash
php artisan serve --port=4003
```

Jika berhasil, akan muncul:
```
Laravel development server started on http://127.0.0.1:4003
```

### Step 10: Test GraphQL Playground

Buka browser dan akses:
```
http://localhost:4003/graphql-playground
```

Test dengan query sederhana:
```graphql
query {
  campaigns {
    id
    title
    category
    currentAmount
    targetAmount
  }
}
```

---

## ✅ Checklist Verifikasi

Sebelum menjalankan keseluruhan sistem, pastikan:

- [ ] PHP version 8.1+ (`php --version`)
- [ ] Composer terinstall (`composer --version`)
- [ ] Database `alumni_funding` sudah dibuat
- [ ] File `.env` sudah dikonfigurasi dengan benar
- [ ] Migrasi database berhasil (`php artisan migrate`)
- [ ] Server bisa jalan di port 4003 (`php artisan serve --port=4003`)
- [ ] GraphQL Playground bisa diakses
- [ ] JWT_SECRET sama dengan Identity Service

---

## 🔥 Troubleshooting

### Error: "Class 'PDO' not found"

Install PHP extension PostgreSQL:
```bash
# Enable di php.ini
extension=pdo_pgsql
extension=pgsql
```

### Error: "Connection refused" saat migrasi

- Pastikan PostgreSQL server sudah running
- Check connection dengan: `psql -U postgres -h 127.0.0.1`
- Pastikan database `alumni_funding` sudah dibuat

### Error: Port 4003 already in use

```bash
# Windows
netstat -ano | findstr :4003
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4003 | xargs kill -9
```

### Error: Composer install gagal

```bash
# Clear composer cache
composer clear-cache

# Install ulang
composer install --no-cache
```

---

## 📚 Command Reference

### Development
```bash
# Start server
php artisan serve --port=4003

# Watch for file changes (jika ada asset)
npm run dev
```

### Database
```bash
# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migrate (drop all tables + re-migrate)
php artisan migrate:fresh

# Seed database
php artisan db:seed

# Fresh migrate + seed
php artisan migrate:fresh --seed
```

### Artisan
```bash
# List all commands
php artisan list

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Generate IDE helper (untuk autocomplete)
php artisan ide-helper:generate
```

---

## 🎯 Next Steps

Setelah Funding Service berjalan:

1. ✅ Start Identity Service (Port 4001)
2. ✅ Start Event Service (Port 4002)
3. ✅ Start Funding Service (Port 4003) ← **Anda di sini**
4. ▶️ Start API Gateway (Port 4000)
5. ▶️ Start Frontend (Port 5173)

Lihat [start-servers.md](../../../.agent/workflows/start-servers.md) untuk panduan lengkap.
