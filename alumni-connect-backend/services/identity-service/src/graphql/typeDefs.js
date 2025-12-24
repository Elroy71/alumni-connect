// const gql = require('graphql-tag');
import gql from 'graphql-tag';
import { adminTypeDefs } from '../modules/admin/admin.typeDefs.js';

const baseTypeDefs = gql`
  # ==================== BASE TYPES ====================

  type MessageResponse {
    success: Boolean!
    message: String!
  }

  # ==================== USER & AUTH ====================

  enum UserRole {
    ALUMNI
    SUPER_ADMIN
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
    PENDING_VERIFICATION
  }

  enum Gender {
    MALE
    FEMALE
  }

  type User {
    id: ID!
    email: String!
    role: UserRole!
    status: UserStatus!
    profile: Profile
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    id: ID!
    userId: String!
    fullName: String!
    nim: String
    batch: String
    major: String
    graduationYear: Int
    gender: Gender
    dateOfBirth: String
    placeOfBirth: String
    phone: String
    address: String
    city: String
    province: String
    country: String
    postalCode: String
    linkedinUrl: String
    githubUrl: String
    portfolioUrl: String
    currentCompany: String
    currentPosition: String
    industry: String
    yearsOfExperience: Int
    bio: String
    skills: [String]
    interests: [String]
    avatar: String
    coverImage: String
    cardNumber: String
    qrCode: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    email: String!
    password: String!
    fullName: String!
    nim: String
    batch: String
    major: String
    graduationYear: Int
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    fullName: String
    nim: String
    batch: String
    major: String
    graduationYear: Int
    gender: Gender
    dateOfBirth: String
    placeOfBirth: String
    phone: String
    address: String
    city: String
    province: String
    country: String
    postalCode: String
    linkedinUrl: String
    githubUrl: String
    portfolioUrl: String
    currentCompany: String
    currentPosition: String
    industry: String
    yearsOfExperience: Int
    bio: String
    skills: [String]
    interests: [String]
    avatar: String
    coverImage: String
  }

  # ==================== FORUM TYPES ====================

  enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
    DELETED
  }

  type Post {
    id: ID!
    userId: String!
    title: String!
    content: String!
    excerpt: String
    coverImage: String
    categoryId: String
    status: PostStatus!
    views: Int!
    createdAt: String!
    updatedAt: String!
    user: User!
    category: Category
    tags: [PostTag!]!
    commentsCount: Int!
    likesCount: Int!
    isLiked: Boolean!
  }

  type Comment {
    id: ID!
    postId: String!
    userId: String!
    content: String!
    parentId: String
    createdAt: String!
    updatedAt: String!
    user: User!
    replies: [Comment!]!
    repliesCount: Int!
    likesCount: Int!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    icon: String
    color: String
    postsCount: Int!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
  }

  type PostTag {
    postId: String!
    tagId: String!
    tag: Tag!
  }

  type PostsResponse {
    posts: [Post!]!
    pagination: Pagination!
  }

  type Pagination {
    total: Int!
    limit: Int!
    offset: Int!
    hasMore: Boolean!
  }

  type LikeResponse {
    liked: Boolean!
    message: String!
  }

  input CreatePostInput {
    title: String!
    content: String!
    excerpt: String
    coverImage: String
    categoryId: String
    tags: [String!]
  }

  input UpdatePostInput {
    title: String
    content: String
    excerpt: String
    coverImage: String
    categoryId: String
  }

  input PostFilterInput {
    categoryId: String
    userId: String
    search: String
    status: PostStatus
    limit: Int
    offset: Int
    orderBy: String
    order: String
  }

  # ==================== QUERIES ====================

  type Query {
    # Auth & User
    me: User!
    user(id: ID!): User

    # Profile
    profile(userId: ID!): Profile
    myProfile: Profile!

    # Forum
    posts(filter: PostFilterInput): PostsResponse!
    post(id: ID!): Post!
    myPosts: [Post!]!
    comments(postId: ID!, limit: Int, offset: Int): [Comment!]!
    categories: [Category!]!
  }

  # ==================== MUTATIONS ====================

  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Profile
    updateProfile(input: UpdateProfileInput!): Profile!
    generateAlumniCard: Profile!

    # Forum - Posts
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): MessageResponse!

    # Forum - Comments
    createComment(postId: ID!, content: String!, parentId: ID): Comment!
    deleteComment(id: ID!): MessageResponse!

    # Forum - Likes
    toggleLike(targetId: ID!, type: String!): LikeResponse!

    # Forum - Categories
    createCategory(name: String!, description: String, icon: String, color: String): Category!
  }
    # ==================== JOB TYPES ====================

  enum JobType {
    FULL_TIME
    PART_TIME
    CONTRACT
    INTERNSHIP
    FREELANCE
  }

  enum JobLevel {
    ENTRY
    JUNIOR
    MID
    SENIOR
    LEAD
    MANAGER
    DIRECTOR
  }

  enum ApplicationStatus {
    PENDING
    REVIEWED
    SHORTLISTED
    INTERVIEW
    OFFERED
    ACCEPTED
    REJECTED
  }

  type Job {
    id: ID!
    companyId: String
    postedBy: String!
    title: String!
    description: String!
    requirements: String!
    responsibilities: String!
    type: JobType!
    level: JobLevel!
    location: String!
    isRemote: Boolean!
    salaryMin: Int
    salaryMax: Int
    salaryCurrency: String!
    skills: [String!]!
    benefits: [String!]!
    applicationUrl: String
    isActive: Boolean!
    viewCount: Int!
    applicationCount: Int!
    deadline: String
    createdAt: String!
    updatedAt: String!
    poster: User!
    company: Company
    applicationsCount: Int!
    savedCount: Int!
    hasApplied: Boolean!
    isSaved: Boolean!
    applicationStatus: ApplicationStatus
  }

  type Company {
    id: ID!
    name: String!
    slug: String!
    description: String
    website: String
    logo: String
    coverImage: String
    industry: String
    size: String
    location: String
    founded: Int
    jobsCount: Int!
  }

  type Application {
    id: ID!
    jobId: String!
    userId: String!
    coverLetter: String
    resumeUrl: String
    portfolioUrl: String
    status: ApplicationStatus!
    notes: String
    appliedAt: String!
    updatedAt: String!
    job: Job!
    user: User!
  }

  type JobsResponse {
    jobs: [Job!]!
    pagination: Pagination!
  }

  type SaveResponse {
    saved: Boolean!
    message: String!
  }

  input CreateJobInput {
    title: String!
    description: String!
    requirements: String!
    responsibilities: String!
    type: JobType!
    level: JobLevel!
    location: String!
    isRemote: Boolean!
    salaryMin: Int
    salaryMax: Int
    skills: [String!]
    benefits: [String!]
    applicationUrl: String
    deadline: String
    companyId: String
  }

  input UpdateJobInput {
    title: String
    description: String
    requirements: String
    responsibilities: String
    type: JobType
    level: JobLevel
    location: String
    isRemote: Boolean
    salaryMin: Int
    salaryMax: Int
    skills: [String!]
    benefits: [String!]
    applicationUrl: String
    deadline: String
    isActive: Boolean
  }

  input ApplyJobInput {
    coverLetter: String
    resumeUrl: String
    portfolioUrl: String
  }

  input JobFilterInput {
    search: String
    type: JobType
    level: JobLevel
    location: String
    isRemote: Boolean
    companyId: String
    postedBy: String
    isActive: Boolean
    limit: Int
    offset: Int
    orderBy: String
    order: String
  }

  input CreateCompanyInput {
    name: String!
    description: String
    website: String
    logo: String
    industry: String
    size: String
    location: String
    founded: Int
  }

  extend type Query {
    # Jobs
    jobs(filter: JobFilterInput): JobsResponse!
    job(id: ID!): Job!
    myPostedJobs: [Job!]!
    myApplications(status: ApplicationStatus): [Application!]!
    mySavedJobs: [Job!]!
    jobApplications(jobId: ID!): [Application!]!
    
    # Companies
    companies: [Company!]!
    company(id: ID!): Company
  }

  extend type Mutation {
    # Jobs
    createJob(input: CreateJobInput!): Job!
    updateJob(id: ID!, input: UpdateJobInput!): Job!
    deleteJob(id: ID!): MessageResponse!
    
    # Applications
    applyJob(jobId: ID!, input: ApplyJobInput!): Application!
    updateApplicationStatus(applicationId: ID!, status: ApplicationStatus!, notes: String): Application!
    
    # Saved Jobs
    toggleSaveJob(jobId: ID!): SaveResponse!
    
    # Companies
    createCompany(input: CreateCompanyInput!): Company!
  }

  # ==================== EVENT TYPES ====================

  enum EventType {
    WEBINAR
    WORKSHOP
    MEETUP
    REUNION
    SEMINAR
    NETWORKING
    CONFERENCE
  }

  enum EventStatus {
    DRAFT
    PENDING_APPROVAL
    PUBLISHED
    ONGOING
    COMPLETED
    CANCELLED
    REJECTED
  }

  enum RegistrationStatus {
    REGISTERED
    CONFIRMED
    ATTENDED
    CANCELLED
  }

  type Event {
    id: ID!
    organizerId: String!
    title: String!
    description: String!
    type: EventType!
    status: EventStatus!
    coverImage: String
    startDate: String!
    endDate: String!
    location: String!
    isOnline: Boolean!
    meetingUrl: String
    capacity: Int
    currentAttendees: Int!
    price: Int!
    currency: String!
    tags: [String!]!
    requirements: String
    agenda: String
    speakers: String
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
    organizer: User!
    registrationsCount: Int!
    hasRegistered: Boolean!
    registrationStatus: RegistrationStatus
    isFull: Boolean!
  }

  type Registration {
    id: ID!
    eventId: String!
    userId: String!
    status: RegistrationStatus!
    notes: String
    attendedAt: String
    registeredAt: String!
    updatedAt: String!
    event: Event!
    user: User!
  }

  type EventsResponse {
    events: [Event!]!
    pagination: Pagination!
  }

  input CreateEventInput {
    title: String!
    description: String!
    type: EventType!
    coverImage: String
    startDate: String!
    endDate: String!
    location: String!
    isOnline: Boolean!
    meetingUrl: String
    capacity: Int
    price: Int
    tags: [String!]
    requirements: String
    agenda: String
    speakers: String
  }

  input UpdateEventInput {
    title: String
    description: String
    type: EventType
    status: EventStatus
    coverImage: String
    startDate: String
    endDate: String
    location: String
    isOnline: Boolean
    meetingUrl: String
    capacity: Int
    price: Int
    tags: [String!]
    requirements: String
    agenda: String
    speakers: String
  }

  input RegisterEventInput {
    notes: String
  }

  input EventFilterInput {
    search: String
    type: EventType
    status: EventStatus
    isOnline: Boolean
    organizerId: String
    upcoming: Boolean
    limit: Int
    offset: Int
    orderBy: String
    order: String
  }

  extend type Query {
    # Events
    events(filter: EventFilterInput): EventsResponse!
    event(id: ID!): Event!
    myOrganizedEvents: [Event!]!
    myRegistrations(status: RegistrationStatus, upcoming: Boolean): [Registration!]!
    eventRegistrations(eventId: ID!): [Registration!]!
  }

  extend type Mutation {
    # Events
    createEvent(input: CreateEventInput!): Event!
    updateEvent(id: ID!, input: UpdateEventInput!): Event!
    deleteEvent(id: ID!): MessageResponse!
    
    # Registrations
    registerEvent(eventId: ID!, input: RegisterEventInput): Registration!
    cancelRegistration(eventId: ID!): MessageResponse!
    updateRegistrationStatus(registrationId: ID!, status: RegistrationStatus!): Registration!
  }

  # ==================== FUNDING TYPES ====================

  enum CampaignStatus {
    DRAFT
    PENDING_APPROVAL
    ACTIVE
    COMPLETED
    CANCELLED
    REJECTED
  }

  type Campaign {
    id: ID!
    creatorId: String!
    title: String!
    description: String!
    story: String
    coverImage: String
    category: String!
    goalAmount: Int!
    currentAmount: Int!
    currency: String!
    startDate: String!
    endDate: String!
    status: CampaignStatus!
    beneficiary: String
    bankAccount: String
    phoneNumber: String
    updates: String
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
    creator: User!
    donationsCount: Int!
    percentage: Float!
    daysLeft: Int!
    hasDonated: Boolean!
  }

  type Donation {
    id: ID!
    campaignId: String!
    donorId: String!
    amount: Int!
    currency: String!
    message: String
    isAnonymous: Boolean!
    paymentProof: String
    status: String!
    verifiedAt: String
    donatedAt: String!
    updatedAt: String!
    campaign: Campaign!
    donor: User!
  }

  type CampaignsResponse {
    campaigns: [Campaign!]!
    pagination: Pagination!
  }

  input CreateCampaignInput {
    title: String!
    description: String!
    story: String
    coverImage: String
    category: String!
    goalAmount: Int!
    endDate: String!
    beneficiary: String
    bankAccount: String
    phoneNumber: String
  }

  input UpdateCampaignInput {
    title: String
    description: String
    story: String
    coverImage: String
    category: String
    goalAmount: Int
    endDate: String
    status: CampaignStatus
    beneficiary: String
    bankAccount: String
    phoneNumber: String
    updates: String
  }

  input CreateDonationInput {
    amount: Int!
    message: String
    isAnonymous: Boolean
    paymentProof: String
  }

  input CampaignFilterInput {
    search: String
    category: String
    status: CampaignStatus
    creatorId: String
    limit: Int
    offset: Int
    orderBy: String
    order: String
  }

  extend type Query {
    # Campaigns
    campaigns(filter: CampaignFilterInput): CampaignsResponse!
    campaign(id: ID!): Campaign!
    myCampaigns: [Campaign!]!
    
    # Donations
    myDonations(status: String): [Donation!]!
    campaignDonations(campaignId: ID!): [Donation!]!
    publicDonations(campaignId: ID!): [Donation!]!
  }

  extend type Mutation {
    # Campaigns
    createCampaign(input: CreateCampaignInput!): Campaign!
    updateCampaign(id: ID!, input: UpdateCampaignInput!): Campaign!
    deleteCampaign(id: ID!): MessageResponse!
    
    # Donations
    createDonation(campaignId: ID!, input: CreateDonationInput!): Donation!
    verifyDonation(donationId: ID!, status: String!): Donation!
  }
    
`;

// Merge base and admin typeDefs
const typeDefs = [baseTypeDefs, adminTypeDefs];

// module.exports = typeDefs;
export default typeDefs;
