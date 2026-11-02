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
    <div className="flex max-w-md flex-col gap-1.5">
      <Label htmlFor="catalog-search">Search</Label>
      <Input
        id="catalog-search"
        type="search"
        value={search}
        placeholder={searchPlaceholder}
        onChange={(event) => {
          onSearchChange(event.target.value);
        }}
      />
    </div>
  );
}
