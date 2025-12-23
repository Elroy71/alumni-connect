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
  Building,
  Calendar,
  CheckCircle,
  X
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
      alert('Application submitted successfully!');
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const [toggleSave] = useMutation(TOGGLE_SAVE_JOB, {
    onCompleted: () => {
      refetch();
    }
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

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary negotiable';
    
    const format = (num) => {
      if (currency === 'IDR') {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)} juta`;
        return new Intl.NumberFormat('id-ID').format(num);
      }
      return `$${(num / 1000).toFixed(0)}k`;
    };
    
    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `${format(min)}+`;
    return `Up to ${format(max)}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      FULL_TIME: 'success',
      PART_TIME: 'primary',
      CONTRACT: 'secondary',
      INTERNSHIP: 'warning',
      FREELANCE: 'danger'
    };
    return colors[type] || 'default';
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
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <Card padding="xl" className="text-center">
        <h2 className="font-bold text-xl text-dark-900 mb-2">Job Not Found</h2>
        <p className="text-dark-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard/jobs">
          <Button variant="primary">Back to Jobs</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/jobs')}
        className="flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Jobs</span>
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card padding="lg">
            <div className="flex items-start gap-4 mb-6">
              {/* Company Logo */}
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-dark-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-3xl">
                  {job.company?.name?.charAt(0) || 'J'}
                </div>
              )}

              {/* Title & Company */}
              <div className="flex-1">
                <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
                  {job.title}
                </h1>
                <p className="text-xl text-dark-700 font-semibold mb-3">
                  {job.company?.name || job.poster?.profile?.fullName}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-dark-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{job.location}</span>
                    {job.isRemote && (
                      <Badge variant="primary">Remote</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{job.applicationsCount} applicants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant={getTypeColor(job.type)}>
                {job.type.replace('_', ' ')}
              </Badge>
              <Badge variant="secondary">{job.level}</Badge>
              {job.skills?.map((skill, idx) => (
                <Badge key={idx} variant="default">{skill}</Badge>
              ))}
            </div>

            {/* Application Status */}
            {job.hasApplied && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    You have applied for this position
                  </span>
                </div>
                {job.applicationStatus && (
                  <p className="text-sm text-green-600 mt-1">
                    Status: <Badge variant={getStatusColor(job.applicationStatus)}>
                      {job.applicationStatus}
                    </Badge>
                  </p>
                )}
              </div>
            )}

            {/* Deadline */}
            {job.deadline && (
              <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 text-orange-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    Application Deadline: {formatDate(job.deadline)}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Description */}
          <Card padding="lg">
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </div>
          </Card>

          {/* Requirements */}
          <Card padding="lg">
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
              Requirements
            </h2>
            <div className="prose max-w-none">
              <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                {job.requirements}
              </p>
            </div>
          </Card>

          {/* Responsibilities */}
          <Card padding="lg">
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
              Responsibilities
            </h2>
            <div className="prose max-w-none">
              <p className="text-dark-700 whitespace-pre-wrap leading-relaxed">
                {job.responsibilities}
              </p>
            </div>
          </Card>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card padding="lg">
              <h2 className="font-display font-bold text-2xl text-dark-900 mb-4">
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
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
          <Card padding="lg" className="sticky top-6">
            <div className="space-y-3">
              {!job.hasApplied ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<Briefcase className="w-5 h-5" />}
                    onClick={() => setShowApplyModal(true)}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    icon={
                      <Bookmark
                        className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`}
                      />
                    }
                    onClick={handleSave}
                  >
                    {job.isSaved ? 'Saved' : 'Save Job'}
                  </Button>
                </>
              ) : (
                <Button variant="success" size="lg" fullWidth disabled>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Already Applied
                </Button>
              )}
              {job.applicationUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  icon={<ExternalLink className="w-5 h-5" />}
                  onClick={() => window.open(job.applicationUrl, '_blank')}
                >
                  Apply Externally
                </Button>
              )}
            </div>
          </Card>

          {/* Company Info */}
          {job.company && (
            <Card padding="lg">
              <h3 className="font-bold text-lg text-dark-900 mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                About Company
              </h3>
              {job.company.logo && (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
              )}
              <h4 className="font-bold text-xl text-dark-900 mb-2">
                {job.company.name}
              </h4>
              {job.company.description && (
                <p className="text-dark-600 mb-4 line-clamp-4">
                  {job.company.description}
                </p>
              )}
              <div className="space-y-2 text-sm text-dark-600">
                {job.company.industry && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Industry:</span>
                    <span>{job.company.industry}</span>
                  </div>
                )}
                {job.company.size && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Company Size:</span>
                    <span>{job.company.size}</span>
                  </div>
                )}
                {job.company.location && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Location:</span>
                    <span>{job.company.location}</span>
                  </div>
                )}
                {job.company.founded && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Founded:</span>
                    <span>{job.company.founded}</span>
                  </div>
                )}
              </div>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </Card>
          )}

          {/* Posted By */}
          <Card padding="lg">
            <h3 className="font-bold text-lg text-dark-900 mb-4">
              Posted By
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold">
                {job.poster?.profile?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-dark-900">
                  {job.poster?.profile?.fullName || 'User'}
                </p>
                <p className="text-sm text-dark-600">
                  {job.poster?.profile?.currentPosition || 'Alumni'}
                  {job.poster?.profile?.currentCompany && 
                    ` at ${job.poster.profile.currentCompany}`
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-dark-900">
                Apply for {job.title}
              </h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block font-semibold text-dark-900 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={applyForm.coverLetter}
                  onChange={(e) =>
                    setApplyForm({ ...applyForm, coverLetter: e.target.value })
                  }
                  rows={6}
                  placeholder="Tell us why you're a great fit for this role..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              {/* Resume URL */}
              <div>
                <Input
                  label="Resume / CV URL (Optional)"
                  value={applyForm.resumeUrl}
                  onChange={(e) =>
                    setApplyForm({ ...applyForm, resumeUrl: e.target.value })
                  }
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-sm text-dark-500 mt-1">
                  Link to your resume (Google Drive, Dropbox, etc.)
                </p>
              </div>

              {/* Portfolio URL */}
              <div>
                <Input
                  label="Portfolio URL (Optional)"
                  value={applyForm.portfolioUrl}
                  onChange={(e) =>
                    setApplyForm({ ...applyForm, portfolioUrl: e.target.value })
                  }
                  placeholder="https://portfolio.com"
                />
                <p className="text-sm text-dark-500 mt-1">
                  Link to your portfolio, GitHub, or personal website
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={applyLoading}
                  disabled={applyLoading}
                  fullWidth
                >
                  {applyLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applyLoading}
                >
                  Cancel
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