import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Edit,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Linkedin,
  Github,
  Globe,
  Save,
  X,
  Plus,
  Building2,
  GraduationCap,
  Trophy,
  Sparkles,
  Trash2
} from 'lucide-react';

import { MY_PROFILE_QUERY } from '../../graphql/profile.queries';
import { UPDATE_PROFILE_MUTATION } from '../../graphql/profile.mutations';
import {
  ADD_EXPERIENCE_MUTATION,
  DELETE_EXPERIENCE_MUTATION,
  ADD_EDUCATION_MUTATION,
  DELETE_EDUCATION_MUTATION,
  ADD_SKILL_MUTATION,
  DELETE_SKILL_MUTATION,
  ADD_ACHIEVEMENT_MUTATION,
  DELETE_ACHIEVEMENT_MUTATION
} from '../../graphql/profile-sections.mutations';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import ExperienceModal from '../../components/Profile/ExperienceModal';
import EducationModal from '../../components/Profile/EducationModal';
import SkillModal from '../../components/Profile/SkillModal';
import AchievementModal from '../../components/Profile/AchievementModal';

const ProfilePage = () => {
  const { data, loading, refetch } = useQuery(MY_PROFILE_QUERY);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE_MUTATION);

  const [addExperience] = useMutation(ADD_EXPERIENCE_MUTATION);
  const [deleteExperience] = useMutation(DELETE_EXPERIENCE_MUTATION);
  const [addEducation] = useMutation(ADD_EDUCATION_MUTATION);
  const [deleteEducation] = useMutation(DELETE_EDUCATION_MUTATION);
  const [addSkill] = useMutation(ADD_SKILL_MUTATION);
  const [deleteSkill] = useMutation(DELETE_SKILL_MUTATION);
  const [addAchievement] = useMutation(ADD_ACHIEVEMENT_MUTATION);
  const [deleteAchievement] = useMutation(DELETE_ACHIEVEMENT_MUTATION);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Modals state
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Image upload state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const profile = data?.myProfile;

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEdit = () => {
    setFormData({
      fullName: profile?.fullName || '',
      bio: profile?.bio || '',
      currentCompany: profile?.currentCompany || '',
      currentPosition: profile?.currentPosition || '',
      phone: profile?.phone || '',
      city: profile?.city || '',
      province: profile?.province || '',
      linkedinUrl: profile?.linkedinUrl || '',
      githubUrl: profile?.githubUrl || '',
      portfolioUrl: profile?.portfolioUrl || '',
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({
        variables: { input: formData }
      });

      await refetch();
      setIsEditing(false);
      showSuccess('Profile berhasil diperbarui!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error.message);
    }
  };

  // Helper function to compress and resize image
  const compressImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression (0.8 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Image upload handlers with compression
  const handleAvatarUpload = async (file) => {
    setUploadingImage(true);

    try {
      // Compress avatar to max 400x400
      const compressedImage = await compressImage(file, 400, 400);
      setAvatarPreview(compressedImage);

      await updateProfile({
        variables: {
          input: { avatar: compressedImage }
        }
      });

      await refetch();
      showSuccess('Foto profil berhasil diperbarui!');
      setAvatarPreview(null);
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Gagal mengupload foto profil: ' + error.message);
      setAvatarPreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCoverUpload = async (file) => {
    setUploadingImage(true);

    try {
      // Compress cover image to max 1200x400
      const compressedImage = await compressImage(file, 1200, 400);
      setCoverPreview(compressedImage);

      await updateProfile({
        variables: {
          input: { coverImage: compressedImage }
        }
      });

      await refetch();
      showSuccess('Foto sampul berhasil diperbarui!');
      setCoverPreview(null);
    } catch (error) {
      console.error('Cover upload error:', error);
      alert('Gagal mengupload foto sampul: ' + error.message);
      setCoverPreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Experience handlers
  const handleAddExperience = async (data) => {
    setModalLoading(true);
    try {
      await addExperience({
        variables: { input: data }
      });
      await refetch();
      setShowExperienceModal(false);
      showSuccess('Pengalaman berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding experience:', error);
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!confirm('Hapus pengalaman ini?')) return;

    try {
      await deleteExperience({
        variables: { id }
      });
      await refetch();
      showSuccess('Pengalaman berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert(error.message);
    }
  };

  // Education handlers
  const handleAddEducation = async (data) => {
    setModalLoading(true);
    try {
      await addEducation({
        variables: { input: data }
      });
      await refetch();
      setShowEducationModal(false);
      showSuccess('Pendidikan berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding education:', error);
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!confirm('Hapus pendidikan ini?')) return;

    try {
      await deleteEducation({
        variables: { id }
      });
      await refetch();
      showSuccess('Pendidikan berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting education:', error);
      alert(error.message);
    }
  };

  // Skill handlers
  const handleAddSkill = async (data) => {
    setModalLoading(true);
    try {
      await addSkill({
        variables: { input: data }
      });
      await refetch();
      setShowSkillModal(false);
      showSuccess('Keahlian berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Hapus keahlian ini?')) return;

    try {
      await deleteSkill({
        variables: { id }
      });
      await refetch();
      showSuccess('Keahlian berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert(error.message);
    }
  };

  // Achievement handlers
  const handleAddAchievement = async (data) => {
    setModalLoading(true);
    try {
      await addAchievement({
        variables: { input: data }
      });
      await refetch();
      setShowAchievementModal(false);
      showSuccess('Penghargaan berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding achievement:', error);
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteAchievement = async (id) => {
    if (!confirm('Hapus penghargaan ini?')) return;

    try {
      await deleteAchievement({
        variables: { id }
      });
      await refetch();
      showSuccess('Penghargaan berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sekarang';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths} bulan`;
    if (remainingMonths === 0) return `${years} tahun`;
    return `${years} tahun ${remainingMonths} bulan`;
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

      {/* Header Section - LinkedIn Style */}
      <Card padding="none" className="relative overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 md:h-56 overflow-hidden group">
          {coverPreview || profile?.coverImage ? (
            <img
              src={coverPreview || profile?.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-primary" />
          )}

          {/* Cover Upload Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById('cover-upload').click()}>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">
                {profile?.coverImage ? 'Ubah' : 'Tambah'} Foto Sampul
              </span>
            </div>
          </div>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (!file.type.startsWith('image/')) {
                alert('Harap pilih file gambar');
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                alert('Ukuran file maksimal 10MB');
                return;
              }
              handleCoverUpload(file);
              e.target.value = '';
            }}
            disabled={uploadingImage}
          />
        </div>

        <div className="relative px-6 pb-6">
          {/* Profile Photo - Circular */}
          <div className="-mt-16 md:-mt-20 mb-4">
            <div className="relative w-32 h-32 md:w-40 md:h-40 group cursor-pointer"
              onClick={() => document.getElementById('avatar-upload').click()}>
              <div className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                {avatarPreview || profile?.avatar ? (
                  <img
                    src={avatarPreview || profile?.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-white text-5xl font-bold">
                    {profile?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              {/* Avatar Upload Overlay */}
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-semibold mt-1">
                    {profile?.avatar ? 'Ubah' : 'Upload'}
                  </span>
                </div>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    alert('Harap pilih file gambar');
                    return;
                  }
                  if (file.size > 10 * 1024 * 1024) {
                    alert('Ukuran file maksimal 10MB');
                    return;
                  }
                  handleAvatarUpload(file);
                  e.target.value = '';
                }}
                disabled={uploadingImage}
              />
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
                {profile?.fullName || 'User'}
              </h1>
              <p className="text-lg text-dark-600 mb-3">
                {profile?.currentPosition || 'Alumni'}
                {profile?.currentCompany && ` @ ${profile.currentCompany}`}
              </p>
              <div className="flex items-center gap-4 text-dark-500 mb-3">
                {profile?.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.city}, {profile.province}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
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

      {/* Edit Mode */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card padding="lg">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
              Edit Informasi Dasar
            </h2>
            <div className="space-y-4">
              <Input
                label="Nama Lengkap"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <Input
                label="Posisi Saat Ini"
                value={formData.currentPosition}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
              />
              <Input
                label="Perusahaan Saat Ini"
                value={formData.currentCompany}
                onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
              />
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  placeholder="Ceritakan tentang diri Anda..."
                />
              </div>
            </div>
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
              onClick={() => setIsEditing(false)}
              disabled={updating}
            >
              Batal
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* About Section */}
          {profile?.bio && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-dark-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                Tentang Saya
              </h2>
              <p className="text-dark-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </Card>
          )}

          {/* Experience Section */}
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl text-dark-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                Pengalaman Kerja
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowExperienceModal(true)}
              >
                Tambah
              </Button>
            </div>

            {profile?.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-6">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4 pb-6 border-b border-dark-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-dark-900">{exp.title}</h3>
                      <p className="text-dark-700 font-medium">{exp.company}</p>
                      <p className="text-sm text-dark-500 mb-2">
                        {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Sekarang' : formatDate(exp.endDate)}
                        {' '} · {calculateDuration(exp.startDate, exp.endDate)}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-dark-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-dark-600 mt-2">{exp.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500 text-center py-8">
                Belum ada pengalaman kerja yang ditambahkan
              </p>
            )}
          </Card>

          {/* Education Section */}
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl text-dark-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-600" />
                Pendidikan
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowEducationModal(true)}
              >
                Tambah
              </Button>
            </div>

            {profile?.education && profile.education.length > 0 ? (
              <div className="space-y-6">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex gap-4 pb-6 border-b border-dark-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-secondary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-dark-900">{edu.institution}</h3>
                      <p className="text-dark-700">{edu.degree} - {edu.fieldOfStudy}</p>
                      <p className="text-sm text-dark-500">
                        {formatDate(edu.startDate)} - {edu.isCurrentStudy ? 'Sekarang' : formatDate(edu.endDate)}
                      </p>
                      {edu.grade && (
                        <p className="text-sm text-dark-600 mt-1">IPK: {edu.grade}</p>
                      )}
                      {edu.description && (
                        <p className="text-dark-600 mt-2">{edu.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500 text-center py-8">
                Belum ada riwayat pendidikan yang ditambahkan
              </p>
            )}
          </Card>

          {/* Skills Section */}
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl text-dark-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                Keahlian
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowSkillModal(true)}
              >
                Tambah
              </Button>
            </div>

            {profile?.skillsList && profile.skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skillsList.map((skill) => (
                  <div key={skill.id} className="group relative px-4 py-2 bg-primary-50 text-primary-700 rounded-full font-medium flex items-center gap-2">
                    <span>{skill.name}</span>
                    {skill.level && (
                      <span className="text-xs bg-primary-100 px-2 py-0.5 rounded-full">
                        {skill.level}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="opacity-0 group-hover:opacity-100 ml-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500 text-center py-8">
                Belum ada keahlian yang ditambahkan
              </p>
            )}
          </Card>

          {/* Achievements Section */}
          <Card padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-xl text-dark-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-600" />
                Penghargaan & Sertifikat
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowAchievementModal(true)}
              >
                Tambah
              </Button>
            </div>

            {profile?.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="group relative p-4 border border-dark-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-yellow-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-dark-900">{achievement.title}</h3>
                        <p className="text-sm text-dark-600">{achievement.issuer}</p>
                        <p className="text-xs text-dark-500 mt-1">
                          {formatDate(achievement.issueDate)}
                        </p>
                        {achievement.credentialUrl && (
                          <a
                            href={achievement.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                          >
                            Lihat Kredensial →
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-500 text-center py-8">
                Belum ada penghargaan atau sertifikat yang ditambahkan
              </p>
            )}
          </Card>

          {/* Contact & Social Links */}
          {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl) && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-dark-900 mb-6">
                Media Sosial & Kontak
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

      {/* Modals */}
      <ExperienceModal
        show={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        onSave={handleAddExperience}
        loading={modalLoading}
      />

      <EducationModal
        show={showEducationModal}
        onClose={() => setShowEducationModal(false)}
        onSave={handleAddEducation}
        loading={modalLoading}
      />

      <SkillModal
        show={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        onSave={handleAddSkill}
        loading={modalLoading}
      />

      <AchievementModal
        show={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        onSave={handleAddAchievement}
        loading={modalLoading}
      />
    </div>
  );
};

export default ProfilePage;