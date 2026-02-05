import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Games.css';

const games = [
  {
    id: 1,
    title: 'Chill Donations',
    description: 'A cool Roblox donation game I worked on',
    image: 'https://tr.rbxcdn.com/180DAY-3e9215f5558b05ffe0c861a960497623/768/432/Image/Webp/noFilter',
    role: 'Co-Owner',
    year: '2025-2026',
    platform: 'Roblox',
    robloxUrl: 'https://www.roblox.com/games/your-game-id',
  },
  {
    id: 2,
    title: 'Game Title 2',
    description: 'Another awesome project',
    image: 'https://via.placeholder.com/300x200',
    role: 'UI/UX Designer',
    year: '2025',
    platform: 'Roblox',
    robloxUrl: 'https://www.roblox.com/games/your-game-id',
  },
  {
    id: 3,
    title: 'Game Title 3',
    description: 'Collaborative game development',
    image: 'https://via.placeholder.com/300x200',
    role: 'Backend Developer',
    year: '2024',
    platform: 'Roblox',
  },
  {
    id: 4,
    title: 'Game Title 4',
    description: 'Fun multiplayer experience',
    image: 'https://via.placeholder.com/300x200',
    role: 'Scripter',
    year: '2024',
    platform: 'Roblox',
  },
];

export function Games() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="games" id="games">
      <div className="container">
        <div 
          ref={sectionRef}
          className={`games-content ${isVisible ? 'visible' : ''}`}
        >
          <div className="games-header">
            <span className="section-eyebrow">Portfolio</span>
            <h2 className="section-title">
              Games I've <span className="text-gradient">Worked On</span>
            </h2>
            <p className="section-description">
              A collection of Roblox games I've contributed to, showcasing various skills from development to design.
            </p>
          </div>

          <div className="games-scroll-container">
            <div className="games-scroll">
              {[...games, ...games].map((game, index) => (
                <article key={`${game.id}-${index}`} className="game-card glass-card">
                  <div className="game-image">
                    <img src={game.image} alt={game.title} />
                  </div>
                  <div className="game-content">
                    <div className="game-meta">
                      <span className="game-role">{game.role}</span>
                      <div className="game-meta-right">
                        <span className="game-platform">{game.platform}</span>
                        <span className="game-year">{game.year}</span>
                      </div>
                    </div>
                    <h3 className="game-title">{game.title}</h3>
                    <p className="game-description">{game.description}</p>
                    {game.robloxUrl && (
                      <a 
                        href={game.robloxUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="game-roblox-link"
                      >
                        <img src="/assets/roblox.png" alt="Roblox" className="roblox-icon" />
                        <span className="roblox-text">View on Roblox</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
                          <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
