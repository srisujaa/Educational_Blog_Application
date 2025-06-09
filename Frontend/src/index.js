import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; // ✅ Keep this as the only Router

import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Single Router Here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
