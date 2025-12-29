import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CampaignCard = ({ campaign }) => {
  // Calculate days left from endDate
  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  // Format amount for display
  const formatAmount = (amount) => {
    if (!amount) return 'Rp 0';
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    }
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}jt`;
    }
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  };

  // Get category display and color
  const getCategoryInfo = (category) => {
    const categories = {
      'scholarship': { label: 'Beasiswa', color: 'bg-blue-100 text-blue-700' },
      'research': { label: 'Riset', color: 'bg-purple-100 text-purple-700' },
      'event': { label: 'Event', color: 'bg-green-100 text-green-700' },
      'infrastructure': { label: 'Infrastruktur', color: 'bg-orange-100 text-orange-700' },
      'SCHOLARSHIP': { label: 'Beasiswa', color: 'bg-blue-100 text-blue-700' },
      'RESEARCH': { label: 'Riset', color: 'bg-purple-100 text-purple-700' },
      'EVENT': { label: 'Event', color: 'bg-green-100 text-green-700' },
      'INFRASTRUCTURE': { label: 'Infrastruktur', color: 'bg-orange-100 text-orange-700' },
    };
    return categories[category] || { label: category, color: 'bg-gray-100 text-gray-700' };
  };

  // Map backend fields to component usage
  const progress = campaign.progress || 0;
  const percentage = Math.min(progress, 100);
  const daysLeft = calculateDaysLeft(campaign.endDate);
  const donationsCount = campaign.donations?.length || 0;
  const isCompleted = percentage >= 100;
  const isEnded = daysLeft === 0;
  const categoryInfo = getCategoryInfo(campaign.category);

  return (
    <Card hover padding="lg" className="relative animate-fade-in">
      {campaign.hasDonated && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="success" icon={<CheckCircle className="w-4 h-4" />}>
            Donated
          </Badge>
        </div>
      )}

      {/* Cover Image */}
      <Link to={`/dashboard/funding/${campaign.id}`}>
        {campaign.imageUrl ? (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-secondary rounded-xl mb-4 flex items-center justify-center">
            <Heart className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryInfo.color}`}>
            {categoryInfo.label}
          </span>
          {isCompleted && (
            <Badge variant="success" icon={<TrendingUp className="w-3 h-3" />}>
              Funded!
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link to={`/dashboard/funding/${campaign.id}`}>
          <h3 className="font-display font-bold text-xl text-dark-900 hover:text-primary-600 transition-colors line-clamp-2">
            {campaign.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-dark-600 text-sm line-clamp-2">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-dark-900">
              {formatAmount(campaign.currentAmount)}
            </span>
            <span className="text-dark-500">
              terkumpul dari {formatAmount(campaign.targetAmount)}
            </span>
          </div>
          <div className="w-full h-3 bg-dark-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gradient-primary'
                }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-dark-500">
            <span className="font-semibold">{percentage.toFixed(1)}%</span>
            <span>{daysLeft} hari lagi</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-200">
          <div className="flex items-center gap-4 text-sm text-dark-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{donationsCount} donatur</span>
            </div>
          </div>

          <Link to={`/dashboard/funding/${campaign.id}`}>
            <Button variant="primary" size="sm" icon={<Heart className="w-4 h-4" />}>
              {isEnded ? 'Lihat Detail' : 'Donasi'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;