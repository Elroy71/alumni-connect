# 🔧 PHP Installation Guide untuk Windows

## ❌ Problem
Error: `bash: php: command not found` atau `'php' is not recognized`

Ini berarti PHP belum terinstall di sistem Windows Anda.

---

## ✅ Solusi: Install PHP di Windows

Ada 3 cara install PHP di Windows:

### **Option 1: Install via Laragon (RECOMMENDED)** ⭐

Laragon adalah all-in-one development environment yang sudah include PHP, Composer, dan MySQL.

1. **Download Laragon Full**:
   - Kunjungi: https://laragon.org/download/
   - Download: **Laragon Full** (includes PHP, Composer, MySQL, Apache)

2. **Install Laragon**:
   - Run installer
   - Accept default settings
   - Install di `C:\laragon` (default location)

3. **Start Laragon**:
   - Buka Laragon
   - Click "Start All"

4. **Verify Installation**:
   ```bash
   # Buka terminal baru (Laragon Terminal atau Git Bash)
   php --version
   composer --version
   ```

**Keuntungan**:
- ✅ Sudah include Composer
- ✅ Sudah include MySQL/PostgreSQL
- ✅ Easy to manage multiple PHP versions
- ✅ Built-in terminal

---

### **Option 2: Install via Chocolatey (For Developers)**

Jika Anda familiar dengan package managers:

1. **Install Chocolatey** (jika belum):
   - Buka PowerShell as Administrator
   - Run:
     ```powershell
     Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
     ```

2. **Install PHP**:
   ```powershell
   choco install php composer -y
   ```

3. **Restart Terminal** dan verify:
   ```bash
   php --version
   composer --version
   ```

---

### **Option 3: Manual Install (Advanced)**

1. **Download PHP**:
   - Kunjungi: https://windows.php.net/download/
   - Download: **PHP 8.2 VC15 x64 Thread Safe** (ZIP)

2. **Extract PHP**:
   - Extract ke `C:\php`

3. **Configure PHP**:
   - Rename `php.ini-development` ke `php.ini`
   - Edit `php.ini`, uncomment extensions:
     ```ini
     extension=pdo_pgsql
     extension=pgsql
     extension=mbstring
     extension=openssl
     ```

4. **Add to PATH**:
   - Search "Environment Variables" di Windows
   - Edit System PATH
   - Add: `C:\php`

5. **Install Composer**:
   - Download: https://getcomposer.org/Composer-Setup.exe
   - Run installer

6. **Restart Terminal** dan verify:
   ```bash
   php --version
   composer --version
   ```

---

## 🚀 After Installation

Setelah PHP terinstall, jalankan setup funding service:

```bash
cd "d:\S1 Sistem Informasi - Ekstensi\Semester 1\Intergrasi Aplikasi Enterprise\Tubes_Uas\AlumniConnect\alumni-connect-backend\services\funding-service"

# 1. Install dependencies
composer install

# 2. Copy .env
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Run migrations
php artisan migrate

# 5. Seed database
php artisan db:seed

# 6. Start server
php artisan serve --port=4003
```

---

## ⚠️ Troubleshooting

### Issue: "extension not loaded"
**Solution**: Pastikan extensions di `php.ini` sudah di-uncomment:
```ini
extension=pdo_pgsql
extension=pgsql
extension=mbstring
extension=openssl
```

### Issue: "composer not found"
**Solution**: Install Composer:
- Download: https://getcomposer.org/Composer-Setup.exe
- Run installer
- Restart terminal

### Issue: PostgreSQL connection error
**Solution**: 
1. Pastikan PostgreSQL running
2. Create database `alumni_funding`:
   ```sql
   CREATE DATABASE alumni_funding;
   ```
3. Update `.env` dengan credentials yang benar

---

## 📋 Quick Checklist

Setelah install, pastikan semua ini berfungsi:

- [ ] `php --version` shows PHP 8.1+
- [ ] `composer --version` shows Composer
- [ ] PostgreSQL running
- [ ] Database `alumni_funding` created
- [ ] Run `composer install` successfully
- [ ] Run `php artisan migrate` successfully
- [ ] Run `php artisan serve --port=4003` successfully

---

## 🎯 Recommended: Laragon

Untuk kemudahan, **saya rekomendasikan Laragon** karena:
- All-in-one (PHP + Composer + MySQL + PostgreSQL)
- Tidak perlu config PATH manual
- Built-in terminal
- Easy start/stop services
- Support multiple PHP versions

Download: https://laragon.org/download/

---

Setelah PHP terinstall, beritahu saya dan kita lanjutkan setup! 🚀
