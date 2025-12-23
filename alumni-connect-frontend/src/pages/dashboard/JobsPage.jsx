import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Briefcase, MapPin } from 'lucide-react';
import { GET_JOBS } from '../../graphql/job.queries';
import { TOGGLE_SAVE_JOB } from '../../graphql/job.mutations';
import JobCard from '../../components/job/JobCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const JobsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    type: null,
    level: null,
    location: '',
    isRemote: null
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
    }
  });

  const [toggleSave] = useMutation(TOGGLE_SAVE_JOB, {
    onCompleted: () => {
      refetch();
    }
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const jobs = data?.jobs?.jobs || [];
  const pagination = data?.jobs?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
            Lowongan Kerja
          </h1>
          <p className="text-dark-600">
            Temukan peluang karir terbaik untuk alumni
          </p>
        </div>
        <Link to="/dashboard/jobs/create">
          <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
            Post Job
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card padding="lg">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Cari posisi, perusahaan, atau skills..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Job Type */}
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || null)}
              className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="">Semua Tipe</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
            </select>

            {/* Level */}
            <select
              value={filters.level || ''}
              onChange={(e) => handleFilterChange('level', e.target.value || null)}
              className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="">Semua Level</option>
              <option value="ENTRY">Entry Level</option>
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior</option>
              <option value="LEAD">Lead</option>
              <option value="MANAGER">Manager</option>
              <option value="DIRECTOR">Director</option>
            </select>

            {/* Location */}
            <Input
              placeholder="Lokasi..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              icon={<MapPin className="w-5 h-5" />}
            />

            {/* Remote */}
            <select
              value={filters.isRemote === null ? '' : filters.isRemote.toString()}
              onChange={(e) => {
                const val = e.target.value;
                handleFilterChange('isRemote', val === '' ? null : val === 'true');
              }}
              className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="">Semua Lokasi</option>
              <option value="true">Remote</option>
              <option value="false">On-site</option>
            </select>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.type || filters.level || filters.location || filters.isRemote !== null) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-600 font-semibold">Active filters:</span>
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    search: '',
                    type: null,
                    level: null,
                    location: '',
                    isRemote: null
                  });
                  setTimeout(() => refetch(), 100);
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear all
              </button>
            </div>
          )}
        </form>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-dark-600">
          <span className="font-bold text-dark-900">{pagination?.total || 0}</span> lowongan ditemukan
        </p>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            Tidak Ada Lowongan
          </h3>
          <p className="text-dark-600 mb-6">
            Belum ada lowongan yang sesuai dengan filter Anda.
          </p>
          <Link to="/dashboard/jobs/create">
            <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              Post Lowongan Pertama
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              onSave={handleSave}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {pagination?.hasMore && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobsPage;