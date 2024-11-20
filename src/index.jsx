// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import App from './App.jsx';
import { store } from './app/store';
import {GoogleMapsProvider} from './components/common/GoogleMapsProvider.jsx';
import { DriverProvider } from './context/DriverContext'; // Importar el contexto
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleMapsProvider>
      <Provider store={store}> 
        <DriverProvider> 
          <App />
        </DriverProvider>
      </Provider>
    </GoogleMapsProvider>
  </StrictMode>,
);
