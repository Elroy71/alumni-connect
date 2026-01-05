# 🎓 Alumni Connect - Telkom University

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org/)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)](https://php.net/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)

> Platform terintegrasi untuk menghubungkan alumni Telkom University dengan berbagai fitur seperti Forum, Job Board, Event Management, dan Crowdfunding.

## 📋 Daftar Isi

- [Overview](#-overview)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Fitur Aplikasi](#-fitur-aplikasi)
- [Project Structure](#-project-structure)
- [Installation](#️-installation)
- [Docker Deployment](#-docker-deployment)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Default Credentials](#-default-credentials)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**AlumniConnect** adalah platform berbasis web yang dirancang untuk memfasilitasi komunikasi dan kolaborasi antara alumni Telkom University. Platform ini dibangun menggunakan **arsitektur microservices** dengan **polyglot programming** (Node.js, Python, PHP) dan menggunakan **GraphQL** sebagai protokol API.

### Mengapa AlumniConnect?

| Masalah | Solusi |
|---------|--------|
| Konektivitas alumni terbatas setelah lulus | Forum diskusi & networking |
| Kesulitan mencari lowongan dari sesama alumni | Job Board eksklusif |
| Tidak ada platform terpusat untuk event | Event Management System |
| Kesulitan koordinasi crowdfunding | Platform Funding terintegrasi |

---

## 🏗 Arsitektur Sistem

AlumniConnect menggunakan **arsitektur microservices** dengan API Gateway pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                      │
│              Apollo Client | Zustand | Tailwind CSS             │
└─────────────────────────────┬───────────────────────────────────┘
                              │ GraphQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express.js)                     │
│                         Port: 4000                              │
│              Query-based Routing to Microservices               │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  IDENTITY        │ │  EVENT           │ │  FUNDING         │
│  SERVICE         │ │  SERVICE         │ │  SERVICE         │
│                  │ │                  │ │                  │
│  🟢 Node.js      │ │  🐍 Python       │ │  🐘 PHP          │
│  Apollo Server   │ │  FastAPI         │ │  Laravel         │
│  Prisma ORM      │ │  Strawberry      │ │  Lighthouse      │
│  Port: 4001      │ │  Port: 4002      │ │  Port: 4003      │
│                  │ │                  │ │                  │
│  ├─ Auth         │ │  ├─ Events       │ │  ├─ Campaigns    │
│  ├─ Profile      │ │  └─ Registration │ │  └─ Donations    │
│  ├─ Forum        │ │                  │ │                  │
│  └─ Jobs         │ │                  │ │                  │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                  ┌─────────────────────┐
                  │    PostgreSQL 15    │
                  │     Port: 5432      │
                  └─────────────────────┘
```

### Keunggulan Arsitektur:

- ✅ **Polyglot Programming** - Menggunakan bahasa terbaik untuk setiap domain
- ✅ **Independent Scaling** - Setiap service dapat di-scale secara independen
- ✅ **Fault Isolation** - Kegagalan satu service tidak mempengaruhi service lain
- ✅ **Technology Flexibility** - Mudah mengganti/upgrade teknologi per service
- ✅ **Team Autonomy** - Tim dapat bekerja independen per service

---

## 🚀 Tech Stack

### Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18 | UI Library |
| Vite | 5 | Build Tool & Dev Server |
| Tailwind CSS | 3 | Utility-first CSS Framework |
| Apollo Client | 3 | GraphQL Client & State Management |
| Zustand | 4 | Global State Management |
| React Router | 6 | Client-side Routing |
| Lucide React | - | Icon Components |

### Backend Services

| Service | Bahasa | Framework | ORM/Database | Port |
|---------|--------|-----------|--------------|------|
| API Gateway | Node.js 18 | Express.js | - | 4000 |
| Identity Service | Node.js 18 | Apollo Server 4 | Prisma 5 | 4001 |
| Event Service | Python 3.11 | FastAPI + Strawberry | SQLAlchemy | 4002 |
| Funding Service | PHP 8.2 | Laravel + Lighthouse | Eloquent | 4003 |

### Infrastructure

| Komponen | Teknologi |
|----------|-----------|
| Database | PostgreSQL 15 |
| Authentication | JWT (JSON Web Token) |
| Password Hashing | bcryptjs |
| Containerization | Docker & Docker Compose |

---

## 📚 Fitur Aplikasi

### 1. 🔐 Authentication & Profile

| Fitur | Deskripsi |
|-------|-----------|
| Register & Login | Autentikasi dengan email & password |
| JWT Token | Secure token-based authentication |
| Profile Management | Kelola informasi profil lengkap |
| Profile Photo & Cover | Upload foto profil & banner |
| Experience & Education | Riwayat pekerjaan & pendidikan |
| Skills & Achievements | Keahlian dengan endorsement |
| Alumni Card | Generate kartu alumni digital dengan QR Code |

### 2. 💬 Forum System

| Fitur | Deskripsi |
|-------|-----------|
| Create/Edit/Delete Posts | CRUD postingan lengkap |
| Nested Comments | Komentar bersarang (replies) |
| Like System | Like untuk post & comment |
| Categories | Kategori topik diskusi |
| Tags | Pengelompokan konten |
| Rich Content | Support media & formatting |

### 3. 💼 Job Board

| Fitur | Deskripsi |
|-------|-----------|
| Post Jobs | Alumni dapat posting lowongan |
| Browse & Search | Filter berdasarkan kriteria |
| Job Application | Melamar langsung dari platform |
| Save Jobs | Simpan lowongan favorit |
| Application Tracking | Lacak status lamaran |
| Company Profiles | Profil perusahaan lengkap |

**Job Types:** Full-time, Part-time, Contract, Internship, Freelance

**Job Levels:** Entry, Junior, Mid, Senior, Lead, Manager, Director

### 4. 🎉 Event Management

| Fitur | Deskripsi |
|-------|-----------|
| Create Events | Buat event dengan detail lengkap |
| RSVP/Register | Daftar ke event |
| Capacity Management | Manajemen kuota peserta |
| Online/Offline | Support event virtual & fisik |
| Admin Approval | Event perlu approval admin |
| Cancel Registration | Batalkan pendaftaran |

**Event Types:** Webinar, Workshop, Meetup, Reunion, Seminar, Networking, Conference

### 5. 💰 Crowdfunding

| Fitur | Deskripsi |
|-------|-----------|
| Create Campaigns | Buat campaign penggalangan dana |
| Donate | Donasi ke campaign |
| Progress Tracking | Pantau progress penggalangan |
| Campaign Updates | Update perkembangan campaign |
| Donation History | Riwayat donasi |
| Admin Approval | Campaign perlu approval admin |

**Campaign Categories:** Scholarship, Social, Research, Startup, Community

### 6. 📊 Dashboard

| Fitur | Deskripsi |
|-------|-----------|
| Statistics | Statistik real-time |
| Quick Actions | Aksi cepat |
| My Applications | Lamaran saya |
| My Events | Event yang diikuti |
| My Donations | Riwayat donasi |
| Recent Activity | Aktivitas terbaru |

### 7. 👨‍💼 Admin Panel

| Fitur | Deskripsi |
|-------|-----------|
| User Management | Kelola pengguna |
| Event Approval | Approve/Reject event |
| Campaign Approval | Approve/Reject campaign |
| Content Moderation | Moderasi konten |
| Statistics Dashboard | Dashboard statistik admin |

---

## 📁 Project Structure

```
AlumniConnect/
├── 📁 alumni-connect-frontend/          # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/               # Reusable components
│   │   │   ├── 📁 Admin/
│   │   │   ├── 📁 Profile/
│   │   │   ├── 📁 event/
│   │   │   ├── 📁 forum/
│   │   │   ├── 📁 funding/
│   │   │   ├── 📁 job/
│   │   │   ├── 📁 layout/
│   │   │   └── 📁 ui/
│   │   ├── 📁 features/                 # Feature modules
│   │   ├── 📁 graphql/                  # GraphQL queries & mutations
│   │   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── 📁 layouts/                  # Layout components
│   │   ├── 📁 pages/                    # Page components
│   │   │   ├── 📁 Admin/
│   │   │   └── 📁 dashboard/
│   │   ├── 📁 styles/                   # Global styles
│   │   └── App.jsx                      # Main App component
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── 📁 alumni-connect-backend/
│   └── 📁 services/
│       │
│       ├── 📁 api-gateway/              # 🟢 Node.js API Gateway
│       │   ├── server.js                # Gateway routing logic
│       │   ├── Dockerfile
│       │   └── package.json
│       │
│       ├── 📁 identity-service/         # 🟢 Node.js Identity Service
│       │   ├── 📁 prisma/
│       │   │   └── schema.prisma        # Database schema
│       │   ├── 📁 src/
│       │   │   ├── 📁 modules/
│       │   │   │   ├── 📁 auth/
│       │   │   │   ├── 📁 profile/
│       │   │   │   ├── 📁 forum/
│       │   │   │   └── 📁 job/
│       │   │   ├── 📁 graphql/
│       │   │   └── server.js
│       │   ├── Dockerfile
│       │   └── package.json
│       │
│       ├── 📁 event-service/            # 🐍 Python Event Service
│       │   ├── 📁 app/
│       │   │   ├── 📁 graphql/
│       │   │   ├── 📁 models/
│       │   │   └── main.py
│       │   ├── requirements.txt
│       │   └── Dockerfile
│       │
│       └── 📁 funding-service/          # 🐘 PHP Funding Service
│           ├── 📁 app/
│           │   ├── 📁 GraphQL/
│           │   └── 📁 Models/
│           ├── 📁 graphql/
│           │   └── schema.graphql
│           ├── 📁 database/
│           ├── composer.json
│           └── Dockerfile
│
├── docker-compose.yml                   # Docker orchestration
└── README.md
```

---

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- Python 3.11+
- PHP 8.2+ with Composer
- PostgreSQL 15+
- npm atau yarn

### Option 1: Manual Setup

#### 1. Clone Repository
```bash
git clone https://github.com/username/alumni-connect.git
cd alumni-connect
```

#### 2. Setup Database
```bash
# Create PostgreSQL database
createdb alumni_connect
```

#### 3. Setup Identity Service (Node.js)
```bash
cd alumni-connect-backend/services/identity-service

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start server
npm run dev
```

#### 4. Setup Event Service (Python)
```bash
cd alumni-connect-backend/services/event-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Start server
uvicorn app.main:app --reload --port 4002
```

#### 5. Setup Funding Service (PHP)
```bash
cd alumni-connect-backend/services/funding-service

# Install dependencies
composer install

# Setup environment
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Start server
php artisan serve --port=4003
```

#### 6. Setup API Gateway
```bash
cd alumni-connect-backend/services/api-gateway

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start server
npm run dev
```

#### 7. Setup Frontend
```bash
cd alumni-connect-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

### Option 2: Docker Deployment (Recommended)

Lihat bagian [Docker Deployment](#-docker-deployment) di bawah.

---

## 🐳 Docker Deployment

### Quick Start

```bash
# Clone repository
git clone https://github.com/username/alumni-connect.git
cd alumni-connect

# Build dan jalankan semua services
docker-compose up --build
```

### Services & Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| API Gateway | 4000 | http://localhost:4000 |
| Identity Service | 4001 | http://localhost:4001 |
| Event Service | 4002 | http://localhost:4002 |
| Funding Service | 4003 | http://localhost:4003 |
| PostgreSQL | 5432 | localhost:5432 |

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up -d --build identity-service

# View running containers
docker-compose ps
```

---

## 🌐 Environment Variables

### API Gateway (.env)
```env
PORT=4000
NODE_SERVICE_URL=http://localhost:4001/graphql
PYTHON_SERVICE_URL=http://localhost:4002/graphql
PHP_SERVICE_URL=http://localhost:4003/graphql
CORS_ORIGIN=http://localhost:5173
```

### Identity Service (.env)
```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/alumni_connect?schema=identity_schema"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=4001
```

### Event Service (.env)
```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/alumni_connect"
JWT_SECRET="your-super-secret-jwt-key"
SERVICE_PORT=4002
NODE_SERVICE_URL=http://localhost:4001/graphql
```

### Funding Service (.env)
```env
APP_NAME=FundingService
APP_ENV=local
APP_KEY=base64:your-app-key
APP_DEBUG=true
APP_URL=http://localhost:4003

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=alumni_connect
DB_USERNAME=postgres
DB_PASSWORD=root

JWT_SECRET=your-super-secret-jwt-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

---

## 📖 API Documentation

### GraphQL Endpoint

API Gateway: `http://localhost:4000/graphql`

### Sample Queries

```graphql
# Get current user with profile
query GetMe {
  me {
    id
    email
    role
    profile {
      fullName
      nim
      major
      graduationYear
      profileImage
    }
  }
}

# Get forum posts
query GetPosts {
  posts(filter: { limit: 10 }) {
    posts {
      id
      title
      content
      author {
        profile {
          fullName
        }
      }
      likesCount
      commentsCount
    }
    total
  }
}

# Get jobs
query GetJobs {
  jobs(filter: { type: FULL_TIME, limit: 10 }) {
    jobs {
      id
      title
      company {
        name
        logo
      }
      location
      salary
      type
      level
    }
    total
  }
}

# Get events
query GetEvents {
  events(filter: { type: WEBINAR, status: PUBLISHED }) {
    events {
      id
      title
      startDate
      endDate
      capacity
      registeredCount
      isOnline
    }
  }
}

# Get campaigns
query GetCampaigns {
  campaigns(filter: { status: ACTIVE }) {
    campaigns {
      id
      title
      goalAmount
      currentAmount
      endDate
      category
    }
  }
}
```

### Sample Mutations

```graphql
# Login
mutation Login {
  login(input: {
    email: "alumni@telkomuniversity.ac.id"
    password: "alumni123"
  }) {
    token
    user {
      id
      email
      role
    }
  }
}

# Register
mutation Register {
  register(input: {
    email: "newuser@example.com"
    password: "password123"
    fullName: "John Doe"
    nim: "1234567890"
    major: "Sistem Informasi"
    graduationYear: 2023
  }) {
    token
    user {
      id
      email
    }
  }
}

# Create post
mutation CreatePost {
  createPost(input: {
    title: "Hello Alumni!"
    content: "This is my first post"
    categoryId: "category-uuid"
  }) {
    id
    title
  }
}

# Apply for job
mutation ApplyJob {
  applyForJob(input: {
    jobId: "job-uuid"
    coverLetter: "I am interested in this position..."
  }) {
    id
    status
  }
}

# Register for event
mutation RegisterEvent {
  registerForEvent(eventId: "event-uuid") {
    id
    status
  }
}

# Donate to campaign
mutation Donate {
  donateToCampaign(input: {
    campaignId: "campaign-uuid"
    amount: 100000
    message: "Good luck!"
  }) {
    id
    amount
  }
}
```

---

## 📝 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     1:1     ┌─────────────┐
│    USER     │────────────▶│   PROFILE   │
│             │             │             │
│  - id       │             │  - fullName │
│  - email    │             │  - nim      │
│  - password │             │  - major    │
│  - role     │             │  - photo    │
└──────┬──────┘             └──────┬──────┘
       │                           │
       │ 1:N                       │ 1:N
       ▼                           ▼
┌─────────────┐             ┌─────────────┐
│    POST     │             │ EXPERIENCE  │
│   COMMENT   │             │  EDUCATION  │
│    LIKE     │             │    SKILL    │
└─────────────┘             └─────────────┘

       │ 1:N                       │ 1:N
       ▼                           ▼
┌─────────────┐             ┌─────────────┐
│    JOB      │             │    EVENT    │
│ APPLICATION │             │REGISTRATION │
│  SAVED_JOB  │             └─────────────┘
└─────────────┘
                                   │ 1:N
                                   ▼
                            ┌─────────────┐
                            │  CAMPAIGN   │
                            │  DONATION   │
                            └─────────────┘
```

### Main Models

| Model | Deskripsi | Service |
|-------|-----------|---------|
| User | Akun pengguna | Identity |
| Profile | Profil lengkap user | Identity |
| Experience | Riwayat pekerjaan | Identity |
| Education | Riwayat pendidikan | Identity |
| Skill | Keahlian | Identity |
| Post | Forum post | Identity |
| Comment | Komentar post | Identity |
| Like | Like post/comment | Identity |
| Category | Kategori forum | Identity |
| Tag | Tag post | Identity |
| Job | Lowongan kerja | Identity |
| Company | Perusahaan | Identity |
| Application | Lamaran kerja | Identity |
| SavedJob | Job tersimpan | Identity |
| Event | Event alumni | Event |
| Registration | Pendaftaran event | Event |
| Campaign | Campaign funding | Funding |
| Donation | Donasi | Funding |

---

## 📸 Screenshots

> *Screenshots akan ditambahkan*

### Landing Page
*Hero section dengan fitur utama*

### Dashboard
*Dashboard user dengan statistik*

### Forum
*Halaman forum diskusi*

### Job Board
*List lowongan kerja*

### Events
*Halaman event management*

### Funding
*Halaman crowdfunding*

### Admin Panel
*Dashboard admin*

---

## 🔑 Default Credentials

### Super Admin
```
Email: admin@telkomuniversity.ac.id
Password: admin123
```

### Test User (Alumni)
```
Email: alumni@telkomuniversity.ac.id
Password: alumni123
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Code Style
- Frontend: ESLint + Prettier
- Backend (Node.js): ESLint
- Backend (Python): Black + isort
- Backend (PHP): PSR-12

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

| Role | Responsibility |
|------|----------------|
| Full Stack Developer | Frontend & Backend Development |
| Telkom University | Project Sponsor |

---

## 📞 Support

For support and questions:
- 📧 Email: support@alumniconnect.com
- 🐛 Issues: [GitHub Issues](https://github.com/username/alumni-connect/issues)

---

## 🙏 Acknowledgments

- Telkom University
- Dosen Pembimbing Mata Kuliah Integrasi Aplikasi Enterprise
- Open Source Community

---

<p align="center">
  <b>Made with ❤️ for Telkom University Alumni</b>
  <br/>
  <sub>© 2024 AlumniConnect. All rights reserved.</sub>
</p>
