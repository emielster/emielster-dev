import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Skills.css';

const skills = [
  { name: 'Backend Development', icon: '⚙️', description: 'Backend Development can be annoying. That`s why its useful to have someone who does it for you.' },
  { name: 'Roblox UI/UX Design', icon: '✨', description: 'Want fresh looking UI for your game? You`re in luck, because I specialize in that.' },
  { name: 'Roblox Plugin Design', icon: '📦', description: 'I can design tools to help others, because nothing is better than a tool that can save you hours of a headache.' },
  { name: 'Roblox GFX', icon: '💖', description: 'Game`s need to stand out. Thats where GFX thumbnails comes in clutch!' },
  { name: 'Roblox Scripter', icon: '📝', description: 'I have expierience with advanced Luau, Rojo, and lots of other professional tools.' },
];

const technologies = [
  'Lua(u)', 'Pulsar', 'Fusion', 'React', 'TypeScript', 'Three.js',
  'Rojo', 'Git', 'Node.js', 'Figma', 'Blender', 'Photoshop'
];

export function Skills() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="skills" id="skills">
      <div className="container">
        <div 
          ref={sectionRef}
          className={`skills-content ${isVisible ? 'visible' : ''}`}
        >
          <div className="skills-header">
            <span className="section-eyebrow">What I Do</span>
            <h2 className="section-title">
              Skills & <span className="text-gradient">Expertise</span>
            </h2>
            <p className="section-description">
                                  Every project is a chance to learn, innovate, and make something that matters. My goal is to combine creativity and technical skill to deliver experiences that are both functional and inspiring.

            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="skill-card glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="skill-icon">{skill.icon}</div>
                <h3 className="skill-name">{skill.name}</h3>
                <p className="skill-description">{skill.description}</p>
                <div className="skill-glow" />
              </div>
            ))}
          </div>

          <div className="tech-stack">
            <h3 className="tech-title">Technologies I Work With</h3>
            <div className="tech-grid">
              {technologies.map((tech, index) => (
                <span 
                  key={tech} 
                  className="tech-tag glass"
                  style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
