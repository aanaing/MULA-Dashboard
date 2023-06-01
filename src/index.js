import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

const httpLink = new HttpLink({ uri: "https://powerplay.axra.app/v1/graphql" });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});
console.log("connected ......");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
