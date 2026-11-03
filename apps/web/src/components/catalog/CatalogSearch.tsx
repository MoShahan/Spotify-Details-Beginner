import { Search } from 'lucide-react';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

type CatalogSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
};

export function CatalogSearch({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
}: CatalogSearchProps) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-1.5">
      <Label htmlFor="catalog-search">Search</Label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--cadence-fg-muted)]"
          aria-hidden
        />
        <Input
          id="catalog-search"
          type="search"
          value={search}
          placeholder={searchPlaceholder}
          className="pl-9"
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
}
