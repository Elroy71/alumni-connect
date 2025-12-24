import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function cleanAndSeed() {
    try {
        console.log('🧹 Cleaning database...');

        // Delete in correct order (respect foreign keys)
        await prisma.like.deleteMany();
        await prisma.comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.donation.deleteMany();
        await prisma.campaign.deleteMany();
        await prisma.event.deleteMany();
        await prisma.savedJob.deleteMany();
        await prisma.application.deleteMany();
        await prisma.job.deleteMany();
        await prisma.company.deleteMany();
        await prisma.category.deleteMany();
        await prisma.profile.deleteMany();
        await prisma.user.deleteMany();

        console.log('✅ Database cleaned');

        console.log('\n🌱 Starting comprehensive database seed...');

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

        const createdCategories = await prisma.category.createMany({ data: categories });
        console.log(`✅ ${categories.length} categories seeded`);

        // ==================== USERS ====================
        console.log('\n👥 Seeding users...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const hashedAdminPassword = await bcrypt.hash('SuperAdmin123!', 10);

        // Super Admin
        const superAdmin = await prisma.user.create({
            data: {
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
            }
        });

        // Alumni Users
        const users = [
            {
                email: 'john.doe@alumni.telkomuniversity.ac.id',
                password: hashedPassword,
                role: 'ALUMNI',
                status: 'ACTIVE',
                profile: {
                    create: {
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
                }
            },
            {
                email: 'jane.smith@alumni.telkomuniversity.ac.id',
                password: hashedPassword,
                role: 'ALUMNI',
                status: 'ACTIVE',
                profile: {
                    create: {
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
                }
            },
            {
                email: 'ahmad.rizki@alumni.telkomuniversity.ac.id',
                password: hashedPassword,
                role: 'ALUMNI',
                status: 'ACTIVE',
                profile: {
                    create: {
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
            }
        ];

        const createdUsers = [];
        for (const userData of users) {
            const user = await prisma.user.create({
                data: userData,
                include: { profile: true }
            });
            createdUsers.push(user);
        }
        console.log(`✅ 1 Super Admin + ${createdUsers.length} alumni users seeded`);

        // ==================== COMPANIES ====================
        console.log('\n🏢 Seeding companies...');
        const companies = [
            {
                name: 'Google Indonesia',
                slug: 'google-indonesia',
                description: 'Google adalah perusahaan teknologi multinasional Amerika.',
                website: 'https://google.com',
                industry: 'Technology',
                size: '10000+',
                location: 'Jakarta, Indonesia'
            },
            {
                name: 'Tokopedia',
                slug: 'tokopedia',
                description: 'Salah satu marketplace terbesar di Indonesia.',
                website: 'https://tokopedia.com',
                industry: 'E-Commerce',
                size: '5000-10000',
                location: 'Jakarta, Indonesia'
            },
            {
                name: 'Gojek',
                slug: 'gojek',
                description: 'Perusahaan teknologi Indonesia penyedia layanan transportasi dan pembayaran digital.',
                website: 'https://gojek.com',
                industry: 'Technology',
                size: '5000-10000',
                location: 'Jakarta, Indonesia'
            }
        ];

        const createdCompanies = await prisma.company.createMany({ data: companies });
        const companiesData = await prisma.company.findMany();
        console.log(`✅ ${companies.length} companies seeded`);

        // ==================== JOBS ====================
        console.log('\n💼 Seeding jobs...');
        const jobs = [
            {
                postedBy: createdUsers[0].id,
                companyId: companiesData[0].id,
                title: 'Senior Frontend Developer',
                description: 'Mencari Senior Frontend Developer berpengalaman untuk bergabung dengan tim Google Indonesia.',
                requirements: '5+ tahun pengalaman di frontend development, Expert di React',
                responsibilities: 'Mengembangkan fitur baru, Code review, Mentoring junior developer',
                type: 'FULL_TIME',
                level: 'SENIOR',
                location: 'Jakarta, Indonesia',
                isRemote: true,
                salaryMin: 25000000,
                salaryMax: 45000000,
                salaryCurrency: 'IDR',
                skills: ['React', 'TypeScript', 'JavaScript'],
                benefits: ['Health Insurance', 'Remote Work'],
                isActive: true
            },
            {
                postedBy: createdUsers[1].id,
                companyId: companiesData[1].id,
                title: 'Data Analyst',
                description: 'Tokopedia mencari Data Analyst untuk analisis data penjualan.',
                requirements: '2+ tahun pengalaman sebagai data analyst, Mahir SQL dan Python',
                responsibilities: 'Analisis data harian, Membuat dashboard',
                type: 'FULL_TIME',
                level: 'MID',
                location: 'Jakarta, Indonesia',
                isRemote: false,
                salaryMin: 12000000,
                salaryMax: 20000000,
                salaryCurrency: 'IDR',
                skills: ['SQL', 'Python', 'Tableau'],
                benefits: ['Health Insurance', 'Gym Membership'],
                isActive: true
            },
            {
                postedBy: createdUsers[2].id,
                companyId: companiesData[2].id,
                title: 'Junior Mobile Developer',
                description: 'Gojek membuka lowongan untuk Junior Mobile Developer.',
                requirements: 'Fresh graduate atau 1 tahun pengalaman, Familiar dengan Flutter',
                responsibilities: 'Mengembangkan fitur mobile app, Bug fixing',
                type: 'FULL_TIME',
                level: 'JUNIOR',
                location: 'Jakarta, Indonesia',
                isRemote: true,
                salaryMin: 8000000,
                salaryMax: 12000000,
                salaryCurrency: 'IDR',
                skills: ['Flutter', 'Dart'],
                benefits: ['Health Insurance', 'Learning Budget'],
                isActive: true
            }
        ];

        await prisma.job.createMany({ data: jobs });
        console.log(`✅ ${jobs.length} jobs seeded`);

        // ==================== FORUM POSTS ====================
        console.log('\n📝 Seeding forum posts...');
        const karierCat = await prisma.category.findUnique({ where: { slug: 'karier' } });
        const teknologiCat = await prisma.category.findUnique({ where: { slug: 'teknologi' } });
        const networkingCat = await prisma.category.findUnique({ where: { slug: 'networking' } });

        const posts = [
            {
                userId: createdUsers[0].id,
                categoryId: karierCat.id,
                title: 'Tips Sukses Interview di Big Tech Company',
                content: `Halo teman-teman alumni! Saya ingin berbagi pengalaman dan tips untuk interview di perusahaan teknologi besar.

**Persiapan Teknis:**
- Pelajari data structures dan algorithms secara mendalam
- Practice di LeetCode minimal 2-3 bulan sebelum interview
- Pahami system design untuk posisi senior

**Behavioral Interview:**
- Siapkan cerita-cerita STAR method
- Research budaya perusahaan

Semoga bermanfaat!`,
                excerpt: 'Berbagi pengalaman dan tips untuk interview di perusahaan teknologi besar.',
                status: 'PUBLISHED',
                views: 150
            },
            {
                userId: createdUsers[1].id,
                categoryId: teknologiCat.id,
                title: 'Trend Teknologi 2024 yang Perlu Dipelajari',
                content: `Beberapa teknologi yang sedang trending di 2024:

🔥 **AI & Machine Learning**
- Large Language Models
- Computer Vision

☁️ **Cloud & Infrastructure**
- Kubernetes
- Serverless Architecture

Yang mana yang teman-teman paling tertarik?`,
                excerpt: 'Trend teknologi 2024 yang perlu dipelajari untuk tetap relevan.',
                status: 'PUBLISHED',
                views: 89
            },
            {
                userId: createdUsers[2].id,
                categoryId: networkingCat.id,
                title: 'Yuk Kopdar Alumni Telkom University Bandung!',
                content: `Halo rekan-rekan alumni!

Kami berencana mengadakan gathering untuk alumni Telkom University.

📅 **Rencana Acara:**
- Tanggal: Sabtu, Minggu ke-2 bulan depan
- Tempat: TBD
- Agenda: Networking, sharing session

Siapa yang berminat ikut? Please comment di bawah ya!`,
                excerpt: 'Rencana gathering alumni Telkom University di Bandung.',
                status: 'PUBLISHED',
                views: 234
            }
        ];

        await prisma.post.createMany({ data: posts });
        console.log(`✅ ${posts.length} posts seeded`);

        // ==================== EVENTS (PENDING) ====================
        console.log('\n📅 Seeding events (PENDING_APPROVAL)...');
        const events = [
            {
                title: 'Workshop: Web Development dengan React',
                description: 'Workshop intensif 2 hari untuk belajar React dari dasar hingga mahir.',
                type: 'WORKSHOP',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-02-15T09:00:00'),
                endDate: new Date('2024-02-16T17:00:00'),
                location: 'Telkom University, Gedung Bangkit Lt. 3',
                isOnline: false,
                capacity: 50,
                organizerId: createdUsers[0].id
            },
            {
                title: 'Tech Talk: Future of AI in Indonesia',
                description: 'Diskusi interaktif dengan praktisi AI terkemuka di Indonesia.',
                type: 'SEMINAR',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-02-20T14:00:00'),
                endDate: new Date('2024-02-20T17:00:00'),
                location: 'Online via Zoom',
                isOnline: true,
                capacity: 200,
                organizerId: createdUsers[1].id
            },
            {
                title: 'Alumni Gathering Jakarta 2024',
                description: 'Acara gathering tahunan alumni Telkom University wilayah Jakarta.',
                type: 'NETWORKING',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-03-05T18:00:00'),
                endDate: new Date('2024-03-05T22:00:00'),
                location: 'Sheraton Grand Jakarta, Ballroom',
                isOnline: false,
                capacity: 150,
                organizerId: createdUsers[2].id
            }
        ];

        await prisma.event.createMany({ data: events });
        console.log(`✅ ${events.length} events seeded (all PENDING_APPROVAL)`);

        // ==================== CAMPAIGNS (PENDING) ====================
        console.log('\n💰 Seeding campaigns (PENDING_APPROVAL)...');
        const campaigns = [
            {
                title: 'Bantuan Pendidikan untuk Mahasiswa Kurang Mampu',
                description: 'Mari bantu adik-adik kita yang berprestasi namun terkendala biaya.',
                category: 'EDUCATION',
                goalAmount: 50000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-04-30'),
                creatorId: createdUsers[0].id
            },
            {
                title: 'Pembangunan Lab Komputer untuk Sekolah Daerah Terpencil',
                description: 'Membangun lab komputer untuk sekolah di daerah terpencil.',
                category: 'TECHNOLOGY',
                goalAmount: 80000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-05-31'),
                creatorId: createdUsers[1].id
            },
            {
                title: 'Beasiswa Riset untuk Alumni Berprestasi',
                description: 'Program beasiswa untuk alumni yang ingin melanjutkan riset di bidang teknologi.',
                category: 'RESEARCH',
                goalAmount: 100000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-06-30'),
                creatorId: createdUsers[2].id
            }
        ];

        await prisma.campaign.createMany({ data: campaigns });
        console.log(`✅ ${campaigns.length} campaigns seeded (all PENDING_APPROVAL)`);

        console.log('\n🎉 Database seed completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - 1 Super Admin + ${createdUsers.length} Alumni Users`);
        console.log(`   - ${categories.length} Categories`);
        console.log(`   - ${companies.length} Companies`);
        console.log(`   - ${jobs.length} Jobs`);
        console.log(`   - ${posts.length} Forum Posts`);
        console.log(`   - ${events.length} Events (PENDING_APPROVAL)`);
        console.log(`   - ${campaigns.length} Campaigns (PENDING_APPROVAL)`);
        console.log('\n💡 Login Credentials:');
        console.log('\n   🔐 SUPER ADMIN:');
        console.log('   Email: superadmin@alumniconnect.com');
        console.log('   Password: SuperAdmin123!');
        console.log('\n   👤 ALUMNI USER:');
        console.log('   Email: john.doe@alumni.telkomuniversity.ac.id');
        console.log('   Password: password123');

    } catch (error) {
        console.error('❌ Seed error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

cleanAndSeed();
