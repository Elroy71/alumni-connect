import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Users,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Wifi,
  Clock,
  Award,
  Sparkles,
  Eye
} from 'lucide-react';
import { CREATE_JOB, CREATE_COMPANY } from '../../graphql/job.mutations';
import { GET_COMPANIES } from '../../graphql/job.queries';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCreateCompany, setShowCreateCompany] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    type: 'FULL_TIME',
    level: 'MID',
    location: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: '',
    skills: '',
    benefits: '',
    applicationUrl: '',
    deadline: '',
    companyId: ''
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    website: '',
    logo: '',
    industry: '',
    size: '',
    location: '',
    founded: ''
  });

  const { data: companiesData, refetch: refetchCompanies } = useQuery(GET_COMPANIES);

  const [createJob, { loading: jobLoading }] = useMutation(CREATE_JOB, {
    onCompleted: (data) => {
      navigate(`/dashboard/jobs/${data.createJob.id}`);
    },
    onError: (error) => {
      console.error('Create job error:', error);
      alert(`Error: ${error.message}`);
    }
  });

  const [createCompany, { loading: companyLoading }] = useMutation(CREATE_COMPANY, {
    onCompleted: (data) => {
      setJobForm({ ...jobForm, companyId: data.createCompany.id });
      setShowCreateCompany(false);
      refetchCompanies();
    },
    onError: (error) => {
      console.error('Create company error:', error);
      alert(`Error: ${error.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobForm.title || !jobForm.description || !jobForm.requirements || !jobForm.responsibilities || !jobForm.location) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      await createJob({
        variables: {
          input: {
            title: jobForm.title,
            description: jobForm.description,
            requirements: jobForm.requirements,
            responsibilities: jobForm.responsibilities,
            type: jobForm.type,
            level: jobForm.level,
            location: jobForm.location,
            isRemote: jobForm.isRemote,
            salaryMin: jobForm.salaryMin ? parseInt(jobForm.salaryMin) : undefined,
            salaryMax: jobForm.salaryMax ? parseInt(jobForm.salaryMax) : undefined,
            skills: jobForm.skills ? jobForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
            benefits: jobForm.benefits ? jobForm.benefits.split(',').map(b => b.trim()).filter(Boolean) : [],
            applicationUrl: jobForm.applicationUrl || undefined,
            deadline: jobForm.deadline || undefined,
            companyId: jobForm.companyId || undefined
          }
        }
      });
    } catch (error) {
      console.error('Create job error:', error);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();

    if (!companyForm.name) {
      alert('Nama perusahaan wajib diisi');
      return;
    }

    try {
      await createCompany({
        variables: {
          input: {
            name: companyForm.name,
            description: companyForm.description || undefined,
            website: companyForm.website || undefined,
            logo: companyForm.logo || undefined,
            industry: companyForm.industry || undefined,
            size: companyForm.size || undefined,
            location: companyForm.location || undefined,
            founded: companyForm.founded ? parseInt(companyForm.founded) : undefined
          }
        }
      });
    } catch (error) {
      console.error('Create company error:', error);
    }
  };

  const companies = companiesData?.companies || [];

  const steps = [
    { id: 1, title: 'Info Dasar', icon: Briefcase },
    { id: 2, title: 'Detail', icon: FileText },
    { id: 3, title: 'Kompensasi', icon: DollarSign },
    { id: 4, title: 'Preview', icon: Eye }
  ];

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time', desc: 'Karyawan tetap', icon: '💼' },
    { value: 'PART_TIME', label: 'Part Time', desc: 'Paruh waktu', icon: '⏰' },
    { value: 'CONTRACT', label: 'Contract', desc: 'Kontrak', icon: '📝' },
    { value: 'INTERNSHIP', label: 'Internship', desc: 'Magang', icon: '🎓' },
    { value: 'FREELANCE', label: 'Freelance', desc: 'Lepas', icon: '🏠' }
  ];

  const jobLevels = [
    { value: 'ENTRY', label: 'Entry Level' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MID', label: 'Mid Level' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'LEAD', label: 'Lead' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'DIRECTOR', label: 'Director' }
  ];

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Negotiable';
    const format = (num) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(0)}jt`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
      return num;
    };
    if (min && max) return `Rp ${format(min)} - Rp ${format(max)}`;
    if (min) return `Rp ${format(min)}+`;
    return `Up to Rp ${format(max)}`;
  };

  const selectedCompany = companies.find(c => c.id === jobForm.companyId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg shadow-primary-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-900">
              Post Lowongan Kerja
            </h1>
          </div>
          <p className="text-dark-600">
            Bagikan peluang karir untuk sesama alumni
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div
                  className={`flex items-center gap-2 cursor-pointer transition-all ${step >= s.id ? 'text-primary-600' : 'text-dark-400'
                    }`}
                  onClick={() => s.id < step && setStep(s.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step > s.id
                      ? 'bg-primary-500 text-white'
                      : step === s.id
                        ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-50'
                        : 'bg-dark-100 text-dark-400'
                    }`}>
                    {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                  </div>
                  <span className="hidden sm:block font-semibold">{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors ${step > s.id ? 'bg-primary-500' : 'bg-dark-100'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card padding="lg" className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <Briefcase className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-dark-900">Informasi Dasar</h2>
                    <p className="text-sm text-dark-500">Tentukan posisi dan lokasi pekerjaan</p>
                  </div>
                </div>

                <Input
                  label="Posisi / Job Title *"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />

                {/* Job Type Selection */}
                <div>
                  <label className="block font-semibold text-dark-900 mb-3">Tipe Pekerjaan *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {jobTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setJobForm({ ...jobForm, type: type.value })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${jobForm.type === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-dark-100 hover:border-dark-200 bg-white'
                          }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <p className={`font-semibold mt-2 ${jobForm.type === type.value ? 'text-primary-700' : 'text-dark-800'}`}>
                          {type.label}
                        </p>
                        <p className="text-xs text-dark-500">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Selection */}
                <div>
                  <label className="block font-semibold text-dark-900 mb-3">Level *</label>
                  <div className="flex flex-wrap gap-2">
                    {jobLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setJobForm({ ...jobForm, level: level.value })}
                        className={`px-4 py-2.5 rounded-full font-semibold transition-all ${jobForm.level === level.value
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                          }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Lokasi *"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Jakarta, Indonesia"
                    icon={<MapPin className="w-5 h-5" />}
                    required
                  />

                  <div className="flex items-center mt-8">
                    <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl cursor-pointer flex-1 hover:from-primary-100 hover:to-secondary-100 transition-all">
                      <input
                        type="checkbox"
                        checked={jobForm.isRemote}
                        onChange={(e) => setJobForm({ ...jobForm, isRemote: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
                      />
                      <div className="flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-primary-500" />
                        <span className="font-semibold text-dark-700">Remote Available</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Company Selection */}
                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Perusahaan (Opsional)</label>
                  <div className="flex gap-3">
                    <select
                      value={jobForm.companyId}
                      onChange={(e) => setJobForm({ ...jobForm, companyId: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    >
                      <option value="">Post sebagai Individu</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateCompany(true)}
                      icon={<Building2 className="w-5 h-5" />}
                    >
                      <span className="hidden sm:inline">Tambah</span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(2)}
                    icon={<ChevronRight className="w-5 h-5" />}
                    className="shadow-lg shadow-primary-500/25"
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <Card padding="lg" className="animate-fade-in-up">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-dark-900">Detail Pekerjaan</h2>
                    <p className="text-sm text-dark-500">Jelaskan deskripsi dan requirement</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Deskripsi Pekerjaan *</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={6}
                    placeholder="Jelaskan tentang pekerjaan ini, budaya tim, dan apa yang akan dikerjakan..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Kualifikasi / Requirements *</label>
                  <textarea
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={6}
                    placeholder="- Minimal S1 Teknik Informatika&#10;- 3+ tahun pengalaman di React&#10;- Kemampuan problem-solving yang baik"
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Tanggung Jawab *</label>
                  <textarea
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                    rows={6}
                    placeholder="- Mengembangkan fitur baru&#10;- Code review dan mentoring&#10;- Berkolaborasi dengan tim design"
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <Input
                    label="Skills yang Dibutuhkan"
                    value={jobForm.skills}
                    onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                    placeholder="React, Node.js, GraphQL, PostgreSQL (pisahkan dengan koma)"
                  />
                  <p className="text-sm text-dark-500 mt-1">Pisahkan dengan koma</p>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(1)}
                    icon={<ChevronLeft className="w-5 h-5" />}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(3)}
                    icon={<ChevronRight className="w-5 h-5" />}
                    className="shadow-lg shadow-primary-500/25"
                  >
                    Lanjut
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Compensation */}
          {step === 3 && (
            <Card padding="lg" className="animate-fade-in-up">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <DollarSign className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-dark-900">Kompensasi & Benefits</h2>
                    <p className="text-sm text-dark-500">Tentukan gaji dan keuntungan</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Lowongan dengan gaji transparan mendapat 2x lebih banyak pelamar!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Gaji Minimum (IDR)"
                      type="number"
                      value={jobForm.salaryMin}
                      onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                      placeholder="5000000"
                    />
                    <Input
                      label="Gaji Maximum (IDR)"
                      type="number"
                      value={jobForm.salaryMax}
                      onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                      placeholder="15000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Benefits & Fasilitas</label>
                  <textarea
                    value={jobForm.benefits}
                    onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                    rows={3}
                    placeholder="Health Insurance, Remote Work, Learning Budget"
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                  />
                  <p className="text-sm text-dark-500 mt-1">Pisahkan dengan koma</p>
                </div>

                <Input
                  label="Link Aplikasi Eksternal"
                  value={jobForm.applicationUrl}
                  onChange={(e) => setJobForm({ ...jobForm, applicationUrl: e.target.value })}
                  placeholder="https://company.com/careers/apply"
                />

                <Input
                  label="Deadline Lamaran"
                  type="date"
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                />

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(2)}
                    icon={<ChevronLeft className="w-5 h-5" />}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(4)}
                    icon={<Eye className="w-5 h-5" />}
                    className="shadow-lg shadow-primary-500/25"
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <Card padding="lg" className="border-2 border-primary-200 bg-gradient-to-br from-primary-50/50 to-secondary-50/50">
                <div className="flex items-center gap-2 text-primary-700 mb-4">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">Preview Lowongan</span>
                </div>

                {/* Preview Card - Similar to JobCard */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-dark-100">
                  <div className="flex gap-4">
                    {selectedCompany?.logo ? (
                      <img
                        src={selectedCompany.logo}
                        alt={selectedCompany.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-dark-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl">
                        {(selectedCompany?.name || jobForm.title || 'J').charAt(0)}
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-display font-bold text-xl text-dark-900 mb-1">
                        {jobForm.title || 'Job Title'}
                      </h3>
                      <p className="text-dark-600 font-medium mb-3">
                        {selectedCompany?.name || 'Your Name'}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-dark-600 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {jobForm.location || 'Location'}
                        </span>
                        {jobForm.isRemote && (
                          <span className="flex items-center gap-1 text-primary-600 font-semibold">
                            <Wifi className="w-4 h-4" />
                            Remote
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatSalary(jobForm.salaryMin, jobForm.salaryMax)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                          {jobForm.type.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
                          {jobForm.level}
                        </span>
                        {jobForm.skills && jobForm.skills.split(',').slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-dark-100 text-dark-600 rounded-full text-xs font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {jobForm.description && (
                    <div className="mt-4 pt-4 border-t border-dark-100">
                      <p className="text-dark-600 text-sm line-clamp-3">
                        {jobForm.description}
                      </p>
                    </div>
                  )}

                  {/* Benefits Preview */}
                  {jobForm.benefits && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {jobForm.benefits.split(',').slice(0, 4).map((benefit, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                          <Award className="w-3.5 h-3.5" />
                          {benefit.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(3)}
                  icon={<ChevronLeft className="w-5 h-5" />}
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={jobLoading}
                  disabled={jobLoading}
                  className="shadow-lg shadow-primary-500/25"
                >
                  {jobLoading ? 'Memposting...' : 'Post Lowongan'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Create Company Modal */}
        {showCreateCompany && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card padding="lg" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-dark-900">
                    Tambah Perusahaan
                  </h2>
                  <p className="text-dark-600 mt-1">Buat profil perusahaan baru</p>
                </div>
                <button
                  onClick={() => setShowCreateCompany(false)}
                  className="p-2 hover:bg-dark-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCompany} className="space-y-6">
                <Input
                  label="Nama Perusahaan *"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="PT. Tech Indonesia"
                  required
                />

                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Deskripsi</label>
                  <textarea
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    rows={4}
                    placeholder="Tentang perusahaan..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                    placeholder="https://company.com"
                  />
                  <Input
                    label="Logo URL"
                    value={companyForm.logo}
                    onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Industri"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    placeholder="Technology"
                  />
                  <Input
                    label="Ukuran Perusahaan"
                    value={companyForm.size}
                    onChange={(e) => setCompanyForm({ ...companyForm, size: e.target.value })}
                    placeholder="100-500 karyawan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Lokasi"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                    placeholder="Jakarta, Indonesia"
                  />
                  <Input
                    label="Tahun Berdiri"
                    type="number"
                    value={companyForm.founded}
                    onChange={(e) => setCompanyForm({ ...companyForm, founded: e.target.value })}
                    placeholder="2020"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={companyLoading}
                    disabled={companyLoading}
                    fullWidth
                    className="shadow-lg shadow-primary-500/25"
                  >
                    {companyLoading ? 'Membuat...' : 'Buat Perusahaan'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setShowCreateCompany(false)}
                    disabled={companyLoading}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJobPage;