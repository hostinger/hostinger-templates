import { useState } from 'react';
import type { BodyPartFilter, Exercise } from '../types/content';
import { exercises, formatBodyPart, site } from '../utils/content';
import { ExerciseCard } from './ExerciseCard';
import { FilterChips } from './FilterChips';
import { PlanTray } from './PlanTray';

type LibrarySectionProps = {
  planIds: string[];
  planExercises: Exercise[];
  onToggle: (id: string) => void;
  onClear: () => void;
};

export const LibrarySection = ({
  planIds,
  planExercises,
  onToggle,
  onClear,
}: LibrarySectionProps) => {
  const [activePart, setActivePart] = useState<BodyPartFilter>('all');

  const visibleExercises =
    activePart === 'all'
      ? exercises
      : exercises.filter((exercise) => exercise.bodyParts.includes(activePart));

  const countMessage =
    activePart === 'all'
      ? `Showing all ${exercises.length} movements`
      : `Showing ${visibleExercises.length} of ${exercises.length} movements · ${formatBodyPart(activePart)}`;

  return (
    <section className="library" id="library" aria-labelledby="library-heading">
      <div className="container">
        <header className="library-head">
          <h2 id="library-heading">{site.library.heading}</h2>
          <p className="library-intro">{site.library.intro}</p>
        </header>
        <FilterChips activePart={activePart} onChange={setActivePart} />
        <p className="library-count" aria-live="polite">
          {countMessage}
        </p>
        <div className="exercise-grid">
          {visibleExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={exercises.indexOf(exercise)}
              inPlan={planIds.includes(exercise.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
        <PlanTray
          planExercises={planExercises}
          onRemove={onToggle}
          onClear={onClear}
        />
      </div>
    </section>
  );
};
