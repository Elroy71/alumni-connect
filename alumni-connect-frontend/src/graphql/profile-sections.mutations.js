import { gql } from '@apollo/client';

// ==================== EXPERIENCE MUTATIONS ====================

export const ADD_EXPERIENCE_MUTATION = gql`
  mutation AddExperience($input: CreateExperienceInput!) {
    addExperience(input: $input) {
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
  }
`;

export const UPDATE_EXPERIENCE_MUTATION = gql`
  mutation UpdateExperience($id: ID!, $input: UpdateExperienceInput!) {
    updateExperience(id: $id, input: $input) {
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
  }
`;

export const DELETE_EXPERIENCE_MUTATION = gql`
  mutation DeleteExperience($id: ID!) {
    deleteExperience(id: $id) {
      success
      message
    }
  }
`;

// ==================== EDUCATION MUTATIONS ====================

export const ADD_EDUCATION_MUTATION = gql`
  mutation AddEducation($input: CreateEducationInput!) {
    addEducation(input: $input) {
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
  }
`;

export const UPDATE_EDUCATION_MUTATION = gql`
  mutation UpdateEducation($id: ID!, $input: UpdateEducationInput!) {
    updateEducation(id: $id, input: $input) {
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
  }
`;

export const DELETE_EDUCATION_MUTATION = gql`
  mutation DeleteEducation($id: ID!) {
    deleteEducation(id: $id) {
      success
      message
    }
  }
`;

// ==================== SKILL MUTATIONS ====================

export const ADD_SKILL_MUTATION = gql`
  mutation AddSkill($input: CreateSkillInput!) {
    addSkill(input: $input) {
      id
      name
      level
      yearsOfExperience
      endorsements
      createdAt
    }
  }
`;

export const UPDATE_SKILL_MUTATION = gql`
  mutation UpdateSkill($id: ID!, $input: UpdateSkillInput!) {
    updateSkill(id: $id, input: $input) {
      id
      name
      level
      yearsOfExperience
      endorsements
      createdAt
    }
  }
`;

export const DELETE_SKILL_MUTATION = gql`
  mutation DeleteSkill($id: ID!) {
    deleteSkill(id: $id) {
      success
      message
    }
  }
`;

// ==================== ACHIEVEMENT MUTATIONS ====================

export const ADD_ACHIEVEMENT_MUTATION = gql`
  mutation AddAchievement($input: CreateAchievementInput!) {
    addAchievement(input: $input) {
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
`;

export const UPDATE_ACHIEVEMENT_MUTATION = gql`
  mutation UpdateAchievement($id: ID!, $input: UpdateAchievementInput!) {
    updateAchievement(id: $id, input: $input) {
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
`;

export const DELETE_ACHIEVEMENT_MUTATION = gql`
  mutation DeleteAchievement($id: ID!) {
    deleteAchievement(id: $id) {
      success
      message
    }
  }
`;
