import './Hero.css';

export function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-content">

        <h1 className="hero-title">
          <span className="title-small">Hello, I'm</span>
          <span className="title-large">
            <span className="text-gradient">emielsterdev</span>
          </span>
        </h1>
        
        <p className="hero-description">
          Hello there! Welcome to my portfolio! Want to have a helping hand for your personal projects?
          I'm emielsterdev, and I can definitely help with that. Feel free to explore my portfolio and reach out to me! :)
          </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={scrollToProjects}>
            View My Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
          <button className="btn btn-outline">
            Contact Me
          </button>
        </div>
      </div>


    </section>
  );
}