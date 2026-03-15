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
    robloxUrl: 'https://www.roblox.com/games/139490463821898/Chill-donations',
  },
  {
    id: 2,
    title: 'Donate For Time',
    description: 'Another donation game :d',
    image: 'https://tr.rbxcdn.com/180DAY-fa4b4ccdeb0c8337e589eccca959e847/768/432/Image/Png/noFilter',
    role: 'Owner/Creator',
    year: '2025',
    platform: 'Roblox',
    robloxUrl: 'https://www.roblox.com/games/82258001680556/Donate-For-Time',
  },
  {
    id: 3,
    title: 'Justified Jump',
    description: 'My first Unity game',
    image: 'https://placehold.co/600x400?text=Justified+Jump',
    role: 'Owner/Creator',
    year: '2020',
    platform: 'Unity',
    robloxUrl: 'https://unityemiel.itch.io/justified-jump',
  },
  {
    id: 4,
    title: 'Hovers RNG',
    description: 'Fun RNG game for Roblox!',
    image: 'https://placehold.co/600x400?text=Hovers+RNG',
    role: 'Creator/Developer',
    year: '2023',
    platform: 'Roblox',
    robloxUrl: 'https://www.roblox.com/games/17302628846/hovers-rng',
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
                        <span className="roblox-text">View</span>
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
