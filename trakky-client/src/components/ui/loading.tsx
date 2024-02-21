import { ReactNode, useEffect, useState } from 'react';
import Spinner from '@/components/ui/spinner';

export function LoadingSpinner() {
  const [maxWaitTime, setMaxWaitTime] = useState<number>(2000);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaxWaitTime(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center align-middle m-16">
      <Spinner className="flex justify-center align-middle" />
      {maxWaitTime === 0 && (
        <div className="text-center text-muted-foreground italic transition-opacity	 animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
}

function Loading({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  if (loading) {
    return <LoadingSpinner />;
  }

  return children;
}

export default Loading;
