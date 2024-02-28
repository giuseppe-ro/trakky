import React from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import './index.css';
import 'aos/dist/aos.css';
import Toaster from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from 'react-query';
import StatusMessage from '@/components/providers/status-message';
import RouterProvider from '@/components/providers/router';
import AuthProvider from '@/components/providers/authentication';
import { ThemeProvider } from './components/providers/theme';
import MainNav from './components/navbar/main-nav';

AOS.init({ once: true });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MainNav>
          <QueryClientProvider client={queryClient}>
            <StatusMessage />
            <RouterProvider />
            <Toaster />
          </QueryClientProvider>
        </MainNav>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
