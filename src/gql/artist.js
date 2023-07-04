import { gql } from "@apollo/client";
//get all artist
export const ARTIST = gql`
  query artist($limit: Int!, $offset: Int!, $search: String!) {
    artist(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: { artist_name: { _ilike: $search } }
    ) {
      artist_name
      artist_profile_image_url
      biography
      created_at
      fk_user_id
      id
      updated_at
      year_born
      year_died
    }
    artist_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get one artist
export const ARTIST_ID = gql`
  query artist_id($id: Int!) {
    artist_by_pk(id: $id) {
      artist_name
      artist_name_mm
      artist_profile_image_url
      biography
      biography_mm
      created_at
      fk_user_id
      id
      updated_at
      year_born
      year_died
      artist_user {
        id
        phone
        fullname
      }
    }
  }
`;

//delete artist
export const DELETE_ARTIST = gql`
  mutation delete_artist($id: Int!) {
    delete_artist_by_pk(id: $id) {
      artist_name
      artist_profile_image_url
      biography
      created_at
      fk_user_id
      id
      updated_at
      year_born
      year_died
    }
  }
`;

//Create artist
export const ADD_ARTIST = gql`
  mutation add_artist(
    $artist_name: String!
    $artist_name_mm: String!
    $artist_profile_image_url: String!
    $biography: String!
    $biography_mm: String!
    $fk_user_id: Int!
    $year_died: Int!
    $year_born: Int!
  ) {
    insert_artist_one(
      object: {
        artist_name: $artist_name
        artist_name_mm: $artist_name_mm
        artist_profile_image_url: $artist_profile_image_url
        biography: $biography
        biography_mm: $biography_mm
        fk_user_id: $fk_user_id
        year_died: $year_died
        year_born: $year_born
      }
    ) {
      artist_name
      artist_name_mm
      artist_profile_image_url
      biography
      biography_mm
      fk_user_id
      created_at
      id
      updated_at
      year_born
      year_died
    }
  }
`;

//Update artist
export const UPDATE_ARTIST = gql`
  mutation update_artist(
    $id: Int!
    $artist_name: String!
    $artist_name_mm: String!
    $artist_profile_image_url: String!
    $biography: String!
    $biography_mm: String!
    $fk_user_id: Int!
    $year_born: Int!
    $year_died: Int!
  ) {
    update_artist_by_pk(
      pk_columns: { id: $id }
      _set: {
        artist_name: $artist_name
        artist_name_mm: $artist_name_mm
        artist_profile_image_url: $artist_profile_image_url
        biography: $biography
        biography_mm: $biography_mm
        fk_user_id: $fk_user_id
        year_born: $year_born
        year_died: $year_died
      }
    ) {
      id
      updated_at
      year_born
      year_died
      fk_user_id
      created_at
      biography
      biography_mm
      artist_profile_image_url
      artist_name
      artist_name_mm
    }
  }
`;

//get UserByPhone
export const USER_ID = gql`
  query user_data($id: Int!) {
    users_by_pk(id: $id) {
      phone
      id
    }
  }
`;

//get users
export const USER = gql`
  query user {
    users {
      id
      phone
      users_artist {
        id
      }
    }
  }
`;
