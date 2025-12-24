import prisma from '../src/config/database.js';

async function seedProfileSections() {
    console.log('🌱 Seeding profile sections...');

    // Find first alumni user
    const user = await prisma.user.findFirst({
        where: { role: 'ALUMNI' },
        include: { profile: true }
    });

    if (!user || !user.profile) {
        console.log('❌ No alumni user with profile found');
        return;
    }

    console.log(`✅ Found user: ${user.profile.fullName}`);

    // Add Experience
    const experience1 = await prisma.experience.create({
        data: {
            profileId: user.profile.id,
            title: 'Senior Software Engineer',
            company: 'Tech Innovations Indonesia',
            location: 'Jakarta, Indonesia',
            employmentType: 'Full-time',
            startDate: new Date('2022-01-01'),
            isCurrentJob: true,
            description: 'Leading development of microservices architecture and mentoring junior developers. Building scalable systems using Node.js, React, and PostgreSQL.'
        }
    });

    const experience2 = await prisma.experience.create({
        data: {
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
    });

    console.log(`✅ Added ${2} experiences`);

    // Add Education
    const education1 = await prisma.education.create({
        data: {
            profileId: user.profile.id,
            institution: 'Universitas Indonesia',
            degree: 'S1 - Bachelor',
            fieldOfStudy: 'Teknik Informatika',
            startDate: new Date('2016-08-01'),
            endDate: new Date('2020-07-01'),
            isCurrentStudy: false,
            grade: '3.75',
            description: 'Focused on software engineering and artificial intelligence. Active in programming competitions and research projects.'
        }
    });

    const education2 = await prisma.education.create({
        data: {
            profileId: user.profile.id,
            institution: 'SMA Negeri 1 Jakarta',
            degree: 'SMA',
            fieldOfStudy: 'IPA',
            startDate: new Date('2013-07-01'),
            endDate: new Date('2016-06-01'),
            isCurrentStudy: false,
            grade: '90.5'
        }
    });

    console.log(`✅ Added ${2} education records`);

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
    const achievement1 = await prisma.achievement.create({
        data: {
            profileId: user.profile.id,
            title: 'AWS Certified Solutions Architect - Associate',
            issuer: 'Amazon Web Services',
            issueDate: new Date('2023-06-15'),
            credentialId: 'AWS-CSA-2023-001',
            credentialUrl: 'https://aws.amazon.com/verification',
            description: 'Demonstrated expertise in designing and implementing distributed systems on AWS.'
        }
    });

    const achievement2 = await prisma.achievement.create({
        data: {
            profileId: user.profile.id,
            title: 'Best Capstone Project Award',
            issuer: 'Universitas Indonesia',
            issueDate: new Date('2020-07-01'),
            description: 'Received award for developing an innovative AI-powered recommendation system.'
        }
    });

    const achievement3 = await prisma.achievement.create({
        data: {
            profileId: user.profile.id,
            title: 'Google Cloud Professional Developer',
            issuer: 'Google Cloud',
            issueDate: new Date('2024-01-10'),
            expiryDate: new Date('2026-01-10'),
            credentialId: 'GCP-PD-2024-789',
            credentialUrl: 'https://cloud.google.com/certification',
            description: 'Certified to design, build, and deploy applications on Google Cloud Platform.'
        }
    });

    console.log(`✅ Added ${3} achievements`);

    console.log('\n🎉 Profile sections seeded successfully!');
}

seedProfileSections()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
