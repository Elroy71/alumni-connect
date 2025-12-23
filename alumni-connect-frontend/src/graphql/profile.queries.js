import { gql } from '@apollo/client';

export const MY_PROFILE_QUERY = gql`
  query MyProfile {
    myProfile {
      id
      userId
      fullName
      nim
      batch
      major
      graduationYear
      gender
      dateOfBirth
      placeOfBirth
      phone
      address
      city
      province
      country
      postalCode
      linkedinUrl
      githubUrl
      portfolioUrl
      currentCompany
      currentPosition
      industry
      yearsOfExperience
      bio
      skills
      interests
      avatar
      coverImage
      cardNumber
      qrCode
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROFILE_QUERY = gql`
  query GetProfile($userId: ID!) {
    profile(userId: $userId) {
      id
      userId
      fullName
      nim
      batch
      major
      graduationYear
      currentCompany
      currentPosition
      avatar
      cardNumber
    }
  }
`;