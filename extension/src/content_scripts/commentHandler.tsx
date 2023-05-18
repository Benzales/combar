import React from 'react';
import ReactDOM from 'react-dom';
import Combar from "./Combar";

const rootElement = document.createElement('div');
rootElement.id = 'combar-root';
document.body.appendChild(rootElement);

ReactDOM.render(<Combar />, rootElement);
