import './Hero.css';

export function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-profile">
          <img src="https://yt3.ggpht.com/rNAeF1dwJbnf8L6B1SS_iwQJkeKLfGY7OfZxaGsOzoiIhdHoHmLXgMJQ5N9rauTgMrkdU3Emuw=s600-c-k-c0x00ffffff-no-rj-rp-mo" alt="emielsterdev" className="profile-image" />
        </div>
        
        <h1 className="hero-title">
          <span className="title-small">Hey, I'm</span>
          <span className="title-large">
            <span className="text-gradient">emielsterdev</span>
          </span>
        </h1>
        
        <p className="hero-description">
          A developer focused on creating beginner-friendly yet powerful tools for Roblox. 
          I build projects that balance simplicity with advanced capabilities. Any questions? Don't hesitate to reach out :)
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={scrollToProjects}>
            View My Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
          <button className="btn btn-outline" onClick={scrollToContact}>
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
}
