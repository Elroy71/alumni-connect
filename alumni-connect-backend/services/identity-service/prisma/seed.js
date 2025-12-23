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
            slug: 'google-indonesia',
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
            slug: 'tokopedia',
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
            slug: 'gojek',
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
            slug: 'telkom-indonesia',
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
            slug: 'startup-abc',
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

    console.log('\n🎉 Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Jobs: ${jobs.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log('\n💡 Sample login credentials:');
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
