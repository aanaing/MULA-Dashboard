import { gql } from "@apollo/client";
//get all digital artwork
export const All_DIGITAL_ARTWORKS = gql`
  query MyQuery($limit: Int!, $offset: Int!, $search: String!) {
    digital_art_work(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: { artwork_name: { _ilike: $search } }
    ) {
      id
      artwork_name
      artwork_image_url
      artwork_year
      current_price
      update_price
      pending
      artwork_name_mm
    }
    digital_art_work_aggregate {
      aggregate {
        count
      }
    }
  }
`;

// add digital artwork
export const ADD_DIGITAL_ARTWORK = gql`
  mutation add_digital_artwork(
    $artwork_image_url: String!
    $artwork_name: String!
    $artwork_name_mm: String!
    $artwork_year: Int!
    $current_price: Int!
    $disabled: Boolean!
    $fk_artist_id: Int!
    $pending: Boolean!
    $update_price: Int!
  ) {
    insert_digital_art_work_one(
      object: {
        artwork_image_url: $artwork_image_url
        artwork_name: $artwork_name
        artwork_name_mm: $artwork_name_mm
        artwork_year: $artwork_year
        current_price: $current_price
        disabled: $disabled
        fk_artist_id: $fk_artist_id
        pending: $pending
        update_price: $update_price
      }
    ) {
      id
    }
  }
`;
