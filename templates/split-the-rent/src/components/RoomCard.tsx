import type { Room } from '../types';
import { APP_COPY } from '../constants/copy';
import { WINDOW_LABELS, WINDOW_QUALITIES } from '../constants/weights';

interface RoomCardProps {
  room: Room;
  index: number;
  canRemove: boolean;
  onChange: (room: Room) => void;
  onRemove: (id: string) => void;
}

export function RoomCard({ room, index, canRemove, onChange, onRemove }: RoomCardProps) {
  const nameId = `room-${room.id}-name`;
  const sizeId = `room-${room.id}-size`;
  const ensuiteId = `room-${room.id}-ensuite`;

  return (
    <fieldset className="room-card">
      <legend className="room-card__legend">Room {index + 1}</legend>

      <div className="room-card__grid">
        <div className="room-card__field room-card__field--name">
          <label htmlFor={nameId}>{APP_COPY.rooms.nameLabel}</label>
          <input
            id={nameId}
            type="text"
            value={room.name}
            maxLength={40}
            onChange={(event) => onChange({ ...room, name: event.target.value })}
          />
        </div>

        <div className="room-card__field room-card__field--size">
          <label htmlFor={sizeId}>{APP_COPY.rooms.sizeLabel}</label>
          <input
            id={sizeId}
            type="number"
            inputMode="decimal"
            min="0.1"
            step="0.1"
            value={room.size}
            onChange={(event) => onChange({ ...room, size: event.target.value })}
          />
        </div>

        <fieldset className="room-card__windows">
          <legend>{APP_COPY.rooms.windowLabel}</legend>
          <div className="room-card__window-options" role="presentation">
            {WINDOW_QUALITIES.map((quality) => (
              <label
                key={quality}
                className={`window-chip${room.window === quality ? ' window-chip--active' : ''}`}
              >
                <input
                  type="radio"
                  name={`room-${room.id}-window`}
                  value={quality}
                  checked={room.window === quality}
                  onChange={() => onChange({ ...room, window: quality })}
                />
                <span>{WINDOW_LABELS[quality]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="room-card__field room-card__field--ensuite">
          <label className="ensuite-toggle" htmlFor={ensuiteId}>
            <input
              id={ensuiteId}
              type="checkbox"
              checked={room.ensuite}
              onChange={(event) => onChange({ ...room, ensuite: event.target.checked })}
            />
            <span>{APP_COPY.rooms.ensuiteLabel}</span>
          </label>
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          className="room-card__remove"
          onClick={() => onRemove(room.id)}
          aria-label={`${APP_COPY.rooms.removeRoom} ${room.name || `room ${index + 1}`}`}
        >
          {APP_COPY.rooms.removeRoom}
        </button>
      )}
    </fieldset>
  );
}
