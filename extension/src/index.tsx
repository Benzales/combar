import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'webextension-polyfill-ts';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
