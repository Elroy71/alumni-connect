import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AdminService {
    // ==================== USER MANAGEMENT ====================

    async getAllUsers({ filter = {}, skip = 0, take = 20 }) {
        const where = {};

        if (filter.search) {
            where.OR = [
                { email: { contains: filter.search, mode: 'insensitive' } },
                { profile: { fullName: { contains: filter.search, mode: 'insensitive' } } }
            ];
        }

        if (filter.role) {
            where.role = filter.role;
        }

        if (filter.status) {
            where.status = filter.status;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    profile: true,
                    _count: {
                        select: {
                            posts: true,
                            postedJobs: true,
                            organizedEvents: true,
                            campaigns: true
                        }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        return { users, total };
    }

    async suspendUser(userId, reason) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                status: 'SUSPENDED'
            },
            include: { profile: true }
        });

        // TODO: Log admin action (audit trail)
        console.log(`User ${userId} suspended. Reason: ${reason}`);

        return user;
    }

    async activateUser(userId) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                status: 'ACTIVE'
            },
            include: { profile: true }
        });

        return user;
    }

    async deleteUser(userId) {
        // Soft delete - keep data but mark as deleted
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                status: 'INACTIVE'
            }
        });

        return user;
    }

    // ==================== EVENT APPROVAL ====================

    async getPendingEvents({ skip = 0, take = 20 }) {
        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where: { status: 'PENDING_APPROVAL' },
                include: {
                    organizer: {
                        include: { profile: true }
                    },
                    _count: {
                        select: { registrations: true }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.event.count({ where: { status: 'PENDING_APPROVAL' } })
        ]);

        return { events, total };
    }

    async approveEvent(eventId, adminId) {
        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                status: 'PUBLISHED',
                approvedBy: adminId,
                approvedAt: new Date()
            },
            include: {
                organizer: {
                    include: { profile: true }
                }
            }
        });

        return event;
    }

    async rejectEvent(eventId, adminId, reason) {
        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                status: 'REJECTED',
                rejectedBy: adminId,
                rejectedAt: new Date(),
                rejectionReason: reason
            },
            include: {
                organizer: {
                    include: { profile: true }
                }
            }
        });

        return event;
    }

    // ==================== CAMPAIGN APPROVAL ====================

    async getPendingCampaigns({ skip = 0, take = 20 }) {
        const [campaigns, total] = await Promise.all([
            prisma.campaign.findMany({
                where: { status: 'PENDING_APPROVAL' },
                include: {
                    creator: {
                        include: { profile: true }
                    },
                    _count: {
                        select: { donations: true }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.campaign.count({ where: { status: 'PENDING_APPROVAL' } })
        ]);

        return { campaigns, total };
    }

    async approveCampaign(campaignId, adminId) {
        const campaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: 'ACTIVE',
                approvedBy: adminId,
                approvedAt: new Date()
            },
            include: {
                creator: {
                    include: { profile: true }
                }
            }
        });

        return campaign;
    }

    async rejectCampaign(campaignId, adminId, reason) {
        const campaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: 'REJECTED',
                rejectedBy: adminId,
                rejectedAt: new Date(),
                rejectionReason: reason
            },
            include: {
                creator: {
                    include: { profile: true }
                }
            }
        });

        return campaign;
    }

    // ==================== DASHBOARD STATISTICS ====================

    async getDashboardStats() {
        const [
            totalUsers,
            activeUsers,
            suspendedUsers,
            totalEvents,
            pendingEvents,
            totalCampaigns,
            pendingCampaigns,
            totalJobs,
            totalPosts
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { status: 'ACTIVE' } }),
            prisma.user.count({ where: { status: 'SUSPENDED' } }),
            prisma.event.count(),
            prisma.event.count({ where: { status: 'PENDING_APPROVAL' } }),
            prisma.campaign.count(),
            prisma.campaign.count({ where: { status: 'PENDING_APPROVAL' } }),
            prisma.job.count(),
            prisma.post.count()
        ]);

        // Get user growth (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newUsers = await prisma.user.count({
            where: {
                createdAt: { gte: sevenDaysAgo }
            }
        });

        // Get recent activities
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { profile: true }
        });

        const recentEvents = await prisma.event.findMany({
            take: 5,
            where: { status: 'PENDING_APPROVAL' },
            orderBy: { createdAt: 'desc' },
            include: {
                organizer: {
                    include: { profile: true }
                }
            }
        });

        const recentCampaigns = await prisma.campaign.findMany({
            take: 5,
            where: { status: 'PENDING_APPROVAL' },
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    include: { profile: true }
                }
            }
        });

        return {
            stats: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    suspended: suspendedUsers,
                    newThisWeek: newUsers
                },
                events: {
                    total: totalEvents,
                    pending: pendingEvents
                },
                campaigns: {
                    total: totalCampaigns,
                    pending: pendingCampaigns
                },
                jobs: {
                    total: totalJobs
                },
                posts: {
                    total: totalPosts
                }
            },
            recentActivities: {
                users: recentUsers,
                events: recentEvents,
                campaigns: recentCampaigns
            }
        };
    }

    // ==================== CONTENT DELETION ====================

    async deleteContent(contentType, contentId) {
        let result;

        switch (contentType) {
            case 'POST':
                result = await prisma.post.delete({ where: { id: contentId } });
                break;
            case 'EVENT':
                result = await prisma.event.delete({ where: { id: contentId } });
                break;
            case 'CAMPAIGN':
                result = await prisma.campaign.delete({ where: { id: contentId } });
                break;
            case 'JOB':
                result = await prisma.job.delete({ where: { id: contentId } });
                break;
            default:
                throw new Error(`Unknown content type: ${contentType}`);
        }

        return result;
    }

    async getAllEvents({ filter = {}, skip = 0, take = 20 }) {
        const where = {};

        if (filter.status) {
            where.status = filter.status;
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                include: {
                    organizer: {
                        include: { profile: true }
                    },
                    _count: {
                        select: { registrations: true }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.event.count({ where })
        ]);

        return { events, total };
    }

    async getAllCampaigns({ filter = {}, skip = 0, take = 20 }) {
        const where = {};

        if (filter.status) {
            where.status = filter.status;
        }

        const [campaigns, total] = await Promise.all([
            prisma.campaign.findMany({
                where,
                include: {
                    creator: {
                        include: { profile: true }
                    },
                    _count: {
                        select: { donations: true }
                    }
                },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.campaign.count({ where })
        ]);

        return { campaigns, total };
    }
}

export default new AdminService();
