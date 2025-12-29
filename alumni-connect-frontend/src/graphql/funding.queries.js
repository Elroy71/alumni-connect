import { gql } from '@apollo/client';

export const GET_CAMPAIGNS = gql`
  query GetCampaigns($status: CampaignStatus, $category: CampaignCategory, $search: String) {
    campaigns(status: $status, category: $category, search: $search) {
      id
      userId
      title
      description
      targetAmount
      currentAmount
      progress
      startDate
      endDate
      category
      status
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    campaign(id: $id) {
      id
      userId
      title
      description
      targetAmount
      currentAmount
      progress
      startDate
      endDate
      category
      status
      imageUrl
      createdAt
      updatedAt
      donations {
        id
        donorId
        amount
        message
        paymentStatus
        donatedAt
      }
      updates {
        id
        title
        content
        createdAt
      }
    }
  }
`;

export const GET_MY_CAMPAIGNS = gql`
  query GetMyCampaigns {
    myCampaigns {
      id
      title
      description
      targetAmount
      currentAmount
      progress
      category
      status
      imageUrl
      createdAt
      donations {
        id
        amount
      }
    }
  }
`;

export const GET_MY_DONATIONS = gql`
  query GetMyDonations  {
    myDonations {
      id
      campaignId
      amount
      message
      paymentStatus
      donatedAt
      campaign {
        id
        title
        imageUrl
      }
    }
  }
`;

export const GET_CAMPAIGN_DONATIONS = gql`
  query GetCampaignDonations($campaignId: ID!) {
    campaignDonations(campaignId: $campaignId) {
      id
      donorId
      amount
      message
      paymentStatus
      donatedAt
    }
  }
`;

export const GET_PENDING_CAMPAIGNS = gql`
  query GetPendingCampaigns {
    pendingCampaigns {
      id
      userId
      title
      description
      targetAmount
      currentAmount
      progress
      startDate
      endDate
      category
      status
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

// Alias for backward compatibility
export const GET_PUBLIC_DONATIONS = GET_CAMPAIGN_DONATIONS;