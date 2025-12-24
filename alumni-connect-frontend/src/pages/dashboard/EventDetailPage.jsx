import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Video,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { GET_EVENT } from '../../graphql/event.queries';
import { REGISTER_EVENT, CANCEL_REGISTRATION } from '../../graphql/event.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [notes, setNotes] = useState('');

  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { id }
  });

  const [registerEvent, { loading: registering }] = useMutation(REGISTER_EVENT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { id } }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      alert('Pendaftaran berhasil!');
      setShowRegisterModal(false);
      setNotes('');
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const [cancelRegistration, { loading: cancelling }] = useMutation(CANCEL_REGISTRATION, {
    refetchQueries: [
      { query: GET_EVENT, variables: { id } }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      alert('Pendaftaran dibatalkan');
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Gagal memuat event</h2>
        <p className="text-dark-600 mb-4">{error.message}</p>
        <Link to="/dashboard/events">
          <Button variant="primary">Kembali ke Event</Button>
        </Link>
      </div>
    );
  }

  const event = data?.event;

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark-900">Event tidak ditemukan</h2>
        <Link to="/dashboard/events">
          <Button variant="primary" className="mt-4">Kembali ke Event</Button>
        </Link>
      </div>
    );
  }

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
      minute: '2-digit'
    });
  };

  const isUpcoming = new Date(event.startDate) > new Date();
  const hasEnded = new Date() > new Date(event.endDate);
  const canRegister = isUpcoming && !event.isFull && !event.hasRegistered && !hasEnded;

  const handleRegister = async () => {
    try {
      await registerEvent({
        variables: {
          eventId: id,
          input: { notes }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleCancelRegistration = async () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pendaftaran?')) {
      try {
        await cancelRegistration({
          variables: { eventId: id }
        });
      } catch (error) {
        console.error('Cancel error:', error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/events')}
        className="flex items-center gap-2 text-dark-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Kembali ke Event</span>
      </button>

      {/* Cover Image */}
      {event.coverImage && (
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-64 object-cover rounded-2xl"
        />
      )}

      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="primary">{event.type}</Badge>
          {event.isOnline && (
            <Badge variant="info">
              <Video className="w-3 h-3 mr-1" />
              Online Event
            </Badge>
          )}
          {event.isFull && <Badge variant="danger">PENUH</Badge>}
          {hasEnded && <Badge variant="default">Event Selesai</Badge>}
        </div>
        <h1 className="font-display font-bold text-4xl text-dark-900 mb-3">
          {event.title}
        </h1>
        <p className="text-lg text-dark-600">{event.description}</p>
      </div>

      {/* Registration Status */}
      {event.hasRegistered && (
        <Card padding="lg" className="bg-green-50 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-bold text-green-900">Anda sudah terdaftar untuk event ini!</p>
              <p className="text-sm text-green-700">Status: {event.registrationStatus}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card padding="lg">
            <h2 className="font-bold text-2xl text-dark-900 mb-4">Tentang Event Ini</h2>
            <p className="text-dark-700 whitespace-pre-line">{event.description}</p>
          </Card>

          {/* Requirements */}
          {event.requirements && (
            <Card padding="lg">
              <h2 className="font-bold text-2xl text-dark-900 mb-4">Persyaratan</h2>
              <p className="text-dark-700 whitespace-pre-line">{event.requirements}</p>
            </Card>
          )}

          {/* Agenda */}
          {event.agenda && (
            <Card padding="lg">
              <h2 className="font-bold text-2xl text-dark-900 mb-4">Agenda</h2>
              <p className="text-dark-700 whitespace-pre-line">{event.agenda}</p>
            </Card>
          )}

          {/* Speakers */}
          {event.speakers && (
            <Card padding="lg">
              <h2 className="font-bold text-2xl text-dark-900 mb-4">Pembicara</h2>
              <p className="text-dark-700 whitespace-pre-line">{event.speakers}</p>
            </Card>
          )}
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="sticky top-6">
            <Card padding="lg">
              {/* Price */}
              {event.price > 0 ? (
                <div className="bg-primary-50 px-4 py-3 rounded-xl mb-4">
                  <p className="text-sm text-primary-700 mb-1">Harga</p>
                  <p className="text-3xl font-bold text-primary-600">
                    Rp {event.price.toLocaleString('id-ID')}
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 px-4 py-3 rounded-xl mb-4">
                  <p className="text-3xl font-bold text-green-600">GRATIS</p>
                </div>
              )}

              {/* Register/Cancel Button */}
              {canRegister && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mb-3"
                  onClick={() => setShowRegisterModal(true)}
                >
                  Daftar Sekarang
                </Button>
              )}

              {event.hasRegistered && !hasEnded && (
                <Button
                  variant="danger"
                  size="lg"
                  className="w-full mb-3"
                  onClick={handleCancelRegistration}
                  loading={cancelling}
                >
                  Batalkan Pendaftaran
                </Button>
              )}

              {event.isFull && !event.hasRegistered && (
                <div className="bg-red-50 px-4 py-3 rounded-xl text-center">
                  <p className="font-bold text-red-900">Event Sudah Penuh</p>
                </div>
              )}

              {hasEnded && (
                <div className="bg-dark-100 px-4 py-3 rounded-xl text-center">
                  <p className="font-bold text-dark-700">Event Telah Selesai</p>
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-dark-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark-900">Tanggal & Waktu</p>
                    <p className="text-dark-600">
                      {formatDate(event.startDate)}
                      <br />
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-dark-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-dark-900">Lokasi</p>
                    <p className="text-dark-600">{event.location}</p>
                  </div>
                </div>

                {event.isOnline && event.meetingUrl && (
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-dark-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-dark-900">Meeting Link</p>
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline break-all"
                      >
                        Gabung Online
                      </a>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-dark-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-dark-900">Kapasitas</p>
                      <p className="text-dark-600">
                        {event.currentAttendees} / {event.capacity} terdaftar
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Organized By Card */}
            <Card padding="lg" className="mt-4">
              <h3 className="font-bold text-lg mb-3">Diselenggarakan Oleh</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                  O
                </div>
                <div>
                  <p className="font-semibold text-dark-900">Penyelenggara Event</p>
                  <p className="text-sm text-dark-600">Anggota Alumni</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowRegisterModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card padding="lg" className="max-w-md w-full">
              <h3 className="font-bold text-2xl text-dark-900 mb-4">
                Daftar Event
              </h3>
              <p className="text-dark-600 mb-4">
                Anda akan mendaftar untuk <strong>{event.title}</strong>
              </p>
              <div className="mb-4">
                <label className="block font-semibold text-dark-900 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  placeholder="Permintaan khusus atau pertanyaan..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleRegister}
                  loading={registering}
                >
                  Konfirmasi Pendaftaran
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetailPage;