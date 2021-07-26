import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import "./index.css"
import HttpsRedirect from 'react-https-redirect';

ReactDOM.render(
  <React.StrictMode>
      <HttpsRedirect>
        <App />
      </HttpsRedirect>
  </React.StrictMode>,
  document.getElementById('root')
);