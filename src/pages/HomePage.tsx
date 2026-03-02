import { Hero } from '../components/Hero';
import { Skills } from '../components/Skills';
import { SubjectsOverview } from '../components/SubjectsOverview';

export function HomePage() {
  return (
    <main>
      <Hero />
      <Skills />
      <SubjectsOverview />
    </main>
  );
}
