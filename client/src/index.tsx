import React from "react";
import { render } from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { Listings } from "./sections";

const client = new ApolloClient({ uri: "/api", cache: new InMemoryCache() });

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Listings title="TinyHouse Listings" />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
