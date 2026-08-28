import { ClipboardIcon, CrossIcon, PrinterIcon } from '../icons';
import type { Exercise } from '../types/content';
import { site } from '../utils/content';

type PlanTrayProps = {
  planExercises: Exercise[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export const PlanTray = ({ planExercises, onRemove, onClear }: PlanTrayProps) => {
  const isEmpty = planExercises.length === 0;
  const countLabel =
    planExercises.length === 1 ? '1 movement' : `${planExercises.length} movements`;

  return (
    <aside
      className={isEmpty ? 'plan-tray' : 'plan-tray has-items'}
      aria-label="Today's plan"
    >
      <div className="tray-head">
        <ClipboardIcon className="tray-icon" />
        <p className="tray-title">
          <strong>{site.plan.heading}</strong>
          <span className="tray-count" aria-live="polite">
            {countLabel}
          </span>
        </p>
      </div>
      {isEmpty ? (
        <p className="tray-empty">{site.plan.emptyHint}</p>
      ) : (
        <ul className="tray-items">
          {planExercises.map((exercise) => (
            <li key={exercise.id} className="tray-item">
              <span>{exercise.name}</span>
              <button
                type="button"
                className="tray-remove"
                onClick={() => onRemove(exercise.id)}
                aria-label={`Remove ${exercise.name} from plan`}
              >
                <CrossIcon className="tray-remove-icon" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="tray-actions">
        <button
          type="button"
          className="tray-clear"
          onClick={onClear}
          disabled={isEmpty}
        >
          {site.plan.clearLabel}
        </button>
        <button
          type="button"
          className="tray-print"
          onClick={() => window.print()}
          disabled={isEmpty}
        >
          <PrinterIcon className="tray-print-icon" />
          <span>{site.plan.printLabel}</span>
        </button>
      </div>
    </aside>
  );
};
