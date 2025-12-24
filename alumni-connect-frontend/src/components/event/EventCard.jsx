import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Video, Clock, CheckCircle, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
      year: date.getFullYear()
    };
  };

  const getTypeColor = (type) => {
    const colors = {
      WEBINAR: 'bg-blue-100 text-blue-700 border-blue-200',
      WORKSHOP: 'bg-purple-100 text-purple-700 border-purple-200',
      MEETUP: 'bg-green-100 text-green-700 border-green-200',
      REUNION: 'bg-amber-100 text-amber-700 border-amber-200',
      SEMINAR: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      NETWORKING: 'bg-pink-100 text-pink-700 border-pink-200',
      CONFERENCE: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getDaysUntil = (startDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return null;
    if (diff === 0) return 'Hari ini';
    if (diff === 1) return 'Besok';
    if (diff <= 7) return `${diff} hari lagi`;
    return null;
  };

  const isUpcoming = new Date(event.startDate) > new Date();
  const isOngoing = new Date() >= new Date(event.startDate) && new Date() <= new Date(event.endDate);
  const dateInfo = formatDateShort(event.startDate);
  const daysUntil = getDaysUntil(event.startDate);

  return (
    <Link to={`/dashboard/events/${event.id}`}>
      <Card hover padding="none" className="overflow-hidden h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Cover Image dengan Gradient Overlay dan Date Badge */}
        <div className="relative h-56 overflow-hidden">
          {event.coverImage ? (
            <>
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 flex items-center justify-center">
              <Calendar className="w-20 h-20 text-white opacity-30" />
            </div>
          )}

          {/* Date Badge - Top Right */}
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 text-center min-w-[70px]">
            <div className="text-3xl font-bold text-dark-900">{dateInfo.day}</div>
            <div className="text-xs font-semibold text-primary-600">{dateInfo.month}</div>
            <div className="text-xs text-dark-500">{dateInfo.year}</div>
          </div>

          {/* Status Badges - Top Left */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {event.isOnline && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg">
                <Video className="w-3.5 h-3.5" />
                Online
              </div>
            )}
            {event.hasRegistered && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold shadow-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                Terdaftar
              </div>
            )}
            {isOngoing && (
              <div className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg animate-pulse">
                BERLANGSUNG
              </div>
            )}
            {event.isFull && (
              <div className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold shadow-lg">
                FULL
              </div>
            )}
          </div>

          {/* Countdown - Bottom */}
          {daysUntil && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-dark-900">{daysUntil}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Type Badge */}
          <div className="mb-3">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border ${getTypeColor(event.type)}`}>
              {event.type.replace('_', ' ')}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-xl text-dark-900 group-hover:text-primary-600 transition-colors mb-3 line-clamp-2 min-h-[3.5rem]">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-dark-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {event.description}
          </p>

          {/* Event Meta Info */}
          <div className="space-y-2.5 text-sm mb-4">
            <div className="flex items-start gap-2.5 text-dark-700">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
              <div className="flex-1">
                <div className="font-semibold">{formatDate(event.startDate)}</div>
                <div className="text-xs text-dark-500">{formatTime(event.startDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-dark-700">
              <MapPin className="w-4 h-4 flex-shrink-0 text-primary-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-100">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-dark-600">
                <Users className="w-4 h-4 text-dark-400" />
                <span className="font-semibold">
                  {event.currentAttendees}
                  {event.capacity && `/${event.capacity}`}
                </span>
              </div>
              {event.price > 0 ? (
                <div className="flex items-center gap-1.5 text-dark-600">
                  <DollarSign className="w-4 h-4 text-dark-400" />
                  <span className="font-semibold">Rp {(event.price / 1000).toFixed(0)}K</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-bold text-green-700">GRATIS</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${isUpcoming && !event.isFull
                ? 'bg-primary-600 text-white group-hover:bg-primary-700 group-hover:shadow-lg group-hover:shadow-primary-500/30'
                : 'bg-dark-100 text-dark-600 group-hover:bg-dark-200'
              }`}>
              {isUpcoming && !event.isFull ? (
                event.hasRegistered ? 'Lihat Detail' : 'Daftar →'
              ) : (
                'Lihat Detail'
              )}
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-primary-500 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  );
};

export default EventCard;