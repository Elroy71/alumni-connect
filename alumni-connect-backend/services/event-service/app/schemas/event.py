from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class EventType(str, Enum):
    WEBINAR = "WEBINAR"
    WORKSHOP = "WORKSHOP"
    MEETUP = "MEETUP"
    REUNION = "REUNION"
    SEMINAR = "SEMINAR"
    NETWORKING = "NETWORKING"
    CONFERENCE = "CONFERENCE"

class EventStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class RegistrationStatus(str, Enum):
    REGISTERED = "REGISTERED"
    CONFIRMED = "CONFIRMED"
    ATTENDED = "ATTENDED"
    CANCELLED = "CANCELLED"

class CreateEventInput(BaseModel):
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
    tags: Optional[List[str]] = []
    requirements: Optional[str] = None
    agenda: Optional[str] = None
    speakers: Optional[str] = None

class UpdateEventInput(BaseModel):
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

class RegisterEventInput(BaseModel):
    notes: Optional[str] = None

class EventFilterInput(BaseModel):
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