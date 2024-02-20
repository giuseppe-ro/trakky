import React from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import './index.css';
import 'aos/dist/aos.css';
import { PageContainer } from '@/components/ui/containers';
import Toaster from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from 'react-query';
import HealthCheck from '@/components/providers/health-check';
import RouterProvider from '@/components/providers/router';
import AuthProvider from '@/components/providers/authentication';
import { ThemeProvider } from './components/providers/theme';
import MainNav from './components/navbar/main-nav';

AOS.init({ once: true });
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MainNav>
          <QueryClientProvider client={queryClient}>
            <HealthCheck />
            <PageContainer>
              <RouterProvider />
              <Toaster />
            </PageContainer>
          </QueryClientProvider>
        </MainNav>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
