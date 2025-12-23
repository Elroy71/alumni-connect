import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { GET_MY_REGISTRATIONS } from '../../graphql/event.queries';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const MyEventsPage = () => {
  const { data, loading } = useQuery(GET_MY_REGISTRATIONS, {
    variables: { upcoming: true }
  });

  const registrations = data?.myRegistrations || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      REGISTERED: 'primary',
      CONFIRMED: 'success',
      ATTENDED: 'success',
      CANCELLED: 'danger'
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          My Events
        </h1>
        <p className="text-dark-600">
          Event yang sudah Anda daftar
        </p>
      </div>

      {/* Events */}
      {registrations.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            No Events Yet
          </h3>
          <p className="text-dark-600 mb-6">
            Belum ada event yang Anda daftar
          </p>
          <Link to="/dashboard/events">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Browse Events
            </button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((registration) => (
            <Card key={registration.id} padding="lg" hover>
              {registration.event.coverImage && (
                <img
                  src={registration.event.coverImage}
                  alt={registration.event.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="primary">{registration.event.type}</Badge>
                  <Badge variant={getStatusColor(registration.status)}>
                    {registration.status}
                  </Badge>
                </div>

                <Link to={`/dashboard/events/${registration.event.id}`}>
                  <h3 className="font-bold text-xl text-dark-900 hover:text-primary-600 transition-colors line-clamp-2">
                    {registration.event.title}
                  </h3>
                </Link>

                <div className="space-y-2 text-sm text-dark-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(registration.event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{registration.event.location}</span>
                  </div>
                </div>

                <p className="text-xs text-dark-500">
                  Registered: {formatDate(registration.registeredAt)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;