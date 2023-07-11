import { gql } from "@apollo/client";

//get all users
export const ALL_USERS = gql`
  query all_users($limit: Int!, $offset: Int!, $search: String!) {
    users(
      limit: $limit
      offset: $offset
      where: { fullname: { _ilike: $search } }
      order_by: { created_at: desc }
    ) {
      address
      created_at
      date_of_birth
      address_mm
      email
      disabled
      fullname
      fullname_mm
      gender
      id
      gender_mm
      otp
      password
      phone
      profile_image_url
      updated_at
    }
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get one user
export const USER = gql`
  query one_user($id: Int!) {
    users_by_pk(id: $id) {
      address
      created_at
      date_of_birth
      disabled
      email
      fullname
      id
      gender
      otp
      password
      phone
      profile_image_url
      updated_at
      users_artist {
        id
      }
      users_resellers {
        id
      }
    }
  }
`;

//Disable / enable User
export const EDIT_USER = gql`
  mutation edit_user($id: Int!, $disabled: Boolean!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { disabled: $disabled }) {
      address
      created_at
      date_of_birth
      disabled
      email
      fullname
      gender
      id
      otp
      password
      phone
      profile_image_url
      updated_at
    }
  }
`;

//Create User
export const CREATE_USER = gql`
  mutation create_user(
    $fullname: String!
    $phone: String!
    $password: String!
  ) {
    insert_users_one(
      object: { fullname: $fullname, phone: $phone, password: $password }
    ) {
      fullname
      phone
      password
      id
    }
  }
`;
