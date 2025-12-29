import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Plus, Search, Heart } from 'lucide-react';
import { GET_CAMPAIGNS } from '../../graphql/funding.queries';
import CampaignCard from '../../components/funding/CampaignCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Category mapping to match backend enum
const CATEGORIES = [
  { label: 'Semua', value: null },
  { label: 'Beasiswa', value: 'SCHOLARSHIP' },
  { label: 'Riset', value: 'RESEARCH' },
  { label: 'Event', value: 'EVENT' },
  { label: 'Infrastruktur', value: 'INFRASTRUCTURE' }
];

const FundingPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: null
  });

  const { data, loading, refetch } = useQuery(GET_CAMPAIGNS, {
    variables: {
      search: filters.search || undefined,
      category: filters.category || undefined,
      status: 'ACTIVE'
    },
    fetchPolicy: 'network-only'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const campaigns = data?.campaigns || [];
  const totalCampaigns = campaigns.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
            Crowdfunding
          </h1>
          <p className="text-dark-600">
            Bantu sesama alumni mewujudkan impian mereka
          </p>
        </div>
        <Link to="/dashboard/funding/create">
          <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
            Buat Campaign
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card padding="lg">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Cari campaign..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button type="submit" variant="primary">
              Cari
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value || 'all'}
                type="button"
                onClick={() => handleFilterChange('category', cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${filters.category === cat.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </form>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-dark-600">
          <span className="font-bold text-dark-900">{totalCampaigns}</span> campaign ditemukan
        </p>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            Belum Ada Campaign
          </h3>
          <p className="text-dark-600 mb-6">
            Belum ada campaign yang sesuai dengan filter Anda.
          </p>
          <Link to="/dashboard/funding/create">
            <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              Buat Campaign Pertama
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FundingPage;