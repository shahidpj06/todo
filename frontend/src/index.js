import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
 // Import the Routes component

ReactDOM.render(
  <React.StrictMode>
    <Routes /> {/* Render the Routes component */}
  </React.StrictMode>,
  document.getElementById('root')
);