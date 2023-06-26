import { gql } from "@apollo/client";

const ADMIN_LOGIN = gql`
  mutation admin($password: String!, $username: String!, $role: String!) {
    AdminLogIn(
      password: $password
      phone: ""
      role: $role
      username: $username
    ) {
      accessToken
      error
      message
    }
  }
`;
export default ADMIN_LOGIN;
