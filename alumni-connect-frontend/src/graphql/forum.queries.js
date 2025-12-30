import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($filter: PostFilterInput) {
    posts(filter: $filter) {
      posts {
        id
        userId
        title
        content
        excerpt
        coverImage
        mediaType
        mediaUrl
        categoryId
        status
        views
        createdAt
        updatedAt
        user {
          id
          email
          profile {
            fullName
            avatar
            currentPosition
            currentCompany
          }
        }
        category {
          id
          name
          slug
          color
        }
        tags {
          tag {
            id
            name
            slug
          }
        }
        commentsCount
        likesCount
        isLiked
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

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      userId
      title
      content
      excerpt
      coverImage
      mediaType
      mediaUrl
      categoryId
      status
      views
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          fullName
          avatar
          currentPosition
          currentCompany
          batch
          major
        }
      }
      category {
        id
        name
        slug
        color
        icon
      }
      tags {
        tag {
          id
          name
          slug
        }
      }
      commentsCount
      likesCount
      isLiked
    }
  }
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
      id
      title
      excerpt
      status
      views
      createdAt
      category {
        name
        color
      }
      commentsCount
      likesCount
    }
  }
`;

export const GET_COMMENTS = gql`
  query GetComments($postId: ID!, $limit: Int, $offset: Int) {
    comments(postId: $postId, limit: $limit, offset: $offset) {
      id
      postId
      userId
      content
      parentId
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          fullName
          avatar
        }
      }
      replies {
        id
        content
        createdAt
        user {
          id
          email
          profile {
            fullName
            avatar
          }
        }
        likesCount
      }
      repliesCount
      likesCount
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      icon
      color
      postsCount
    }
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!, $limit: Int) {
    userPosts(userId: $userId, limit: $limit) {
      id
      userId
      title
      content
      excerpt
      coverImage
      mediaType
      mediaUrl
      categoryId
      status
      views
      createdAt
      updatedAt
      user {
        id
        email
        profile {
          fullName
          avatar
          currentPosition
          currentCompany
        }
      }
      category {
        id
        name
        slug
        color
      }
      commentsCount
      likesCount
      isLiked
    }
  }
`;