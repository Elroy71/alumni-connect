# 🎓 Alumni Connect - Telkom University

Platform terintegrasi untuk menghubungkan alumni Telkom University dengan berbagai fitur seperti Forum, Job Board, Event Management, dan Crowdfunding.

## 🚀 Tech Stack

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web Framework
- **Apollo Server 4** - GraphQL Server
- **Prisma ORM 5** - Database ORM
- **PostgreSQL 14+** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS 3** - Styling
- **Apollo Client 3** - GraphQL Client
- **Zustand** - State Management
- **React Router 6** - Routing
- **Lucide React** - Icons

## 📁 Project Structure
```
AlumniConnect/
├── apps/
│   └── backend/
│       └── services/
│           └── identity-service/
│               ├── prisma/
│               │   └── schema.prisma
│               ├── src/
│               │   ├── modules/
│               │   │   ├── auth/
│               │   │   ├── profile/
│               │   │   ├── forum/
│               │   │   ├── job/
│               │   │   ├── event/
│               │   │   └── funding/
│               │   ├── graphql/
│               │   │   ├── typeDefs.js
│               │   │   └── resolvers.js
│               │   └── server.js
│               └── package.json
│
└── alumni-connect-frontend/
    ├── src/
    │   ├── components/
    │   ├── features/
    │   ├── pages/
    │   ├── layouts/
    │   ├── graphql/
    │   └── App.jsx
    └── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Backend Setup
```bash
cd apps/backend/services/identity-service

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan database credentials

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

### Frontend Setup
```bash
cd alumni-connect-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/alumni_connect"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=4001
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4001/graphql
```

## 📚 Features

### ✅ Completed Features

1. **Authentication & Profile**
   - Register & Login
   - Profile Management
   - Alumni Card Generation (with QR Code)

2. **Forum System**
   - Create, Read, Update, Delete Posts
   - Nested Comments & Replies
   - Like Posts & Comments
   - Category & Tags

3. **Job Board**
   - Post & Browse Jobs
   - Apply for Jobs
   - Save Jobs
   - Company Profiles
   - Application Tracking

4. **Event Management**
   - Create & Browse Events
   - RSVP/Register Events
   - Capacity Management
   - Online/Offline Events

5. **Crowdfunding**
   - Create Campaigns
   - Donate to Campaigns
   - Campaign Progress Tracking
   - Donation History

6. **Dashboard**
   - Real-time Statistics
   - Quick Actions
   - Recent Activity
   - My Applications
   - My Events
   - My Donations

## 🔑 Default Credentials

**Super Admin:**
- Email: admin@telkomuniversity.ac.id
- Password: admin123

**Test User:**
- Email: alumni@telkomuniversity.ac.id
- Password: alumni123

## 📖 API Documentation

GraphQL Playground available at: `http://localhost:4001/graphql`

### Main Queries
```graphql
# Get current user
query {
  me {
    id
    email
    profile {
      fullName
    }
  }
}

# Get posts
query {
  posts(filter: { limit: 10 }) {
    posts {
      id
      title
      content
    }
  }
}

# Get jobs
query {
  jobs(filter: { limit: 10 }) {
    jobs {
      id
      title
      company {
        name
      }
    }
  }
}
```

### Main Mutations
```graphql
# Login
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
    }
  }
}

# Create Post
mutation {
  createPost(input: {
    title: "Hello World"
    content: "My first post"
    categoryId: "uuid"
  }) {
    id
    title
  }
}
```

## 🧪 Testing
```bash
# Backend tests
cd apps/backend/services/identity-service
npm test

# Frontend tests
cd alumni-connect-frontend
npm test
```

## 🚢 Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Build
npm run build

# Start production
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Preview
npm run preview
```

## 📝 Database Schema

### Main Models

- **User** - User accounts
- **Profile** - User profiles
- **Post** - Forum posts
- **Comment** - Post comments
- **Job** - Job listings
- **Application** - Job applications
- **Event** - Events
- **Registration** - Event registrations
- **Campaign** - Funding campaigns
- **Donation** - Campaign donations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer** - Full Stack Development
- **Telkom University** - Project Sponsor

## 📞 Support

For support, email: support@alumniconnect.com

---

**Made with ❤️ for Telkom University Alumni**