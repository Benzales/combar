import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import React from 'react';
import ReactDOM from 'react-dom';
import Combar from './Combar';

const rootElement = document.createElement('div');
rootElement.id = 'combar-root';
document.body.appendChild(rootElement);

const shadowRoot = rootElement.attachShadow({ mode: 'open' });

const shadowDiv = document.createElement('div');
shadowRoot.appendChild(shadowDiv);

const emotionCache = createCache({ 
  key: 'css', 
  container: shadowRoot
});

ReactDOM.render(
  <CacheProvider value={emotionCache}>
    <Combar />
  </CacheProvider>,
  shadowDiv
);
