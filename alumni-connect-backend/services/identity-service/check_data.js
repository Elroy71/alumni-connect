import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
    console.log('🔍 Checking database data...\n');

    try {
        const categoriesCount = await prisma.category.count();
        const usersCount = await prisma.user.count();
        const companiesCount = await prisma.company.count();
        const jobsCount = await prisma.job.count();
        const postsCount = await prisma.post.count();
        const eventsCount = await prisma.event.count();

        console.log('📊 Data Summary:');
        console.log(`   ✅ Categories: ${categoriesCount}`);
        console.log(`   ✅ Users: ${usersCount}`);
        console.log(`   ✅ Companies: ${companiesCount}`);
        console.log(`   ✅ Jobs: ${jobsCount}`);
        console.log(`   ✅ Posts: ${postsCount}`);
        console.log(`   ✅ Events: ${eventsCount}`);

        console.log('\n👥 Sample Users:');
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                profile: {
                    select: {
                        fullName: true
                    }
                }
            },
            take: 5
        });
        users.forEach(user => {
            console.log(`   - ${user.profile?.fullName || 'No Name'} (${user.email}) - ${user.role}`);
        });

        console.log('\n🏢 Companies:');
        const companies = await prisma.company.findMany({
            select: {
                name: true,
                industry: true,
                location: true
            }
        });
        companies.forEach(company => {
            console.log(`   - ${company.name} (${company.industry}) - ${company.location}`);
        });

        console.log('\n💼 Jobs:');
        const jobs = await prisma.job.findMany({
            select: {
                title: true,
                company: {
                    select: {
                        name: true
                    }
                },
                type: true,
                level: true
            },
            take: 5
        });
        jobs.forEach(job => {
            console.log(`   - ${job.title} at ${job.company?.name || 'Unknown'} (${job.type}, ${job.level})`);
        });

        console.log('\n✅ Data berhasil masuk ke database!\n');
    } catch (error) {
        console.error('❌ Error checking data:', error);
    }
}

checkData()
    .finally(async () => {
        await prisma.$disconnect();
    });
