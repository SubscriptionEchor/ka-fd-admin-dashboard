import { gql } from '@apollo/client';

export const CREATE_BANNER = gql`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      _id
      templateId
      elements {
        key
        text
        color
        image
        gradient
      }
    }
  }
`;

export const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: ID!, $input: CreateBannerInput!) {
    updateBanner(id: $id, input: $input) {
      _id
      templateId
      elements {
        key
        text
        color
        image
        gradient
      }
    }
  }
`;

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id)
  }
`;