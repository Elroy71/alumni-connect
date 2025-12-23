import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
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
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
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
      token
    }
  }
`;