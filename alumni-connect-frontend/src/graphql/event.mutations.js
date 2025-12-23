import { gql } from '@apollo/client';

export const REGISTER_EVENT = gql`
  mutation RegisterEvent($eventId: ID!, $input: RegisterEventInput) {
    registerEvent(eventId: $eventId, input: $input) {
      id
      status
      registeredAt
    }
  }
`;

export const CANCEL_REGISTRATION = gql`
  mutation CancelRegistration($eventId: ID!) {
    cancelRegistration(eventId: $eventId) {
      success
      message
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      type
      startDate
      endDate
      location
      createdAt
    }
  }
`;