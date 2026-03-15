import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './About.css';

const skills = [
  'Roblox Luau', 'HTML', 'JavaScript', 'Python', 'C++',  'Roblox UI', 'Roblox Animating', 'Roblox GFX',
];

export function About() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="about" id="about">
      <div className="container">
        <div 
          ref={sectionRef} 
          className={`about-content ${isVisible ? 'visible' : ''}`}
        >
          <div className="about-grid">
            <div className="about-info">
              <span className="section-eyebrow">About</span>
              <h2 className="about-title">
                I'm a <span className="text-gradient">creator and problem solver</span>. 
              </h2>
              <div className="about-text">
                <p>
                  I build worlds, websites, and tools: whether it's crafting experiences in Roblox Studio, developing scalable web apps, or experimenting with Python and C++. I love turning ideas into reality and constantly pushing the boundaries of what technology can do.
                </p>
                <p>
                    Every project is a chance to learn, innovate, and make something that matters. My goal is to combine creativity and technical skill to deliver experiences that are both functional and inspiring.
                </p>
              </div>
            </div>

            <div className="about-skills">
              <h3 className="skills-title">Technologies</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <span 
                    key={skill} 
                    className="skill-tag glass"
                    style={{ '--delay': `${index * 0.05}s` } as React.CSSProperties}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
