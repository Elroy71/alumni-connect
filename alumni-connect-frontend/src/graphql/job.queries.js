import { gql } from '@apollo/client';

export const GET_JOBS = gql`
  query GetJobs($filter: JobFilterInput) {
    jobs(filter: $filter) {
      jobs {
        id
        title
        description
        type
        level
        location
        isRemote
        salaryMin
        salaryMax
        salaryCurrency
        skills
        benefits
        viewCount
        applicationCount
        deadline
        createdAt
        company {
          id
          name
          logo
          location
          industry
        }
        poster {
          id
          profile {
            fullName
            avatar
          }
        }
        applicationsCount
        savedCount
        hasApplied
        isSaved
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

export const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      title
      description
      requirements
      responsibilities
      type
      level
      location
      isRemote
      salaryMin
      salaryMax
      salaryCurrency
      skills
      benefits
      applicationUrl
      viewCount
      applicationCount
      deadline
      createdAt
      updatedAt
      company {
        id
        name
        slug
        description
        website
        logo
        industry
        size
        location
        founded
      }
      poster {
        id
        email
        profile {
          fullName
          avatar
          currentPosition
          currentCompany
        }
      }
      applicationsCount
      savedCount
      hasApplied
      isSaved
      applicationStatus
    }
  }
`;

export const GET_MY_APPLICATIONS = gql`
  query GetMyApplications($status: ApplicationStatus) {
    myApplications(status: $status) {
      id
      jobId
      coverLetter
      status
      appliedAt
      job {
        id
        title
        type
        location
        company {
          name
          logo
        }
      }
    }
  }
`;

export const GET_SAVED_JOBS = gql`
  query GetSavedJobs {
    mySavedJobs {
      id
      title
      type
      level
      location
      isRemote
      salaryMin
      salaryMax
      createdAt
      company {
        name
        logo
      }
      applicationsCount
    }
  }
`;

// export const GET_COMPANIES = gql`
//   query GetCompanies {
//     companies {
//       id
//       name
//       slug
//       logo
//       industry
//       location
//       jobsCount
//     }
//   }
// `;

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      logo
      description
      industry
      size
      location
    }
  }
`;