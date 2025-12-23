import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/store/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
  LogOut, 
  User, 
  Mail, 
  GraduationCap, 
  Calendar,
  Sparkles 
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl gradient-text">
                  Alumni Connect
                </h1>
                <p className="text-xs text-dark-500">Dashboard</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              icon={<LogOut className="w-5 h-5" />}
              onClick={handleLogout}
            >
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="animate-slide-up">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-dark-900 mb-2">
              Selamat Datang, {user?.name}! 👋
            </h2>
            <p className="text-lg text-dark-600">
              Ini adalah dashboard sementara. Fitur lengkap akan dibuat di Tahap 4.
            </p>
          </div>

          {/* User Info Card */}
          <Card padding="lg" className="animate-scale-in animation-delay-200">
            <h3 className="font-display font-bold text-xl text-dark-900 mb-6">
              Informasi Akun
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Nama Lengkap</p>
                  <p className="font-semibold text-dark-900">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Email</p>
                  <p className="font-semibold text-dark-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Program Studi</p>
                  <p className="font-semibold text-dark-900">{user?.major || 'Sistem Informasi'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Angkatan</p>
                  <p className="font-semibold text-dark-900">{user?.batch || '2020'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Coming Soon Section */}
          <Card 
            padding="lg" 
            gradient 
            className="animate-scale-in animation-delay-400"
          >
            <div className="text-center text-white">
              <h3 className="font-display font-bold text-2xl mb-4">
                🚀 Fitur Lengkap Segera Hadir!
              </h3>
              <p className="text-white/90 mb-6">
                Dashboard lengkap dengan semua fitur akan tersedia di Tahap 4:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-semibold mb-1">📝 Profile</p>
                  <p className="text-sm text-white/80">Edit profil & alumni card</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-semibold mb-1">💬 Forum</p>
                  <p className="text-sm text-white/80">Post & interaksi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-semibold mb-1">💼 Jobs</p>
                  <p className="text-sm text-white/80">Cari & posting lowongan</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="font-semibold mb-1">📅 Events</p>
                  <p className="text-sm text-white/80">Lihat & daftar event</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;