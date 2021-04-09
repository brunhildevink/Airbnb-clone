import React from "react";
import { render } from "react-dom";
import reportWebVitals from "./reportWebVitals";

import { Listings } from "./sections";

render(
  <React.StrictMode>
    <Listings title="TinyHouse Listings" />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
