import React from 'react';
import ReactDOM from 'react-dom';
import Combar from "./Combar";

const rootElement = document.createElement('div');
rootElement.id = 'my-extension-root';
document.body.appendChild(rootElement);

ReactDOM.render(<Combar />, rootElement);
