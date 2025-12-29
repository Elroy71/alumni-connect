import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Heart, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { CREATE_CAMPAIGN } from '../../graphql/funding.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Category options matching backend enum
const CATEGORIES = [
  { label: 'Beasiswa', value: 'SCHOLARSHIP' },
  { label: 'Riset', value: 'RESEARCH' },
  { label: 'Event', value: 'EVENT' },
  { label: 'Infrastruktur', value: 'INFRASTRUCTURE' }
];

const CreateCampaignPage = () => {
  const navigate = useNavigate();

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'SCHOLARSHIP',
    targetAmount: '',
    endDate: ''
  });

  const [createCampaign, { loading }] = useMutation(CREATE_CAMPAIGN, {
    onCompleted: (data) => {
      alert('Campaign berhasil dibuat! Menunggu persetujuan admin.');
      navigate(`/dashboard/funding/${data.createCampaign.id}`);
    },
    onError: (error) => {
      console.error('Create campaign error:', error);
      alert('Gagal membuat campaign: ' + error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!campaignForm.title || !campaignForm.description || !campaignForm.targetAmount || !campaignForm.endDate) {
      alert('Mohon isi semua field yang wajib diisi');
      return;
    }

    const targetAmount = parseFloat(campaignForm.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Mohon masukkan target dana yang valid');
      return;
    }

    try {
      await createCampaign({
        variables: {
          input: {
            title: campaignForm.title,
            description: campaignForm.description,
            targetAmount: targetAmount,
            category: campaignForm.category,
            imageUrl: campaignForm.imageUrl || null,
            endDate: campaignForm.endDate // YYYY-MM-DD format
          }
        }
      });
    } catch (error) {
      console.error('Create campaign error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/funding')}
        className="flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Kembali ke Daftar Campaign</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          Buat Campaign Baru
        </h1>
        <p className="text-dark-600">
          Galang dana untuk mewujudkan impian bersama alumni
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Info:</strong> Campaign yang Anda buat akan memerlukan persetujuan dari Super Admin sebelum dapat dilihat oleh pengguna lain.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          <div className="space-y-6">
            <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary-600" />
              Informasi Campaign
            </h2>

            {/* Title */}
            <Input
              label="Judul Campaign *"
              value={campaignForm.title}
              onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
              placeholder="contoh: Beasiswa untuk Mahasiswa Berprestasi"
              required
            />

            {/* Description */}
            <div>
              <label className="block font-semibold text-dark-900 mb-2">Deskripsi *</label>
              <textarea
                value={campaignForm.description}
                onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                rows={5}
                placeholder="Jelaskan tujuan campaign Anda secara detail. Ceritakan latar belakang, siapa yang akan dibantu, dan bagaimana dana akan digunakan..."
                className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                required
              />
            </div>

            {/* Category & Image URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-dark-900 mb-2">Kategori *</label>
                <select
                  value={campaignForm.category}
                  onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="URL Gambar Cover"
                value={campaignForm.imageUrl}
                onChange={(e) => setCampaignForm({ ...campaignForm, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Target & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Target Dana (Rp) *"
                type="number"
                value={campaignForm.targetAmount}
                onChange={(e) => setCampaignForm({ ...campaignForm, targetAmount: e.target.value })}
                placeholder="10000000"
                icon={<DollarSign className="w-5 h-5" />}
                required
              />

              <Input
                label="Batas Waktu *"
                type="date"
                value={campaignForm.endDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                icon={<Calendar className="w-5 h-5" />}
                required
              />
            </div>

            {/* Warning */}
            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Penting:</strong> Pastikan informasi yang Anda berikan benar dan dapat dipertanggungjawabkan.
                Dana yang terkumpul akan diverifikasi oleh admin sebelum dicairkan.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard/funding')}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Membuat Campaign...' : 'Buat Campaign'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateCampaignPage;