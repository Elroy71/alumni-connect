import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      content
      excerpt
      categoryId
      status
      createdAt
      user {
        id
        profile {
          fullName
        }
      }
      category {
        name
      }
      commentsCount
      likesCount
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
      excerpt
      categoryId
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $content: String!, $parentId: ID) {
    createComment(postId: $postId, content: $content, parentId: $parentId) {
      id
      postId
      content
      createdAt
      user {
        id
        profile {
          fullName
          avatar
        }
      }
      repliesCount
      likesCount
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      success
      message
    }
  }
`;

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($targetId: ID!, $type: String!) {
    toggleLike(targetId: $targetId, type: $type) {
      liked
      message
    }
  }
`;