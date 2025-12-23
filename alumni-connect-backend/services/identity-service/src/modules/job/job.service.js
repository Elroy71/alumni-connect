import prisma from '../../config/database.js';

class JobService {
  // ==================== JOBS ====================
  
  async createJob(userId, data) {
    const {
      title,
      description,
      requirements,
      responsibilities,
      type,
      level,
      location,
      isRemote,
      salaryMin,
      salaryMax,
      skills,
      benefits,
      applicationUrl,
      deadline,
      companyId
    } = data;

    const job = await prisma.job.create({
      data: {
        postedBy: userId,
        title,
        description,
        requirements,
        responsibilities,
        type,
        level,
        location,
        isRemote,
        salaryMin,
        salaryMax,
        skills: skills || [],
        benefits: benefits || [],
        applicationUrl,
        deadline: deadline ? new Date(deadline) : null,
        companyId,
        isActive: true
      },
      include: {
        poster: {
          include: {
            profile: {
              select: {
                fullName: true,
                avatar: true,
                currentCompany: true,
                currentPosition: true
              }
            }
          }
        },
        company: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true
          }
        }
      }
    });

    return job;
  }

  async getJobs(filter = {}) {
    const {
      search,
      type,
      level,
      location,
      isRemote,
      companyId,
      postedBy,
      isActive = true,
      limit = 20,
      offset = 0,
      orderBy = 'createdAt',
      order = 'desc'
    } = filter;

    const where = {
      isActive,
      ...(type && { type }),
      ...(level && { level }),
      ...(location && { location: { contains: location, mode: 'insensitive' } }),
      ...(isRemote !== undefined && { isRemote }),
      ...(companyId && { companyId }),
      ...(postedBy && { postedBy }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { skills: { has: search } }
        ]
      })
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          poster: {
            include: {
              profile: {
                select: {
                  fullName: true,
                  avatar: true
                }
              }
            }
          },
          company: true,
          _count: {
            select: {
              applications: true,
              savedJobs: true
            }
          }
        },
        orderBy: { [orderBy]: order },
        take: limit,
        skip: offset
      }),
      prisma.job.count({ where })
    ]);

    return {
      jobs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  async getJobById(jobId, userId = null) {
    // Increment views
    await prisma.job.update({
      where: { id: jobId },
      data: { viewCount: { increment: 1 } }
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        poster: {
          include: {
            profile: true
          }
        },
        company: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true
          }
        }
      }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    // Check if user has applied or saved
    if (userId) {
      const [application, savedJob] = await Promise.all([
        prisma.application.findUnique({
          where: {
            jobId_userId: {
              jobId,
              userId
            }
          }
        }),
        prisma.savedJob.findUnique({
          where: {
            jobId_userId: {
              jobId,
              userId
            }
          }
        })
      ]);

      job.hasApplied = !!application;
      job.isSaved = !!savedJob;
      job.applicationStatus = application?.status || null;
    } else {
      job.hasApplied = false;
      job.isSaved = false;
      job.applicationStatus = null;
    }

    return job;
  }

  async updateJob(jobId, userId, data) {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || job.postedBy !== userId) {
      throw new Error('Unauthorized to update this job');
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        updatedAt: new Date()
      },
      include: {
        poster: {
          include: {
            profile: true
          }
        },
        company: true
      }
    });

    return updatedJob;
  }

  async deleteJob(jobId, userId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || job.postedBy !== userId) {
      throw new Error('Unauthorized to delete this job');
    }

    await prisma.job.delete({
      where: { id: jobId }
    });

    return { success: true, message: 'Job deleted successfully' };
  }

  // ==================== APPLICATIONS ====================

  async applyJob(userId, jobId, data) {
    const { coverLetter, resumeUrl, portfolioUrl } = data;

    // Check if already applied
    const existing = await prisma.application.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId
        }
      }
    });

    if (existing) {
      throw new Error('You have already applied to this job');
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || !job.isActive) {
      throw new Error('Job not available');
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        coverLetter,
        resumeUrl,
        portfolioUrl,
        status: 'PENDING'
      },
      include: {
        job: {
          include: {
            company: true
          }
        },
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    // Increment application count
    await prisma.job.update({
      where: { id: jobId },
      data: { applicationCount: { increment: 1 } }
    });

    return application;
  }

  async getMyApplications(userId, filter = {}) {
    const { status, limit = 20, offset = 0 } = filter;

    const where = {
      userId,
      ...(status && { status })
    };

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            company: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      take: limit,
      skip: offset
    });

    return applications;
  }

  async getJobApplications(jobId, userId) {
    // Check if user is the job poster
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job || job.postedBy !== userId) {
      throw new Error('Unauthorized to view applications');
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return applications;
  }

  async updateApplicationStatus(applicationId, userId, status, notes = null) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true
      }
    });

    if (!application || application.job.postedBy !== userId) {
      throw new Error('Unauthorized to update this application');
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status,
        notes,
        updatedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        job: true
      }
    });

    return updated;
  }

  // ==================== SAVED JOBS ====================

  async toggleSaveJob(userId, jobId) {
    const existing = await prisma.savedJob.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId
        }
      }
    });

    if (existing) {
      await prisma.savedJob.delete({
        where: {
          jobId_userId: {
            jobId,
            userId
          }
        }
      });
      return { saved: false, message: 'Job unsaved' };
    } else {
      await prisma.savedJob.create({
        data: {
          jobId,
          userId
        }
      });
      return { saved: true, message: 'Job saved' };
    }
  }

  async getSavedJobs(userId, limit = 20, offset = 0) {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
            _count: {
              select: {
                applications: true
              }
            }
          }
        }
      },
      orderBy: { savedAt: 'desc' },
      take: limit,
      skip: offset
    });

    return savedJobs.map(saved => saved.job);
  }

  // ==================== COMPANIES ====================

  async createCompany(data) {
    const { name, description, website, logo, industry, size, location, founded } = data;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const company = await prisma.company.create({
      data: {
        name,
        slug,
        description,
        website,
        logo,
        industry,
        size,
        location,
        founded
      }
    });

    return company;
  }

  async getCompanies() {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            jobs: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return companies;
  }

  async getCompanyById(companyId) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        jobs: {
          where: {
            isActive: true
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            jobs: true
          }
        }
      }
    });

    return company;
  }
}

export default new JobService();