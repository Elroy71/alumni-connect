import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Heart, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { GET_MY_DONATIONS } from '../../graphql/funding.queries';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const MyDonationsPage = () => {
  const { data, loading } = useQuery(GET_MY_DONATIONS);

  const donations = data?.myDonations || [];

  const formatAmount = (amount) => {
    if (!amount) return 'Rp 0';
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Menunggu', variant: 'warning', icon: Clock },
      'success': { label: 'Berhasil', variant: 'success', icon: CheckCircle },
      'failed': { label: 'Gagal', variant: 'danger', icon: XCircle },
      'PENDING': { label: 'Menunggu', variant: 'warning', icon: Clock },
      'SUCCESS': { label: 'Berhasil', variant: 'success', icon: CheckCircle },
      'FAILED': { label: 'Gagal', variant: 'danger', icon: XCircle }
    };
    return statusMap[status] || { label: status, variant: 'default', icon: Clock };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate totals from successful donations
  const successfulDonations = donations.filter(d =>
    d.paymentStatus === 'success' || d.paymentStatus === 'SUCCESS'
  );
  const totalDonated = successfulDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          Donasi Saya
        </h1>
        <p className="text-dark-600">
          Riwayat donasi Anda untuk berbagai campaign
        </p>
      </div>

      {/* Stats */}
      {donations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg">
            <p className="text-dark-600 mb-2">Total Donasi</p>
            <p className="text-3xl font-bold text-primary-600">
              {formatAmount(totalDonated)}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-dark-600 mb-2">Jumlah Transaksi</p>
            <p className="text-3xl font-bold text-primary-600">
              {donations.length}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-dark-600 mb-2">Donasi Berhasil</p>
            <p className="text-3xl font-bold text-green-600">
              {successfulDonations.length}
            </p>
          </Card>
        </div>
      )}

      {/* Donations List */}
      {donations.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            Belum Ada Donasi
          </h3>
          <p className="text-dark-600 mb-6">
            Mulai berdonasi untuk membantu sesama alumni mewujudkan impian mereka
          </p>
          <Link to="/dashboard/funding">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Lihat Daftar Campaign
            </button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => {
            const statusInfo = getStatusInfo(donation.paymentStatus);
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={donation.id} padding="lg" hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {/* Campaign Image */}
                    {donation.campaign?.imageUrl ? (
                      <img
                        src={donation.campaign.imageUrl}
                        alt={donation.campaign.title}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-secondary flex items-center justify-center flex-shrink-0">
                        <Heart className="w-8 h-8 text-white opacity-50" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <Link to={`/dashboard/funding/${donation.campaign?.id || donation.campaignId}`}>
                        <h3 className="font-bold text-lg text-dark-900 hover:text-primary-600 transition-colors mb-2 line-clamp-1">
                          {donation.campaign?.title || 'Campaign'}
                        </h3>
                      </Link>

                      {donation.message && (
                        <p className="text-dark-600 text-sm mb-3 italic line-clamp-2">
                          "{donation.message}"
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-dark-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-current text-red-500" />
                          <span className="font-bold text-primary-600">
                            {formatAmount(donation.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(donation.donatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Badge variant={statusInfo.variant}>
                    <div className="flex items-center gap-1">
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusInfo.label}</span>
                    </div>
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyDonationsPage;