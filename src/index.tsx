import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

// i18n-iso-languages is used for alpha-2 <-> alpha-3 language code conversions
// eslint-disable-next-line @typescript-eslint/no-var-requires
const languages = require('@cospired/i18n-iso-languages');
// eslint-disable-next-line @typescript-eslint/no-var-requires
languages.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
