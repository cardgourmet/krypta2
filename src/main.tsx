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
import {AuthContextProvider} from '@/parcels/auth/AuthContextProvider.tsx';
import {ListsContextProvider} from '@/parcels/lists/ListsContextProvider.tsx'; // Render the app
import {AppRouter} from '@/parcels/router/AppRouter.tsx';

//Extend attributes of attributes
//Definition start
type DataAttributeKey = `data-${string}`;
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [dataAttribute: DataAttributeKey]: unknown;
  }
}
//Definition end

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <AuthContextProvider>
        <ListsContextProvider>
          <AppRouter />
        </ListsContextProvider>
      </AuthContextProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
