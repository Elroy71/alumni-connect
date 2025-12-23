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
      return await ForumService.getPostById(id, context.user);
    },

    myPosts: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.getMyPosts(context.user.userId);
    },

    // ==================== JOB QUERIES ====================
    jobs: async (_, { filter }) => {
      return await JobService.getJobs(filter);
    },

    job: async (_, { id }, context) => {
      return await JobService.getJobById(id, context.user);
    },

    myPostedJobs: async (_, { filter }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.getMyPostedJobs(context.user.userId, filter);
    },

    myApplications: async (_, { status }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.getMyApplications(context.user.userId, status);
    },

    mySavedJobs: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.getMySavedJobs(context.user.userId);
    },

    companies: async () => {
      return await JobService.getAllCompanies();
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
      return await ForumService.toggleLikePost(postId, context.user.userId);
    },

    createComment: async (_, { postId, input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await ForumService.createComment(postId, context.user.userId, input);
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
      return await JobService.applyJob(jobId, context.user.userId, input);
    },

    toggleSaveJob: async (_, { jobId }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.toggleSaveJob(jobId, context.user.userId);
    },

    createCompany: async (_, { input }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await JobService.createCompany(context.user.userId, input);
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
    author: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.authorId },
        include: { profile: true }
      });
    },
    category: async (parent) => {
      if (!parent.categoryId) return null;
      return await prisma.category.findUnique({
        where: { id: parent.categoryId }
      });
    },
    comments: async (parent) => {
      return await prisma.comment.findMany({
        where: { postId: parent.id, parentId: null },
        orderBy: { createdAt: 'desc' }
      });
    },
    likes: async (parent) => {
      return await prisma.postLike.findMany({
        where: { postId: parent.id },
        include: { user: { include: { profile: true } } }
      });
    },
  },

  Comment: {
    author: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.authorId },
        include: { profile: true }
      });
    },
    replies: async (parent) => {
      return await prisma.comment.findMany({
        where: { parentId: parent.id },
        orderBy: { createdAt: 'asc' }
      });
    },
    likes: async (parent) => {
      return await prisma.commentLike.findMany({
        where: { commentId: parent.id },
        include: { user: { include: { profile: true } } }
      });
    },
  },

  Job: {
    company: async (parent) => {
      if (!parent.companyId) return null;
      return await prisma.company.findUnique({
        where: { id: parent.companyId }
      });
    },
    postedBy: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.postedById },
        include: { profile: true }
      });
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