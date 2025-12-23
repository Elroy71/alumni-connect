import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Search, Filter } from 'lucide-react';
import { GET_POSTS, GET_CATEGORIES } from '../../graphql/forum.queries';
import { TOGGLE_LIKE } from '../../graphql/forum.mutations';
import PostCard from '../../components/forum/PostCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ForumPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');

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
    }
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

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
    refetch();
  };

  if (postsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const posts = postsData?.posts?.posts || [];
  const categories = categoriesData?.categories || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
            Forum Diskusi
          </h1>
          <p className="text-dark-600">
            Berbagi pengalaman dan diskusi dengan sesama alumni
          </p>
        </div>
        <Link to="/dashboard/forum/create">
          <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
            Buat Post
          </Button>
        </Link>
      </div>

      {/* Search & Filter */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              placeholder="Cari diskusi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </form>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              refetch();
            }}
            className="px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
          >
            <option value="createdAt">Terbaru</option>
            <option value="views">Terpopuler</option>
          </select>
        </div>
      </Card>

      {/* Categories */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-dark-600" />
          <h3 className="font-semibold text-dark-900">Kategori</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory(null);
              refetch();
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              !selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                refetch();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined
              }}
            >
              {category.name} ({category.postsCount})
            </button>
          ))}
        </div>
      </Card>

      {/* Posts List */}
      {posts.length === 0 ? (
        <Card padding="xl" className="text-center">
          <div className="w-24 h-24 mx-auto bg-dark-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-dark-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-dark-900 mb-2">
            Belum Ada Diskusi
          </h3>
          <p className="text-dark-600 mb-6">
            Jadilah yang pertama memulai diskusi!
          </p>
          <Link to="/dashboard/forum/create">
            <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              Buat Post Pertama
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {postsData?.posts?.pagination?.hasMore && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForumPage;