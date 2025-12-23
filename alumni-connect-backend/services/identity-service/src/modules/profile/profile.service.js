// import prisma from '../../config/database.js';
// import QRCode from 'qrcode';
import prisma from '../../config/database.js';
import QRCode from 'qrcode';

class ProfileService {
  // Get profile by user ID
  async getProfileByUserId(userId) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  }

  // Update profile
  async updateProfile(userId, data) {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Check if NIM is being updated and already exists
    if (data.nim && data.nim !== existingProfile.nim) {
      const nimExists = await prisma.profile.findUnique({
        where: { nim: data.nim },
      });

      if (nimExists) {
        throw new Error('NIM already registered');
      }
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined,
        yearsOfExperience: data.yearsOfExperience ? parseInt(data.yearsOfExperience) : undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      },
    });

    return updatedProfile;
  }

  // Generate Alumni Card
  async generateAlumniCard(userId) {
    const profile = await this.getProfileByUserId(userId);

    // Generate card number if not exists
    let cardNumber = profile.cardNumber;
    if (!cardNumber) {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      cardNumber = `AC-${year}-${random}`;
    }

    // Generate QR Code
    const qrData = JSON.stringify({
      cardNumber,
      userId,
      name: profile.fullName,
      nim: profile.nim,
      batch: profile.batch,
      major: profile.major,
    });

    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0ea5e9',
        light: '#ffffff',
      },
    });

    // Update profile with card data
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        cardNumber,
        qrCode,
      },
    });

    return updatedProfile;
  }

  // Get profile stats
  async getProfileStats(userId) {
    const profile = await this.getProfileByUserId(userId);

    // Calculate profile completion
    const fields = [
      'fullName', 'nim', 'batch', 'major', 'graduationYear',
      'gender', 'dateOfBirth', 'phone', 'address', 'city',
      'currentCompany', 'currentPosition', 'bio', 'avatar',
    ];

    const filledFields = fields.filter(field => profile[field] != null && profile[field] !== '').length;
    const completionPercentage = Math.round((filledFields / fields.length) * 100);

    return {
      completionPercentage,
      totalFields: fields.length,
      filledFields,
      hasAlumniCard: !!profile.cardNumber,
    };
  }
}

export default new ProfileService();