import { CautionIcon, CheckIcon, PlusIcon } from '../icons';
import { ExerciseFigure } from '../icons/figures';
import type { Exercise } from '../types/content';
import { formatBodyPart } from '../utils/content';

type ExerciseCardProps = {
  exercise: Exercise;
  index: number;
  inPlan: boolean;
  onToggle: (id: string) => void;
};

export const ExerciseCard = ({
  exercise,
  index,
  inPlan,
  onToggle,
}: ExerciseCardProps) => (
  <article className="exercise-card" aria-labelledby={`exercise-${exercise.id}`}>
    <div className="card-plate">
      <span className="card-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <ExerciseFigure figure={exercise.figure} className="card-figure" />
    </div>
    <div className="card-body">
      <div className="card-title-row">
        <h3 id={`exercise-${exercise.id}`}>{exercise.name}</h3>
        <ul className="part-tags" aria-label="Body parts">
          {exercise.bodyParts.map((part) => (
            <li key={part} className="part-tag">
              {formatBodyPart(part)}
            </li>
          ))}
        </ul>
      </div>
      <p className="dosage-tape">{exercise.dosage}</p>
      <ol className="card-steps">
        {exercise.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="card-caution">
        <CautionIcon className="caution-icon" />
        <span>
          <strong>Take care:</strong> {exercise.caution}
        </span>
      </p>
      <button
        type="button"
        className={inPlan ? 'plan-toggle in-plan' : 'plan-toggle'}
        aria-pressed={inPlan}
        onClick={() => onToggle(exercise.id)}
      >
        {inPlan ? (
          <>
            <CheckIcon className="toggle-icon" />
            <span>In today’s plan — remove</span>
          </>
        ) : (
          <>
            <PlusIcon className="toggle-icon" />
            <span>Add to plan</span>
          </>
        )}
      </button>
    </div>
  </article>
);
