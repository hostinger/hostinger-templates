import { useEffect, useState } from 'react';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LibrarySection } from './components/LibrarySection';
import { PrintCard } from './components/PrintCard';
import { exercisesById, exerciseIds } from './utils/content';
import { loadPlan, savePlan, togglePlanId } from './utils/plan';

const App = () => {
  const [planIds, setPlanIds] = useState<string[]>(() => loadPlan(exerciseIds));

  useEffect(() => {
    savePlan(planIds);
  }, [planIds]);

  const handleToggle = (id: string) =>
    setPlanIds((current) => togglePlanId(current, id));

  const handleClear = () => setPlanIds([]);

  const planExercises = planIds.flatMap((id) => {
    const exercise = exercisesById.get(id);
    return exercise ? [exercise] : [];
  });

  return (
    <>
      <div className="app-screen">
        <Header />
        <main>
          <Hero />
          <LibrarySection
            planIds={planIds}
            planExercises={planExercises}
            onToggle={handleToggle}
            onClear={handleClear}
          />
          <FaqSection />
        </main>
        <Footer />
      </div>
      <PrintCard planExercises={planExercises} />
    </>
  );
};

export default App;
