import { demoMode } from '@/constants';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useAuth } from 'react-oidc-context';
import { ReactNode } from 'react';
import Login from './login';
import Loading from './loading';

export function ProtectedContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const auth = useAuth();

  const containerContent = () => {
    if (demoMode) return children;

    if (auth.isLoading) {
      return <Login login={auth.signinRedirect} />;
    }

    if (auth.error) {
      throw auth.error;
    }

    if (auth.isAuthenticated) {
      return children;
    }

    return <Login login={auth.signinRedirect} />;
  };

  return (
    <div
      className={`md:container px-0 pb-2 sm:px-12 mx-auto w-full transition ${className}`}
    >
      <Loading loading={auth.isLoading}>{containerContent()}</Loading>
    </div>
  );
}

ProtectedContainer.defaultProps = {
  className: null,
};

interface ContentResultContainerProps {
  error: string | null;
  children: React.ReactNode;
}

export function ContentResultContainer({
  error,
  children,
}: ContentResultContainerProps) {
  if (error !== null) {
    return (
      <div
        className="p-4 m-4 text-sm text-red-800 rounded-lg bg-slate-900 dark:text-red-500"
        role="alert"
      >
        <div className="flex flex-row justify-center align-middle gap-3">
          <div className="max-w-21 overflow-auto">
            <strong className="font-bold">Error: </strong> {error}{' '}
          </div>
          <div className="self-center h-full">
            {' '}
            <ReloadIcon
              aria-label="reload"
              className="cursor-pointer hover:text-red-400 transition-colors"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export function Containers({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-2 md:px-0 ${className}`}>{children}</div>;
}

Containers.defaultProps = {
  className: null,
};
