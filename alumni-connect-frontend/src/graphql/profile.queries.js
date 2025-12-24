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
      experiences {
        id
        title
        company
        location
        employmentType
        startDate
        endDate
        isCurrentJob
        description
        createdAt
        updatedAt
      }
      education {
        id
        institution
        degree
        fieldOfStudy
        startDate
        endDate
        isCurrentStudy
        grade
        activities
        description
        createdAt
        updatedAt
      }
      skillsList {
        id
        name
        level
        yearsOfExperience
        endorsements
        createdAt
      }
      achievements {
        id
        title
        issuer
        issueDate
        expiryDate
        credentialId
        credentialUrl
        description
        createdAt
        updatedAt
      }
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