
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import QRCode from 'react-qr-code';
// import { QRCodeSVG } from 'qrcode.react';
import { 
  CreditCard, 
  Download, 
  Share2, 
  Sparkles,
  CheckCircle,
  Award,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { MY_PROFILE_QUERY } from '../../graphql/profile.queries';
import { GENERATE_ALUMNI_CARD_MUTATION } from '../../graphql/profile.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAuthStore from '../../features/auth/store/authStore';

const AlumniCardPage = () => {
  const { user } = useAuthStore();
  const { data, loading, refetch } = useQuery(MY_PROFILE_QUERY);
  const [generateCard, { loading: generating }] = useMutation(GENERATE_ALUMNI_CARD_MUTATION);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const profile = data?.myProfile;

  const handleGenerateCard = async () => {
    try {
      await generateCard();
      await refetch();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Generate card error:', error);
      alert(error.message);
    }
  };

  const handleDownload = () => {
    // Simple implementation - in production, use html2canvas or similar
    alert('Download functionality akan diimplementasikan dengan html2canvas');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Alumni Card',
          text: `${profile?.fullName} - ${profile?.cardNumber}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      alert('Browser tidak support share API');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const hasCard = !!profile?.cardNumber;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-xl animate-slide-down">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">
              Alumni Card berhasil dibuat!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display font-bold text-4xl text-dark-900 mb-3">
          Alumni Card Digital
        </h1>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Kartu identitas digital resmi alumni Telkom University dengan QR Code terverifikasi
        </p>
      </div>

      {!hasCard ? (
        /* Generate Card Section */
        <Card padding="xl" className="text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-3">
              Belum Punya Alumni Card?
            </h2>
            <p className="text-dark-600 mb-6">
              Dapatkan kartu digital Anda sekarang! Kartu ini dapat digunakan untuk 
              verifikasi identitas dan akses ke berbagai fasilitas alumni.
            </p>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg text-dark-900 mb-4">Manfaat Alumni Card:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-dark-700">Verifikasi identitas resmi</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-dark-700">Akses event eksklusif</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-dark-700">Networking lebih mudah</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-dark-700">QR Code terverifikasi</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={<Sparkles className="w-5 h-5" />}
            onClick={handleGenerateCard}
            loading={generating}
            disabled={generating}
          >
            {generating ? 'Membuat Card...' : 'Generate Alumni Card'}
          </Button>
        </Card>
      ) : (
        /* Card Display */
        <div className="space-y-8">
          {/* Digital Card - Front */}
          <div className="perspective-1000">
            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <Card padding="none" className="overflow-hidden shadow-2xl">
                <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-8 text-white">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl" />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-xl">Alumni Connect</h3>
                          <p className="text-white/80 text-sm">Telkom University</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <p className="text-xs font-bold">VERIFIED</p>
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="mb-6">
                      <p className="text-white/80 text-sm mb-1">Card Number</p>
                      <p className="font-mono font-bold text-2xl tracking-wider mb-6">
                        {profile.cardNumber}
                      </p>

                      <p className="font-display font-bold text-3xl mb-2">
                        {profile.fullName}
                      </p>
                      <div className="flex items-center gap-4 text-white/90">
                        <span>{profile.nim || 'N/A'}</span>
                        <span>•</span>
                        <span>Angkatan {profile.batch || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Program Studi</p>
                        <p className="font-semibold">{profile.major || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs mb-1">Tahun Lulus</p>
                        <p className="font-semibold">{profile.graduationYear || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Chip Effect */}
                  <div className="absolute bottom-8 right-8 w-16 h-12 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg opacity-80" />
                </div>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={<Download className="w-5 h-5" />}
              onClick={handleDownload}
            >
              Download Card
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<Share2 className="w-5 h-5" />}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>

          {/* Card Details & QR Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code */}
            <Card padding="lg" className="text-center">
              <h3 className="font-display font-bold text-xl text-dark-900 mb-6">
                QR Code Verifikasi
              </h3>
              
              <div className="inline-block p-6 bg-white rounded-2xl shadow-xl mb-6">
                <QRCodeSVG
                    value={profile.qrCode || profile.cardNumber}
                    size={200}
                    fgColor="#0ea5e9"
                    bgColor="#ffffff"
                    level="H"
                />
              </div>

              <p className="text-sm text-dark-600 mb-4">
                Scan QR Code ini untuk verifikasi identitas digital Anda
              </p>

              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4">
                <p className="text-xs text-dark-600 mb-1">Card Number</p>
                <p className="font-mono font-bold text-lg text-primary-700">
                  {profile.cardNumber}
                </p>
              </div>
            </Card>

            {/* Profile Details */}
            <Card padding="lg">
              <h3 className="font-display font-bold text-xl text-dark-900 mb-6">
                Detail Pemegang Card
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-dark-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-500 mb-1">Nama Lengkap</p>
                    <p className="font-semibold text-dark-900">{profile.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-dark-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-500 mb-1">Email</p>
                    <p className="font-semibold text-dark-900">{user?.email}</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-start gap-4 p-4 bg-dark-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-dark-500 mb-1">Telepon</p>
                      <p className="font-semibold text-dark-900">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile.city && (
                  <div className="flex items-start gap-4 p-4 bg-dark-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-dark-500 mb-1">Lokasi</p>
                      <p className="font-semibold text-dark-900">
                        {profile.city}{profile.province && `, ${profile.province}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 bg-dark-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-dark-500 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Usage Guide */}
          <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-secondary-50">
            <h3 className="font-display font-bold text-xl text-dark-900 mb-4">
              📱 Cara Menggunakan Alumni Card
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl font-bold gradient-text">1</span>
                </div>
                <h4 className="font-bold text-dark-900 mb-2">Simpan Card</h4>
                <p className="text-sm text-dark-600">
                  Download atau screenshot kartu digital Anda
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl font-bold gradient-text">2</span>
                </div>
                <h4 className="font-bold text-dark-900 mb-2">Tunjukkan QR</h4>
                <p className="text-sm text-dark-600">
                  Scan QR Code saat event atau verifikasi
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-2xl font-bold gradient-text">3</span>
                </div>
                <h4 className="font-bold text-dark-900 mb-2">Nikmati Akses</h4>
                <p className="text-sm text-dark-600">
                  Dapatkan akses eksklusif ke fasilitas alumni
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AlumniCardPage;