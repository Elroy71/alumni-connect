import prisma from '../config/database.js';
import AuthService from '../modules/auth/auth.service.js';
import ProfileService from '../modules/profile/profile.service.js';
import ForumService from '../modules/forum/forum.service.js';
import JobService from '../modules/job/job.service.js';
import FundingService from '../modules/funding/funding.service.js';

const resolvers = {
  Query: {
    // ==================== AUTH QUERIES ====================
    me: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');

      const user = await prisma.user.findUnique({
        where: { id: context.user.userId },
        include: { profile: true }
      });

      return user;
    },

    // ==================== PROFILE QUERIES ====================
    profile: async (_, { userId }) => {
      return await ProfileService.getProfile(userId);
    },

    profiles: async (_, { filter }) => {
      return await ProfileService.getProfiles(filter);
    },

    // ==================== FORUM QUERIES ====================
    posts: async (_, { filter }) => {
      return await ForumService.getPosts(filter);
    },

    post: async (_, { id }, context) => {
      const userId = context.user?.userId || null;
      return await ForumService.getPostById(id, userId);
    },

    myPosts: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.getMyPosts(context.user.userId);
    },

    comments: async (_, { postId, limit, offset }) => {
      return await ForumService.getComments(postId, limit, offset);
    },

    categories: async () => {
      return await ForumService.getCategories();
    },

    // ==================== JOB QUERIES ====================
    jobs: async (_, { filter }, context) => {
      const userId = context.user?.userId || null;
      return await JobService.getJobs(filter, userId);
    },

    job: async (_, { id }, context) => {
      const userId = context.user?.userId || null;
      return await JobService.getJobById(id, userId);
    },

    myPostedJobs: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.getMyPostedJobs(context.user.userId);
    },

    myApplications: async (_, { status }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.getMyApplications(context.user.userId, { status });
    },

    mySavedJobs: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.getSavedJobs(context.user.userId);
    },

    companies: async () => {
      return await JobService.getCompanies();
    },

    company: async (_, { id }) => {
      return await JobService.getCompanyById(id);
    },

    // ==================== FUNDING QUERIES ====================
    campaigns: async (_, { filter }) => {
      return await FundingService.getCampaigns(filter);
    },

    campaign: async (_, { id }, context) => {
      return await FundingService.getCampaignById(id, context.user);
    },

    myCampaigns: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.getMyCampaigns(context.user.userId);
    },

    myDonations: async (_, { status }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.getMyDonations(context.user.userId, status);
    },

    publicDonations: async (_, { campaignId }) => {
      return await FundingService.getPublicDonations(campaignId);
    },
  },

  Mutation: {
    // ==================== AUTH MUTATIONS ====================
    register: async (_, { input }) => {
      console.log('📝 Register mutation called for:', input.email);

      try {
        const result = await AuthService.register(input);
        console.log('✅ Registration successful:', result.user.email);
        return result;
      } catch (error) {
        console.error('❌ Registration error:', error.message);
        throw error;
      }
    },

    login: async (_, { input }) => {
      console.log('🔐 Login mutation called for:', input.email);

      try {
        const { email, password } = input;
        const result = await AuthService.login(email, password);
        console.log('✅ Login successful:', result.user.email);
        return result;
      } catch (error) {
        console.error('❌ Login error:', error.message);
        throw error;
      }
    },

    // ==================== PROFILE MUTATIONS ====================
    updateProfile: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ProfileService.updateProfile(context.user.userId, input);
    },

    // ==================== FORUM MUTATIONS ====================
    createPost: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.createPost(context.user.userId, input);
    },

    updatePost: async (_, { id, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.updatePost(id, context.user.userId, input);
    },

    deletePost: async (_, { id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.deletePost(id, context.user.userId);
    },

    toggleLikePost: async (_, { postId }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.toggleLike(context.user.userId, postId, 'post');
    },

    toggleLike: async (_, { targetId, type }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.toggleLike(context.user.userId, targetId, type);
    },

    createComment: async (_, { postId, content, parentId }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.createComment(context.user.userId, postId, content, parentId);
    },

    updateComment: async (_, { id, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.updateComment(id, context.user.userId, input);
    },

    deleteComment: async (_, { id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.deleteComment(id, context.user.userId);
    },

    toggleLikeComment: async (_, { commentId }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.toggleLikeComment(commentId, context.user.userId);
    },

    // ==================== JOB MUTATIONS ====================
    createJob: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.createJob(context.user.userId, input);
    },

    updateJob: async (_, { id, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.updateJob(id, context.user.userId, input);
    },

    deleteJob: async (_, { id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.deleteJob(id, context.user.userId);
    },

    applyJob: async (_, { jobId, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.applyJob(context.user.userId, jobId, input);
    },

    toggleSaveJob: async (_, { jobId }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const result = await JobService.toggleSaveJob(context.user.userId, jobId);
      return { saved: result.saved, message: result.message, success: true };
    },

    createCompany: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.createCompany(input);
    },

    // ==================== FUNDING MUTATIONS ====================
    createCampaign: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.createCampaign(context.user.userId, input);
    },

    updateCampaign: async (_, { id, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.updateCampaign(id, context.user.userId, input);
    },

    deleteCampaign: async (_, { id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.deleteCampaign(id, context.user.userId);
    },

    createDonation: async (_, { campaignId, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.createDonation(campaignId, context.user.userId, input);
    },

    verifyDonation: async (_, { donationId, status }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await FundingService.verifyDonation(donationId, context.user.userId, status);
    },
  },

  // Type Resolvers
  Post: {
    user: async (parent) => {
      if (parent.user) return parent.user;
      return await prisma.user.findUnique({
        where: { id: parent.userId },
        include: { profile: true }
      });
    },
    category: async (parent) => {
      if (parent.category) return parent.category;
      if (!parent.categoryId) return null;
      return await prisma.category.findUnique({
        where: { id: parent.categoryId }
      });
    },
    tags: async (parent) => {
      if (parent.tags) return parent.tags;
      return await prisma.postTag.findMany({
        where: { postId: parent.id },
        include: { tag: true }
      });
    },
    commentsCount: async (parent) => {
      if (parent._count?.comments !== undefined) return parent._count.comments;
      return await prisma.comment.count({
        where: { postId: parent.id }
      });
    },
    likesCount: async (parent) => {
      if (parent._count?.likes !== undefined) return parent._count.likes;
      return await prisma.like.count({
        where: { postId: parent.id }
      });
    },
    isLiked: (parent) => {
      return parent.isLiked || false;
    },
    createdAt: (parent) => {
      if (parent.createdAt instanceof Date) {
        return parent.createdAt.toISOString();
      }
      return parent.createdAt || new Date().toISOString();
    },
    updatedAt: (parent) => {
      if (parent.updatedAt instanceof Date) {
        return parent.updatedAt.toISOString();
      }
      return parent.updatedAt || new Date().toISOString();
    },
  },

  Comment: {
    user: async (parent) => {
      if (parent.user) return parent.user;
      return await prisma.user.findUnique({
        where: { id: parent.userId },
        include: { profile: true }
      });
    },
    replies: async (parent) => {
      if (parent.replies) return parent.replies;
      return await prisma.comment.findMany({
        where: { parentId: parent.id },
        include: {
          user: { include: { profile: true } }
        },
        orderBy: { createdAt: 'asc' }
      });
    },
    repliesCount: async (parent) => {
      if (parent._count?.replies !== undefined) return parent._count.replies;
      return await prisma.comment.count({
        where: { parentId: parent.id }
      });
    },
    likesCount: async (parent) => {
      if (parent._count?.likes !== undefined) return parent._count.likes;
      return await prisma.like.count({
        where: { commentId: parent.id }
      });
    },
    createdAt: (parent) => {
      if (parent.createdAt instanceof Date) {
        return parent.createdAt.toISOString();
      }
      return parent.createdAt || new Date().toISOString();
    },
    updatedAt: (parent) => {
      if (parent.updatedAt instanceof Date) {
        return parent.updatedAt.toISOString();
      }
      return parent.updatedAt || new Date().toISOString();
    },
  },

  Category: {
    postsCount: async (parent) => {
      if (parent._count?.posts !== undefined) return parent._count.posts;
      return await prisma.post.count({
        where: { categoryId: parent.id, status: 'PUBLISHED' }
      });
    },
  },

  Job: {
    company: async (parent) => {
      if (parent.company) return parent.company;
      if (!parent.companyId) return null;
      return await prisma.company.findUnique({
        where: { id: parent.companyId }
      });
    },
    poster: async (parent) => {
      if (parent.poster) return parent.poster;
      return await prisma.user.findUnique({
        where: { id: parent.postedBy },
        include: { profile: true }
      });
    },
    applicationsCount: (parent) => {
      return parent._count?.applications || parent.applicationsCount || 0;
    },
    savedCount: (parent) => {
      return parent._count?.savedJobs || parent.savedCount || 0;
    },
    hasApplied: (parent) => {
      return parent.hasApplied || false;
    },
    isSaved: (parent) => {
      return parent.isSaved || false;
    },
    createdAt: (parent) => {
      if (parent.createdAt instanceof Date) {
        return parent.createdAt.toISOString();
      }
      return parent.createdAt || new Date().toISOString();
    },
    deadline: (parent) => {
      if (!parent.deadline) return null;
      if (parent.deadline instanceof Date) {
        return parent.deadline.toISOString();
      }
      return parent.deadline;
    },
  },

  Company: {
    jobsCount: async (parent) => {
      if (parent._count?.jobs !== undefined) return parent._count.jobs;
      return await prisma.job.count({
        where: { companyId: parent.id, isActive: true }
      });
    },
  },

  Application: {
    job: async (parent) => {
      if (parent.job) return parent.job;
      return await prisma.job.findUnique({
        where: { id: parent.jobId },
        include: { company: true }
      });
    },
    user: async (parent) => {
      if (parent.user) return parent.user;
      return await prisma.user.findUnique({
        where: { id: parent.userId },
        include: { profile: true }
      });
    },
    appliedAt: (parent) => {
      if (parent.appliedAt instanceof Date) {
        return parent.appliedAt.toISOString();
      }
      return parent.appliedAt || new Date().toISOString();
    },
  },

  Campaign: {
    creator: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.creatorId },
        include: { profile: true }
      });
    },
  },

  Donation: {
    campaign: async (parent) => {
      return await prisma.campaign.findUnique({
        where: { id: parent.campaignId }
      });
    },
    donor: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.donorId },
        include: { profile: true }
      });
    },
  },
};

export default resolvers;