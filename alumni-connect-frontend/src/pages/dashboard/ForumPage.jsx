import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Search, ChevronLeft, ChevronRight, Image, Edit3, MessageSquare, Users, Sparkles, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { GET_POSTS, GET_CATEGORIES } from '../../graphql/forum.queries';
import { TOGGLE_LIKE } from '../../graphql/forum.mutations';
import PostCard from '../../components/forum/PostCard';
import CreatePostModal from '../../components/forum/CreatePostModal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const categoriesScrollRef = useRef(null);

  const { data: postsData, loading: postsLoading, refetch } = useQuery(GET_POSTS, {
    variables: {
      filter: {
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        orderBy: sortBy,
        order: 'desc',
        limit: 20,
        offset: 0
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    refetch({
      filter: {
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        orderBy: sortBy,
        order: 'desc',
        limit: 20,
        offset: 0
      }
    });
  }, [selectedCategory, sortBy, refetch]);

  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };
  const currentUser = getCurrentUser();

  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    onCompleted: () => {
      refetch();
    }
  });

  const handleLike = async (postId) => {
    try {
      await toggleLike({
        variables: {
          targetId: postId,
          type: 'post'
        }
      });
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    refetch({
      filter: {
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        orderBy: sortBy,
        order: 'desc',
        limit: 20,
        offset: 0
      }
    });
  };

  const handlePostCreated = () => {
    refetch();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const scrollCategories = (direction) => {
    if (categoriesScrollRef.current) {
      const scrollAmount = 200;
      categoriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortBy('createdAt');
  };

  const hasActiveFilters = selectedCategory || searchQuery;
  const posts = postsData?.posts?.posts || [];
  const categories = categoriesData?.categories || [];
  const pagination = postsData?.posts?.pagination;

  if (postsLoading && !postsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg shadow-primary-500/20">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-dark-900">
                Forum Diskusi
              </h1>
            </div>
            <p className="text-dark-600 text-sm sm:text-base">
              Berbagi pengalaman dan diskusi dengan sesama alumni
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowCreateModal(true)}
            className="w-full lg:w-auto shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30"
          >
            Buat Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters & Categories */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-3" style={{ maxHeight: 'calc(100vh - 100px)' }}>
              {/* Search Card */}
              <Card padding="md" className="animate-fade-in-up">
                <form onSubmit={handleSearch} className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Cari diskusi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-dark-50/50"
                    />
                  </div>
                  <Button type="submit" variant="primary" fullWidth size="sm">
                    <Search className="w-3 h-3 mr-1" />
                    Cari
                  </Button>
                </form>

                {/* Sort Options */}
                <div className="mt-3 pt-3 border-t border-dark-100">
                  <h4 className="font-semibold text-xs text-dark-500 mb-2 uppercase">Urutkan</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSortChange('createdAt')}
                      className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${sortBy === 'createdAt' ? 'bg-primary-500 text-white' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                        }`}
                    >
                      Terbaru
                    </button>
                    <button
                      onClick={() => handleSortChange('views')}
                      className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${sortBy === 'views' ? 'bg-primary-500 text-white' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                        }`}
                    >
                      Populer
                    </button>
                  </div>
                </div>
              </Card>

              {/* Categories Filter */}
              <Card padding="md" className="animate-fade-in-up hidden lg:block">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-xs text-dark-500 uppercase flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" />
                    Kategori
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-medium transition-all ${!selectedCategory ? 'bg-primary-100 text-primary-700' : 'text-dark-600 hover:bg-dark-50'
                      }`}
                  >
                    <span>Semua</span>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-medium transition-all ${selectedCategory === category.id ? 'bg-primary-100 text-primary-700' : 'text-dark-600 hover:bg-dark-50'
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-dark-400">{category.postsCount}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Quick Tips */}
              <Card padding="md" className="animate-fade-in-up hidden lg:block bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Tips Forum</h3>
                </div>
                <p className="text-white/90 text-xs mb-3">
                  Diskusi menarik akan mendapat lebih banyak engagement!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 text-xs py-1"
                  onClick={() => setShowCreateModal(true)}
                >
                  Mulai Diskusi
                </Button>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowFilters(!showFilters)}
                icon={<SlidersHorizontal className="w-5 h-5" />}
              >
                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            {showFilters && (
              <Card padding="lg" className="lg:hidden mb-4 animate-fade-in">
                <div className="space-y-4">
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategorySelect(e.target.value || null)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="createdAt">Terbaru</option>
                    <option value="views">Terpopuler</option>
                  </select>

                  {hasActiveFilters && (
                    <Button variant="outline" fullWidth onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Hapus Filter
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* LinkedIn-style Start Post Card */}
            <Card padding="lg" className="mb-4 animate-fade-in-up">
              <div className="flex items-center gap-4">
                {currentUser?.profile?.avatar ? (
                  <img
                    src={currentUser.profile.avatar}
                    alt={currentUser.profile.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                    {currentUser?.profile?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 px-4 py-3 text-left bg-dark-50 hover:bg-dark-100 rounded-full text-dark-500 transition-colors"
                >
                  Mulai diskusi baru...
                </button>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-200">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-dark-600 hover:bg-dark-100 rounded-lg transition-colors"
                >
                  <Image className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Foto</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-dark-600 hover:bg-dark-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Tulis Artikel</span>
                </button>
              </div>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 animate-fade-in-up">
              <p className="text-dark-600">
                <span className="font-bold text-dark-900 text-lg">{pagination?.total || posts.length}</span>{' '}
                diskusi {hasActiveFilters ? 'ditemukan' : 'tersedia'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Hapus filter
                </button>
              )}
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
              <Card padding="xl" className="text-center animate-fade-in-up">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
                  {selectedCategory ? 'Tidak Ada Postingan di Kategori Ini' : 'Belum Ada Diskusi'}
                </h3>
                <p className="text-dark-600 mb-6 max-w-sm mx-auto">
                  {selectedCategory ? 'Coba pilih kategori lain atau jadilah yang pertama memposting!' : 'Jadilah yang pertama memulai diskusi!'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Hapus Filter
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Buat Post Pertama
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PostCard
                      post={post}
                      onLike={handleLike}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {pagination?.hasMore && (
              <div className="text-center mt-8 animate-fade-in-up">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handlePostCreated}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ForumPage;