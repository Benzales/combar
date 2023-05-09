import React from "react";
import ReactDOM from "react-dom";
import Comment from "./components/Comment";
import "webextension-polyfill-ts";

ReactDOM.render(
  <React.StrictMode>
    <Comment />
  </React.StrictMode>,
  document.getElementById("root")
);
