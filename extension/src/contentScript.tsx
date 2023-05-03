import React from "react";
import ReactDOM from "react-dom";
import TextSelectorComponent from "./components/TextSelectorComponent";

const rootElement = document.createElement("div");
rootElement.setAttribute("id", "text-selector-root");
document.body.appendChild(rootElement);

ReactDOM.render(<TextSelectorComponent />, rootElement);
