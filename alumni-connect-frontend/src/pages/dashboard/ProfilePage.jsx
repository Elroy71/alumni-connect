import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { 
  Edit, 
  Phone, 
  MapPin, 
  Briefcase,
  Calendar,
  Award,
  Linkedin,
  Github,
  Globe,
  Save,
  X
} from 'lucide-react';
import { MY_PROFILE_QUERY } from '../../graphql/profile.queries';
import { UPDATE_PROFILE_MUTATION } from '../../graphql/profile.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

const ProfilePage = () => {
  const { data, loading, refetch } = useQuery(MY_PROFILE_QUERY);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE_MUTATION);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const profile = data?.myProfile;

  const handleEdit = () => {
    setFormData({
      fullName: profile?.fullName || '',
      nim: profile?.nim || '',
      batch: profile?.batch || '',
      major: profile?.major || '',
      graduationYear: profile?.graduationYear || '',
      gender: profile?.gender || '',
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      placeOfBirth: profile?.placeOfBirth || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      province: profile?.province || '',
      postalCode: profile?.postalCode || '',
      linkedinUrl: profile?.linkedinUrl || '',
      githubUrl: profile?.githubUrl || '',
      portfolioUrl: profile?.portfolioUrl || '',
      currentCompany: profile?.currentCompany || '',
      currentPosition: profile?.currentPosition || '',
      industry: profile?.industry || '',
      yearsOfExperience: profile?.yearsOfExperience || '',
      bio: profile?.bio || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        variables: {
          input: {
            ...formData,
            graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
            yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null,
          }
        }
      });

      await refetch();
      setIsEditing(false);
      setSuccessMessage('Profile berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      alert(error.message);
    }
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
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl animate-slide-down">
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <Card padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-primary" />
        
        <div className="relative pt-20 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-5xl font-bold gradient-text">
                {profile?.fullName?.charAt(0) || 'U'}
              </div>
              {profile?.cardNumber && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
                {profile?.fullName || 'User'}
              </h1>
              <p className="text-lg text-dark-600 mb-3">
                {profile?.currentPosition || 'Alumni'} 
                {profile?.currentCompany && ` @ ${profile.currentCompany}`}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile?.batch && (
                  <Badge variant="primary">Angkatan {profile.batch}</Badge>
                )}
                {profile?.major && (
                  <Badge variant="secondary">{profile.major}</Badge>
                )}
                {profile?.cardNumber && (
                  <Badge variant="success" icon={<Award className="w-4 h-4" />}>
                    Verified Alumni
                  </Badge>
                )}
              </div>
            </div>

            {!isEditing && (
              <Button
                variant="primary"
                size="md"
                icon={<Edit className="w-5 h-5" />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </Card>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card padding="lg">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
              Informasi Dasar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nama Lengkap"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                label="NIM"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
              />
              <Input
                label="Angkatan"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              />
              <Input
                label="Program Studi"
                name="major"
                value={formData.major}
                onChange={handleChange}
              />
              <Input
                label="Tahun Lulus"
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                >
                  <option value="">Pilih</option>
                  <option value="MALE">Laki-laki</option>
                  <option value="FEMALE">Perempuan</option>
                </select>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
              Informasi Kontak
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nomor Telepon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone className="w-5 h-5" />}
              />
              <Input
                label="Kota"
                name="city"
                value={formData.city}
                onChange={handleChange}
                icon={<MapPin className="w-5 h-5" />}
              />
              <Input
                label="Provinsi"
                name="province"
                value={formData.province}
                onChange={handleChange}
              />
              <Input
                label="Kode Pos"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
              Informasi Profesional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Perusahaan Saat Ini"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                icon={<Briefcase className="w-5 h-5" />}
              />
              <Input
                label="Posisi Saat Ini"
                name="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
              />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
              Media Sosial
            </h2>
            <div className="space-y-4">
              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                icon={<Linkedin className="w-5 h-5" />}
                placeholder="https://linkedin.com/in/username"
              />
              <Input
                label="GitHub URL"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                icon={<Github className="w-5 h-5" />}
                placeholder="https://github.com/username"
              />
              <Input
                label="Portfolio URL"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                icon={<Globe className="w-5 h-5" />}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
              Bio
            </h2>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              placeholder="Ceritakan tentang diri Anda..."
            />
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={<Save className="w-5 h-5" />}
              loading={updating}
              disabled={updating}
            >
              {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              icon={<X className="w-5 h-5" />}
              onClick={handleCancel}
              disabled={updating}
            >
              Batal
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {profile?.bio && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-dark-900 mb-4">
                Tentang Saya
              </h2>
              <p className="text-dark-700 leading-relaxed">
                {profile.bio}
              </p>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-dark-700">{profile.phone}</span>
                  </div>
                )}
                {profile?.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="text-dark-700">
                      {profile.city}{profile.province && `, ${profile.province}`}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
                Info Profesional
              </h2>
              <div className="space-y-4">
                {profile?.currentCompany && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="text-sm text-dark-500">Perusahaan</p>
                      <p className="font-semibold text-dark-900">{profile.currentCompany}</p>
                    </div>
                  </div>
                )}
                {profile?.currentPosition && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="text-sm text-dark-500">Posisi</p>
                      <p className="font-semibold text-dark-900">{profile.currentPosition}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
                Media Sosial
              </h2>
              <div className="flex flex-wrap gap-4">
                {profile?.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="font-semibold">LinkedIn</span>
                  </a>
                )}
                {profile?.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-dark-100 hover:bg-dark-200 text-dark-700 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-semibold">GitHub</span>
                  </a>
                )}
                {profile?.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="font-semibold">Portfolio</span>
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;