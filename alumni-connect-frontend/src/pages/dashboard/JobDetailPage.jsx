import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Bookmark,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle,
  X,
  Wifi,
  GraduationCap,
  Shield,
  Heart,
  Share2,
  Flag,
  Eye,
  TrendingUp,
  Award
} from 'lucide-react';
import { GET_JOB } from '../../graphql/job.queries';
import { APPLY_JOB, TOGGLE_SAVE_JOB } from '../../graphql/job.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import useAuthStore from '../../features/auth/store/authStore';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    coverLetter: '',
    resumeUrl: '',
    portfolioUrl: ''
  });

  const { data, loading, refetch } = useQuery(GET_JOB, {
    variables: { id }
  });

  const [applyJob, { loading: applyLoading }] = useMutation(APPLY_JOB, {
    onCompleted: () => {
      setShowApplyModal(false);
      setApplyForm({ coverLetter: '', resumeUrl: '', portfolioUrl: '' });
      refetch();
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const [toggleSave] = useMutation(TOGGLE_SAVE_JOB, {
    onCompleted: () => refetch()
  });

  const job = data?.job;

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await applyJob({
        variables: {
          jobId: id,
          input: applyForm
        }
      });
    } catch (error) {
      console.error('Apply error:', error);
    }
  };

  const handleSave = async () => {
    try {
      await toggleSave({ variables: { jobId: id } });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const formatSalary = (min, max, currency = 'IDR') => {
    if (!min && !max) return 'Gaji Negotiable';

    const format = (num) => {
      if (currency === 'IDR') {
        if (num >= 1000000) return `${(num / 1000000).toFixed(0)} juta`;
        return new Intl.NumberFormat('id-ID').format(num);
      }
      return `$${(num / 1000).toFixed(0)}k`;
    };

    const prefix = currency === 'IDR' ? 'Rp ' : '';
    if (min && max) return `${prefix}${format(min)} - ${prefix}${format(max)}/bulan`;
    if (min) return `${prefix}${format(min)}+/bulan`;
    return `Up to ${prefix}${format(max)}/bulan`;
  };

  const getTypeStyle = (type) => {
    const styles = {
      FULL_TIME: 'bg-emerald-100 text-emerald-700',
      PART_TIME: 'bg-blue-100 text-blue-700',
      CONTRACT: 'bg-purple-100 text-purple-700',
      INTERNSHIP: 'bg-amber-100 text-amber-700',
      FREELANCE: 'bg-pink-100 text-pink-700'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      REVIEWED: 'primary',
      SHORTLISTED: 'secondary',
      INTERVIEW: 'primary',
      OFFERED: 'success',
      ACCEPTED: 'success',
      REJECTED: 'danger'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const posted = new Date(date);
    const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-dark-200 rounded w-32" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card padding="lg">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-dark-200 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-8 bg-dark-200 rounded w-3/4" />
                      <div className="h-5 bg-dark-200 rounded w-1/2" />
                      <div className="h-4 bg-dark-200 rounded w-full" />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <Card padding="lg">
                  <div className="h-12 bg-dark-200 rounded-xl" />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30 flex items-center justify-center">
        <Card padding="xl" className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-10 h-10 text-dark-400" />
          </div>
          <h2 className="font-bold text-xl text-dark-900 mb-2">Lowongan Tidak Ditemukan</h2>
          <p className="text-dark-600 mb-6">Lowongan yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link to="/dashboard/jobs">
            <Button variant="primary">Kembali ke Daftar</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const companyName = job.company?.name || job.poster?.profile?.fullName || 'Company';

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/jobs')}
          className="flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Kembali ke Lowongan</span>
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card padding="lg" className="animate-fade-in relative overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-secondary-500" />

              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 pt-2">
                {/* Company Logo */}
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={companyName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-dark-100 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {companyName.charAt(0)}
                  </div>
                )}

                {/* Title & Meta */}
                <div className="flex-1">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-900 mb-2">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 text-dark-600 mb-4">
                    <span className="font-semibold text-dark-800 text-lg">{companyName}</span>
                    {job.company?.industry && (
                      <>
                        <span className="text-dark-300">•</span>
                        <span>{job.company.industry}</span>
                      </>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-dark-600 bg-dark-50 px-3 py-1.5 rounded-full">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.isRemote && (
                      <div className="flex items-center gap-1.5 text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full font-semibold">
                        <Wifi className="w-4 h-4" />
                        <span>Remote</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-dark-600 bg-dark-50 px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>{timeAgo(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-dark-600 bg-dark-50 px-3 py-1.5 rounded-full">
                      <Eye className="w-4 h-4" />
                      <span>{job.viewCount || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getTypeStyle(job.type)}`}>
                  {job.type.replace('_', ' ')}
                </span>
                <span className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-bold">
                  {job.level}
                </span>
                {job.skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-dark-100 text-dark-600 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Salary Highlight */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Estimasi Gaji</p>
                    <p className="text-xl font-bold text-green-800">
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Status */}
              {job.hasApplied && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Anda sudah melamar posisi ini</p>
                      {job.applicationStatus && (
                        <p className="text-sm text-blue-600 mt-1">
                          Status: <Badge variant={getStatusColor(job.applicationStatus)}>{job.applicationStatus}</Badge>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Deadline Warning */}
              {job.deadline && (
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800">Deadline Lamaran</p>
                      <p className="text-sm text-amber-600">{formatDate(job.deadline)}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h2 className="font-display font-bold text-xl text-dark-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-500" />
                Deskripsi Pekerjaan
              </h2>
              <div className="prose max-w-none">
                <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                  {job.description}
                </p>
              </div>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <h2 className="font-display font-bold text-xl text-dark-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-500" />
                  Kualifikasi
                </h2>
                <div className="prose max-w-none">
                  <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="font-display font-bold text-xl text-dark-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-500" />
                  Tanggung Jawab
                </h2>
                <div className="prose max-w-none">
                  <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                    {job.responsibilities}
                  </p>
                </div>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                <h2 className="font-display font-bold text-xl text-dark-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-500" />
                  Benefits & Fasilitas
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-dark-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Actions & Company Info */}
          <div className="space-y-6">
            {/* Actions Card */}
            <Card padding="lg" className="sticky top-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="space-y-3">
                {!job.hasApplied ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={<Briefcase className="w-5 h-5" />}
                      onClick={() => setShowApplyModal(true)}
                      className="shadow-lg shadow-primary-500/25"
                    >
                      Lamar Sekarang
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      icon={<Bookmark className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`} />}
                      onClick={handleSave}
                    >
                      {job.isSaved ? 'Tersimpan' : 'Simpan'}
                    </Button>
                  </>
                ) : (
                  <Button variant="success" size="lg" fullWidth disabled className="cursor-not-allowed">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Sudah Melamar
                  </Button>
                )}
                {job.applicationUrl && (
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    icon={<ExternalLink className="w-5 h-5" />}
                    onClick={() => window.open(job.applicationUrl, '_blank')}
                  >
                    Lamar via Website
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-dark-100">
                <div className="text-center p-3 bg-dark-50 rounded-xl">
                  <p className="text-2xl font-bold text-dark-900">{job.applicationsCount || 0}</p>
                  <p className="text-xs text-dark-500 mt-1">Pelamar</p>
                </div>
                <div className="text-center p-3 bg-dark-50 rounded-xl">
                  <p className="text-2xl font-bold text-dark-900">{job.viewCount || 0}</p>
                  <p className="text-xs text-dark-500 mt-1">Dilihat</p>
                </div>
              </div>

              {/* Share & Report */}
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" fullWidth icon={<Share2 className="w-4 h-4" />}>
                  Bagikan
                </Button>
                <Button variant="ghost" size="sm" fullWidth icon={<Flag className="w-4 h-4" />}>
                  Laporkan
                </Button>
              </div>
            </Card>

            {/* Company Info */}
            {job.company && (
              <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <h3 className="font-bold text-lg text-dark-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary-500" />
                  Tentang Perusahaan
                </h3>
                {job.company.logo && (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-full h-28 object-cover rounded-xl mb-4"
                  />
                )}
                <h4 className="font-bold text-xl text-dark-900 mb-2">
                  {job.company.name}
                </h4>
                {job.company.description && (
                  <p className="text-dark-600 text-sm mb-4 line-clamp-4">
                    {job.company.description}
                  </p>
                )}
                <div className="space-y-2.5 text-sm">
                  {job.company.industry && (
                    <div className="flex items-center justify-between py-2 border-b border-dark-100">
                      <span className="text-dark-500">Industri</span>
                      <span className="font-medium text-dark-800">{job.company.industry}</span>
                    </div>
                  )}
                  {job.company.size && (
                    <div className="flex items-center justify-between py-2 border-b border-dark-100">
                      <span className="text-dark-500">Ukuran</span>
                      <span className="font-medium text-dark-800">{job.company.size}</span>
                    </div>
                  )}
                  {job.company.location && (
                    <div className="flex items-center justify-between py-2 border-b border-dark-100">
                      <span className="text-dark-500">Lokasi</span>
                      <span className="font-medium text-dark-800">{job.company.location}</span>
                    </div>
                  )}
                  {job.company.founded && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-dark-500">Didirikan</span>
                      <span className="font-medium text-dark-800">{job.company.founded}</span>
                    </div>
                  )}
                </div>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-semibold py-2 bg-primary-50 rounded-xl transition-colors"
                  >
                    Kunjungi Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </Card>
            )}

            {/* Posted By */}
            <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="font-bold text-lg text-dark-900 mb-4">
                Diposting Oleh
              </h3>
              <div className="flex items-center gap-3">
                {job.poster?.profile?.avatar ? (
                  <img
                    src={job.poster.profile.avatar}
                    alt={job.poster.profile.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-dark-100"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-bold text-lg">
                    {job.poster?.profile?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-dark-900">
                    {job.poster?.profile?.fullName || 'User'}
                  </p>
                  <p className="text-sm text-dark-500">
                    {job.poster?.profile?.currentPosition || 'Alumni'}
                    {job.poster?.profile?.currentCompany &&
                      ` di ${job.poster.profile.currentCompany}`
                    }
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-dark-900">
                  Lamar Posisi
                </h2>
                <p className="text-dark-600 mt-1">{job.title} di {companyName}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-2 hover:bg-dark-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block font-semibold text-dark-900 mb-2">
                  Cover Letter <span className="text-dark-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  value={applyForm.coverLetter}
                  onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                  rows={6}
                  placeholder="Ceritakan mengapa Anda cocok untuk posisi ini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                />
              </div>

              {/* Resume URL */}
              <div>
                <Input
                  label="Link Resume / CV"
                  value={applyForm.resumeUrl}
                  onChange={(e) => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-sm text-dark-500 mt-1">
                  Link Google Drive, Dropbox, atau platform lainnya
                </p>
              </div>

              {/* Portfolio URL */}
              <div>
                <Input
                  label="Link Portfolio"
                  value={applyForm.portfolioUrl}
                  onChange={(e) => setApplyForm({ ...applyForm, portfolioUrl: e.target.value })}
                  placeholder="https://portfolio.com"
                />
                <p className="text-sm text-dark-500 mt-1">
                  Website portfolio, GitHub, atau LinkedIn Anda
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={applyLoading}
                  disabled={applyLoading}
                  fullWidth
                  className="shadow-lg shadow-primary-500/25"
                >
                  {applyLoading ? 'Mengirim...' : 'Kirim Lamaran'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applyLoading}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;