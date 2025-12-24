import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Video, DollarSign } from 'lucide-react';
import { CREATE_EVENT } from '../../graphql/event.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'WEBINAR',
    coverImage: '',
    startDate: '',
    endDate: '',
    location: '',
    isOnline: false,
    meetingUrl: '',
    capacity: '',
    price: '0',
    tags: '',
    requirements: '',
    agenda: '',
    speakers: ''
  });

  const [createEvent, { loading }] = useMutation(CREATE_EVENT, {
    onCompleted: (data) => {
      alert('Event berhasil dibuat!');
      navigate(`/dashboard/events/${data.createEvent.id}`);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!eventForm.title || !eventForm.description || !eventForm.startDate || !eventForm.endDate || !eventForm.location) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      await createEvent({
        variables: {
          input: {
            title: eventForm.title,
            description: eventForm.description,
            type: eventForm.type,
            coverImage: eventForm.coverImage || undefined,
            startDate: new Date(eventForm.startDate).toISOString(),
            endDate: new Date(eventForm.endDate).toISOString(),
            location: eventForm.location,
            isOnline: eventForm.isOnline,
            meetingUrl: eventForm.meetingUrl || undefined,
            capacity: eventForm.capacity ? parseInt(eventForm.capacity) : undefined,
            price: eventForm.price ? parseInt(eventForm.price) : 0,
            tags: eventForm.tags ? eventForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            requirements: eventForm.requirements || undefined,
            agenda: eventForm.agenda || undefined,
            speakers: eventForm.speakers || undefined
          }
        }
      });
    } catch (error) {
      console.error('Create event error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          Buat Event
        </h1>
        <p className="text-dark-600">
          Buat acara untuk mengumpulkan alumni
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            1
          </div>
          <span className="font-semibold">Info Dasar</span>
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-dark-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            2
          </div>
          <span className="font-semibold">Detail</span>
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-dark-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            3
          </div>
          <span className="font-semibold">Tinjauan</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Informasi Dasar
              </h2>

              <Input
                label="Judul Event *"
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="contoh: Reuni Alumni 2024"
                required
              />

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Deskripsi Event *</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={6}
                  placeholder="Jelaskan tentang event ini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Tipe Event *</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    required
                  >
                    <option value="WEBINAR">Webinar</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="MEETUP">Meetup</option>
                    <option value="REUNION">Reunion</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="NETWORKING">Networking</option>
                    <option value="CONFERENCE">Conference</option>
                  </select>
                </div>

                <Input
                  label="URL Cover Image"
                  value={eventForm.coverImage}
                  onChange={(e) => setEventForm({ ...eventForm, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tanggal & Waktu Mulai *"
                  type="datetime-local"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                  required
                />

                <Input
                  label="Tanggal & Waktu Selesai *"
                  type="datetime-local"
                  value={eventForm.endDate}
                  onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  Langkah Berikutnya →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Location & Details */}
        {step === 2 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Lokasi & Detail
              </h2>

              <Input
                label="Lokasi *"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Gedung Rektorat Telkom University"
                icon={<MapPin className="w-5 h-5" />}
                required
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="online"
                  checked={eventForm.isOnline}
                  onChange={(e) => setEventForm({ ...eventForm, isOnline: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
                />
                <label htmlFor="online" className="font-semibold text-dark-900 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Event Online (Daring)
                </label>
              </div>

              {eventForm.isOnline && (
                <Input
                  label="Meeting URL"
                  value={eventForm.meetingUrl}
                  onChange={(e) => setEventForm({ ...eventForm, meetingUrl: e.target.value })}
                  placeholder="https://zoom.us/..."
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Kapasitas (Maks Peserta)"
                  type="number"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                  placeholder="100"
                  icon={<Users className="w-5 h-5" />}
                />

                <Input
                  label="Harga (IDR, 0 = Gratis)"
                  type="number"
                  value={eventForm.price}
                  onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                  placeholder="0"
                  icon={<DollarSign className="w-5 h-5" />}
                />
              </div>

              <Input
                label="Tag (pisahkan dengan koma)"
                value={eventForm.tags}
                onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                placeholder="networking, tech, karier"
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  ← Kembali
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(3)}
                >
                  Langkah Berikutnya →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Requirements & Agenda */}
        {step === 3 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900">
                Persyaratan & Agenda
              </h2>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Persyaratan (Opsional)</label>
                <textarea
                  value={eventForm.requirements}
                  onChange={(e) => setEventForm({ ...eventForm, requirements: e.target.value })}
                  rows={4}
                  placeholder="- Alumni Telkom University&#10;- Laptop for workshop"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Agenda (Opsional)</label>
                <textarea
                  value={eventForm.agenda}
                  onChange={(e) => setEventForm({ ...eventForm, agenda: e.target.value })}
                  rows={6}
                  placeholder="09:00 - Registration&#10;10:00 - Opening&#10;11:00 - Main Session&#10;12:00 - Lunch Break"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Pembicara (Opsional)</label>
                <textarea
                  value={eventForm.speakers}
                  onChange={(e) => setEventForm({ ...eventForm, speakers: e.target.value })}
                  rows={4}
                  placeholder="John Doe - CEO of Tech Corp&#10;Jane Smith - Senior Engineer"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  ← Kembali
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Membuat...' : 'Buat Event'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};

export default CreateEventPage;