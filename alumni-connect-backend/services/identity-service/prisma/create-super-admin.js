import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
    try {
        console.log('🔐 Creating Super Admin...');

        // Check if exists
        const existing = await prisma.user.findUnique({
            where: { email: 'superadmin@alumniconnect.com' }
        });

        if (existing) {
            console.log('✅ Super Admin already exists!');
            console.log('Email:', existing.email);
            console.log('Role:', existing.role);
            return;
        }

        // Create new
        const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);

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
                        currentPosition: 'System Administrator'
                    }
                }
            },
            include: { profile: true }
        });

        console.log('✅ Super Admin created successfully!');
        console.log('📧 Email: superadmin@alumniconnect.com');
        console.log('🔑 Password: SuperAdmin123!');
        console.log('👤 Role:', superAdmin.role);

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();
