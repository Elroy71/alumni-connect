import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Activity, MessageCircle, Heart, Eye, ArrowRight, FileText, MoreHorizontal } from 'lucide-react';
import { GET_USER_POSTS } from '../../graphql/forum.queries';
import Card from '../ui/Card';

// Default placeholder image for posts without media
const DEFAULT_POST_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjBGNEY4Ii8+CjxwYXRoIGQ9Ik0xNzUgMTMwSDIyNVYxNzBIMTc1VjEzMFoiIGZpbGw9IiNDQkQ1RTEiLz4KPGNpcmNsZSBjeD0iMTkwIiBjeT0iMTIwIiByPSIxNSIgZmlsbD0iI0NCRDVFMSIvPgo8cGF0aCBkPSJNMTUwIDE4MEwyMDAgMTQwTDI1MCAxODAiIHN0cm9rZT0iI0NCRDVFMSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';

const ActivitySection = ({ userId }) => {
    const [activeTab, setActiveTab] = useState('posts');

    const { data, loading } = useQuery(GET_USER_POSTS, {
        variables: { userId, limit: 2 },
        skip: !userId
    });

    const posts = data?.userPosts || [];

    if (!loading && posts.length === 0) {
        return null;
    }

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

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...selengkapnya';
    };

    const getPostImage = (post) => {
        if (post.mediaType === 'IMAGE' && post.mediaUrl) {
            return post.mediaUrl;
        }
        if (post.coverImage) {
            return post.coverImage;
        }
        return DEFAULT_POST_IMAGE;
    };

    if (loading) {
        return (
            <Card padding="lg">
                <div className="animate-pulse">
                    <div className="h-6 bg-dark-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-64 bg-dark-100 rounded-xl"></div>
                        <div className="h-64 bg-dark-100 rounded-xl"></div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card padding="lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="font-display font-bold text-xl text-dark-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-600" />
                        Aktivitas
                    </h2>
                    <p className="text-sm text-primary-600">{posts.length} postingan terbaru</p>
                </div>
                <Link
                    to="/dashboard/forum/create"
                    className="px-4 py-2 border border-primary-600 text-primary-600 rounded-full font-semibold text-sm hover:bg-primary-50 transition-colors"
                >
                    Buat posting
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'posts'
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                        }`}
                >
                    Postingan
                </button>
                <button
                    onClick={() => setActiveTab('comments')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${activeTab === 'comments'
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                        }`}
                >
                    Komentar
                </button>
            </div>

            {/* Posts Grid - 2 Columns like LinkedIn */}
            {activeTab === 'posts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="border border-dark-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white"
                        >
                            {/* Post Header */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {post.user?.profile?.avatar ? (
                                            <img
                                                src={post.user.profile.avatar}
                                                alt={post.user.profile.fullName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                                {post.user?.profile?.fullName?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-dark-900 text-sm">
                                                {post.user?.profile?.fullName || 'User'}
                                            </p>
                                            <p className="text-xs text-dark-500">{formatDate(post.createdAt)}</p>
                                        </div>
                                    </div>
                                    <button className="p-1 hover:bg-dark-100 rounded-full">
                                        <MoreHorizontal className="w-5 h-5 text-dark-500" />
                                    </button>
                                </div>

                                {/* Post Content */}
                                <Link to={`/dashboard/forum/post/${post.id}`}>
                                    <p className="text-dark-700 text-sm mb-3 line-clamp-3 hover:text-dark-900">
                                        {truncateText(post.content || post.excerpt, 150)}
                                    </p>

                                    {/* Post Title with Category */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="font-semibold text-dark-900 text-sm hover:text-primary-600 line-clamp-1">
                                            {post.title}
                                        </h3>
                                        {post.category && (
                                            <span
                                                className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                                                style={{
                                                    backgroundColor: `${post.category.color}20`,
                                                    color: post.category.color
                                                }}
                                            >
                                                {post.category.name}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>

                            {/* Post Image */}
                            <Link to={`/dashboard/forum/post/${post.id}`}>
                                {post.mediaType === 'PDF' ? (
                                    <div className="w-full h-48 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                                        <FileText className="w-16 h-16 text-red-500 mb-2" />
                                        <span className="text-sm text-red-600 font-medium">Dokumen PDF</span>
                                    </div>
                                ) : (
                                    <img
                                        src={getPostImage(post)}
                                        alt={post.title}
                                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                                        onError={(e) => {
                                            e.target.src = DEFAULT_POST_IMAGE;
                                        }}
                                    />
                                )}
                            </Link>

                            {/* Post Stats */}
                            <div className="px-4 py-3 border-t border-dark-100">
                                <div className="flex items-center justify-between text-sm text-dark-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {post.likesCount || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            {post.commentsCount || 0} komentar
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {post.views || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
                <div className="text-center py-8 text-dark-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-dark-300" />
                    <p>Belum ada komentar yang ditampilkan</p>
                </div>
            )}

            {/* View All Link */}
            <Link
                to="/dashboard/forum"
                className="block text-center py-4 text-primary-600 hover:text-primary-700 font-semibold text-sm mt-4"
            >
                Lihat semua aktivitas
            </Link>
        </Card>
    );
};

export default ActivitySection;
