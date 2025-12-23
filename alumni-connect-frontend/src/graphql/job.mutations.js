import { gql } from '@apollo/client';

export const APPLY_JOB = gql`
  mutation ApplyJob($jobId: ID!, $input: ApplyJobInput!) {
    applyJob(jobId: $jobId, input: $input) {
      id
      status
      appliedAt
    }
  }
`;

export const TOGGLE_SAVE_JOB = gql`
  mutation ToggleSaveJob($jobId: ID!) {
    toggleSaveJob(jobId: $jobId) {
      saved
      message
    }
  }
`;

export const CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      title
      type
      level
      location
      createdAt
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      description
      website
      logo
      industry
      size
      location
      founded
    }
  }
`;