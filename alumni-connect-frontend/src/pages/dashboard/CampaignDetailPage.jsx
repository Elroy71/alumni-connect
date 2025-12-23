import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Users,
  Clock,
  TrendingUp,
  User as UserIcon,
  CheckCircle,
  X,
  DollarSign,
  Calendar
} from 'lucide-react';
import { GET_CAMPAIGN, GET_PUBLIC_DONATIONS } from '../../graphql/funding.queries';
import { CREATE_DONATION } from '../../graphql/funding.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const CampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateForm, setDonateForm] = useState({
    amount: '',
    message: '',
    isAnonymous: false,
    paymentProof: ''
  });

  const { data, loading, refetch } = useQuery(GET_CAMPAIGN, {
    variables: { id }
  });

  const { data: donationsData } = useQuery(GET_PUBLIC_DONATIONS, {
    variables: { campaignId: id }
  });

  const [createDonation, { loading: donateLoading }] = useMutation(CREATE_DONATION, {
    onCompleted: () => {
      setShowDonateModal(false);
      setDonateForm({ amount: '', message: '', isAnonymous: false, paymentProof: '' });
      refetch();
      alert('Donation submitted! Waiting for verification.');
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const campaign = data?.campaign;
  const donations = donationsData?.publicDonations || [];

  const handleDonate = async (e) => {
    e.preventDefault();

    const amount = parseInt(donateForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await createDonation({
        variables: {
          campaignId: id,
          input: {
            amount,
            message: donateForm.message || undefined,
            isAnonymous: donateForm.isAnonymous,
            paymentProof: donateForm.paymentProof || undefined
          }
        }
      });
    } catch (error) {
      console.error('Donate error:', error);
    }
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'IDR') {
      return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    }
    return `$${new Intl.NumberFormat('en-US').format(amount)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
        <h2 className="font-bold text-xl text-dark-900 mb-2">Campaign Not Found</h2>
        <p className="text-dark-600 mb-4">The campaign you're looking for doesn't exist.</p>
        <Link to="/dashboard/funding">
          <Button variant="primary">Back to Campaigns</Button>
        </Link>
      </Card>
    );
  }

  const percentage = Math.min(campaign.percentage || 0, 100);
  const isCompleted = percentage >= 100;
  const isEnded = campaign.daysLeft === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/funding')}
        className="flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Campaigns</span>
      </button>

      {/* Cover Image */}
      {campaign.coverImage && (
        <div className="w-full h-96 rounded-2xl overflow-hidden">
          <img
            src={campaign.coverImage}
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
              <Badge variant="primary">{campaign.category}</Badge>
              
              <h1 className="font-display font-bold text-3xl text-dark-900">
                {campaign.title}
              </h1>

              <p className="text-dark-700 text-lg">
                {campaign.description}
              </p>

              {/* Progress */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-dark-900">
                      {formatAmount(campaign.currentAmount, campaign.currency)}
                    </p>
                    <p className="text-sm text-dark-500">
                      terkumpul dari {formatAmount(campaign.goalAmount, campaign.currency)}
                    </p>
                  </div>
                  {isCompleted && (
                    <Badge variant="success" icon={<TrendingUp className="w-4 h-4" />}>
                      FUNDED!
                    </Badge>
                  )}
                </div>

                <div className="w-full h-4 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gradient-primary'
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
                    <p className="text-2xl font-bold text-primary-600">{campaign.donationsCount}</p>
                    <p className="text-sm text-dark-500">Donatur</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{campaign.daysLeft}</p>
                    <p className="text-sm text-dark-500">Hari Lagi</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Story */}
          {campaign.story && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
                Cerita Campaign
              </h2>
              <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                {campaign.story}
              </p>
            </Card>
          )}

          {/* Donors */}
          <Card padding="lg">
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
              Donatur ({donations.length})
            </h2>
            {donations.length === 0 ? (
              <p className="text-center text-dark-500 py-8">Belum ada donatur</p>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-start gap-3 p-4 bg-dark-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                      {donation.donor?.profile?.fullName?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-dark-900">
                          {donation.donor?.profile?.fullName || 'Anonymous'}
                        </p>
                        <p className="font-bold text-primary-600">
                          {formatAmount(donation.amount, donation.currency)}
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
              {!isEnded ? (
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
                  Campaign Berakhir
                </Button>
              )}
            </div>
          </Card>

          {/* Campaign Info */}
          <Card padding="lg">
            <h3 className="font-bold text-lg text-dark-900 mb-4">Campaign Details</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-dark-900">Deadline</p>
                  <p className="text-sm text-dark-600">{formatDate(campaign.endDate)}</p>
                </div>
              </div>

              {campaign.beneficiary && (
                <div className="flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark-900">Penerima Manfaat</p>
                    <p className="text-sm text-dark-600">{campaign.beneficiary}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Creator */}
          <Card padding="lg">
            <h3 className="font-bold text-lg text-dark-900 mb-4">Campaign Creator</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                {campaign.creator?.profile?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-dark-900">
                  {campaign.creator?.profile?.fullName || 'User'}
                </p>
                <p className="text-sm text-dark-600">
                  {campaign.creator?.profile?.currentPosition || 'Alumni'}
                </p>
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
                  label="Jumlah Donasi (Rp)"
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
                  Pesan Dukungan (Optional)
                </label>
                <textarea
                  value={donateForm.message}
                  onChange={(e) => setDonateForm({ ...donateForm, message: e.target.value })}
                  rows={4}
                  placeholder="Tulis pesan dukungan Anda..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              <div>
                <Input
                  label="Link Bukti Transfer (Optional)"
                  value={donateForm.paymentProof}
                  onChange={(e) => setDonateForm({ ...donateForm, paymentProof: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={donateForm.isAnonymous}
                  onChange={(e) => setDonateForm({ ...donateForm, isAnonymous: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
                />
                <label htmlFor="anonymous" className="text-sm text-dark-700">
                  Donasi sebagai anonim
                </label>
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