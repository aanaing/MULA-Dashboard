import { BrowserRouter, json } from "react-router-dom";
import App from "./App";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const authLink = setContext((_, { headers }) => {
  const loggedUserJSON = window.localStorage.getItem("loggedUser");
  const loggedUserParsed = JSON.parse(loggedUserJSON);

  if (loggedUserParsed) {
    return {
      headers: {
        ...headers,
        Authorization: loggedUserParsed
          ? `Bearer ${loggedUserParsed.token}`
          : null,
      },
    };
  }
  return {
    headers: { ...headers },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphql", graphQLErrors);
    graphQLErrors.forEach(({ extensions }) => {
      if (
        extensions.code === "invalid-headers" ||
        extensions.code === "invalid-jwt"
      ) {
        window.location.assign(`${window.location.origin}/`);
      }
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    alert("network connection problem");
  }
});

const httpLink = new HttpLink({ uri: "https://mula.axra.app/v1/graphql" });
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: errorLink.concat(authLink).concat(httpLink),
});
console.log("connected ......");
const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);
