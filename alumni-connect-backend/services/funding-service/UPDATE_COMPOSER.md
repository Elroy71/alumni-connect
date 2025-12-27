# 🔧 Panduan Update Composer Manual untuk PHP 8.5.1

## Masalah
Composer versi lama tidak kompatibel dengan PHP 8.5.1, menyebabkan TypeError saat install dependencies.

---

## Solusi: Update Composer Secara Manual

### Step 1: Download Composer Terbaru

1. **Buka browser** dan kunjungi:
   ```
   https://getcomposer.org/download/
   ```

2. **Klik kanan** pada link **"composer.phar"** (latest version)

3. **Save As** ke folder downloads Anda, misalnya:
   ```
   C:\Users\eliar\Downloads\composer.phar
   ```

### Step 2: Backup Composer Lama (Optional)

```bash
# Rename composer lama di C:\ProgramData\ComposerSetup\bin\
cd C:\ProgramData\ComposerSetup\bin\
mv composer.phar composer.phar.backup
```

### Step 3: Replace dengan Composer Baru

**Option A: Via Command Line**
```bash
# Copy composer baru ke lokasi global
cp ~/Downloads/composer.phar C:/ProgramData/ComposerSetup/bin/composer.phar
```

**Option B: Manual (Jika Option A Error)**
1. Buka File Explorer
2. Navigate ke `C:\ProgramData\ComposerSetup\bin\`
3. Copy file `composer.phar` dari Downloads ke folder ini
4. Replace file yang lama

### Step 4: Verify Update

```bash
# Cek versi Composer
composer --version

# Should show: Composer version 2.x.x or higher
```

### Step 5: Test Composer Install

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\funding-service"

composer install
```

---

## ⚠️ Troubleshooting

### Jika masih error "cannot access protected method"

Composer terbaru mungkin belum full support PHP 8.5.1. Solusi alternatif:

#### Option 1: Install Dependencies dengan Ignore Platform
```bash
composer install --ignore-platform-req=php
```

#### Option 2: Lock PHP Version di composer.json
Tambahkan di `composer.json`:
```json
{
    "config": {
        "platform": {
            "php": "8.3.0"
        }
    }
}
```

Lalu jalankan:
```bash
composer install --ignore-platform-req=php
```

---

## 🎯 Quick Commands

Jika semua cara di atas gagal, gunakan perintah ini untuk force install:

```bash
# Force install tanpa cek platform requirements
composer install --ignore-platform-reqs

# Atau dengan verbose output untuk debug
composer install --ignore-platform-reqs -vvv
```

---

## ✅ Expected Result

Setelah berhasil, Anda akan melihat:
```
Loading composer repositories with package information
Updating dependencies
Lock file operations: XX installs, 0 updates, 0 removals
  - Installing vendor/package (version)
  ...
Writing lock file
Installing dependencies from lock file
  ...
Generating optimized autoload files
```

---

## 📝 Next Steps Setelah Composer Install Berhasil

```bash
# 1. Copy .env
cp .env.example .env

# 2. Generate app key
php artisan key:generate

# 3. Update .env dengan database credentials
# Edit .env file, sesuaikan:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=alumni_funding
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# 4. Run migrations
php artisan migrate

# 5. Seed database
php artisan db:seed

# 6. Start server
php artisan serve --port=4003
```

---

Selamat mencoba! Kabari saya jika ada error baru. 🚀
