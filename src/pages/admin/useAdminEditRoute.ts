import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Maps a route param (e.g. `:postId`) to an initial edit value for an admin
 * form, and returns a stable callback that navigates back to the section's
 * base list path once editing is done (cancelled or saved).
 */
export function useAdminEditRoute<T>(
  paramValue: string | undefined,
  basePath: string,
  parse: (raw: string) => T | null = (raw) => raw as unknown as T
) {
  const navigate = useNavigate();

  const initialEditValue = paramValue ? parse(paramValue) : null;
  const onEditComplete = useCallback(() => navigate(basePath), [navigate, basePath]);

  return { initialEditValue, onEditComplete };
}
