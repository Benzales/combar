import React from "react";
import ReactDOM from "react-dom";
import TextSelector from "./components/TextSelector/TextSelector";
import CommentLoader from "./components/CommentLoader/CommentLoader";

const rootElement = document.createElement("div");
rootElement.setAttribute("id", "text-selector-root");
document.body.appendChild(rootElement);

ReactDOM.render(
  <>
    <TextSelector />
    <CommentLoader />
  </>,
  rootElement
);
