import { gql } from '@apollo/client';

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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
      updatedAt
    }
  }
`;

export const GENERATE_ALUMNI_CARD_MUTATION = gql`
  mutation GenerateAlumniCard {
    generateAlumniCard {
      id
      cardNumber
      qrCode
    }
  }
`;