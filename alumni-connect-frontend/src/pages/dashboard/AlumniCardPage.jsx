import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import {
  CreditCard,
  Download,
  Share2,
  Sparkles,
  CheckCircle,
  Award,
  User,
  ShieldCheck,
  ExternalLink
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
  const cardRef = useRef(null);

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

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `AlumniCard-${profile.cardNumber || 'digital'}.png`;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Gagal mendownload kartu');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Alumni Card',
          text: `Kartu Alumni Digital - ${profile?.fullName}`,
          url: `${window.location.origin}/alumni/${profile?.cardNumber}`,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(`${window.location.origin}/alumni/${profile?.cardNumber}`);
      alert('Link profil publik berhasil disalin!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const hasCard = !!profile?.cardNumber;
  const qrUrl = hasCard ? `${window.location.origin}/alumni/${profile.cardNumber}` : '';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-50 bg-green-50 border border-green-200 px-4 py-3 rounded-xl shadow-lg animate-slide-left">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">
              Alumni Card berhasil dibuat!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-3xl text-dark-900">
          Alumni Card Digital
        </h1>
        <p className="text-dark-600 text-lg">
          Identitas resmi anggota komunitas alumni Telkom University
        </p>
      </div>

      {!hasCard ? (
        /* Generate Card Section */
        <Card padding="xl" className="text-center max-w-2xl mx-auto border-2 border-dashed border-gray-200 bg-gray-50/50">
          <div className="py-8">
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
              <CreditCard className="w-10 h-10 text-primary-600" />
            </div>

            <h2 className="font-display font-bold text-2xl text-dark-900 mb-3">
              Aktifkan Kartu Digital Anda
            </h2>
            <p className="text-dark-600 mb-8 max-w-md mx-auto">
              Dapatkan akses eksklusif ke event, networking, dan fasilitas karir dengan mengaktifkan Alumni Card Anda.
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerateCard}
              loading={generating}
              disabled={generating}
              className="bg-gradient-primary hover:shadow-lg hover:shadow-primary-600/20 transform hover:-translate-y-0.5 transition-all"
            >
              {generating ? 'Sedang Membuat...' : 'Buat Alumni Card Sekarang'}
            </Button>
          </div>
        </Card>
      ) : (
        /* Card Display Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Card Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="perspective-1000">
              <div
                ref={cardRef}
                className="relative transition-transform duration-500 hover:rotate-y-2 transform preserve-3d"
                style={{ aspectRatio: '1.586/1' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c2e] via-[#2d3748] to-[#1a202c] rounded-2xl shadow-2xl overflow-hidden text-white border border-white/10">

                  {/* Background Effects */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-600/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  {/* Content Container */}
                  <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">

                    {/* Top Row: Logo & Chip */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg leading-tight tracking-wide">ALUMNI<br />CONNECT</h3>
                        </div>
                      </div>

                      {/* EMV Chip Style */}
                      <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md shadow-sm border border-yellow-600/30 relative overflow-hidden">
                        <div className="absolute inset-0 border-[0.5px] border-yellow-700/40 rounded-md"></div>
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-700/40"></div>
                        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-yellow-700/40"></div>
                      </div>
                    </div>

                    {/* Middle: Name & Number */}
                    <div className="mt-4">
                      <div className="flex items-end gap-4 mb-6">
                        <div className="p-1 bg-white/10 backdrop-blur rounded-lg inline-block">
                          <QRCode
                            value={qrUrl}
                            size={70}
                            level="M"
                            bgColor="transparent"
                            fgColor="#ffffff"
                          />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs tracking-widest uppercase mb-1">Card Number</p>
                          <p className="font-mono text-xl sm:text-2xl tracking-wider text-white font-medium drop-shadow-md">
                            {profile.cardNumber.match(/.{1,4}/g).join(' ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Details */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-display font-bold text-xl sm:text-2xl mb-1 tracking-wide uppercase truncate max-w-[200px] sm:max-w-xs">
                          {profile.fullName}
                        </p>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{profile.major}</span>
                          <span>•</span>
                          <span>{user?.email}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">MEMBER SINCE</p>
                        <p className="font-medium">{profile.graduationYear}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full justify-center py-3 border-gray-300 hover:border-gray-400 text-gray-700"
                icon={<Share2 className="w-5 h-5" />}
                onClick={handleShare}
              >
                Share / Copy Link
              </Button>
              <Button
                variant="primary"
                className="w-full justify-center py-3 shadow-lg shadow-primary-600/20"
                icon={<Download className="w-5 h-5" />}
                onClick={handleDownload}
              >
                Download Card
              </Button>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900">Status Validasi</h3>
                  <p className="text-sm text-green-600 font-medium">Terverifikasi Aktif</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Public Profile Link</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded w-full truncate font-mono">
                      {qrUrl}
                    </code>
                    <a
                      href={qrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-200 rounded text-gray-500"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tunjukkan QR Code ini untuk masuk ke event kampus.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Scan untuk berbagi CV dan profil profesional Anda.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Valid sebagai tanda pengenal alumni resmi.</span>
                  </p>
                </div>
              </div>
            </Card>

            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-6 text-white text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="font-bold text-lg mb-2">Benefit Alumni</h3>
              <p className="text-white/80 text-sm mb-4">
                Gunakan kartu ini untuk mendapatkan potongan harga di merchant partner dan akses fasilitas kampus.
              </p>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 w-full">
                Lihat Daftar Merchant
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AlumniCardPage;