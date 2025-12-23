import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CampaignCard = ({ campaign }) => {
  const formatAmount = (amount, currency) => {
    if (currency === 'IDR') {
      if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}M`;
      }
      if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}jt`;
      }
      return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
    }
    return `$${new Intl.NumberFormat('en-US').format(amount)}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Pendidikan': 'bg-blue-100 text-blue-700',
      'Kesehatan': 'bg-red-100 text-red-700',
      'Bencana': 'bg-orange-100 text-orange-700',
      'Sosial': 'bg-green-100 text-green-700',
      'Bisnis': 'bg-purple-100 text-purple-700',
      'Teknologi': 'bg-cyan-100 text-cyan-700',
      'Lingkungan': 'bg-emerald-100 text-emerald-700',
      'Lainnya': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const percentage = Math.min(campaign.percentage || 0, 100);
  const isCompleted = percentage >= 100;
  const isEnded = campaign.daysLeft === 0;

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
        {campaign.coverImage ? (
          <img
            src={campaign.coverImage}
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
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(campaign.category)}`}>
            {campaign.category}
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
              {formatAmount(campaign.currentAmount, campaign.currency)}
            </span>
            <span className="text-dark-500">
              terkumpul dari {formatAmount(campaign.goalAmount, campaign.currency)}
            </span>
          </div>
          <div className="w-full h-3 bg-dark-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-green-500' : 'bg-gradient-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-dark-500">
            <span className="font-semibold">{percentage.toFixed(1)}%</span>
            <span>{campaign.daysLeft} hari lagi</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-200">
          <div className="flex items-center gap-4 text-sm text-dark-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{campaign.donationsCount} donatur</span>
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