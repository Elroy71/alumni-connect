import strawberry
from typing import Optional, List
from datetime import datetime
from enum import Enum

@strawberry.enum
class EventType(Enum):
    WEBINAR = "WEBINAR"
    WORKSHOP = "WORKSHOP"
    MEETUP = "MEETUP"
    REUNION = "REUNION"
    SEMINAR = "SEMINAR"
    NETWORKING = "NETWORKING"
    CONFERENCE = "CONFERENCE"

@strawberry.enum
class EventStatus(Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

@strawberry.enum
class RegistrationStatus(Enum):
    REGISTERED = "REGISTERED"
    CONFIRMED = "CONFIRMED"
    ATTENDED = "ATTENDED"
    CANCELLED = "CANCELLED"

@strawberry.type
class Event:
    id: str
    organizerId: str
    title: str
    description: str
    type: EventType
    status: EventStatus
    coverImage: Optional[str]
    startDate: datetime
    endDate: datetime
    location: str
    isOnline: bool
    meetingUrl: Optional[str]
    capacity: Optional[int]
    currentAttendees: int
    price: int
    currency: str
    tags: List[str]
    requirements: Optional[str]
    agenda: Optional[str]
    speakers: Optional[str]
    viewCount: int
    createdAt: datetime
    updatedAt: datetime
    registrationsCount: int
    hasRegistered: bool = False
    registrationStatus: Optional[RegistrationStatus] = None
    isFull: bool = False
    percentage: float = 0.0
    daysLeft: int = 0

@strawberry.type
class Registration:
    id: str
    eventId: str
    userId: str
    status: RegistrationStatus
    notes: Optional[str]
    attendedAt: Optional[datetime]
    registeredAt: datetime
    updatedAt: datetime
    event: Optional[Event] = None

@strawberry.type
class Pagination:
    total: int
    limit: int
    offset: int
    hasMore: bool

@strawberry.type
class EventsResponse:
    events: List[Event]
    pagination: Pagination

@strawberry.type
class MessageResponse:
    success: bool
    message: str

@strawberry.input
class CreateEventInput:
    title: str
    description: str
    type: EventType
    coverImage: Optional[str] = None
    startDate: str
    endDate: str
    location: str
    isOnline: bool = False
    meetingUrl: Optional[str] = None
    capacity: Optional[int] = None
    price: int = 0
    tags: Optional[List[str]] = strawberry.field(default_factory=list)
    requirements: Optional[str] = None
    agenda: Optional[str] = None
    speakers: Optional[str] = None

@strawberry.input
class UpdateEventInput:
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[EventType] = None
    status: Optional[EventStatus] = None
    coverImage: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    location: Optional[str] = None
    isOnline: Optional[bool] = None
    meetingUrl: Optional[str] = None
    capacity: Optional[int] = None
    price: Optional[int] = None
    tags: Optional[List[str]] = None
    requirements: Optional[str] = None
    agenda: Optional[str] = None
    speakers: Optional[str] = None

@strawberry.input
class RegisterEventInput:
    notes: Optional[str] = None

@strawberry.input
class EventFilterInput:
    search: Optional[str] = None
    type: Optional[EventType] = None
    status: Optional[EventStatus] = EventStatus.PUBLISHED
    isOnline: Optional[bool] = None
    organizerId: Optional[str] = None
    upcoming: bool = False
    limit: int = 20
    offset: int = 0
    orderBy: str = "startDate"
    order: str = "asc"