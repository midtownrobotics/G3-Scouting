import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PageProvider } from './pageManager.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { UserDataProvider } from './userData.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PageProvider>
            <UserDataProvider>
                <App />
            </UserDataProvider>
        </PageProvider>
    </StrictMode>,
);
