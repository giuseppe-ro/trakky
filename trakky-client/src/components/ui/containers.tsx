import React, { useContext } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { demoMode } from '@/constants';
import { ReloadIcon } from '@radix-ui/react-icons';

export function Login({ login }: { login: () => void }) {
  return (
    <Card className="flex flex-row justify-center">
      <CardContent className="m-4 px-12 pb-12 lg:px-16 lg:pb-16 border rounded-2xl">
        <div className="flex flex-col text-center justify-center align-middle">
          <Title title="Welcome to Trakky!" />
          <img
            src="/owl_login.png"
            alt="Trakky Logo"
            className="w-32 h-32 mx-auto mb-6"
          />
          <p className="mb-4 text-lg lg:text-xl text-muted-foreground bg-transparent">
            Login to start tracking your expenses
          </p>
          <Button
            variant="outline"
            onClick={() => login()}
            className="border-green-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
    if (loginInProgress) {
      return <Spinner className="flex justify-center align-middle my-12" />;
    }

    if (token || demoMode) {
      return children;
    }

    return <Login login={login} />;
  };

  return (
    <div
      className={`md:container px-0 pb-2 md:px-12 mx-auto w-full transition ${className}`}
    >
      {containerContent()}
    </div>
  );
}

PageContainer.defaultProps = {
  className: null,
};

interface ContentResultContainerProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export function ContentResultContainer({
  loading,
  error,
  children,
}: ContentResultContainerProps) {
  if (loading)
    return (
      <Spinner className="flex flex-row justify-center align-middle m-32" />
    );

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
