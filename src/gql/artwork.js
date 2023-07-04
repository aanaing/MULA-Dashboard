import { gql } from "@apollo/client";

//get all artworks
export const ARTWORKS = gql`
  query artworks($limit: Int!, $offset: Int!, $search: String!) {
    traditional_art_work(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: { artwork_name: { _ilike: $search } }
    ) {
      artwork_image_url
      artwork_name
      artwork_name_mm
      artwork_year
      created_at
      current_price
      dimensions
      description
      description_mm
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
        artist_name_mm
      }
      traditional_art_work_artwork_medium_type {
        medium_name
        medium_name_mm
        id
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
      artwork_name_mm
      artwork_year
      created_at
      current_price
      description
      description_mm
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
      traditional_artwork_dimension {
        dimension_name
        id
      }
      traditional_art_work_artwork_medium_type {
        id
        medium_name
        medium_name_mm
      }
      traditional_art_work_artist {
        artist_name
        artist_name_mm
        id
      }
      traditional_art_work_artist_art_series {
        artist_art_series_art_sery {
          series_name
        }
      }
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
      medium_name_mm
    }
  }
`;

//get ownership id
export const OWNERSHIP = gql`
  query ownership {
    users {
      fullname
      fullname_mm
      id
    }
  }
`;

//get art_series for create artwork
// export const ART_SERIES = gql`
//   query art_series($fk_artist_id: Int!) {
//     art_series(where: { fk_artist_id: { _eq: $fk_artist_id } }) {
//       series_name
//       series_name_mm
//       id
//       art_series_artist_art_series {
//         fk_art_series_id
//         fk_traditional_art_work_id
//       }
//     }
//   }
// `;
export const ART_SERIES = gql`
  query MyQuery($fk_artist_id: Int!) {
    art_series(where: { fk_artist_id: { _eq: $fk_artist_id } }) {
      series_name
      id
      art_series_artist_art_series {
        fk_art_series_id
        fk_traditional_art_work_id
      }
    }
  }
`;

//get art_series for update artwork
export const ART_SERIES_BY_ARTWORK_ID = gql`
  query MyQuery($fk_traditional_art_work_id: Int!) {
    artist_art_series(
      where: {
        fk_traditional_art_work_id: { _eq: $fk_traditional_art_work_id }
      }
    ) {
      fk_art_series_id
      artist_art_series_art_sery {
        series_name
        id
      }
    }
  }
`;

//delete art_series by artwork id
export const DELETE_ART_SERIES = gql`
  mutation delete_art_series($fk_traditional_art_work_id: Int!) {
    delete_artist_art_series(
      where: {
        fk_traditional_art_work_id: { _eq: $fk_traditional_art_work_id }
      }
    ) {
      returning {
        id
      }
    }
  }
`;

//get artist_name
export const ARTIST_NAME = gql`
  query MyQuery {
    artist {
      artist_name
      artist_name_mm
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
    $description_mm: String!
    $current_price: Int!
    $artwork_year: Int!
    $artwork_name: String!
    $artwork_name_mm: String!
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
        description_mm: $description_mm
        current_price: $current_price
        artwork_year: $artwork_year
        artwork_name: $artwork_name
        artwork_name_mm: $artwork_name_mm
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
      description_mm
      current_price
      created_at
      artwork_year
      artwork_name
      artwork_name_mm
      artwork_image_url
      update_price
      updated_at
      traditional_art_work_artist_art_series {
        fk_art_series_id
        fk_traditional_art_work_id
        id
      }
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
    $description_mm: String!
    $current_price: Int!
    $artwork_year: Int!
    $artwork_name: String!
    $artwork_name_mm: String!
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
        description_mm: $description_mm
        current_price: $current_price
        artwork_year: $artwork_year
        artwork_name: $artwork_name
        artwork_name_mm: $artwork_name_mm
        artwork_image_url: $artwork_image_url
        fk_dimension: $fk_dimension
      }
    ) {
      artwork_image_url
      artwork_name
      artwork_name_mm
      artwork_year
      created_at
      current_price
      description
      description_mm
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

//add artist_art_series
export const ADD_ART_SERIES = gql`
  mutation add_art_series(
    $fk_art_series_id: Int!
    $fk_traditional_art_work_id: Int!
  ) {
    insert_artist_art_series_one(
      object: {
        fk_traditional_art_work_id: $fk_traditional_art_work_id
        fk_art_series_id: $fk_art_series_id
      }
    ) {
      created_at
      fk_art_series_id
      fk_traditional_art_work_id
      id
      updated_at
    }
  }
`;

//pending status
export const PENDING_STATUS = gql`
  mutation pending_status($id: Int!, $pending: Boolean!) {
    update_traditional_art_work_by_pk(
      pk_columns: { id: $id }
      _set: { pending: $pending }
    ) {
      id
      pending
    }
  }
`;
