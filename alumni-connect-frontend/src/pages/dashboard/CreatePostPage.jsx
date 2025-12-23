import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon, Hash, X } from 'lucide-react';
import { GET_CATEGORIES } from '../../graphql/forum.queries';
import { CREATE_POST } from '../../graphql/forum.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      navigate(`/dashboard/forum/post/${data.createPost.id}`);
    },
    onError: (error) => {
      console.error('Create post error:', error);
      alert(error.message);
    }
  });

  const categories = categoriesData?.categories || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul harus diisi';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Judul minimal 10 karakter';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Konten harus diisi';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Konten minimal 50 karakter';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Pilih kategori';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content,
            excerpt: formData.content.substring(0, 200),
            categoryId: formData.categoryId,
            tags: formData.tags.length > 0 ? formData.tags : undefined
          }
        }
      });
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/forum')}
          className="w-10 h-10 rounded-lg bg-dark-100 hover:bg-dark-200 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900">
            Buat Diskusi Baru
          </h1>
          <p className="text-dark-600">
            Bagikan pemikiran atau pertanyaan Anda
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Card padding="lg">
          <h3 className="font-bold text-lg text-dark-900 mb-4">
            Judul Diskusi
          </h3>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Tuliskan judul yang menarik..."
            error={errors.title}
            className="text-xl"
          />
          <p className="text-sm text-dark-500 mt-2">
            {formData.title.length} / 200 karakter
          </p>
        </Card>

        {/* Category */}
        <Card padding="lg">
          <h3 className="font-bold text-lg text-dark-900 mb-4">
            Kategori
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, categoryId: category.id }));
                  setErrors(prev => ({ ...prev, categoryId: '' }));
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.categoryId === category.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-dark-200 hover:border-dark-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon || '📁'}</div>
                <p className="font-semibold text-dark-900">{category.name}</p>
                <p className="text-xs text-dark-500 mt-1">
                  {category.postsCount} posts
                </p>
              </button>
            ))}
          </div>
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-2">{errors.categoryId}</p>
          )}
        </Card>

        {/* Content */}
        <Card padding="lg">
          <h3 className="font-bold text-lg text-dark-900 mb-4">
            Konten
          </h3>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            placeholder="Tuliskan konten diskusi Anda dengan detail..."
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
              errors.content
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }`}
          />
          {errors.content && (
            <p className="text-red-600 text-sm mt-2">{errors.content}</p>
          )}
          <p className="text-sm text-dark-500 mt-2">
            {formData.content.length} karakter (minimal 50)
          </p>
        </Card>

        {/* Tags */}
        <Card padding="lg">
          <h3 className="font-bold text-lg text-dark-900 mb-4">
            Tags (Opsional)
          </h3>
          
          {/* Tag Input */}
          <div className="flex gap-2 mb-4">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Tambah tag..."
              icon={<Hash className="w-5 h-5" />}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              Tambah
            </Button>
          </div>

          {/* Tags List */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card padding="lg">
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={<Save className="w-5 h-5" />}
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Mempublikasikan...' : 'Publikasikan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard/forum')}
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreatePostPage;