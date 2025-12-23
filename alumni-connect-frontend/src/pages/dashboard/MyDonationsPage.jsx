import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Heart, Calendar } from 'lucide-react';
import { GET_MY_DONATIONS } from '../../graphql/funding.queries';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const MyDonationsPage = () => {
  const { data, loading } = useQuery(GET_MY_DONATIONS);

  const donations = data?.myDonations || [];

  const formatAmount = (amount, currency) => {
    if (currency === 'IDR') {
      return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    }
    return `$${new Intl.NumberFormat('en-US').format(amount)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      VERIFIED: 'success',
      REJECTED: 'danger'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalDonated = donations
    .filter(d => d.status === 'VERIFIED')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          My Donations
        </h1>
        <p className="text-dark-600">
          Riwayat donasi Anda
        </p>
      </div>

      {/* Stats */}
      {donations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg">
            <p className="text-dark-600 mb-2">Total Donated</p>
            <p className="text-3xl font-bold text-primary-600">
              {formatAmount(totalDonated, 'IDR')}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-dark-600 mb-2">Total Campaigns</p>
            <p className="text-3xl font-bold text-primary-600">
              {donations.length}
            </p>
          </Card>
          <Card padding="lg">
            <p className="text-dark-600 mb-2">Verified</p>
            <p className="text-3xl font-bold text-green-600">
              {donations.filter(d => d.status === 'VERIFIED').length}
            </p>
          </Card>
        </div>
      )}

      {/* Donations */}
      {donations.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            No Donations Yet
          </h3>
          <p className="text-dark-600 mb-6">
            Mulai berdonasi untuk membantu sesama
          </p>
          <Link to="/dashboard/funding">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Browse Campaigns
            </button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id} padding="lg" hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link to={`/dashboard/funding/${donation.campaign.id}`}>
                    <h3 className="font-bold text-lg text-dark-900 hover:text-primary-600 transition-colors mb-2">
                      {donation.campaign.title}
                    </h3>
                  </Link>

                  {donation.message && (
                    <p className="text-dark-600 text-sm mb-3 italic">
                      "{donation.message}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-dark-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-current text-red-500" />
                      <span className="font-bold text-primary-600">
                        {formatAmount(donation.amount, donation.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(donation.donatedAt)}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={getStatusColor(donation.status)}>
                  {donation.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonationsPage;