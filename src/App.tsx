import { SpaceScene } from './components/SpaceScene';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Skills } from './components/Skills';
import './index.css';

function App() {
  return (
    <>
      <SpaceScene />
      <div className="dotted-overlay" />
      <Navigation />
      <main className="content">
        <Hero />
        <Projects />
        <Skills />
      {/*  <About /> */}
        <Contact />
      </main>
    </>
  );
}

export default App;
