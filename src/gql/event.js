import { gql } from "@apollo/client";
//get all events
export const ALL_EVENTS = gql`
  query all_event($limit: Int!, $offset: Int!, $search: String!) {
    event(
      where: { event_name: { _ilike: $search } }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      created_at
      event_date_time
      event_description
      event_description_mm
      event_location
      event_location_mm
      event_name
      event_name_mm
      event_thumbnail_url
      fk_admin_id
      id
      updated_at
    }
    event_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get evetn by pk
export const ONE_EVENT = gql`
  query one_event($id: Int!) {
    event_by_pk(id: $id) {
      created_at
      event_date_time
      event_description
      event_description_mm
      event_location
      event_location_mm
      event_name
      event_name_mm
      event_thumbnail_url
      fk_admin_id
      id
      updated_at
    }
  }
`;

//delete event
export const DELETE_EVENT = gql`
  mutation delete_event($id: Int!) {
    delete_event_by_pk(id: $id) {
      id
    }
  }
`;

//create event
export const CREATE_EVENT = gql`
  mutation create_event(
    $event_name: String!
    $event_location: String!
    $event_location_mm: String!
    $event_date_time: timestamp!
    $event_description: String!
    $event_description_mm: String!
    $event_thumbnail_url: String!
    $fk_admin_id: Int!
    $event_name_mm: String!
  ) {
    insert_event_one(
      object: {
        event_date_time: $event_date_time
        event_description: $event_description
        event_description_mm: $event_description_mm
        event_location: $event_location
        event_location_mm: $event_location_mm
        event_name: $event_name
        event_name_mm: $event_name_mm
        event_thumbnail_url: $event_thumbnail_url
        fk_admin_id: $fk_admin_id
      }
    ) {
      created_at
      event_date_time
      event_description
      event_description_mm
      event_location
      event_location_mm
      event_name
      event_name_mm
      event_thumbnail_url
      fk_admin_id
      id
      updated_at
    }
  }
`;

//update event
export const UPDATE_EVENT = gql`
  mutation update_event(
    $id: Int!
    $event_name: String!
    $event_name_mm: String!
    $event_location: String!
    $event_location_mm: String!
    $event_date_time: timestamp!
    $event_description: String!
    $event_description_mm: String!
    $event_thumbnail_url: String!
    $fk_admin_id: Int!
  ) {
    update_event_by_pk(
      pk_columns: { id: $id }
      _set: {
        event_date_time: $event_date_time
        event_description: $event_description
        event_description_mm: $event_description_mm
        event_location: $event_location
        event_location_mm: $event_location_mm
        event_name: $event_name
        event_name_mm: $event_name_mm
        event_thumbnail_url: $event_thumbnail_url
        fk_admin_id: $fk_admin_id
      }
    ) {
      created_at
      event_date_time
      event_description
      event_description_mm
      event_location
      event_location_mm
      event_name
      event_name_mm
      event_thumbnail_url
      fk_admin_id
      id
      updated_at
    }
  }
`;

//get admin Id
export const ADMIN_ID = gql`
  query MyQuery {
    admin {
      id
      password
      role
    }
  }
`;
