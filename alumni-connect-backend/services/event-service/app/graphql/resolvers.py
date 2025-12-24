import strawberry
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_, func, and_
from app.graphql.types import (
    Event, EventsResponse, Registration, MessageResponse, Pagination,
    CreateEventInput, UpdateEventInput, RegisterEventInput, EventFilterInput,
    RegistrationStatus
)
from app.models.event import Event as EventModel, Registration as RegistrationModel
from app.database.connection import get_db

def get_current_user(info) -> Optional[dict]:
    """Extract user from context"""
    request = info.context.get("request")
    if request and hasattr(request.state, 'user'):
        return request.state.user
    return None

@strawberry.type
class Query:
    @strawberry.field
    def events(
        self,
        filter: Optional[EventFilterInput] = None,
        info: strawberry.Info = None
    ) -> EventsResponse:
        db: Session = next(get_db())
        user = get_current_user(info)
        
        try:
            filter = filter or EventFilterInput()
            query = db.query(EventModel)
            
            # Filter by status
            if filter.status:
                query = query.filter(EventModel.status == filter.status.value)
            
            # Apply search
            if filter.search:
                query = query.filter(
                    or_(
                        EventModel.title.ilike(f"%{filter.search}%"),
                        EventModel.description.ilike(f"%{filter.search}%"),
                        EventModel.location.ilike(f"%{filter.search}%")
                    )
                )
            
            # Apply type filter
            if filter.type:
                query = query.filter(EventModel.type == filter.type.value)
            
            # Apply isOnline filter
            if filter.isOnline is not None:
                query = query.filter(EventModel.isOnline == filter.isOnline)
            
            # Apply organizerId filter
            if filter.organizerId:
                query = query.filter(EventModel.organizerId == filter.organizerId)
            
            # Apply upcoming filter
            if filter.upcoming:
                query = query.filter(EventModel.startDate >= datetime.utcnow())
            
            # Count total
            total = query.count()
            
            # Order and paginate
            order_column = getattr(EventModel, filter.orderBy, EventModel.startDate)
            if filter.order == "desc":
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())
            
            events = query.limit(filter.limit).offset(filter.offset).all()
            
            # Build event list with calculated fields
            event_list = []
            for event in events:
                registrations_count = db.query(func.count(RegistrationModel.id)).filter(
                    RegistrationModel.eventId == event.id
                ).scalar()
                
                days_left = max(0, (event.endDate - datetime.utcnow()).days)
                is_full = event.capacity and registrations_count >= event.capacity
                
                has_registered = False
                registration_status = None
                if user:
                    registration = db.query(RegistrationModel).filter(
                        and_(
                            RegistrationModel.eventId == event.id,
                            RegistrationModel.userId == user['userId']
                        )
                    ).first()
                    if registration:
                        has_registered = True
                        registration_status = RegistrationStatus[registration.status.value]
                
                event_list.append(Event(
                    id=event.id,
                    organizerId=event.organizerId,
                    title=event.title,
                    description=event.description,
                    type=event.type,
                    status=event.status,
                    coverImage=event.coverImage,
                    startDate=event.startDate,
                    endDate=event.endDate,
                    location=event.location,
                    isOnline=event.isOnline,
                    meetingUrl=event.meetingUrl,
                    capacity=event.capacity,
                    currentAttendees=event.currentAttendees,
                    price=event.price,
                    currency=event.currency,
                    tags=event.tags or [],
                    requirements=event.requirements,
                    agenda=event.agenda,
                    speakers=event.speakers,
                    viewCount=event.viewCount,
                    createdAt=event.createdAt,
                    updatedAt=event.updatedAt,
                    registrationsCount=registrations_count,
                    hasRegistered=has_registered,
                    registrationStatus=registration_status,
                    isFull=is_full,
                    daysLeft=days_left
                ))
            
            return EventsResponse(
                events=event_list,
                pagination=Pagination(
                    total=total,
                    limit=filter.limit,
                    offset=filter.offset,
                    hasMore=(filter.offset + filter.limit < total)
                )
            )
        finally:
            db.close()

    @strawberry.field
    def event(self, id: strawberry.ID, info: strawberry.Info = None) -> Optional[Event]:
        db: Session = next(get_db())
        user = get_current_user(info)
        
        try:
            event = db.query(EventModel).filter(EventModel.id == str(id)).first()
            if not event:
                raise Exception("Event not found")
            
            # Increment view count
            event.viewCount += 1
            db.commit()
            
            registrations_count = db.query(func.count(RegistrationModel.id)).filter(
                RegistrationModel.eventId == event.id
            ).scalar()
            
            days_left = max(0, (event.endDate - datetime.utcnow()).days)
            is_full = event.capacity and registrations_count >= event.capacity
            
            has_registered = False
            registration_status = None
            if user:
                registration = db.query(RegistrationModel).filter(
                    and_(
                        RegistrationModel.eventId == event.id,
                        RegistrationModel.userId == user['userId']
                    )
                ).first()
                if registration:
                    has_registered = True
                    registration_status = RegistrationStatus[registration.status.value]
            
            return Event(
                id=event.id,
                organizerId=event.organizerId,
                title=event.title,
                description=event.description,
                type=event.type,
                status=event.status,
                coverImage=event.coverImage,
                startDate=event.startDate,
                endDate=event.endDate,
                location=event.location,
                isOnline=event.isOnline,
                meetingUrl=event.meetingUrl,
                capacity=event.capacity,
                currentAttendees=event.currentAttendees,
                price=event.price,
                currency=event.currency,
                tags=event.tags or [],
                requirements=event.requirements,
                agenda=event.agenda,
                speakers=event.speakers,
                viewCount=event.viewCount,
                createdAt=event.createdAt,
                updatedAt=event.updatedAt,
                registrationsCount=registrations_count,
                hasRegistered=has_registered,
                registrationStatus=registration_status,
                isFull=is_full,
                daysLeft=days_left
            )
        finally:
            db.close()

    @strawberry.field
    def myRegistrations(
        self,
        status: Optional[RegistrationStatus] = None,
        upcoming: bool = False,
        info: strawberry.Info = None
    ) -> List[Registration]:
        db: Session = next(get_db())
        user = get_current_user(info)
        
        if not user:
            raise Exception("Not authenticated")
        
        try:
            query = db.query(RegistrationModel).filter(
                RegistrationModel.userId == user['userId']
            )
            
            if status:
                query = query.filter(RegistrationModel.status == status.value)
            
            if upcoming:
                query = query.join(EventModel).filter(
                    EventModel.startDate >= datetime.utcnow()
                )
            
            registrations = query.order_by(RegistrationModel.registeredAt.desc()).all()
            
            result = []
            for r in registrations:
                event_model = db.query(EventModel).filter(EventModel.id == r.eventId).first()
                
                event_obj = None
                if event_model:
                    event_obj = Event(
                        id=event_model.id,
                        organizerId=event_model.organizerId,
                        title=event_model.title,
                        description=event_model.description,
                        type=event_model.type,
                        status=event_model.status,
                        coverImage=event_model.coverImage,
                        startDate=event_model.startDate,
                        endDate=event_model.endDate,
                        location=event_model.location,
                        isOnline=event_model.isOnline,
                        meetingUrl=event_model.meetingUrl,
                        capacity=event_model.capacity,
                        currentAttendees=event_model.currentAttendees,
                        price=event_model.price,
                        currency=event_model.currency,
                        tags=event_model.tags or [],
                        requirements=event_model.requirements,
                        agenda=event_model.agenda,
                        speakers=event_model.speakers,
                        viewCount=event_model.viewCount,
                        createdAt=event_model.createdAt,
                        updatedAt=event_model.updatedAt,
                        registrationsCount=0,
                        hasRegistered=True,
                        isFull=False,
                        daysLeft=max(0, (event_model.endDate - datetime.utcnow()).days)
                    )
                
                result.append(Registration(
                    id=r.id,
                    eventId=r.eventId,
                    userId=r.userId,
                    status=RegistrationStatus[r.status.value],
                    notes=r.notes,
                    attendedAt=r.attendedAt,
                    registeredAt=r.registeredAt,
                    updatedAt=r.updatedAt,
                    event=event_obj
                ))
            
            return result
        finally:
            db.close()

