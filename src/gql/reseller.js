import { gql } from "@apollo/client";
//get all reseller
export const ALL_RESELLER = gql`
  query allReseller($limit: Int!, $offset: Int!) {
    reseller(limit: $limit, offset: $offset) {
      updated_at
      id
      created_at
      biography
      reseller_user {
        fullname
        id
      }
    }
    reseller_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get reseller one
export const RESELLER_ID = gql`
  query reseller_id($id: Int!) {
    reseller_by_pk(id: $id) {
      biography
      created_at
      fk_user_id
      id
      updated_at
      reseller_user {
        fullname
        id
      }
    }
  }
`;
export const ADD_RESELLER = gql`
  mutation add_reseller($biography: String, $fk_user_id: Int!) {
    insert_reseller_one(
      object: { biography: $biography, fk_user_id: $fk_user_id }
    ) {
      biography
      created_at
      fk_user_id
      id
      updated_at
    }
  }
`;

//get useid
export const USERID = gql`
  query user {
    users {
      fullname
      id
      users_resellers {
        fk_user_id
        id
      }
    }
  }
`;

//get user by pk
export const USERBYPK = gql`
  query userbyPk($id: Int!) {
    users_by_pk(id: $id) {
      fullname
      id
    }
  }
`;

//delete reseller
export const DELETE_RESELLER = gql`
  mutation deleteReseller($id: Int!) {
    delete_reseller_by_pk(id: $id) {
      biography
      created_at
      fk_user_id
      id
      updated_at
    }
  }
`;

//update reseller
export const UPDATE_RESELLER = gql`
  mutation update_reseller($id: Int!, $biography: String, $fk_user_id: Int!) {
    update_reseller_by_pk(
      pk_columns: { id: $id }
      _set: { biography: $biography, fk_user_id: $fk_user_id }
    ) {
      biography
      created_at
      fk_user_id
      id
      updated_at
    }
  }
`;
