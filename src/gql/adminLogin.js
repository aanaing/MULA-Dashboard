import { gql } from "@apollo/client";

const ADMIN_LOGIN = gql`
  mutation admin_login($password: String!, $username: String!) {
    AdminLogIn(password: $password, phone: "", username: $username) {
      error
      message
      accessToken
    }
  }
`;
export default ADMIN_LOGIN;
