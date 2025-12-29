import { gql } from '@apollo/client';

// ==================== QUERIES ====================

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      stats {
        users {
          total
          active
          suspended
          newThisWeek
        }
        events {
          total
          pending
        }
        campaigns {
          total
          pending
        }
        jobs {
          total
        }
        posts {
          total
        }
      }
      recentActivities {
        users {
          id
          email
          createdAt
          profile {
            fullName
            avatar
          }
        }
        events {
          id
          title
          status
          createdAt
          organizer {
            profile {
              fullName
            }
          }
        }
        campaigns {
          id
          title
          status
          createdAt
          creator {
            profile {
              fullName
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($filter: UserFilterInput, $pagination: PaginationInput) {
    getAllUsers(filter: $filter, pagination: $pagination) {
      users {
        id
        email
        role
        status
        createdAt
        profile {
          fullName
          avatar
          currentPosition
          currentCompany
        }
      }
      total
    }
  }
`;

export const GET_PENDING_EVENTS = gql`
  query GetPendingEvents($pagination: PaginationInput) {
    getPendingEvents(pagination: $pagination) {
      events {
        id
        title
        description
        type
        status
        startDate
        endDate
        location
        isOnline
        coverImage
        createdAt
        organizer {
          id
          email
          profile {
            fullName
            avatar
          }
        }
      }
      total
    }
  }
`;

export const GET_ALL_EVENTS = gql`
  query GetAllEvents($filter: ContentFilterInput, $pagination: PaginationInput) {
    getAllEvents(filter: $filter, pagination: $pagination) {
      events {
        id
        title
        type
        status
        startDate
        createdAt
        organizer {
          profile {
            fullName
          }
        }
      }
      total
    }
  }
`;

export const GET_PENDING_CAMPAIGNS = gql`
  query GetPendingCampaigns($pagination: PaginationInput) {
    getPendingCampaigns(pagination: $pagination) {
      campaigns {
        id
        title
        description
        category
        goalAmount
        currentAmount
        status
        coverImage
        endDate
        createdAt
        creator {
          id
          email
          profile {
            fullName
            avatar
          }
        }
      }
      total
    }
  }
`;

export const GET_ALL_CAMPAIGNS = gql`
  query GetAllCampaigns($filter: ContentFilterInput, $pagination: PaginationInput) {
    getAllCampaigns(filter: $filter, pagination: $pagination) {
      campaigns {
        id
        title
        category
        status
        goalAmount
        createdAt
        creator {
          profile {
            fullName
          }
        }
      }
      total
    }
  }
`;

// ==================== MUTATIONS ====================

export const SUSPEND_USER = gql`
  mutation SuspendUser($userId: ID!, $reason: String!) {
    suspendUser(userId: $userId, reason: $reason) {
      id
      status
    }
  }
`;

export const ACTIVATE_USER = gql`
  mutation ActivateUser($userId: ID!) {
    activateUser(userId: $userId) {
      id
      status
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      id
      status
    }
  }
`;

export const APPROVE_EVENT = gql`
  mutation ApproveEvent($eventId: ID!) {
    approveEvent(eventId: $eventId) {
      id
      status
    }
  }
`;

export const REJECT_EVENT = gql`
  mutation RejectEvent($eventId: ID!, $reason: String!) {
    rejectEvent(eventId: $eventId, reason: $reason) {
      id
      status
    }
  }
`;

export const APPROVE_CAMPAIGN = gql`
  mutation ApproveCampaign($campaignId: ID!) {
    approveCampaign(campaignId: $campaignId) {
      id
      status
    }
  }
`;

export const REJECT_CAMPAIGN = gql`
  mutation RejectCampaign($campaignId: ID!, $reason: String!) {
    rejectCampaign(campaignId: $campaignId, reason: $reason) {
      id
      status
    }
  }
`;

export const DELETE_CONTENT = gql`
  mutation DeleteContent($contentType: String!, $contentId: ID!) {
    deleteContent(contentType: $contentType, contentId: $contentId)
  }
`;

export const GET_EVENT_HISTORY = gql`
  query GetEventHistory($pagination: PaginationInput) {
    getAllEvents(pagination: $pagination) {
      events {
        id
        title
        description
        type
        status
        startDate
        endDate
        location
        isOnline
        coverImage
        createdAt
        organizer {
          id
          email
          profile {
            fullName
            avatar
          }
        }
      }
      total
    }
  }
`;
