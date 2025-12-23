import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Video, Clock } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      WEBINAR: 'primary',
      WORKSHOP: 'secondary',
      MEETUP: 'success',
      REUNION: 'warning',
      SEMINAR: 'primary',
      NETWORKING: 'secondary',
      CONFERENCE: 'danger'
    };
    return colors[type] || 'default';
  };

  const isUpcoming = new Date(event.startDate) > new Date();
  const isOngoing = new Date() >= new Date(event.startDate) && new Date() <= new Date(event.endDate);

  return (
    <Card hover padding="none" className="overflow-hidden">
      {/* Cover Image */}
      {event.coverImage ? (
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      <div className="p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={getTypeColor(event.type)}>{event.type}</Badge>
          {event.isOnline && (
            <Badge variant="info">
              <Video className="w-3 h-3 mr-1" />
              Online
            </Badge>
          )}
          {event.isFull && <Badge variant="danger">FULL</Badge>}
          {event.hasRegistered && <Badge variant="success">Registered</Badge>}
          {isOngoing && <Badge variant="warning">ONGOING</Badge>}
        </div>

        {/* Title */}
        <Link to={`/dashboard/events/${event.id}`}>
          <h3 className="font-bold text-xl text-dark-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
            {event.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-dark-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Info */}
        <div className="space-y-2 text-sm text-dark-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatDate(event.startDate)} • {formatTime(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-200">
          <div className="flex items-center gap-4 text-sm text-dark-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {event.currentAttendees}
                {event.capacity && `/${event.capacity}`}
              </span>
            </div>
            {event.price > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>Rp {event.price.toLocaleString('id-ID')}</span>
              </div>
            )}
            {event.price === 0 && (
              <span className="text-green-600 font-semibold">GRATIS</span>
            )}
          </div>

          <Link to={`/dashboard/events/${event.id}`}>
            <button className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              isUpcoming && !event.isFull
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-dark-200 text-dark-600 hover:bg-dark-300'
            }`}>
              {isUpcoming ? 'Join Now' : 'View Details'}
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;