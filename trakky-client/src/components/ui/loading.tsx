import { ReactNode } from 'react';
import Spinner from '@/components/ui/spinner';

function Loading({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  if (loading) {
    return <Spinner className="flex justify-center align-middle m-16" />;
  }

  return children;
}

export default Loading;
