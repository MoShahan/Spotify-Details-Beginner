import { useEffect, useRef, useState } from 'react';

import { getApiErrorMessage } from '../lib/api';

export type CatalogLoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

type UseDebouncedCatalogQueryOptions<T> = {
  deps: readonly unknown[];
  load: () => Promise<T>;
  errorMessage: string;
  debounceMs?: number;
};

export function useDebouncedCatalogQuery<T>({
  deps,
  load,
  errorMessage,
  debounceMs = 250,
}: UseDebouncedCatalogQueryOptions<T>): CatalogLoadState<T> {
  const [state, setState] = useState<CatalogLoadState<T>>({
    status: 'loading',
  });
  const loadRef = useRef(load);
  loadRef.current = load;
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: 'loading' });
      try {
        const data = await loadRef.current();
        if (!cancelled) {
          setState({ status: 'ready', data });
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: getApiErrorMessage(error, errorMessage),
          });
        }
      }
    }

    const timer = window.setTimeout(() => {
      void run();
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [depsKey, errorMessage, debounceMs]);

  return state;
}
