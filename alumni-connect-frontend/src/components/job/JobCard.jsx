import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Users, 
  Clock,
  Bookmark,
  CheckCircle
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const JobCard = ({ job, onSave }) => {
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Negotiable';
    const formatNumber = (num) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
      return num;
    };
    
    if (currency === 'IDR') {
      if (min && max) return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
      if (min) return `Rp ${formatNumber(min)}+`;
      return `Up to Rp ${formatNumber(max)}`;
    }
    
    if (min && max) return `$${min/1000}k - $${max/1000}k`;
    if (min) return `$${min/1000}k+`;
    return `Up to $${max/1000}k`;
  };

  const getTypeColor = (type) => {
    const colors = {
      FULL_TIME: 'bg-green-100 text-green-700',
      PART_TIME: 'bg-blue-100 text-blue-700',
      CONTRACT: 'bg-purple-100 text-purple-700',
      INTERNSHIP: 'bg-orange-100 text-orange-700',
      FREELANCE: 'bg-pink-100 text-pink-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getLevelColor = (level) => {
    const colors = {
      ENTRY: 'bg-blue-100 text-blue-700',
      JUNIOR: 'bg-cyan-100 text-cyan-700',
      MID: 'bg-purple-100 text-purple-700',
      SENIOR: 'bg-orange-100 text-orange-700',
      LEAD: 'bg-red-100 text-red-700',
      MANAGER: 'bg-pink-100 text-pink-700',
      DIRECTOR: 'bg-indigo-100 text-indigo-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const formatType = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const days = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari yang lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu yang lalu`;
    return `${Math.floor(days / 30)} bulan yang lalu`;
  };

  return (
    <Card hover padding="lg" className="relative animate-fade-in">
      {job.hasApplied && (
        <div className="absolute top-4 right-4">
          <Badge variant="success" icon={<CheckCircle className="w-4 h-4" />}>
            Applied
          </Badge>
        </div>
      )}

      <div className="flex gap-4">
        <Link to={`/dashboard/jobs/${job.id}`} className="flex-shrink-0">
          {job.company?.logo ? (
            <img 
              src={job.company.logo} 
              alt={job.company.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-dark-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl">
              {job.company?.name?.charAt(0) || job.poster?.profile?.fullName?.charAt(0) || 'J'}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <Link to={`/dashboard/jobs/${job.id}`}>
              <h3 className="font-display font-bold text-xl text-dark-900 hover:text-primary-600 transition-colors mb-1">
                {job.title}
              </h3>
            </Link>
            <p className="text-dark-700 font-semibold">
              {job.company?.name || job.poster?.profile?.fullName || 'Company'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-3 text-sm text-dark-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
              {job.isRemote && <span className="text-primary-600 font-semibold">• Remote</span>}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeAgo(job.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(job.type)}`}>
              {formatType(job.type)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(job.level)}`}>
              {job.level}
            </span>
            {job.skills?.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-dark-100 text-dark-700 rounded-full text-xs font-semibold">
                {skill}
              </span>
            ))}
            {job.skills?.length > 3 && (
              <span className="px-3 py-1 bg-dark-100 text-dark-500 rounded-full text-xs">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-dark-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.applicationsCount} applicants</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSave(job.id)}
                className={`p-2 rounded-lg transition-colors ${
                  job.isSaved
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                }`}
                title={job.isSaved ? 'Unsave' : 'Save'}
              >
                <Bookmark className={`w-5 h-5 ${job.isSaved ? 'fill-current' : ''}`} />
              </button>
              <Link to={`/dashboard/jobs/${job.id}`}>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
