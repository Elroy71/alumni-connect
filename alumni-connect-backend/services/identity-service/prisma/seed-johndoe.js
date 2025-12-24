import prisma from '../src/config/database.js';

async function seedJohnDoeProfile() {
    console.log('🌱 Seeding profile sections for john.doe@alumni.telkomuniversity.ac.id...');

    // Find the specific user
    const user = await prisma.user.findUnique({
        where: { email: 'john.doe@alumni.telkomuniversity.ac.id' },
        include: { profile: true }
    });

    if (!user) {
        console.log('❌ User john.doe@alumni.telkomuniversity.ac.id not found');
        return;
    }

    if (!user.profile) {
        console.log('❌ User has no profile');
        return;
    }

    console.log(`✅ Found user: ${user.profile.fullName}`);

    // Delete existing data first
    await prisma.experience.deleteMany({ where: { profileId: user.profile.id } });
    await prisma.education.deleteMany({ where: { profileId: user.profile.id } });
    await prisma.skill.deleteMany({ where: { profileId: user.profile.id } });
    await prisma.achievement.deleteMany({ where: { profileId: user.profile.id } });

    console.log('🗑️  Cleared existing profile sections');

    // Add Experiences
    await prisma.experience.createMany({
        data: [
            {
                profileId: user.profile.id,
                title: 'Senior Software Engineer',
                company: 'Tech Innovations Indonesia',
                location: 'Jakarta, Indonesia',
                employmentType: 'Full-time',
                startDate: new Date('2022-01-01'),
                isCurrentJob: true,
                description: 'Leading development of microservices architecture and mentoring junior developers. Building scalable systems using Node.js, React, and PostgreSQL.'
            },
            {
                profileId: user.profile.id,
                title: 'Full Stack Developer',
                company: 'StartUp Digital',
                location: 'Bandung, Indonesia',
                employmentType: 'Full-time',
                startDate: new Date('2020-06-01'),
                endDate: new Date('2021-12-31'),
                isCurrentJob: false,
                description: 'Developed and maintained web applications using MERN stack. Collaborated with cross-functional teams to deliver high-quality products.'
            }
        ]
    });
    console.log(`✅ Added 2 experiences`);

    // Add Education
    await prisma.education.createMany({
        data: [
            {
                profileId: user.profile.id,
                institution: 'Telkom University',
                degree: 'S1 - Bachelor',
                fieldOfStudy: 'Sistem Informasi',
                startDate: new Date('2016-08-01'),
                endDate: new Date('2020-07-01'),
                isCurrentStudy: false,
                grade: '3.80',
                description: 'Focus on software engineering, database systems, and web development. Active in student organizations and tech communities.'
            },
            {
                profileId: user.profile.id,
                institution: 'SMA Negeri 1 Bandung',
                degree: 'SMA',
                fieldOfStudy: 'IPA',
                startDate: new Date('2013-07-01'),
                endDate: new Date('2016-06-01'),
                isCurrentStudy: false,
                grade: '91.5'
            }
        ]
    });
    console.log(`✅ Added 2 education records`);

    // Add Skills
    const skills = [
        { name: 'React.js', level: 'Expert', yearsOfExperience: 5 },
        { name: 'Node.js', level: 'Expert', yearsOfExperience: 5 },
        { name: 'TypeScript', level: 'Advanced', yearsOfExperience: 4 },
        { name: 'PostgreSQL', level: 'Advanced', yearsOfExperience: 4 },
        { name: 'GraphQL', level: 'Advanced', yearsOfExperience: 3 },
        { name: 'Docker', level: 'Intermediate', yearsOfExperience: 3 },
        { name: 'Kubernetes', level: 'Intermediate', yearsOfExperience: 2 },
        { name: 'Python', level: 'Intermediate', yearsOfExperience: 3 },
        { name: 'AWS', level: 'Intermediate', yearsOfExperience: 2 },
        { name: 'CI/CD', level: 'Advanced', yearsOfExperience: 4 }
    ];

    for (const skill of skills) {
        await prisma.skill.create({
            data: {
                profileId: user.profile.id,
                ...skill
            }
        });
    }
    console.log(`✅ Added ${skills.length} skills`);

    // Add Achievements
    await prisma.achievement.createMany({
        data: [
            {
                profileId: user.profile.id,
                title: 'AWS Certified Solutions Architect - Associate',
                issuer: 'Amazon Web Services',
                issueDate: new Date('2023-06-15'),
                credentialId: 'AWS-CSA-2023-001',
                credentialUrl: 'https://aws.amazon.com/verification',
                description: 'Demonstrated expertise in designing and implementing distributed systems on AWS.'
            },
            {
                profileId: user.profile.id,
                title: 'Best Capstone Project Award',
                issuer: 'Telkom University',
                issueDate: new Date('2020-07-01'),
                description: 'Received award for developing an innovative AI-powered alumni networking platform.'
            },
            {
                profileId: user.profile.id,
                title: 'Google Cloud Professional Developer',
                issuer: 'Google Cloud',
                issueDate: new Date('2024-01-10'),
                expiryDate: new Date('2026-01-10'),
                credentialId: 'GCP-PD-2024-789',
                credentialUrl: 'https://cloud.google.com/certification',
                description: 'Certified to design, build, and deploy applications on Google Cloud Platform.'
            }
        ]
    });
    console.log(`✅ Added 3 achievements`);

    console.log('\n🎉 Profile sections for john.doe@alumni.telkomuniversity.ac.id seeded successfully!');
}

seedJohnDoeProfile()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
