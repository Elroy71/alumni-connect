import { gql } from '@apollo/client';

export const CREATE_DONATION = gql`
  mutation CreateDonation($campaignId: ID!, $input: CreateDonationInput!) {
    createDonation(campaignId: $campaignId, input: $input) {
      id
      amount
      status
      donatedAt
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      title
      category
      goalAmount
      endDate
      createdAt
    }
  }
`;