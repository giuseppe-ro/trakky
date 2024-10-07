import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RouterProvider as ReactRouterProvider } from 'react-router';
import NProgress from 'nprogress';

import '@/nprogress/nprogress.css';
import { LoadingSpinner } from '@/components/ui/loading';
import { ProtectedContainer } from '@/components/ui/containers';
import App from '@/App';

const DashboardPage = lazy(
  () =>
    new Promise((resolve) => {
      NProgress.start();

      import('@/app/dashboards/page').then((module) => {
        NProgress.done();
        resolve(module as never);
      });
    })
);

const SettingsPage = lazy(
  () =>
    new Promise((resolve) => {
      NProgress.start();

      import('@/app/settings/page').then((module) => {
        NProgress.done();
        resolve(module as never);
      });
    })
);

const ErrorPage = lazy(
  () =>
    new Promise((resolve) => {
      NProgress.start();

      import('@/app/error/page').then((module) => {
        NProgress.done();
        resolve(module as never);
      });
    })
);

const router = createBrowserRouter([
  {
    path: '/',
    loader: () => ({ message: 'Hello Data Router!' }),
    element: (
      <ProtectedContainer>
        <App />
      </ProtectedContainer>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboards',
    element: (
      <ProtectedContainer>
        <DashboardPage />
      </ProtectedContainer>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings',
    element: (
      <ProtectedContainer>
        <SettingsPage />
      </ProtectedContainer>
    ),
    errorElement: <ErrorPage />,
  },
]);
function RouterProvider() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReactRouterProvider router={router} />
    </Suspense>
  );
}

export default RouterProvider;
