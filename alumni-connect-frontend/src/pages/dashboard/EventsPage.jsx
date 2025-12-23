import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Filter } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const events = data?.events?.events || [];
  const pagination = data?.events?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
            Events
          </h1>
          <p className="text-dark-600">
            Bergabung dengan acara alumni dan perluas networking
          </p>
        </div>
        <Link to="/dashboard/events/create">
          <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
            Create Event
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
                placeholder="Cari event..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Type */}
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || null)}
              className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="">Semua Tipe</option>
              <option value="WEBINAR">Webinar</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="MEETUP">Meetup</option>
              <option value="REUNION">Reunion</option>
              <option value="SEMINAR">Seminar</option>
              <option value="NETWORKING">Networking</option>
              <option value="CONFERENCE">Conference</option>
            </select>

            {/* Online/Offline */}
            <select
              value={filters.isOnline === null ? '' : filters.isOnline.toString()}
              onChange={(e) => {
                const val = e.target.value;
                handleFilterChange('isOnline', val === '' ? null : val === 'true');
              }}
              className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="">Semua Format</option>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>

            {/* Time */}
            <select
              value={filters.upcoming.toString()}
              onChange={(e) => handleFilterChange('upcoming', e.target.value === 'true')}
              className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            >
              <option value="true">Upcoming</option>
              <option value="false">Past Events</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-dark-600">
          <span className="font-bold text-dark-900">{pagination?.total || 0}</span> events ditemukan
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            Belum Ada Event
          </h3>
          <p className="text-dark-600 mb-6">
            Belum ada event yang sesuai dengan filter Anda.
          </p>
          <Link to="/dashboard/events/create">
            <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              Create First Event
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Load More */}
      {pagination?.hasMore && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;