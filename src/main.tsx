import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals.ts';
import './styles/styles.css';
import './styles/gourmet.css';
import './parcels/i18n/i18n';

import 'react-loading-skeleton/dist/skeleton.css';
import '@mantine/core/styles.layer.css';
import '@mantine/nprogress/styles.css';
import 'keyrune/css/keyrune.min.css';
import {AuthContextProvider} from '@/parcels/auth/AuthContext.tsx';
import {AppRouter} from '@/parcels/router/AppRouter.tsx'; // Render the app

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
