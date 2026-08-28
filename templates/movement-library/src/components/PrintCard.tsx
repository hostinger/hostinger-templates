import { ExerciseFigure } from '../icons/figures';
import type { Exercise } from '../types/content';
import { site } from '../utils/content';
import { formatPlanDate } from '../utils/format';

const WEEK_DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type PrintCardProps = {
  planExercises: Exercise[];
};

/**
 * The take-home patient card. Hidden on screen; the print stylesheet hides
 * the rest of the app and shows only this card.
 */
export const PrintCard = ({ planExercises }: PrintCardProps) => (
  <section className="print-card">
    <header className="print-head">
      <div className="print-brand">
        <p className="print-practice">{site.practiceName}</p>
        <p className="print-title">{site.printCard.title}</p>
      </div>
      <div className="print-meta">
        <p className="print-date">{formatPlanDate(new Date())}</p>
        <p>
          {site.printCard.guidedByLabel} {site.physioName}
        </p>
      </div>
    </header>
    <p className="print-prepared">
      {site.printCard.preparedForLabel}:
      <span className="print-write-line" aria-hidden="true" />
    </p>
    {planExercises.length === 0 ? (
      <p className="print-empty">{site.printCard.emptyMessage}</p>
    ) : (
      <>
        <p className="print-tick-hint">{site.printCard.tickHint}</p>
        <ol className="print-list">
          {planExercises.map((exercise, index) => (
            <li key={exercise.id} className="print-item">
              <div className="print-item-head">
                <span className="print-item-index">{index + 1}</span>
                <p className="print-item-name">{exercise.name}</p>
                <p className="print-item-dose">{exercise.dosage}</p>
              </div>
              <div className="print-item-body">
                <ExerciseFigure
                  figure={exercise.figure}
                  className="print-item-figure"
                />
                <div>
                  <ol className="print-item-steps">
                    {exercise.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p className="print-item-caution">
                    <strong>Take care:</strong> {exercise.caution}
                  </p>
                </div>
              </div>
              <p className="print-tick-row">
                <span className="print-tick-label">Done:</span>
                {WEEK_DAY_INITIALS.map((day, dayIndex) => (
                  <span key={`${day}-${dayIndex}`} className="print-tick-day">
                    <span className="print-tick-initial">{day}</span>
                    <span className="print-tick-box" />
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ol>
      </>
    )}
    <footer className="print-foot">
      <p className="print-contact">
        {site.practiceName} · {site.phoneDisplay} · {site.email} · {site.address}
      </p>
      <p className="print-footnote">{site.printCard.footnote}</p>
    </footer>
  </section>
);
