import { useCallback, useRef, useState } from 'react';
import { getErrorMessage } from '../../utils/errors';
import { useDirtyGuard } from './useDirtyGuard';

interface UseAdminCrudFormOptions<T> {
  initialValue: T;
  registerDirty?: (dirty: boolean) => void;
}

interface RunActionOptions<R> {
  onSuccess: (result: R) => string;
  resetOnSuccess?: () => void;
  fallbackErrorMessage: string;
  setStatus: (status: string | null) => void;
  setStatusType: (type: 'success' | 'error') => void;
  reload: () => Promise<void>;
}

/**
 * Shares the form scaffold that's identical across the three admin CRUD
 * forms (Subject/Post/Tag): dirty-guard wiring, scroll-into-view-on-edit,
 * and the try/success/catch/finally wrapper each submit/delete handler
 * repeats. Each form still owns its own field markup, cmsApi calls, and
 * onEditComplete/wasEditing branching — those genuinely differ per entity.
 */
export function useAdminCrudForm<T>({ initialValue, registerDirty }: UseAdminCrudFormOptions<T>) {
  const [form, setForm] = useState<T>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { setBaseline } = useDirtyGuard(form, registerDirty);

  const resetForm = useCallback(() => {
    setForm(initialValue);
    setBaseline(initialValue);
  }, [initialValue, setBaseline]);

  const loadForm = useCallback(
    (value: T) => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setForm(value);
      setBaseline(value);
    },
    [setBaseline]
  );

  const runAction = useCallback(
    async <R>(action: () => Promise<R>, opts: RunActionOptions<R>): Promise<R | undefined> => {
      opts.setStatus(null);
      setIsSubmitting(true);

      try {
        const result = await action();
        opts.setStatusType('success');
        opts.setStatus(opts.onSuccess(result));
        opts.resetOnSuccess?.();
        await opts.reload();
        return result;
      } catch (err) {
        opts.setStatusType('error');
        opts.setStatus(getErrorMessage(err, opts.fallbackErrorMessage));
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return { form, setForm, isSubmitting, formRef, setBaseline, resetForm, loadForm, runAction };
}
