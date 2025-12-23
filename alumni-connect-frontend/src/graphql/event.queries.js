import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents($filter: EventFilterInput) {
    events(filter: $filter) {
      events {
        id
        organizerId
        title
        description
        type
        status
        coverImage
        startDate
        endDate
        location
        isOnline
        meetingUrl
        capacity
        currentAttendees
        price
        currency
        tags
        viewCount
        registrationsCount
        hasRegistered
        registrationStatus
        isFull
        daysLeft
        createdAt
        updatedAt
      }
      pagination {
        total
        limit
        offset
        hasMore
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      organizerId
      title
      description
      type
      status
      coverImage
      startDate
      endDate
      location
      isOnline
      meetingUrl
      capacity
      currentAttendees
      price
      currency
      tags
      requirements
      agenda
      speakers
      viewCount
      registrationsCount
      hasRegistered
      registrationStatus
      isFull
      daysLeft
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_REGISTRATIONS = gql`
  query GetMyRegistrations($status: RegistrationStatus, $upcoming: Boolean) {
    myRegistrations(status: $status, upcoming: $upcoming) {
      id
      eventId
      userId
      status
      notes
      attendedAt
      registeredAt
      updatedAt
    }
  }
`;