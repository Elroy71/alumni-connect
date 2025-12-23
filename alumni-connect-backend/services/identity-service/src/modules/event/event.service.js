import prisma from '../../config/database.js';

class EventService {
  // ==================== EVENTS ====================
  
  async createEvent(userId, data) {
    const {
      title,
      description,
      type,
      coverImage,
      startDate,
      endDate,
      location,
      isOnline,
      meetingUrl,
      capacity,
      price,
      tags,
      requirements,
      agenda,
      speakers
    } = data;

    const event = await prisma.event.create({
      data: {
        organizerId: userId,
        title,
        description,
        type,
        coverImage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        isOnline,
        meetingUrl,
        capacity,
        price,
        tags: tags || [],
        requirements,
        agenda,
        speakers,
        status: 'PUBLISHED'
      },
      include: {
        organizer: {
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
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    return event;
  }

  async getEvents(filter = {}) {
    const {
      search,
      type,
      status = 'PUBLISHED',
      isOnline,
      organizerId,
      upcoming = false,
      limit = 20,
      offset = 0,
      orderBy = 'startDate',
      order = 'asc'
    } = filter;

    const now = new Date();

    const where = {
      status,
      ...(type && { type }),
      ...(isOnline !== undefined && { isOnline }),
      ...(organizerId && { organizerId }),
      ...(upcoming && { startDate: { gte: now } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
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
              registrations: true
            }
          }
        },
        orderBy: { [orderBy]: order },
        take: limit,
        skip: offset
      }),
      prisma.event.count({ where })
    ]);

    return {
      events,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  async getEventById(eventId, userId = null) {
    // Increment views
    await prisma.event.update({
      where: { id: eventId },
      data: { viewCount: { increment: 1 } }
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          include: {
            profile: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    // Check if user has registered
    if (userId) {
      const registration = await prisma.registration.findUnique({
        where: {
          eventId_userId: {
            eventId,
            userId
          }
        }
      });

      event.hasRegistered = !!registration;
      event.registrationStatus = registration?.status || null;
    } else {
      event.hasRegistered = false;
      event.registrationStatus = null;
    }

    // Check if event is full
    if (event.capacity) {
      event.isFull = event._count.registrations >= event.capacity;
    } else {
      event.isFull = false;
    }

    return event;
  }

  async updateEvent(eventId, userId, data) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event || event.organizerId !== userId) {
      throw new Error('Unauthorized to update this event');
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        updatedAt: new Date()
      },
      include: {
        organizer: {
          include: {
            profile: true
          }
        },
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    return updatedEvent;
  }

  async deleteEvent(eventId, userId) {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event || event.organizerId !== userId) {
      throw new Error('Unauthorized to delete this event');
    }

    await prisma.event.delete({
      where: { id: eventId }
    });

    return { success: true, message: 'Event deleted successfully' };
  }

  // ==================== REGISTRATIONS ====================

  async registerEvent(userId, eventId, data) {
    const { notes } = data || {};

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new Error('Event is not available for registration');
    }

    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });

    if (existing) {
      throw new Error('You have already registered for this event');
    }

    // Check capacity
    if (event.capacity && event._count.registrations >= event.capacity) {
      throw new Error('Event is full');
    }

    // Check if event has started
    if (new Date() > new Date(event.startDate)) {
      throw new Error('Event has already started');
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId,
        notes,
        status: 'REGISTERED'
      },
      include: {
        event: {
          include: {
            organizer: {
              include: {
                profile: true
              }
            }
          }
        },
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    // Increment current attendees
    await prisma.event.update({
      where: { id: eventId },
      data: { currentAttendees: { increment: 1 } }
    });

    return registration;
  }

  async cancelRegistration(eventId, userId) {
    const registration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    if (registration.status === 'ATTENDED') {
      throw new Error('Cannot cancel after attending');
    }

    await prisma.registration.update({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    });

    // Decrement current attendees
    await prisma.event.update({
      where: { id: eventId },
      data: { currentAttendees: { decrement: 1 } }
    });

    return { success: true, message: 'Registration cancelled successfully' };
  }

  async getMyRegistrations(userId, filter = {}) {
    const { status, upcoming = false, limit = 20, offset = 0 } = filter;

    const now = new Date();

    const where = {
      userId,
      ...(status && { status }),
      ...(upcoming && {
        event: {
          startDate: { gte: now }
        }
      })
    };

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          include: {
            organizer: {
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
                registrations: true
              }
            }
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return registrations;
  }

  async getEventRegistrations(eventId, userId) {
    // Check if user is the organizer
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event || event.organizerId !== userId) {
      throw new Error('Unauthorized to view registrations');
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        registeredAt: 'desc'
      }
    });

    return registrations;
  }

  async updateRegistrationStatus(registrationId, userId, status) {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true
      }
    });

    if (!registration || registration.event.organizerId !== userId) {
      throw new Error('Unauthorized to update this registration');
    }

    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status,
        attendedAt: status === 'ATTENDED' ? new Date() : undefined,
        updatedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        event: true
      }
    });

    return updated;
  }
}

export default new EventService();