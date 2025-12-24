import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function addMoreSeedData() {
    try {
        console.log('🌱 Adding more seed data...');

        // Get existing users
        const users = await prisma.user.findMany({
            where: { role: 'ALUMNI' },
            include: { profile: true }
        });

        if (users.length === 0) {
            console.log('❌ No alumni users found. Run main seed first.');
            return;
        }

        console.log(`Found ${users.length} alumni users`);

        // ==================== MORE EVENTS ====================
        console.log('📅 Adding more events...');

        const events = [
            {
                title: 'Workshop: Web Development dengan React',
                description: `Workshop intensif 2 hari untuk belajar React dari dasar hingga mahir. Cocok untuk alumni yang ingin upgrade skill di frontend development.

Materi yang akan dipelajari:
- React Fundamentals & Hooks
- State Management dengan Redux
- API Integration
- Best Practices & Performance

Fasilitas:
- Sertifikat
- Modul pembelajaran
- Akses grup alumni
- Lunch & Coffee Break`,
                type: 'WORKSHOP',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-02-15T09:00:00'),
                endDate: new Date('2024-02-16T17:00:00'),
                location: 'Telkom University, Gedung Bangkit Lt. 3',
                isOnline: false,
                capacity: 50,
                coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                organizerId: users[0].id
            },
            {
                title: 'Tech Talk: Future of AI in Indonesia',
                description: `Diskusi interaktif dengan praktisi AI terkemuka di Indonesia. Membahas perkembangan dan peluang karir di bidang Artificial Intelligence.

Pembicara:
- Dr. Ahmad Rizki (Google AI Research)
- Sarah Putri (Gojek ML Engineer)
- Budi Santoso (Tokopedia Data Scientist)

Topics:
- Current AI landscape in Indonesia
- Career opportunities in AI/ML
- Required skills and learning path
- Q&A Session`,
                type: 'SEMINAR',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-02-20T14:00:00'),
                endDate: new Date('2024-02-20T17:00:00'),
                location: 'Online via Zoom',
                isOnline: true,
                capacity: 200,
                coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                organizerId: users[1]?.id || users[0].id
            },
            {
                title: 'Alumni Gathering Jakarta 2024',
                description: `Acara gathering tahunan alumni Telkom University wilayah Jakarta dan sekitarnya. Mari kita pererat tali silaturahmi!

Agenda:
- Networking session
- Sharing pengalaman karir
- Fun games & doorprize
- Makan malam bersama

Dresscode: Smart Casual

FREE untuk semua alumni!`,
                type: 'NETWORKING',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-03-05T18:00:00'),
                endDate: new Date('2024-03-05T22:00:00'),
                location: 'Sheraton Grand Jakarta, Ballroom',
                isOnline: false,
                capacity: 150,
                coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
                organizerId: users[2]?.id || users[0].id
            },
            {
                title: 'Bootcamp: Mobile App Development',
                description: `Bootcamp intensif 1 minggu untuk mempelajari pengembangan aplikasi mobile dengan Flutter. Dari nol hingga publish app ke Play Store!

Yang akan dipelajari:
- Flutter basics & Dart programming
- UI/UX design principles
- State management (Provider, Bloc)
- Firebase integration
- App deployment

Bonus:
- 1 on 1 mentoring
- Career guidance
- Portfolio project
- Job referral program`,
                type: 'WORKSHOP',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-03-10T09:00:00'),
                endDate: new Date('2024-03-15T17:00:00'),
                location: 'Hybrid (Online & Offline)',
                isOnline: true,
                capacity: 30,
                coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
                organizerId: users[0].id
            },
            {
                title: 'Career Fair: Tech Companies 2024',
                description: `Job fair khusus untuk alumni dengan 20+ perusahaan teknologi terkemuka. Kesempatan emas untuk mendapatkan pekerjaan impian!

Perusahaan yang ikut:
- Google Indonesia
- Tokopedia
- Gojek
- Shopee
- Microsoft
- Dan banyak lagi!

On the spot interview tersedia!

Tips: Bawa CV dan portfolio Anda!`,
                type: 'SEMINAR',
                status: 'PENDING_APPROVAL',
                startDate: new Date('2024-03-25T10:00:00'),
                endDate: new Date('2024-03-25T16:00:00'),
                location: 'JCC Senayan, Hall B',
                isOnline: false,
                capacity: 500,
                coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
                organizerId: users[1]?.id || users[0].id
            }
        ];

        for (const event of events) {
            await prisma.event.create({ data: event });
        }
        console.log(`✅ Added ${events.length} events`);

        // ==================== MORE CAMPAIGNS ====================
        console.log('💰 Adding more campaigns...');

        const campaigns = [
            {
                title: 'Bantuan Pendidikan untuk Mahasiswa Kurang Mampu',
                description: `Mari bantu adik-adik kita yang berprestasi namun terkendala biaya. Dana yang terkumpul akan digunakan untuk:

📚 Biaya kuliah semester
📖 Buku dan alat tulis
💻 Laptop untuk pembelajaran
🍽️ Biaya hidup selama kuliah

Target: 10 mahasiswa berprestasi

Setiap donasi Anda sangat berarti untuk masa depan mereka!`,
                category: 'EDUCATION',
                goalAmount: 50000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-04-30'),
                coverImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
                creatorId: users[0].id
            },
            {
                title: 'Pembangunan Lab Komputer untuk Sekolah Daerah Terpencil',
                description: `Membangun lab komputer untuk sekolah di daerah terpencil agar siswa dapat belajar teknologi.

Rincian penggunaan dana:
💻 20 unit komputer: Rp 60.000.000
🖥️ Peralatan jaringan: Rp 10.000.000
⚡ Instalasi listrik: Rp 5.000.000
📚 Software dan lisensi: Rp 5.000.000

Total target: Rp 80.000.000

Mari bersama membuka akses pendidikan teknologi untuk semua!`,
                category: 'TECHNOLOGY',
                goalAmount: 80000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-05-31'),
                coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
                creatorId: users[1]?.id || users[0].id
            },
            {
                title: 'Beasiswa Riset untuk Alumni Berprestasi',
                description: `Program beasiswa untuk alumni yang ingin melanjutkan riset di bidang teknologi.

Benefits:
🎓 Dana riset
📊 Akses ke lab dan peralatan
👨‍🏫 Mentoring dari dosen senior
📝 Publikasi internasional

Kriteria:
- Alumni aktif
- Proposal riset yang jelas
- Komitmen penuh waktu

Investasi untuk inovasi teknologi Indonesia!`,
                category: 'RESEARCH',
                goalAmount: 100000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-06-30'),
                coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
                creatorId: users[2]?.id || users[0].id
            },
            {
                title: 'Startup Incubator untuk Mahasiswa',
                description: `Membangun program inkubator startup untuk mendukung mahasiswa yang ingin berwirausaha di bidang teknologi.

Program meliputi:
🚀 Seed funding awal
💼 Co-working space
👥 Mentoring dari founder berpengalaman
📈 Business development support
🌐 Network dengan investor

Target: 5 startup tahun pertama

Dukung generasi entrepreneur Indonesia!`,
                category: 'BUSINESS',
                goalAmount: 150000000,
                currentAmount: 0,
                status: 'PENDING_APPROVAL',
                endDate: new Date('2024-07-31'),
                coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
                creatorId: users[0].id
            }
        ];

        for (const campaign of campaigns) {
            await prisma.campaign.create({ data: campaign });
        }
        console.log(`✅ Added ${campaigns.length} campaigns`);

        // ==================== MORE FORUM POSTS ====================
        console.log('💬 Adding more forum posts...');

        const categories = await prisma.category.findMany();
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.slug] = cat.id;
        });

        const posts = [
            {
                userId: users[0].id,
                categoryId: categoryMap['teknologi'],
                title: 'Perbandingan Framework Frontend: React vs Vue vs Angular',
                content: `Sebagai developer yang sudah mencoba ketiga framework ini, saya ingin share pengalaman dan perbandingan:

**React:**
✅ Ecosystem terbesar
✅ Job opportunities banyak
✅ Fleksibel
❌ Learning curve agak tinggi
❌ Perlu banyak library tambahan

**Vue:**
✅ Mudah dipelajari
✅ Documentation excellent
✅ Progressive framework
❌ Ecosystem lebih kecil
❌ Job opportunities lebih sedikit

**Angular:**
✅ Complete solution
✅ Enterprise ready
✅ TypeScript by default
❌ Berat dan kompleks
❌ Learning curve paling tinggi

**Kesimpulan:**
Untuk pemula: Vue
Untuk job market: React
Untuk enterprise: Angular

Kalian pakai yang mana? Share pengalaman kalian!`,
                excerpt: 'Perbandingan detail antara React, Vue, dan Angular berdasarkan pengalaman nyata.',
                status: 'PUBLISHED',
                views: 234
            },
            {
                userId: users[1]?.id || users[0].id,
                categoryId: categoryMap['karier'],
                title: 'Cara Negosiasi Gaji: Tips dari HR Professional',
                content: `Sebagai alumni yang sekarang kerja di HR, mau share tips negosiasi gaji:

**Sebelum Interview:**
1. Research salary range untuk posisi & lokasi
2. Kenali nilai Anda (skills, experience, education)
3. Tentukan target range (ideal & minimal acceptable)

**Saat Interview:**
1. Jangan sebut angka duluan, biarkan company offer
2. Kalau ditanya expected salary, berikan range
3. Fokus pada value yang bisa Anda berikan

**Saat Negosiasi:**
1. Berterima kasih atas offer
2. Sampaikan expectation dengan data pendukung
3. Diskusikan benefit lain (bonus, training, WFH)
4. Professional & respectful

**Red Flags:**
❌ Company yang defensive saat ditanya salary
❌ Tidak transparan tentang benefit
❌ Pressure untuk terima offer immediately

**Contoh kalimat:**
"Thank you for the offer. Based on my research and experience in X, I was hoping for a range of Y-Z. Is there room for discussion?"

Semoga membantu! Ada yang mau ditanya?`,
                excerpt: 'Tips profesional untuk negosiasi gaji dari perspektif HR.',
                status: 'PUBLISHED',
                views: 456
            },
            {
                userId: users[2]?.id || users[0].id,
                categoryId: categoryMap['networking'],
                title: 'Mencari Co-Founder untuk Startup EdTech',
                content: `Halo teman-teman alumni! 🚀

Saya sedang develop platform EdTech dan mencari co-founder:

**About the Project:**
Platform pembelajaran online untuk SD-SMA dengan AI personalization

**Stage:**
MVP sudah jadi, ada 100+ early users

**Looking for:**
- CTO/Tech Lead (fullstack)
- Marketing/Growth Hacker

**What I offer:**
- Equity share
- Potential seed funding (in discussion)
- Freedom to innovate
- Impact on education

**Required:**
- Passionate tentang education
- Ready for full commitment
- Based in Bandung (preferable)

Interested? DM atau comment!

#startup #edtech #cofounder`,
                excerpt: 'Mencari co-founder untuk startup EdTech yang sudah punya MVP dan users.',
                status: 'PUBLISHED',
                views: 178
            },
            {
                userId: users[0].id,
                categoryId: categoryMap['bisnis'],
                title: 'Pengalaman Freelancing: Pro & Kontra',
                content: `Sudah 2 tahun saya full-time freelancer, mau share pengalaman:

**Kelebihan:**
✅ Fleksibilitas waktu & lokasi
✅ Income potential lebih tinggi
✅ Pilih project yang disukai
✅ Work-life balance lebih baik
✅ Belajar banyak skill baru

**Kekurangan:**
❌ Income tidak stabil
❌ Harus cari client sendiri
❌ Tidak ada benefit (BPJS, THR, etc)
❌ Lonely, tidak ada team
❌ Harus manage semua sendiri

**Tips Sukses:**
1. Build portfolio kuat
2. Network sebanyak mungkin
3. Kelola keuangan dengan baik
4. Siapkan emergency fund 6-12 bulan
5. Join community untuk support

**Platform yang saya pakai:**
- Upwork (international)
- Projects.co.id (lokal)
- Sribulancer (lokal)
- Direct clients dari referral

**Income benchmark:**
Pemula: 5-15 juta/bulan
Intermediate: 15-30 juta/bulan
Expert: 30-100+ juta/bulan

Worth it? YES, kalau Anda:
- Self-disciplined
- Good at communication
- Can handle uncertainty

AMA!`,
                excerpt: 'Pengalaman 2 tahun menjadi freelancer full-time dengan tips dan income benchmark.',
                status: 'PUBLISHED',
                views: 567
            },
            {
                userId: users[1]?.id || users[0].id,
                categoryId: categoryMap['akademik'],
                title: 'Lanjut S2? Di Dalam atau Luar Negeri?',
                content: `Banyak yang tanya tentang lanjut S2, ini pengalaman saya:

**S2 dalam negeri:**
Pros:
✅ Biaya lebih murah
✅ Dekat keluarga
✅ Network lokal kuat
✅ Bisa sambil kerja

Cons:
❌ Less international exposure
❌ Research facilities terbatas
❌ Publikasi internasional lebih susah

**S2 luar negeri:**
Pros:
✅ Quality education
✅ International network
✅ Career opportunities global
✅ Life experience

Cons:
❌ Mahal (unless beasiswa)
❌ Jauh dari keluarga
❌ Culture shock
❌ Harus full-time

**Beasiswa yang available:**
- LPDP (dalam/luar negeri)
- Chevening (UK)
- Fulbright (US)
- DAAD (Germany)
- Erasmus+ (Europe)

**Rekomendasi:**
Kalau fokus industry: S2 dalam negeri sambil kerja
Kalau fokus research/academia: S2 luar negeri

Investasi? DEFINITELY YES!
ROI dari S2 bukan cuma dari gaji tapi dari:
- Network
- Knowledge
- Perspective
- Opportunities

Yang udah S2 share dong pengalamannya!`,
                excerpt: 'Perbandingan dan tips lanjut S2 dalam negeri vs luar negeri.',
                status: 'PUBLISHED',
                views: 389
            }
        ];

        for (const post of posts) {
            await prisma.post.create({ data: post });
        }
        console.log(`✅ Added ${posts.length} forum posts`);

        console.log('\n🎉 Additional seed data added successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Events: ${events.length} (all PENDING_APPROVAL)`);
        console.log(`   - Campaigns: ${campaigns.length} (all PENDING_APPROVAL)`);
        console.log(`   - Posts: ${posts.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

addMoreSeedData();
