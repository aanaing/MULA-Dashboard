import { gql } from "@apollo/client";

//get all artworks
export const ARTWORKS = gql`
  query artworks($limit: Int!, $offset: Int!, $search: String!) {
    traditional_art_work(
      limit: $limit
      offset: $offset
      where: { artwork_name: { _ilike: $search } }
    ) {
      artwork_image_url
      artwork_name
      artwork_year
      created_at
      current_price
      dimensions
      description
      disabled
      fk_artist_id
      fk_medium_type_id
      fk_ownership_id
      id
      pending
      update_price
      updated_at
      traditional_art_work_artist {
        artist_name
      }
    }
    traditional_art_work_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get artworkID
export const ARTWORK_ID = gql`
  query artwrok_id($id: Int!) {
    traditional_art_work_by_pk(id: $id) {
      artwork_image_url
      artwork_name
      artwork_year
      created_at
      current_price
      description
      dimensions
      disabled
      fk_artist_id
      fk_medium_type_id
      fk_ownership_id
      id
      height
      width
      pending
      update_price
      updated_at
      fk_dimension
    }
  }
`;

//get Dimensions
export const DIMENSIONS = gql`
  query dimensions {
    artwork_dimensions {
      dimension_name
      id
    }
  }
`;

//get artwork type
export const ARTWORK_TYPE = gql`
  query MyQuery {
    artwork_medium_type {
      id
      medium_name
    }
  }
`;

//get ownership id
export const OWNERSHIP = gql`
  query ownership {
    users {
      fullname
      id
    }
  }
`;

//get art_series
export const ART_SERIES = gql`
  query MyQuery {
    art_series {
      id
      series_name
    }
  }
`;

//get artist_name
export const ARTIST_NAME = gql`
  query MyQuery {
    artist {
      artist_name
      id
    }
  }
`;

//Add artwork
export const ADD_ARTWORK = gql`
  mutation add_artwork(
    $update_price: Int!
    $pending: Boolean!
    $fk_ownership_id: Int!
    $fk_medium_type_id: Int!
    $fk_artist_id: Int!
    $height: numeric!
    $width: numeric!
    $disabled: Boolean!
    $dimensions: String!
    $description: String!
    $current_price: Int!
    $artwork_year: Int!
    $artwork_name: String!
    $artwork_image_url: String!
    $fk_dimension: Int!
  ) {
    insert_traditional_art_work_one(
      object: {
        update_price: $update_price
        pending: $pending
        fk_ownership_id: $fk_ownership_id
        fk_medium_type_id: $fk_medium_type_id
        fk_artist_id: $fk_artist_id
        disabled: $disabled
        height: $height
        width: $width
        dimensions: $dimensions
        description: $description
        current_price: $current_price
        artwork_year: $artwork_year
        artwork_name: $artwork_name
        artwork_image_url: $artwork_image_url
        fk_dimension: $fk_dimension
      }
    ) {
      pending
      id
      fk_ownership_id
      fk_medium_type_id
      fk_artist_id
      disabled
      dimensions
      description
      current_price
      created_at
      artwork_year
      artwork_name
      artwork_image_url
      update_price
      updated_at
    }
  }
`;

//delete artwork
export const DELETE_ARTWORK = gql`
  mutation delete_artwork($id: Int!) {
    delete_traditional_art_work_by_pk(id: $id) {
      id
    }
  }
`;

//update artwork
export const UPDATE_ARTWORK = gql`
  mutation update_artwork(
    $id: Int!
    $update_price: Int!
    $pending: Boolean!
    $fk_ownership_id: Int!
    $fk_medium_type_id: Int!
    $fk_artist_id: Int!
    $height: numeric!
    $width: numeric!
    $disabled: Boolean!
    $dimensions: String!
    $description: String!
    $current_price: Int!
    $artwork_year: Int!
    $artwork_name: String!
    $artwork_image_url: String!
    $fk_dimension: Int!
  ) {
    update_traditional_art_work_by_pk(
      pk_columns: { id: $id }
      _set: {
        update_price: $update_price
        pending: $pending
        fk_ownership_id: $fk_ownership_id
        fk_medium_type_id: $fk_medium_type_id
        fk_artist_id: $fk_artist_id
        disabled: $disabled
        height: $height
        width: $width
        dimensions: $dimensions
        description: $description
        current_price: $current_price
        artwork_year: $artwork_year
        artwork_name: $artwork_name
        artwork_image_url: $artwork_image_url
        fk_dimension: $fk_dimension
      }
    ) {
      artwork_image_url
      artwork_name
      artwork_year
      created_at
      current_price
      description
      dimensions
      disabled
      fk_artist_id
      fk_dimension
      fk_medium_type_id
      fk_ownership_id
      height
      id
      pending
      update_price
      updated_at
      width
    }
  }
`;
