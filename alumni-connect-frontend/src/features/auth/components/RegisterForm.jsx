import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Calendar, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import useAuthStore from '../store/authStore';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: '',
    email: '',
    
    // Step 2: Academic Info
    nim: '',
    batch: '',
    major: 'Sistem Informasi',
    graduationYear: '',
    
    // Step 3: Account Security
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) clearError();
  };

  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      // Full Name
      if (!formData.fullName) {
        errors.fullName = 'Nama lengkap wajib diisi';
      } else if (formData.fullName.length < 3) {
        errors.fullName = 'Nama minimal 3 karakter';
      }

      // Email
      if (!formData.email) {
        errors.email = 'Email wajib diisi';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Format email tidak valid';
      }
    }

    if (step === 2) {
      // NIM
      if (!formData.nim) {
        errors.nim = 'NIM wajib diisi';
      } else if (formData.nim.length < 8) {
        errors.nim = 'NIM minimal 8 karakter';
      }

      // Batch
      if (!formData.batch) {
        errors.batch = 'Angkatan wajib diisi';
      } else if (parseInt(formData.batch) < 2000 || parseInt(formData.batch) > new Date().getFullYear()) {
        errors.batch = 'Angkatan tidak valid';
      }

      // Graduation Year
      if (!formData.graduationYear) {
        errors.graduationYear = 'Tahun lulus wajib diisi';
      }
    }

    if (step === 3) {
      // Password
      if (!formData.password) {
        errors.password = 'Password wajib diisi';
      } else if (formData.password.length < 8) {
        errors.password = 'Password minimal 8 karakter';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
      }

      // Confirm Password
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password wajib diisi';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Password tidak cocok';
      }

      // Terms
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    const result = await register(formData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step < currentStep
                  ? 'bg-green-500 text-white'
                  : step === currentStep
                  ? 'bg-gradient-primary text-white'
                  : 'bg-dark-200 text-dark-500'
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step
              )}
            </div>
            <span className="text-xs mt-2 text-dark-600 font-medium">
              {step === 1 && 'Info Dasar'}
              {step === 2 && 'Info Akademik'}
              {step === 3 && 'Keamanan'}
            </span>
          </div>
          {index < 2 && (
            <div
              className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                step < currentStep ? 'bg-green-500' : 'bg-dark-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Global Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Registrasi Gagal</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-slide-up">
          <Input
            type="text"
            name="fullName"
            label="Nama Lengkap"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={formErrors.fullName}
            icon={<User className="w-5 h-5" />}
            required
          />
          
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="nama@example.com"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            icon={<Mail className="w-5 h-5" />}
            required
          />
        </div>
      )}

      {/* Step 2: Academic Info */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-slide-up">
          <Input
            type="text"
            name="nim"
            label="NIM"
            placeholder="1234567890"
            value={formData.nim}
            onChange={handleChange}
            error={formErrors.nim}
            icon={<GraduationCap className="w-5 h-5" />}
            required
          />

          <Input
            type="number"
            name="batch"
            label="Angkatan"
            placeholder="2020"
            value={formData.batch}
            onChange={handleChange}
            error={formErrors.batch}
            icon={<Calendar className="w-5 h-5" />}
            required
          />

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">
              Program Studi <span className="text-red-500">*</span>
            </label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Teknik Informatika">Teknik Informatika</option>
              <option value="Teknik Telekomunikasi">Teknik Telekomunikasi</option>
            </select>
          </div>

          <Input
            type="number"
            name="graduationYear"
            label="Tahun Lulus"
            placeholder="2024"
            value={formData.graduationYear}
            onChange={handleChange}
            error={formErrors.graduationYear}
            icon={<Calendar className="w-5 h-5" />}
            required
          />
        </div>
      )}

      {/* Step 3: Account Security */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-slide-up">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              label="Password"
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-dark-400 hover:text-dark-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              label="Konfirmasi Password"
              placeholder="Masukkan password lagi"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-dark-400 hover:text-dark-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-primary-900 mb-2">Password harus mengandung:</p>
            <ul className="space-y-1 text-sm text-primary-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Minimal 8 karakter
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Huruf besar (A-Z)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Huruf kecil (a-z)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Angka (0-9)
              </li>
            </ul>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-dark-600">
              Saya menyetujui{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                syarat dan ketentuan
              </a>{' '}
              serta{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                kebijakan privasi
              </a>
            </span>
          </label>
          {formErrors.agreeToTerms && (
            <p className="text-sm text-red-500">{formErrors.agreeToTerms}</p>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleBack}
            disabled={isLoading}
          >
            Kembali
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
          >
            Lanjut
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </Button>
        )}
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-dark-600">
        Sudah punya akun?{' '}
        <a href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
          Masuk di sini
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;