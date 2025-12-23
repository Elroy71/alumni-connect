import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Eye, 
  Send,
  Trash2,
  Calendar,
  Briefcase,
  Award
} from 'lucide-react';
import { GET_POST, GET_COMMENTS } from '../../graphql/forum.queries';
import { CREATE_COMMENT, TOGGLE_LIKE, DELETE_POST } from '../../graphql/forum.mutations';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import useAuthStore from '../../features/auth/store/authStore';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const { data: postData, loading: postLoading, refetch: refetchPost } = useQuery(GET_POST, {
    variables: { id }
  });

  const { data: commentsData, refetch: refetchComments } = useQuery(GET_COMMENTS, {
    variables: { postId: id, limit: 50 }
  });

  const [createComment, { loading: commentLoading }] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setCommentText('');
      setReplyTo(null);
      refetchComments();
      refetchPost();
    }
  });

  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    onCompleted: () => {
      refetchPost();
    }
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      navigate('/dashboard/forum');
    }
  });

  const post = postData?.post;
  const comments = commentsData?.comments || [];

  const handleLike = async () => {
    try {
      await toggleLike({
        variables: {
          targetId: id,
          type: 'post'
        }
      });
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        variables: {
          postId: id,
          content: commentText,
          parentId: replyTo?.id || undefined
        }
      });
    } catch (error) {
      console.error('Comment error:', error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus post ini?')) return;

    try {
      await deletePost({
        variables: { id }
      });
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <Card padding="xl" className="text-center">
        <h2 className="font-bold text-xl text-dark-900 mb-2">Post Tidak Ditemukan</h2>
        <p className="text-dark-600 mb-4">Post yang Anda cari tidak ada atau telah dihapus.</p>
        <Link to="/dashboard/forum">
          <Button variant="primary">Kembali ke Forum</Button>
        </Link>
      </Card>
    );
  }

  const isOwner = user?.id === post.userId;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/forum')}
        className="flex items-center gap-2 text-dark-600 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Kembali ke Forum</span>
      </button>

      {/* Post Card */}
      <Card padding="lg">
        {/* Category Badge */}
        {post.category && (
          <div className="mb-4">
            <Badge
              variant="primary"
              style={{
                backgroundColor: `${post.category.color}20`,
                color: post.category.color
              }}
            >
              {post.category.icon} {post.category.name}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-4">
          {post.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-dark-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
              {post.user?.profile?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-bold text-dark-900">
                {post.user?.profile?.fullName || 'User'}
              </p>
              <div className="flex items-center gap-2 text-sm text-dark-600">
                <Briefcase className="w-4 h-4" />
                <span>{post.user?.profile?.currentPosition || 'Alumni'}</span>
                {post.user?.profile?.currentCompany && (
                  <>
                    <span>•</span>
                    <span>{post.user.profile.currentCompany}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-6">
          <p className="text-dark-700 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((postTag) => (
              <span
                key={postTag.tag.id}
                className="px-3 py-1 bg-dark-100 text-dark-600 rounded-full text-sm"
              >
                #{postTag.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-dark-200">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 font-semibold transition-colors ${
                post.isLiked
                  ? 'text-red-500'
                  : 'text-dark-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likesCount || 0}</span>
            </button>

            <div className="flex items-center gap-2 text-dark-600">
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">{post.commentsCount || 0}</span>
            </div>

            <div className="flex items-center gap-2 text-dark-600">
              <Eye className="w-6 h-6" />
              <span className="font-semibold">{post.views || 0}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments Section */}
      <Card padding="lg">
        <h2 className="font-display font-bold text-2xl text-dark-900 mb-6">
          Komentar ({comments.length})
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-8">
          {replyTo && (
            <div className="mb-2 p-3 bg-primary-50 rounded-lg flex items-center justify-between">
              <p className="text-sm text-primary-700">
                Membalas <span className="font-bold">{replyTo.user?.profile?.fullName}</span>
              </p>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-primary-700 hover:text-primary-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyTo ? "Tulis balasan..." : "Tulis komentar..."}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Send className="w-4 h-4" />}
                  loading={commentLoading}
                  disabled={!commentText.trim() || commentLoading}
                >
                  {commentLoading ? 'Mengirim...' : 'Kirim'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-dark-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                    {comment.user?.profile?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-dark-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-dark-900">
                          {comment.user?.profile?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-dark-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-dark-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <button
                        onClick={() => setReplyTo(comment)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Balas
                      </button>
                      <span className="text-dark-500">
                        {comment.likesCount} suka
                      </span>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {reply.user?.profile?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-dark-200 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-dark-900 text-sm">
                                {reply.user?.profile?.fullName || 'User'}
                              </p>
                              <p className="text-xs text-dark-500">
                                {formatDate(reply.createdAt)}
                              </p>
                            </div>
                            <p className="text-dark-700 text-sm whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PostDetailPage;