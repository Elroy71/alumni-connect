import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { X, Image, FileText, Smile, Globe, ChevronDown } from 'lucide-react';
import { CREATE_POST } from '../../graphql/forum.mutations';
import { GET_CATEGORIES } from '../../graphql/forum.queries';
import Button from '../ui/Button';

const CreatePostModal = ({ isOpen, onClose, onSuccess, currentUser }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [mediaType, setMediaType] = useState(null); // 'IMAGE' | 'PDF' | null
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaData, setMediaData] = useState(null);
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);
    const modalRef = useRef(null);

    const { data: categoriesData } = useQuery(GET_CATEGORIES);
    const [createPost, { loading }] = useMutation(CREATE_POST, {
        onCompleted: (data) => {
            resetForm();
            onSuccess?.(data.createPost);
            onClose();
        },
        onError: (error) => {
            console.error('Create post error:', error);
            setErrors({ submit: error.message });
        }
    });

    const categories = categoriesData?.categories || [];

    // Common emojis for quick access
    const commonEmojis = ['😊', '👍', '🎉', '🔥', '💡', '❤️', '👏', '🚀', '✨', '💪', '🙏', '😂'];

    const resetForm = () => {
        setContent('');
        setTitle('');
        setSelectedCategory(null);
        setMediaType(null);
        setMediaPreview(null);
        setMediaData(null);
        setErrors({});
        setShowEmojiPicker(false);
        setShowCategoryDropdown(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleImageSelect = () => {
        if (mediaType && mediaType !== 'IMAGE') return;
        fileInputRef.current?.click();
    };

    const handlePdfSelect = () => {
        if (mediaType && mediaType !== 'PDF') return;
        pdfInputRef.current?.click();
    };

    const handleFileChange = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ media: 'Ukuran file maksimal 5MB' });
            return;
        }

        // Validate file type
        if (type === 'IMAGE' && !file.type.startsWith('image/')) {
            setErrors({ media: 'Harap pilih file gambar' });
            return;
        }
        if (type === 'PDF' && file.type !== 'application/pdf') {
            setErrors({ media: 'Harap pilih file PDF' });
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            setMediaData(event.target.result);
            setMediaType(type);
            setMediaPreview({
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                url: type === 'IMAGE' ? event.target.result : null
            });
            setErrors({});
        };
        reader.onerror = () => {
            setErrors({ media: 'Gagal membaca file' });
        };
        reader.readAsDataURL(file);

        // Reset input
        e.target.value = '';
    };

    const handleRemoveMedia = () => {
        setMediaType(null);
        setMediaPreview(null);
        setMediaData(null);
    };

    const addEmoji = (emoji) => {
        setContent(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Judul harus diisi';
        } else if (title.length < 10) {
            newErrors.title = 'Judul minimal 10 karakter';
        }

        if (!content.trim()) {
            newErrors.content = 'Konten harus diisi';
        } else if (content.length < 20) {
            newErrors.content = 'Konten minimal 20 karakter';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createPost({
                variables: {
                    input: {
                        title: title.trim(),
                        content: content.trim(),
                        excerpt: content.substring(0, 200),
                        categoryId: selectedCategory?.id || undefined,
                        mediaType: mediaType || undefined,
                        mediaUrl: mediaData || undefined,
                    }
                }
            });
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const userName = currentUser?.profile?.fullName || currentUser?.email || 'User';
    const userAvatar = currentUser?.profile?.avatar;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden animate-slide-up"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-200">
                    <div className="flex items-center gap-3">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                {userName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-dark-900">{userName}</p>
                            <button className="flex items-center gap-1 text-sm text-dark-600 hover:text-dark-900">
                                <Globe className="w-4 h-4" />
                                <span>Posting ke Semua orang</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-dark-100 transition-colors"
                    >
                        <X className="w-6 h-6 text-dark-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    {/* Title Input */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                        }}
                        placeholder="Judul postingan..."
                        className={`w-full text-xl font-semibold text-dark-900 placeholder-dark-400 border-none outline-none mb-2 ${errors.title ? 'border-b-2 border-red-500' : ''
                            }`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mb-2">{errors.title}</p>
                    )}

                    {/* Content Textarea */}
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
                        }}
                        placeholder="Apa yang ingin Anda bicarakan?"
                        rows={6}
                        className="w-full text-dark-800 placeholder-dark-400 border-none outline-none resize-none"
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm">{errors.content}</p>
                    )}

                    {/* Media Preview */}
                    {mediaPreview && (
                        <div className="mt-4 relative">
                            {mediaType === 'IMAGE' && mediaPreview.url && (
                                <div className="relative rounded-xl overflow-hidden">
                                    <img
                                        src={mediaPreview.url}
                                        alt="Preview"
                                        className="w-full max-h-64 object-cover"
                                    />
                                    <button
                                        onClick={handleRemoveMedia}
                                        className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            )}
                            {mediaType === 'PDF' && (
                                <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-xl">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-dark-900">{mediaPreview.name}</p>
                                        <p className="text-sm text-dark-500">{mediaPreview.size}</p>
                                    </div>
                                    <button
                                        onClick={handleRemoveMedia}
                                        className="p-2 hover:bg-dark-200 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-dark-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {errors.media && (
                        <p className="text-red-500 text-sm mt-2">{errors.media}</p>
                    )}

                    {/* Category Selector */}
                    <div className="mt-4 relative">
                        <button
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-dark-300 hover:bg-dark-50 transition-colors"
                        >
                            {selectedCategory ? (
                                <>
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: selectedCategory.color }}
                                    />
                                    <span className="text-dark-800">{selectedCategory.name}</span>
                                </>
                            ) : (
                                <span className="text-dark-500">Pilih Kategori</span>
                            )}
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showCategoryDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-dark-200 py-2 z-10">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setShowCategoryDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-dark-50 text-dark-600"
                                >
                                    Tanpa Kategori
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setShowCategoryDropdown(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-dark-50 flex items-center gap-2"
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="text-dark-800">{cat.name}</span>
                                        <span className="text-dark-400 text-sm ml-auto">({cat.postsCount})</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div className="mt-4 p-3 bg-dark-50 rounded-xl">
                            <div className="flex flex-wrap gap-2">
                                {commonEmojis.map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => addEmoji(emoji)}
                                        className="text-2xl hover:bg-dark-200 p-2 rounded-lg transition-colors"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-dark-200 bg-dark-50">
                    <div className="flex items-center justify-between">
                        {/* Media Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleImageSelect}
                                disabled={mediaType === 'PDF'}
                                className={`p-3 rounded-full transition-colors ${mediaType === 'PDF'
                                        ? 'text-dark-300 cursor-not-allowed'
                                        : mediaType === 'IMAGE'
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-dark-600 hover:bg-dark-200'
                                    }`}
                                title="Tambah Gambar"
                            >
                                <Image className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handlePdfSelect}
                                disabled={mediaType === 'IMAGE'}
                                className={`p-3 rounded-full transition-colors ${mediaType === 'IMAGE'
                                        ? 'text-dark-300 cursor-not-allowed'
                                        : mediaType === 'PDF'
                                            ? 'text-red-600 bg-red-50'
                                            : 'text-dark-600 hover:bg-dark-200'
                                    }`}
                                title="Tambah Dokumen PDF"
                            >
                                <FileText className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-3 rounded-full transition-colors ${showEmojiPicker
                                        ? 'text-yellow-600 bg-yellow-50'
                                        : 'text-dark-600 hover:bg-dark-200'
                                    }`}
                                title="Tambah Emoji"
                            >
                                <Smile className="w-6 h-6" />
                            </button>

                            {/* Hidden file inputs */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'IMAGE')}
                            />
                            <input
                                ref={pdfInputRef}
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'PDF')}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={loading || !content.trim() || !title.trim()}
                        >
                            {loading ? 'Memposting...' : 'Posting'}
                        </Button>
                    </div>

                    {errors.submit && (
                        <p className="text-red-500 text-sm mt-2 text-center">{errors.submit}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
