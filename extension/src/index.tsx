import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'webextension-polyfill-ts';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
