import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive database seed...');

    // ==================== CATEGORIES ====================
    console.log('📁 Seeding categories...');
    const categories = [
        { name: 'Karier', slug: 'karier', description: 'Diskusi seputar pengembangan karier dan tips profesional', icon: '💼', color: '#3B82F6' },
        { name: 'Teknologi', slug: 'teknologi', description: 'Berbagi pengetahuan tentang teknologi terbaru', icon: '💻', color: '#10B981' },
        { name: 'Networking', slug: 'networking', description: 'Membangun koneksi dengan sesama alumni', icon: '🤝', color: '#8B5CF6' },
        { name: 'Akademik', slug: 'akademik', description: 'Diskusi seputar pendidikan dan penelitian', icon: '🎓', color: '#F59E0B' },
        { name: 'Bisnis', slug: 'bisnis', description: 'Tips dan diskusi seputar dunia bisnis dan startup', icon: '📈', color: '#EC4899' },
        { name: 'Umum', slug: 'umum', description: 'Diskusi umum sesama alumni', icon: '💬', color: '#6B7280' }
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: category,
            create: category
        });
    }
    console.log('✅ Categories seeded');

    // ==================== SAMPLE USERS ====================
    console.log('👥 Seeding sample users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('SuperAdmin123!', 10);

    // Create Super Admin first
    console.log('🔐 Creating Super Admin...');
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@alumniconnect.com' },
        update: {},
        create: {
            email: 'superadmin@alumniconnect.com',
            password: hashedAdminPassword,
            role: 'SUPER_ADMIN',
            status: 'ACTIVE',
            profile: {
                create: {
                    fullName: 'Super Administrator',
                    bio: 'System Administrator - Full Access to AlumniConnect Platform',
                    currentCompany: 'AlumniConnect',
                    currentPosition: 'System Administrator'
                }
            }
        },
        include: { profile: true }
    });
    console.log('✅ Super Admin created');
    console.log('   📧 Email: superadmin@alumniconnect.com');
    console.log('   🔑 Password: SuperAdmin123!');

    const users = [
        {
            email: 'john.doe@alumni.telkomuniversity.ac.id',
            password: hashedPassword,
            role: 'ALUMNI',
            status: 'ACTIVE',
            profile: {
                fullName: 'John Doe',
                nim: '1234567',
                batch: '2018',
                major: 'Teknik Informatika',
                graduationYear: 2022,
                currentPosition: 'Senior Software Engineer',
                currentCompany: 'Google Indonesia',
                bio: 'Passionate software engineer dengan 3+ tahun pengalaman di bidang web development.',
                skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
                linkedinUrl: 'https://linkedin.com/in/johndoe',
                githubUrl: 'https://github.com/johndoe'
            }
        },
        {
            email: 'jane.smith@alumni.telkomuniversity.ac.id',
            password: hashedPassword,
            role: 'ALUMNI',
            status: 'ACTIVE',
            profile: {
                fullName: 'Jane Smith',
                nim: '1234568',
                batch: '2019',
                major: 'Sistem Informasi',
                graduationYear: 2023,
                currentPosition: 'Data Scientist',
                currentCompany: 'Tokopedia',
                bio: 'Data scientist yang antusias dengan machine learning dan AI.',
                skills: ['Python', 'TensorFlow', 'SQL', 'Tableau', 'R'],
                linkedinUrl: 'https://linkedin.com/in/janesmith'
            }
        },
        {
            email: 'ahmad.rizki@alumni.telkomuniversity.ac.id',
            password: hashedPassword,
            role: 'ALUMNI',
            status: 'ACTIVE',
            profile: {
                fullName: 'Ahmad Rizki',
                nim: '1234569',
                batch: '2017',
                major: 'Teknik Telekomunikasi',
                graduationYear: 2021,
                currentPosition: 'Product Manager',
                currentCompany: 'Gojek',
                bio: 'Product manager dengan pengalaman di fintech dan e-commerce.',
                skills: ['Product Management', 'Agile', 'UX Research', 'Data Analysis'],
                linkedinUrl: 'https://linkedin.com/in/ahmadrizki'
            }
        }
    ];

    const createdUsers = [];
    for (const userData of users) {
        const { profile, ...userFields } = userData;
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                ...userFields,
                profile: { create: profile }
            },
            include: { profile: true }
        });
        createdUsers.push(user);
    }
    console.log('✅ Users seeded');

    // ==================== COMPANIES ====================
    console.log('🏢 Seeding companies...');
    const companies = [
        {
            name: 'Google Indonesia',
            description: 'Google adalah perusahaan teknologi multinasional Amerika yang mengkhususkan diri dalam layanan dan produk terkait Internet.',
            website: 'https://google.com',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/240px-Google_2015_logo.svg.png',
            industry: 'Technology',
            size: '10000+',
            location: 'Jakarta, Indonesia',
            founded: 1998
        },
        {
            name: 'Tokopedia',
            description: 'Tokopedia adalah salah satu marketplace terbesar di Indonesia.',
            website: 'https://tokopedia.com',
            logo: 'https://ecs7.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/eb7574d8.png',
            industry: 'E-Commerce',
            size: '5000-10000',
            location: 'Jakarta, Indonesia',
            founded: 2009
        },
        {
            name: 'Gojek',
            description: 'Gojek adalah perusahaan teknologi Indonesia yang menyediakan layanan transportasi dan pembayaran digital.',
            website: 'https://gojek.com',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Gojek_logo_2022.svg/240px-Gojek_logo_2022.svg.png',
            industry: 'Technology',
            size: '5000-10000',
            location: 'Jakarta, Indonesia',
            founded: 2010
        },
        {
            name: 'Telkom Indonesia',
            description: 'PT Telkom Indonesia adalah perusahaan BUMN yang bergerak di bidang telekomunikasi.',
            website: 'https://telkom.co.id',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Telkom_Indonesia.svg/240px-Telkom_Indonesia.svg.png',
            industry: 'Telecommunications',
            size: '10000+',
            location: 'Bandung, Indonesia',
            founded: 1991
        },
        {
            name: 'Startup ABC',
            description: 'Startup inovatif di bidang fintech yang didirikan oleh alumni Telkom University.',
            website: 'https://startupABC.id',
            industry: 'Fintech',
            size: '50-200',
            location: 'Bandung, Indonesia',
            founded: 2022
        }
    ];

    const createdCompanies = [];
    for (const company of companies) {
        // Check if company exists by name
        const existing = await prisma.company.findFirst({ where: { name: company.name } });
        if (existing) {
            createdCompanies.push(existing);
        } else {
            const created = await prisma.company.create({ data: company });
            createdCompanies.push(created);
        }
    }
    console.log('✅ Companies seeded');

    // ==================== JOBS ====================
    console.log('💼 Seeding jobs...');
    const jobs = [
        {
            postedBy: createdUsers[0].id,
            companyId: createdCompanies[0].id,
            title: 'Senior Frontend Developer',
            description: 'Kami mencari Senior Frontend Developer yang berpengalaman untuk bergabung dengan tim Google Indonesia. Anda akan bekerja pada produk-produk Google yang digunakan oleh jutaan pengguna.',
            requirements: '- 5+ tahun pengalaman di frontend development\n- Expert di React atau Vue.js\n- Familiar dengan TypeScript\n- Pengalaman dengan unit testing',
            responsibilities: '- Mengembangkan fitur baru untuk produk Google\n- Code review dan mentoring junior developer\n- Berkolaborasi dengan tim design',
            type: 'FULL_TIME',
            level: 'SENIOR',
            location: 'Jakarta, Indonesia',
            isRemote: true,
            salaryMin: 25000000,
            salaryMax: 45000000,
            salaryCurrency: 'IDR',
            skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Testing'],
            benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Free Lunch'],
            isActive: true
        },
        {
            postedBy: createdUsers[1].id,
            companyId: createdCompanies[1].id,
            title: 'Data Analyst',
            description: 'Tokopedia mencari Data Analyst untuk membantu tim dalam menganalisis data penjualan dan perilaku pengguna.',
            requirements: '- 2+ tahun pengalaman sebagai data analyst\n- Mahir SQL dan Python\n- Familiar dengan tools visualisasi seperti Tableau',
            responsibilities: '- Analisis data harian\n- Membuat dashboard dan reporting\n- Berkolaborasi dengan product team',
            type: 'FULL_TIME',
            level: 'MID',
            location: 'Jakarta, Indonesia',
            isRemote: false,
            salaryMin: 12000000,
            salaryMax: 20000000,
            salaryCurrency: 'IDR',
            skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
            benefits: ['Health Insurance', 'Gym Membership', 'Training Budget'],
            isActive: true
        },
        {
            postedBy: createdUsers[2].id,
            companyId: createdCompanies[2].id,
            title: 'Junior Mobile Developer',
            description: 'Gojek membuka lowongan untuk Junior Mobile Developer yang ingin belajar dan berkembang di lingkungan startup.',
            requirements: '- Fresh graduate atau 1 tahun pengalaman\n- Familiar dengan Flutter atau React Native\n- Memiliki portfolio aplikasi mobile',
            responsibilities: '- Mengembangkan fitur mobile app\n- Bug fixing\n- Belajar dari senior developer',
            type: 'FULL_TIME',
            level: 'JUNIOR',
            location: 'Jakarta, Indonesia',
            isRemote: true,
            salaryMin: 8000000,
            salaryMax: 12000000,
            salaryCurrency: 'IDR',
            skills: ['Flutter', 'Dart', 'React Native', 'Mobile Development'],
            benefits: ['Health Insurance', 'Learning Budget', 'Flexible Hours'],
            isActive: true
        },
        {
            postedBy: createdUsers[0].id,
            companyId: createdCompanies[3].id,
            title: 'Network Engineer',
            description: 'Telkom Indonesia mencari Network Engineer untuk mengelola infrastruktur jaringan perusahaan.',
            requirements: '- 3+ tahun pengalaman di networking\n- Sertifikasi CCNA/CCNP\n- Familiar dengan Cisco dan Juniper',
            responsibilities: '- Mengelola infrastruktur jaringan\n- Troubleshooting network issues\n- Planning dan implementasi network expansion',
            type: 'FULL_TIME',
            level: 'MID',
            location: 'Bandung, Indonesia',
            isRemote: false,
            salaryMin: 15000000,
            salaryMax: 25000000,
            salaryCurrency: 'IDR',
            skills: ['Cisco', 'Networking', 'CCNA', 'Linux', 'Security'],
            benefits: ['Health Insurance', 'Pension Plan', 'Training'],
            isActive: true
        },
        {
            postedBy: createdUsers[1].id,
            companyId: createdCompanies[4].id,
            title: 'Backend Developer Intern',
            description: 'Startup ABC membuka program internship untuk mahasiswa yang tertarik di bidang backend development.',
            requirements: '- Mahasiswa semester akhir\n- Familiar dengan Node.js atau Python\n- Motivated dan eager to learn',
            responsibilities: '- Membantu tim development\n- Belajar best practices\n- Mengerjakan project kecil',
            type: 'INTERNSHIP',
            level: 'ENTRY',
            location: 'Bandung, Indonesia',
            isRemote: true,
            salaryMin: 2000000,
            salaryMax: 4000000,
            salaryCurrency: 'IDR',
            skills: ['Node.js', 'Python', 'Git', 'REST API'],
            benefits: ['Certificate', 'Mentoring', 'Flexible Hours'],
            isActive: true
        }
    ];

    for (const job of jobs) {
        await prisma.job.create({ data: job });
    }
    console.log('✅ Jobs seeded');

    // ==================== FORUM POSTS ====================
    console.log('📝 Seeding forum posts...');
    const karierCategory = await prisma.category.findUnique({ where: { slug: 'karier' } });
    const teknologiCategory = await prisma.category.findUnique({ where: { slug: 'teknologi' } });
    const networkingCategory = await prisma.category.findUnique({ where: { slug: 'networking' } });

    const posts = [
        {
            userId: createdUsers[0].id,
            categoryId: karierCategory.id,
            title: 'Tips Sukses Interview di Big Tech Company',
            content: `Halo teman-teman alumni! Saya ingin berbagi pengalaman dan tips untuk interview di perusahaan teknologi besar.

1. **Persiapan Teknis**
   - Pelajari data structures dan algorithms secara mendalam
   - Practice di LeetCode minimal 2-3 bulan sebelum interview
   - Pahami system design untuk posisi senior

2. **Behavioral Interview**
   - Siapkan cerita-cerita STAR method
   - Research budaya perusahaan
   - Tunjukkan passion dan growth mindset

3. **Tips Umum**
   - Mock interview dengan teman atau mentor
   - Jaga kesehatan dan istirahat cukup
   - Be confident but humble

Semoga bermanfaat! Feel free to ask jika ada pertanyaan.`,
            excerpt: 'Berbagi pengalaman dan tips untuk interview di perusahaan teknologi besar seperti Google, Facebook, dan lainnya.',
            status: 'PUBLISHED',
            views: 150
        },
        {
            userId: createdUsers[1].id,
            categoryId: teknologiCategory.id,
            title: 'Trend Teknologi 2024 yang Perlu Dipelajari',
            content: `Beberapa teknologi yang sedang trending dan worth to learn di 2024:

🔥 **Artificial Intelligence & Machine Learning**
- Large Language Models (LLM)
- Computer Vision
- MLOps

☁️ **Cloud & Infrastructure**
- Kubernetes
- Serverless Architecture
- Edge Computing

🔐 **Security**
- Zero Trust Architecture
- DevSecOps
- Blockchain

💻 **Development**
- Rust Programming Language
- WebAssembly
- GraphQL Federation

Yang mana yang teman-teman paling tertarik untuk dipelajari?`,
            excerpt: 'Trend teknologi 2024 yang perlu dipelajari untuk tetap relevan di industri.',
            status: 'PUBLISHED',
            views: 89
        },
        {
            userId: createdUsers[2].id,
            categoryId: networkingCategory.id,
            title: 'Yuk Kopdar Alumni Telkom University Bandung!',
            content: `Halo rekan-rekan alumni!

Kami berencana mengadakan gathering untuk alumni Telkom University yang berdomisili di Bandung dan sekitarnya.

📅 **Rencana Acara:**
- Tanggal: Sabtu, Minggu ke-2 bulan depan
- Tempat: TBD (masih mencari venue yang nyaman)
- Agenda: Networking, sharing session, dan makan-makan 😄

🎯 **Tujuan:**
- Mempererat silaturahmi antar alumni
- Sharing pengalaman karier
- Membuka peluang kolaborasi

Siapa yang berminat ikut? Please comment di bawah ya!
Boleh juga kasih saran venue yang bagus.

Sampai jumpa! 🎉`,
            excerpt: 'Rencana gathering alumni Telkom University di Bandung untuk networking dan sharing.',
            status: 'PUBLISHED',
            views: 234
        }
    ];

    for (const post of posts) {
        await prisma.post.create({ data: post });
    }
    console.log('✅ Posts seeded');

    // ==================== EVENTS ====================
    console.log('📅 Seeding events...');

    // Create dates for events (future dates from now)
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    const twoWeeks = new Date(now);
    twoWeeks.setDate(now.getDate() + 14);

    const threeWeeks = new Date(now);
    threeWeeks.setDate(now.getDate() + 21);

    const oneMonth = new Date(now);
    oneMonth.setMonth(now.getMonth() + 1);

    const twoMonths = new Date(now);
    twoMonths.setMonth(now.getMonth() + 2);

    const events = [
        {
            organizerId: createdUsers[0].id, // John Doe
            title: 'Tech Talk: Building Scalable Microservices with Node.js',
            description: `Join us for an exciting tech talk about building scalable microservices architecture using Node.js and modern DevOps practices.

📋 What You'll Learn:
- Microservices architecture patterns
- Service discovery and API Gateway
- Containerization with Docker
- CI/CD best practices
- Monitoring and logging strategies

🎯 Who Should Attend:
Backend developers, DevOps engineers, and anyone interested in modern cloud-native architectures.

👨‍🏫 Speaker:
John Doe - Senior Software Engineer at Google Indonesia with 5+ years experience in distributed systems.`,
            type: 'WEBINAR',
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
            startDate: nextWeek,
            endDate: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
            location: 'Online via Zoom',
            isOnline: true,
            meetingUrl: 'https://zoom.us/j/123456789',
            capacity: 100,
            currentAttendees: 0,
            price: 0,
            currency: 'IDR',
            tags: ['Technology', 'Microservices', 'Node.js', 'DevOps'],
            requirements: 'Basic understanding of backend development and JavaScript',
            agenda: `14:00 - 14:15 | Opening & Introduction
14:15 - 15:00 | Microservices Architecture Overview
15:00 - 15:15 | Break
15:15 - 16:00 | Hands-on Demo: Building Your First Microservice
16:00 - 16:30 | Q&A Session`,
            speakers: JSON.stringify([
                { name: 'John Doe', title: 'Senior Software Engineer', company: 'Google Indonesia', photo: 'https://i.pravatar.cc/150?u=john' }
            ])
        },
        {
            organizerId: createdUsers[1].id, // Jane Smith
            title: 'Workshop: Data Science & Machine Learning for Beginners',
            description: `Hands-on workshop untuk memulai karier di bidang Data Science dan Machine Learning. Cocok untuk pemula!

🎓 Materi Workshop:
- Introduction to Data Science
- Python for Data Analysis (Pandas, NumPy)
- Data Visualization dengan Matplotlib & Seaborn
- Machine Learning Basics dengan Scikit-learn
- Real-world Case Study

💻 Requirements:
Laptop dengan Python 3.8+ installed
No prior experience needed!

🎁 Bonus:
- Certificate of completion
- Workshop materials & code
- 1 month mentoring access`,
            type: 'WORKSHOP',
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
            startDate: twoWeeks,
            endDate: new Date(twoWeeks.getTime() + 4 * 60 * 60 * 1000), // 4 hours
            location: 'Telkom University, Bandung',
            isOnline: false,
            capacity: 50,
            currentAttendees: 0,
            price: 150000,
            currency: 'IDR',
            tags: ['Data Science', 'Machine Learning', 'Python', 'Workshop'],
            requirements: 'Laptop with Python installed',
            agenda: `09:00 - 09:30 | Registration & Setup
09:30 - 10:30 | Introduction to Data Science
10:30 - 12:00 | Python for Data Analysis
12:00 - 13:00 | Lunch Break
13:00 - 14:30 | Data Visualization
14:30 - 16:00 | Machine Learning Basics
16:00 - 17:00 | Case Study & Q&A`,
            speakers: JSON.stringify([
                { name: 'Jane Smith', title: 'Data Scientist', company: 'Tokopedia', photo: 'https://i.pravatar.cc/150?u=jane' }
            ])
        },
        {
            organizerId: createdUsers[2].id, // Ahmad Rizki
            title: 'Alumni Reunion 2025 - Telkom University',
            description: `Saatnya berkumpul kembali dengan teman-teman alumni! 🎉

Acara reuni tahunan alumni Telkom University dengan tema "Reconnect, Reminisce, Rebuild".

🎊 Agenda Acara:
- Gathering & Photo Session
- Makan malam bersama
- Sharing session dari alumni sukses
- Games & door prizes
- Live music performance
- Networking session

👔 Dress Code: Smart Casual

🎁 Setiap peserta akan mendapat:
- Welcome kit
- Commemorative photo
- Dinner voucher
- Alumni merchandise

Ajak teman-teman seangkatan kalian! Kuota terbatas.`,
            type: 'REUNION',
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
            startDate: oneMonth,
            endDate: new Date(oneMonth.getTime() + 5 * 60 * 60 * 1000), // 5 hours
            location: 'Grand Ballroom - Hotel Hilton Bandung',
            isOnline: false,
            capacity: 200,
            currentAttendees: 0,
            price: 250000,
            currency: 'IDR',
            tags: ['Reunion', 'Networking', 'Alumni', 'Social'],
            requirements: 'Alumni Telkom University',
            agenda: `17:00 - 18:00 | Registration & Welcome Drink
18:00 - 19:00 | Opening Ceremony & Photo Session
19:00 - 20:30 | Dinner & Entertainment
20:30 - 21:30 | Sharing Session
21:30 - 22:00 | Networking & Closing`,
            speakers: JSON.stringify([
                { name: 'Ahmad Rizki', title: 'Product Manager', company: 'Gojek', photo: 'https://i.pravatar.cc/150?u=ahmad' }
            ])
        },
        {
            organizerId: createdUsers[0].id,
            title: 'Seminar: Career Development in Tech Industry',
            description: `Seminar nasional tentang pengembangan karier di industri teknologi. Menghadirkan para praktisi dari perusahaan teknologi terkemuka.

🎯 Tema:
"Navigating Your Tech Career: From Junior to Leadership"

🎤 Speakers:
- Engineering Manager dari Gojek
- Senior Product Manager dari Tokopedia  
- Tech Lead dari Google Indonesia
- CTO dari Startup Unicorn

💡 Topik yang Dibahas:
✅ Career path di industri tech
✅ Skills yang dibutuhkan untuk naik level
✅ Transisi dari IC ke management
✅ Building personal brand
✅ Salary negotiation tips

📚 Benefit:
- E-certificate
- Networking opportunity
- Career consultation session
- Seminar materials`,
            type: 'SEMINAR',
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            startDate: threeWeeks,
            endDate: new Date(threeWeeks.getTime() + 3 * 60 * 60 * 1000),
            location: 'Online via Zoom',
            isOnline: true,
            meetingUrl: 'https://zoom.us/j/987654321',
            capacity: 500,
            currentAttendees: 0,
            price: 50000,
            currency: 'IDR',
            tags: ['Career', 'Technology', 'Seminar', 'Professional Development'],
            requirements: 'Open for all',
            agenda: `13:00 - 13:15 | Opening
13:15 - 14:00 | Session 1: Career Path in Tech
14:00 - 14:45 | Session 2: Essential Skills
14:45 - 15:00 | Break
15:00 - 15:45 | Session 3: Leadership Journey
15:45 - 16:30 | Panel Discussion & Q&A`,
            speakers: JSON.stringify([
                { name: 'John Doe', title: 'Senior Engineer', company: 'Google', photo: 'https://i.pravatar.cc/150?u=john' },
                { name: 'Jane Smith', title: 'Data Scientist', company: 'Tokopedia', photo: 'https://i.pravatar.cc/150?u=jane' },
                { name: 'Ahmad Rizki', title: 'Product Manager', company: 'Gojek', photo: 'https://i.pravatar.cc/150?u=ahmad' }
            ])
        },
        {
            organizerId: createdUsers[1].id,
            title: 'Networking Night: Tech Professionals Meetup',
            description: `Casual networking event untuk para profesional di bidang teknologi. Perfect untuk expand your network! 🤝

🍕 Format Acara:
- Casual networking dengan snacks & drinks
- Lightning talks (5 menit per speaker)
- Speed networking session
- Open discussion tables

👥 Who Should Come:
- Software Engineers
- Product Managers
- Data Scientists
- UX/UI Designers
- Tech Entrepreneurs
- Anyone in tech industry

🎁 Why Attend:
✨ Meet like-minded professionals
✨ Share experiences & insights
✨ Discover new opportunities
✨ Build meaningful connections
✨ Have fun!

Dress code: Come as you are (casual)`,
            type: 'NETWORKING',
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
            startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000)),
            location: 'The Social House, Jakarta Selatan',
            isOnline: false,
            capacity: 80,
            currentAttendees: 0,
            price: 100000,
            currency: 'IDR',
            tags: ['Networking', 'Technology', 'Meetup', 'Professional'],
            requirements: 'Working in tech industry or tech enthusiast',
            agenda: `18:00 - 18:30 | Registration & Welcome Drink
18:30 - 19:00 | Ice Breaking Activities
19:00 - 20:00 | Lightning Talks
20:00 - 21:00 | Speed Networking
21:00 - 22:00 | Open Networking & Snacks`,
            speakers: JSON.stringify([])
        },
        {
            organizerId: superAdmin.id,
            title: 'Indonesia Tech Conference 2025',
            description: `Konferensi teknologi terbesar tahun ini! Menghadirkan 50+ speakers dari berbagai perusahaan teknologi.

🚀 Conference Highlights:

📊 4 Parallel Tracks:
1. Software Engineering
2. Data & AI
3. Product & Design
4. DevOps & Cloud

🎤 Keynote Speakers:
- CTO Gojek
- VP Engineering Tokopedia
- Head of AI Google Indonesia
- Founders dari startup unicorn

💼 What's Included:
✅ Access to all sessions (40+ talks)
✅ Networking lunch & coffee breaks
✅ Conference kit & merchandise
✅ Certificate of attendance
✅ Access to recorded sessions
✅ Career fair with 20+ companies

🎯 Perfect For:
Developers, data scientists, product managers, designers, tech leads, CTOs, and tech enthusiasts.

Limited early bird tickets available!`,
            type: 'CONFERENCE',
            status: 'PUBLISHED',
            coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
            startDate: twoMonths,
            endDate: new Date(twoMonths.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
            location: 'Jakarta Convention Center',
            isOnline: false,
            capacity: 1000,
            currentAttendees: 0,
            price: 500000,
            currency: 'IDR',
            tags: ['Conference', 'Technology', 'Innovation', 'Networking'],
            requirements: 'Conference ticket (Early bird, Regular, or VIP)',
            agenda: `Day 1:
08:00 - 09:00 | Registration
09:00 - 10:00 | Opening Keynote
10:00 - 12:00 | Morning Sessions (4 tracks)
12:00 - 13:00 | Lunch & Networking
13:00 - 17:00 | Afternoon Sessions
17:00 - 18:00 | Networking Party

Day 2:
09:00 - 10:00 | Keynote Session
10:00 - 12:00 | Morning Sessions
12:00 - 13:00 | Lunch
13:00 - 16:00 | Afternoon Sessions
16:00 - 17:00 | Closing & Prize Draw`,
            speakers: JSON.stringify([
                { name: 'John Doe', title: 'Senior Engineer', company: 'Google', photo: 'https://i.pravatar.cc/150?u=john' },
                { name: 'Jane Smith', title: 'Data Scientist', company: 'Tokopedia', photo: 'https://i.pravatar.cc/150?u=jane' },
                { name: 'Ahmad Rizki', title: 'Product Manager', company: 'Gojek', photo: 'https://i.pravatar.cc/150?u=ahmad' }
            ])
        }
    ];

    for (const event of events) {
        await prisma.event.create({ data: event });
    }
    console.log('✅ Events seeded');

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Users: ${users.length + 1} (including Super Admin)`);
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Jobs: ${jobs.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Events: ${events.length}`);
    console.log('\n💡 Login credentials:');
    console.log('\n   🔐 SUPER ADMIN:');
    console.log('   Email: superadmin@alumniconnect.com');
    console.log('   Password: SuperAdmin123!');
    console.log('\n   👤 ALUMNI USER:');
    console.log('   Email: john.doe@alumni.telkomuniversity.ac.id');
    console.log('   Password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
