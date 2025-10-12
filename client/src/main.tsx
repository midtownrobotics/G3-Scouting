import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PageProvider } from './pageManager.tsx';
import { registerSW } from 'virtual:pwa-register'

import 'bootstrap/dist/css/bootstrap.min.css';
import { UserDataProvider } from './userData.tsx';

registerSW({
    onNeedRefresh() { },
    onOfflineReady() {
        alert('App ready to work offline!')
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PageProvider>
            <UserDataProvider>
                <App />
            </UserDataProvider>
        </PageProvider>
    </StrictMode>,
);
