import type { ReactNode } from 'react';
import Loading from './Loading';
import ErrorDisplay from './ErrorDisplay';

interface AsyncBoundaryProps {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}

function AsyncBoundary({ loading, error, children }: AsyncBoundaryProps) {
  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;
  return <>{children}</>;
}

export default AsyncBoundary;
