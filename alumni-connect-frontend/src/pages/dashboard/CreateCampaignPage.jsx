import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Heart, DollarSign, FileText, Calendar, User } from 'lucide-react';
import { CREATE_CAMPAIGN } from '../../graphql/funding.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    story: '',
    coverImage: '',
    category: 'Pendidikan',
    goalAmount: '',
    endDate: '',
    beneficiary: '',
    bankAccount: '',
    phoneNumber: ''
  });

  const [createCampaign, { loading }] = useMutation(CREATE_CAMPAIGN, {
    onCompleted: (data) => {
      alert('Campaign created successfully!');
      navigate(`/dashboard/funding/${data.createCampaign.id}`);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!campaignForm.title || !campaignForm.description || !campaignForm.goalAmount || !campaignForm.endDate) {
      alert('Please fill all required fields');
      return;
    }

    const goalAmount = parseInt(campaignForm.goalAmount);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      alert('Please enter a valid goal amount');
      return;
    }

    try {
      await createCampaign({
        variables: {
          input: {
            title: campaignForm.title,
            description: campaignForm.description,
            story: campaignForm.story || undefined,
            coverImage: campaignForm.coverImage || undefined,
            category: campaignForm.category,
            goalAmount,
            endDate: new Date(campaignForm.endDate).toISOString(),
            beneficiary: campaignForm.beneficiary || undefined,
            bankAccount: campaignForm.bankAccount || undefined,
            phoneNumber: campaignForm.phoneNumber || undefined
          }
        }
      });
    } catch (error) {
      console.error('Create campaign error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          Create Campaign
        </h1>
        <p className="text-dark-600">
          Galang dana untuk mewujudkan impian
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            1
          </div>
          <span className="font-semibold">Basic Info</span>
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-dark-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            2
          </div>
          <span className="font-semibold">Story</span>
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-dark-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            3
          </div>
          <span className="font-semibold">Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Informasi Dasar
              </h2>

              <Input
                label="Campaign Title *"
                value={campaignForm.title}
                onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                placeholder="e.g. Bantu Adik Kita Kuliah"
                required
              />

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Deskripsi Singkat *</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  rows={4}
                  placeholder="Jelaskan campaign Anda dalam 2-3 kalimat..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Kategori *</label>
                  <select
                    value={campaignForm.category}
                    onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    required
                  >
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Bencana">Bencana</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Bisnis">Bisnis</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Lingkungan">Lingkungan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <Input
                  label="Cover Image URL"
                  value={campaignForm.coverImage}
                  onChange={(e) => setCampaignForm({ ...campaignForm, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Target Dana (IDR) *"
                  type="number"
                  value={campaignForm.goalAmount}
                  onChange={(e) => setCampaignForm({ ...campaignForm, goalAmount: e.target.value })}
                  placeholder="10000000"
                  icon={<DollarSign className="w-5 h-5" />}
                  required
                />

                <Input
                  label="Deadline *"
                  type="date"
                  value={campaignForm.endDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                  icon={<Calendar className="w-5 h-5" />}
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
                  Next Step →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Story */}
        {step === 2 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Cerita Campaign
              </h2>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">
                  Cerita Lengkap (Optional tapi sangat direkomendasikan)
                </label>
                <textarea
                  value={campaignForm.story}
                  onChange={(e) => setCampaignForm({ ...campaignForm, story: e.target.value })}
                  rows={12}
                  placeholder="Ceritakan secara detail:&#10;- Latar belakang masalah&#10;- Siapa yang akan dibantu&#10;- Mengapa dana ini penting&#10;- Bagaimana dana akan digunakan&#10;- Dampak yang diharapkan"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
                <p className="text-sm text-dark-500 mt-2">
                  💡 Tip: Cerita yang menyentuh hati akan meningkatkan kesuksesan campaign hingga 80%!
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(3)}
                >
                  Next Step →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Additional Details */}
        {step === 3 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <User className="w-6 h-6" />
                Informasi Tambahan
              </h2>

              <Input
                label="Penerima Manfaat (Optional)"
                value={campaignForm.beneficiary}
                onChange={(e) => setCampaignForm({ ...campaignForm, beneficiary: e.target.value })}
                placeholder="e.g. Siti Aminah"
              />

              <Input
                label="Nomor Rekening (Optional)"
                value={campaignForm.bankAccount}
                onChange={(e) => setCampaignForm({ ...campaignForm, bankAccount: e.target.value })}
                placeholder="BCA 1234567890"
              />

              <Input
                label="Nomor WhatsApp (Optional)"
                value={campaignForm.phoneNumber}
                onChange={(e) => setCampaignForm({ ...campaignForm, phoneNumber: e.target.value })}
                placeholder="08123456789"
              />

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Penting:</strong> Pastikan informasi rekening dan kontak yang Anda berikan benar. 
                  Dana yang terkumpul akan ditransfer ke rekening ini setelah verifikasi.
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
};

export default CreateCampaignPage;