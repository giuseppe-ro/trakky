import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RouterProvider as ReactRouterProvider } from 'react-router';
import NProgress from 'nprogress';

import '@/nprogress/nprogress.css';
import { LoadingSpinner } from '@/components/ui/loading';
import { ProtectedContainer } from '@/components/ui/containers';

const App = lazy(
  () =>
    new Promise((resolve) => {
      NProgress.start();

      import('@/App').then((module) => {
        NProgress.done();
        resolve(module as never);
      });
    })
);

const ExpensesPage = lazy(
  () =>
    new Promise((resolve) => {
      NProgress.start();

      import('@/app/overview/page').then((module) => {
        NProgress.done();
        resolve(module as never);
      });
    })
);

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
    path: 'overview',
    element: (
      <ProtectedContainer>
        <ExpensesPage />
      </ProtectedContainer>
    ),
  },
  {
    path: 'dashboards',
    element: (
      <ProtectedContainer>
        <DashboardPage />
      </ProtectedContainer>
    ),
  },
  {
    path: 'settings',
    element: (
      <ProtectedContainer>
        <SettingsPage />
      </ProtectedContainer>
    ),
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
