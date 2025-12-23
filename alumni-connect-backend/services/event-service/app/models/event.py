from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime
import uuid
import enum
from app.database.connection import Base

class EventType(str, enum.Enum):
    WEBINAR = "WEBINAR"
    WORKSHOP = "WORKSHOP"
    MEETUP = "MEETUP"
    REUNION = "REUNION"
    SEMINAR = "SEMINAR"
    NETWORKING = "NETWORKING"
    CONFERENCE = "CONFERENCE"

class EventStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class RegistrationStatus(str, enum.Enum):
    REGISTERED = "REGISTERED"
    CONFIRMED = "CONFIRMED"
    ATTENDED = "ATTENDED"
    CANCELLED = "CANCELLED"

class Event(Base):
    __tablename__ = "Event"
    __table_args__ = {'schema': 'identity_schema'}

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organizerId = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    type = Column(SQLEnum(EventType), nullable=False)
    status = Column(SQLEnum(EventStatus), default=EventStatus.PUBLISHED, index=True)
    coverImage = Column(String)
    startDate = Column(DateTime, nullable=False, index=True)
    endDate = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    isOnline = Column(Boolean, default=False)
    meetingUrl = Column(String)
    capacity = Column(Integer)
    currentAttendees = Column(Integer, default=0)
    price = Column(Integer, default=0)
    currency = Column(String, default="IDR")
    tags = Column(ARRAY(String), default=list)
    requirements = Column(Text)
    agenda = Column(Text)
    speakers = Column(Text)
    viewCount = Column(Integer, default=0)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")

class Registration(Base):
    __tablename__ = "Registration"
    __table_args__ = {'schema': 'identity_schema'}

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    eventId = Column(String, ForeignKey('identity_schema.Event.id', ondelete='CASCADE'), nullable=False, index=True)
    userId = Column(String, nullable=False, index=True)
    status = Column(SQLEnum(RegistrationStatus), default=RegistrationStatus.REGISTERED, index=True)
    notes = Column(Text)
    attendedAt = Column(DateTime)
    registeredAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="registrations")