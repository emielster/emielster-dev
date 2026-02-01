import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'Neutron',
    description: 'A fully-modernized Roblox terminal for your comfort, while also allowing collaboration. It uses Pulsar as main language.',
    tags: ['Lua(u)', 'Fusion', 'Pulsar'],
    year: '2026',
  },
  {
    id: 2,
    title: 'Pulsar',
    description: 'Ever wanted to write C++ styled code inside Roblox? Now you can!',
    tags: ['Raw Lua(u)'],
    year: '2025',
  },

];

export function Projects() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.1);

return (
    <section className="projects" id="projects">
      <div className="container">
          <div 
            ref={sectionRef}
            className={`projects-content ${isVisible ? 'visible' : ''}`}
          >
          <div className="projects-header">
            <span className="section-eyebrow">Selected Work</span>
            <h2 className="section-title">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="section-description">
            I try to make projects beginner-friendly, whilst also allowing more advanced developers to be satisfied.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <article 
                key={project.id}
                className="project-card glass-card"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <div className="project-number">
                  {String(project.id).padStart(2, '0')}
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span className="project-year">{project.year}</span>
                    <div className="project-tags">
                      {project.tags.map(tag => (
                        <span key={tag} className="project-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <a href="#" className="project-link">
                    View Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
