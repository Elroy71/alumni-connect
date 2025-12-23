import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  Bookmark,
  CheckCircle,
  Building2,
  Wifi,
  TrendingUp
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const JobCard = ({ job, onSave, variant = 'default' }) => {
  const formatSalary = (min, max, currency = 'IDR') => {
    if (!min && !max) return 'Negotiable';
    const formatNumber = (num) => {
      if (currency === 'IDR') {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}M`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(0)}jt`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
        return num.toLocaleString('id-ID');
      }
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
      return num;
    };

    const prefix = currency === 'IDR' ? 'Rp ' : '$';
    if (min && max) return `${prefix}${formatNumber(min)} - ${prefix}${formatNumber(max)}`;
    if (min) return `${prefix}${formatNumber(min)}+`;
    return `Up to ${prefix}${formatNumber(max)}`;
  };

  const getTypeStyle = (type) => {
    const styles = {
      FULL_TIME: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      PART_TIME: 'bg-blue-50 text-blue-700 border border-blue-200',
      CONTRACT: 'bg-purple-50 text-purple-700 border border-purple-200',
      INTERNSHIP: 'bg-amber-50 text-amber-700 border border-amber-200',
      FREELANCE: 'bg-pink-50 text-pink-700 border border-pink-200'
    };
    return styles[type] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getLevelStyle = (level) => {
    const styles = {
      ENTRY: 'bg-sky-50 text-sky-700',
      JUNIOR: 'bg-cyan-50 text-cyan-700',
      MID: 'bg-violet-50 text-violet-700',
      SENIOR: 'bg-orange-50 text-orange-700',
      LEAD: 'bg-red-50 text-red-700',
      MANAGER: 'bg-rose-50 text-rose-700',
      DIRECTOR: 'bg-indigo-50 text-indigo-700'
    };
    return styles[level] || 'bg-gray-50 text-gray-700';
  };

  const formatType = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  };

  const companyName = job.company?.name || job.poster?.profile?.fullName || 'Company';
  const companyLogo = job.company?.logo;
  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <Card
      hover
      padding="none"
      className={`relative overflow-hidden group ${job.hasApplied ? 'ring-2 ring-green-200' : ''}`}
    >
      {/* Applied Badge */}
      {job.hasApplied && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl flex items-center gap-1.5 shadow-lg">
          <CheckCircle className="w-3.5 h-3.5" />
          Applied
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex gap-4">
          {/* Company Logo */}
          <Link to={`/dashboard/jobs/${job.id}`} className="flex-shrink-0">
            {companyLogo ? (
              <div className="relative">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-dark-100 shadow-md group-hover:shadow-lg transition-shadow"
                />
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-md group-hover:shadow-lg transition-shadow">
                {companyInitial}
              </div>
            )}
          </Link>

          {/* Job Content */}
          <div className="flex-1 min-w-0">
            {/* Title & Company */}
            <div className="mb-3">
              <Link to={`/dashboard/jobs/${job.id}`} className="block">
                <h3 className="font-display font-bold text-lg sm:text-xl text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-dark-400" />
                <p className="text-dark-600 font-medium text-sm sm:text-base">
                  {companyName}
                </p>
                {job.company?.industry && (
                  <span className="text-dark-400 text-sm hidden sm:inline">• {job.company.industry}</span>
                )}
              </div>
            </div>

            {/* Meta Info Grid */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 text-sm text-dark-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-dark-400" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
              {job.isRemote && (
                <div className="flex items-center gap-1.5 text-primary-600 font-semibold">
                  <Wifi className="w-4 h-4" />
                  <span>Remote</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-dark-400" />
                <span className="font-semibold text-dark-700">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeStyle(job.type)}`}>
                {formatType(job.type)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelStyle(job.level)}`}>
                {job.level}
              </span>
              {job.skills?.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-dark-50 text-dark-600 rounded-full text-xs font-medium border border-dark-100"
                >
                  {skill}
                </span>
              ))}
              {job.skills?.length > 2 && (
                <span className="px-3 py-1 bg-dark-50 text-dark-400 rounded-full text-xs font-medium border border-dark-100">
                  +{job.skills.length - 2}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-dark-100">
              <div className="flex items-center gap-4 text-xs sm:text-sm text-dark-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{job.applicationsCount || 0} pelamar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{timeAgo(job.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave(job.id);
                  }}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${job.isSaved
                      ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                      : 'bg-dark-50 text-dark-400 hover:bg-dark-100 hover:text-dark-600'
                    }`}
                  title={job.isSaved ? 'Tersimpan' : 'Simpan'}
                >
                  <Bookmark className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`} />
                </button>
                <Link to={`/dashboard/jobs/${job.id}`}>
                  <Button variant="primary" size="sm" className="hidden sm:flex">
                    Lihat Detail
                  </Button>
                  <Button variant="primary" size="sm" className="sm:hidden">
                    Lihat
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:via-transparent group-hover:to-secondary-500/5 transition-all duration-500 pointer-events-none" />
    </Card>
  );
};

export default JobCard;