@strawberry.type
class Mutation:
    @strawberry.mutation
    def createEvent(
        self,
        input: CreateEventInput,
        info: strawberry.Info = None
    ) -> Event:
        db: Session = next(get_db())
        user = get_current_user(info)
        
        if not user:
            raise Exception("Not authenticated")
        
        try:
            event = EventModel(
                organizerId=user['userId'],
                title=input.title,
                description=input.description,
                type=input.type.value,
                coverImage=input.coverImage,
                startDate=datetime.fromisoformat(input.startDate.replace('Z', '+00:00')),
                endDate=datetime.fromisoformat(input.endDate.replace('Z', '+00:00')),
                location=input.location,
                isOnline=input.isOnline,
                meetingUrl=input.meetingUrl,
                capacity=input.capacity,
                price=input.price,
                tags=input.tags or [],
                requirements=input.requirements,
                agenda=input.agenda,
                speakers=input.speakers,
                status='PENDING_APPROVAL'  # Events need admin approval
            )
            
            db.add(event)
            db.commit()
            db.refresh(event)
            
            return Event(
                id=event.id,
                organizerId=event.organizerId,
                title=event.title,
                description=event.description,
                type=event.type,
                status=event.status,
                coverImage=event.coverImage,
                startDate=event.startDate,
                endDate=event.endDate,
                location=event.location,
                isOnline=event.isOnline,
                meetingUrl=event.meetingUrl,
                capacity=event.capacity,
                currentAttendees=0,
                price=event.price,
                currency=event.currency,
                tags=event.tags or [],
                requirements=event.requirements,
                agenda=event.agenda,
                speakers=event.speakers,
                viewCount=0,
                createdAt=event.createdAt,
                updatedAt=event.updatedAt,
                registrationsCount=0,
                hasRegistered=False,
                isFull=False,
                daysLeft=max(0, (event.endDate - datetime.utcnow()).days)
            )
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    @strawberry.mutation
    def registerEvent(
        self,
        eventId: strawberry.ID,
        input: Optional[RegisterEventInput] = None,
        info: strawberry.Info = None
    ) -> Registration:
        db: Session = next(get_db())
        user = get_current_user(info)
        
        if not user:
            raise Exception("Not authenticated")
        
        try:
            event = db.query(EventModel).filter(EventModel.id == str(eventId)).first()
            if not event:
                raise Exception("Event not found")
            
            if event.status != 'PUBLISHED':
                raise Exception("Event is not available for registration")
            
            existing = db.query(RegistrationModel).filter(
                and_(
                    RegistrationModel.eventId == str(eventId),
                    RegistrationModel.userId == user['userId']
                )
            ).first()
            
            if existing:
                raise Exception("You have already registered for this event")
            
            registrations_count = db.query(func.count(RegistrationModel.id)).filter(
                RegistrationModel.eventId == str(eventId)
            ).scalar()
            
            if event.capacity and registrations_count >= event.capacity:
                raise Exception("Event is full")
            
            if datetime.utcnow() > event.startDate:
                raise Exception("Event has already started")
            
            registration = RegistrationModel(
                eventId=str(eventId),
                userId=user['userId'],
                notes=input.notes if input else None,
                status='REGISTERED'
            )
            
            event.currentAttendees += 1
            
            db.add(registration)
            db.commit()
            db.refresh(registration)
            
            return Registration(
                id=registration.id,
                eventId=registration.eventId,
                userId=registration.userId,
                status=RegistrationStatus.REGISTERED,
                notes=registration.notes,
                attendedAt=registration.attendedAt,
                registeredAt=registration.registeredAt,
                updatedAt=registration.updatedAt
            )
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    @strawberry.mutation
    def cancelRegistration(
        self,
        eventId: strawberry.ID,
        info: strawberry.Info = None
    ) -> MessageResponse:
        db: Session = next(get_db())
        user = get_current_user(info)
        
        if not user:
            raise Exception("Not authenticated")
        
        try:
            registration = db.query(RegistrationModel).filter(
                and_(
                    RegistrationModel.eventId == str(eventId),
                    RegistrationModel.userId == user['userId']
                )
            ).first()
            
            if not registration:
                raise Exception("Registration not found")
            
            if registration.status == 'ATTENDED':
                raise Exception("Cannot cancel after attending")
            
            registration.status = 'CANCELLED'
            
            event = db.query(EventModel).filter(EventModel.id == str(eventId)).first()
            if event:
                event.currentAttendees = max(0, event.currentAttendees - 1)
            
            db.commit()
            
            return MessageResponse(
                success=True,
                message="Registration cancelled successfully"
            )
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

# ✅ FIXED: Create schema without federation
schema = strawberry.Schema(
    query=Query,
    mutation=Mutation
)