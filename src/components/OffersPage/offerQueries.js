import { gql } from '@apollo/client';

export const CREATE_PROMOTION = gql`
    mutation CreatePromotion($promotionInput: PromotionInput!) {
        createPromotion(promotionInput: $promotionInput) {
            _id
            displayName
            baseCode
        }
    }
`;

export const GET_PROMOTIONS = gql`
  query GetPromotions {
    promotions {
      _id
      displayName
      description
      baseCode
      promotionType
      minPercentageDiscount
      maxPercentageDiscount
      minimumMaxDiscount
      minFlatDiscount
      maxFlatDiscount
      minimumOrderValue
      isActive
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($campaignInput: CampaignInput!) {
    createCampaignForPromotions(input: $campaignInput) {
      _id
      restaurant
      name
      description
      promotion
      couponCode
      campaignType
      minimumOrderValue
      percentageDiscount
      maxDiscount
      flatDiscount
      startDate
      endDate
      startTime
      endTime
      isActive
    }
  }
`;

export const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      _id
      restaurant
      name
      description
      promotion
      couponCode
      campaignType
      minimumOrderValue
      percentageDiscount
      maxDiscount
      flatDiscount
      startDate
      endDate
      startTime
      endTime
      isActive
    }
  }
`;