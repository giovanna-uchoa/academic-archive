import { useEffect } from "react";

const baseTitle = import.meta.env.VITE_APP_TITLE ?? 'Academic Archive';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
}
