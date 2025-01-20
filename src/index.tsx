import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM.createRoot 사용
import AppRouter from './Router/AppRouter';
import './styles/global.scss';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
    ,
  </BrowserRouter>,
);
