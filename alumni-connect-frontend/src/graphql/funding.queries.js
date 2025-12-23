import { gql } from '@apollo/client';

export const GET_CAMPAIGNS = gql`
  query GetCampaigns($filter: CampaignFilterInput) {
    campaigns(filter: $filter) {
      campaigns {
        id
        title
        description
        coverImage
        category
        goalAmount
        currentAmount
        currency
        startDate
        endDate
        status
        viewCount
        createdAt
        creator {
          id
          profile {
            fullName
            avatar
          }
        }
        donationsCount
        percentage
        daysLeft
        hasDonated
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

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    campaign(id: $id) {
      id
      title
      description
      story
      coverImage
      category
      goalAmount
      currentAmount
      currency
      startDate
      endDate
      status
      beneficiary
      bankAccount
      phoneNumber
      updates
      viewCount
      createdAt
      updatedAt
      creator {
        id
        email
        profile {
          fullName
          avatar
          currentPosition
          currentCompany
          phone
        }
      }
      donationsCount
      percentage
      daysLeft
      hasDonated
    }
  }
`;

export const GET_PUBLIC_DONATIONS = gql`
  query GetPublicDonations($campaignId: ID!) {
    publicDonations(campaignId: $campaignId) {
      id
      amount
      currency
      message
      donatedAt
      donor {
        profile {
          fullName
          avatar
        }
      }
    }
  }
`;

export const GET_MY_DONATIONS = gql`
  query GetMyDonations($status: String) {
    myDonations(status: $status) {
      id
      amount
      currency
      message
      status
      donatedAt
      campaign {
        id
        title
        coverImage
        creator {
          profile {
            fullName
          }
        }
      }
    }
  }
`;