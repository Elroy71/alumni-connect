import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Eye, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const PostCard = ({ post, onLike }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card hover padding="lg" className="animate-fade-in">
      <div className="flex gap-4">
        {/* Avatar */}
        <Link to={`/dashboard/forum/post/${post.id}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {post.user?.profile?.fullName?.charAt(0) || 'U'}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-dark-900">
                {post.user?.profile?.fullName || 'User'}
              </p>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <span>{post.user?.profile?.currentPosition || 'Alumni'}</span>
                {post.user?.profile?.currentCompany && (
                  <>
                    <span>•</span>
                    <span>{post.user.profile.currentCompany}</span>
                  </>
                )}
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            {post.category && (
              <Badge 
                variant="primary" 
                style={{ 
                  backgroundColor: `${post.category.color}20`,
                  color: post.category.color 
                }}
              >
                {post.category.name}
              </Badge>
            )}
          </div>

          {/* Title & Content */}
          <Link to={`/dashboard/forum/post/${post.id}`}>
            <h3 className="font-display font-bold text-xl text-dark-900 mb-2 hover:text-primary-600 transition-colors">
              {post.title}
            </h3>
          </Link>

          <p className="text-dark-700 mb-4 line-clamp-3">
            {post.excerpt || post.content.substring(0, 200)}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((postTag) => (
                <span 
                  key={postTag.tag.id}
                  className="px-2 py-1 bg-dark-100 text-dark-600 text-xs rounded-full"
                >
                  #{postTag.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-dark-600">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
                post.isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} 
              />
              <span className="font-semibold">{post.likesCount || 0}</span>
            </button>

            <Link 
              to={`/dashboard/forum/post/${post.id}`}
              className="flex items-center gap-2 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{post.commentsCount || 0}</span>
            </Link>

            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span className="font-semibold">{post.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;