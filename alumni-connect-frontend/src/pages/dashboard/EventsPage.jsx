import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Filter, Sparkles, TrendingUp, Users, Video, MapPin } from 'lucide-react';
import { GET_EVENTS } from '../../graphql/event.queries';
import EventCard from '../../components/event/EventCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const EventsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    type: null,
    isOnline: null,
    upcoming: true
  });

  const { data, loading, refetch } = useQuery(GET_EVENTS, {
    variables: {
      filter: {
        search: filters.search || undefined,
        type: filters.type || undefined,
        isOnline: filters.isOnline,
        upcoming: filters.upcoming,
        limit: 20,
        offset: 0
      }
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: null,
      isOnline: null,
      upcoming: true
    });
  };

  const hasActiveFilters = filters.search || filters.type || filters.isOnline !== null || !filters.upcoming;
  const events = data?.events?.events || [];
  const pagination = data?.events?.pagination;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg shadow-primary-500/20">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-900">
                  Event Alumni
                </h1>
              </div>
              <p className="text-dark-600 text-sm sm:text-base">
                Bergabung dengan acara seru dan perluas networking bersama sesama alumni
              </p>
            </div>
            <Link to="/dashboard/events/create" className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <Button
                variant="primary"
                size="lg"
                icon={<Plus className="w-5 h-5" />}
                className="w-full lg:w-auto shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Buat Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <Card padding="lg" className="mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="Cari event berdasarkan judul, deskripsi, atau lokasi..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all bg-dark-50/50 text-dark-900 placeholder:text-dark-400"
                />
              </div>
              <Button type="submit" variant="primary" className="px-6">
                Cari
              </Button>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Type Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || null)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-dark-50/50"
                >
                  <option value="">Semua Tipe Event</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="WORKSHOP">Workshop</option>
                  <option value="MEETUP">Meetup</option>
                  <option value="REUNION">Reuni</option>
                  <option value="SEMINAR">Seminar</option>
                  <option value="NETWORKING">Networking</option>
                  <option value="CONFERENCE">Conference</option>
                </select>
              </div>

              {/* Location Type Filter */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
                <select
                  value={filters.isOnline === null ? '' : filters.isOnline.toString()}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleFilterChange('isOnline', val === '' ? null : val === 'true');
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-dark-50/50"
                >
                  <option value="">Semua Format</option>
                  <option value="true">🌐 Online</option>
                  <option value="false">📍 Offline</option>
                </select>
              </div>

              {/* Time Filter */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
                <select
                  value={filters.upcoming.toString()}
                  onChange={(e) => handleFilterChange('upcoming', e.target.value === 'true')}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-dark-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-dark-50/50"
                >
                  <option value="true">🔜 Akan Datang</option>
                  <option value="false">📅 Semua Event</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  ✕ Hapus Semua Filter
                </button>
              </div>
            )}
          </form>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <p className="text-dark-600">
            <span className="font-bold text-dark-900 text-lg">{pagination?.total || 0}</span> event {hasActiveFilters ? 'ditemukan' : 'tersedia'}
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <Card padding="xl" className="text-center animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
              {hasActiveFilters ? 'Tidak Ada Event yang Sesuai' : 'Belum Ada Event'}
            </h3>
            <p className="text-dark-600 mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? 'Tidak ada event yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.'
                : 'Belum ada event yang tersedia saat ini. Jadilah yang pertama membuat event!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Hapus Filter
                </Button>
              )}
              <Link to="/dashboard/events/create">
                <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
                  Buat Event Pertama
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${250 + index * 50}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {pagination?.hasMore && (
              <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;