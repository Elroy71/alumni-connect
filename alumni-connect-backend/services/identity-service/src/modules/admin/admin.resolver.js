import adminService from './admin.service.js';
import { requireSuperAdmin } from '../../middlewares/admin.middleware.js';

export const adminResolvers = {
    Query: {
        // Dashboard Statistics
        getDashboardStats: async (_, __, context) => {
            requireSuperAdmin(context);
            return await adminService.getDashboardStats();
        },

        // User Management
        getAllUsers: async (_, { filter = {}, pagination = {} }, context) => {
            requireSuperAdmin(context);
            const { skip = 0, take = 20 } = pagination;
            return await adminService.getAllUsers({ filter, skip, take });
        },

        // Event Management
        getPendingEvents: async (_, { pagination = {} }, context) => {
            requireSuperAdmin(context);
            const { skip = 0, take = 20 } = pagination;
            return await adminService.getPendingEvents({ skip, take });
        },

        getAllEvents: async (_, { filter = {}, pagination = {} }, context) => {
            requireSuperAdmin(context);
            const { skip = 0, take = 20 } = pagination;
            return await adminService.getAllEvents({ filter, skip, take });
        },

        // Campaign Management
        getPendingCampaigns: async (_, { pagination = {} }, context) => {
            requireSuperAdmin(context);
            const { skip = 0, take = 20 } = pagination;
            return await adminService.getPendingCampaigns({ skip, take });
        },

        getAllCampaigns: async (_, { filter = {}, pagination = {} }, context) => {
            requireSuperAdmin(context);
            const { skip = 0, take = 20 } = pagination;
            return await adminService.getAllCampaigns({ filter, skip, take });
        }
    },

    Mutation: {
        // User Management
        suspendUser: async (_, { userId, reason }, context) => {
            requireSuperAdmin(context);
            return await adminService.suspendUser(userId, reason);
        },

        activateUser: async (_, { userId }, context) => {
            requireSuperAdmin(context);
            return await adminService.activateUser(userId);
        },

        deleteUser: async (_, { userId }, context) => {
            requireSuperAdmin(context);
            return await adminService.deleteUser(userId);
        },

        // Event Approval
        approveEvent: async (_, { eventId }, context) => {
            requireSuperAdmin(context);
            const adminId = context.user.userId;
            return await adminService.approveEvent(eventId, adminId);
        },

        rejectEvent: async (_, { eventId, reason }, context) => {
            requireSuperAdmin(context);
            const adminId = context.user.userId;
            return await adminService.rejectEvent(eventId, adminId, reason);
        },

        // Campaign Approval
        approveCampaign: async (_, { campaignId }, context) => {
            requireSuperAdmin(context);
            const adminId = context.user.userId;
            return await adminService.approveCampaign(campaignId, adminId);
        },

        rejectCampaign: async (_, { campaignId, reason }, context) => {
            requireSuperAdmin(context);
            const adminId = context.user.userId;
            return await adminService.rejectCampaign(campaignId, adminId, reason);
        },

        // Content Deletion
        deleteContent: async (_, { contentType, contentId }, context) => {
            requireSuperAdmin(context);
            await adminService.deleteContent(contentType, contentId);
            return true;
        }
    }
};
