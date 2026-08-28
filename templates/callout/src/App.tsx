import { CoverageSection } from './components/CoverageSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HoursSection } from './components/HoursSection';
import { Services } from './components/Services';
import { WorkGallery } from './components/WorkGallery';

const App = () => (
  <main>
    <Header />
    <Hero />
    <Services />
    <WorkGallery />
    <CoverageSection />
    <HoursSection />
    <Footer />
  </main>
);

export default App;
