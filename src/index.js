import React from "react";
import ReactDOM from "react-dom";
import "./public/CSS/index.css";
import App from "./app/App";
import reportWebVitals from "./testing_reporting/reportWebVitals";
import ProfileLoader from './app/ProfileLoader'

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <ProfileLoader />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
