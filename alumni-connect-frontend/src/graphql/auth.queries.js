import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
      status
      profile {
        id
        fullName
        nim
        batch
        major
        graduationYear
        phone
        avatar
      }
      createdAt
      lastLogin
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      role
      status
      profile {
        id
        fullName
        nim
        batch
        major
        graduationYear
      }
    }
  }
`;