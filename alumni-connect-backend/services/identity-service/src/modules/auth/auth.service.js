import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database.js';


class AuthService {
  // ✅ Generate JWT Token
  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '7d' }
    );
  }

  // ✅ Register new user
  async register(input) {
    try {
      const { email, password, fullName, nim, major, graduationYear } = input;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with profile
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ALUMNI',
          isVerified: true,
          profile: {
            create: {
              fullName,
              nim,
              major,
              graduationYear: parseInt(graduationYear)
            }
          }
        },
        include: {
          profile: true
        }
      });

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // ✅ Login user
  async login(email, password) {
    try {
      console.log('🔐 Login attempt for:', email);

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }, // ✅ FIXED: Pass email directly as string
        include: {
          profile: true
        }
      });

      if (!user) {
        console.error('❌ User not found:', email);
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.error('❌ Invalid password for:', email);
        throw new Error('Invalid email or password');
      }

      console.log('✅ Login successful for:', email);

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // ✅ Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(
        token, 
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
      );
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // ✅ Get user by ID
  async getUserById(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    });
  }
}

export default new AuthService();