import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { reset, themes } from 'react95';
import Win from './assets/fonts/Win.ttf';
import './assets/fonts/Win.ttf';
const ResetStyles = createGlobalStyle`
@font-face {
  font-family: Win;
  src: url(${Win}) format('truetype');
  font-weight: normal;
}
html {
  font-size: small;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <ResetStyles />
    <ThemeProvider theme={themes.default}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
