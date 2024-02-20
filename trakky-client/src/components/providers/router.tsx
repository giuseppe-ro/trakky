import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Spinner from '@/components/ui/spinner';
import { RouterProvider as ReactRouterProvider } from 'react-router';

const App = lazy(() => import('@/App'));
const ErrorPage = lazy(() => import('@/app/error/page'));
const ExpensesPage = lazy(() => import('@/app/overview/page'));
const DashboardPage = lazy(() => import('@/app/dashboards/page'));
const SettingsPage = lazy(() => import('@/app/settings/page'));

function RouterProvider() {
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

  return (
    <Suspense
      fallback={
        <Spinner className="flex justify-center align-middle m-44 p-2" />
      }
    >
      <ReactRouterProvider router={router} />
    </Suspense>
  );
}

export default RouterProvider;
