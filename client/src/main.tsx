import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { YMaps } from '@pbe/react-yandex-maps';
import { ToastContainer, Slide } from 'react-toastify';
import App from './App';
import './index.css';
import { store } from './redux/store';
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <ToastContainer
        position='top-center'
        autoClose={1200}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme='light'
        transition={Slide}
      />
      <YMaps
        query={{
          apikey: 'd6a65ed5-d62c-4aa0-89ba-ed187e6aa79e',
          ns: 'use-load-option',
          load: 'Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon',
        }}
      >
        <App />
      </YMaps>
    </BrowserRouter>
  </Provider>,
)
