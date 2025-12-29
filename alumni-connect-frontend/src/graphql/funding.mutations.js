import { gql } from '@apollo/client';

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      title
      description
      targetAmount
      category
      status
      imageUrl
      createdAt
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $input: UpdateCampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      title
      description
      targetAmount
      category
      status
      imageUrl
      updatedAt
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id)
  }
`;

export const DONATE_TO_CAMPAIGN = gql`
  mutation DonateToCampaign($input: DonationInput!) {
    donateToCampaign(input: $input) {
      id
      campaignId
      amount
      message
      paymentStatus
      transactionId
      donatedAt
      campaign {
        id
        title
        currentAmount
        progress
      }
    }
  }
`;

export const ADD_CAMPAIGN_UPDATE = gql`
  mutation AddCampaignUpdate($input: CampaignUpdateInput!) {
    addCampaignUpdate(input: $input) {
      id
      campaignId
      title
      content
      createdAt
    }
  }
`;

export const APPROVE_CAMPAIGN = gql`
  mutation ApproveCampaign($id: ID!) {
    approveCampaign(id: $id) {
      id
      title
      status
      approvedBy
      approvedAt
    }
  }
`;

export const REJECT_CAMPAIGN = gql`
  mutation RejectCampaign($id: ID!, $reason: String!) {
    rejectCampaign(id: $id, reason: $reason) {
      id
      title
      status
      rejectedBy
      rejectedAt
      rejectionReason
    }
  }
`;

// Alias for backward compatibility
export const CREATE_DONATION = DONATE_TO_CAMPAIGN;