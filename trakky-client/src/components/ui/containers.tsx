import React, { useContext } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import { demoMode } from '@/constants';
import { ReloadIcon } from '@radix-ui/react-icons';
import Login from './login';
import Loading from './loading';

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { loginInProgress, token, login } =
    useContext<IAuthContext>(AuthContext);

  const containerContent = () => {
    if (token || demoMode) {
      return children;
    }

    return <Login login={login} />;
  };

  return (
    <div
      className={`md:container px-0 pb-2 md:px-12 mx-auto w-full transition ${className}`}
    >
      <Loading loading={loginInProgress}>{containerContent()}</Loading>
    </div>
  );
}

PageContainer.defaultProps = {
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
