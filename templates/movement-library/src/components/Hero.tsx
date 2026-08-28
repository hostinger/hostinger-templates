import { CautionIcon } from '../icons';
import { ExerciseFigure } from '../icons/figures';
import { exercisesById, site } from '../utils/content';

export const Hero = () => {
  const sampleExercise = exercisesById.get(site.hero.sampleExerciseId);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1 id="hero-heading">{site.hero.headline}</h1>
          <p className="hero-intro">{site.hero.intro}</p>
          <ol className="hero-steps">
            {site.hero.steps.map((step, index) => (
              <li key={step}>
                <span className="hero-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="guidance-note">
            <CautionIcon className="guidance-icon" />
            <span>{site.guidanceNote}</span>
          </p>
        </div>
        {sampleExercise && (
          <div className="hero-chart" aria-hidden="true">
            <div className="hero-chart-card">
              <span className="tape-piece tape-tl" />
              <span className="tape-piece tape-br" />
              <p className="hero-chart-label">Chart card</p>
              <div className="hero-chart-plate">
                <ExerciseFigure
                  figure={sampleExercise.figure}
                  className="hero-chart-figure"
                />
              </div>
              <p className="hero-chart-name">{sampleExercise.name}</p>
              <p className="hero-chart-dose">{sampleExercise.dosage}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
