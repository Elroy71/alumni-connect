import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  SlidersHorizontal,
  X,
  TrendingUp,
  Clock,
  Building2,
  Bookmark,
  ChevronDown,
  Sparkles,
  Wifi
} from 'lucide-react';
import { GET_JOBS } from '../../graphql/job.queries';
import { TOGGLE_SAVE_JOB } from '../../graphql/job.mutations';
import JobCard from '../../components/job/JobCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || null,
    level: searchParams.get('level') || null,
    location: searchParams.get('location') || '',
    isRemote: searchParams.get('remote') === 'true' ? true : searchParams.get('remote') === 'false' ? false : null
  });

  const { data, loading, refetch } = useQuery(GET_JOBS, {
    variables: {
      filter: {
        search: filters.search || undefined,
        type: filters.type || undefined,
        level: filters.level || undefined,
        location: filters.location || undefined,
        isRemote: filters.isRemote,
        limit: 20,
        offset: 0
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const [toggleSave] = useMutation(TOGGLE_SAVE_JOB, {
    onCompleted: () => refetch()
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.type) params.set('type', filters.type);
    if (filters.level) params.set('level', filters.level);
    if (filters.location) params.set('location', filters.location);
    if (filters.isRemote !== null) params.set('remote', filters.isRemote.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleSave = async (jobId) => {
    try {
      await toggleSave({ variables: { jobId } });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: null,
      level: null,
      location: '',
      isRemote: null
    });
    setTimeout(() => refetch(), 100);
  };

  const hasActiveFilters = filters.search || filters.type || filters.level || filters.location || filters.isRemote !== null;
  const jobs = data?.jobs?.jobs || [];
  const pagination = data?.jobs?.pagination;

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time', icon: '💼' },
    { value: 'PART_TIME', label: 'Part Time', icon: '⏰' },
    { value: 'CONTRACT', label: 'Contract', icon: '📝' },
    { value: 'INTERNSHIP', label: 'Internship', icon: '🎓' },
    { value: 'FREELANCE', label: 'Freelance', icon: '🏠' }
  ];

  const jobLevels = [
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'LEAD', label: 'Lead' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'DIRECTOR', label: 'Director' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg shadow-primary-500/20">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-900">
                Lowongan Kerja
              </h1>
            </div>
            <p className="text-dark-600 text-sm sm:text-base">
              Temukan peluang karir terbaik dari perusahaan top untuk alumni
            </p>
          </div>
          <Link to="/dashboard/jobs/create" className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-5 h-5" />}
              className="w-full lg:w-auto shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
            >
              Post Lowongan
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search Card */}
            <Card padding="lg" className="animate-fade-in-up sticky top-4" style={{ animationDelay: '150ms' }}>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Cari posisi atau skill..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all bg-dark-50/50 text-dark-900 placeholder:text-dark-400"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Lokasi..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all bg-dark-50/50 text-dark-900 placeholder:text-dark-400"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth>
                  <Search className="w-4 h-4 mr-2" />
                  Cari Lowongan
                </Button>
              </form>
            </Card>

            {/* Filter Options */}
            <Card padding="lg" className="animate-fade-in-up hidden lg:block" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary-500" />
                  Filter
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Remote Toggle */}
              <div className="mb-6">
                <label className="flex items-center justify-between p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl cursor-pointer group hover:from-primary-100 hover:to-secondary-100 transition-all">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-primary-500" />
                    <span className="font-semibold text-dark-700">Remote Only</span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.isRemote === true}
                      onChange={(e) => handleFilterChange('isRemote', e.target.checked ? true : null)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-200 rounded-full peer peer-checked:bg-primary-500 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                  </div>
                </label>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-semibold text-dark-700 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Tipe Pekerjaan
                </h4>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${filters.type === type.value
                        ? 'bg-primary-50 border-2 border-primary-200'
                        : 'hover:bg-dark-50 border-2 border-transparent'
                        }`}
                    >
                      <input
                        type="radio"
                        name="jobType"
                        checked={filters.type === type.value}
                        onChange={() => handleFilterChange('type', filters.type === type.value ? null : type.value)}
                        className="sr-only"
                      />
                      <span className="text-lg">{type.icon}</span>
                      <span className={`text-sm font-medium ${filters.type === type.value ? 'text-primary-700' : 'text-dark-600'}`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Level */}
              <div>
                <h4 className="font-semibold text-dark-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Level
                </h4>
                <div className="flex flex-wrap gap-2">
                  {jobLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleFilterChange('level', filters.level === level.value ? null : level.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filters.level === level.value
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                        : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                        }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card padding="lg" className="animate-fade-in-up hidden lg:block bg-gradient-to-br from-primary-500 to-secondary-500 text-white" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-bold">Tips Karir</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Lengkapi profil Anda untuk meningkatkan peluang dilihat oleh recruiter hingga 3x lipat!
              </p>
              <Link to="/dashboard/profile">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Lihat Profil
                </Button>
              </Link>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowFilters(!showFilters)}
                icon={<SlidersHorizontal className="w-5 h-5" />}
              >
                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <Card padding="lg" className="lg:hidden mb-4 animate-fade-in">
                <div className="space-y-4">
                  {/* Job Type Select */}
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value || null)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Semua Tipe</option>
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>

                  {/* Level Select */}
                  <select
                    value={filters.level || ''}
                    onChange={(e) => handleFilterChange('level', e.target.value || null)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Semua Level</option>
                    {jobLevels.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>

                  {/* Remote Select */}
                  <select
                    value={filters.isRemote === null ? '' : filters.isRemote.toString()}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleFilterChange('isRemote', val === '' ? null : val === 'true');
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Semua Lokasi</option>
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
                  </select>

                  {hasActiveFilters && (
                    <Button variant="outline" fullWidth onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Hapus Filter
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <p className="text-dark-600">
                <span className="font-bold text-dark-900 text-lg">{pagination?.total || 0}</span>{' '}
                lowongan {hasActiveFilters ? 'ditemukan' : 'tersedia'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Hapus filter
                </button>
              )}
            </div>

            {/* Loading State */}
            {loading && jobs.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} padding="lg" className="animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-dark-200 rounded-xl" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-dark-200 rounded w-3/4" />
                        <div className="h-4 bg-dark-200 rounded w-1/2" />
                        <div className="flex gap-2">
                          <div className="h-6 bg-dark-200 rounded-full w-20" />
                          <div className="h-6 bg-dark-200 rounded-full w-16" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              // Empty State
              <Card padding="xl" className="text-center animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
                  Tidak Ada Lowongan
                </h3>
                <p className="text-dark-600 mb-6 max-w-sm mx-auto">
                  {hasActiveFilters
                    ? 'Tidak ada lowongan yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.'
                    : 'Belum ada lowongan yang tersedia saat ini. Jadilah yang pertama mempost!'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Hapus Filter
                    </Button>
                  )}
                  <Link to="/dashboard/jobs/create">
                    <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
                      Post Lowongan
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              // Jobs List
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${350 + index * 50}ms` }}
                  >
                    <JobCard job={job} onSave={handleSave} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {pagination?.hasMore && (
              <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                >
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;