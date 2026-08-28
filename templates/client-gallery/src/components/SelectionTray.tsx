import { StarIcon } from '../icons/StarIcon';
import { DownloadIcon } from '../icons/DownloadIcon';

interface SelectionTrayProps {
  favouriteCount: number;
  totalCount: number;
  onExport: () => void;
  onClear: () => void;
}

export function SelectionTray({
  favouriteCount,
  totalCount,
  onExport,
  onClear,
}: SelectionTrayProps) {
  const hasFavourites = favouriteCount > 0;

  return (
    <aside className="selection-tray" aria-label="Your favourites">
      <p className="tray-status" role="status">
        <span className={`tray-star${hasFavourites ? ' is-active' : ''}`}>
          <StarIcon filled={hasFavourites} size={16} />
        </span>
        {hasFavourites
          ? `${favouriteCount} of ${totalCount} favourited`
          : 'No favourites yet — star the frames you love'}
      </p>
      <div className="tray-actions">
        {hasFavourites && (
          <button type="button" className="tray-clear" onClick={onClear}>
            Clear
          </button>
        )}
        <button
          type="button"
          className="tray-export"
          onClick={onExport}
          disabled={!hasFavourites}
        >
          <DownloadIcon />
          Export list
        </button>
      </div>
    </aside>
  );
}
