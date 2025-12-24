import gql from 'graphql-tag';

export const adminTypeDefs = gql`
  # ==================== INPUT TYPES ====================
  
  input UserFilterInput {
    search: String
    role: UserRole
    status: UserStatus
  }

  input ContentFilterInput {
    status: String
  }

  input PaginationInput {
    skip: Int
    take: Int
  }

  # ==================== OBJECT TYPES ====================

  type UserStats {
    total: Int!
    active: Int!
    suspended: Int!
    newThisWeek: Int!
  }

  type EventStats {
    total: Int!
    pending: Int!
  }

  type CampaignStats {
    total: Int!
    pending: Int!
  }

  type JobStats {
    total: Int!
  }

  type PostStats {
    total: Int!
  }

  type DashboardStats {
    users: UserStats!
    events: EventStats!
    campaigns: CampaignStats!
    jobs: JobStats!
    posts: PostStats!
  }

  type RecentActivities {
    users: [User!]!
    events: [Event!]!
    campaigns: [Campaign!]!
  }

  type DashboardData {
    stats: DashboardStats!
    recentActivities: RecentActivities!
  }

  type UserList {
    users: [User!]!
    total: Int!
  }

  type EventList {
    events: [Event!]!
    total: Int!
  }

  type CampaignList {
    campaigns: [Campaign!]!
    total: Int!
  }

  # ==================== QUERIES ====================

  extend type Query {
    # Dashboard
    getDashboardStats: DashboardData!
    
    # User Management
    getAllUsers(filter: UserFilterInput, pagination: PaginationInput): UserList!
    
    # Event Approval
    getPendingEvents(pagination: PaginationInput): EventList!
    getAllEvents(filter: ContentFilterInput, pagination: PaginationInput): EventList!
    
    # Campaign Approval
    getPendingCampaigns(pagination: PaginationInput): CampaignList!
    getAllCampaigns(filter: ContentFilterInput, pagination: PaginationInput): CampaignList!
  }

  # ==================== MUTATIONS ====================

  extend type Mutation {
    # User Management
    suspendUser(userId: ID!, reason: String!): User!
    activateUser(userId: ID!): User!
    deleteUser(userId: ID!): User!
    
    # Event Approval
    approveEvent(eventId: ID!): Event!
    rejectEvent(eventId: ID!, reason: String!): Event!
    
    # Campaign Approval
    approveCampaign(campaignId: ID!): Campaign!
    rejectCampaign(campaignId: ID!, reason: String!): Campaign!
    
    # Content Deletion
    deleteContent(contentType: String!, contentId: ID!): Boolean!
  }
`;
