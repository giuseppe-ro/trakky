import React from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import './index.css';
import ExpensesPage from '@/app/overview/page';
import 'aos/dist/aos.css';
import { PageContainer } from '@/components/ui/containers';
import Toaster from '@/components/ui/toaster';
import SettingsPage from '@/app/settings/page';
import { HealthCheckProvider } from '@/components/providers/health-check';
import { AuthenticationCustomProvider } from '@/components/providers/authentication';
import ErrorPage from './app/error/page';
import DashboardPage from './app/dashboards/page';
import { ThemeProvider } from './components/providers/theme';
import App from './App';
import MainNav from './components/navbar/main-nav';

AOS.init({ once: true });

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/overview',
    element: <ExpensesPage />,
  },
  {
    path: '/dashboards',
    element: <DashboardPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthenticationCustomProvider>
        <MainNav>
          <HealthCheckProvider />
          <PageContainer>
            <RouterProvider router={router} />
            <Toaster />
          </PageContainer>
        </MainNav>
      </AuthenticationCustomProvider>
    </ThemeProvider>
  </React.StrictMode>
);
