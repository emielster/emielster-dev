import { useState, useRef, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Skills.css';

interface Skill {
  name: string;
  description: string;
  experience: number;
  logo?: string; 
}

interface SkillGroup {
  title: string;
  icon: string;
  expLabel: string;
  expPct: number;
  color: string;
  skills: Skill[];
}

const LOGOS = {
  cpp:    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  vulkan: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Vulkan.svg',
  opengl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Opengl-logo.svg',
  glsl:   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opengl/opengl-original.svg',
  figma:  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  blender:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg',
  git:    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
};

const skillGroups: SkillGroup[] = [
  {
    title: 'Roblox Development',
    icon: '🎮',
    expLabel: 'Really advanced',
    expPct: 85,
    color: '#D85A30',
    skills: [
      { name: 'UI/UX Design',      description: 'Fresh-looking, polished interfaces for Roblox games using Fusion & React.', experience: 90 },
      { name: 'Scripter (Luau)',   description: 'Advanced Luau scripting with professional tooling like Rojo.',               experience: 85 },
      { name: 'Plugin Development',description: 'Custom editor tools that save hours of repetitive work.',                   experience: 75 },
      { name: 'GFX & Thumbnails',  description: 'Eye-catching game thumbnails and promotional graphics in Blender & Photoshop.', experience: 70 },
    ],
  },
  {
    title: 'Graphical Programming',
    icon: '🖥️',
    expLabel: 'Beginner',
    expPct: 25,
    color: '#378ADD',
    skills: [
      { name: 'OpenGL',      description: 'Coordinate systems, MVP matrices, lighting (Phong), depth/stencil buffers, culling...', experience: 65, logo: LOGOS.opengl },
      { name: 'Vulkan',      description: 'Still learning: validation layers, extensions, heading for a triangle.',                experience: 30, logo: LOGOS.vulkan },
      { name: 'GLSL Shaders',description: 'Vertex, fragment & geometry shaders, uniforms, and the graphics pipeline.',            experience: 50, logo: LOGOS.glsl   },
    ],
  },
  {
    title: 'Web Development',
    icon: '🌐',
    expLabel: 'Okay',
    expPct: 35,
    color: '#1D9E75',
    skills: [
      { name: 'Backend Development',    description: 'Server-side logic, APIs and infrastructure: so you don\'t have to.', experience: 70, logo: LOGOS.nodejs },
      { name: 'HTML & CSS & JavaScript',description: 'I understand basic CSS along with some HTML and JavaScript.',        experience: 60 },
    ],
  },
  {
    title: 'Design & Tools',
    icon: '🎨',
    expLabel: 'Proficient',
    expPct: 65,
    color: '#7F77DD',
    skills: [
      { name: 'Figma',     description: 'UI design, prototyping and design systems.',                          experience: 70, logo: LOGOS.figma   },
      { name: 'Blender',   description: '3D modelling and rendering for GFX work.',                           experience: 60, logo: LOGOS.blender },
      { name: 'Photoshop', description: 'Image editing and compositing for thumbnails and assets.',           experience: 65 },
      { name: 'Git',       description: 'Version control, branching and collaborative workflows.',            experience: 72, logo: LOGOS.git     },
    ],
  },
  {
    title: 'Hardware & Low-Level Coding',
    icon: '⚙️',
    expLabel: 'Intermediate',
    expPct: 55,
    color: '#BA7517',
    skills: [
      { name: 'Assembly', description: 'Basic assembly instructions, to understand low-level code.',              experience: 55 },
      { name: 'C++',      description: 'My favorite language for graphics and performance-critical work.',        experience: 80, logo: LOGOS.cpp },
    ],
  },
];

const technologies = [
  'Lua(u)', 'Fusion', 'Pulsar', 'Rojo', 'Git', 'Figma', 'Blender', 'Photoshop', 'GLSL', 'Vulkan',
];

function pairGroups(groups: SkillGroup[]): [SkillGroup, SkillGroup | null][] {
  const pairs: [SkillGroup, SkillGroup | null][] = [];
  for (let i = 0; i < groups.length; i += 2) {
    pairs.push([groups[i], groups[i + 1] ?? null]);
  }
  return pairs;
}

function SkillCard({
  group,
  isOpen,
  onToggle,
  animateIn,
  delay,
}: {
  group: SkillGroup;
  isOpen: boolean;
  onToggle: () => void;
  animateIn: boolean;
  delay: number;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`skill-group glass-card ${animateIn ? 'skill-group--visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="skill-group-header" onClick={onToggle}>
        <div className="skill-group-left">
          <span className="skill-group-icon">{group.icon}</span>
          <span className="skill-group-title">{group.title}</span>
        </div>
        <div className="skill-group-meta">
          <span className="skill-group-exp-label">{group.expLabel}</span>
          <div className="skill-group-bar">
            <div
              className="skill-group-bar-fill"
              style={{ width: animateIn ? `${group.expPct}%` : '0%', background: group.color }}
            />
          </div>
          <span
            className="skill-group-chevron"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▼
          </span>
        </div>
      </div>

      <div
        ref={bodyRef}
        className="skill-group-body-animated"
        style={{ height: `${height}px` }}
      >
        <div className="skill-group-body-inner">
          {group.skills.map((skill, si) => (
            <div
              key={skill.name}
              className="skill-item"
              style={{ transitionDelay: `${si * 0.05}s` }}
            >
              {skill.logo ? (
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="skill-logo"
                  width={22}
                  height={22}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="skill-dot" style={{ background: group.color }} />
              )}
              <div className="skill-info">
                <p className="skill-name">{skill.name}</p>
                <p className="skill-desc">{skill.description}</p>
                <div className="skill-exp-row">
                  <div className="skill-exp-bar">
                    <div
                      className="skill-exp-fill"
                      style={{ width: `${skill.experience}%`, background: group.color }}
                    />
                  </div>
                  <span className="skill-exp-txt">{skill.experience}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.15);
  const [openRows, setOpenRows] = useState<Set<number>>(new Set());

  const toggleRow = (rowIndex: number) => {
    setOpenRows(prev => {
      const next = new Set(prev);
      next.has(rowIndex) ? next.delete(rowIndex) : next.add(rowIndex);
      return next;
    });
  };

  const pairs = pairGroups(skillGroups);

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
              Every project is a chance to learn, innovate, and make something that matters.
              My goal is to combine creativity and technical skill to deliver experiences
              that are both functional and inspiring.
            </p>
          </div>

          <div className="skill-groups-grid">
            {pairs.map(([left, right], rowIndex) => {
              const isOpen = openRows.has(rowIndex);
              const delay = rowIndex * 0.1;
              return (
                <>
                  <SkillCard
                    key={left.title}
                    group={left}
                    isOpen={isOpen}
                    onToggle={() => toggleRow(rowIndex)}
                    animateIn={isVisible}
                    delay={delay}
                  />
                  {right ? (
                    <SkillCard
                      key={right.title}
                      group={right}
                      isOpen={isOpen}
                      onToggle={() => toggleRow(rowIndex)}
                      animateIn={isVisible}
                      delay={delay + 0.05}
                    />
                  ) : (
                    <div key="spacer" />
                  )}
                </>
              );
            })}
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