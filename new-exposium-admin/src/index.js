import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./config";
// import "./style/main.css";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
