import { useCallback, useEffect, useRef, useState } from 'react';

import { getApiErrorMessage } from '../lib/api';

export type InfiniteCatalogStatus =
  'loading' | 'loadingMore' | 'error' | 'ready';

export type InfiniteCatalogPage<T> = {
  items: T[];
  hasMore: boolean;
};

export type InfiniteCatalogState<T> = {
  status: InfiniteCatalogStatus;
  items: T[];
  hasMore: boolean;
  message?: string;
  sentinelRef: (node: Element | null) => void;
};

type UseInfiniteCatalogQueryOptions<T> = {
  deps: readonly unknown[];
  loadPage: (offset: number) => Promise<InfiniteCatalogPage<T>>;
  errorMessage: string;
  debounceMs?: number;
};

export function useInfiniteCatalogQuery<T>({
  deps,
  loadPage,
  errorMessage,
  debounceMs = 250,
}: UseInfiniteCatalogQueryOptions<T>): InfiniteCatalogState<T> {
  const [status, setStatus] = useState<InfiniteCatalogStatus>('loading');
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState<string | undefined>();

  const loadPageRef = useRef(loadPage);
  loadPageRef.current = loadPage;

  const statusRef = useRef(status);
  statusRef.current = status;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const itemsLengthRef = useRef(items.length);
  itemsLengthRef.current = items.length;

  const requestIdRef = useRef(0);
  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    async function run() {
      setStatus('loading');
      setItems([]);
      setHasMore(true);
      setMessage(undefined);

      try {
        const page = await loadPageRef.current(0);
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }
        setItems(page.items);
        setHasMore(page.hasMore);
        setStatus('ready');
      } catch (error: unknown) {
        if (cancelled || requestId !== requestIdRef.current) {
          return;
        }
        setItems([]);
        setHasMore(false);
        setMessage(getApiErrorMessage(error, errorMessage));
        setStatus('error');
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

  const loadMore = useCallback(async () => {
    if (
      statusRef.current !== 'ready' ||
      !hasMoreRef.current ||
      itemsLengthRef.current === 0
    ) {
      return;
    }

    const requestId = requestIdRef.current;
    const offset = itemsLengthRef.current;
    setStatus('loadingMore');

    try {
      const page = await loadPageRef.current(offset);
      if (requestId !== requestIdRef.current) {
        return;
      }
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.hasMore);
      setStatus('ready');
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setMessage(getApiErrorMessage(error, errorMessage));
      setStatus('error');
    }
  }, [errorMessage]);

  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMoreRef.current();
        }
      },
      { rootMargin: '240px 0px' },
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return {
    status,
    items,
    hasMore,
    message,
    sentinelRef,
  };
}
