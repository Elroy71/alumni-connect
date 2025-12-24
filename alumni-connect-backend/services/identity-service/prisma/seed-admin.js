import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSuperAdmin() {
    try {
        console.log('🌱 Seeding Super Admin...');

        // Check if super admin already exists
        const existingSuperAdmin = await prisma.user.findUnique({
            where: { email: 'superadmin@alumniconnect.com' }
        });

        if (existingSuperAdmin) {
            console.log('✅ Super Admin already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);

        // Create Super Admin user
        const superAdmin = await prisma.user.create({
            data: {
                email: 'superadmin@alumniconnect.com',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                status: 'ACTIVE',
                profile: {
                    create: {
                        fullName: 'Super Administrator',
                        bio: 'System Administrator - Full Access to AlumniConnect Platform',
                        currentCompany: 'AlumniConnect',
                        currentPosition: 'System Administrator',
                    }
                }
            },
            include: {
                profile: true
            }
        });

        console.log('✅ Super Admin created successfully!');
        console.log('📧 Email:', superAdmin.email);
        console.log('🔑 Password: SuperAdmin123!');
        console.log('👤 Role:', superAdmin.role);
        console.log('');
        console.log('⚠️  IMPORTANT: Please save these credentials for testing!');

    } catch (error) {
        console.error('❌ Error seeding Super Admin:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedSuperAdmin();
