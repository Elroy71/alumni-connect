import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Users,
  TrendingUp,
  X,
  Calendar,
  Tag,
  Clock
} from 'lucide-react';
import { GET_CAMPAIGN, GET_CAMPAIGN_DONATIONS } from '../../graphql/funding.queries';
import { DONATE_TO_CAMPAIGN } from '../../graphql/funding.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

// Category display mapping
const CATEGORY_LABELS = {
  'scholarship': 'Beasiswa',
  'research': 'Riset',
  'event': 'Event',
  'infrastructure': 'Infrastruktur',
  'SCHOLARSHIP': 'Beasiswa',
  'RESEARCH': 'Riset',
  'EVENT': 'Event',
  'INFRASTRUCTURE': 'Infrastruktur'
};

// Status display mapping
const STATUS_LABELS = {
  'pending_approval': { label: 'Menunggu Persetujuan', variant: 'warning' },
  'active': { label: 'Aktif', variant: 'success' },
  'completed': { label: 'Selesai', variant: 'primary' },
  'cancelled': { label: 'Dibatalkan', variant: 'danger' },
  'rejected': { label: 'Ditolak', variant: 'danger' }
};

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateForm, setDonateForm] = useState({
    amount: '',
    message: ''
  });

  const { data, loading, refetch } = useQuery(GET_CAMPAIGN, {
    variables: { id }
  });

  const { data: donationsData } = useQuery(GET_CAMPAIGN_DONATIONS, {
    variables: { campaignId: id }
  });

  const [donateToCampaign, { loading: donateLoading }] = useMutation(DONATE_TO_CAMPAIGN, {
    onCompleted: () => {
      setShowDonateModal(false);
      setDonateForm({ amount: '', message: '' });
      refetch();
      alert('Donasi berhasil! Terima kasih atas kontribusi Anda.');
    },
    onError: (error) => {
      console.error('Donate error:', error);
      alert('Gagal melakukan donasi: ' + error.message);
    }
  });

  const campaign = data?.campaign;
  const donations = donationsData?.campaignDonations || campaign?.donations || [];

  // Helper functions
  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const formatAmount = (amount) => {
    if (!amount) return 'Rp 0';
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    const amount = parseFloat(donateForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Mohon masukkan jumlah donasi yang valid');
      return;
    }

    try {
      await donateToCampaign({
        variables: {
          input: {
            campaignId: id,
            amount: amount,
            message: donateForm.message || null,
            paymentMethod: 'transfer'
          }
        }
      });
    } catch (error) {
      console.error('Donate error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <Card padding="xl" className="text-center">
        <h2 className="font-bold text-xl text-dark-900 mb-2">Campaign Tidak Ditemukan</h2>
        <p className="text-dark-600 mb-4">Campaign yang Anda cari tidak ada atau telah dihapus.</p>
        <Link to="/dashboard/funding">
          <Button variant="primary">Kembali ke Daftar Campaign</Button>
        </Link>
      </Card>
    );
  }

  const progress = campaign.progress || 0;
  const percentage = Math.min(progress, 100);
  const daysLeft = calculateDaysLeft(campaign.endDate);
  const donationsCount = donations.length;
  const isCompleted = percentage >= 100;
  const isEnded = daysLeft === 0;
  const canDonate = campaign.status === 'active' && !isEnded;
  const statusInfo = STATUS_LABELS[campaign.status] || { label: campaign.status, variant: 'default' };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/funding')}
        className="flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Kembali ke Daftar Campaign</span>
      </button>

      {/* Cover Image */}
      {campaign.imageUrl && (
        <div className="w-full h-96 rounded-2xl overflow-hidden">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card padding="lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="primary">
                  {CATEGORY_LABELS[campaign.category] || campaign.category}
                </Badge>
                <Badge variant={statusInfo.variant}>
                  {statusInfo.label}
                </Badge>
              </div>

              <h1 className="font-display font-bold text-3xl text-dark-900">
                {campaign.title}
              </h1>

              <p className="text-dark-700 text-lg whitespace-pre-wrap">
                {campaign.description}
              </p>

              {/* Rejection reason if rejected */}
              {campaign.status === 'rejected' && campaign.rejectionReason && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">
                    <strong>Alasan Penolakan:</strong> {campaign.rejectionReason}
                  </p>
                </div>
              )}

              {/* Pending approval notice */}
              {campaign.status === 'pending_approval' && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <strong>⏳ Menunggu Persetujuan:</strong> Campaign ini sedang menunggu persetujuan dari Super Admin.
                  </p>
                </div>
              )}

              {/* Progress */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-dark-900">
                      {formatAmount(campaign.currentAmount)}
                    </p>
                    <p className="text-sm text-dark-500">
                      terkumpul dari {formatAmount(campaign.targetAmount)}
                    </p>
                  </div>
                  {isCompleted && (
                    <Badge variant="success" icon={<TrendingUp className="w-4 h-4" />}>
                      TERCAPAI!
                    </Badge>
                  )}
                </div>

                <div className="w-full h-4 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gradient-primary'
                      }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{percentage.toFixed(0)}%</p>
                    <p className="text-sm text-dark-500">Terkumpul</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{donationsCount}</p>
                    <p className="text-sm text-dark-500">Donatur</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{daysLeft}</p>
                    <p className="text-sm text-dark-500">Hari Lagi</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Campaign Updates */}
          {campaign.updates && campaign.updates.length > 0 && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
                Update Campaign
              </h2>
              <div className="space-y-4">
                {campaign.updates.map((update) => (
                  <div key={update.id} className="p-4 bg-dark-50 rounded-xl">
                    <h3 className="font-semibold text-dark-900">{update.title}</h3>
                    <p className="text-sm text-dark-600 mt-2">{update.content}</p>
                    <p className="text-xs text-dark-500 mt-2">{formatDate(update.createdAt)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Donors */}
          <Card padding="lg">
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
              Donatur ({donationsCount})
            </h2>
            {donations.length === 0 ? (
              <p className="text-center text-dark-500 py-8">Belum ada donatur</p>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-start gap-3 p-4 bg-dark-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {donation.donorId?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-dark-900">
                          Donatur #{donation.donorId?.slice(-4) || 'Anonim'}
                        </p>
                        <p className="font-bold text-primary-600">
                          {formatAmount(donation.amount)}
                        </p>
                      </div>
                      {donation.message && (
                        <p className="text-sm text-dark-600">{donation.message}</p>
                      )}
                      <p className="text-xs text-dark-500 mt-1">
                        {formatDate(donation.donatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Donate Card */}
          <Card padding="lg" className="sticky top-6">
            <div className="space-y-4">
              {canDonate ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Heart className="w-5 h-5" />}
                  onClick={() => setShowDonateModal(true)}
                >
                  Donasi Sekarang
                </Button>
              ) : (
                <Button variant="outline" size="lg" fullWidth disabled>
                  {campaign.status === 'pending_approval'
                    ? 'Menunggu Persetujuan'
                    : isEnded
                      ? 'Campaign Berakhir'
                      : 'Tidak Dapat Donasi'}
                </Button>
              )}
            </div>
          </Card>

          {/* Campaign Info */}
          <Card padding="lg">
            <h3 className="font-bold text-lg text-dark-900 mb-4">Detail Campaign</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark-900">Kategori</p>
                  <p className="text-sm text-dark-600">
                    {CATEGORY_LABELS[campaign.category] || campaign.category}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark-900">Batas Waktu</p>
                  <p className="text-sm text-dark-600">{formatDate(campaign.endDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark-900">Dibuat Pada</p>
                  <p className="text-sm text-dark-600">{formatDate(campaign.createdAt)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-dark-900">
                Donasi untuk Campaign
              </h2>
              <button
                onClick={() => setShowDonateModal(false)}
                className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleDonate} className="space-y-6">
              <div>
                <Input
                  label="Jumlah Donasi (Rp) *"
                  type="number"
                  value={donateForm.amount}
                  onChange={(e) => setDonateForm({ ...donateForm, amount: e.target.value })}
                  placeholder="50000"
                  required
                />
                <div className="flex gap-2 mt-2">
                  {[50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonateForm({ ...donateForm, amount: amt.toString() })}
                      className="px-3 py-2 text-sm bg-dark-100 hover:bg-primary-100 text-dark-700 hover:text-primary-700 rounded-lg transition-colors"
                    >
                      {amt >= 1000 ? `${amt / 1000}K` : amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">
                  Pesan Dukungan (Opsional)
                </label>
                <textarea
                  value={donateForm.message}
                  onChange={(e) => setDonateForm({ ...donateForm, message: e.target.value })}
                  rows={4}
                  placeholder="Tulis pesan dukungan Anda..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={donateLoading}
                  disabled={donateLoading}
                  fullWidth
                >
                  {donateLoading ? 'Memproses...' : 'Konfirmasi Donasi'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowDonateModal(false)}
                  disabled={donateLoading}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;