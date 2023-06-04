import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {HttpLink, ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import {setContext} from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
    const loggedUserJSON = window.localStorage.getItem("mulaloggeduser");
    const loggedUserParsed = JSON.parse(loggedUserJSON);
    return {
        headers: {
            ...headers,
            Authorization: loggedUserParsed
                ? `Bearer ${loggedUserParsed.token}`
                : null,
            "x-hasura-admin-secret": "mula is very good",
        },
    };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ extensions }) => {
            if (
                extensions.code === "invalid-headers" ||
                extensions.code === "invalid-jwt"
            ) {
                window.location.assign(`${window.location.origin}/login`);
            }
        });
    }
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        alert("network connection problem");
    }
});


const httpLink = new HttpLink({ uri: "http://146.190.4.124:8080/v1/graphql" });

const client = new ApolloClient({
  cache: new InMemoryCache(),
    link: errorLink.concat(authLink).concat(httpLink),
});
console.log("connected ......");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </ApolloProvider>
  </React.StrictMode>
);
