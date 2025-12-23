// const prisma = require('../../config/database');
import prisma from '../../config/database.js';

class ForumService {
  // ==================== POSTS ====================
  
  async createPost(userId, data) {
    const { title, content, excerpt, coverImage, categoryId, tags } = data;

    // Create post
    const post = await prisma.post.create({
      data: {
        userId,
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        coverImage,
        categoryId,
        status: 'PUBLISHED',
        tags: tags && tags.length > 0 ? {
          create: tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') }
              }
            }
          }))
        } : undefined
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    return post;
  }

  async getPosts(filter = {}) {
    const { 
      categoryId, 
      userId, 
      search, 
      status = 'PUBLISHED',
      limit = 20, 
      offset = 0,
      orderBy = 'createdAt',
      order = 'desc'
    } = filter;

    const where = {
      status,
      ...(categoryId && { categoryId }),
      ...(userId && { userId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          user: {
            include: {
              profile: {
                select: {
                  fullName: true,
                  avatar: true,
                  currentPosition: true,
                  currentCompany: true
                }
              }
            }
          },
          category: true,
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        },
        orderBy: { [orderBy]: order },
        take: limit,
        skip: offset
      }),
      prisma.post.count({ where })
    ]);

    return {
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  async getPostById(postId, userId = null) {
    // Increment views
    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } }
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if current user liked this post
    if (userId) {
      const liked = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
      post.isLiked = !!liked;
    } else {
      post.isLiked = false;
    }

    return post;
  }

  async updatePost(postId, userId, data) {
    // Check ownership
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post || post.userId !== userId) {
      throw new Error('Unauthorized to update this post');
    }

    const { title, content, excerpt, coverImage, categoryId, tags } = data;

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        categoryId,
        updatedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    return updatedPost;
  }

  async deletePost(postId, userId) {
    // Check ownership
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post || post.userId !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    return { success: true, message: 'Post deleted successfully' };
  }

  // ==================== COMMENTS ====================

  async createComment(userId, postId, content, parentId = null) {
    const comment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
        parentId
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                fullName: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      }
    });

    return comment;
  }

  async getComments(postId, limit = 50, offset = 0) {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null // Only top-level comments
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                fullName: true,
                avatar: true
              }
            }
          }
        },
        replies: {
          include: {
            user: {
              include: {
                profile: {
                  select: {
                    fullName: true,
                    avatar: true
                  }
                }
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            replies: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return comments;
  }

  async deleteComment(commentId, userId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment || comment.userId !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    return { success: true, message: 'Comment deleted successfully' };
  }

  // ==================== LIKES ====================

  async toggleLike(userId, targetId, type = 'post') {
    const likeData = {
      userId,
      ...(type === 'post' ? { postId: targetId } : { commentId: targetId })
    };

    const whereClause = type === 'post' 
      ? { userId_postId: { userId, postId: targetId } }
      : { userId_commentId: { userId, commentId: targetId } };

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: whereClause
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: whereClause
      });
      return { liked: false, message: 'Unliked' };
    } else {
      // Like
      await prisma.like.create({
        data: likeData
      });
      return { liked: true, message: 'Liked' };
    }
  }

  // ==================== CATEGORIES ====================

  async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return categories;
  }

  async createCategory(data) {
    const { name, description, icon, color } = data;
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        color
      }
    });

    return category;
  }
}

// module.exports = new ForumService();
export default new ForumService();