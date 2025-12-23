import prisma from '../../config/database.js';

class FundingService {
  // ==================== CAMPAIGNS ====================
  
  async createCampaign(userId, data) {
    const {
      title,
      description,
      story,
      coverImage,
      category,
      goalAmount,
      endDate,
      beneficiary,
      bankAccount,
      phoneNumber
    } = data;

    const campaign = await prisma.campaign.create({
      data: {
        creatorId: userId,
        title,
        description,
        story,
        coverImage,
        category,
        goalAmount,
        endDate: new Date(endDate),
        beneficiary,
        bankAccount,
        phoneNumber,
        status: 'ACTIVE'
      },
      include: {
        creator: {
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
            donations: true
          }
        }
      }
    });

    return campaign;
  }

  async getCampaigns(filter = {}) {
    const {
      search,
      category,
      status = 'ACTIVE',
      creatorId,
      limit = 20,
      offset = 0,
      orderBy = 'createdAt',
      order = 'desc'
    } = filter;

    const where = {
      status,
      ...(category && { category }),
      ...(creatorId && { creatorId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          creator: {
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
              donations: true
            }
          }
        },
        orderBy: { [orderBy]: order },
        take: limit,
        skip: offset
      }),
      prisma.campaign.count({ where })
    ]);

    // Calculate percentage for each campaign
    const campaignsWithPercentage = campaigns.map(campaign => ({
      ...campaign,
      percentage: campaign.goalAmount > 0 
        ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)
        : 0,
      daysLeft: Math.max(
        0,
        Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      )
    }));

    return {
      campaigns: campaignsWithPercentage,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  async getCampaignById(campaignId, userId = null) {
    // Increment views
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { viewCount: { increment: 1 } }
    });

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        creator: {
          include: {
            profile: true
          }
        },
        _count: {
          select: {
            donations: true
          }
        }
      }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Check if user has donated
    if (userId) {
      const donation = await prisma.donation.findFirst({
        where: {
          campaignId,
          donorId: userId
        }
      });

      campaign.hasDonated = !!donation;
      campaign.myDonation = donation;
    } else {
      campaign.hasDonated = false;
      campaign.myDonation = null;
    }

    // Calculate percentage and days left
    campaign.percentage = campaign.goalAmount > 0 
      ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)
      : 0;
    
    campaign.daysLeft = Math.max(
      0,
      Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    );

    return campaign;
  }

  async updateCampaign(campaignId, userId, data) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign || campaign.creatorId !== userId) {
      throw new Error('Unauthorized to update this campaign');
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...data,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        updatedAt: new Date()
      },
      include: {
        creator: {
          include: {
            profile: true
          }
        },
        _count: {
          select: {
            donations: true
          }
        }
      }
    });

    return updatedCampaign;
  }

  async deleteCampaign(campaignId, userId) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign || campaign.creatorId !== userId) {
      throw new Error('Unauthorized to delete this campaign');
    }

    await prisma.campaign.delete({
      where: { id: campaignId }
    });

    return { success: true, message: 'Campaign deleted successfully' };
  }

  // ==================== DONATIONS ====================

  async createDonation(userId, campaignId, data) {
    const { amount, message, isAnonymous, paymentProof } = data;

    // Check if campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'ACTIVE') {
      throw new Error('Campaign is not accepting donations');
    }

    // Check if campaign has ended
    if (new Date() > new Date(campaign.endDate)) {
      throw new Error('Campaign has ended');
    }

    const donation = await prisma.donation.create({
      data: {
        campaignId,
        donorId: userId,
        amount,
        message,
        isAnonymous,
        paymentProof,
        status: 'PENDING'
      },
      include: {
        campaign: true,
        donor: {
          include: {
            profile: true
          }
        }
      }
    });

    return donation;
  }

  async verifyDonation(donationId, userId, status) {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        campaign: true
      }
    });

    if (!donation || donation.campaign.creatorId !== userId) {
      throw new Error('Unauthorized to verify this donation');
    }

    if (donation.status !== 'PENDING') {
      throw new Error('Donation has already been processed');
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status,
        verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
        verifiedBy: userId,
        updatedAt: new Date()
      },
      include: {
        donor: {
          include: {
            profile: true
          }
        },
        campaign: true
      }
    });

    // If verified, update campaign current amount
    if (status === 'VERIFIED') {
      await prisma.campaign.update({
        where: { id: donation.campaignId },
        data: {
          currentAmount: {
            increment: donation.amount
          }
        }
      });
    }

    return updatedDonation;
  }

  async getCampaignDonations(campaignId, userId) {
    // Check if user is the campaign creator
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign || campaign.creatorId !== userId) {
      throw new Error('Unauthorized to view donations');
    }

    const donations = await prisma.donation.findMany({
      where: { campaignId },
      include: {
        donor: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        donatedAt: 'desc'
      }
    });

    return donations;
  }

  async getPublicDonations(campaignId) {
    const donations = await prisma.donation.findMany({
      where: {
        campaignId,
        status: 'VERIFIED',
        isAnonymous: false
      },
      include: {
        donor: {
          include: {
            profile: {
              select: {
                fullName: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        donatedAt: 'desc'
      }
    });

    return donations;
  }

  async getMyDonations(userId, filter = {}) {
    const { status, limit = 20, offset = 0 } = filter;

    const where = {
      donorId: userId,
      ...(status && { status })
    };

    const donations = await prisma.donation.findMany({
      where,
      include: {
        campaign: {
          include: {
            creator: {
              include: {
                profile: {
                  select: {
                    fullName: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        donatedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return donations;
  }
}

export default new FundingService();