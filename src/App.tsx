import { SpaceScene } from './components/SpaceScene';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Skills } from './components/Skills';
import { Games } from './components/Games';
import { Reviews } from './components/Reviews';
import './index.css';

function App() {
  return (
    <>
      <SpaceScene />
      <Navigation />
      <main className="content">
        <Hero />
        <Projects />
        <Games />
        <Skills />
        <Reviews />
        <Contact />
      </main>
    </>
  );
}

export default App;
