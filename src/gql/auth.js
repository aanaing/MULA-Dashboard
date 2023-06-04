import {gql} from "@apollo/client";

const AdminLogin = gql`
    mutation MyMutation($password: String!, $username: String!) {
          AdminLogin(password: $password, username: $username) {
                accessToken
                error
                message
          }
    }
`;

export { AdminLogin };